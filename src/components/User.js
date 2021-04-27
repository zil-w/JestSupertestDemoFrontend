import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
    const id = useParams().id
    const user = useSelector(state => {
        return state.users.filter(user => user.id === id)
    })

    if (user.length > 0) {
        return (
            <>
            <h1>
                {`This is user: ${user[0].name}`}
            </h1>
            <br />
                His submitted blogs are <br />
                <ul>
                    {user[0].blogs.map(blog => {
                        return (
                            <li>
                                {blog.title}
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    }
    else {//okay refresh fails on this, the redux store doesn't persist on storage, we need to either store to localstorage, use a hot load library, or use something from thunk
        return <h1>Try backstep in your browser...</h1>
    }


}

export default User