import React,{useEffect,useState} from "react";
import {useNavigate} from 'react-router-dom'
import { v1 as uuid } from "uuid";
import axios from "axios"
import './creatRoom.style.css'
const CreateRoom = () => {
    const navigate =useNavigate();
    const [rooms,setRooms] = useState([]);
    
    const  create= ()=> {
        const options ={
            headers:{'authorization':`bearer ${JSON.parse(localStorage.getItem('userAccessToken'))}` }
          }
        axios.get("https://asad-zoom-look-alike-server.herokuapp.com/auth",options).then((response)=>{
            if(response.data.role === 'admin'){
                const id = uuid();
                setRooms(perv=>[...rooms,`/room/${id}`])
            }
        })
        
    }
    return (
        <>
        <ul>
        {rooms.map((room,index)=>{
            return(<li className="roomLink"onClick={()=>navigate(room)}>room{index}</li>)
        })}
        </ul>

        <button onClick={create}>Create room</button>
        </>
    );
};

export default CreateRoom;