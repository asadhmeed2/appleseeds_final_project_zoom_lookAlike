import React from "react";
import { useNavigate } from "react-router-dom";
import "./register.style.css";
import { Grid, TextField, Paper, Button } from "@material-ui/core";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [varifyPassword, setVarifyPassword] = React.useState("");
  const [secritCode, setSecritCode] = React.useState("");
  const [loding, setLoding] = React.useState(false);
  const secritCodeErrorRef = React.useRef();
  const usernameErrorRef = React.useRef();
  const emailErrorRef = React.useRef();
  const passwordErrorRef = React.useRef();
  const varifyPasswordErrorRef = React.useRef();
  const handleRegister = () => {
    setLoding(true);
    if (username === "") {
      usernameErrorRef.current.innerHTML = `<span style={{color="rad"}}>email is required</span>`;
    }
    if (email === "") {
      emailErrorRef.current.innerHTML = `<span style={{color="rad"}}>email is required</span>`;
    }
    if (password === "") {
      passwordErrorRef.current.innerHTML = `<span style={{color="rad"}}>password is required</span>`;
    }
    if (varifyPassword === "") {
      varifyPasswordErrorRef.current.innerHTML = `<span style={{color="rad"}}>varify password is required</span>`;
    }
    if (secritCode === "") {
      secritCodeErrorRef.current.innerHTML = `<span style={{color="rad"}}>secrit code is required</span>`;
    }
    if (password !== varifyPassword) {
      varifyPasswordErrorRef.current.innerHTML = `<span style={{color="rad"}}>passwords are not the same</span>`;
    } else {
      let data = {
        userName: username,
        email: email,
        password: password,
        varifyPassword: varifyPassword,
        registerNumber: secritCode,
      };
      // axios.post('http://localhost:4000/register',data).then(response =>{
      axios
        .post(
          "https://asad-zoom-look-alike-server.herokuapp.com/register",
          data
        )
        .then((response) => {
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setLoding(false);
  };
  return (
    <div className="register-container">
      <div style={{ padding: 30 }}>
        <Paper className="register">
          <Grid
            container
            spacing={3}
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item xs={12}>
              <TextField
                label="userName"
                type="text"
                value={username}
                onFocus={(e) => {
                  usernameErrorRef.current.innerHTML = "";
                }}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <div className="error" ref={usernameErrorRef}></div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="email"
                type="email"
                value={email}
                onFocus={(e) => {
                  emailErrorRef.current.innerHTML = "";
                }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <div className="error" ref={emailErrorRef}></div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type={"password"}
                value={password}
                onFocus={(e) => {
                  passwordErrorRef.current.innerHTML = "";
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <div className="error" ref={passwordErrorRef}></div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="varify Password"
                type={"password"}
                value={varifyPassword}
                onFocus={(e) => {
                  varifyPasswordErrorRef.current.innerHTML = "";
                }}
                onChange={(e) => {
                  setVarifyPassword(e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <div className="error" ref={varifyPasswordErrorRef}></div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="secrit code"
                type="text"
                value={secritCode}
                onFocus={(e) => {
                  secritCodeErrorRef.current.innerHTML = "";
                }}
                onChange={(e) => {
                  setSecritCode(e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <div className="error" ref={secritCodeErrorRef}></div>
            </Grid>
            <Grid item xs={12}>
              <Button disabled={loding} fullWidth onClick={handleRegister}>
                {" "}
                Register{" "}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default Register;
