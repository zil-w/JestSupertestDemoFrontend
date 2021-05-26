import React from 'react'
import propTypes from 'prop-types'

const LoginForm = ({ loginHandler, username, setUsername, password, setPassword }) => {
  return(
    <form onSubmit = {loginHandler} >
            Username: <input type='text' id='username' value = {username} onChange={ event => setUsername(event.target.value)}/>
      <br/>
            Password: <input type='password' id='password' value = {password} onChange={ event => setPassword(event.target.value)}/>
      <button type= 'submit' id='login-button'>Login</button>
      {/* <input type="button" value= "submit" onChange = {submitUserInfo}/> */}
    </form>
  )
}

LoginForm.propTypes = {
  loginHandler: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
  setUsername: propTypes.func.isRequired,
  password: propTypes.string.isRequired,
  setPassword: propTypes.func.isRequired
}

export default LoginForm