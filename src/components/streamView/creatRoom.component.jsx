import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { v1 as uuid } from "uuid";
import axios from "axios";
import "./creatRoom.style.css";
// import { io } from "socket.io-client";
import Room  from "../streamView/room.component"
// const socket = io("http://localhost:4000/", { transports: ["websocket"] });

const CreateRoom = ({user}) => {
  // const navigate = useNavigate();
  // const [rooms, setRooms] = useState([]);
   const [username, setUsername] = useState([]);
  
  const [roomJoined,setRoomJoined]= useState(false)
  useEffect(() => {
    // (() => {
    //   socket.emit("home page refreshed");
    //   console.log("home page refreshed");
    //   socket.on("all rooms links", (roomsData) => {
    //     setRooms(Object.values(roomsData));
    //   });
    // })();
  }, []);
  const join = () => {
    const options = {
      headers: {
        authorization: `bearer ${JSON.parse(
          localStorage.getItem("userAccessToken")
        )}`,
      },
    };
    axios
      .get("https://asad-zoom-look-alike-server.herokuapp.com/auth", options)
      .then((response) => {
        setRoomJoined(true);
      }
      ).catch((error) => {
        console.log(error);
      })
  };
 const onInputUserName=(e)=>{
  setUsername(e.target.value)
 }


  return (
    <>
      <div className="nav">
      <div className="logo">asad privet chat</div>
      <button onClick={() => {}}>Log out</button>
      </div>
      <div className="room-containr">
      {
        roomJoined?<><Room usrname={username} user={user}/></>:
        <div className="room-userName">
          <input type="text" value={username} onChange={onInputUserName}/>
          <button onClick={join}>Join Room</button>
        </div>
      }
      </div>
    </>
  );
};

export default CreateRoom;
