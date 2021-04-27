import React, {useEffect} from 'react'
import Blog from './Blog'
import { blogActions } from '../reducers/reducers'
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogs'

const BlogDisplay = ({ blogUpdate, blogDelete }) => {//okay we must display an array of component

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

  const blogs = useSelector(state => state.blogs.sort(likesComparator))
  const dispatch = useDispatch()

  useEffect(() => {
    const setInitialBlogs = async () => { //we need to do this because effect hooks are made synchronous to avoid race condition
      const blogs = await blogService.getAll()
      dispatch(blogActions.initiateBlogs(blogs))
    }

    setInitialBlogs()
  }, [dispatch])


  const loggedInName = window.localStorage.getItem('name')
  const blogsToDisplay = blogs.map(blog => <Blog key={blog.id} blog={blog} blogUpdate = {blogUpdate} blogDelete = {blogDelete} loggedInName = {loggedInName}/>)
  return(<>
    <h2>Blogs:</h2>
    <br/>
    {blogsToDisplay}
  </>)
}

export default BlogDisplay