#!/usr/bin/env python2
# Copyright (c) 2015-2016, NVIDIA CORPORATION.  All rights reserved.

"""
Classify an image using individual model files

Use this script as an example to build your own tool

$ python video.py --caffemodel models_digits/20191203-100346-482e_epoch_100.0/snapshot_iter_38600.caffemodel --deploy_file models_digits/20191203-100346-482e_epoch_100.0/deploy.prototxt --input test_4.mp4 --output output.mp4

Do $ pip install moviepy if you don't have.

"""

import argparse
import os
import time


from google.protobuf import text_format
import numpy as np
import cv2
from moviepy.editor import VideoFileClip

import scipy.misc
os.environ['GLOG_minloglevel'] = '2' # Suppress most caffe output

import caffe
from caffe.proto import caffe_pb2

def get_net(caffemodel, deploy_file, use_gpu=True):
    """
    Returns an instance of caffe.Net

    Arguments:
    caffemodel -- path to a .caffemodel file
    deploy_file -- path to a .prototxt file

    Keyword arguments:
    use_gpu -- if True, use the GPU for inference
    """
    if use_gpu:
        caffe.set_mode_gpu()

    # load a new model
    return caffe.Net(deploy_file, caffemodel, caffe.TEST)

def get_transformer(deploy_file, mean_file=None):
    """
    Returns an instance of caffe.io.Transformer

    Arguments:
    deploy_file -- path to a .prototxt file

    Keyword arguments:
    mean_file -- path to a .binaryproto file (optional)
    """
    network = caffe_pb2.NetParameter()
    with open(deploy_file) as infile:
        text_format.Merge(infile.read(), network)

    if network.input_shape:
        dims = network.input_shape[0].dim
    else:
        dims = network.input_dim[:4]

    t = caffe.io.Transformer(
            inputs = {'data': dims}
            )
    t.set_transpose('data', (2,0,1)) # transpose to (channels, height, width)

    # color images
    if dims[1] == 3:
        # channel swap
        t.set_channel_swap('data', (2,1,0))

    if mean_file:
        # set mean pixel
        with open(mean_file,'rb') as infile:
            blob = caffe_pb2.BlobProto()
            blob.MergeFromString(infile.read())
            if blob.HasField('shape'):
                blob_dims = blob.shape
                assert len(blob_dims) == 4, 'Shape should have 4 dimensions - shape is "%s"' % blob.shape
            elif blob.HasField('num') and blob.HasField('channels') and \
                    blob.HasField('height') and blob.HasField('width'):
                blob_dims = (blob.num, blob.channels, blob.height, blob.width)
            else:
                raise ValueError('blob does not provide shape or 4d dimensions')
            pixel = np.reshape(blob.data, blob_dims[1:]).mean(1).mean(1)
            t.set_mean('data', pixel)

    return t

def resize_img(image, height, width):
    """
    Resizes the image to detectnet inputs

    Arguments:
    image -- a single image
    height -- height of the network input
    width -- width of the network input
    """
    image = np.array(image)
    image = scipy.misc.imresize(image, (height, width), 'bilinear')
    return image

def draw_bboxes(image, locations):
    """
    Draws the bounding boxes into an image

    Arguments:
    image -- a single image already resized
    locations -- the location of the bounding boxes
    """
    for left,top,right,bottom,confidence in locations:
        if confidence==0:
            continue
        cv2.rectangle(image,(left,top),(right,bottom),(255,0,0),3)
    #cv2.imwrite('bbox.png',image)#test on a single image
    return image

def forward_pass(image, net, transformer, batch_size=None):
    """
    Returns scores for each image as an np.ndarray (nImages x nClasses)

    Arguments:
    image -- a list of np.ndarrays
    net -- a caffe.Net
    transformer -- a caffe.io.Transformer

    Keyword arguments:
    batch_size -- how many images can be processed at once
        (a high value may result in out-of-memory errors)
    """
    if batch_size is None:
        batch_size = 1

    caffe_images = []

    if image.ndim == 2:
        caffe_images.append(image[:,:,np.newaxis])
    else:
        caffe_images.append(image)

    dims = transformer.inputs['data'][1:]

    scores = None
    for chunk in [caffe_images[x:x+batch_size] for x in xrange(0, len(caffe_images), batch_size)]:
        new_shape = (len(chunk),) + tuple(dims)
        if net.blobs['data'].data.shape != new_shape:
            net.blobs['data'].reshape(*new_shape)
        for index, image in enumerate(chunk):
            image_data = transformer.preprocess('data', image)
            net.blobs['data'].data[index] = image_data
        start = time.time()
        output = net.forward()[net.outputs[-1]]
        end = time.time()
        if scores is None:
            scores = np.copy(output)
        else:
            scores = np.vstack((scores, output))
        print( 'Processed %s/%s images in %f seconds ...' % (len(scores), len(caffe_images), (end - start)) )

    return scores

def classify(caffemodel, deploy_file, image,
        mean_file=None, batch_size=None, use_gpu=True):
    """
    Classify some images against a Caffe model and print the results

    Arguments:
    caffemodel -- path to a .caffemodel
    deploy_file -- path to a .prototxt
    image_files -- list of paths to images

    Keyword arguments:
    mean_file -- path to a .binaryproto
    use_gpu -- if True, run inference on the GPU
    """
    # Load the model
    net = get_net(caffemodel, deploy_file, use_gpu)
    transformer = get_transformer(deploy_file, mean_file)
    _, channels, height, width = transformer.inputs['data']
    if channels == 3:
        mode = 'RGB'
    elif channels == 1:
        mode = 'L'
    else:
        raise ValueError('Invalid number for channels: %s' % channels)

    image = resize_img(image,height,width)

    # Classify the image
    scores = forward_pass(image, net, transformer, batch_size=batch_size)

    ### Process the results
    
    # Format of scores is [ batch_size x max_bbox_per_image x 5 (xl, yt, xr, yb, confidence) ]
    # https://github.com/NVIDIA/caffe/blob/v0.15.13/python/caffe/layers/detectnet/clustering.py#L81
    for i, image_results in enumerate(scores):
        #print '==> Image #%d' % i
        img_result = draw_bboxes(image,image_results)
    # This line is optinal, in this case we resize to the size of the original input video, can be removed
    #img_result = resize_img(img_result,720,1280)
    return img_result

def detect_car(image):
    """
    Runs our pipeline given a single image and returns another one with the bounding boxes drawn

    Arguments:
    image -- cv2 image file
    """
    result = classify(args['caffemodel'], args['deploy_file'], image,
            args['mean'], args['batch_size'], not args['nogpu'])
    return result

if __name__ == '__main__':
    global args
    script_start_time = time.time()

    parser = argparse.ArgumentParser(description='DetectNet - DIGITS')

    ### Positional arguments

    parser.add_argument('--caffemodel',   help='Path to a .caffemodel')
    parser.add_argument('--deploy_file',  help='Path to the deploy file')
    parser.add_argument('--input',   help='Path to a video')
    parser.add_argument('--output',   help='Path to output video name')

    ### Optional arguments

    parser.add_argument('-m', '--mean', help='Path to a mean file (*.npy)')
    parser.add_argument('--batch-size', type=int)
    parser.add_argument('--nogpu',
            action='store_true',
            help="Don't use the GPU")
 
    args = vars(parser.parse_args())

    project_output = args['output']
    clip1 = VideoFileClip(args['input']);
    white_clip = clip1.fl_image(detect_car)
    white_clip.write_videofile(project_output, audio=False);

    print( 'Video took %f seconds.' % (time.time() - script_start_time) )