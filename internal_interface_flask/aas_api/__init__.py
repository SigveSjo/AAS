import datetime
import random
import asyncio
import logging
import threading
import time, math
import json
from io import BytesIO
from queue import Queue
#from .websocket import Websocket
from opcua import ua, Server, uamethod

# Flask
from flask import Flask, Response, render_template, request
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from flask_cors import CORS

# Video stream
from cv2 import cv2 as cv
import numpy as np
import base64


aas_api = Flask(__name__)
aas_api.config.from_object(Config)
db = SQLAlchemy(aas_api)
migrate = Migrate(aas_api, db)
socketio = SocketIO(aas_api, cors_allowed_origins="*")

from aas_api import routes, models

class Sender:
    def __init__(self, vs_queue):
        self.vs_queue = vs_queue

    def generate(self):
        for val in iter(self.vs_queue.get, None):
            yield val

    def response(self):
        return Response(self.generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

class Opcua:
    def __init__(self, vs_queue):
        self.vs_queue = vs_queue

        logging.basicConfig(level=logging.WARN)
        logger = logging.getLogger("opcua.server.internal_subscription")
        #logger.setLevel(logging.DEBUG)


        # setup our server with IP of the computer running the internal_interface
        with open("config.json", "r") as f:
            ip_dict = json.load(f)

        server = Server()
        server.set_endpoint("opc.tcp://" + ip_dict["OPCUA_URL"] + "/freeopcua/server/")

        # setup our own namespace, not really necessary but should as spec
        uri = "OPCUA_AAS_COMMUNICATION_SERVER"
        idx = server.register_namespace(uri)

        # get Objects node, this is where we should put our custom stuff
        objects = server.get_objects_node()

        # populating our address space
        myobj = objects.add_object(idx, "MyObject")
        status_node = myobj.add_method(idx, "update_status", self.update_status, [ua.VariantType.String], [ua.VariantType.Int64])
        image_node = myobj.add_method(idx, "update_frame", self.receive_image)
        #print(status_node)
        
        lbrEvent = server.create_custom_event_type(idx, 'LBREvent')
        kmpEvent = server.create_custom_event_type(idx, 'KMPEvent')

        self.lbrEvgen = server.get_event_generator(lbrEvent, myobj)
        self.kmpEvgen = server.get_event_generator(kmpEvent, myobj)

        # starting!
        server.start()

    @uamethod
    def receive_image(self, parent, bytes):        
        byte_frame = BytesIO(bytes)
        loaded_frame = np.load(byte_frame, allow_pickle=True)
        flag, encoded_image = cv.imencode(".jpg", loaded_frame)

        self.vs_queue.put((b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encoded_image) + b'\r\n'))

        # Show video feed
        # cv.imshow("WINDOW", loaded_frame)
        # cv.waitKey(1)
    
    @uamethod
    def update_status(self, parent, msg):
        pass

    def test_send(self):
        socketio.emit('status', "hey from server", broadcast=True)
        #loop = asyncio.get_running_loop()
        #loop.create_task(self.send_string())

    def send_string(self):
        while True:
            msg = input("Send something to the client: ")
            socketio.emit('status', msg, broadcast=True)

video_feed_queue = Queue()
sender = Sender(video_feed_queue)
middleware = Opcua(video_feed_queue)

@aas_api.route('/')
def index():
    return "Hello World!"

@aas_api.route('/stream')
def stream():
    return sender.response()

@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'})
    middleware.test_send()

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('click')
def receive_click(msg):
    print(msg)


aas_api.debug = True
    