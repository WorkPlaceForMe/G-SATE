#!/usr/bin/env python2.7
'''
@author: Zheng Dunyuan
@company: Graymatics
@contact: dunyuan@graymatics.com
@description: scripts for triggering the process of the Face Recognition
@time: 2019/01/30
@platform: python3.5
'''
import socket
import os
import sys
import struct
import time
import argparse
from parser import Read_Parameters

params = Read_Parameters("Settings.config")

HOST = params["HOST"]
PORT = int(params["PORT"]) # Port for sending the files
HEAD_STRUCT = "128sq"


def parse_args():
    parser = argparse.ArgumentParser(description="Manage purpose of server call")
    parser.add_argument("-t","--train", help="Purpose: train",dest='action', action='store_const', const='train') 
    #dest - The name of the attribute to be added to the object returned by parse_args().
    parser.add_argument("-fr", "--face_recognition", help="Purpose: start facial recognition", dest='action', action='store_const', const="face_recognition")
    parser.add_argument("-k", "--kill_fr", help="Purpose: stop facial recognition", dest='action', action='store_const', const="kill_fr")
    return parser


def send_exit():
    sock_text = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock_text.connect((HOST, PORT))
        data = b"exit"
        sock_text.send(data)
    except socket.error as e:
        print("Socket error: %s" % str(e))
    finally:
        sock_text.close()

def send_clear(parser):
    sock_text = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    reply = ""
    try:
        print(HOST, PORT)
        sock_text.connect((HOST, PORT))
        purpose = vars(parser.parse_args())['action']
        if purpose == "train":
            data = b"train"
            sock_text.send(data)
            # print "sent"
            reply = sock_text.recv(1024)
            # print "received"
        elif purpose == "face_recognition":
            # the string "data"
            data = b"start_fr"
            sock_text.send(data)
        elif purpose == "kill_fr":
            data = b"stop_fr"
            sock_text.send(data)
    except socket.error as e:
        print("Socket error: %s" % str(e))
    finally:
        print("reply is {}".format(reply))
        sock_text.close()

if __name__ == '__main__':
    parser = parse_args()
    send_clear(parser) 
    
    # send_exit()
