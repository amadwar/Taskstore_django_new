from django.contrib import admin
from api.models import Task,User,Group,TaskList,Board


   
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display=('name','role')

admin.site.register(User,UserAdmin)

#@admin.register(User)
#class UserAdmin(admin.ModelAdmin):
    #list_display=["name"]
    #search_fields=["name"]

#admin.site.register(User,UserAdmin)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display=["title"]
    search_fields=["title"]
@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display=["name"]
    search_fields=["name"]
@admin.register(TaskList)
class TaskListAdmin(admin.ModelAdmin):
    list_display=["label"]
    search_fields=["label"]
@admin.register(Board)
class TaskListAdmin(admin.ModelAdmin):
    list_display=["name"]
    search_fields=["name"]
