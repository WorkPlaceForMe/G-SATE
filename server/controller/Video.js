const {
    v4: uuidv4
} = require('uuid');
const fs = require('fs');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const Camera = require('../models/Camera');


let Video = {
    upload: function (req, res) {
        const stor = multer.diskStorage({
            // multers disk storage settings
            filename: function (req, file, cb) {
                const format = file.originalname.split('.')[1]
                const newName = file.originalname.split('.')[0] + '.' + format
                cb(null, newName)
            },
            destination: function (req, file, cb) {
                const where = `${process.env.resources2}/stored_videos/`
                if (!fs.existsSync(where)) {
                        fs.mkdirSync(where)
                }
                cb(null, where)
            }
        })
        const upVideo = multer({
            // multer settings
            storage: stor
        }).single('file')

        const uuid = uuidv4();
        upVideo(req, res, function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error_code: 1,
                    err_desc: err
                })
            } else {
                if (!req.file) {
                    return res.status(500).json({
                        success: false,
                        error_code: 1
                    })
                }
                let cam_id = uuidv4();
                ffmpeg.ffprobe(`${process.env.resources2}stored_videos/${req.file.originalname}`, function(err, metadata) {
                    //console.dir(metadata); // all metadata
                    let data = {
                        id: cam_id,
                        name: req.file.originalname.split('.')[0],
                        rtsp_in: `${process.env.resources2}stored_videos/${req.file.originalname}`,
                        rtsp_out: `/assets/shared-data/stored_videos/${req.file.originalname}`,
                        heatmap_pic: '',
                        pic_height: null,
                        pic_width: null,
                        cam_height: null,
                        cam_width: null,
                        stored_vid: 'Yes',
                        vid_length: `${new Date(metadata.format.duration * 1000).toISOString().substr(11, 8)}`
                    }
                    Camera.create(data, function(err, result) {
                        if(err) {
                            console.log('Error adding video to camera table : ', err);
                            res.status(500).json(err);
                        } else {
                            res.status(200).send({
                                success: true,
                                message: 'Stored video added successfully!',
                                id: cam_id,
                                name: req.file.originalname.split('.')[0]
                            })
                        }
                    });
                });
            }
        })
    }
}

module.exports = Video;