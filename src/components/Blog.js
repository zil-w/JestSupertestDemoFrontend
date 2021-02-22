import React, {useState} from 'react'
import Button from './Button'

const Blog = ({ blog, blogUpdate, blogDelete }) => {
  const [show, setShow] = useState(false)
  const showWhenShown = {display: (show ? '' : 'none')}

  const toggleShow = () => {
    setShow(!show)
  }

  const addLike = async () => {
    const newBlog = {...blog, likes: blog.likes + 1}
    await blogUpdate(newBlog)
  }
  
  const deleteBlog = async () => {
    const shouldDelete = window.confirm('Would you like to delete this blog?')
    if(shouldDelete){
      await blogDelete(blog.id)
    }
  }

  const blogStyle = { //taken from fullstackopen, https://fullstackopen.com/en/part5/props_children_and_proptypes
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
    <div style = {blogStyle}>
      {blog.title} {blog.author} <Button name = {show ? 'Hide' : 'Show'}  action = {toggleShow}/>
        <div style = {showWhenShown}>
          URL: {blog.url}<br/>
          likes: {blog.likes}
          <Button name = 'like' action = {addLike}/>
          <Button name = 'delete' action = {deleteBlog}/>
        </div>
    </div>
  )
}


export default Blog
