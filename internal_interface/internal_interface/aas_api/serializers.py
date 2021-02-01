# todos/serializers.py
from rest_framework import serializers
from .models import Command, Robot

class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'command',
        )
        model = Command

class RobotSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'robot_id',
            'name',
            'lbr',
            'kmp',
        )
        model = Robot