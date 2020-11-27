from django.db import models

class Command(models.Model):
    command = models.CharField(max_length=300)

    def __str__(self):
        return self.command