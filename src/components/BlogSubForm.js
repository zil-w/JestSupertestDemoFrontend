import React from 'react'

const BlogSubForm = ({formSubHandler ,setTitle, setURL, setAuthor}) => {
    return(
        <form onSubmit = {formSubHandler}>
            <input type='text' onChange={event => setTitle(event.target.value)}/>
            <input type='text'onChange={event => setURL(event.target.value)}/>
            <input type='text'onChange={event => setAuthor(event.target.value)}/>
            <input type="submit" value = 'add blog'/>
        </form>
    )
}

export default BlogSubForm