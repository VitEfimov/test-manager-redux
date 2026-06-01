import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWeatherCity, updateWeatherApi } from '../features/weatherSlice';
import { setBreakInterval, setIntervalCount, updateTime, setTime } from '../features/pomodoroSlice';
import { logout } from '../features/userSlice';
import { toggleSettingsOpen, setDateFormat, setTaskNameWrap, setTimeFormat, setFontSize, setDefaultTaskLimit } from '../features/themeSlice';
import InfomationIcon from './InfomationIcon';


const Settings = ({ setCurrentPage, showWeather, setShowWeather }) => {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weatherReducer.weather);
  const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro);
  const theme = useSelector(state => state.themeReducer);
  const dateFormat = theme.dateFormat || 'full';
  const taskNameWrap = theme.taskNameWrap || 'ellipsis';
  const timeFormat = theme.timeFormat || '12h';
  
  const weatherCity = weather[0].city;
  const weatherApi = weather[0].apiKey;
  const time = pomodoro[0].initialTime / 60; // Use initialTime instead of time
  const breakInterval = pomodoro[0].breakInterval / 60; // Convert to minutes
  const intervalCount = pomodoro[0].intervalCount.count; // Get the count value
  const [newCity, setNewCity] = useState(weatherCity);
  const [newApiKey, setNewApiKey] = useState(weatherApi)
  const [newWorkInterval, setNewWorkInterval] = useState(time);
  const [newBreakInterval, setNewBreakInterval] = useState(breakInterval);
  const [newIntervalCount, setNewIntervalCount] = useState(intervalCount);
  const [newDateFormat, setNewDateFormat] = useState(dateFormat);
  const [newTaskNameWrap, setNewTaskNameWrap] = useState(taskNameWrap);
  const [newTimeFormat, setNewTimeFormat] = useState(timeFormat);
  const [newFontSize, setNewFontSize] = useState(theme.fontSize || 'normal');
  const [newTaskLimit, setNewTaskLimit] = useState(theme.defaultTaskLimit !== undefined ? theme.defaultTaskLimit : 10);

  const handleCityChange = (e) => {
    setNewCity(e.target.value);
  };

  const handleCityApi = (e) => {
    setNewApiKey(e.target.value);
  };

  const handleShowWeather = (e) => {
    setShowWeather(e.target.checked);
  };

  const handleSetWorkInterval = (e) => {
    setNewWorkInterval(parseFloat(e.target.value));
  };
  const handleSetBreakInterval = (e) => {
    setNewBreakInterval(parseFloat(e.target.value));
  };
  const handleSetIntervalCount = (e) => {
    setNewIntervalCount(parseInt(e.target.value));
  };

  const handleSave = () => {
    dispatch(updateWeatherCity(newCity));
    dispatch(updateWeatherApi(newApiKey))
    // Use setTime instead of updateTime to properly save both time and initialTime
    dispatch(setTime(newWorkInterval))
    dispatch(setBreakInterval(newBreakInterval))
    dispatch(setIntervalCount(newIntervalCount))
    dispatch(setDateFormat(newDateFormat));
    dispatch(setTaskNameWrap(newTaskNameWrap));
    dispatch(setTimeFormat(newTimeFormat));
    dispatch(setFontSize(newFontSize));
    dispatch(setDefaultTaskLimit(newTaskLimit));
    setCurrentPage('Board');
  };

  const fields = [
    { title: 'User information', description: 'Logout of your account' },
    // { title: 'Weather', description: 'Add city and API key for weather data, use freeAPI: api.openweathermap.org' },
    {
      title: 'Weather',
      description: (
        <p>
          Add city and API key for weather data. Use free API:
          <a href="https://api.openweathermap.org" target="_blank" rel="noopener noreferrer">
            openweathermap
          </a>
        </p>
      )
    },
    { title: 'Promodoro', description: 'Customize pomodoro timer intervals' },
    { title: 'Other', description: 'You can change theme color' }
  ];


  return (
    <section className='section'>
      <button className='settings__save-btn' type='submit' onClick={handleSave}>Save</button>
      <div className='settings__conteiner'>
        <div className='settings__block user-settings'>
          <h3 className='settings__block-header'>
            User information
            <i>
              <InfomationIcon field={fields[0]} />
            </i>
          </h3>
          <div className='settings__item' style={{ paddingBottom: '1rem' }}>
            <button className='settings__save-btn' style={{ position: 'relative', top: '0', right: '0' }} onClick={() => dispatch(logout())}>Logout</button>
          </div>
          <div className='settings__item' style={{ paddingBottom: '1rem' }}>
            <button className='settings__save-btn' style={{ position: 'relative', top: '0', right: '0' }} onClick={() => dispatch(logout())}>Change password</button>
          </div>
        </div>
        <div className='settings__block weather-settings'>
          <h3 className='settings__block-header'>
            Weather
            <i>
              <InfomationIcon field={fields[1]} />
            </i>
          </h3>
          <div className='settings__item'>
            <label className='settings__item-label'>City:</label>
            <input type="text" value={newCity} onChange={handleCityChange} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label'>API Key:</label>
            <input type="password" value={newApiKey} onChange={handleCityApi} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label'>Show weather on board:</label>
            <input className='settings__item-checkbox' type="checkbox" checked={showWeather} onChange={handleShowWeather} />
          </div>
        </div>
        <div className='settings__block pomodoro-settings'>
          <h3 className='settings__block-header'>
            Promodoro
            <i>
              <InfomationIcon field={fields[2]} />
            </i>
          </h3>
          <div className='settings__item'>
            <label className='settings__item-label'>Work Interval time (minutes):</label>
            <input type="number" step="0.1" min="0.1" value={newWorkInterval} onChange={handleSetWorkInterval} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label'>Break Interval time (minutes):</label>
            <input type="number" step="0.1" min="0.1" value={newBreakInterval} onChange={handleSetBreakInterval} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label'>Interval count:</label>
            <input type="number" value={newIntervalCount} onChange={handleSetIntervalCount} />
          </div>

        </div>
        <div className='settings__block' >
          <h3 className='settings__block-header'>
            Customation
            <i>
              <InfomationIcon field={fields[3]} />
            </i>
          </h3>
          <div className='settings__item'>
            <label className='settings__item-label'>Due Date Format:</label>
            <select
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--dark-font-color-grey)',
                backgroundColor: 'var(--dark-background-color-sidebar)',
                color: 'var(--dark-font-color-white)',
                cursor: 'pointer',
                outline: 'none',
                width: '180px',
                textAlign: 'center'
              }}
              value={newDateFormat}
              onChange={(e) => setNewDateFormat(e.target.value)}
            >
              <option value="full">Full (MMMM D, YYYY)</option>
              <option value="short">Short (MMM D)</option>
            </select>
          </div>
          <div className='settings__item' style={{ marginTop: '1dvh' }}>
            <label className='settings__item-label'>Task Name Wrap:</label>
            <select
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--dark-font-color-grey)',
                backgroundColor: 'var(--dark-background-color-sidebar)',
                color: 'var(--dark-font-color-white)',
                cursor: 'pointer',
                outline: 'none',
                width: '180px',
                textAlign: 'center'
              }}
              value={newTaskNameWrap}
              onChange={(e) => setNewTaskNameWrap(e.target.value)}
            >
              <option value="ellipsis">Ellipsis (Short)</option>
              <option value="wrap">Wrap (Full)</option>
            </select>
          </div>
          <div className='settings__item' style={{ marginTop: '1dvh' }}>
            <label className='settings__item-label'>Time Format:</label>
            <select
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--dark-font-color-grey)',
                backgroundColor: 'var(--dark-background-color-sidebar)',
                color: 'var(--dark-font-color-white)',
                cursor: 'pointer',
                outline: 'none',
                width: '180px',
                textAlign: 'center'
              }}
              value={newTimeFormat}
              onChange={(e) => setNewTimeFormat(e.target.value)}
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour (International)</option>
            </select>
          </div>
          <div className='settings__item' style={{ marginTop: '1dvh' }}>
            <label className='settings__item-label'>Font Size:</label>
            <select
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--dark-font-color-grey)',
                backgroundColor: 'var(--dark-background-color-sidebar)',
                color: 'var(--dark-font-color-white)',
                cursor: 'pointer',
                outline: 'none',
                width: '180px',
                textAlign: 'center'
              }}
              value={newFontSize}
              onChange={(e) => setNewFontSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="big">Big</option>
            </select>
          </div>
          <div className='settings__item' style={{ marginTop: '1dvh' }}>
            <label className='settings__item-label'>Task Display Limit:</label>
            <input
              type="number"
              min="1"
              value={newTaskLimit}
              onChange={(e) => setNewTaskLimit(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--dark-font-color-grey)',
                backgroundColor: 'var(--dark-background-color-sidebar)',
                color: 'var(--dark-font-color-white)',
                outline: 'none',
                width: '180px',
                textAlign: 'center'
              }}
            />
          </div>
          <div className='settings__item' style={{ marginTop: '1dvh' }}>
            <button className='settings__save-btn' style={{ position: 'relative', top: '0', right: '0' }} onClick={() => dispatch(toggleSettingsOpen(true))}>Customize Theme</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Settings