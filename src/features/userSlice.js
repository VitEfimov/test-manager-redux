import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

const loadThemeFromLocalStorage = () => {
    return localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
};

export const checkAuth = createAsyncThunk('user/checkAuth', async (_, thunkAPI) => {
    try {
        const response = await axios.get('/api/auth/me', { withCredentials: true });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const loginUser = createAsyncThunk('user/login', async ({ email, password, rememberMe }, thunkAPI) => {
    try {
        const response = await axios.post('/api/auth/login', { email, password, rememberMe }, { withCredentials: true });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const registerUser = createAsyncThunk('user/register', async ({ email, password }, thunkAPI) => {
    try {
        const response = await axios.post('/api/auth/register', { email, password }, { withCredentials: true });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const logoutUser = createAsyncThunk('user/logout', async (_, thunkAPI) => {
    try {
        await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    theme: loadThemeFromLocalStorage(),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
        },
        updateUserTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload ? 'dark' : 'light');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(checkAuth.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
            });
    }
});

export const { logout, updateUserTheme } = userSlice.actions;
export default userSlice.reducer;
