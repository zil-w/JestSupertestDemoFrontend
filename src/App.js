import React, { useState, useEffect, useRef } from 'react'
import BlogDisplay from './components/BlogDisplay'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Button from './components/Button'
import BlogSubForm from './components/BlogSubForm'
import SystemMessage from './components/SystemMessage'
import Toggle from './components/Toggle'
import Users from './components/Users'
import { useDispatch, useSelector } from 'react-redux'
import { msgActions, blogActions, userActions } from './reducers/reducers'
import { Route, Link, Switch } from 'react-router-dom'
import User from './components/User'
/*
to-do
-add a get user service (done)
-in backend look up the endpoint that returns a list of user (already there)
-add a component that renders all the users (done)
-make the username into links
-add a route in app.js that takes an id after /user/
-look up how to do variable URL and getting a segment of url from the component in note
-make the single User component render a list of names of all their blogs
-make the all users page prettier
*/

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  // const [sysMsg, setSysMsg] = useState('')
  // const [isError, setIsError] = useState(false)
  const dispatch = useDispatch()
  const msgState = useSelector(state => state.notification)
  const userState = useSelector(state => state.user)
  const toggleRef = useRef()

  useEffect(() => {
    const setInitialBlogs = async () => { //we need to do this because effect hooks are made synchronous to avoid race condition
      const blogs = await blogService.getAll()
      //blogs.sort(likesComparator)
      setBlogs(blogs)
      if (window.localStorage.getItem('token') !== null && window.localStorage.getItem('name') !== null) {
        setLoggedIn(true)
        //setName(window.localStorage.getItem('name'))
        dispatch(userActions.setUser({ name: window.localStorage.getItem('name') }))
      }
    }

    setInitialBlogs()
  }, [])

  const clearLoginInput = () => {
    setUsername('')
    setPassword('')
  }

  const showSuccessMsg = (sysMsg) => {
    dispatch(msgActions.notifySuccess(sysMsg))
  }

  const showFailMsg = (sysMsg) => {
    dispatch(msgActions.notifyFailure(sysMsg))
  }

  const resetSysMsg = timeout => {
    setTimeout(() => dispatch(msgActions.notifyReset()), timeout)
  }

  const loginHandler = async event => {//we need to have some type of error handling here
    event.preventDefault()//this is important!
    try {
      const authResult = await blogService.authenticateUser(username, password)

      if (authResult.token) {
        window.localStorage.setItem('token', authResult.token)
        window.localStorage.setItem('name', authResult.name)
        setLoggedIn(true)
        //setName(authResult.name)
        dispatch(userActions.setUser(authResult))
        clearLoginInput()
        showSuccessMsg('Successfully logged in.')
      }
      else {
        showFailMsg('Authentication failed.')
      }
    }
    catch (error) {
      showFailMsg(`Something went wrong: ${error.response.data.error}`)
    }
    resetSysMsg(3000)
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('name')
    setLoggedIn(false)
    //setName('')
    dispatch(userActions.resetUser())
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

    try {
      const addedBlog = await blogService.submitBlog(blogTitle, blogURL, blogOwner, window.localStorage.getItem('token'))
      // setBlogs(blogs.concat(addedBlog))
      dispatch(blogActions.addBlog(addedBlog))
      showSuccessMsg('Blog submission successful.')
      toggleRef.current.toggleVisibility()//hide the blog submission form
      subSuccess = true
    }
    catch (error) {
      console.log('blog submission failed', error.response.data.error)
      showFailMsg(error.response.data.error)
    }
    resetSysMsg(3000)
    return subSuccess
  }

  const blogUpdateHandler = async updatedBlog => {
    try {
      const submittedUpdate = await blogService.updateBlog(updatedBlog)
      //console.log('the update that we have received is', submittedUpdate)
      //const updatedBlogs = blogs.map(blog => (blog.id === submittedUpdate.id) ? submittedUpdate : blog)
      //updatedBlogs.sort(likesComparator) // performance with this might be bad, maybe we can insert the updated blogs by likes and before that/then remove the overwritten blog
      dispatch(blogActions.likeBlog(submittedUpdate))
      //setBlogs(updatedBlogs)
    }
    catch (error) {
      //console.log('failed to update blog:', error)
      showFailMsg(error.response.data.error)
      resetSysMsg(3000)
    }
  }

  const blogDeleteHandler = async blogID => {
    try {
      const deletedBlog = await blogService.deleteBlog(blogID)
      // const updatedBlogs = []
      // for(const blog of blogs){
      //   if(blog.id !== deletedBlog.id)
      //     updatedBlogs.push(blog)
      // }
      dispatch(blogActions.deleteBlog(deletedBlog))
      //setBlogs(updatedBlogs)
    }
    catch (error) {
      console.log('failed to delete blog:', error)
      showFailMsg(error.response.data.error)
      resetSysMsg(3000)
    }
  }

  return (
    <Switch>
      <Route path='/users/:id'>
        <User/>
      </Route>
      <Route path='/users'>
        <Users/>
      </Route>
      <Route path='/blogs/:id'>
        <BlogView/>
      </Route>
      <Route path='/'>
        <div>
          {msgState.message && <SystemMessage /> /*it seems like this prevents systemMessage's logic getting re-executed on every app re-render*/}
          {!loggedIn && <LoginForm loginHandler={loginHandler} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />}
          {loggedIn &&
            <div>
              <h2>Hello {userState}!</h2>
              <Button name={'log out'} action={logoutHandler} />
              <Toggle ref={toggleRef} showButtonName='Add Blog' hideButtonName='Cancel'>
                <BlogSubForm formSubHandler={blogSubHandler} />
              </Toggle>
              <BlogDisplay blogs={blogs} blogUpdate={blogUpdateHandler} blogDelete={blogDeleteHandler} />
            </div>
          }
        </div>
      </Route>
    </Switch>
  )
}

export default App