import React from 'react';
import Weather from './Weather';
import { MdKeyboardArrowLeft,MdKeyboardArrowRight } from "react-icons/md";

const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setSidebarView, sidebarView}) => {

  return (
    <header className='header'>
      <header className='header__title'>
        <div className='header__title-btn'>
          <h1>{title}</h1>
          <button onClick={() => setSidebarView(!sidebarView)}>
            {sidebarView ? 'Hide' : 'Show'}
          </button>
        </div>
        <Weather/>
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

