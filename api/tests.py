from django.test import TestCase
from django.test import TestCase
from .models import Task
from .serializers import Taskserializers

# Create your tests here.
class TaskSerializerTestCase(TestCase):
    def setUp(self):
       self.task_data = {
            'type': 'Feature',
            'title': 'New feature',
            'description': 'Add a new feature to the system',
            'due_date': '2023-03-03',
            'assigned_user': 'http://127.0.0.1:8000/api/staff/1/', # change the link to id
            'assigned_group': 'http://127.0.0.1:8000/api/group/1/', # change the link to id
            'created_by': 'http://127.0.0.1:8000/api/staff/1/', # change the link to id
            'modified_by':'http://127.0.0.1:8000/api/staff/1/', # change the link to id
            'status': 'new' 
        }

    def test_task_serializer(self):
        
        serializer = Taskserializers(data=self.task_data)
        if serializer.is_valid():
        
          task = serializer.save()
          self.assertEqual(task.type, 'Feature')
          self.assertEqual(task.title, 'New feature')
          self.assertEqual(task.description, 'Add a new feature to the system')
          self.assertEqual(task.due_date, '2023-03-03')
          self.assertEqual(task.assigned_user,'http://127.0.0.1:8000/api/staff/1/') # check the ID of the user
          self.assertEqual(task.assigned_group, 'http://127.0.0.1:8000/api/group/1/') # check the ID of the group
          self.assertEqual(task.created_by, 'http://127.0.0.1:8000/api/staff/1/') # check the ID of the user
          self.assertEqual(task.modified_by, 'http://127.0.0.1:8000/api/staff/1/') # check the ID of the user
          self.assertEqual(task.status, 'new')
        else:
            print("ERROOOOR")


#class TaskTestCase(TestCase):
    #def setUp(self):
        #Task.assigned_user=0

    #def test_assgin_user(self):
        #self.assertEqual(Task.assigned_user,0)

