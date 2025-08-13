import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_WORK_TIME = 50 * 60; // 25 minutes in seconds
const DEFAULT_BREAK_TIME = 10 * 60; // 5 minutes in seconds

const loadFromLocalStoragePomodoro = () => {
  const defaultPomodoro = [{
    time: DEFAULT_WORK_TIME,
    initialTime: DEFAULT_WORK_TIME,
    isActive: false,
    isBreak: false,
    breakInterval: DEFAULT_BREAK_TIME,
    intervalCount: {
      count: 5,
      progress: 0,
      passed: 0,
    },
  }];

  try {
    const savedData = JSON.parse(localStorage.getItem('pomodoro'));
    if (!savedData) {
      console.log('No saved Pomodoro data found, using defaults');
      localStorage.setItem('pomodoro', JSON.stringify(defaultPomodoro));
      return defaultPomodoro;
    }
    
    console.log('Loading saved Pomodoro data:', savedData);
    
    // Ensure all required properties exist and are valid
    if (savedData[0]) {
      const pomodoro = savedData[0];
      
      // Ensure intervalCount is always an object
      if (typeof pomodoro.intervalCount !== 'object') {
        console.log('Fixing invalid intervalCount:', pomodoro.intervalCount);
        pomodoro.intervalCount = {
          count: 5,
          progress: 0,
          passed: 0,
        };
      }
      
      // Ensure all time values exist and are valid
      if (!pomodoro.initialTime || pomodoro.initialTime <= 0) {
        console.log('Fixing invalid initialTime:', pomodoro.initialTime);
        pomodoro.initialTime = DEFAULT_WORK_TIME;
      }
      if (!pomodoro.time || pomodoro.time <= 0) {
        console.log('Fixing invalid time:', pomodoro.time);
        pomodoro.time = pomodoro.initialTime;
      }
      if (!pomodoro.breakInterval || pomodoro.breakInterval <= 0) {
        console.log('Fixing invalid breakInterval:', pomodoro.breakInterval);
        pomodoro.breakInterval = DEFAULT_BREAK_TIME;
      }
      
      // Reset progress and passed when loading from storage
      pomodoro.progress = 0;
      pomodoro.passed = 0;
      pomodoro.isActive = false;
      pomodoro.isBreak = false;
      
      // Save the corrected data back to localStorage
      localStorage.setItem('pomodoro', JSON.stringify(savedData));
      console.log('Saved corrected Pomodoro data:', savedData);
    }
    
    return savedData;
  } catch (error) {
    console.error('Error loading Pomodoro data from localStorage:', error);
    console.log('Using default Pomodoro data');
    localStorage.setItem('pomodoro', JSON.stringify(defaultPomodoro));
    return defaultPomodoro;
  }
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
      // Reset timer state but preserve user settings from localStorage
      const savedData = JSON.parse(localStorage.getItem('pomodoro'));
      if (savedData && savedData[0]) {
        // Preserve user's custom settings
        state.pomodoro[0].initialTime = savedData[0].initialTime;
        state.pomodoro[0].breakInterval = savedData[0].breakInterval;
        state.pomodoro[0].intervalCount = savedData[0].intervalCount;
      }
      
      // Reset only the timer state
      state.pomodoro[0].isActive = false;
      state.pomodoro[0].time = state.pomodoro[0].initialTime;
      state.pomodoro[0].isBreak = false;
      state.pomodoro[0].intervalCount.progress = 0;
      state.pomodoro[0].intervalCount.passed = 0;
      
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
    },
    updateTime: (state, action) => {
      // This is for updating the current time during countdown
      state.pomodoro[0].time = action.payload;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
    },
    toggleBreak: (state) => {
      state.pomodoro[0].isBreak = !state.pomodoro[0].isBreak;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
    },
    setBreakInterval: (state, action) => {
      // Convert minutes to seconds for consistency
      const breakTimeInSeconds = action.payload * 60;
      console.log('Setting break time:', action.payload, 'minutes =', breakTimeInSeconds, 'seconds');
      state.pomodoro[0].breakInterval = breakTimeInSeconds;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
      console.log('Saved Pomodoro state after setBreakInterval:', state.pomodoro);
    },
    setIntervalCount: (state, action) => {
      console.log('Setting interval count:', action.payload);
      state.pomodoro[0].intervalCount = {
        count: action.payload,
        progress: 0,
        passed: 0,
      };
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
      console.log('Saved Pomodoro state after setIntervalCount:', state.pomodoro);
    },
    setInitialTime: (state, action) => {
      state.pomodoro[0].initialTime = action.payload;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
    },
    setTime: (state, action) => {
      // This is for setting both time and initialTime from settings
      const workTimeInSeconds = action.payload * 60;
      console.log('Setting work time:', action.payload, 'minutes =', workTimeInSeconds, 'seconds');
      state.pomodoro[0].time = workTimeInSeconds;
      state.pomodoro[0].initialTime = workTimeInSeconds;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
      console.log('Saved Pomodoro state after setTime:', state.pomodoro);
    },
    completeWorkInterval: (state) => {
      // Ensure intervalCount is an object
      if (typeof state.pomodoro[0].intervalCount !== 'object') {
        state.pomodoro[0].intervalCount = {
          count: 4,
          progress: 0,
          passed: 0,
        };
      }
      
      // Only increment if we haven't completed all intervals
      if (state.pomodoro[0].intervalCount.passed < state.pomodoro[0].intervalCount.count) {
        state.pomodoro[0].intervalCount.passed += 1;
        state.pomodoro[0].isBreak = true;
        // Use break interval time from settings
        state.pomodoro[0].time = state.pomodoro[0].breakInterval;
      }
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
    },
    completeBreakInterval: (state) => {
      state.pomodoro[0].isBreak = false;
      // Use work interval time from settings
      state.pomodoro[0].time = state.pomodoro[0].initialTime;
      localStorage.setItem('pomodoro', JSON.stringify(state.pomodoro));
    },
  },
});

export const {
  startTimer,
  pauseTimer,
  resetTimer,
  updateTime,
  toggleBreak,
  setBreakInterval,
  setIntervalCount,
  setTime,
  setInitialTime,
  completeWorkInterval,
  completeBreakInterval,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
