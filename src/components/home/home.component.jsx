import React from 'react';
import "./home.style.css"
import  CreateRoom  from "../streamView/creatRoom.component";
import Login from "../login/login.component"


const Home=({logedIn,login})=> {
    
    return (
        <div>
            {
                !logedIn?
           <Login logIn={login}/>: 
           <>
           <h1>private video chat app</h1> 
           <CreateRoom/>
           </>
}
        </div>
    )
}

export default Home
