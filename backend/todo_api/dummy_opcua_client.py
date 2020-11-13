from opcua import ua, Client

class LBRPublisher:
    def event_notification(self, event):
        print("LBR event recived: ", event.Message.Text)

class KMPPublisher:
    def event_notification(self, event):
        print("KMP event recived: ", event.Message.Text)

""" OPC UA CLIENT """
opcua_client = Client("opc.tcp://0.0.0.0:4840/freeopcua/server/")
opcua_client.connect()
root = opcua_client.get_root_node()
obj = root.get_child(["0:Objects", "2:MyObject"])
lbr_event = root.get_child(["0:Types", "0:EventTypes", "0:BaseEventType", "2:LBREvent"])
kmp_event = root.get_child(["0:Types", "0:EventTypes", "0:BaseEventType", "2:KMPEvent"])

lbr_publisher = LBRPublisher()
lbr_sub = opcua_client.create_subscription(100, lbr_publisher)
lbr_sub.subscribe_events(obj, lbr_event)

kmp_publisher = KMPPublisher()
kmp_sub = opcua_client.create_subscription(100, kmp_publisher)
kmp_sub.subscribe_events(obj, kmp_event)
""" OPC UA CLIENT END """