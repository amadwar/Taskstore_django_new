import React, { useState, useEffect } from 'react';
import axios from 'axios';

let documentCookie = document.cookie;

function getCookie(name: string): string | null {
  const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
  const match = cookieRegex.exec(documentCookie);
  if (match) {
    return match[1];
  }
  return null;
}

export interface User {
  name: string;
  role: string;
}

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get("http://localhost:8000/api/staff/");
                setUsers(response.data);
                setIsLoading(false);
            } catch (error) {
                //setError(error);
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, []);

  const [formData, setFormData] = useState<User>({ name: '', role: '' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const csrfToken = getCookie('csrftoken');
        const response = await axios.post("http://localhost:8000/api/staff/", JSON.stringify(formData), {
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
    //setShowNotification(true);
    //setTimeout(() => setShowNotification(false), 3000); // hide notification after 3 seconds

    }
    
    return (
    <div>
    <h3>Add User Form</h3>
    <form onSubmit={handleSubmit}>
    <label>
    Name:
    <input type="text" name="name" onChange={handleChange} value={formData.name} />
    </label>
    <br />
    <label>
    Rolle:
    <input type="text" name="role" onChange={handleChange} value={formData.role} />
    </label>
    <br />
    {showNotification && <div className="notification">Changes saved successfully!</div>}
    <button type="submit">Add User</button>
    </form>

    

    
    <div>
    <h3>List of Users</h3>
    <table>
    <tr>
    <th>Name</th>
    <th>Rolle</th>
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
    users.map(user => (
    <tr key={user.name}>
    <td>{user.name}</td>
    <td>{user.role}</td>
    </tr>
    ))
    )}
    </table>
    </div>
    </div>
    );
    }
    
    export default Users;
