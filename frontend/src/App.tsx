import './App.css';
import Boards from './Components/Board';
import Groups from './Components/Groups';
import TaskList from './Components/TaskList';
import TaskTable from './Components/TaskTable';
import Users from './Components/User';


function App() {
  return (
    <div className="App">
     
     <div>
     <Users/>
     <br />
     </div>
     <div>
     <TaskTable/>
     <br />
     </div>
     
      
    </div>
  )
}

export default App;
