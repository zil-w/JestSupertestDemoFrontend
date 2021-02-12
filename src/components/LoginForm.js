import React from 'react'

const LoginForm = ({loginHandler, username, setUsername, password, setPassword}) => {
    return(
        <form onSubmit = {loginHandler} >
            Username: <input type="text" value = {username} onChange={ event => setUsername(event.target.value)}/>
            <br/>
            Password: <input type="text" value = {password} onChange={ event => setPassword(event.target.value)}/>
            <input type= "submit" />
            {/* <input type="button" value= "submit" onChange = {submitUserInfo}/> */}
      </form>
    )
}

export default LoginForm