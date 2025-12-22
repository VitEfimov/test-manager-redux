import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorageUser = () => {
    const defaultUser = [{
        name: 'New User',
        email: 'some@gmail.com',
        password: '',
        theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }];

    const savedData = JSON.parse(localStorage.getItem('user'));
    if (!savedData) {
        localStorage.setItem('user', JSON.stringify(defaultUser));
        return defaultUser;
    }
    return savedData;
};

const initialState = {
    user: loadFromLocalStorageUser(),
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserName: (state, action) => {
            state.user[0].name = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        updateUserEmail: (state, action) => {
            state.user[0].email = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        updateUserPassword: (state, action) => {
            state.user[0].password = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        updateUserTheme: (state, action) => {
            state.user[0].theme = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
    },
});

export const { updateUserName, updateUserEmail, updateUserPassword, updateUserTheme } = userSlice.actions;

export default userSlice.reducer;
