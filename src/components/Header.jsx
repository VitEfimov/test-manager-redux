import React from 'react';
import Weather from './Weather';
import { MdKeyboardArrowLeft,MdKeyboardArrowRight } from "react-icons/md";

const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setSidebarView, sidebarView}) => {

  return (
    <header className='header'>
      <header className='header__title'>
        <div className='header__title-content'>
          <h1>{title}</h1>
          <button className='header__title-sidebar-view-btn' onClick={() => setSidebarView(!sidebarView)}>
            {sidebarView ?
            //  <MdKeyboardArrowLeft/>
             null
              : 
            <MdKeyboardArrowRight/>
            
            }
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

