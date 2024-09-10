import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlay, FaPause } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { IoNotifications } from "react-icons/io5";
import useSound from 'use-sound';

const Pomodoro = () => {
    const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro);
    const [time, setTime] = useState(pomodoro[0].time);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [timerEnded, setTimerEnded] = useState(false);
    const [completedIntervals, setCompletedIntervals] = useState(0); // Track completed intervals
    const breakInterval = pomodoro[0].breakInterval;
    const intervalCount = Number(pomodoro[0].intervalCount); // Ensure it's a number

    const [play] = useSound('./end_sound.ogg', {
        onload: () => console.log("Sound loaded successfully"),
        onerror: (err) => console.error("Sound failed to load", err)
    });

    const intervalRef = useRef(null);

    const startTimer = () => {
        setIsActive(true);
        setTimerEnded(false);
        intervalRef.current = setInterval(() => {
            setTime(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(intervalRef.current);
                    setIsActive(false);
                    setTimerEnded(true);
                    play();
                    showNotification();
                    
                    if (isBreak) {
                        // Start work timer again after break
                        setCompletedIntervals(prev => prev + 1);
                        if (completedIntervals + 1 >= intervalCount) {
                            alert('All intervals completed!');
                            return;
                        }
                        setIsBreak(false);
                        setTime(pomodoro[0].time); // Reset to work time
                        startTimer();
                    } else {
                        // Switch to break
                        setIsBreak(true);
                        setTime(breakInterval);
                        startTimer();
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
        setTime(pomodoro[0].time);
        setIsBreak(false);
        setTimerEnded(false);
        setCompletedIntervals(0); // Reset completed intervals
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return {
            min: String(minutes).padStart(2, '0'),
            sec: String(seconds).padStart(2, '0')
        };
    };

    const showNotification = () => {
        if (Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: isBreak ? 'Break time is over!' : 'Work time is over!',
                icon: <IoNotifications />
            });
        }
    };

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const renderIntervals = () => {
        return [...Array(intervalCount)].map((_, index) => (
            <div
                key={index}
                className='pomodoro__container-interval-item'
                style={{
                    backgroundColor: index < completedIntervals ? 'green' : 'gray' // Change color based on completion
                }}
            >
                Interval {index + 1}
            </div>
        ));
    };

    return (
        <section className="section">
            <div className='pomodoro__container'>
                <h2>{isBreak ? 'Break Time' : 'Work Time'}</h2>
                <div className="pomodoro__container-timer">
                    <div className="pomodoro__container-timer-time">
                        {timerEnded ? '00' : formatTime(time).min}
                    </div>
                    <div className="promodoro__container-timer-time">
                        {timerEnded ? '00' : formatTime(time).sec}
                    </div>
                </div>
                <div className="pomodoro__container__controls">
                    {!isActive ? (
                        <button className='pomodoro__container__controls-start-btn' onClick={startTimer}>
                            <FaPlay />
                        </button>
                    ) : (
                        <button className='pomodoro__container__controls-start-pause' onClick={pauseTimer}>
                            <FaPause />
                        </button>
                    )}
                    <button className='pomodoro__container__controls-reset-btn' onClick={resetTimer}>
                        <GrPowerReset />
                    </button>
                </div>

                <div className='pomodoro__container-interval-container'>
                    {renderIntervals()}
                </div>
            </div>
        </section>
    );
}

export default Pomodoro;



// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { FaPlay, FaPause } from "react-icons/fa";
// import { GrPowerReset } from "react-icons/gr";
// import { IoNotifications } from "react-icons/io5";
// import useSound from 'use-sound';

// const Pomodoro = () => {
//     const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro);
//     const [time, setTime] = useState(pomodoro[0].time);
//     const [isActive, setIsActive] = useState(pomodoro[0].isActive);
//     const [isBreak, setIsBreak] = useState(pomodoro[0].isBreak);
//     const [timerEnded, setTimerEnded] = useState(false);
//     const breakInterval = pomodoro[0].breakInterval;
//     const intervalCount = pomodoro[0].intervalCount;

//     const [play] = useSound('./end_sound.ogg', {
//         onload: () => console.log("Sound loaded successfully"),
//         onerror: (err) => console.error("Sound failed to load", err)
//     });

//     const intervalRef = useRef(null);

//     const startTimer = () => {
//         setIsActive(true);
//         setTimerEnded(false);
//         intervalRef.current = setInterval(() => {
//             setTime(prevTime => {
//                 if (prevTime <= 0) {
//                     clearInterval(intervalRef.current);
//                     setIsActive(false);
//                     setTimerEnded(true);
//                     showNotification();
//                     play();
//                     return 0;
//                 }
//                 return Math.max(0, prevTime - 1);
//             });
//         }, 1000);
//     };

//     const pauseTimer = () => {
//         clearInterval(intervalRef.current);
//         setIsActive(false);
//     };

//     const resetTimer = () => {
//         clearInterval(intervalRef.current);
//         setIsActive(false);
//         setTime(pomodoro[0].time);
//         setIsBreak(false);
//         setTimerEnded(false);
//     };

//     const formatTime = (timeInSeconds) => {
//         const minutes = Math.floor(timeInSeconds / 60);
//         const seconds = timeInSeconds % 60;
//         const pomodoroTime = {
//             min: `${String(minutes).padStart(2, '0')}`,
//             sec: `${String(seconds).padStart(2, '0')}`
//         };
//         return pomodoroTime;
//     };

//     const showNotification = () => {
//         if (Notification.permission === 'granted') {
//             new Notification('Pomodoro Timer', {
//                 body: isBreak ? 'Break time is over!' : 'Work time is over!',
//                 icon: <IoNotifications />
//             });
//         }
//     };


//     useEffect(() => {
//         if (Notification.permission !== 'granted') {
//             Notification.requestPermission();
//         }
//     }, []);

//     const playSound = () => {
//         // const audio = new Audio('./start_sound.mp3');

//         play();
//     };


//     useEffect(() => {
//         if (timerEnded === true) {
//             console.log("Playing from sound");
//             play(); // Play sound when timer reaches 0
//         }
//     }, [timerEnded, play]);

//     const renderIntervals = () => {
//         return [...Array(intervalCount)].map((_, index) => (
//             <div key={index} className='pomodoro__container-interval-item'>
//                 Interval {index + 1}
//             </div>
//         ));
//     };

//     const ExampleComponent = () => {
//         const elements = [];
//         for (let i = 0; i < intervalCount; i++) {
//             elements.push(
//                 <div key={i} className='pomodoro__container-interval-item'>

//                 </div>
//             );
//         }
//         return (
//             <div className='pomodoro__container-element-container'>
//                 {elements}
//             </div>
//         );
//     };

//     return (
//         <section className="section">
//             <div className='pomodoro__container'>
//                 <h2>{isBreak ? 'Break Time' : 'Work Time'}</h2>
//                 <div className="pomodoro__container-timer">
//                     <div className="pomodoro__container-timer-time">{timerEnded ? '00' : formatTime(time).min}</div>
//                     <div className="promodoro__container-timer-time">{timerEnded ? '00' : formatTime(time).sec}</div>
//                 </div>
//                 <div className="pomodoro__container__controls">
//                     {!isActive ? (
//                         <button className='pomodoro__container__controls-start-btn' onClick={startTimer}><FaPlay /></button>
//                     ) : (
//                         <button className='pomodoro__container__controls-start-pause' onClick={pauseTimer}><FaPause /></button>
//                     )}
//                     <button className='pomodoro__container__controls-reset-btn' onClick={resetTimer}><GrPowerReset /></button>
//                     {/* <button className='pomodoro__container__controls-reset-btn' onClick={play}>PLAY</button> */}
//                 </div>
//                 {intervalCount > 0 ? ExampleComponent() : null}
//             </div>
//         </section>
//     );
// }

// export default Pomodoro;


// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { FaPlay, FaPause } from "react-icons/fa";
// import { GrPowerReset } from "react-icons/gr";

// const Pomodoro = () => {
//     const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro);
//     const [time, setTime] = useState(pomodoro[0].time);
//     const [isActive, setIsActive] = useState(pomodoro[0].isActive);
//     const [isBreak, setIsBreak] = useState(pomodoro[0].isBreak);
//     const breakInterval = pomodoro[0].breakInterval

//     const intervalRef = useRef(null);

//     const startTimer = () => {
//         setIsActive(true);
//         intervalRef.current = setInterval(() => {
//             setTime(prevTime => {
//                 if (prevTime <= 0) {
//                     clearInterval(intervalRef.current);
//                     setIsActive(false);
//                     showNotification();
//                     if (isBreak) {
//                         setTime(breakInterval * 60);
//                         setIsBreak(false);
//                     } else {
//                         setTime(pomodoro[0].time);
//                         setIsBreak(true);
//                     }
//                 }
//                 return Math.max(0, prevTime - 1);
//             });
//         }, 1000);
//     };

//     const pauseTimer = () => {
//         clearInterval(intervalRef.current);
//         setIsActive(false);
//     };

//     const resetTimer = () => {
//         clearInterval(intervalRef.current);
//         setIsActive(false);
//         setTime(pomodoro[0].time);
//         setIsBreak(false);
//     };

//     const formatTime = (timeInSeconds) => {
//         const minutes = Math.floor(timeInSeconds / 60);
//         const seconds = timeInSeconds % 60;
//         const pomodoroTime = {
//             min: `${String(minutes).padStart(2, '0')}`,
//             sec: `${String(seconds).padStart(2, '0')}`
//         };
//         return pomodoroTime;
//     };

//     const showNotification = () => {
//         if (Notification.permission === 'granted') {
//             new Notification('Pomodoro Timer', {
//                 body: isBreak ? 'Break time is over!' : 'Work time is over!',
//                 icon: 'path_to_icon.png'
//             });
//         }
//     };

//     useEffect(() => {
//         if (Notification.permission !== 'granted') {
//             Notification.requestPermission();
//         }
//     }, []);

//     return (
//         <section className="section">
//             <div className='pomodoro__container'>
//                 <h2>{isBreak ? 'Break Time' : 'Work Time'}</h2>
//                 <div className="pomodoro__container-timer">
//                     <div className="pomodoro__container-timer-time">{formatTime(time).min}</div>
//                     <div className="promodoro__container-timer-time">{formatTime(time).sec}</div>
//                 </div>
//                 <div className="pomodoro__container__controls">
//                     {!isActive ? (
//                         <button className='pomodoro__container__controls-start-btn' onClick={startTimer}><FaPlay /></button>
//                     ) : (
//                         <button className='pomodoro__container__controls-start-pause' onClick={pauseTimer}><FaPause /></button>
//                     )}
//                     <button className='pomodoro__container__controls-reset-btn' onClick={resetTimer}><GrPowerReset /></button>
//                 </div>
//             </div>
//         </section>
//     );
// }

// export default Pomodoro;


// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { FaPlay,FaPause  } from "react-icons/fa";
// import { GrPowerReset } from "react-icons/gr";


// const Pomodoro = () => {
//     const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro);
//     const [time, setTime] = useState(pomodoro[0].time);
//     const [isActive, setIsActive] = useState(pomodoro[0].isActive);
//     const [isBreak, setIsBreak] = useState(pomodoro[0].isBreak);
//     const breakInterval = pomodoro[0].breakInterval

//     const intervalRef = useRef(null);
//     const startTimer = () => {
//         setIsActive(true);
//         intervalRef.current = setInterval(() => {
//             setTime(prevTime => prevTime - 1);
//         }, 1000);
//     };

//     const pauseTimer = () => {
//         clearInterval(intervalRef.current);
//         setIsActive(false);
//     };

//     const resetTimer = () => {
//         clearInterval(intervalRef.current);
//         setIsActive(false);
//         setTime(pomodoro[0].time);
//         setIsBreak(false);
//     };

//     useEffect(() => {
//         if (time === 0) {
//             clearInterval(intervalRef.current);
//             setIsActive(false);
//             showNotification();

//             if (isBreak) {
//                 setTime(time * 60);
//                 setIsBreak(false);
//             } else {
//                 setTime(breakInterval * 60);
//                 setIsBreak(true);
//             }
//             startTimer();
//         }
//     }, [time, isBreak]);

//     const formatTime = (timeInSeconds) => {
//         const minutes = Math.floor(timeInSeconds / 60);
//         const seconds = timeInSeconds % 60;
//         const pomodoroTime = { min: `${minutes.toString().padStart(2, '0')}`, sec: `${seconds.toString().padStart(2, '0')}` }
//         return pomodoroTime;
//     };

//     const showNotification = () => {
//         if (Notification.permission === 'granted') {
//             new Notification('Pomodoro Timer', {
//                 body: isBreak ? 'Break time is over!' : 'Work time is over!',
//                 icon: 'path_to_icon.png'
//             });
//         }
//     };

//     useEffect(() => {
//         if (Notification.permission !== 'granted') {
//             Notification.requestPermission();
//         }
//     }, []);

//     return (
//         <section className="section">
//             <div className='pomodoro__container'>
//                 <h2>{isBreak ? 'Break Time' : 'Work Time'}</h2>
//                 <div className="pomodoro__container-timer">
//                     <div className="pomodoro__container-timer-time">{formatTime(time).min}</div>
//                     <div className="promodoro__container-timer-time">{formatTime(time).sec}</div>
//                 </div>
//                 <div className="pomodoro__container__controls">
//                     {!isActive ? (
//                         <button className='pomodoro__container__controls-start-btn' onClick={startTimer}><FaPlay /></button>
//                     ) : (
//                         <button className='pomodoro__container__controls-start-pause' onClick={pauseTimer}><FaPause /></button>
//                     )}
//                     <button className='pomodoro__container__controls-reset-btn' onClick={resetTimer}><GrPowerReset />
// </button>
//                 </div>
//             </div>
//         </section>
//     );
// }

// export default Pomodoro;