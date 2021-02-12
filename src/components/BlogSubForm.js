import React from 'react'

const BlogSubForm = ({formSubHandler , title, setTitle, url, setURL, author, setAuthor}) => {
    return(
        <form onSubmit = {formSubHandler}>
            <input type='text' name = 'Title' value ={title} onChange={event => setTitle(event.target.value)}/>
            <input type='text' name = 'Blog URL'  value ={url} onChange={event => setURL(event.target.value)}/>
            <input type='text' name = 'Blog Author' value ={author} onChange={event => setAuthor(event.target.value)}/>
            <input type="submit" value = 'add blog'/>
        </form>
    )
}

export default BlogSubForm