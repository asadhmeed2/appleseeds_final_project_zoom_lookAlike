import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

// import {nanoid} from 'nanoid'
import Video from "../video/video.component";
import { useParams } from "react-router-dom";
import "./room.style.css";
const socket = io("http://localhost:4000", { transports: ["websocket"] });

const Room = () => {
  const navigate =useNavigate();
  const params = useParams();
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = params.roomID;

  useEffect(() => {
    socketRef.current = socket;
    (()=>{
      const options ={
        headers:{'authorization':`bearer ${JSON.parse(localStorage.getItem('userAccessToken'))}` }
      }
    axios.get("https://asad-zoom-look-alike-server.herokuapp.com/auth",options).then(response => {
      (()=>{navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userVideo.current.srcObject = stream;
          socketRef.current.emit("join room", roomID);
          socketRef.current.on("all users", (users) => {
            console.log(users);
            const peers = [];
            users.forEach((userID) => {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push({
                  peerID:userID,
                  peer: peer,
              });
            });
            setPeers(peers);
            localStorage.setItem("peers",JSON.stringify(peers));
          });
  
          socketRef.current.on("user joined", (payload) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });
  
            setPeers((users) => [...users, {peerID:payload.callerID,
              peer: peer}]);
          });
          socketRef.current.on("user left", (id) => {
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) {
              peerObj.peer.destroy();
            }
            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current=peers;
            setPeers(prvPeers=>peers)
          });
  
          socketRef.current.on("receiving returned signal", (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (!item) return;
            item.peer.signal(payload.signal);
          });
        })
        .catch((err) => {
          console.log(err);
        });})()
    }).catch(err => {
      navigate('/')
    })
    })()
    
    return () => {};
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
  return (
    <div className="container">
      <video muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={peer.peerID} peer={peer.peer} />;
      })}
    </div>
  );
};

export default Room;
