import React, { useState, useEffect, useRef } from 'react'
import BlogDisplay from './components/BlogDisplay'
import blogService from './services/blogs'
import LoginForm  from './components/LoginForm'
import Button from './components/Button'
import BlogSubForm from './components/BlogSubForm'
import SystemMessage from './components/SystemMessage'
import Toggle from './components/Toggle'
//let's try and refractor the axios requests to use await/asynch
//let's make it so that your blog posting function:
//show up as  submit blog button (done)
//onclick, it expands into the actual form with a cancel button (done)
//on submission or cancellation the form is cleared and retracted (done)
//-we could use a wrapper component for visibility (done)
//make use of ref, React.forwardRef and useImperativeHandler, so you can access wrapper component's visibility from app (done)
//move the states for form to the form component (done, but we need to find a way to modify a variable out of .then, done)

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [name, setName] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [sysMsg, setSysMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const toggleRef = useRef()

  useEffect(() => {
    const setInitialBlogs = async () => { //we need to do this because effect hooks are made synchronous to avoid race condition
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      if(window.localStorage.getItem('token') !== null){
        setLoggedIn(true)
      }
      if(window.localStorage.getItem('name') !== null){
        setName(window.localStorage.getItem('name'))
      }
    }

    setInitialBlogs()
  }, [])

  const clearLoginInput = () => {
    setUsername('')
    setPassword('')
  }

  const changeSysMsg = (isError, sysMsg) => {
    setIsError(isError)
    setSysMsg(sysMsg)
  }

  const resetSysMsg = timeout => {
    setTimeout(()=> changeSysMsg(false, ''), timeout)
  }

  const loginHandler = async event => {//we need to have some type of error handling here
    event.preventDefault()//this is important!
    try{
      const authResult = await blogService.authenticateUser(username, password)

      if(authResult.token){
        window.localStorage.setItem('token', authResult.token)
        window.localStorage.setItem('name', authResult.name)
        setLoggedIn(true)
        setName(authResult.name)
        clearLoginInput()
        changeSysMsg(false, 'Successfully logged in.')
      }
      else{
        changeSysMsg(true, 'Failed to logg in.')
      }
    }
    catch(error){
      changeSysMsg(true, `Something went wrong: ${error.response.data.error}`)
    }
    resetSysMsg(3000)
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('name')
    setLoggedIn(false)
    setName('')
  }

  const blogSubHandler = async (blogTitle, blogURL, blogOwner) => {
    let subSuccess = false

    try{
      const addedBlog = await blogService.submitBlog(blogTitle, blogURL, blogOwner, window.localStorage.getItem('token'))
      setBlogs(blogs.concat(addedBlog))
      changeSysMsg(false, 'Blog submission successful.')
      toggleRef.current.toggleVisibility()//hide the blog submission form
      subSuccess = true
    }
    catch(error){
      console.log('blog submission failed', error.response.data.error)
      changeSysMsg(true, error.response.data.error)
    }

    resetSysMsg(3000)
    return subSuccess
  }

  return (
    <div>
      <SystemMessage isError = {isError} sysMsg = {sysMsg}/>
      {!loggedIn && <LoginForm loginHandler={loginHandler} username = {username} setUsername={setUsername} password ={password} setPassword={setPassword}/>}
      {loggedIn &&
        <div>
          <h2>Hello {name}!</h2>
          <Button name={'log out'} action={logoutHandler}/>
          <Toggle ref = {toggleRef}>
            <BlogSubForm formSubHandler={blogSubHandler}/>
          </Toggle>
          <BlogDisplay blogs = {blogs}/>
        </div>
      }
    </div>
  )
}

export default App