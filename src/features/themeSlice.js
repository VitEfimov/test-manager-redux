import { createSlice } from '@reduxjs/toolkit';

const loadThemeState = () => {
  try {
    const serializedState = localStorage.getItem('customTheme');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const loaded = loadThemeState();
const initialState = {
  colors: loaded?.colors || {
    sidebarBg: null, 
    mainBg: null,    
    textColor: null
  },
  fontSize: loaded?.fontSize || 'normal', // 'small', 'normal', 'big'
  columnWidths: loaded?.columnWidths || {
    taskName: 55,
    dueDate: 15,
    priority: 10
  },
  defaultTaskLimit: loaded?.defaultTaskLimit !== undefined ? loaded.defaultTaskLimit : 10,
  isSettingsOpen: loaded?.isSettingsOpen || false,
  dateFormat: loaded?.dateFormat || 'full'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeColor: (state, action) => {
      const { key, value } = action.payload;
      state.colors[key] = value;
      localStorage.setItem('customTheme', JSON.stringify(state));
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      localStorage.setItem('customTheme', JSON.stringify(state));
    },
    setColumnWidth: (state, action) => {
      const { key, value } = action.payload;
      state.columnWidths[key] = value;
      localStorage.setItem('customTheme', JSON.stringify(state));
    },
    toggleSettingsOpen: (state, action) => {
      if (action.payload !== undefined) {
        state.isSettingsOpen = action.payload;
      } else {
        state.isSettingsOpen = !state.isSettingsOpen;
      }
    },
    resetTheme: (state) => {
      state.colors = {
        sidebarBg: null,
        mainBg: null,
        textColor: null
      };
      state.fontSize = 'normal';
      state.columnWidths = {
        taskName: 55,
        dueDate: 15,
        priority: 10
      };
      state.defaultTaskLimit = 10;
      state.dateFormat = 'full';
      localStorage.removeItem('customTheme');
    },
    setDefaultTaskLimit: (state, action) => {
      state.defaultTaskLimit = Math.max(1, Number(action.payload) || 1);
      localStorage.setItem('customTheme', JSON.stringify(state));
    },
    setDateFormat: (state, action) => {
      state.dateFormat = action.payload;
      localStorage.setItem('customTheme', JSON.stringify(state));
    }
  }
});

export const { setThemeColor, setFontSize, setColumnWidth, toggleSettingsOpen, resetTheme, setDefaultTaskLimit, setDateFormat } = themeSlice.actions;
export default themeSlice.reducer;
