import React, {useState} from 'react'

const BlogSubForm = ({formSubHandler}) => {
    const [blogTitle, setBlogTitle] = useState('')
    const [blogURL, setBlogURL] = useState('')
    const [blogOwner, setBlogOwner] = useState('')

    const clearBlogInput = () => {
        setBlogTitle('')
        setBlogURL('')
        setBlogOwner('')
    }

    const submitForm = async event => {
        event.preventDefault()
        const subSuccess = await formSubHandler(blogTitle, blogURL, blogOwner)
        console.log('blog submission status:', subSuccess)
        if(subSuccess){
            clearBlogInput()
        }
    }


    return(
        <form onSubmit = {submitForm}>
            <label htmlFor="Title">Title:</label>
            <input type='text' id = 'Title' value ={blogTitle} onChange={event => setBlogTitle(event.target.value)}/><br/>
            <label htmlFor="Blog URL">Blog URL:</label>
            <input type='text' id = 'Blog URL'  value ={blogURL} onChange={event => setBlogURL(event.target.value)}/><br/>
            <label htmlFor="Blog Author">BlogAuthor:</label>
            <input type='text' id = 'Blog Author' value ={blogOwner} onChange={event => setBlogOwner(event.target.value)}/><br/>
            <input type="submit" value = 'add blog'/>
        </form>
    )
}

export default BlogSubForm