import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdLightMode, MdDarkMode, MdDevices } from "react-icons/md";
import { updateUserTheme, updateThemeAsync, toggleSidebar } from '../features/userSlice';
import dayjs from 'dayjs';
import '../styles/Header.css';

const Header = ({ isPomodoroActive, timeRemaining, isTimeOver }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.userReducer.theme);
  const themeReducer = useSelector(state => state.themeReducer);
  const userPicture = themeReducer?.userPicture;

  const handleToggle = () => {
    let newTheme = 'light';
    if (theme === 'light') newTheme = 'dark';
    else if (theme === 'dark') newTheme = 'system';
    
    dispatch(updateUserTheme(newTheme));
    dispatch(updateThemeAsync(newTheme));
  };

  const headerStyle = {};
  if (userPicture) {
    headerStyle.backgroundImage = `url(${userPicture})`;
    headerStyle.backgroundSize = themeReducer?.headerBackgroundFit || 'cover';
    headerStyle.backgroundPosition = 'center';
    if (themeReducer?.headerBackgroundFit === 'contain' || themeReducer?.headerBackgroundFit === 'auto') {
      headerStyle.backgroundRepeat = 'no-repeat';
    }
  }

  return (
    <header className="topbar" style={headerStyle}>
      <div className="tabs">
        {/* <div className="tab active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            TaskFlow
        </div> */}
      </div>
      
      <div className="topbar-right">
        {isPomodoroActive && !isTimeOver && (
          <div className="topbar-date-error">
            Pomodoro: {timeRemaining}s
          </div>
        )}
        {isTimeOver && (
          <div className="topbar-date-error">
            Time's Up!
          </div>
        )}

        <div className="topbar-date">
            {dayjs().format('ddd, MMM D')}
        </div>
        
        <button 
            className="topbar-icon-btn" 
            onClick={handleToggle}
            aria-label={`Toggle theme (currently ${theme})`}
        >
            {theme === 'system' ? <MdDevices /> : theme === 'dark' ? <MdDarkMode /> : <MdLightMode />}
        </button>
      </div>
    </header>
  );
}

export default Header;
