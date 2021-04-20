import json
import logging

from opcua import ua, Server, uamethod
from aas_api import models

# Video stream
from cv2 import cv2 as cv
import numpy as np

class FrameProdCon:
    def __init__(self, vf_queue):
        self.vf_queue = vf_queue

    #Producer
    def generate(self):
        for val in iter(self.vf_queue.get, None):
            yield val

    #Consumer
    def response(self):
        return Response(self.generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

class OpcuaServer:
    def __init__(self, opcua_address, socketio, db, vf_queue):
        self.vf_queue = vf_queue
        self.socketio = socketio
        self.db = db

        logging.basicConfig(level=logging.WARN)
        logger = logging.getLogger("opcua.server.internal_subscription")
        #logger.setLevel(logging.DEBUG)

        server = Server()
        server.set_endpoint("opc.tcp://" + opcua_address + "/freeopcua/server/")

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
        rid, robot, component, component_status, *kwargs = msg.split(':')

        """
            To facilitate the support for many different types of robots, 
            the Robot table cannot know about any specific components the robots
            might have (such as KMP or LBR). Therefore, the components and their
            statuses are stored in a serialized json object which grows for every 
            new component that is connected for a specific robot.
        """
        entry = models.Robot.query.filter_by(id=rid).first()
        if not entry:
            port = models.StreamPort.query.filter_by(id="1").first()

            dump = {
                component: bool(int(component_status))
            } 

            new_robot = models.Robot(
                id=rid, 
                name=robot,
                components=json.dumps(dump),
                stream_port = port.available_port
            )

            if component == "camera":
                new_robot.udp_url = kwargs[0] + ":" + kwargs[1]

            port.available_port += 1

            self.db.session.add(new_robot)
        else:
            dump = json.loads(entry.components)
            dump[component] = bool(int(component_status))
            entry.components = json.dumps(dump)
            if component == "camera":
                entry.udp_url = kwargs[0] + ":" + kwargs[1]
            
        self.db.session.commit()

        jdata = json.dumps({
            'rid': rid,
            'robot': robot,
            'component': component,
            'component_status': bool(int(component_status))
        })
        self.socketio.emit('status', jdata, broadcast=True)

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
        self.socketio.emit('event', "Hello from server", broadcast=True)