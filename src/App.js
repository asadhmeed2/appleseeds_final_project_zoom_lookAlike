import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import {useState} from 'react'
import './App.css';
import Room from './components/streamView/room.component';
import Home from './components/home/home.component';



function App() {
  const [logedIn,setLogedIn]=useState(false)
  const [user,setUser]=useState({});
    const login =async(email,password)=>{
        try{
            const loginData = await axios.post("https://asad-zoom-look-alike-server.herokuapp.com/login",{email:email,password:password})
            setUser(loginData)
            console.log(loginData);
            localStorage.setItem("userAccessToken", JSON.stringify(loginData.data.accessToken))
          setLogedIn(true)
        }catch(err){
            console.log(err);
        }
    }
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Home login={login} logedIn={logedIn}/>}/>
      <Route path="/room/:roomId" element={<Room user={user}/>}/>
        </Routes>
    </div>
    </Router>
  );
}

export default App;
