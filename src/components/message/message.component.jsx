import "./message.style.css"
import { useParams } from "react-router-dom"
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from "react-router-dom"
function Message() {
    const navigate =useNavigate();
    const msg =useParams().msg;
    return (
        <div className="message-error-container">
            <div className="message-wrapper">
            <button className="home-btn" onClick={()=>{navigate("/")}}><HomeIcon fontSize="large"/></button>
            <h2 className="error-message">{msg.split('-').join(" ")}</h2>
            </div>
        </div>
    )
}

export default Message
