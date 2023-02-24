import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Task } from './TaskTable';

let documentCookie = document.cookie;

function getCookie(name: string): string | null {
const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
const match = cookieRegex.exec(documentCookie);
if (match) {
return match[1];
}
return null;
}

export interface TaskList {
  id: number;
  type: string;
  label: string;
  Tasks:Task[];
}

function TaskList() {
  const [tasklists, setTaskLists] = useState<TaskList[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchTasks() {
    try {
    const response = await axios.get("http://127.0.0.1:8000/api/tasks/");
    setTasks(response.data);
    } catch (error) {
    //setError(error);
    }
    }
  
  
    async function fetchTaskLists() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/Tasklists/");
        setTaskLists(response.data);
        setIsLoading(false);
      } catch (err) {
        //setError(err);
        setIsLoading(false);
      }
    }
    
    fetchTasks();
    fetchTaskLists();
  }, []);

  const [formData, setFormData] = useState<TaskList>({ id:0,type: '',label:'', Tasks:[] });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.post("http://127.0.0.1:8000/api/Tasklists/", formData, {
    headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
    }
    });
    if (response.status === 201) {
    console.log(response.data);
    }
    } catch (error) {
    console.log(error);
    }
    };
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [event.target.name]: event.target.value });
      }

      const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        const selectedUsers = tasks.filter(task => selectedOptions.includes(task.title));
        setFormData({ ...formData, Tasks:tasks });
        }; 



  return (
    <div>
    <h3>Add TaskList Form</h3>
    <form onSubmit={handleSubmit}>
    <label>
      Type:
      <input type="text" name="type" onChange={handleChange} value={formData.type}  />
    </label>
    <br />
    <label>
    Label:
    <input type="email" name="label" onChange={handleChange} value={formData.label}  />
    </label>
    <br />
    <label>
    Tasks:
    <select name="tasks" multiple={true} onChange={handleSelectChange} value={formData.label}>
    <option value="">Select Task</option>
   {tasks.map(task => (
   <option key={task.title} value={task.title}>{task.title}</option>
    ))}
   </select>
   </label>
   <br />
  <input type="submit" value="Submit" />
    
  </form>
 
  <div>
  <h3>List of TaskLists</h3>
 <table>
  <tr>
    <th>Type</th>
    <th>Label</th>
    <th>Tasks</th>
  </tr>
  {isLoading ? (
    <tr>
      <td colSpan={12}>Loading...</td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan={12}>{error}</td>
    </tr>
  ) : (
    tasklists.map(tasklist => (
      <tr key={tasklist.type}>
        <td>{tasklist.type}</td>
        <td>{tasklist.label}</td>
        <td>{tasklist.Tasks.map((task) => task.title).join(", ")}</td>
      </tr>
    ))
  )}
</table>
</div>
  </div>
  );
}

export default TaskList;


