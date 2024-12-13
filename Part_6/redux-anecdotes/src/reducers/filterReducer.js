import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'filter',
    initialState: { type: 'ALL' },
    reducers: {
        setFilter(state, action) {
            return { type: 'SET_FILTER', filter: action.payload }
        },
        clearFilter() { return { type: 'ALL' } }
    }
});

export const { setFilter, clearFilter } = filterSlice.actions;
export default filterSlice.reducer;