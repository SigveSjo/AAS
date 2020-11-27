from django.shortcuts import render

from rest_framework import generics, viewsets

from .models import Command
from .serializers import CommandSerializer

class CommandViewSet(viewsets.ModelViewSet):
    queryset = Command.objects.all()
    serializer_class = CommandSerializer