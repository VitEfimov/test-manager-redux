import React from 'react';
import Weather from './Weather';
import { useDispatch, useSelector } from 'react-redux';
import { CgToggleSquare, CgToggleSquareOff } from "react-icons/cg";
import { CiSquareChevDown, CiSquareChevUp } from "react-icons/ci";
import { updateUserTheme } from '../features/userSlice';


const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, setSidebarView, sidebarView, showWeather }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.userReducer.theme);
  const themeReducer = useSelector(state => state.themeReducer);
  const userPicture = themeReducer?.userPicture;

  const handleToggle = () => {
    dispatch(updateUserTheme(!theme));
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
          {theme === true ?
            <span aria-label='Toggle light theme' role="button" tabIndex={0} className='header__title-sidebar-theme-toggle dark' onClick={() => handleToggle()} onKeyDown={(e) => { if (e.key === 'Enter') handleToggle(); }}><CgToggleSquare /></span>
            :
            <span aria-label='Toggle dark theme' role="button" tabIndex={0} className='header__title-sidebar-theme-toggle light' onClick={() => handleToggle()} onKeyDown={(e) => { if (e.key === 'Enter') handleToggle(); }}><CgToggleSquareOff /></span>
          }

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

