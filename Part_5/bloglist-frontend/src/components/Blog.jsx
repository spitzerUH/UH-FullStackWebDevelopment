import { useState } from 'react';

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <span>{blog.title} {blog.author}</span>
      <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      {visible && (
        <div className='blog-details'>
          <div>{blog.url}</div>
          <div>{`likes: ${blog.likes}`} <button onClick={() => handleLike(blog)}>like</button></div>
          <div>{blog?.user?.name}</div>
          <button onClick={() => handleDelete(blog)}>remove</button>
        </div>)}
    </div>);
};

export default Blog