import axios from 'axios'//I don't remember how routing worked
const tempUrl = 'http://localhost:3003'
const baseUrl = '/api/blogs'
const loginUrl = '/api/'

const getAll = async () => {
  try{
    const response = await axios.get(tempUrl + baseUrl)
    return response.data
  }
  catch(error){
    throw error
  }
}

const authenticateUser = async (username, password) => {
  try{
    const loginRes = await axios.post(tempUrl + loginUrl, {username, password})
    return loginRes.data
  }
  catch(error){
    throw error
  }
}

const submitBlog = async (title, url, author, token) => {
  try{
    const blogSubRes = await axios.post(tempUrl + baseUrl, {title, url, author}, {headers:{'Authorization': `bearer ${token}`}})
    return blogSubRes.data
  }
  catch(error){
    throw error
  }
}

const updateBlog = async updatedBlog => {
  try{
    delete updatedBlog.user //this property makes mongoose's findByIdAndUpdate method throw a cast error, for objectID, for some reason
    const updateBlogRes = await axios.put(tempUrl + baseUrl + `/${updatedBlog.id}`, updatedBlog)
    return updateBlogRes.data
  }
  catch(error){
    throw error
  }
}

const deleteBlog = async blogID => {
  try{
    const updateBlogRes = await axios.delete(tempUrl + baseUrl + `/${blogID}`)
    return updateBlogRes.data
  }
  catch(error){
    throw error
  }
}

export default { getAll, authenticateUser, submitBlog, updateBlog, deleteBlog }