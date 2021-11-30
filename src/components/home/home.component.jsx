import React from 'react';
import "./home.style.css"
import  CreateRoom  from "../streamView/creatRoom.component";
import Login from "../login/login.component"


const Home=(props)=> {
    const [logedIn,setLogedIn]=React.useState(true)
    const login =async()=>{
        
    }
    return (
        <div>
            {
                !logedIn?
           <Login/>: 
           <>
           <h1>private video chat app</h1> 
           <CreateRoom props={props}/>
           </>
}
        </div>
    )
}

export default Home
