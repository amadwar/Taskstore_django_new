from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields=["id","name","role"]


class Groupserializers(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(),many=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'members']
    
class Taskserializers(serializers.ModelSerializer):
    assigned_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    assigned_group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    modified_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Task
        fields = ["id","type","title","description","due_date","create_date","modification_date","assigned_user","assigned_group","created_by","modified_by","status"]
    

class TaskListserializers(serializers.ModelSerializer):
    tasks = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all(),many=True)
    class Meta:
        model = TaskList
        fields=["id","type","label","tasks"]

class Boradserializers(serializers.ModelSerializer):
    columns = serializers.PrimaryKeyRelatedField(queryset=TaskList.objects.all(),many=True)
    class Meta:
        model = Board
        fields=["id","name","columns"]
