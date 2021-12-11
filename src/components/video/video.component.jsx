import React ,{useEffect,useRef, useState} from 'react';
import './video.style.css'
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
const Video = (props) => {
    const [shareScreenFlag, setShareScreenFlag] = useState(false);
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
        videoContainer.current.classList.toggle("rotate");
        setShareScreenFlag(!shareScreenFlag);
    }
    return (
        <div ref={videoContainer} className="video-container">
        <button onClick={scallVideo} className="scall">{shareScreenFlag?<FullscreenExitIcon/>:<FullscreenIcon/>}</button>
        <video className="video" playsInline autoPlay ref={ref} />
        </div>
    );
}
export default Video;