from django.db import models

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title

class Command(models.Model):
    command = models.CharField(max_length=300)

    def __str__(self):
        return self.command