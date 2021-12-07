import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {v4 as uuidv4} from "uuid";

const socket = io("http://localhost:4001", { transports: ["websocket"] });
// const socket = io("https://asad-zoom-look-alike-chat-serv.herokuapp.com/", { transports: ["websocket"] });


const Chat=({name})=> {
    const [messages,setMessages] =useState([])
    const [messageText,setMessageText]=useState("")
    const [userName,setUserName]=useState("")
    const textRef=useRef()
    const socketRef = useRef();
    useEffect(() => {
        setUserName(name);
        socketRef.current =socket;
        socket.open();
        socket.emit("user joined",{userName:name,id:socket.id,roomID:"room"})
        socket.emit("get all messages")
        socket.on("all messages",(tempMessages) =>{
            console.log("tempMessages" ,tempMessages);
            setMessages(prev=>tempMessages)
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
        if(messageText){
            socketRef.current.emit("message",{userName:userName,message:messageText});
            textRef.current.value=""
        }
    }
    return (
        <div>
        <div className="screen">
            {messages !=[] && messages.map((messageObj)=>{
                console.log(messageObj.userName,messageObj.message);
                return <div className="message-container" key={uuidv4()}>
                    
                    <div className="username">
                        {messageObj.userName}
                    </div>
                     <div className="message">
                         {messageObj.message}
                     </div>
                </div>
            })}
            </div>
            <input type="text" ref={textRef} onChange={hndleMessage} />
            <input type="button" onClick={sendMessage} value={"send"} className="submitMessage" />
        </div>
    )
}

export default Chat;

