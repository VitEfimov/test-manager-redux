import React from 'react';
import Weather from './Weather';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { ImMenu4, ImMenu3 } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { CgToggleSquare, CgToggleSquareOff } from "react-icons/cg";
import { use } from 'react';
import { FaArrowDownShortWide, FaArrowUpWideShort } from "react-icons/fa6";
import { CiSquareChevDown, CiSquareChevUp } from "react-icons/ci";
import { updateUserTheme } from '../features/userSlice';


const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setSidebarView, sidebarView, currentPage, showWeather }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.userReducer.isAuthenticated);
  const theme = useSelector(state => state.userReducer.theme);

  const handleToggle = () => {
    dispatch(updateUserTheme(!theme));
  };

  return (
    <header className={`header ${showWeather ? 'weather-active' : 'weather-inactive'}`}>
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
            <button className='header__title-sidebar-view-btn-open' onClick={() => setSidebarView(!sidebarView)}>
              <CiSquareChevUp />
            </button>
          ) : null}
          {/* <span><CgToggleSquare />cdgfvbcv</span> */}
          {/* <h1>{title}</h1> */}
          {/* {currentPage=='Board'? */}
          {!sidebarView ?
            <button className='header__title-sidebar-view-btn-close' onClick={() => setSidebarView(!sidebarView)}>
              {/* <ImMenu3 /> */}
              <CiSquareChevDown />

            </button> : null}
        </div>
        {/* <span><CgToggleSquare />cdgfvbcv</span> */}
        <div className='header__title-sidebar-theme-toggle'>
          {/* <Weather /> */}
          {theme === true ?
            <span className='header__title-sidebar-theme-toggle dark' onClick={() => handleToggle()}><CgToggleSquare /></span>
            :
            <span className='header__title-sidebar-theme-toggle light' onClick={() => handleToggle()}><CgToggleSquareOff /></span>
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

