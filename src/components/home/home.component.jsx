import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.style.css";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

import CreateRoom from "../streamView/creatRoom.component";
import Login from "../login/login.component";

const Home = () => {
  const [logedIn, setLogedIn] = useState(false);
  const [loding, setLoding] = useState(false);
  const [user, setUser] = useState({});
  const login = async (email, password) => {
    try {
      setLoding(true);
      const loginData = await axios.post(
        "https://asad-zoom-look-alike-server.herokuapp.com/login",
        { email: email, password: password }
      );
      localStorage.setItem(
        "userAccessToken",
        JSON.stringify(loginData.data.accessToken)
      );
      setLogedIn(true);
      setLoding(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
      setLoding(true);
    if (localStorage.getItem("userAccessToken")) {
      (() => {
        const options = {
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("userAccessToken")
            )}`,
          },
        };
        axios
          .get(
            "https://asad-zoom-look-alike-server.herokuapp.com/auth",
            options
          )
          .then((response) => {
            setUser(response.data);
            setLogedIn((prv) => true);
            setLoding(false)
          })
          .catch((error) => {
            console.log(error);
            setLogedIn((prv) => false);
            setLoding(false)
          });
      })();
    }
  }, []);
  return (
    <div>
      {loding ? (
         <Box sx={{ width: '100%' }}>
         <LinearProgress />
       </Box>
      ) : !logedIn ? (
        <Login logding={loding} logIn={login} />
      ) : (
        <>
          <CreateRoom user={user} />
        </>
      )}
    </div>
  );
};

export default Home;
