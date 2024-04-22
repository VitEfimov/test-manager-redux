import { configureStore } from "@reduxjs/toolkit";

import taskReducer from "./features/taskSlice";
import weatherReducer from "./features/weatherSlice";
import pomodoroReducer from "./features/pomodoroSlice";
import userReducer from "./features/userSlice";

const reducer = {
    taskReducer: taskReducer,
    weatherReducer: weatherReducer,
    pomodoroReducer: pomodoroReducer,
    userReducer: userReducer
}

const store = configureStore({
    reducer: reducer,
});

export default store;