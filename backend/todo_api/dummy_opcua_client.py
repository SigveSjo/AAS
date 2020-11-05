from opcua import ua, Client

class MinimalPublisher:
    def event_notification(self, event):
        print("New event recived: ", event.Message.Text)


minimal_publisher = MinimalPublisher()
""" OPC UA CLIENT """
opcua_client = Client("opc.tcp://127.0.0.1:4840/freeopcua/server/")
opcua_client.connect()
root = opcua_client.get_root_node()
obj = root.get_child(["0:Objects", "2:MyObject"])
myevent = root.get_child(["0:Types", "0:EventTypes", "0:BaseEventType", "2:MyFirstEvent"])
sub = opcua_client.create_subscription(100, minimal_publisher)
handle = sub.subscribe_events(obj, myevent)
""" OPC UA CLIENT END """