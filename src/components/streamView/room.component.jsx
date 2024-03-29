import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chat from "../chat/chat.component";
import Video from "../video/video.component";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import "./room.style.css";
// const socket = io("https://asad-zoom-look-alike-server.herokuapp.com/", {
//   transports: ["websocket"],
// });
const socket = io(process.env.REACT_APP_SREVER_URL, {
  transports: ["websocket"],
});

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

const Room = ({ name, setLogedIn }) => {
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [shareScreenFlag, setShareScreenFlag] = useState(false);
  const [fullScreenFlag, setFullScreenFlag] = useState(false);
  const [myVideoFlag, setMyVideoFlag] = useState(true);
  const [myAudioFlag, setMyAudioFlag] = useState(true);
  const [loding, setLoding] = useState(false);
  const [chatIsVisible, setChatIsVisible] = useState(false);
  const [userName, setUserName] = useState();
  const socketRef = useRef();
  const userVideo = useRef();
  const webcamVideoTrak = useRef();
  const userStream = useRef();
  const peersRef = useRef([]);
  const videoContainerRef = useRef();
  const [width, height] = useWindowSize();

  useEffect(() => {
    setUserName(name);
    socketRef.current = socket;
    socket.open();
    // const options ={
    //   headers:{'authorization':`bearer ${JSON.parse(localStorage.getItem('userAccessToken'))}` }
    // }
    // axios.get("https://asad-zoom-look-alike-server.herokuapp.com/auth",options).then(response => {
    // axios.get("http://localhost:4000/auth",options).then(response => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;
        socketRef.current.emit("join room", {
          roomID: "roomID",
          // uniqueID: response.data.uniqid,
          uniqueID: socket.id,
        });
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({
              peerID: userID,
              peer: peer,
            });
          });
          setPeers((prev) => peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          setPeers((users) => [...users, { peerID: payload.callerID, peer }]);
        });
        socketRef.current.on("user left", (id) => {
          console.log(id, "user left");
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = [...peers];
          setPeers((prvPeers) => peers);
        });
        socketRef.current.on("receiving returned signal", (payload) => {
          if (!myVideoFlag) return;
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (!item) return;
          item.peer.signal(payload.signal);
        });
        // socketRef.current.on("change", (payload) => {
        //   setUserUpdate(payload);
        // });

        // socketRef.current.on("logout",()=>{
        //   handleLogout();
        // })
      })
      .catch((err) => {
        console.log(err);
        // navigate("/message/cannot-get-to-your-webcame");
      });
    // }).catch(err => {
    //   console.log(err.data);
    //   // navigate('/message/admin-is-not-loged-in')
    // })
    return function cleanup() {
      peersRef.current = [];
      setPeers([]);
      socket.close();
    };
  }, [myVideoFlag, name]);
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
  const onCamraToggle = () => {
    console.log(userVideo.current);
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getTracks().forEach((track) => {
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
  };
  const onAudioToggle = () => {
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getTracks().forEach((track) => {
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
  };
  const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((stream) => {
      const screenTrack = stream.getTracks()[0];
      userVideo.current.srcObject.getTracks().forEach((track) => {
        if (track.kind === "video") {
          webcamVideoTrak.current = track;
          track.enabled = true;
          screenTrack.enabled = true;
          let tempPeers = [...peers];
          tempPeers?.map((peer) =>
            peer.peer.replaceTrack(track, screenTrack, userStream.current)
          );
          setShareScreenFlag(true);
          setPeers(tempPeers);
        }
      });
      screenTrack.onended = function () {
        userVideo.current.srcObject.getTracks().forEach((track) => {
          if (track.kind === "video") {
            webcamVideoTrak.current.enabled = false;
            track.enabled = true;
            let tempPeers = [...peers];
            tempPeers?.map((peer) => {
              peer.peer.replaceTrack(
                webcamVideoTrak.current,
                track,
                userStream.current
              );
            });
            setPeers(tempPeers);
            setShareScreenFlag(false);
          }
        });
      };
    });
  };
  const scallVideo = () => {
    userVideo.current.classList.toggle("scalled");
    videoContainerRef.current.classList.toggle("rotate");
    setFullScreenFlag(!fullScreenFlag);
  };

  // function handleLogout() {
  //   setLoding(true);
  //   if (localStorage.getItem("userAccessToken")) {
  //     let accessToken = localStorage.getItem("userAccessToken");
  //     console.log(accessToken);
  //     const options = {
  //       headers: {
  //         authorization: `bearer ${JSON.parse(accessToken)}`,
  //       },
  //     };
  //     console.log(options);
  //     axios
  //       .get(
  //         "https://asad-zoom-look-alike-server.herokuapp.com/logout",
  //         options
  //       )
  //       .then((response) => {
  //         // axios.get("http://localhost:4000/logout",options).then(response=>{
  //         localStorage.removeItem("userAccessToken");
  //         // if(response.data.adminLogedOut){
  //         //   socketRef.current.emit("logout all");
  //         // }
  //         setLoding(false);
  //         setLogedIn(false);
  //         // window.location.reload(false);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setLoding(false);
  //         localStorage.removeItem("userAccessToken");
  //         setLogedIn(false);
  //       });
  //   } else {
  //     setLogedIn(false);
  //   }
  // }

  const openChat = () => {
    setChatIsVisible(!chatIsVisible);
  };
  return (
    <div className="room">
      <div className="body">
        <div className="container">
          <div className="video-container" ref={videoContainerRef}>
            <button onClick={scallVideo} className="scall">
              {fullScreenFlag ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </button>
            <video muted ref={userVideo} autoPlay playsInline />
          </div>
          {/* {peers?.map((peer) => (
            <Video key={peer.peerID} peer={peer.peer} />
          ))} */}
          {console.log(peers)}
        </div>
        <div className="room-footer">
          <div className="left-footer">
            <button
              className="media-btn"
              onClick={() => {
                onAudioToggle();
              }}
            >
              {myAudioFlag ? (
                <>
                  <MicIcon />
                  <div className="media-btn-text">Mute</div>
                </>
              ) : (
                <>
                  <MicOffIcon />
                  <div className="media-btn-text">Unmute</div>
                </>
              )}
            </button>
            <button
              className="media-btn"
              onClick={() => {
                onCamraToggle();
              }}
            >
              {myVideoFlag ? (
                <>
                  <VideocamIcon />
                  <div className="media-btn-text">Stop Video</div>
                </>
              ) : (
                <>
                  <VideocamOffIcon />
                  <div className="media-btn-text">Start Video</div>
                </>
              )}
            </button>
          </div>
          <div className="middle-footer">
            <button
              className="media-btn"
              onClick={() => {
                openChat();
              }}
            >
              {" "}
              <>
                {<ChatIcon />}
                <div className="media-btn-text">Chat</div>
              </>
            </button>
            {width > 600 && (
              <button
                className="media-btn share-screen-btn"
                onClick={() => {
                  shareScreen();
                }}
              >
                {" "}
                <>
                  {shareScreenFlag ? (
                    <>
                      <ScreenShareIcon />
                    </>
                  ) : (
                    <StopScreenShareIcon />
                  )}
                  <div className="media-btn-text">Shere Screen</div>
                </>
              </button>
            )}
          </div>
          <div className="right-footer">
            <button
              className="media-btn"
              disabled={loding}
              // onClick={handleLogout}
            >
              <>
                <LogoutIcon />
                <div className="media-btn-text">Logout</div>
              </>
            </button>
          </div>
        </div>
      </div>
      <div
        className="chat-window"
        style={{ display: chatIsVisible ? "" : "none" }}
      >
        <div className="chat-wrapper">
          <button
            className="media-btn chat-close-btn"
            onClick={() => {
              openChat();
            }}
          >
            {" "}
            <>
              {<CloseIcon />}
              <div className="media-btn-text">close</div>
            </>
          </button>
          <Chat name={userName} />
        </div>
      </div>
    </div>
  );
};

export default Room;
