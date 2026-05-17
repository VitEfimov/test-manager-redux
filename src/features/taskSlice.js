import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

export const fetchTasks = createAsyncThunk('task/fetchTasks', async (_, thunkAPI) => {
    const response = await axios.get('/api/tasks', { withCredentials: true });
    return response.data;
});

export const addTaskAsync = createAsyncThunk('task/addTaskAsync', async (task, thunkAPI) => {
    const response = await axios.post('/api/tasks', task, { withCredentials: true });
    return response.data;
});

export const updateTaskAsync = createAsyncThunk('task/updateTaskAsync', async (updateData, thunkAPI) => {
    const { taskId, name, priority, completed, description, completionDate, time } = updateData;

    const payload = {};
    if (name !== undefined) payload.taskname = name;
    if (priority !== undefined) payload.priority = priority;
    if (completed !== undefined) payload.completed = completed;
    if (completionDate !== undefined) payload.completionDate = completionDate;
    if (time !== undefined) payload.time = time;
    if (description !== undefined) {
        payload.description = { text: description.text || '', img: description.img || '', url: description.url || '' };
    }
    payload.lastUpdatedDate = new Date().toISOString();

    await axios.put(`/api/tasks/${taskId}`, payload, { withCredentials: true });
    
    return { taskId, payload };
});

export const deleteTaskAsync = createAsyncThunk('task/deleteTaskAsync', async (taskId, thunkAPI) => {
    await axios.delete(`/api/tasks/${taskId}`, { withCredentials: true });
    return taskId;
});

const initialState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addTaskSync(state, action) {
            const { task } = action.payload;
            state.tasks.push(task); 
        },
        deleteTaskSync(state, action) {
             const { taskId } = action.payload;
             state.tasks = state.tasks.filter(t => t.id !== taskId);
        },
        updateTaskSync(state, action) {
            const { taskId, name, priority, completed, description, completionDate, time } = action.payload;
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
                task.taskname = name !== undefined ? name : task.taskname;
                task.priority = priority !== undefined ? priority : task.priority;
                task.completed = completed !== undefined ? completed : task.completed;
                task.completionDate = completionDate !== undefined ? completionDate : task.completionDate;
                task.time = time !== undefined ? time : task.time;
                if (description) {
                    task.description = {
                        text: description.text || '',
                        img: description.img || '',
                        url: description.url || '',
                    };
                }
                task.lastUpdatedDate = new Date().toISOString();
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => { state.loading = true; })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload; 
            })
            .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
    }
});

export const { addTaskSync, deleteTaskSync, updateTaskSync } = taskSlice.actions;

export const addTask = (payload) => (dispatch) => {
    dispatch(addTaskSync(payload)); 
    dispatch(addTaskAsync(payload.task)); 
};

export const deleteTask = (payload) => (dispatch) => {
    dispatch(deleteTaskSync(payload));
    dispatch(deleteTaskAsync(payload.taskId));
};

export const updateTask = (payload) => (dispatch) => {
    dispatch(updateTaskSync(payload));
    dispatch(updateTaskAsync(payload));
};

export default taskSlice.reducer;
