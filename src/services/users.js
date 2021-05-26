import axios from 'axios'
//const tempUrl = 'http://localhost:3003'
const tempUrl = ''
const userUrl = '/api/users'

const getUsers = async () => {
    const userList = await axios.get(tempUrl + userUrl)
    console.log('in users service', userList.data)
    return userList.data
}

export default getUsers