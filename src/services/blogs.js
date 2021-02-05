import axios from 'axios'//I don't remember how routing worked
const tempUrl = 'http://localhost:3003'
const baseUrl = '/api/blogs'
const loginUrl = '/api/'

const getAll = () => {
  const request = axios.get(tempUrl + baseUrl)
  return request.then(response => response.data)
}

const authenticateUser = (username, password) => {
  //console.log('received info', username, password)
  const request = axios.post(tempUrl + loginUrl, {username, password})
  return request.then(res => {
    //console.log('received response from server', res.data)
    return res.data})
}

const submitBlog = (title, url, author, token) => {
  const request = axios.post(tempUrl + baseUrl, {title, url, author}, {headers:{'Authorization': `bearer ${token}`}})
  return request.then(res => {
    console.log('received response from server', res.data)
    return res.data})
}

export default { getAll, authenticateUser, submitBlog }