import React, { useState } from 'react';
import Weather from './Weather';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { ImMenu4, ImMenu3 } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { CgToggleSquare, CgToggleSquareOff } from "react-icons/cg";
import { use } from 'react';
import { FaArrowDownShortWide, FaArrowUpWideShort } from "react-icons/fa6";
import { CiSquareChevDown, CiSquareChevUp } from "react-icons/ci";


const Header = ({ isPromodoroActive, timeRemaining, isTimeOver, title, setSidebarView, sidebarView, currentPage }) => {
  const isAuthenticated = useSelector(state => state.userReducer.isAuthenticated);
  const theme = useSelector(state => state.userReducer.theme);
  const [toggle, setToggle] = useState(theme)

  console.log('toggle=',toggle)

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
      <header className='header__title'>
        <div className='header__title-content'>
          <section className='sidebar__header-userinfo'>
            <h2>My Tasks</h2>
            <span><CgToggleSquare /></span>
          </section>
          <span><CgToggleSquare /></span>
          <button className='header__title-sidebar-view-btn-open' onClick={() => setSidebarView(!sidebarView)}>
            {sidebarView ?
              // <ImMenu4 />
              <CiSquareChevUp />

              :
              null
            }
          </button>
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

