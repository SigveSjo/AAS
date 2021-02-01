from django.db import models

class Command(models.Model):
    command = models.CharField(max_length=300)

    def __str__(self):
        return self.command

class Robot(models.Model):
    robot_id = models.IntegerField(max_length=5)
    name = models.CharField(max_length=100)
    lbr = models.CharField(max_length=30)
    kmp = models.CharField(max_length=30)

    def __str__(self):
        return self.name