"""
In case of python threading (which interferes with eventlet),
monkey patch to allow for evenlet-friendly versions.
"""
import eventlet
eventlet.monkey_patch()

from eventlet import wsgi
from aas_api import aas_api, socketio

wsgi.server(eventlet.listen(('127.0.0.1', 5000)), aas_api, log_output=True, debug=True)