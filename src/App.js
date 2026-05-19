import './App.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from './features/taskSlice';
import { checkAuth } from './features/userSlice';
import Sidebar from './components/Sidebar';
import Header from './components/Header'
import Pomodoro from './components/Pomodoro';
import ListOfSections from './components/ListOfSections';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import About from './components/About';
import Login from './components/Login';
import ThemeSettingsSidebar from './components/ThemeSettingsSidebar';

function App() {

  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isPomodoroActive, setIsPromodoroActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [title, setTitle] = useState('');
  const [sidebarView, setSidebarView] = useState(true);

  const dispatch = useDispatch();
  const { isAuthenticated, loading, theme: userTheme } = useSelector((state) => state.userReducer);
  const theme = useSelector((state) => state.themeReducer);
  const [showWeather, setShowWeather] = useState(false);


  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    document.documentElement.style.colorScheme = userTheme ? 'dark' : 'light';
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

    // Font size
    let fontCalc = 'calc(7px + 1vmin)';
    if (theme.fontSize === 'small') fontCalc = 'calc(5px + 1vmin)';
    if (theme.fontSize === 'big') fontCalc = 'calc(10px + 1vmin)';
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
        return <Settings
          setCurrentPage={setCurrentPage}
          showWeather={showWeather}
          setShowWeather={setShowWeather} />;
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


  if (loading && !isAuthenticated) {
    return <div>Loading...</div>; // Prevent flash of login screen while checking auth
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (


    <main className='container'>

      <Header
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        title={title}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
        isPomodoroActive={isPomodoroActive}
        timeRemaining={timeRemaining}
        isTimeOver={isTimeOver}
        showWeather={showWeather}
        setShowWeather={setShowWeather}
      />
      <div className='main-content'>
        {sidebarView ?
          <Sidebar setCurrentPage={setCurrentPage}
            setTitle={setTitle}
            sidebarView={sidebarView}
            setSidebarView={setSidebarView} />
          :
          null}
        {renderPage(sidebarView)}
      </div>
      <ThemeSettingsSidebar />
    </main>

  );
}

export default App;

