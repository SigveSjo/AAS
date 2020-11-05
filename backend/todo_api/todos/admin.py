from django.contrib import admin

# Register your models here.
from .models import Todo, Command

admin.site.register(Todo)
admin.site.register(Command)