import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import Chat from '../chat/chat.component';
import Video from "../video/video.component";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import LogoutIcon from '@mui/icons-material/Logout';
import "./room.style.css";
const socket = io("https://asad-zoom-look-alike-server.herokuapp.com/", { transports: ["websocket"] });
// const socket = io("http://localhost:4000", { transports: ["websocket"] });

const Room = ({name ,setLogedIn}) => {
  const navigate =useNavigate();
  const [peers, setPeers] = useState([]);
  const [shareScreenFlag, setShareScreenFlag] = useState(false);
  const [fullScreenFlag, setFullScreenFlag] = useState(false);
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
    // axios.get("http://localhost:4000/auth",options).then(response => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userVideo.current.srcObject = stream;
          userStream.current=stream;
          socketRef.current.emit("join room", {roomID:"roomID",uniqueID:response.data.uniqid});
          socketRef.current.on("all users", (users) => {
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

          socketRef.current.on("logout",()=>{
            handleLogout();
          })
        })
        .catch((err) => {
          console.log(err);
          navigate('/message')
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
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getTracks().forEach( (track)=> {
        if (track.kind === "audio") {
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
        userVideo.current.srcObject.getTracks().forEach(track=>{
          if(track.kind==="video"){
            webcamVideoTrak.current=track;
            track.enabled = true;
            screenTrack.enabled = true;
            let tempPeers=[...peers]
             tempPeers.map((peer)=>{
                 peer.peer.replaceTrack(track,screenTrack,userStream.current);
            })
            setShareScreenFlag(true);
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
              setShareScreenFlag(false);
            }
          });
        }
      
      
          
    
      
    })
}
const scallVideo = () => {
  userVideo.current.classList.toggle("scalled");
  setFullScreenFlag(!fullScreenFlag)
  }

  function handleLogout(){
    setLoding(true);
    if(localStorage.getItem("userAccessToken")){
      let accessToken = localStorage.getItem("userAccessToken");
      const options = {
        headers: {
          authorization: `bearer ${JSON.parse(accessToken)}`,
        },
      };
      // axios.get("https://asad-zoom-look-alike-server.herokuapp.com/logout",options).then(response=>{
      axios.get("http://localhost:4000/logout",options).then(response=>{
      localStorage.removeItem("userAccessToken")
      if(response.data.adminLogedOut){
        socketRef.current.emit("logout all");
      }
      setLoding(false);
      setLogedIn(false);
      // window.location.reload(false);
      }).catch((error)=>{
        console.log(error);
        setLoding(false);
        
      })
    }else{
      setLogedIn(false);
    }
  }
  return (
   <div className="room">
    <div className="body">
    <div className="container">
    <div  className="video-container">
      <button onClick={scallVideo} className="scall" >{fullScreenFlag? <FullscreenExitIcon/>:<FullscreenIcon /> }</button>
      <video muted ref={userVideo}  autoPlay playsInline />
      </div>
      {peers.map((peer) => {
        return <Video key={peer.peerID} peer={peer.peer} />
      })}
    </div>
      <div className="room-footer">
      <div className="left-footer">
      <button  className=""   onClick={()=>{onAudioToggle()}}>{myAudioFlag?<MicIcon/>:<MicOffIcon/>}</button>
      <button className=""   onClick={()=>{onCamraToggle()}}>{myVideoFlag?<VideocamIcon/>:<VideocamOffIcon/>}</button>
      </div>
      <div className="middle-footer">
      <button  className=""  onClick={()=>{shareScreen()}}> {shareScreenFlag?<ScreenShareIcon/>:<StopScreenShareIcon/>}</button>
      </div>
      <div className="right-footer">
      <button className="log-out" disabled={loding} onClick={handleLogout}><LogoutIcon/></button>
      </div>
      </div>
    </div>
      <Chat name={userName}/>
    </div>
  );
};

export default Room;
