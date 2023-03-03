import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { User as GroupMember } from './User';

function getCookie(name: string): string | null {
const cookieRegex = new RegExp(`;\\s*${name}=([^;]+)`);
const match = cookieRegex.exec(document.cookie);
if (match) {
return match[1];
}
return null;
}

export interface Group {
  id:number;
  name: string;
  members: GroupMember[];
  }
  
  function Groups(): JSX.Element {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<GroupMember[]>([]);
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

  fetchUsers();
  fetchGroups();}, []);

const [formData, setFormData] = useState<Group>({ id:0, name: '', members: [] });

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
  const selectedUsers = selectedOptions.map((option) => users.find((user) => user.id === parseInt(option))!);
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
  <select name="members" multiple={true} onChange={handleSelectChange} value={formData.members.map(user => user.id).join(',')}>
    <option value="">Select User</option>
    {users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
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
        <th>ID</th>
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
        groups.map(group => (
          <tr key={group.id}>
            <td>{group.id}</td>
            <td>{group.name}</td>
            <td>
                {group.members.map(member => (
                    member.id
                ))}
              
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
<div>
</div>

</div>

    
    </div>
  );
}

export default Groups;