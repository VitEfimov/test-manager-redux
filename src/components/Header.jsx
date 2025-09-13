import React from 'react';
import Weather from './Weather';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { ImMenu4, ImMenu3 } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';

const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setSidebarView, sidebarView, currentPage }) => {
  const user = useSelector(state => state.userReducer.user || []);
  return (
    <header className='header'>
      <p>Test for header visability</p>
      <header className='header__title'>
        <div className='header__title-content'>
          <section className='sidebar__header-userinfo'>
            <h2>{user[0].name}</h2>
            <p>{user[0].email}</p>
          </section>
          <button className='header__title-sidebar-view-btn-open' onClick={() => setSidebarView(!sidebarView)}>
            {sidebarView ?
              <ImMenu4 />
              :
              null
            }
          </button>
          {/* <h1>{title}</h1> */}
          {/* {currentPage=='Board'? */}
          {!sidebarView ?
            <button className='header__title-sidebar-view-btn-close' onClick={() => setSidebarView(!sidebarView)}>
              <ImMenu3 />
            </button> : null}
        </div>
        <Weather />
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

