import json
from queue import Queue

# Flask
from flask import Flask, Response, render_template, request, jsonify
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from flask_cors import CORS

aas_api = Flask(__name__)
CORS(aas_api)
aas_api.config.from_object(Config)
db = SQLAlchemy(aas_api)
migrate = Migrate(aas_api, db)
socketio = SocketIO(aas_api, cors_allowed_origins="*")

from aas_api import models, server


"""
entry = models.Robot.query.filter_by(id="1").first()
db.session.delete(entry)
db.session.commit()
"""
with open("config.json", "r") as f:
    ip_dict = json.load(f)

video_feed_queue = Queue(maxsize=5)
sender = server.FrameProdCon(video_feed_queue)
middleware = server.OpcuaServer(ip_dict["OPCUA_URL"], socketio, db, video_feed_queue)

### ROUTES ###
@aas_api.route('/')
def index():
    return "Hello World!"

@aas_api.route('/api/robots')
def get_all_robots():
    robots = models.Robot.query.all()
    result = []
    for robot in robots:
        result.append({
            'rid': robot.id,
            'name': robot.name,
            'components': json.loads(robot.components),
            'udp_url': robot.udp_url,
            'stream_port': robot.stream_port
        })
    
    return { 'robots': result }

@aas_api.route('/api/robots/<rid>')
def get_specific_robot(rid):
    robot = models.Robot.query.filter_by(id=rid).first_or_404()

    return {
        'rid': robot.id,
        'name': robot.name,
        'components': json.loads(robot.components),
        'udp_url': robot.udp_url,
        'stream_port': robot.stream_port
    }

@aas_api.route('/api/robots/<rid>/video')
def get_robot_video_feed(rid):
    robot = models.Robot.query.filter_by(id=rid).first_or_404()
    ip_with_wrong_port = str(ip_dict["SERVER_URL"])
    ip = ip_with_wrong_port.split(":")[0]

    return {'url' : "http://" + ip + ":" + str(robot.stream_port)}

@aas_api.route('/api/availableport')
def get_available_port():
    port = models.StreamPort.query.filter_by(id="1").first_or_404()
    return {
        'port': port.available_port
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
    robot = models.Robot.query.filter_by(id=cmd['rid']).first_or_404()
    middleware.send_to_camera(cmd['camera_event'] + "," + cmd['rid'] + "," + robot.udp_url + "," + str(robot.stream_port))

@socketio.on('click')
def receive_click(msg):
    socketio.emit('event', msg, broadcast=True)
    print(request.headers)