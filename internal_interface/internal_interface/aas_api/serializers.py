# todos/serializers.py
from rest_framework import serializers
from .models import Command

class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'command',
        )
        model = Command