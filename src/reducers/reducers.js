import blogService from '../services/blogs'

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USERS': {
      return action.data
    }
    case 'RESET_USER': {
      return []
    }
    default: {
      return state
    }
  }
}

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BLOGS': {
      return action.data
    }
    case 'ADD_BLOG': {
      return state.concat(action.data)
    }
    case 'LIKE_BLOG': {
      return state.map(blog => (blog.id === action.data.id) ? action.data : blog)
    }
    case 'DELETE_BLOG': {
      return state.filter(blog => (blog.id !== action.data.id))
    }
    default: {
      return state
    }
  }
}

const userReducer = (state = '', action) => {//we can probably have loggedIn in here as well
  switch (action.type) {
    case 'SET_USER': {
      return action.data.name
    }
    case 'RESET_USER': {
      return ''
    }
    default: {
      return state
    }
  }
}

const notificationReducer = (state = { message: '', isError: false }, action) => {
  switch (action.type) {
    case 'SET_SUCCESS': {
      return { message: action.data, isError: false }
    }
    case 'SET_FAILURE': {
      return { message: action.data, isError: true }
    }
    case 'RESET': {
      return { message: '', isError: false }
    }
    default: {
      return state
    }
  }
}

const notifySuccess = data => {
  return {
    type: 'SET_SUCCESS',
    data
  }
}

const notifyFailure = data => {
  return {
    type: 'SET_FAILURE',
    data
  }
}

const notifyReset = () => {
  return {
    type: 'RESET'
  }
}

const initiateBlogs = blogs => {
  return {
    type: 'SET_BLOGS',
    data: blogs
  }
}

const setUser = user => {
  return {
    type: 'SET_USER',
    data: user
  }
}

const resetUser = () => {
  return {
    type: 'RESET_USER'
  }
}

const addBlog = blog => {
  return {
    type: 'ADD_BLOG',
    data: blog
  }
}

const likeBlog = blog => {
  return {
    type: 'LIKE_BLOG',
    data: blog
  }
}

const deleteBlog = blog => {
  return {
    type: 'DELETE_BLOG',
    data: blog
  }
}

const syncLikeBlog = blog => { //it seems like we could delegate a lot of axios request to the action creators
  return async dispatch => {
    const updatedBlog = await blogService.updateBlog(blog)
    dispatch({
      type: 'LIKE_BLOG',
      data: updatedBlog
    })
  }
}

const syncDeleteBlog = blog => {
  return async dispatch => {
    const deletedBlog = await blogService.deleteBlog(blog.id)
    dispatch({
      type: 'DELETE_BLOG',
      data: deletedBlog
    })
  }
}

const setUsers = users => {
  return {
    type: 'SET_USERS',
    data: users
  }
}

const resetUsers = users => {
  return {
    type: 'RESET_USERS'
  }
}

const reducers = { notificationReducer, blogReducer, userReducer, usersReducer}

export const msgActions = { notifySuccess, notifyFailure, notifyReset }
export const blogActions = {
  initiateBlogs,
  addBlog,
  likeBlog,
  deleteBlog,
  syncDeleteBlog,
  syncLikeBlog
}
export const userActions = {
  setUser,
  resetUser
}

export const usersActions = {
  setUsers,
  resetUsers
}
export default reducers