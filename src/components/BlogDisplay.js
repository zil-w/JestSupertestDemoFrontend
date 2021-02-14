import React from 'react'
import Blog from './Blog'

const BlogDisplay = ({blogs, blogUpdate}) => {//okay we must display an array of component
    const blogsToDisplay = blogs.map(blog => <Blog key={blog.id} blog={blog} blogUpdate = {blogUpdate}/>)
    return(<>
        <h2>Blogs:</h2>
        <br/>
        {blogsToDisplay}
    </>)
}

export default BlogDisplay