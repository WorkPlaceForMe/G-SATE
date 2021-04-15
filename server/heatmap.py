#import numpy as np
import cv2
import argparse
import MySQLdb
# import socketio


# sio = socketio.Client()
# sio.connect('http://localhost:4444')


parser = argparse.ArgumentParser()
parser.add_argument("--host", type=str)
parser.add_argument("--ip", type=str)
parser.add_argument("--user", type=str)
parser.add_argument("--pwd", type=str)
parser.add_argument("--db", type=str)
parser.add_argument("--path", type=str)
parser.add_argument("--cameraid", type=str , default=False)
args = parser.parse_args()

db = MySQLdb.connect('{}'.format(args.host), '{}'.format(args.user), '{}'.format(args.pwd))
cursor = db.cursor()


cursor.execute('select id from {}.cameras'.format(args.db))
camid = cursor.fetchall()

m=0

if args.cameraid == False:

    for i in range(len(camid)):
        for j in range(len(camid[i])):
            cursor.execute('select rtsp_in fm {}.cameras where id=\"{}\"'.format(args.db,camid[i][j]))
            path = cursor.fetchall()
            path = path[0][0]
            print(path)
            print(camid[i][j])
            cursor.execute('select name from {}.cameras where id=\"{}\"'.format(args.db,camid[i][j]))
            name = cursor.fetchall()
            name = name[0][0]
            print(name)
            cap = cv2.VideoCapture(path) # video capture source camera (Here webcam of laptop)
            ret,frame = cap.read() # return a single frame in variable `frame`
            cv2.imwrite('{}heatmap_pics/{}_heatmap.jpg'.format(args.path,args.cameraid),frame) #save the file
            height=int(cap.get(4))
            width=int(cap.get(3))
            print(width)
            print(height)
            cursor.execute('update {}.cameras set pic_height = \"{}\" where id=\"{}\"'.format(args.db,height,camid[i][j]))
            # cursor.execute('update {}.cameras set heatmap_pic = "http://{}:6503/heatmap_pics/{}_heatmap.jpg" where id=\"{}\"'.format(args.db,args.ip,args.cameraid,camid[i][j]))
            cursor.execute('update {}.cameras set heatmap_pic = "/assets/shared-data/heatmap_pics/{}_heatmap.jpg" where id=\"{}\"'.format(args.db, args.cameraid,args.cameraid))
            cursor.execute('update {}.cameras set pic_width = \"{}\" where id=\"{}\"'.format(args.db,width,camid[i][j]))
            cursor.execute('update {}.cameras set cam_height = \"{}\" where id=\"{}\"'.format(args.db,height,camid[i][j]))
            cursor.execute('update {}.cameras set cam_width = \"{}\" where id=\"{}\"'.format(args.db,width,camid[i][j]))
            db.commit()
            cursor.fetchall()
#             sio.emit("wenaMax", "{} data saved".format(name),)
else:
    cursor.execute('select name from {}.cameras where id=\"{}\"'.format(args.db,args.cameraid))
    name = cursor.fetchall()
    name = name[0][0]
    print(name)
    cursor.execute('select rtsp_in from {}.cameras where id=\"{}\"'.format(args.db,args.cameraid))
    path = cursor.fetchall()
    path = path[0][0]
    print(path)
    cap = cv2.VideoCapture(path) # video capture source camera (Here webcam of laptop)
    ret,frame = cap.read() # return a single frame in variable `frame`
    cv2.imwrite('{}heatmap_pics/{}_heatmap.jpg'.format(args.path,args.cameraid),frame) #save the file
    height=int(cap.get(4))
    width=int(cap.get(3))
    print("image saved")
    print(height)
    print(width)
    cursor.execute('update {}.cameras set pic_height = \"{}\" where id=\"{}\"'.format(args.db,height,args.cameraid))
    # cursor.execute('update {}.cameras set heatmap_pic = "http://{}:6503/heatmap_pics/{}_heatmap.jpg" where id=\"{}\"'.format(args.db,args.ip,args.cameraid,args.cameraid))
    cursor.execute('update {}.cameras set heatmap_pic = "/assets/shared-data/heatmap_pics/{}_heatmap.jpg" where id=\"{}\"'.format(args.db, args.cameraid,args.cameraid))
    cursor.execute('update {}.cameras set pic_width = \"{}\" where id=\"{}\"'.format(args.db,width,args.cameraid))
    cursor.execute('update {}.cameras set cam_height = \"{}\" where id=\"{}\"'.format(args.db,height,args.cameraid))
    cursor.execute('update {}.cameras set cam_width = \"{}\" where id=\"{}\"'.format(args.db,width,args.cameraid))
    db.commit()
    cursor.fetchall()