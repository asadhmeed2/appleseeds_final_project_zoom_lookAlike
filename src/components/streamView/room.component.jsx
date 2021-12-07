import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import Chat from '../chat/chat.component';
// import {nanoid} from 'nanoid'
import Video from "../video/video.component";
import { useParams } from "react-router-dom";
import "./room.style.css";
const socket = io("https://asad-zoom-look-alike-server.herokuapp.com/", { transports: ["websocket"] });
// const socket = io("http://localhost:4000", { transports: ["websocket"] });

const Room = ({name}) => {
  const navigate =useNavigate();
  const [peers, setPeers] = useState([]);
  const [myVideoFlag, setMyVideoFlag] = useState(true);
  const [myAudioFlag, setMyAudioFlag] = useState(true);
  const [loding, setLoding] = useState(false);
  const [userName, setUserName] = useState()
  const socketRef = useRef();
  const userVideo = useRef();
  const webcamVideoTrak= useRef()
  const userStream = useRef()
  const peersRef = useRef([]);

  useEffect(() => {
    setUserName(name)
    socketRef.current = socket;
    socket.open()
      const options ={
        headers:{'authorization':`bearer ${JSON.parse(localStorage.getItem('userAccessToken'))}` }
      }
    axios.get("https://asad-zoom-look-alike-server.herokuapp.com/auth",options).then(response => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userVideo.current.srcObject = stream;
          userStream.current=stream;
          socketRef.current.emit("join room", {roomID:"roomID",uniqueID:response.data.uniqid});
          socketRef.current.on("all users", (users) => {
            console.log('users',users);
            const peers = [];
            users.forEach((userID ) => {
              const peer = createPeer(userID , socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID ,
                peer,
              });
              peers.push({
                peerID:userID ,
                peer: peer,
              });
            });
            setPeers(prev=>peers);
          });
  
          socketRef.current.on("user joined", (payload) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });
            setPeers((users) => [...users, {peerID:payload.callerID,peer}]);
          });
          socketRef.current.on("user left", (id) => {
            
            console.log(id, "user left");
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) {
              peerObj.peer.destroy();
            }
            console.log("peersRef.current",peersRef.current);
            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current=[...peers];
            setPeers(prvPeers=>peers)
          });
          socketRef.current.on("receiving returned signal", (payload) => {
            if(!myVideoFlag)return
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (!item) return;
            item.peer.signal(payload.signal);
          });
          // socketRef.current.on("change", (payload) => {
          //   setUserUpdate(payload);
          // });
        })
        .catch((err) => {
          console.log(err);
        });
    }).catch(err => {
      navigate('/')
    })
    return function cleanup() {
      
      peersRef.current=[]
      setPeers({})
      socket.close();
    }
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  }
  const onCamraToggle=()=>{
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getTracks().forEach( (track)=> {
        console.log(track.kind,track.enabled);
        if (track.kind === "video") {
          if (track.enabled) {
            // socketRef.current.emit("change", [...userUpdate,{
            //   id: socketRef.current.id,
            //   myVideoFlag: false,
            //   myAudioFlag,
            // }]);
            track.enabled = false;
            setMyVideoFlag(false);
          } else {
            // socketRef.current.emit("change", [...userUpdate,{
            //   id: socketRef.current.id,
            //   myVideoFlag: true,
            //   myAudioFlag,
            // }]);
            track.enabled = true;
            setMyVideoFlag(true);
          }
        }
      });
    }
  }
  const onAudioToggle=()=>{
    console.log(userVideo.current.srcObject.getTracks());
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getTracks().forEach( (track)=> {
        if (track.kind === "audio") {
          console.log(track.kind,track.enabled);
          if (track.enabled) {
            // socketRef.current.emit("change",[...userUpdate, {
            //   id: socketRef.current.id,
            //   myVideoFlag,
            //   myAudioFlag: false,
            // }]);
            track.enabled = false;
            setMyAudioFlag(false);
          } else {
            // socketRef.current.emit("change",[...userUpdate, {
            //   id: socketRef.current.id,
            //   myVideoFlag,
            //   myAudioFlag: true,
            // }]);
            track.enabled = true;
            setMyAudioFlag(true);
          }
        }
      });
    }
  }
 const shareScreen=()=> {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
        const screenTrack = stream.getTracks()[0];
        console.log("screenTrack",screenTrack);
        console.log("userVideo.current.srcObject",userVideo.current.srcObject);
        userVideo.current.srcObject.getTracks().forEach(track=>{
          if(track.kind==="video"){
            console.log(track);
            webcamVideoTrak.current=track;
            track.enabled = true;
            screenTrack.enabled = true;
            let tempPeers=[...peers]
             tempPeers.map((peer)=>{
                 peer.peer.replaceTrack(track,screenTrack,userStream.current);
            })

              setPeers(tempPeers)
          }
        });
        screenTrack.onended = function() {
          userVideo.current.srcObject.getTracks().forEach(track=>{
            if(track.kind==="video"){
              webcamVideoTrak.current.enabled = false;
            track.enabled = true;
            let tempPeers=[...peers]
             tempPeers.map((peer)=>{
              peer.peer.replaceTrack(webcamVideoTrak.current,track,userStream.current);
              })
              setPeers(tempPeers)
            }
          });
        }
      
      
          
    
      
    })
}
const scallVideo = () => {
  userVideo.current.classList.toggle("scalled");
  }

  const handleLogout =()=>{
    setLoding(true);
    if(localStorage.getItem("userAccessToken")){
      let accessToken = localStorage.getItem("userAccessToken");
      console.log("accessToken",accessToken);
      const options = {
        headers: {
          authorization: `bearer ${JSON.parse(accessToken)}`,
        },
      };
      axios.get("http://localhost:4000/logout",options).then(response=>{
      localStorage.removeItem("userAccessToken")
      console.log(response.data);
      setLoding(false);
      socket.close();
      }).catch((error)=>{
        console.log(error);
        setLoding(false);
      })
    }
  }
  return (
   <div className="room">
    <div className="body">
    <div className="container">
    <div  className="video-container">
      <button onClick={scallVideo} className="scall" >[]</button>
      <video muted ref={userVideo}  autoPlay playsInline />
      </div>
      {peers.map((peer) => {
        return <Video key={peer.peerID} peer={peer.peer} />
      })}
    </div>
      <div className="room-footer">
      <div className="left-footer">
      <input type="button" style={{textDecoration:myAudioFlag?'':'line-through'}} className="screen"  value="audio" onClick={()=>{onAudioToggle()}}/>
      <input type="button" style={{textDecoration:myVideoFlag?'':'line-through'}} className="screen"  value="camra" onClick={()=>{onCamraToggle()}}/>
      </div>
      <div className="middle-footer">
      <input type="button" className="screen"  value="Screen Share" onClick={()=>{shareScreen()}}/>
      </div>
      <div className="right-footer">
      <button className="log-out" disabled={loding} onClick={handleLogout}>Log out</button>
      </div>
      </div>
    </div>
      <Chat name={userName}/>
    </div>
  );
};

export default Room;
