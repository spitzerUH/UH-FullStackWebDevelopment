import React from 'react';
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { createAne } from '../reducers/anecdoteReducer'
import { clearNotification, setNotification } from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdotes';
const AnecdoteForm = () => {
    const [newAnecdote, setNewAnecdote] = useState('')
    const dispatch = useDispatch();

    const createAnecdote = async (event) => {
        event.preventDefault()

        const newAne = await anecdoteService.createNew(newAnecdote)
        dispatch(createAne(newAne))
        dispatch(setNotification(`You created '${newAnecdote}'`))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)

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