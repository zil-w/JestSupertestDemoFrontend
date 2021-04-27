import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {blogActions} from '../reducers/reducers'

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

const BlogView = () => {
    const blogID = useParams().id
    const blog = useSelector(state => {
        return state.blogs.filter(blog => blog.id === blogID)
    })

    if (blog.length > 0) {
        
    }
    else {
        return <h1>Try backstep in your browser...</h1>
    }
}

export default BlogView