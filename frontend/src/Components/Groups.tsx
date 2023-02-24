import axios from 'axios';
import React, { useState, useEffect, SelectHTMLAttributes } from 'react';
import { User } from './User';

function getCookie(name: string): string | null {
const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
const match = cookieRegex.exec(document.cookie);
if (match) {
return match[1];
}
return null;
}

export interface Group {
  name: string;
  members: User[];
  }
  
  interface FormData {
  name: string;
  members: User[];
  }
  
  function Groups(): JSX.Element {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
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
      setIsLoading(false);
    } catch (err) {
      //setError(err);
      setIsLoading(false);
    }
  }
  
  fetchGroups();
  fetchUsers();
}, []);

const [formData, setFormData] = useState<FormData>({ name: '', members: [] });

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
try {
const csrfToken = getCookie('csrftoken');
const response = await axios.post("http://localhost:8000/api/group/", formData, {
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
//array in react anzeigen
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
setFormData({ ...formData, [event.target.name]: event.target.value });
}

const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
const selectedUsers = users.filter(user => selectedOptions.includes(user.name));
setFormData({ ...formData, members: selectedUsers });
};

return (
<div>
<h3>Add Group Form</h3>
<form onSubmit={handleSubmit}>
<label>
Group Name:
<input type="text" name="name" onChange={handleChange} value={formData.name} />
</label>
<br />
<label>
Members:
<select name="members" multiple={true} onChange={handleSelectChange} value={formData.name}>
<option value="">Select User</option>
{users.map(user => (
<option key={user.name} value={user.name}>{user.name}</option>
  ))}
</select>
 </label>

<br />
<input type="submit" value="Submit" />
</form>
<div>
  <h3>List of Groups</h3>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Members</th>
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
        groups.map((group) => (
          <tr key={group.name}>
            <td>{group.name}</td>
            <td>
              <ul>
                {group.members.map((member) => (
                  <li key={member.name}>{member.name}</li>
                ))}
              </ul>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

    
    </div>
  );
}

export default Groups;