import './App.css';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header'
import Pomodoro from './components/Pomodoro';
import ListOfSections from './components/ListOfSections';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import About from './components/About';

function App() {

  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isPomodoroActive, setIsPromodoroActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [title, setTitle] = useState('');
  const [sidebarView, setSidebarView] = useState(true);
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
          setCurrentPage={setCurrentPage} />;
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


  return (


    <main className='container'>
      {sidebarView ? 
        <Sidebar setCurrentPage={setCurrentPage}
        setTitle={setTitle}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}/>
        :
        null}
        <div className='main-content'>
        <Header 
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        title={title}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
        isPomodoroActive={isPomodoroActive}
        timeRemaining={timeRemaining}
        isTimeOver={isTimeOver} />
        {renderPage(sidebarView)}
        </div>
      </main>

  );
}

export default App;

