import React from 'react';
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { createAne } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const [newAnecdote, setNewAnecdote] = useState('')
    const dispatch = useDispatch();

    const createAnecdote = (event) => {
        event.preventDefault()
        dispatch(createAne(newAnecdote))
        setNewAnecdote('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={createAnecdote}>
                <div><input value={newAnecdote} onChange={({ target }) => setNewAnecdote(target.value)} /></div>
                <button type="submit">create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;