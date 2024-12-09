import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import UserBar from './components/UserBar'
import CreateBlogForm from './components/CreateBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setNotification] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogCreationVisible, setBlogCreationVisible] = useState(false)
  const [reload, setReload] = useState(null)

  const hideWhenVisible = { display: blogCreationVisible ? 'none' : '' }
  const showWhenVisible = { display: blogCreationVisible ? '' : 'none' }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [reload])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggednBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message: 'Wrong credentials', isError: true })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBlogUser')
    setUser(null)
  }

  const createBlog = async (blogToCreate) => {

    try {
      const newBlog = await blogService.create(blogToCreate)

      setBlogs(blogs.concat(newBlog))
      setNotification({ message: `a new blog ${newBlog.title} by ${newBlog.author} added`, isError: false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setBlogCreationVisible(false)
      return newBlog;
    } catch (error) {
      console.error(error)

      setNotification({ message: 'Failed to create blog', isError: true });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }

    return null
  };


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message?.message} isError={message?.isError} />
        <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
      </div>
    )
  } else {
    return (<div>
      <h2>blogs</h2>
      <Notification message={message?.message} isError={message?.isError} />
      <UserBar user={user} handleLogout={handleLogout} />

      <div style={hideWhenVisible}>
        <button onClick={() => setBlogCreationVisible(true)}>new blog</button>
      </div>
      <div style={showWhenVisible}>
        <h2>create new</h2>
        <CreateBlogForm createBlog={createBlog} />
        <button onClick={() => setBlogCreationVisible(false)}>cancel</button>
      </div>

      <BlogList blogs={blogs} setNotification={setNotification} setReload={setReload} />
    </div>
    )
  }
}

export default App