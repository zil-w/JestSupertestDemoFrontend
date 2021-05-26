import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { blogActions } from '../reducers/reducers'
import Button from './Button'

//we can maybe use thunk to abstract away the axios call from app.js

//blog schema
/*
title: String,
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
*/

//we need to change the stored user info to store the whole user as well, using just name is filmsy

const BlogView = () => {
  const blogID = useParams().id

  const blog = useSelector(state => {
    return state.blogs.filter(blog => blog.id === blogID)
  })

  const dispatch = useDispatch()

  const likeHandler = (blog) => {
    //console.log('blog received by handler', blog)
    blog.likes += 1
    //console.log('blog treated by handler', blog)
    dispatch(blogActions.syncLikeBlog(blog))
  }

  const deleteHandler = (blog) => {
    dispatch(blogActions.syncDeleteBlog(blog))
  }

  if (blog.length > 0) {
    return (
      <>
        <h1>Blog submission:</h1><br />
        Title: {blog[0].title}<br />
        Author: {blog[0].author}<br />
        URL: {blog[0].url}<br />
        likes: {blog[0].likes}<br />
        <Button name='like' action={()=>likeHandler(blog[0])} />
        {(blog[0].user) &&
          (blog[0].user.name === localStorage.getItem('name')) &&
          <Button name='delete' action={()=>deleteHandler(blog[0])}/>
        }
      </>
    )
  }
  else {
    return <h1>Try backstep in your browser...</h1>
  }
}

export default BlogView