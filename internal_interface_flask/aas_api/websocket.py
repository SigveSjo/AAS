# import asyncio
# import websockets
# import janus
# from concurrent.futures import ThreadPoolExecutor

# class Websocket:
#     def __init__(self, ip_address, port):
#         self.loop = asyncio.get_event_loop()
#         start_server = websockets.serve(self.handler, ip_address, port)

#         self.loop.run_until_complete(start_server)
#         self.loop.run_forever()

#     async def consumer_handler(self, websocket, path):
#         async for message in websocket:
#             await self.consumer(message)

#     async def producer_handler(self, websocket, path):
#         while True:
#             message = await self.producer()
#             await websocket.send(message)
    
#     @asyncio.coroutine
#     def consumer(self, message):
#         print(message) 

#     @asyncio.coroutine
#     def producer(self):
#         message = "hey from producer"
#         return message
        

#     async def handler(self, websocket, path):
#         consumer_task = asyncio.ensure_future(self.consumer_handler(websocket, path))
#         #producer_task = asyncio.ensure_future(self.producer_handler(websocket, path))
#         done, pending = await asyncio.wait(
#             [consumer_task],
#             return_when=asyncio.FIRST_COMPLETED,
#         )
#         for task in pending:
#             task.cancel()