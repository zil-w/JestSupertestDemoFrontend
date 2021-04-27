import React, { useEffect } from 'react'
import getUsers from '../services/users'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { usersActions } from '../reducers/reducers'
//okay the custom hook is messing this up, let's make it work first

const Users = () => {
    const users = useSelector(state => state.users)
    const dispatch = useDispatch()

    useEffect(() => {
        const setInitialUsers = async () => {
            const receivedUsers = await getUsers()
            dispatch(usersActions.setUsers(receivedUsers))
        }

        setInitialUsers()
    }, [dispatch])

    if (users.length > 0) {
        return (
            <>
                <h1>Users information:</h1>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <b>user</b>
                            </td>
                            <td>
                                <b>blog(s) created</b>
                            </td>
                        </tr>
                        {
                            users.map(user => {
                                return (
                                    <tr key = {user.id}>
                                        <td>
                                            <Link to={{
                                                pathname: `/users/${user.id}`,
                                                state: {
                                                    userInfo: user
                                                }
                                            }}>
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td>
                                            {user.blogs.length}
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </>
        )
    }
    else {
        return <h1>Waiting </h1>
    }
}

export default Users