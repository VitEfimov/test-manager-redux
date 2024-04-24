
import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStoragePomodoro = () => {
  const defaultPomodoro = [{
    time: 25 * 60,
    isActive: false,
    isBreak: false,
    // workInterval: 25 ,
    breakInterval: 5,
    intervalCount: {
      count: 4,
      progress: 0,
      passed: 0,
    },
  }];

  const savedData = JSON.parse(localStorage.getItem('pomodoro'));
  if (!savedData) {
    localStorage.setItem('pomodoro', JSON.stringify(defaultPomodoro));
    return defaultPomodoro;
  }
  console.log('defaultPomodoro', defaultPomodoro);
  console.log('savedData', savedData);
  return savedData;
};

const initialState = {
  pomodoro: loadFromLocalStoragePomodoro(),
  loading: false,
  error: null,
};

export const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.pomodoro[0].isActive = true;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    },
    pauseTimer: (state) => {
      state.pomodoro[0].isActive = false;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    },
    resetTimer: (state) => {
      state.pomodoro[0].isActive = false;
      state.pomodoro[0].time = initialState.time;
      state.pomodoro[0].isBreak = false;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    },
    updateTime: (state, action) => {
      state.pomodoro[0].time = action.payload;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    },
    toggleBreak: (state) => {
      state.pomodoro[0].isBreak = !state.isBreak;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    },
    // setWorkInterval: (state, action) => {
    //   state.pomodoro[0].workInterval = action.payload;
    //   localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    // },
    setBreakInterval: (state, action) => {
      state.pomodoro[0].breakInterval = action.payload;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    },
    setIntervalCount: (state, action) => {
      state.pomodoro[0].intervalCount = action.payload;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));

    },
  },
});

export const { startTimer, pauseTimer, resetTimer, updateTime, toggleBreak, setWorkInterval, setBreakInterval, setIntervalCount } = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
