import React from 'react'
import {
    Grid,
    TextField,
    Paper,
    Button,
  } from "@material-ui/core";
const Register = () => {
    const [email,setEmail]=React.useState("")
    const [password,setPassword]=React.useState("")
    const [varifyPassword,setVarifyPassword]=React.useState("")
    const [secritCode,setSecritCode]=React.useState("")
    const [loding,setLoding]=React.useState("")
    const secritCodeErrorRef =React.useRef()
    const emailErrorRef =React.useRef()
    const passwordErrorRef =React.useRef()
    const varifyPasswordErrorRef =React.useRef()
    const handleRegister =()=>{
        setLoding(true)
        if((email === "")){
            emailErrorRef.current.innerHTML =`<span style={{color="rad"}}>email is required</span>`
        }else if((password=== "")){
            passwordErrorRef.current.innerHTML =`<span style={{color="rad"}}>password is required</span>`
        }else if((varifyPassword=== "")){
            varifyPasswordErrorRef.current.innerHTML =`<span style={{color="rad"}}>varify password is required</span>`
        }else if((secritCode=== "")){
            secritCodeErrorRef.current.innerHTML =`<span style={{color="rad"}}>secrit code is required</span>`
        }
         let data = {email:email, password: password,varifyPassword:varifyPassword,secritCode:secritCode};
         setLoding(false)
    }
    return (
                <div style={{ padding: 30 }} className="register">
                  <Paper >
                    <Grid
                      container
                      spacing={3}
                      direction={"column"}
                      justify={"center"}
                      alignItems={"center"}
                    >
                      <Grid item xs={12}>
                        <TextField label="email"  type="email" value={email} onFocus={(e)=>{emailErrorRef.current.innerHTML=""}} onChange={(e)=>{setEmail(e.target.value)}} ></TextField>
                      </Grid>
                      <Grid item xs={12}>
                          <div className="error" ref={emailErrorRef}></div>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Password"  type={"password"} value={password} onFocus={(e)=>{passwordErrorRef.current.innerHTML=""}} onChange={(e)=>{setPassword(e.target.value)}}></TextField>
                      </Grid>
                      <Grid item xs={12}>
                          <div className="error" ref={passwordErrorRef}></div>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="varify Password"  type={"password"} value={password} onFocus={(e)=>{varifyPasswordErrorRef.current.innerHTML=""}} onChange={(e)=>{setVarifyPassword(e.target.value)}}></TextField>
                      </Grid>
                      <Grid item xs={12}>
                          <div className="error" ref={varifyPasswordErrorRef}></div>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="secrit code"  type="text" value={email} onFocus={(e)=>{secritCodeErrorRef.current.innerHTML=""}} onChange={(e)=>{setSecritCode(e.target.value)}} ></TextField>
                      </Grid>
                      <Grid item xs={12}>
                          <div className="error" ref={secritCodeErrorRef}></div>
                      </Grid>
                      <Grid item xs={12}>
                        <Button disabled={loding} fullWidth onClick={handleRegister}> Register </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
    )
}

export default Register





