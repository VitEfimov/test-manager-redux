import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const loadTokenFromSessionStorage = () => sessionStorage.getItem('token');
const loadThemeFromLocalStorage = () => {
    return localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
};

export const loginUser = createAsyncThunk('user/login', async ({ email, password }, thunkAPI) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message);
        }
        sessionStorage.setItem('token', data.token);
        return data.token;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const registerUser = createAsyncThunk('user/register', async ({ email, password }, thunkAPI) => {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message);
        }
        sessionStorage.setItem('token', data.token);
        return data.token;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

const initialState = {
    token: loadTokenFromSessionStorage(),
    isAuthenticated: !!loadTokenFromSessionStorage(),
    loading: false,
    error: null,
    theme: loadThemeFromLocalStorage(),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            sessionStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
        },
        updateUserTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload ? 'dark' : 'light');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, updateUserTheme } = userSlice.actions;
export default userSlice.reducer;
