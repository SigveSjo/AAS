from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

aas_api = Flask(__name__)
aas_api.config.from_object(Config)
db = SQLAlchemy(aas_api)
migrate = Migrate(aas_api, db)

from aas_api import routes, models