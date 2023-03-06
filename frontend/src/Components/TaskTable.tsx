import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {User} from './User';
import { Group } from './Groups';

let documentCookie = document.cookie;

function getCookie(name: string): string | null {
  const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
  const match = cookieRegex.exec(documentCookie);
  if (match) {
    return match[1];
  }
  return null;
}

export interface Task {
  id: number;
  type: string;
  title: string;
  description: string;
  due_date: string;
  create_date: string;
  modification_date: string;
  assigned_user: number;//vorläufig änderung
  assigned_group:number;
  created_by: number;
  modified_by: number;
  status: TaskStatus;
}

enum TaskStatus {
  new = "new",
  in_progress = "in_progress",
  done = "done",
  removed = "removed"
}

function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get("http://localhost:8000/api/tasks/");
        setTasks(response.data);
        setIsLoading(false);
      } catch (error) {
        //setError(error);
        setIsLoading(false);
      }
    }
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:8000/api/staff/");
        setUsers(response.data);
      } catch (error) {
        //setError(error);
      }
    }
    async function fetchGroups() {
      try {
        const response = await axios.get("http://localhost:8000/api/group/");
        setGroups(response.data);
      } catch (error) {
        //setError(error);
      }
    }
    fetchTasks();
    fetchUsers();
    fetchGroups();
  }, []);

  const [formData, setFormData] = useState({   
    type: '',
    title: '',
    description: '',
    due_date: '',
    assigned_user: 0,
    assigned_group: 0,
    created_by: 0,
    modified_by: 0,
    status: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
const csrfToken = getCookie('csrftoken');
const response = await axios.post("http://localhost:8000/api/tasks/", formData, {
headers: {
'Content-Type': 'application/json',
'X-CSRFToken': csrfToken
}


});
setShowNotification(true);
setTimeout(() => setShowNotification(false), 3000);
console.log(formData);
setTasks([...tasks, response.data]);
} catch (error) {
console.error(error);
}
};

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
setFormData({
...formData,
[event.target.name]: event.target.value
});
};

const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({...formData,[event.target.name]: event.target.value});
    };

if (isLoading) {
return <p>Loading ...</p>;
}

return (
<div>
<h2>Add a Task</h2>
<form onSubmit={handleSubmit}>
<label>
Type:
<input type="text" name="type" value={formData.type} onChange={handleInputChange} />
</label>
<br />
<label>
Title:
<input type="text" name="title" value={formData.title} onChange={handleInputChange} />
</label>
<br />
<label>
Description:
<input type="text" name="description" value={formData.description} onChange={handleInputChange} />
</label>
<br />
<label>
Due Date:
<input type="date" name="due_date" value={formData.due_date} onChange={handleInputChange} />
</label>
<br />
<label>
Assigned User:
<select name="assigned_user" value={formData.assigned_user} onChange={handleSelectChange}>
<option value="">Select a user</option>
{users.map(user => (
<option key={user.id} value={user.id}>{user.name}</option>
))}
</select>
</label>
<br />
<label>
Assigned Group:
<select name="assigned_group" value={formData.assigned_group} onChange={handleSelectChange}>
<option value="">Select a group</option>
{groups.map(group => (
<option key={group.id} value={group.id}>{group.name}</option>
))}
</select>
</label>
<br />
<label>
created_by:
<select name="created_by" onChange={handleSelectChange} value={formData.created_by}>
<option value="0">Select User</option>
{users.map(user => (
<option key={user.id} value={user.id}>{user.name}</option>
))}
</select>
</label>
<br />
<label>
modified_by:
<select name="modified_by" onChange={handleSelectChange} value={formData.modified_by}>
<option value="0">Select User</option>
{users.map(user => (
<option key={user.id} value={user.id}>{user.name}</option>
))}
</select>
</label>
<br/>
<label>
Status:
<select name="status" value={formData.status} onChange={handleSelectChange}>
<option value="">Select a status</option>
<option value={TaskStatus.new}>{TaskStatus.new}</option>
<option value={TaskStatus.in_progress}>{TaskStatus.in_progress}</option>
<option value={TaskStatus.done}>{TaskStatus.done}</option>
<option value={TaskStatus.removed}>{TaskStatus.removed}</option>
</select>
</label>
<br />
{showNotification && <div className="notification">Changes saved successfully!</div>}
<button type="submit">Add Task</button>
</form>
<br />
<h3>Task List</h3>
{isLoading ? (
<div>Loading...</div>
) : error ? (
<div>{error}</div>
) : (
<table>
<thead>
<tr>
<th>ID</th>
<th>Type</th>
<th>Title</th>
<th>Description</th>
<th>Due Date</th>
<th>Create Date</th>
<th>Modification Date</th>
<th>Assigned User</th>
<th>Assigned Group</th>
<th>Created By</th>
<th>Modified By</th>
<th>Status</th>
</tr>
</thead>
<tbody>
{tasks.map(task => (
<tr key={task.id}>
<td>{task.id}</td>
<td>{task.type}</td>
<td>{task.title}</td>
<td>{task.description}</td>
<td>{task.due_date}</td>
<td>{task.create_date}</td>
<td>{task.modification_date}</td>
<td>{task.assigned_user}</td>
<td>{task.assigned_group}</td>
<td>{task.created_by}</td>
<td>{task.modified_by}</td>
<td>{task.status}</td>
</tr>
))}
</tbody>
</table>
)}
</div>
);
}

export default TaskTable;