from django.db import models
from enum import Enum

# Create your models here.

class User(models.Model):
    id=models.AutoField(primary_key=True)
    name=models.CharField(unique=True,max_length=50)
    role=models.CharField(max_length=20)
    def __str__(self):
        return self.name


class Group(models.Model):
    id=models.AutoField(primary_key=True)
    name = models.CharField(unique=True,max_length=50)
    members = models.ManyToManyField(User,related_name='groups')
    def __str__(self):
        return self.name


class Task(models.Model):
    
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateField()
    create_date = models.DateTimeField(auto_now_add=True)
    modification_date = models.DateTimeField(auto_now_add=True)
    assigned_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    assigned_group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='assigned_tasks')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='modified_tasks')
    status = models.CharField(
        max_length=20,
        choices=[
            ('new', 'New'),
            ('in_progress', 'In Progress'),
            ('done', 'Done'),
            ('removed','Removed'),
        ]
    )
    def __str__(self):
        return self.title
    
    

class Board(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    columns = models.ManyToManyField('TaskList', related_name='boards')


class TaskList(models.Model):
    
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50)
    label = models.CharField(max_length=50)
    tasks = models.ManyToManyField('Task', related_name='task_lists')
    def __str__(self):
        return self.label




    
