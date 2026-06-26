import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearTasks } from '../features/taskSlice';
import { updateUserTheme, updateThemeAsync } from '../features/userSlice';
import { setFontSize, setDateFormat, setTaskNameWrap, setTimeFormat, toggleSettingsOpen } from '../features/themeSlice';
import '../styles/Settings.css';
const Settings = ({ setCurrentPage, showWeather, setShowWeather }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.themeReducer);
  const userTheme = useSelector(state => state.userReducer.theme);
  const dateFormat = theme.dateFormat || 'full';
  const taskNameWrap = theme.taskNameWrap || 'ellipsis';
  const timeFormat = theme.timeFormat || '12h';

  // eslint-disable-next-line no-unused-vars
  const [newTimeFormat, setNewTimeFormat] = useState(timeFormat);
  const [newFontSize, setNewFontSize] = useState(theme.fontSize || 'normal');
  // eslint-disable-next-line no-unused-vars
  const [newUserTheme] = useState(userTheme);
  const [newDateFormat, setNewDateFormat] = useState(dateFormat);
  const [newTaskNameWrap, setNewTaskNameWrap] = useState(taskNameWrap);

  const handleDeleteAllData = () => {
    if (window.confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      dispatch(clearTasks());
      localStorage.clear();
      window.location.reload();
    }
  }



  const handleSave = () => {
    dispatch(setDateFormat(newDateFormat));
    dispatch(setTaskNameWrap(newTaskNameWrap));
    dispatch(setTimeFormat(newTimeFormat));
    dispatch(setFontSize(newFontSize));
    dispatch(updateUserTheme(newUserTheme));
    dispatch(updateThemeAsync(newUserTheme));
    
    setCurrentPage('Board');
  };




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
          Save
        </button>
      </div>

      <div className="settings__mobile-body">
        <div className="settings-col-left">

        {/* CUSTOMIZATION AND OTHERS MOVED */}

        {/* ACCOUNT */}
        <div className="settings-group">
          <h4 className="settings-group-title">Account</h4>
          <div className="settings-card">
            <div className="setting-row user-profile-row">
                <div className="setting-label">
                 <span className="icon large-icon green-bg">👤</span>
                 <div className="user-info">
                   <strong>User Profile</strong>
                   <span className="email">user@example.com</span>
                 </div>
               </div>
            </div>
            <div className="setting-row settings-btn-group">
                <button className="btn-log-out-settings" onClick={handleDeleteAllData}>Delete All Data</button>
            </div>
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

        {/* CUSTOMIZATION */}
        <div className="settings-group">
          <h4 className="settings-group-title">Customization</h4>
          <div className="settings-card">
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Date format</span>
              </div>
              <div className="setting-control">
                <select className="select-sleek" value={newDateFormat} onChange={(e) => setNewDateFormat(e.target.value)}>
                  <option value="full">Full</option>
                  <option value="short">Short</option>
                </select>
              </div>
            </div>
            <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Text wrapping</span>
              </div>
              <div className="setting-control">
                <select className="select-sleek" value={newTaskNameWrap} onChange={(e) => setNewTaskNameWrap(e.target.value)}>
                  <option value="ellipsis">Short</option>
                  <option value="wrap">Full</option>
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
                  <option value="device">Default</option>
                </select>
              </div>
            </div>

            {/* <div className="setting-row setting-row-no-border">
              <div className="setting-label">
                <span>Theme Mode</span>
              </div>
              <div className="setting-control">
                <select className="select-sleek" value={newUserTheme} readOnly>
                  <option value="system">System Default</option>
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="contrast">High Contrast</option>
                </select>
              </div>
            </div> */}
            {/* Removed List limit */}
            
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
    </section>
  );
};

export default Settings