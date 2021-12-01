import React,{ useEffect,useState} from 'react';
import axios from 'axios';
import "./home.style.css"
import  CreateRoom  from "../streamView/creatRoom.component";
import Login from "../login/login.component"


const Home=({logedIn,setLogedIn,login})=> {
    
    useEffect(()=>{
        if(localStorage.getItem('userAccessToken')){
            (()=>{
                const options ={
                    headers:{'authorization':`bearer ${JSON.parse(localStorage.getItem('userAccessToken'))}` }
                  }
                axios.get("http://localhost:4000/auth",options).then((response)=>{
                    setLogedIn(prv=>true)
                }).catch((error)=>{
                    console.log(error);
                    setLogedIn(prv=>false)
                })
            }
            )()
        }
        
    },[])
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
