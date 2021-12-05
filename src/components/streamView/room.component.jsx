import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

// import {nanoid} from 'nanoid'
import Video from "../video/video.component";
import { useParams } from "react-router-dom";
import "./room.style.css";
const socket = io("https://asad-zoom-look-alike-server.herokuapp.com/", { transports: ["websocket"] });

const Room = ({user}) => {
  const navigate =useNavigate();
  const params = useParams();
  const [peers, setPeers] = useState([]);
  const [userUpdate, setUserUpdate] = useState([]);
  const [myVideoFlag, setMyVideoFlag] = useState(true);
  const [myAudioFlag, setMyAudioFlag] = useState(true);
  const socketRef = useRef();
  const userVideo = useRef();
  const videoSream = useRef();
  // const userIdRef=useRef();
  const peersRef = useRef([]);
  const roomID = params.roomID;

  useEffect(() => {
    socketRef.current = socket;
    socket.open()
      const options ={
        headers:{'authorization':`bearer ${JSON.parse(localStorage.getItem('userAccessToken'))}` }
      }
    axios.get("https://asad-zoom-look-alike-server.herokuapp.com/auth",options).then(response => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          userVideo.current.srcObject = stream;

          // userVideo.current.onloadedmetadata = (metadata) => {
          //   userVideo.current.play();
          // }
          // let mediaRecorder = new MediaRecorder(stream);
          // videoSream.current =()=>{
          //   if(myVideoFlag){
          //     mediaRecorder.pause();
          //   }else{
          //     mediaRecorder.start();
          //   }
          // }



          socketRef.current.emit("join room", {roomID,uniqueID:response.data.uniqid});
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
            console.log(id);
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
          socketRef.current.on("change", (payload) => {
            setUserUpdate(payload);
          });
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
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.kind === "video") {
          if (track.enabled) {
            socketRef.current.emit("change", [...userUpdate,{
              id: socketRef.current.id,
              myVideoFlag: false,
              myAudioFlag,
            }]);
            track.enabled = false;
            setMyVideoFlag(false);
          } else {
            socketRef.current.emit("change", [...userUpdate,{
              id: socketRef.current.id,
              myVideoFlag: true,
              myAudioFlag,
            }]);
            track.enabled = true;
            setMyVideoFlag(true);
          }
        }
      });
    }
  }
  const onAudioToggle=()=>{
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.kind === "audio") {
          if (track.enabled) {
            socketRef.current.emit("change",[...userUpdate, {
              id: socketRef.current.id,
              videoFlag,
              audioFlag: false,
            }]);
            track.enabled = false;
            setMyAudioFlag(false);
          } else {
            socketRef.current.emit("change",[...userUpdate, {
              id: socketRef.current.id,
              videoFlag,
              audioFlag: true,
            }]);
            track.enabled = true;
            setMyAudioFlag(true);
          }
        }
      });
    }
  }
  return (
    <>
    <div className="container">
      

      <video muted ref={userVideo}  autoPlay playsInline />
      
      {peers.map((peer) => {
        return <Video key={peer.peerID} peer={peer.peer} />;
      })}
    </div>
      <div className="room-footer">
      <div className="left-footer">
      <input type="button" style={{textDecoration:myAudioFlag?'line-through':''}} className="screen"  value="audio" onClick={()=>{onAudioToggle()}}/>
      <input type="button" className="screen"  value="camra" onClick={()=>{onCamraToggle()}}/>
      </div>
      <div className="middle-footer">
      <input type="button" className="screen"  value="Screen Share" onClick={()=>{}}/>
      </div>
      <div className="right-footer">
      <input type="button" className="screen"  value="empty" onClick={()=>{}}/>
      </div>
      </div>
    </>
  );
};

export default Room;
