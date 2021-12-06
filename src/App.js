import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import {useState} from 'react'
import './App.css';
import Room from './components/streamView/room.component';
import Home from './components/home/home.component';



function App() {
  
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Home/>}/>
      {/* <Route path="/room/:roomId" element={<Room user={user}/>}/> */}
        </Routes>
    </div>
    </Router>
  );
}

export default App;
