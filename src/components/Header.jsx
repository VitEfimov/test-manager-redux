import React, { useState } from 'react';
import Weather from './Weather';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { ImMenu4, ImMenu3 } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { CgToggleSquare, CgToggleSquareOff } from "react-icons/cg";
import { use } from 'react';

const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setSidebarView, sidebarView, currentPage }) => {
  const user = useSelector(state => state.userReducer.user || []);
  const [toggle, setToggle] = useState(user.theme)

  console.log('toggle=',toggle)
  console.log('user=',user)

  // const handleToggle = () => {
  //   if (toggle === 'dark'){
  //     setToggle('light')
  //   }else{
  //     setToggle('dark')
  //   }
  // }

  const handleToggle = () => {
    setToggle(prev => !prev);
    // if (toggle === true){
    //   setToggle(false)
    // }else{
    //   setToggle(true)
    // }
  }

  return (
    <header className='header'>
      <p>{user.name}</p>
      <header className='header__title'>
        <div className='header__title-content'>
          <section className='sidebar__header-userinfo'>
            <h2>{user[0].name}</h2>
            <p>{user[0].email}</p>
            <span><CgToggleSquare /></span>
          </section>
          <span><CgToggleSquare /></span>
          <button className='header__title-sidebar-view-btn-open' onClick={() => setSidebarView(!sidebarView)}>
            {sidebarView ?
              <ImMenu4 />
              :
              null
            }
          </button>
          {/* <span><CgToggleSquare />cdgfvbcv</span> */}
          {/* <h1>{title}</h1> */}
          {/* {currentPage=='Board'? */}
          {!sidebarView ?
            <button className='header__title-sidebar-view-btn-close' onClick={() => setSidebarView(!sidebarView)}>
              <ImMenu3 />
            </button> : null}
        </div>
        {/* <span><CgToggleSquare />cdgfvbcv</span> */}
        <div>
        <Weather />
        {toggle === true ?
        <span onClick={()=>handleToggle()}><CgToggleSquare /></span>
        :
        <span onClick={()=>handleToggle()}><CgToggleSquareOff /></span>
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

