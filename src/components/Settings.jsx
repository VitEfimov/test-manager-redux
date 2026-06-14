import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWeatherCity, updateWeatherApi } from '../features/weatherSlice';
import { setBreakInterval, setIntervalCount, setTime, setWorkSound, setBreakSound } from '../features/pomodoroSlice';
import { logout, changePassword } from '../features/userSlice';
import { clearTasks } from '../features/taskSlice';
import { toggleSettingsOpen, setDateFormat, setTaskNameWrap, setTimeFormat, setFontSize, setDefaultTaskLimit } from '../features/themeSlice';
import InfomationIcon from './InfomationIcon';
import '../styles/Settings.css';

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
  const workMinutes = Math.floor(pomodoro[0].initialTime / 60);
  const workSeconds = pomodoro[0].initialTime % 60;
  const breakMinutes = Math.floor(pomodoro[0].breakInterval / 60);
  const breakSeconds = pomodoro[0].breakInterval % 60;
  const intervalCount = typeof pomodoro[0].intervalCount === 'object' ? pomodoro[0].intervalCount.count : 5;

  const [newCity, setNewCity] = useState(weatherCity);
  const [newApiKey, setNewApiKey] = useState(weatherApi)
  
  const [newWorkMin, setNewWorkMin] = useState(workMinutes);
  const [newWorkSec, setNewWorkSec] = useState(workSeconds);
  const [newBreakMin, setNewBreakMin] = useState(breakMinutes);
  const [newBreakSec, setNewBreakSec] = useState(breakSeconds);
  const [newIntervalCount, setNewIntervalCount] = useState(intervalCount);

  const workSound = pomodoro[0].workSound || 'default';
  const breakSound = pomodoro[0].breakSound || 'default';
  const [newWorkSound, setNewWorkSound] = useState(workSound);
  const [newBreakSound, setNewBreakSound] = useState(breakSound);
  const predefinedSounds = ['default', 'none', 'chime.wav', 'light ping.wav', 'notification.wav', 'end_sound.ogg', 'start_sound.mp3'];
  const [workSoundType, setWorkSoundType] = useState(predefinedSounds.includes(workSound) ? workSound : 'custom');
  const [breakSoundType, setBreakSoundType] = useState(predefinedSounds.includes(breakSound) ? breakSound : 'custom');
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

  const handleSetWorkMin = (e) => setNewWorkMin(parseInt(e.target.value) || 0);
  const handleSetWorkSec = (e) => setNewWorkSec(parseInt(e.target.value) || 0);
  const handleSetBreakMin = (e) => setNewBreakMin(parseInt(e.target.value) || 0);
  const handleSetBreakSec = (e) => setNewBreakSec(parseInt(e.target.value) || 0);
  const handleSetIntervalCount = (e) => {
    if (parseInt(e.target.value)>10) {
      alert("10 intervals maximum")
    } else {
      setNewIntervalCount(parseInt(e.target.value));
    }
  };



  const handleSave = () => {
    dispatch(updateWeatherCity(newCity));
    dispatch(updateWeatherApi(newApiKey))
    const totalWorkSeconds = newWorkMin * 60 + newWorkSec;
    const totalBreakSeconds = newBreakMin * 60 + newBreakSec;
    dispatch(setTime(totalWorkSeconds))
    dispatch(setBreakInterval(totalBreakSeconds))
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
    <section className="section settings-section">
      <div className="settings__mobile-header">
        <div>
          <h1>Settings</h1>
          <p>App preferences & account</p>
        </div>
        <button className='btn-save-settings-header settings-save-btn' onClick={handleSave}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save changes
        </button>
      </div>

      <div className="settings__mobile-body">
        <div className="settings-col-left">

        {/* CUSTOMIZATION AND OTHERS MOVED */}

        {/* ACCOUNT */}
        <div className="settings-group">
          <h4 className="settings-group-title">User information</h4>
          <div className="settings-card">
            <div className="setting-row user-profile-row">
               <div className="setting-label">
                 <span className="icon large-icon green-bg">👤</span>
                 <div className="user-info">
                   <strong>User Profile</strong>
                   <span className="email">{isAuthenticated ? 'user@example.com' : 'Guest'}</span>
                 </div>
               </div>
            </div>
            {isAuthenticated && (
              <div className="setting-row">
                <div className="setting-label">
                  <span>New password</span>
                </div>
                <div className="setting-control">
                  <input type="password" placeholder="........" className="text-input-sleek settings-text-left" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>
            )}
            {isAuthenticated ? (
              <div className="setting-row settings-btn-group">
                <button className="btn-log-out-settings" onClick={() => { dispatch(logout()); dispatch(clearTasks()); }}>Log out</button>
                <button className="btn-change-password-settings" onClick={handleChangePasswordSubmit}>Change password</button>
              </div>
            ) : (
              <div className="setting-row clickable" onClick={() => dispatch(logout())}>
                <div className="setting-label">
                  <span className="icon green-bg">🔑</span>
                  <span>Login to Sync</span>
                </div>
                <div className="setting-control"><span className="arrow">{'>'}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* POMODORO */}
        {/* <div className="settings-group">
          <h4 className="settings-group-title">Pomodoro</h4>
          <div className="settings-card">
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Work interval</span>
              </div>
              <div className="setting-control flex-inputs sleek-inputs">
                <input type="number" min="0" max="120" value={newWorkMin} onChange={handleSetWorkMin} className="num-input"/> <span>min</span>
                <input type="number" min="0" max="59" value={newWorkSec} onChange={handleSetWorkSec} className="num-input"/> <span>sec</span>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Break interval</span>
              </div>
              <div className="setting-control flex-inputs sleek-inputs">
                <input type="number" min="0" max="120" value={newBreakMin} onChange={handleSetBreakMin} className="num-input"/> <span>min</span>
                <input type="number" min="0" max="59" value={newBreakSec} onChange={handleSetBreakSec} className="num-input"/> <span>sec</span>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Interval count</span>
              </div>
              <div className="setting-control">
                 <input type="number" min="1" max="10" value={newIntervalCount} onChange={handleSetIntervalCount} className="num-input-large"/>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Work over sound</span>
              </div>
              <div className="setting-control">
                <select className="select-sleek" value={workSoundType} onChange={(e) => { setWorkSoundType(e.target.value); if (e.target.value !== 'custom') setNewWorkSound(e.target.value); }}>
                  <option value="default">Default</option>
                  <option value="none">None</option>
                  <option value="chime.wav">Chime</option>
                  <option value="light ping.wav">Light</option>
                  <option value="notification.wav">Notif</option>
                </select>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Break over sound</span>
              </div>
              <div className="setting-control">
                 <select className="select-sleek" value={breakSoundType} onChange={(e) => { setBreakSoundType(e.target.value); if (e.target.value !== 'custom') setNewBreakSound(e.target.value); }}>
                  <option value="default">Default</option>
                  <option value="none">None</option>
                  <option value="chime.wav">Chime</option>
                  <option value="light ping.wav">Light</option>
                  <option value="notification.wav">Notif</option>
                </select>
              </div>
            </div>
          </div>
        </div>*/} 

        </div> 

        <div className="settings-col-right">
          {/* WEATHER */}
          <div className="settings-group">
            <h4 className="settings-group-title">Weather</h4>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-label">
                  <span>City</span>
                </div>
                <div className="setting-control">
                  <input type="text" className="text-input-sleek" value={newCity} onChange={handleCityChange} placeholder="City name" />
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-label">
                  <span>API Key</span>
                </div>
                <div className="setting-control">
                  <input type="password" className="text-input-sleek" value={newApiKey} onChange={handleCityApi} placeholder="OpenWeather API" />
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-label">
                  <span>Show on board</span>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input type="checkbox" checked={showWeather} onChange={handleShowWeather} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

        {/* CUSTOMIZATION */}
        <div className="settings-group">
          <h4 className="settings-group-title">Customization</h4>
          <div className="settings-card">
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Due date format</span>
              </div>
              <div className="setting-control">
                <select className="select-sleek" value={newDateFormat} onChange={(e) => setNewDateFormat(e.target.value)}>
                  <option value="full">Full (MMMM D, YYYY)</option>
                  <option value="short">Short (MMM D)</option>
                </select>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Task name wrap</span>
              </div>
              <div className="setting-control">
                <select className="select-sleek" value={newTaskNameWrap} onChange={(e) => setNewTaskNameWrap(e.target.value)}>
                  <option value="ellipsis">Ellipsis</option>
                  <option value="wrap">Wrap (Full)</option>
                </select>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Font size</span>
              </div>
              <div className="setting-control">
                <select className="select-sleek" value={newFontSize} onChange={(e) => setNewFontSize(e.target.value)}>
                  <option value="small">Small</option>
                  <option value="normal">Normal</option>
                  <option value="big">Big</option>
                </select>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Task display limit</span>
              </div>
              <div className="setting-control">
                <input type="number" min="5" max="50" className="num-input-large" value={newTaskLimit} onChange={(e) => setNewTaskLimit(e.target.value)} />
              </div>
            </div>
            
            <div className="settings-theme-wrapper">
              <button className="btn-customize-theme" onClick={() => dispatch(toggleSettingsOpen(true))}>🎨 Customize theme</button>
            </div>
          </div>
        </div>


        </div>

        {/* <button className='btn-save-settings-mobile settings-save-btn-mobile' onClick={handleSave}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Changes
        </button> */}
      </div>

      {showPasswordModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal-content">
            <h3 className="settings-modal-title">Change Password</h3>
            {passwordError && <p className="settings-modal-error">{passwordError}</p>}
            {passwordSuccess && <p className="settings-modal-success">{passwordSuccess}</p>}
            <input className="input-field" type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input className="input-field" type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input className="input-field" type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <div className="settings-modal-actions">
              <button className='btn-delete' onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className='btn-save' onClick={handleChangePasswordSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Settings