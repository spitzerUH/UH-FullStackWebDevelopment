import React, { useState } from 'react';

const CreateBlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newBlog = await createBlog({ title, author, url });
        if (newBlog) {
            setTitle('');
            setAuthor('');
            setUrl('');
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                Title:
                <input
                    type="text"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                Author:
                <input
                    type="text"
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                URL:
                <input
                    type="text"
                    value={url}
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">Create</button>
        </form>
    );
};

export default CreateBlogForm;