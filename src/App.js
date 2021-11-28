import logo from './logo.svg';
import './App.css';
import {useEffect ,useRef,useState} from 'react'
import io from 'socket.io-client'
import {nanoid} from 'nanoid'
const socket =io('http://localhost:4000',{ transports : ['websocket'] })
function App() {
  const [state,setState]=useState("")
  const [rooms,setRooms]=useState([])
  const stateRef=useRef()
  const inputRef=useRef()
  useEffect(()=>{
    socket.on('start-stream',(helow)=>{
      stateRef.current.innerHTML =`<h1>${helow.helow}</h1>`
    })
    return ()=>{
      socket.emit('disconnected',"desconnected true")
   }
  },[])
  const onEmitter =()=>{
    socket.emit('new-stream',{
      helow:inputRef.current.value
    })
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p ref={stateRef}>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <input type="text" ref={inputRef}/>
        <button onClick={onEmitter}>click</button>
      </header>
    </div>
  );
}

export default App;
