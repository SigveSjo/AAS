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
            self.myevgen.event.Message = ua.LocalizedText(response.data['command'])
            self.myevgen.trigger()
            print("Message sent!")
        except AttributeError:
            pass
        # Code to be executed for each request/response after
        # the view is called.

        return response

    def main(self):
        logging.basicConfig(level=logging.WARN)
        logger = logging.getLogger("opcua.server.internal_subscription")
        #logger.setLevel(logging.DEBUG)

        # setup our server
        server = Server()
        server.set_endpoint("opc.tcp://127.0.0.1:4840/freeopcua/server/")

        # setup our own namespace, not really necessary but should as spec
        uri = "http://examples.freeopcua.github.io"
        idx = server.register_namespace(uri)

        # get Objects node, this is where we should put our custom stuff
        objects = server.get_objects_node()

        # populating our address space
        myobj = objects.add_object(idx, "MyObject")

        # Creating a custom event: Approach 1
        # The custom event object automatically will have members from its parent (BaseEventType)
        etype = server.create_custom_event_type(idx, 'MyFirstEvent', ua.ObjectIds.BaseEventType, [('MyNumericProperty', ua.VariantType.Float), ('MyStringProperty', ua.VariantType.String)])

        self.myevgen = server.get_event_generator(etype, myobj)

        # Creating a custom event: Approach 2
        custom_etype = server.nodes.base_event_type.add_object_type(2, 'MySecondEvent')
        custom_etype.add_property(2, 'MyIntProperty', ua.Variant(0, ua.VariantType.Int32))
        custom_etype.add_property(2, 'MyBoolProperty', ua.Variant(True, ua.VariantType.Boolean))

        mysecondevgen = server.get_event_generator(custom_etype, myobj)

        # starting!
        server.start()