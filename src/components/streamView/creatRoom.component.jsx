import React, { useState, useRef } from "react";
import axios from "axios";
import "./creatRoom.style.css";

import Room from "../streamView/room.component";

const CreateRoom = ({ user, setLogedIn }) => {
  const [username, setUsername] = useState("");
  const messageRef = useRef();
  const [roomJoined, setRoomJoined] = useState(true);
  const [loding, setLoding] = useState(false);

  // const join = () => {
  //   setLoding(true)
  // if(username ===""){
  //  messageRef.current.innerHTML = "<span style={{color: 'red'}}>user name must not be empty</span>";
  //  setLoding(false)
  //  return
  // }
  //   const options = {
  //     headers: {
  //       authorization: `bearer ${JSON.parse(
  //         localStorage.getItem("userAccessToken")
  //       )}`,
  //     },
  //   };
  //   axios
  //   .get("https://asad-zoom-look-alike-server.herokuapp.com/auth", options)
  //   // .get("http://localhost:4000/auth", options)
  //   .then((response) => {
  //       setRoomJoined(true);
  //       setLoding(false);
  //     }
  //     ).catch((error) => {
  //       console.log(error);
  //       setLoding(false)
  //     })
  // };
  const onInputUserName = (e) => {
    setUsername(e.target.value);
  };

  //  function handleLogout(){
  //   setLoding(true);
  //   if(localStorage.getItem("userAccessToken")){
  //     let accessToken = localStorage.getItem("userAccessToken");
  //     console.log(accessToken);
  //     const options = {
  //       headers: {
  //         authorization: `bearer ${JSON.parse(accessToken)}`,
  //       },
  //     };
  //     console.log(options);
  //     axios.get("https://asad-zoom-look-alike-server.herokuapp.com/logout",options).then(response=>{
  //     // axios.get("http://localhost:4000/logout",options).then(response=>{
  //     localStorage.removeItem("userAccessToken")
  //     // if(response.data.adminLogedOut){
  //     //   socketRef.current.emit("logout all");
  //     // }
  //     setLoding(false);
  //     setLogedIn(false);
  //     // window.location.reload(false);
  //     }).catch((error)=>{
  //       console.log(error);
  //       setLoding(false);
  //       localStorage.removeItem("userAccessToken")
  //       setLogedIn(false);
  //     })
  //   }else{
  //     setLogedIn(false);
  //   }
  // }
  return (
    <>
      <div className="nav"></div>
      <div className="room-containr">
        {roomJoined ? (
          <>
            <Room name={"username"} user={user} setLogedIn={setLogedIn} />
          </>
        ) : (
          <div className="room-userName-container">
            <div className="room-userName">
              <h1>wellcome to my video chat</h1>
              {/* <input type="text" className="userName-input" onFocus={() => {messageRef.current.innerHTML =""}} value={username} onChange={onInputUserName}/>
          <button onClick={()=>void} className="joinRoom-btn">Join Room</button>
          <button onClick={handleLogout} disabled={loding} className="joinRoom-btn">Logout</button>
          <div ref={messageRef} className="username-message-error"></div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateRoom;
