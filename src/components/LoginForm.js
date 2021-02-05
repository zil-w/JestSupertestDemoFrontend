import React from 'react'

const LoginForm = ({loginHandler, setUsername, setPassword}) => {
    return(
        <form onSubmit = {loginHandler} >
            Username: <input type="text" onChange={ event => setUsername(event.target.value)}/>
            <br/>
            Password: <input type="text" onChange={ event => setPassword(event.target.value)}/>
            <input type= "submit" />
            {/* <input type="button" value= "submit" onChange = {submitUserInfo}/> */}
      </form>
    )
}

export default LoginForm