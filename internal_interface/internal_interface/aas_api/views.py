from django.shortcuts import render

from rest_framework import generics, viewsets

from .models import Command, Robot
from .serializers import CommandSerializer, RobotSerializer

class CommandViewSet(viewsets.ModelViewSet):
    queryset = Command.objects.all()
    serializer_class = CommandSerializer

class RobotViewSet(viewsets.ModelViewSet):
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer