import React, { useState, useEffect, useRef } from 'react'
import BlogDisplay from './components/BlogDisplay'
import blogService from './services/blogs'
import LoginForm  from './components/LoginForm'
import Button from './components/Button'
import BlogSubForm from './components/BlogSubForm'
import SystemMessage from './components/SystemMessage'
import Toggle from './components/Toggle'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [name, setName] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [sysMsg, setSysMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const toggleRef = useRef()

  const likesComparator = (firstBlog, secondBlog) => {//going for descending order
    if(firstBlog.likes > secondBlog.likes){
      return -1
    }
    else if(secondBlog.likes > firstBlog.likes){
      return 1
    }
    else{
      return 0
    }
  }

  useEffect(() => {
    const setInitialBlogs = async () => { //we need to do this because effect hooks are made synchronous to avoid race condition
      const blogs = await blogService.getAll()
      blogs.sort(likesComparator)
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
    setTimeout(() => changeSysMsg(false, ''), timeout)
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

  //actually we don't need this at all because newly submitted blogs have zero like
  // const insertElementAtIndex = (element, index, array) => {//can add spread notation to element to insert many elements
  //   //we can do splice(index, #elements to delete, element) but it mutates the original array
  //   const updatedArray = [
  //     ...array.slice(0, index),
  //     element,
  //     ...array.slice(index)
  //   ]
  // }

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

  const blogUpdateHandler = async updatedBlog => {
    try{
      const submittedUpdate = await blogService.updateBlog(updatedBlog)
      const updatedBlogs = blogs.map(blog => (blog.id === submittedUpdate.id) ? submittedUpdate : blog)
      updatedBlogs.sort(likesComparator) // performance with this might be bad, maybe we can insert the updated blogs by likes and before that/then remove the overwritten blog
      setBlogs(updatedBlogs)
    }
    catch(error){
      console.log('failed to update blog:', error)
      changeSysMsg(true, error.response.data.error)
      resetSysMsg(3000)
    }
  }

  const blogDeleteHandler = async blogID => {
    try{
      const deletedBlog = await blogService.deleteBlog(blogID)
      const updatedBlogs = []
      for(const blog of blogs){
        if(blog.id !== deletedBlog.id)
          updatedBlogs.push(blog)
      }
      setBlogs(updatedBlogs)
    }
    catch(error){
      console.log('failed to delete blog:', error)
      changeSysMsg(true, error.response.data.error)
      resetSysMsg(3000)
    }
  }

  return (
    <div>
      <SystemMessage isError = {isError} sysMsg = {sysMsg}/>
      {!loggedIn && <LoginForm loginHandler={loginHandler} username = {username} setUsername={setUsername} password ={password} setPassword={setPassword}/>}
      {loggedIn &&
        <div>
          <h2>Hello {name}!</h2>
          <Button name={'log out'} action={logoutHandler}/>
          <Toggle ref = {toggleRef} showButtonName = 'Add Blog' hideButtonName = 'Cancel'>
            <BlogSubForm formSubHandler={blogSubHandler}/>
          </Toggle>
          <BlogDisplay blogs = {blogs} blogUpdate = {blogUpdateHandler} blogDelete = {blogDeleteHandler}/>
        </div>
      }
    </div>
  )
}

export default App