import datetime
import random
import asyncio
import threading
import time, math

from flask import Flask, Response, render_template
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
#from flash_socketio import SocketIO, emit
from .websocket import Websocket
from queue import Queue


aas_api = Flask(__name__)
aas_api.config.from_object(Config)
db = SQLAlchemy(aas_api)
migrate = Migrate(aas_api, db)
#socketio = SocketIO(aas_api)

from aas_api import routes, models

class Sender:
    def __init__(self):
        self.q = Queue()
        threading.Thread(target=self.incoming_data).start()

    def generate(self):
        for val in iter(self.q.get, None):
            yield val

    def incoming_data(self):
        while True:
            msg = input("Du er så jæla dum: ")
            self.q.put(msg)

    def response(self):
        return Response(self.generate(), mimetype='text/html')

sender = Sender()

@aas_api.route('/')
def index():
    return "Hello World!"

@aas_api.route('/stream')
def stream():
    return sender.response()

def main():
    #threading.Thread(target=incoming_data)
    #ws = Websocket("127.0.0.1", 5678)
    pass


main()
    