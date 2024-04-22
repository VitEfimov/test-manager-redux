import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
    const defaultTask = [{
        "id": "1712284250904",
        "taskname": "Add first task...",
        "creationDate": new Date().toLocaleDateString(),
        "lastUpdatedDate": null,
        "completionDate": new Date().toLocaleDateString(),
        "priority": "High",
        "completed": false,
        "description": {
          "text": "",
          "img": "",
          "url": ""
        }
      }];
    const savedData = JSON.parse(localStorage.getItem('tasks')) || defaultTask;
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify(defaultTask));
    }
    return savedData;
};

const initialState = {
    tasks: loadFromLocalStorage() || [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addTask(state, action) {
            const { task } = action.payload;
            state.tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        deleteTask(state, action) {
            const { taskId } = action.payload;
            state.tasks = state.tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        updateTask(state, action) {
            const { taskId, name, priority, completed, description, completionDate } = action.payload;
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
                task.taskname = name || task.taskname;
                task.priority = priority || task.priority;
                task.completed = completed;
                task.completionDate = completionDate || task.completionDate;
                if (description) {
                    task.description = {
                        text: description.text || '',
                        img: description.img || '',
                        url: description.url || '',
                    };
                }
                task.lastUpdatedDate = new Date().toLocaleDateString();
                localStorage.setItem('tasks', JSON.stringify(state.tasks));
            }
        },
    },
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;

export default taskSlice.reducer;
