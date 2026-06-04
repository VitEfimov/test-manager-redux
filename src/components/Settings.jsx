import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWeatherCity, updateWeatherApi } from '../features/weatherSlice';
import { setBreakInterval, setIntervalCount, updateTime, setTime, setWorkSound, setBreakSound } from '../features/pomodoroSlice';
import { logout, changePassword } from '../features/userSlice';
import { toggleSettingsOpen, setDateFormat, setTaskNameWrap, setTimeFormat, setFontSize, setDefaultTaskLimit } from '../features/themeSlice';
import InfomationIcon from './InfomationIcon';


const Settings = ({ setCurrentPage, showWeather, setShowWeather }) => {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weatherReducer.weather);
  const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro);
  const theme = useSelector(state => state.themeReducer);
  const isAuthenticated = useSelector(state => state.userReducer.isAuthenticated);
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

  const workSound = pomodoro[0].workSound || 'default';
  const breakSound = pomodoro[0].breakSound || 'default';
  const [newWorkSound, setNewWorkSound] = useState(workSound);
  const [newBreakSound, setNewBreakSound] = useState(breakSound);
  const [workSoundType, setWorkSoundType] = useState(workSound === 'default' || workSound === 'none' ? workSound : 'custom');
  const [breakSoundType, setBreakSoundType] = useState(breakSound === 'default' || breakSound === 'none' ? breakSound : 'custom');
  const [newDateFormat, setNewDateFormat] = useState(dateFormat);
  const [newTaskNameWrap, setNewTaskNameWrap] = useState(taskNameWrap);
  const [newTimeFormat, setNewTimeFormat] = useState(timeFormat);
  const [newFontSize, setNewFontSize] = useState(theme.fontSize || 'normal');
  const [newTaskLimit, setNewTaskLimit] = useState(theme.defaultTaskLimit !== undefined ? theme.defaultTaskLimit : 10);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }
    setPasswordError('');
    setPasswordSuccess('');
    const resultAction = await dispatch(changePassword({ currentPassword, newPassword }));
    if (changePassword.fulfilled.match(resultAction)) {
      setPasswordSuccess("Password successfully changed!");
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccess('');
      }, 2000);
    } else {
      setPasswordError(resultAction.payload || "Failed to change password.");
    }
  };

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
    if (parseInt(e.target.value)>10) {
      alert("10 intervals maximum")

    } else {
      setNewIntervalCount(parseInt(e.target.value));
    }
    // setNewIntervalCount(parseInt(e.target.value));
  };

  const handleSave = () => {
    dispatch(updateWeatherCity(newCity));
    dispatch(updateWeatherApi(newApiKey))
    // Use setTime instead of updateTime to properly save both time and initialTime
    dispatch(setTime(newWorkInterval))
    dispatch(setBreakInterval(newBreakInterval))
    dispatch(setIntervalCount(newIntervalCount))
    dispatch(setWorkSound(newWorkSound));
    dispatch(setBreakSound(newBreakSound));
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
          {!isAuthenticated && (
            <div className='settings__item' style={{ paddingBottom: '1rem' }}>
              <button className='settings__save-btn' style={{ position: 'relative', top: '0', right: '0', backgroundColor: '#4CAF50' }} onClick={() => dispatch(logout())}>Login to Sync</button>
            </div>
          )}
          <div className='settings__item' style={{ paddingBottom: '1rem' }}>
            <button
              className='settings__save-btn'
              style={{ position: 'relative', top: '0', right: '0', opacity: isAuthenticated ? 1 : 0.5, cursor: isAuthenticated ? 'pointer' : 'not-allowed' }}
              onClick={() => isAuthenticated && dispatch(logout())}
              disabled={!isAuthenticated}
            >
              Logout
            </button>
          </div>
          <div className='settings__item' style={{ paddingBottom: '1rem' }}>
            <button
              className='settings__save-btn'
              style={{ position: 'relative', top: '0', right: '0', opacity: isAuthenticated ? 1 : 0.5, cursor: isAuthenticated ? 'pointer' : 'not-allowed' }}
              onClick={() => isAuthenticated && setShowPasswordModal(true)}
              disabled={!isAuthenticated}
            >
              Change password
            </button>
            {showPasswordModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                <div style={{ backgroundColor: 'var(--dark-background-color-main)', padding: '2rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                  <h3 style={{ color: 'var(--dark-font-color-white)', textAlign: 'center', margin: 0 }}>Change Password</h3>
                  {passwordError && <p style={{ color: 'var(--red_color)', margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>{passwordError}</p>}
                  {passwordSuccess && <p style={{ color: 'green', margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>{passwordSuccess}</p>}
                  <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }} />
                  <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }} />
                  <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button className='settings__save-btn' style={{ position: 'relative', width: '45%' }} onClick={handleChangePasswordSubmit}>Submit</button>
                    <button className='settings__save-btn' style={{ position: 'relative', width: '45%', backgroundColor: 'var(--dark-btn-color)' }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
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
            <input type="number" min="1" max="10" value={newIntervalCount} onChange={handleSetIntervalCount} />
          </div>

          <div className='settings__item' style={{ marginTop: '1dvh', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <label className='settings__item-label'>Work Over Sound:</label>
              <select
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--dark-font-color-grey)', backgroundColor: 'var(--dark-background-color-sidebar)', color: 'var(--dark-font-color-white)', cursor: 'pointer', outline: 'none', width: '180px', textAlign: 'center' }}
                value={workSoundType}
                onChange={(e) => {
                  setWorkSoundType(e.target.value);
                  if (e.target.value === 'default' || e.target.value === 'none') {
                    setNewWorkSound(e.target.value);
                  }
                }}
              >
                <option value="default">Default</option>
                <option value="none">None</option>
                <option value="custom">Custom (Upload)</option>
              </select>
            </div>
            {workSoundType === 'custom' && (
              <div style={{ marginTop: '10px', width: '100%' }}>
                <input
                  type="file"
                  accept="audio/*"
                  style={{ color: 'var(--dark-font-color-white)', width: '100%' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("File size exceeds 2MB limit.");
                        e.target.value = '';
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) => setNewWorkSound(event.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {newWorkSound !== 'default' && newWorkSound !== 'none' && <p style={{ fontSize: '0.8rem', color: 'green', margin: '5px 0' }}>Custom sound loaded.</p>}
              </div>
            )}
          </div>

          <div className='settings__item' style={{ marginTop: '1dvh', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <label className='settings__item-label'>Break Over Sound:</label>
              <select
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--dark-font-color-grey)', backgroundColor: 'var(--dark-background-color-sidebar)', color: 'var(--dark-font-color-white)', cursor: 'pointer', outline: 'none', width: '180px', textAlign: 'center' }}
                value={breakSoundType}
                onChange={(e) => {
                  setBreakSoundType(e.target.value);
                  if (e.target.value === 'default' || e.target.value === 'none') {
                    setNewBreakSound(e.target.value);
                  }
                }}
              >
                <option value="default">Default</option>
                <option value="none">None</option>
                <option value="custom">Custom (Upload)</option>
              </select>
            </div>
            {breakSoundType === 'custom' && (
              <div style={{ marginTop: '10px', width: '100%' }}>
                <input
                  type="file"
                  accept="audio/*"
                  style={{ color: 'var(--dark-font-color-white)', width: '100%' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("File size exceeds 2MB limit.");
                        e.target.value = '';
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) => setNewBreakSound(event.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {newBreakSound !== 'default' && newBreakSound !== 'none' && <p style={{ fontSize: '0.8rem', color: 'green', margin: '5px 0' }}>Custom sound loaded.</p>}
              </div>
            )}
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