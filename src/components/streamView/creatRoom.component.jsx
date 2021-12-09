import React, { useState , useRef} from "react";
import axios from "axios";
import "./creatRoom.style.css";

import Room  from "../streamView/room.component"


const CreateRoom = ({user ,setLogedIn}) => {

   const [username, setUsername] = useState("");
  const messageRef=useRef();
  const [roomJoined,setRoomJoined]= useState(false)
 
  const join = () => {
    if(username ===""){
     messageRef.current.innerHTML = "<span style={{color: 'red'}}>user name must not be empty</span>";
     return
    }
    const options = {
      headers: {
        authorization: `bearer ${JSON.parse(
          localStorage.getItem("userAccessToken")
        )}`,
      },
    };
    axios
    .get("https://asad-zoom-look-alike-server.herokuapp.com/auth", options)
    // .get("http://localhost:4000/auth", options)
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
      </div>
      <div className="room-containr">
      {
        roomJoined?<><Room name={username} user={user} setLogedIn={setLogedIn}/></>:
        <div className="room-userName-container">
        <div className="room-userName">
          <h1>wellcome to my video chat</h1>
          <input type="text" className="userName-input" onFocus={() => {messageRef.current.innerHTML =""}} value={username} onChange={onInputUserName}/>
          <button onClick={join} className="joinRoom-btn">Join Room</button>
          <div ref={messageRef} className="username-message-error"></div>
        </div>
        </div>
      }
      </div>
    </>
  );
};

export default CreateRoom;
