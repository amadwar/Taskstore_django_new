import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { TaskList } from './TaskList';


let documentCookie = document.cookie;

function getCookie(name: string): string | null {
const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
const match = cookieRegex.exec(documentCookie);
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

function Board() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTaskLists() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tasklists/");
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
      const response = await axios.post("http://127.0.0.1:8000/api/boards/", formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        }
      });
      if (response.status === 201) {
        console.log(response.data);
        setBoards([...boards, response.data]);
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
    const selectedTaskLists = taskLists.filter((taskList) => selectedOptions.includes(taskList.type));
    setFormData({ ...formData, columns: selectedTaskLists });
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
          <select name="tasklists" multiple={true} onChange={handleSelectChange} value={formData.columns.map(taskList => taskList.type)}>
            {taskLists.map(tasklist => (
              <option key={tasklist.id} value={tasklist.type}>{tasklist.type}</option>
            ))}
          </select>
        </label>
        <br />
        <input type="submit" value="Submit" />

      </form>
 
  <div>
  <h3>List of Boards</h3>
 <table>
  <tr>
    <th>Name</th>
    <th>columns</th>
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
        <td>{board.columns.map(() => board.name).join(", ")}</td>
      </tr>
    ))
  )}
</table>
</div>
</div>
  );
}

export default Board;