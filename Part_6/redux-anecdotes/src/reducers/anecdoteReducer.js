import { createSlice } from '@reduxjs/toolkit';

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}


const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAne(state, action) {
      return action.payload;
    },
    voteFor(state, action) {
      const anecdote = state.find(a => a.id === action.payload);
      if (anecdote) {
        anecdote.votes++;
      }
    },
    createAne(state, action) {
      state.push(asObject(action.payload.content));
    }
  }
});

export const { setAne, createAne, voteFor } = anecdotesSlice.actions;

export default anecdotesSlice.reducer;