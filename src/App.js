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
import { Route, useHistory, Switch } from 'react-router-dom'
import User from './components/User'
import BlogView from './components/BlogView'
import NavMenu from './components/NavMenu'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const dispatch = useDispatch()
  const msgState = useSelector(state => state.notification)
  const userState = useSelector(state => state.user)
  const toggleRef = useRef()
  const history = useHistory()

  useEffect(() => {
    const setInitialBlogs = async () => { //we need to do this because effect hooks are made synchronous to avoid race condition
      if (window.localStorage.getItem('token') !== null && window.localStorage.getItem('name') !== null) {
        setLoggedIn(true)
        dispatch(userActions.setUser({ name: window.localStorage.getItem('name') }))
      }
    }

    setInitialBlogs()
  }, [dispatch])

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

  const loginHandler = async event => {
    event.preventDefault()
    try {
      const authResult = await blogService.authenticateUser(username, password)

      if (authResult.token) {
        window.localStorage.setItem('token', authResult.token)
        window.localStorage.setItem('name', authResult.name)
        setLoggedIn(true)
        dispatch(userActions.setUser(authResult))
        clearLoginInput()
        showSuccessMsg('Successfully logged in.')
      }
      else {
        showFailMsg('Authentication failed.')
      }
    }
    catch (error) {
      console.log('detecting error', error)
      showFailMsg(`Something went wrong: ${error.response.data.error}`)
    }
    resetSysMsg(3000)
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('name')
    setLoggedIn(false)
    dispatch(userActions.resetUser())
    history.push('/')
  }

  const blogSubHandler = async (blogTitle, blogURL, blogOwner) => {
    let subSuccess = false

    try {
      const addedBlog = await blogService.submitBlog(blogTitle, blogURL, blogOwner, window.localStorage.getItem('token'))
      dispatch(blogActions.addBlog(addedBlog))
      showSuccessMsg('Blog submission successful.')
      toggleRef.current.toggleVisibility()//hide the blog submission form after successful submission
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
      dispatch(blogActions.likeBlog(submittedUpdate))
    }
    catch (error) {
      showFailMsg(error.response.data.error)
      resetSysMsg(3000)
    }
  }

  const blogDeleteHandler = async blogID => {
    try {
      const deletedBlog = await blogService.deleteBlog(blogID)
      dispatch(blogActions.deleteBlog(deletedBlog))
    }
    catch (error) {
      console.log('failed to delete blog:', error)
      showFailMsg(error.response.data.error)
      resetSysMsg(3000)
    }
  }

  if (userState !== '') {
    return (
      <>
        {msgState.message && <SystemMessage /> /*it seems like this prevents systemMessage's logic getting re-executed on every app re-render*/}
        <NavMenu name={userState} logoutHandler={logoutHandler} />
        <Switch>
          <Route path='/users/:id'>
            <User />
          </Route>
          <Route path='/users'>
            <Users />
          </Route>
          <Route path='/blogs/:id'>
            <BlogView />
          </Route>
          <Route path='/'>
            <div>
              {loggedIn &&
                <div>
                  <h2>Hello {userState}!</h2>
                  <Button name={'log out'} action={logoutHandler} />
                  <Toggle ref={toggleRef} showButtonName='Add Blog' hideButtonName='Cancel'>
                    <BlogSubForm formSubHandler={blogSubHandler} />
                  </Toggle>
                  <BlogDisplay blogUpdate={blogUpdateHandler} blogDelete={blogDeleteHandler} />
                </div>
              }
            </div>
          </Route>
        </Switch>
      </>
    )
  }
  else {
    return (
      <>
        {msgState.message && <SystemMessage />}
        <Switch>
          <Route path='/'>
            <LoginForm loginHandler={loginHandler} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
          </Route>
        </Switch>
      </>
    )
  }
}

export default App