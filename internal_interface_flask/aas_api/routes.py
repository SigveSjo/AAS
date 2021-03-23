from aas_api import aas_api

@aas_api.route('/')
@aas_api.route('/index')
def index():
    return "Hello, World!"