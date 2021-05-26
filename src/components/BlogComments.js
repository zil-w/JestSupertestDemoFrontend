import React, { useState } from 'react'
import Button from './Button'

const BlogComments = ({ comments }) => {
    const [comment, setComment] = useState('')
    const submitComment = () => {
        console.log('wow', comment)
    }

    return (
        <div>
            <h1>Leave a comment:</h1> <br />
            <input type='text' value={comment} onChange={event => { setComment(event.target.value) }}></input>
            <Button name={'Submit'} action={submitComment} />
            {comments.length > 0 &&
                <>
                    <h2>Comments:</h2> <br />
                    <ul>
                        {comments.map(userComment => <li>{userComment}</li>)}
                    </ul>
                </>
            }
        </div>
    )

}

export default BlogComments