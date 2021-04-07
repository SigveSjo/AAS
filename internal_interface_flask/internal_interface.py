"""
In case of python threading (which interferes with eventlet),
monkey patch to allow for evenlet-friendly versions.
"""
import eventlet
eventlet.monkey_patch()

from eventlet import wsgi
from aas_api import aas_api

wsgi.server(eventlet.listen(('', 5001)), aas_api)