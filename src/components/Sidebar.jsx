import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask } from '../features/taskSlice';
import { MdDelete } from "react-icons/md";

const Sidebar = ({ setCurrentPage, setTitle }) => {
    // const dispatch = useDispatch();

    const tasks = useSelector(state => state.taskReducer.tasks || []);
const user = useSelector(state => state.userReducer.user || []);
    const handleNavigation = (page) => {
        setCurrentPage(page);
        setTitle(page);
    };



    return (

        <nav className="sidebar">
            <header className='sidebar__header'>
                <h2>{user[0].name}</h2>
                <p>{user[0].password}</p>
            </header>
            <button className="nav-button dashboard" onClick={() => handleNavigation('Dashboard')}>
                Dashboard
            </button>
            <button className="nav-button board" onClick={() => handleNavigation('Board')}>
                Board
            </button>
            <button className="nav-button pomodoro" onClick={() => handleNavigation('Pomodoro')}>
                Pomodoro
            </button>
            <button className="nav-button about" onClick={() => handleNavigation('About')}>
                About
            </button>
            <button className="nav-button settings" onClick={() => handleNavigation('Settings')}>
                Settings
            </button>
            <button className="nav-button " onClick={() => handleNavigation('Logout')} disabled>
                LogOut
            </button>
        </nav>

    )
}

export default Sidebar;
