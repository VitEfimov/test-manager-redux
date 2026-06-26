import './App.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, loadGuestTasks } from './features/taskSlice';
import { checkAuth } from './features/userSlice';
import { resetTheme } from './features/themeSlice';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
// eslint-disable-next-line no-unused-vars
import Login from './components/Login';
// Modals are lazy loaded below
import React, { Suspense, lazy } from 'react';
import { themeFromSourceColor, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

const Pomodoro = lazy(() => import('./components/Pomodoro'));
const ListOfSections = lazy(() => import('./components/ListOfSections'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Settings = lazy(() => import('./components/Settings'));
const About = lazy(() => import('./components/About'));
const ThemeSettingsSidebar = lazy(() => import('./components/ThemeSettingsSidebar'));
const PomodoroSettingsModal = lazy(() => import('./components/PomodoroSettingsModal'));
function App() {

  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isPomodoroActive, setIsPromodoroActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [title, setTitle] = useState('');
  const [sidebarView, setSidebarView] = useState(true);

  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated, theme: userTheme, showWeather, isGuest } = useSelector((state) => state.userReducer);
  const theme = useSelector((state) => state.themeReducer);
  // eslint-disable-next-line no-unused-vars
  const tasks = useSelector((state) => state.taskReducer.tasks);
  // eslint-disable-next-line no-unused-vars
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
    const root = document.documentElement;

    if (userTheme === 'dark' || userTheme === 'contrast') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      root.style.colorScheme = 'dark';
    } else if (userTheme === 'light') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      root.style.colorScheme = 'light';
    } else {
      document.body.classList.remove('dark-mode', 'light-mode');
      root.style.colorScheme = 'light dark';
    }
  }, [userTheme]);

  // Auto-repair corrupted theme colors from previous bug
  useEffect(() => {
    if (theme.colors.textColor === '#000000' && theme.colors.mainBg === null && theme.colors.sidebarBg === null) {
      console.log("Auto-repairing corrupted custom theme colors...");
      dispatch(resetTheme());
    }
  }, [theme.colors, dispatch]);

  useEffect(() => {
    const root = document.documentElement;

    const setOrReset = (variable, value) => {
      if (value) {
        root.style.setProperty(variable, value);
      } else {
        root.style.removeProperty(variable);
      }
    };

    if (theme.sourceColor) {
      let colorToUse = theme.sourceColor;
      if (!/^#[0-9A-Fa-f]{6}$/i.test(colorToUse)) {
        colorToUse = '#4F7D4F'; // fallback if corrupted
      }
      const matTheme = themeFromSourceColor(argbFromHex(colorToUse));
      const isDark = userTheme === 'dark' || userTheme === 'contrast' || (userTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const scheme = isDark ? matTheme.schemes.dark : matTheme.schemes.light;
      
      setOrReset('--color-primary', hexFromArgb(scheme.primary));
      setOrReset('--color-primary-container', hexFromArgb(scheme.primaryContainer));
      // Added lighter variants
      setOrReset('--color-primary-light', `color-mix(in srgb, ${hexFromArgb(scheme.primary)}, transparent 70%)`);
      
      if (userTheme === 'contrast') {
        setOrReset('--bg-main', '#000000');
        setOrReset('--bg-sidebar', '#0a0a0a');
        setOrReset('--bg-card', '#141414');
        setOrReset('--bg-header', '#0a0a0a');
        setOrReset('--surface-container', '#0a0a0a');
        setOrReset('--surface-container-high', '#222222');
        setOrReset('--text-primary', '#ffffff');
        setOrReset('--text-secondary', '#dddddd');
        setOrReset('--border-color', hexFromArgb(scheme.primary));
        setOrReset('--color-danger', '#ff3333');
      } else {
        setOrReset('--bg-main', `color-mix(in srgb, ${hexFromArgb(scheme.primary)}, transparent 94%)`);
        setOrReset('--bg-main-light', `color-mix(in srgb, ${hexFromArgb(scheme.primary)}, transparent 97%)`); // Even lighter background
        setOrReset('--bg-sidebar', hexFromArgb(scheme.surfaceVariant)); 
        setOrReset('--bg-card', hexFromArgb(scheme.surface));
        setOrReset('--bg-header', hexFromArgb(scheme.primaryContainer));
        setOrReset('--surface-container', `color-mix(in srgb, ${hexFromArgb(scheme.primary)}, transparent 90%)`);
        setOrReset('--surface-container-high', `color-mix(in srgb, ${hexFromArgb(scheme.primary)}, transparent 80%)`);
        setOrReset('--text-primary', hexFromArgb(scheme.onSurface));
        setOrReset('--text-secondary', hexFromArgb(scheme.onSurfaceVariant));
        setOrReset('--border-color', hexFromArgb(scheme.outline));
        setOrReset('--color-danger', hexFromArgb(scheme.error));
      }

      setOrReset('--text-inverse', hexFromArgb(scheme.onPrimary));
      setOrReset('--text-tertiary', hexFromArgb(scheme.onSurfaceVariant));
    } else {
      setOrReset('--bg-sidebar', theme.colors.sidebarBg);
      setOrReset('--bg-main', theme.colors.mainBg);
      setOrReset('--bg-header', theme.colors.headerBg);
      setOrReset('--text-primary', theme.colors.textColor);
      setOrReset('--bg-card', theme.colors.cardBg);
      setOrReset('--text-inverse', theme.colors.sidebarText);
      setOrReset('--text-secondary', theme.colors.cardText);
      setOrReset('--text-tertiary', theme.colors.boardText);
    }

    // Font size
    let fontCalc = 'calc(10px + 1vmin)';
    if (theme.fontSize === 'small') fontCalc = 'calc(9px + 1vmin)';
    if (theme.fontSize === 'big') fontCalc = 'calc(16px + 1vmin)';
    if (theme.fontSize === 'device') fontCalc = 'calc(1rem + 0.3vmin)';
    // root.style.setProperty('font-size', fontCalc);

    // Columns
    root.style.setProperty('--col-task-width', `${theme.columnWidths.taskName}dvw`);
    root.style.setProperty('--col-due-width', `${theme.columnWidths.dueDate}dvw`);
    root.style.setProperty('--col-priority-width', `${theme.columnWidths.priority}dvw`);

    // Preset Theme Palette (Default, Forest, Green, etc)
    if (theme.presetTheme && theme.presetTheme !== 'default') {
      root.setAttribute('data-theme', theme.presetTheme);
    } else {
      root.removeAttribute('data-theme');
    }

  }, [theme, userTheme]);

  const renderPage = (sidebarView) => {
    switch (currentPage) {
      case 'Board':
        return <ListOfSections sidebarView={sidebarView} />;

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
            {currentPage !== 'Pomodoro' && renderPage(sidebarView)}
            <div style={{ display: currentPage === 'Pomodoro' ? 'block' : 'none', height: '100%', width: '100%', flex: 1 }}>
              <Pomodoro />
            </div>
          </Suspense>
        </div>
      </div>
      <Suspense fallback={null}>
        <ThemeSettingsSidebar />
        <PomodoroSettingsModal />
      </Suspense>
    </div>
  );
}

export default App;

