from datetime import datetime
from aas_api import db, bcrypt

class Command(db.Model):
    command = db.Column(db.String(300), primary_key=True)

    def __repr__(self):
        return self.command

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    operator = db.Column(db.Boolean, nullable=False, default=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, username, password, operator=False, admin=False):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode() # with no set value for BCRYPT_LOG_ROUNDS, the default value of 12 is used. This value determines the complexity of the encryption.
        self.registered_on = datetime.now()
        self.operator = operator
        self.admin = admin

class Robot(db.Model):
    id = db.Column(db.String(100), primary_key=True, unique=True)
    name = db.Column(db.String(100))
    components = db.Column(db.String(10000))
    udp_url = db.Column(db.String(100))
    stream_port = db.Column(db.Integer)

    def __repr__(self):
        return self.id + " " + self.name + " components:" + str(self.components)

class StreamPort(db.Model):
    id = db.Column(db.String(100), primary_key=True, unique=True)
    available_port = db.Column(db.Integer)

    def __repr__(self):
        return self.id + " AvailablePort: " + self.available_port 