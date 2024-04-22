import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorageWeather = () => {
  const defaultWeather = [{
    city: '',
    apiKey: ''
  }];

  const savedData = JSON.parse(localStorage.getItem('weather'));
  if (!savedData) {
    localStorage.setItem('weather', JSON.stringify(defaultWeather));
    return defaultWeather;
  }
  return savedData;
};

const initialState = {
  weather: loadFromLocalStorageWeather(),
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateWeatherCity: (state, action) => {
      state.weather[0].city = action.payload;
      localStorage.setItem('weather', JSON.stringify(state.weather));
    },
    updateWeatherApi: (state, action) => {
      state.weather[0].apiKey = action.payload;
      localStorage.setItem('weather', JSON.stringify(state.weather));
    },
  },
});

export const { updateWeatherCity, updateWeatherApi } = weatherSlice.actions;

export default weatherSlice.reducer;
