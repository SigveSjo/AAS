from django.contrib import admin

from .models import  Command, Robot

admin.site.register(Command)
admin.site.register(Robot)