import React from 'react';
import Weather from './Weather';
import { useDispatch, useSelector } from 'react-redux';
import { CgToggleSquare, CgToggleSquareOff } from "react-icons/cg";
import { MdLightMode, MdDarkMode, MdDevices } from "react-icons/md";
import { CiSquareChevDown, CiSquareChevUp } from "react-icons/ci";
import { updateUserTheme, updateThemeAsync } from '../features/userSlice';


const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, setSidebarView, sidebarView, showWeather }) => {
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
    <header className={`header ${showWeather ? 'weather-active' : 'weather-inactive'}`} style={headerStyle}>
      {showWeather ?
        <Weather />
        : null}
      <header className='header__title'>
        <div className='header__title-content'>
          {/* <section className='sidebar__header-userinfo'>
            <h2>My Tasks</h2>
            <span><CgToggleSquare /></span>
          </section> */}
          {sidebarView ? (
            <button aria-label='Close sidebar' className='header__title-sidebar-view-btn-open' onClick={() => setSidebarView(!sidebarView)}>
              <CiSquareChevUp />
            </button>
          ) : null}
          {/* <span><CgToggleSquare />cdgfvbcv</span> */}
          {/* <h1>{title}</h1> */}
          {/* {currentPage=='Board'? */}
          {!sidebarView ?
            <button aria-label='Open sidebar' className='header__title-sidebar-view-btn-close' onClick={() => setSidebarView(!sidebarView)}>
              {/* <ImMenu3 /> */}
              <CiSquareChevDown />

            </button> : null}
        </div>
        {/* <span><CgToggleSquare />cdgfvbcv</span> */}
        <div className='header__title-sidebar-theme-toggle'>
          {/* <Weather /> */}
          <span 
            aria-label={`Toggle theme (currently ${theme})`} 
            role="button" 
            tabIndex={0} 
            className={`header__title-sidebar-theme-toggle ${theme}`} 
            onClick={() => handleToggle()} 
            onKeyDown={(e) => { if (e.key === 'Enter') handleToggle(); }}
          >
            {theme === 'system' ? <MdDevices /> : theme === 'dark' ? <MdDarkMode /> : <MdLightMode />}
          </span>

        </div>
      </header>

      {isPromodoroActive && !isTimeOver && (
        <div className="promodoro-banner" style={{ background: 'red' }}>
          Time Remaining: {timeRemaining}
        </div>
      )}
      {isTimeOver && (
        <div className="time-over-banner">
          Time's Up!
        </div>
      )}

    </header>
  );
}

export default Header;

