import React from 'react';
import blogService from '../services/blogs';
import Blog from './Blog';

const BlogList = ({ blogs, setNotification, setReload }) => {

    const handleLike = (blog) => {
        blog.likes++;
        blogService.update(blog).then(newBlog => {
            setReload(newBlog);
        }).catch((error) => {
            console.error(error)
            setNotification({ message: 'Failed to like blog', isError: true })
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        })
    }


    const handleDelete = (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            blogService.remove(blog.id).then(() => {
                setReload(blog)
                setNotification({ message: `Removed blog ${blog.title} by ${blog.author}`, isError: false })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
            }).catch((error) => {
                console.error(error)
                setNotification({ message: 'Failed to remove blog', isError: true })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
            })
        }
    }

    return (
        <div>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} />
            )}
        </div>
    )
};

export default BlogList;