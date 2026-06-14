import React, { startTransition, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/userSlice';
import { clearTasks } from '../features/taskSlice';
import dayjs from 'dayjs';
import { FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { IoTimerOutline, IoInformationCircle, IoLogOutSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import '../styles/Sidebar.css';

const Sidebar = ({ setCurrentPage, setTitle, sidebarView, setSidebarView }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.userReducer.isAuthenticated);
    const currentPage = useSelector(state => state.userReducer.currentPage);

    const tasks = useSelector(state => state.taskReducer.tasks || []);
    const todayTasks = tasks.filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day'));
    const completedToday = todayTasks.filter(task => task.completed).length;
    const totalToday = todayTasks.length;
    const progressPercent = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigation = (page) => {
        startTransition(() => {
            setCurrentPage(page);
            setTitle(page);
        });
    };

    const handleLogout = () => {
        if (isAuthenticated) {
            dispatch(logoutUser());
            dispatch(clearTasks());
        }
    };

    const sidebarClass = isMobile ? `sidebar ${sidebarView ? 'opened' : 'closed'}` : `sidebar-v2 ${sidebarView ? 'opened' : 'closed'}`;

    return (
        <aside className={sidebarClass}>
            {!isMobile && (
                <>
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 11 12 14 22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                        </div>
                        <span>TaskFlow</span>
                    </div>

                    <div className="sidebar-stats">
                        <div className="sidebar-stats-label">Today's progress</div>
                        <div className="sidebar-stats-counts">
                            <span className="sidebar-stats-done">{completedToday}</span>
                            <span className="sidebar-stats-total">/ {totalToday}</span>
                        </div>
                        <div className="sidebar-stats-bar-bg">
                            <div className="sidebar-stats-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="sidebar-stats-remaining">{todayTasks.length - completedToday} tasks remaining</div>
                    </div>
                </>
            )}

            {isMobile ? (
                <div className={`sidebar-main-btn${sidebarView ? 'open' : 'closed'}`}>
                    <button className="nav-button dashboard" onClick={() => handleNavigation('Dashboard')} aria-label="Dashboard">
                        <i className='nav-button-icon'><RxDashboard /></i><span className='nav-button-name'>Dashboard</span>
                    </button>
                    <button className="nav-button board" onClick={() => handleNavigation('Board')} aria-label="Board">
                        <i className='nav-button-icon'><FaTasks /></i><span className='nav-button-name'>Board</span>
                    </button>
                    <button className="nav-button pomodoro" onClick={() => handleNavigation('Pomodoro')} aria-label="Pomodoro">
                        <i className='nav-button-icon'><IoTimerOutline /></i><span className='nav-button-name'>Pomodoro</span>
                    </button>
                    <button className="nav-button about" onClick={() => handleNavigation('About')} aria-label="About">
                        <i className='nav-button-icon'><IoInformationCircle /></i><span className='nav-button-name'>About</span>
                    </button>
                    <button className="nav-button settings" onClick={() => handleNavigation('Settings')} aria-label="Settings">
                        <i className='nav-button-icon'><IoMdSettings /></i><span className='nav-button-name'>Settings</span>
                    </button>
                    <button 
                      className="nav-button" 
                      onClick={handleLogout} 
                      aria-label="Logout"
                    >
                        <i className='nav-button-icon'><IoLogOutSharp /></i><span className='nav-button-name'>LogOut</span>
                    </button>
                </div>
            ) : (
                <nav>
                    <button className={`nav-item ${currentPage === 'Dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('Dashboard')} aria-label="Dashboard">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        </svg>
                        Dashboard
                    </button>
                    <button className={`nav-item ${currentPage === 'Board' ? 'active' : ''}`} onClick={() => handleNavigation('Board')} aria-label="Board">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                        Board
                    </button>
                    <button className={`nav-item ${currentPage === 'Pomodoro' ? 'active' : ''}`} onClick={() => handleNavigation('Pomodoro')} aria-label="Pomodoro">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Pomodoro
                    </button>
                    <button className={`nav-item ${currentPage === 'About' ? 'active' : ''}`} onClick={() => handleNavigation('About')} aria-label="About">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        About
                    </button>
                    <button className={`nav-item ${currentPage === 'Settings' ? 'active' : ''}`} onClick={() => handleNavigation('Settings')} aria-label="Settings">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        Settings
                    </button>
                </nav>
            )}

            <div className="sidebar-footer">
                <div className="sidebar-divider"></div>
                <button 
                    className="nav-item" 
                    onClick={handleLogout}
                    style={{ opacity: isAuthenticated ? 1 : 0.5, cursor: isAuthenticated ? 'pointer' : 'not-allowed' }}
                    disabled={!isAuthenticated}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
