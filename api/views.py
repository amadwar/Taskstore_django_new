from django.shortcuts import render
from api.models import Task,User,Group,TaskList,Board 
from rest_framework import serializers,viewsets
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .serializers import *
#serializers




# Viewsets




class UserViewset(viewsets.ModelViewSet):
    permission_classes=[permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer



class TaskViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Task.objects.all()
    serializer_class = Taskserializers

class TaskListViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TaskList.objects.all()
    serializer_class = TaskListserializers

class GroupViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Group.objects.all()
    serializer_class = Groupserializers

class BoardViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Board.objects.all()
    serializer_class = Boradserializers
