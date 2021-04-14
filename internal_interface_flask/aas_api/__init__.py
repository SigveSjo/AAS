import asyncio
import logging
import json
from io import BytesIO
from queue import Queue
from opcua import ua, Server, uamethod

# Flask
from flask import Flask, Response, render_template, request, jsonify
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
CORS(aas_api)
aas_api.config.from_object(Config)
db = SQLAlchemy(aas_api)
migrate = Migrate(aas_api, db)
socketio = SocketIO(aas_api, cors_allowed_origins="*")

from aas_api import routes, models

class Sender:
    def __init__(self, vf_queue):
        self.vf_queue = vf_queue

    def generate(self):
        for val in iter(self.vf_queue.get, None):
            yield val

    def response(self):
        return Response(self.generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

class Opcua:
    def __init__(self, vf_queue):
        self.vf_queue = vf_queue

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

        # add server methods
        status_node = myobj.add_method(idx, "update_status", self.update_status, [ua.VariantType.String], [ua.VariantType.Int64])
        #image_node = myobj.add_method(idx, "update_frame",  self.update_frame)
        
        lbrEvent = server.create_custom_event_type(idx, 'LBREvent')
        kmpEvent = server.create_custom_event_type(idx, 'KMPEvent')
        cameraEvent = server.create_custom_event_type(idx, 'CameraEvent')

        self.lbrEvgen = server.get_event_generator(lbrEvent, myobj)
        self.kmpEvgen = server.get_event_generator(kmpEvent, myobj)
        self.cameraEvgen = server.get_event_generator(cameraEvent, myobj)
        
        # starting!
        server.start()

    @uamethod
    async def update_frame(self, parent, bytes):     
        byte_frame = BytesIO(bytes)
        loaded_frame = np.load(byte_frame, allow_pickle=True)
        flag, encoded_image = cv.imencode(".jpg", loaded_frame)

        await self.vf_queue.put((b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encoded_image) + b'\r\n'))
    
    @uamethod
    def update_status(self, parent, msg):
        rid, robot, component, component_status = msg.split(':')

        """
            To facilitate the support for many different types of robots, 
            the Robot table cannot know about any specific components the robots
            might have (such as KMP or LBR). Therefore, the components and their
            statuses are stored in a serialized json object which grows for every 
            new component that is connected for a specific robot.
        """
        entry = models.Robot.query.filter_by(id=rid).first()
        if not entry:
            dump = {
                component: bool(int(component_status))
            }  

            new_robot = models.Robot(
                id=rid, 
                name=robot,
                components=json.dumps(dump)
            )

            db.session.add(new_robot)
        else:
            dump = json.loads(entry.components)
            dump[component] = bool(int(component_status))
            entry.components = json.dumps(dump)
        db.session.commit()

        jdata = json.dumps({
            'rid': rid,
            'robot': robot,
            'component': component,
            'component_status': bool(int(component_status))
        })
        socketio.emit('status', jdata, broadcast=True)

    def send_to_entity(self, cmd):
        command_splt = cmd.split(":")

        if command_splt[0] == "lbr":
            self.lbrEvgen.event.Message = ua.LocalizedText(command_splt[1])
            self.lbrEvgen.trigger()
            print("LBREvent sent!")
        elif command_splt[0] == "kmp":
            self.kmpEvgen.event.Message = ua.LocalizedText(command_splt[1])
            self.kmpEvgen.trigger()
            print("KMPEvent sent!")

    def send_to_camera(self, event):
        self.cameraEvgen.event.Message = ua.LocalizedText(event)
        self.cameraEvgen.trigger()
        print("CameraEvent sent!")

    def test_send(self):
        socketio.emit('event', "Hello from server", broadcast=True)
        

video_feed_queue = Queue(maxsize=5)
sender = Sender(video_feed_queue)
middleware = Opcua(video_feed_queue)

### ROUTES ###
@aas_api.route('/')
def index():
    return "Hello World!"

@aas_api.route('/api/robots/<rid>')
def get_specific_robot(rid):
    robot = models.Robot.query.filter_by(id=rid).first_or_404()

    return {
        'rid': robot.id,
        'name': robot.name,
        'components': json.loads(robot.components)
    }

@aas_api.route('/api/stream')
def stream():
    return sender.response()


### WEBSOCKET IMPLEMENTATION ###
@socketio.on('connect')
def connect():
    middleware.test_send()

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')

@socketio.on('command')
def receive_command(cmd):
    middleware.send_to_entity(cmd['command'])

@socketio.on('camera_event')
def receive_camera_event(cmd):
    middleware.send_to_camera(cmd['camera_event'])

@socketio.on('click')
def receive_click(msg):
    socketio.emit('event', msg, broadcast=True)
    print(request.headers)

    