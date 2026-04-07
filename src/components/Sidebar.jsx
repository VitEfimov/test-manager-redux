import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask } from '../features/taskSlice';
import { logout } from '../features/userSlice';
import { MdDelete } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { IoTimerOutline } from "react-icons/io5";
import { IoInformationCircle } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { ImMenu4, ImMenu3 } from "react-icons/im";



const Sidebar = ({ setCurrentPage, setTitle, sidebarView, setSidebarView }) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.taskReducer.tasks || []);
    const user = useSelector(state => state.userReducer.user || []);
    const handleNavigation = (page) => {
        setCurrentPage(page);
        setTitle(page);
    };



    return (
        // <nav className="sidebar">
        <nav className={`sidebar ${sidebarView ? 'opened' : 'closed'}`}>
            {/* <button className='header__title-sidebar-view-btn-open' onClick={() => setSidebarView(!sidebarView)}>
                {sidebarView ?
                    <ImMenu4 />
                    :
                    null
                }
            </button> */}
            {sidebarView
                ?
                (<div className='sidebar-main'>
                    <header className='sidebar__header'>

                        {/* <section className='sidebar__header-userinfo'>
                            <h2>{user[0].name}</h2>
                            <p>{user[0].email}</p>
                        </section>
                        <button className='header__title-sidebar-view-btn-open' onClick={() => setSidebarView(!sidebarView)}>
                            {sidebarView ?
                                <ImMenu4 />
                                :
                                null
                            }
                        </button> */}
                    </header>
                    <div className={`sidebar-main-btn${sidebarView ? 'open' : 'closed'}`}>
                    <button className="nav-button dashboard" onClick={() => handleNavigation('Dashboard')}>
                        <i className='nav-button-icon'><RxDashboard /></i><span className='nav-button-name'>Dashboard </span>
                    </button>
                    <button className="nav-button board" onClick={() => handleNavigation('Board')}>
                        <i className='nav-button-icon'><FaTasks /></i><span className='nav-button-name'>Board</span>
                    </button>
                    <button className="nav-button pomodoro" onClick={() => handleNavigation('Pomodoro')}>
                        <i className='nav-button-icon'><IoTimerOutline /></i><span className='nav-button-name'>Pomodoro </span>
                    </button>
                    <button className="nav-button about" onClick={() => handleNavigation('About')}>
                        <i className='nav-button-icon'><IoInformationCircle /></i><span className='nav-button-name'>About</span>
                    </button>
                    <button className="nav-button settings" onClick={() => handleNavigation('Settings')}>
                        <i className='nav-button-icon'><IoMdSettings /></i><span className='nav-button-name'>Settings</span>
                    </button>
                    <button className="nav-button " onClick={() => dispatch(logout())}>
                        <i className='nav-button-icon'><IoLogOutSharp /></i><span className='nav-button-name'>LogOut</span>
                    </button>
                    </div>
                    </div>)
                :
                (null)
            }
        </nav>
    )
}

export default Sidebar;
