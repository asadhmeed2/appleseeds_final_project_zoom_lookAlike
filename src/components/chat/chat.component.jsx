import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {v4 as uuidv4} from "uuid";
import "./chat.style.css"
import SendIcon from '@mui/icons-material/Send';
// const socket = io("http://localhost:4001", { transports: ["websocket"] });
const socket = io("https://asad-zoom-look-alike-chat-serv.herokuapp.com/", { transports: ["websocket"] });


const Chat=({name})=> {
    const [messages,setMessages] =useState([])
    const [messageText,setMessageText]=useState("")
    const textRef=useRef()
    const scrollToRef=useRef();
    const socketRef = useRef();
    useEffect(() => {
        socketRef.current =socket;
        socket.open();
        socket.emit("user joined",{userName:name,id:socket.id,roomID:"room"})
        socket.emit("get all messages")
        socket.on("all messages",(tempMessages) =>{
            setMessages(prev=>tempMessages)

        })
        return (
            ()=>{
                socket.close()  
            }
        )
    },[])
    useEffect(() => {
            scrollToRef.current?.scrollIntoView({ behavior : 'smooth'});
    },[messages])

    const sendMessage =()=>{
        if(messageText){
            socketRef.current.emit("message",{userName:name,message:messageText});
            textRef.current.value=""
            setMessageText("") 
        }
    }
    const sendMessageOnEnter =(e)=>{
        if(e.keyCode=== 13){
            if(messageText){
                socketRef.current.emit("message",{userName:name,message:messageText});
                textRef.current.value=""
                setMessageText("") 
            }
        }
    }
    const hndleMessage=(e)=>{
        
    setMessageText(e.target.value);
    }
    return (
        <div className="chat">
        <div className="chat-screen">
            {messages !=[] && messages.map((messageObj,i)=>{
                return <div  className="message-container" key={uuidv4()}>
                    <span className="username">
                        {messageObj.userName}
                    </span> : 
                     <span className="message">
                         {messageObj.message}
                     </span>
                     {i===messages.length-1?<div ref={scrollToRef} ></div>:""}
                </div>
            })}
            </div>
            
            <div className="chat-input">
            <input type="text" onKeyUp={sendMessageOnEnter} ref={textRef} className="messageInput" onChange={hndleMessage} />
            <button  onClick={sendMessage}  className="submitMessage" ><SendIcon/></button>
            </div>
           
        </div>
    )
}

export default Chat;

