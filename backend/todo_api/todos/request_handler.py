import sys
sys.path.insert(0, "..")
import logging

from opcua import ua, Server

class RequestMiddleware:
    def __init__(self, get_response):
        self.main()
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)
        
        try:
            print(response.data['command'])

            command_splt = response.data['command'].split(":")

            if command_splt[0] == "lbr":
                self.lbrEvgen.event.Message = ua.LocalizedText(command_splt[1])
                self.lbrEvgen.trigger()
                print("LBREvent sent!")
            elif command_splt[0] == "kmp":
                self.kmpEvgen.event.Message = ua.LocalizedText(command_splt[1])
                self.kmpEvgen.trigger()
                print("KMPEvent sent!")


        except AttributeError:
            pass

        return response

    def main(self):
        logging.basicConfig(level=logging.WARN)
        logger = logging.getLogger("opcua.server.internal_subscription")
        #logger.setLevel(logging.DEBUG)

        # setup our server
        server = Server()
        server.set_endpoint("opc.tcp://0.0.0.0:4840/freeopcua/server/")

        # setup our own namespace, not really necessary but should as spec
        uri = "OPCUA_AAS_COMMUNICATION_SERVER"
        idx = server.register_namespace(uri)

        # get Objects node, this is where we should put our custom stuff
        objects = server.get_objects_node()

        # populating our address space
        myobj = objects.add_object(idx, "MyObject")
        
        lbrEvent = server.create_custom_event_type(idx, 'LBREvent')
        kmpEvent = server.create_custom_event_type(idx, 'KMPEvent')

        self.lbrEvgen = server.get_event_generator(lbrEvent, myobj)
        self.kmpEvgen = server.get_event_generator(kmpEvent, myobj)

        # starting!
        server.start()