import React,{ useEffect,useState} from 'react';
import axios from 'axios';
import "./home.style.css"
import  CreateRoom  from "../streamView/creatRoom.component";
import Login from "../login/login.component"


const Home=()=> {
    const [logedIn,setLogedIn]=useState(false)
  const [user,setUser]=useState({});
    const login =async(email,password)=>{
        try{
            const loginData = await axios.post("http://localhost:4000/login",{email:email,password:password})
            localStorage.setItem("userAccessToken", JSON.stringify(loginData.data.accessToken))
          setLogedIn(true)
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        if(localStorage.getItem('userAccessToken')){
            (()=>{
                const options ={
                    headers:{'authorization':`bearer ${JSON.parse(localStorage.getItem('userAccessToken'))}` }
                  }
                axios.get("http://localhost:4000/auth",options).then((response)=>{
                    setUser(response.data);
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
           <CreateRoom user={user}/>
           </>
}
        </div>
    )
}

export default Home
