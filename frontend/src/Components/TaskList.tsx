import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Task as Tasknummer } from './TaskTable';

 function getCookie(name: string): string | null {
  const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
  const match = cookieRegex.exec(document.cookie);
  if (match) {
  return match[1];
  }
  return null;
  }

export interface TaskList {
  id: number;
  type: string;
  label: string;
  tasks:Tasknummer[];
}

function TaskList(): JSX.Element {
  const [tasklists, setTaskLists] = useState<TaskList[]>([]);
  const [tasks, setTasks] = useState<Tasknummer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
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

  const [formData, setFormData] = useState<TaskList>({ id:0,type: '',label:'', tasks:[] });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const csrfToken = getCookie('csrftoken');
      const data = { type: formData.type,label: formData.label,tasks: formData.tasks.map(task => task.id) };
      const response = await axios.post("http://127.0.0.1:8000/api/Tasklists/", data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        }
      });
      if (response.status === 201) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
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
      const selectedTasks = selectedOptions.map((option) => tasks.find((task) => task.id === parseInt(option))!);
      setFormData({ ...formData, tasks: selectedTasks });
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
    <input type="text" name="label" onChange={handleChange} value={formData.label}  />
    </label>
    <br />
    <label>
    Tasks:
    <select name="tasks" multiple={true} onChange={handleSelectChange} value={formData.tasks.map(task => task.id).join(',')}>
    <option value="">Select Task</option>
   {tasks.map((task) => (
   <option key={task.id} value={task.id}>{task.title}</option>
    ))}
   </select>
   </label>
   <br />
   {showNotification && <div className="notification">Changes saved successfully!</div>}
  <input type="submit" value="Submit" />
    
  </form>
 
  <div>
  <h3>List of TaskLists</h3>
  <table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Label</th>
      <th>Tasks</th>
    </tr>
  </thead>
  <tbody>
    {isLoading ? (
      <tr>
        <td colSpan={2}>Loading...</td>
      </tr>
    ) : error ? (
      <tr>
        <td colSpan={2}>{error}</td>
      </tr>
    ) : (
      tasklists.map(tasklist => (
        <tr key={tasklist.id}>
          <td>{tasklist.type}</td>
          <td>{tasklist.label}</td>
          <td>{tasklist.tasks.map(task => (
            <span key={task.id}>{task.id} </span>
          )).join(',')}</td>
        </tr>
      ))
    )}
  </tbody>
</table>
</div>
  </div>
  );
}

export default TaskList;


