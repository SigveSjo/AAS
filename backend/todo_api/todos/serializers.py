# todos/serializers.py
from rest_framework import serializers
from .models import Todo, Command


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'title',
            'description',
        )
        model = Todo


class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'command',
        )
        model = Command