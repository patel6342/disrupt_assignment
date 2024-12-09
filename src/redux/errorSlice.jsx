
import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        statusCode: null,
        message: '',
    },
    reducers: {
        setError: (state, action) => {
            state.statusCode = action.payload.statusCode;
            state.message = action.payload.message;
        },
        clearError: (state) => {
            state.statusCode = null;
            state.message = '';
        },
    },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice;


