from django.db import models
import uuid

class Command(models.Model):
    command = models.CharField(max_length=300)

    def __str__(self):
        return self.command

class Robot(models.Model):
    id = models.CharField(primary_key=True, max_length=100, editable=False, unique=True)
    name = models.CharField(max_length=100)
    lbr = models.BooleanField(default=False)
    kmp = models.BooleanField(default=False)

    def __str__(self):
        return self.id + " " + self.name + " lbr:" + self.lbr + " kmp:" + self.kmp