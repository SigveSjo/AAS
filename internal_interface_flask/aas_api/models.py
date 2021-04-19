from datetime import datetime
from aas_api import db

class Command(db.Model):
    command = db.Column(db.String(300), primary_key=True)

    def __repr__(self):
        return self.command

class Robot(db.Model):
    id = db.Column(db.String(100), primary_key=True, unique=True)
    name = db.Column(db.String(100))
    components = db.Column(db.String(10000))
    udp_url = db.Column(db.String(100))

    def __repr__(self):
        return self.id + " " + self.name + " components:" + str(self.components)