import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { TaskList } from './TaskList';


function getCookie(name: string): string | null {
  const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
  const match = cookieRegex.exec(document.cookie);
  if (match) {
  return match[1];
  }
  return null;
  }


interface Board {
  id: number;
  name: string;
  columns: TaskList[];
}

function Boards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    async function fetchTaskLists() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/Tasklists/");
        setTaskLists(response.data);
      } catch (error) {
        //setError(error.message);
      }
    }

    async function fetchBoards() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/boards/");
        setBoards(response.data);
        setIsLoading(false);
      } catch (error) {
        //setError(error.message);
        setIsLoading(false);
      }
    }

    fetchTaskLists();
    fetchBoards();
  }, []);

  const [formData, setFormData] = useState<Board>({ id: 0, name: '', columns: [] });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const csrfToken = getCookie('csrftoken');
      const data = { name: formData.name,columns: formData.columns.map(column => column.id) };
      const response = await axios.post("http://127.0.0.1:8000/api/boards/", data, {
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
    const selectedTasklists = selectedOptions.map((option) => taskLists.find((tasklist) => tasklist.id === parseInt(option))!);
    setFormData({ ...formData, columns: selectedTasklists });
  };

  return (
    <div>
      <h3>Add Boards Form</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" onChange={handleChange} value={formData.name} />
        </label>
        <br />
        <label>
          TaskLists:
          <select name="tasklists" multiple={true} onChange={handleSelectChange} value={formData.columns.map(tasklist => tasklist.id).join(',')}>
            {taskLists.map(tasklist => (
              <option key={tasklist.id} value={tasklist.id}>{tasklist.type}</option>
            ))}
          </select>
        </label>
        <br />
        {showNotification && <div className="notification">Changes saved successfully!</div>}
        <input type="submit" value="Submit" />

      </form>
 
  <div>
  <h3>List of Boards</h3>
 <table>
  <tr>
    <th>Name</th>
    <th>Columns</th>
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
    boards.map(board => (
      <tr >
        <td>{board.name}</td>
        <td>{board.columns.map(column => (
            <span key={column.id}><ul><li>{column.id}</li> </ul></span>
          )).join(',')}</td>
      </tr>
    ))
  )}
</table>
</div>
</div>
  );
}

export default Boards;