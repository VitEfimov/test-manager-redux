import React from 'react';
import Weather from './Weather';
import { MdKeyboardArrowLeft,MdKeyboardArrowRight } from "react-icons/md";

const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setSidebarView, sidebarView, currentPage}) => {

  return (
    <header className='header'>
      <header className='header__title'>
        <div className='header__title-content'>
          <h1>{title}</h1>
          {currentPage=='Board'?
          <button className='header__title-sidebar-view-btn' onClick={() => setSidebarView(!sidebarView)}>
            {sidebarView ?
             <MdKeyboardArrowLeft/>
            //  null
              : 
            <MdKeyboardArrowRight
             style={{ paddingLeft: '50px' }}
             />
            
            }
          </button>:null}
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

