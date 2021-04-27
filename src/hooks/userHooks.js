import React, { useEffect, useState } from 'react'
import axios from 'axios'
//import getUsers from '../services/users'

const useUsers = async () => { //having an async here makes the whole thing return a promise
    const [users, setUsers] = useState([]) //idk why but let's try sticking the server call inside an useEffect hook?
    
    //const receivedUsers = await getUsers()
    useEffect(() => {
        // const receivedUsers = getUsers()
        // setUsers(receivedUsers)
        axios.get('http://localhost:3003/api/users')
            .then(res => {
                setUsers(res.data)
            })
            .catch(err => console.log('in userHook', err.message))
    }, [])
    return users
}

export default useUsers