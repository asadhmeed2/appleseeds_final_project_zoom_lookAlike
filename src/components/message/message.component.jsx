import "./message.style.css"
import { useParams } from "react-router-dom"
import React from 'react'

function Message() {
    const msg =useParams().msg;
    return (
        <div className="message-container">
            <h2 className="error-message">{msg.split('-').join(" ")}</h2>
        </div>
    )
}

export default Message
