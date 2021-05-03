"""
In case of python threading (which interferes with eventlet),
monkey patch to allow for evenlet-friendly versions.
Since python-opcua uses asyncio to handle multiprocessing, monkey patching
is necessary.
"""
import eventlet
eventlet.monkey_patch()

from eventlet import wsgi
from aas_api import aas_api, ip_dict

ip_split = ip_dict["SERVER_URL"].split(":")

wsgi.server(eventlet.listen((ip_split[0], int(ip_split[1]))), aas_api, log_output=True, debug=True)