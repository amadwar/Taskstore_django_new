from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields=["name","role"]

class Groupserializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields=["name","members"]

class Taskserializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields=["id","type","title","description","due_date","create_date","modification_date","assigned_user","assigned_group","created_by","modified_by","status"]


#class Taskserializers(serializers.HyperlinkedModelSerializer):
    #assigned_user = serializers.SerializerMethodField()
    #assigned_group = serializers.SerializerMethodField()
    #created_by = serializers.SerializerMethodField()
    #modified_by = serializers.SerializerMethodField()

    #class Meta:
        #model = Task
        #fields = ['id', 'type', 'title', 'description', 'due_date', 'assigned_user', 'assigned_group', 'created_by', 'modified_by', 'status']

    #def get_assigned_user_id(self, obj):
        #return obj.assigned_user

    #def get_assigned_group_id(self, obj):
        #return obj.assigned_group

    #def get_created_by_id(self, obj):
        #return obj.created_by

    #def get_modified_by_id(self, obj):
        #return obj.modified_by




class TaskListserializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TaskList
        fields=["id","type","label","tasks"]

class Boradserializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Board
        fields=["name","columns"]
