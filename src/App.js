import React, { useState, useEffect } from 'react'
import BlogDisplay from './components/BlogDisplay'
import blogService from './services/blogs'
import LoginForm  from './components/LoginForm'
import Button from './components/Button'
import BlogSubForm from './components/BlogSubForm'
import SystemMessage from './components/SystemMessage'
//alright we need a login form that disappears once the user is logged in (done)
//react state for user inputs (need fixing)
//jsx form with an input handler or submit event (done)
//input handler which uses the blogService to authenticate info, and return a pass/fail reference (e.g. token), we need to figure out how to route root addr to whatever localhost port backend is running on
//we can save token to local storage once we get it (done)
//conditional rendering of the login form and log out based on reference
//conditional styling based on reference (error red)
//conditional render of an additional form used for submitting a new blog
//conditional styling on submission (green correct)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [sysMsg, setSysMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogURL, setBlogURL] = useState('')
  const [blogOwner, setBlogOwner] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
      if(window.localStorage.getItem('token') !== null){
        setLoggedIn(true)
      }
    })  
  }, [])

  const clearLoginInput = () => {
    setUsername('')
    setPassword('')
  }

  const clearBlogInput = () => {
    //console.log('clearing is being called')
    setBlogTitle('')
    setBlogURL('')
    setBlogOwner('')
  }

  const changeSysMsg = (isError, sysMsg) => {
    setIsError(isError)
    setSysMsg(sysMsg)
  }

  const resetSysMsg = timeout => {
    setTimeout(()=> changeSysMsg(false, ''), timeout)
  }

  const loginHandler = event => {//we need to have some type of error handling here
    event.preventDefault()//this is important!
    console.log('login handler is being called', username, password)
    blogService.authenticateUser(username, password)
    .then(authResult => {
      console.log('result from authentication', authResult)
      if(authResult.token){
        //add token to local storage
        //display a success message
        console.log('we logged in')
        window.localStorage.setItem('token', authResult.token)
        setLoggedIn(true)
        clearLoginInput()
        //setLoggedIn(true)
        changeSysMsg(false, 'Successfully logged in.')
      }
      else{
        //add a set state for error and make error display component visible and time it
        console.log('authentication failed')
        changeSysMsg(true, 'Failed to logg in.')
      }
      resetSysMsg(3000)
    })
    .catch(error =>{
      changeSysMsg(true, 'Something went wrong.')
      resetSysMsg(3000)
      console.log('authentication error', error)
    })//ok this is working nice
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('token')
    setLoggedIn(false)
  }

  const blogSubHandler = event => {
    event.preventDefault()
    blogService.submitBlog(blogTitle, blogURL, blogOwner, window.localStorage.getItem('token'))
    .then(addedBlog => {
      //console.log('submission successful!', addedBlog)
      //clearBlogInput()
      setBlogs(blogs.concat(addedBlog))
      //event.target.reset()
      clearBlogInput()//something is wrong with this, this is not clearning, is it because the actual update functions of the form are defined inside their respective component?
      changeSysMsg(false, 'Blog submission successful.')
      resetSysMsg(3000)
    })
    .catch(error =>{
      console.log('blog submission failed', error)
      changeSysMsg(true, error)
      resetSysMsg(3000)
    })
  }

  //const submitUserInfo = () => loginHandler(username, password)

  return (
    <div>
      <SystemMessage isError = {isError} sysMsg = {sysMsg}/>
      {!loggedIn && <LoginForm loginHandler={loginHandler} username = {username} setUsername={setUsername} password ={password} setPassword={setPassword}/>}
      {loggedIn && <Button name={'log out'} action={logoutHandler}/>}
      {loggedIn && <BlogSubForm formSubHandler={blogSubHandler} title = {blogTitle} setTitle={setBlogTitle} url ={blogURL} setURL={setBlogURL} author ={blogOwner} setAuthor={setBlogOwner}/>}
      {loggedIn && <BlogDisplay blogs = {blogs}/>}
    </div>
  )
}

export default App