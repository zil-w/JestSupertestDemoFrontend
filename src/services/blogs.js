import axios from 'axios'//I don't remember how routing worked
const tempUrl = 'http://localhost:3003'
const baseUrl = '/api/blogs'
const loginUrl = '/api/'
const userUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(tempUrl + baseUrl)
  return response.data
}

const authenticateUser = async (username, password) => {
  const loginRes = await axios.post(tempUrl + loginUrl, { username, password })
  return loginRes.data
}

const submitBlog = async (title, url, author, token) => {
  const blogSubRes = await axios.post(tempUrl + baseUrl, { title, url, author }, { headers:{ 'Authorization': `bearer ${token}` } })
  return blogSubRes.data
}

const updateBlog = async updatedBlog => {
  delete updatedBlog.user //this property makes mongoose's findByIdAndUpdate method throw a cast error, for objectID, for some reason
  const updateBlogRes = await axios.put(tempUrl + baseUrl + `/${updatedBlog.id}`, updatedBlog)
  return updateBlogRes.data //this wasn't giving me the user property in expected format because I forgot to do .populate in mongoose, so it was just returning the userID instead of the whole object
}

const deleteBlog = async blogID => {
  const updateBlogRes = await axios.delete(tempUrl + baseUrl + `/${blogID}`)
  return updateBlogRes.data
}



export default { getAll, authenticateUser, submitBlog, updateBlog, deleteBlog}