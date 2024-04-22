import React from 'react';
import Weather from './Weather';

const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setCurrentPage}) => {

  return (
    <header className='header'>
      <header className='header__board-title'>
        <h1>{title}</h1>
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

