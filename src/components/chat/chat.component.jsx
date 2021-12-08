import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {v4 as uuidv4} from "uuid";
import "./chat.style.css"
// const socket = io("http://localhost:4001", { transports: ["websocket"] });
const socket = io("https://asad-zoom-look-alike-chat-serv.herokuapp.com/", { transports: ["websocket"] });


const Chat=({name})=> {
    const [messages,setMessages] =useState([])
    const [messageText,setMessageText]=useState("")
    const [userName,setUserName]=useState("")
    const textRef=useRef()
    const scrollToRef=useRef();
    const socketRef = useRef();
    useEffect(() => {
        console.log("chat name: " + name);
        setUserName(name);
        socketRef.current =socket;
        socket.open();
        socket.emit("user joined",{userName:name,id:socket.id,roomID:"room"})
        socket.emit("get all messages")
        socket.on("all messages",(tempMessages) =>{
            console.log("tempMessages" ,tempMessages);
            setMessages(prev=>tempMessages)
            scrollToRef.current.scrollIntoView({ behavior : 'smooth'});
        })
        return (
            ()=>{
                socket.close()  
            }
        )
    },[])

    const hndleMessage=(e)=>{
    setMessageText(e.target.value);
    }
    const sendMessage =()=>{
        console.log("chat userName state",name);
        if(messageText){
            socketRef.current.emit("message",{userName:name,message:messageText});
            textRef.current.value=""
            setMessageText("") 
        }
    }
    return (
        <div className="chat">
        <div className="chat-screen">
            {messages !=[] && messages.map((messageObj)=>{
                console.log(messageObj.userName,messageObj.message);
                return <div className="message-container" key={uuidv4()}>
                    <span className="username">
                        {messageObj.userName}
                    </span> : 
                     <span className="message">
                         {messageObj.message}
                     </span>
                </div>
            })}
            <div ref={scrollToRef} ></div>
            </div>
            <input type="text" ref={textRef} onChange={hndleMessage} />
            <input type="button" onClick={sendMessage} value={"send"} className="submitMessage" />
        </div>
    )
}

export default Chat;

