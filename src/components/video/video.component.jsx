import React ,{useEffect,useRef, useState} from 'react';
import './video.style.css'

const Video = (props) => {
    const ref = useRef();
    const videoContainer = useRef();
    useEffect(() => {
        props.peer.on("stream", stream => {
            if(ref.current){
                ref.current.srcObject = stream;
            }
        })
    }, []);
    const scallVideo = () => {
        ref.current.classList.toggle("scalled");
    }
    return (
        <div ref={videoContainer} className="video-container">
        <button onClick={scallVideo} className="scall">[]</button>
        <video className="video" playsInline autoPlay ref={ref} />
        </div>
    );
}
export default Video;