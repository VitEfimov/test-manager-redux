import './App.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, loadGuestTasks } from './features/taskSlice';
import { checkAuth, updateShowWeather } from './features/userSlice';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import ThemeSettingsSidebar from './components/ThemeSettingsSidebar';

import React, { Suspense, lazy } from 'react';

const Pomodoro = lazy(() => import('./components/Pomodoro'));
const ListOfSections = lazy(() => import('./components/ListOfSections'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Settings = lazy(() => import('./components/Settings'));
const About = lazy(() => import('./components/About'));


function App() {

  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isPomodoroActive, setIsPromodoroActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [title, setTitle] = useState('');
  const [sidebarView, setSidebarView] = useState(true);

  const dispatch = useDispatch();
  const { isAuthenticated, theme: userTheme, showWeather, isGuest } = useSelector((state) => state.userReducer);
  const theme = useSelector((state) => state.themeReducer);
  const tasks = useSelector((state) => state.taskReducer.tasks);
  const boards = useSelector((state) => state.userReducer.boards);


  const [appReady, setAppReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [tasksChecked, setTasksChecked] = useState(false);

  useEffect(() => {
    dispatch(checkAuth()).finally(() => setAuthChecked(true));
  }, [dispatch]);

  useEffect(() => {
    if (authChecked) {
      if (isAuthenticated) {
        dispatch(fetchTasks()).finally(() => setTasksChecked(true));
      } else {
        dispatch(loadGuestTasks());
        setTasksChecked(true);
      }
    }
  }, [dispatch, authChecked, isAuthenticated]);

  // Local storage logic moved to Redux slices

  useEffect(() => {
    if (authChecked && tasksChecked) {
      setTimeout(() => setAppReady(true), 800); // 800ms minimum visual display
    }
  }, [authChecked, tasksChecked]);

  useEffect(() => {
    if (userTheme === 'system') {
      document.documentElement.style.colorScheme = 'light dark';
    } else {
      document.documentElement.style.colorScheme = userTheme === 'dark' ? 'dark' : 'light';
    }
  }, [userTheme]);

  useEffect(() => {
    const root = document.documentElement;

    // Helper to set or remove property
    const setOrReset = (variable, value) => {
      if (value) root.style.setProperty(variable, value);
      else root.style.removeProperty(variable);
    };

    setOrReset('--dark-background-color-sidebar', theme.colors.sidebarBg);
    setOrReset('--dark-background-color-main', theme.colors.mainBg);
    setOrReset('--dark-background-color-header', theme.colors.headerBg);
    setOrReset('--dark-font-color-white', theme.colors.textColor);
    setOrReset('--dark-background-color-card', theme.colors.cardBg);
    setOrReset('--dark-font-color-sidebar', theme.colors.sidebarText);
    setOrReset('--dark-font-color-card', theme.colors.cardText);
    setOrReset('--dark-font-color-board', theme.colors.boardText);

    // Font size
    let fontCalc = 'calc(10px + 1vmin)';
    if (theme.fontSize === 'small') fontCalc = 'calc(7px + 1vmin)';
    if (theme.fontSize === 'big') fontCalc = 'calc(15px + 1vmin)';
    root.style.setProperty('font-size', fontCalc);

    // Columns
    root.style.setProperty('--col-task-width', `${theme.columnWidths.taskName}dvw`);
    root.style.setProperty('--col-due-width', `${theme.columnWidths.dueDate}dvw`);
    root.style.setProperty('--col-priority-width', `${theme.columnWidths.priority}dvw`);
  }, [theme]);

  const renderPage = (sidebarView) => {
    switch (currentPage) {
      case 'Board':
        return <ListOfSections sidebarView={sidebarView} />;
      case 'Pomodoro':

        return <Pomodoro isPomodoroActive={isPomodoroActive}
          setIsPromodoroActive={setIsPromodoroActive}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining} />;

      case 'Dashboard':
        return <Dashboard />;
      case 'About':
        return <About />;
      case 'Settings':
        return <Settings setCurrentPage={setCurrentPage} />;
      default:
        return <Dashboard />;
    }
  };
  useEffect(() => {
    let intervalId;
    if (isPomodoroActive && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
      if (timeRemaining === 0) {
        setIsTimeOver(true);
      }
    }
    return () => clearInterval(intervalId);
  }, [isPomodoroActive, timeRemaining]);


  if (!appReady) {
    return (
      <div className="global-loader">
        <div className="spinner"></div>
        <h2 className="global-loader-title">TaskManager</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        setCurrentPage={setCurrentPage}
        setTitle={setTitle}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView} 
      />
      
      <div className="main">
        <Header
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          title={title}
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
          isPomodoroActive={isPomodoroActive}
          timeRemaining={timeRemaining}
          isTimeOver={isTimeOver}
        />
        
        <div className="content">
          <Suspense fallback={<div className="global-loader" style={{ height: '100%' }}><div className="spinner"></div></div>}>
            {renderPage(sidebarView)}
          </Suspense>
        </div>
      </div>
      <ThemeSettingsSidebar />
    </div>
  );
}

export default App;

