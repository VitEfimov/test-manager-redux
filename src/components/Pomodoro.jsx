// import React, { useState, useEffect, useRef } from "react";
// import useSound from "use-sound";
// // import startSound from "../assets/audio/start_sound.ogg";
// // import endSound from "../assets/audio/end_sound.mp3";

// import endSound from '../assets/audio/end_sound.ogg';
// import startSound from '../assets/audio/start_sound.mp3';

// const Pomodoro = () => {
//   const intervalCount = 5;
//   const workDuration = 25 * 60; // seconds
//   const breakDuration = 5 * 60;

//   const [localTime, setLocalTime] = useState(workDuration);
//   const [localIsBreak, setLocalIsBreak] = useState(false);
//   const [localIsActive, setLocalIsActive] = useState(false);
//   const [localCompletedIntervals, setLocalCompletedIntervals] = useState(0);
//   const [fillPercentage, setFillPercentage] = useState(0);

//   const intervalRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const wakeLockRef = useRef(null);

//   const [playStart] = useSound(startSound);
//   const [playEnd] = useSound(endSound);

//   // 🔊 Unlock Audio Context on first interaction
//   useEffect(() => {
//     const unlockAudio = () => {
//       if (!audioContextRef.current) {
//         const AudioContext = window.AudioContext || window.webkitAudioContext;
//         const ctx = new AudioContext();
//         const buffer = ctx.createBuffer(1, 1, 22050);
//         const source = ctx.createBufferSource();
//         source.buffer = buffer;
//         source.connect(ctx.destination);
//         source.start(0);
//         ctx.resume();
//         audioContextRef.current = ctx;
//       }
//     };

//     document.body.addEventListener("touchstart", unlockAudio, { once: true });
//     document.body.addEventListener("click", unlockAudio, { once: true });
//   }, []);

//   // 💤 Prevent screen sleep
//   useEffect(() => {
//     const requestWakeLock = async () => {
//       try {
//         if ("wakeLock" in navigator) {
//           wakeLockRef.current = await navigator.wakeLock.request("screen");
//         }
//       } catch (err) {
//         console.warn("Wake lock failed:", err);
//       }
//     };

//     const releaseWakeLock = () => {
//       if (wakeLockRef.current) {
//         wakeLockRef.current.release();
//         wakeLockRef.current = null;
//       }
//     };

//     document.addEventListener("visibilitychange", () => {
//       if (document.visibilityState === "visible") requestWakeLock();
//       else releaseWakeLock();
//     });

//     requestWakeLock();
//     return () => releaseWakeLock();
//   }, []);

//   // ⏰ Timer logic
//   useEffect(() => {
//     if (localIsActive) {
//       intervalRef.current = setInterval(() => {
//         setLocalTime((prev) => {
//           if (prev <= 1) {
//             handleIntervalEnd();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } else {
//       clearInterval(intervalRef.current);
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [localIsActive]);

//   // 📱 Handle page visibility
//   useEffect(() => {
//     let hiddenStart = null;

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         hiddenStart = Date.now();
//       } else if (hiddenStart && localIsActive) {
//         const diff = Math.floor((Date.now() - hiddenStart) / 1000);
//         setLocalTime((prev) => Math.max(prev - diff, 0));
//         hiddenStart = null;
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () =>
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, [localIsActive]);

//   // 📊 Progress bar
//   useEffect(() => {
//     const total = localIsBreak ? breakDuration : workDuration;
//     const percent = ((total - localTime) / total) * 100;
//     setFillPercentage(percent);
//   }, [localTime, localIsBreak]);

//   // 🧠 Handle end of each interval
//   const handleIntervalEnd = () => {
//     if (audioContextRef.current?.state === "suspended") {
//       audioContextRef.current.resume();
//     }

//     playEnd(); // end of work or break sound

//     if (!localIsBreak) {
//       const next = localCompletedIntervals + 1;
//       setLocalCompletedIntervals(next);

//       if (next < intervalCount) {
//         setLocalIsBreak(true);
//         setLocalTime(breakDuration);
//       } else {
//         // All intervals done
//         setLocalIsActive(false);
//         setLocalTime(workDuration);
//         setLocalCompletedIntervals(0);
//       }
//     } else {
//       // End of break → start next work session automatically
//       setLocalIsBreak(false);
//       setLocalTime(workDuration);
//       playStart();
//     }
//   };

//   const handleStartPause = () => {
//     if (!localIsActive && audioContextRef.current?.state === "suspended") {
//       audioContextRef.current.resume();
//     }
//     setLocalIsActive((prev) => !prev);
//   };

//   const handleReset = () => {
//     setLocalIsActive(false);
//     setLocalIsBreak(false);
//     setLocalTime(workDuration);
//     setLocalCompletedIntervals(0);
//     setFillPercentage(0);
//   };

//   const minutes = Math.floor(localTime / 60)
//     .toString()
//     .padStart(2, "0");
//   const seconds = (localTime % 60).toString().padStart(2, "0");

//   const percent =
//     ((localCompletedIntervals +
//       (1 - localTime / (localIsBreak ? breakDuration : workDuration))) /
//       intervalCount) *
//     100;

//   return (
//     <section className="section">
//       <div className="pomodoro__container">
//         <h2>{localIsBreak ? "Break Time" : "Work Time"}</h2>

//         <div className="pomodoro__time">
//           {minutes}:{seconds}
//         </div>

//         <div className="pomodoro__container-element-container">
//           <div className="pomodoro__container-interval-item-fill">
//             <div
//               className="pomodoro__container-interval-fill"
//               style={{
//                 width: `${percent}%`,
//                 backgroundColor: localIsBreak ? "#FF9800" : "#2196F3",
//               }}
//             />
//             <span className="progress-text">{percent.toFixed(0)}%</span>
//           </div>
//         </div>

//         <div className="pomodoro__buttons">
//           <button onClick={handleStartPause}>
//             {localIsActive ? "Pause" : "Start"}
//           </button>
//           <button onClick={handleReset}>Reset</button>
//         </div>

//         <p>
//           Completed: {localCompletedIntervals}/{intervalCount}
//         </p>
//       </div>
//     </section>
//   );
// };

// export default Pomodoro;











/////////////////////////////////////////////////////////////////


import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlay, FaPause } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import useSound from 'use-sound';
import endSound from '../assets/audio/end_sound.ogg';
import startSound from '../assets/audio/start_sound.mp3';
import {
  startTimer,
  pauseTimer,
  resetTimer,
  updateTime,
  completeWorkInterval,
  completeBreakInterval
} from '../features/pomodoroSlice';

const Pomodoro = () => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro[0]);

  const [localTime, setLocalTime] = useState(pomodoro.time);
  const [localIsActive, setLocalIsActive] = useState(false);
  const [localIsBreak, setLocalIsBreak] = useState(pomodoro.isBreak);
  const [localCompletedIntervals, setLocalCompletedIntervals] = useState(
    typeof pomodoro.intervalCount === 'object' ? pomodoro.intervalCount.passed : 0
  );

  const intervalRef = useRef(null);
  const staticIntervalCountRef = useRef(null);

  useEffect(() => {
    if (staticIntervalCountRef.current === null) {
      staticIntervalCountRef.current = typeof pomodoro.intervalCount === 'object'
        ? pomodoro.intervalCount.count
        : 5;
    }
  }, []);

  const [playEnd] = useSound(endSound);
  const [playStart] = useSound(startSound);

  useEffect(() => {
    setLocalTime(pomodoro.time);
    setLocalIsBreak(pomodoro.isBreak);
    setLocalCompletedIntervals(
      typeof pomodoro.intervalCount === 'object' ? pomodoro.intervalCount.passed : 0
    );
  }, [pomodoro]);

  const handleStartTimer = () => {
    if (localIsActive) return;

    setLocalIsActive(true);
    dispatch(startTimer());

    intervalRef.current = setInterval(() => {
      setLocalTime(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          setLocalIsActive(false);
          dispatch(pauseTimer());
          showNotification();
          handlePeriodEnd();
          return 0;
        }
        dispatch(updateTime(newTime));
        return newTime;
      });
    }, 1000);
  };

  const handlePauseTimer = () => {
    clearInterval(intervalRef.current);
    setLocalIsActive(false);
    dispatch(pauseTimer());
  };

  const handleResetTimer = () => {
    clearInterval(intervalRef.current);
    setLocalIsActive(false);
    setLocalIsBreak(false);
    setLocalCompletedIntervals(0);
    staticIntervalCountRef.current = typeof pomodoro.intervalCount === 'object'
      ? pomodoro.intervalCount.count
      : 5;
    dispatch(resetTimer());
  };
      console.log("localIsBreak",localIsBreak);
      console.log("localCompletedIntervals",localCompletedIntervals);
      console.log("staticIntervalCountRef.current",staticIntervalCountRef.current);
  const handlePeriodEnd = () => {
    if (localIsBreak) {
      dispatch(completeBreakInterval());
      playStart();
      // console.log("localIsBreak",localIsBreak);
      // console.log("localCompletedIntervals",localCompletedIntervals);
      // console.log("staticIntervalCountRef.current",staticIntervalCountRef.current);
      if (localCompletedIntervals >= staticIntervalCountRef.current) {
        alert("All intervals completed!");
        dispatch(resetTimer());
      }
    } else {
      dispatch(completeWorkInterval());
      playEnd();
    }
  };

//   const handlePeriodEnd = () => {
//   if (localIsBreak) {
//     // Break just ended → start new work session
//     dispatch(completeBreakInterval());
//     playStart();
//     // Automatically start next work session
//     setLocalIsActive(true);
//     setLocalIsBreak(false);
//     dispatch(startTimer());
//     setLocalTime(pomodoro.initialTime);
//   } else {
//     // Work just ended
//     dispatch(completeWorkInterval());
//     playEnd();

//     if (localCompletedIntervals + 1 >= staticIntervalCountRef.current) {
//       // ✅ All work intervals completed
//       setLocalIsActive(false);
//       alert("🎉 All intervals completed!");
//       dispatch(resetTimer());
//       setLocalIsBreak(false);
//       setLocalCompletedIntervals(0);
//     } else {
//       // Switch to break automatically
//       setLocalIsBreak(true);
//       setLocalTime(pomodoro.breakInterval);
//       setLocalIsActive(true);
//       dispatch(startTimer());
//     }
//   }
// };


  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: localIsBreak ? 'Break over! Time to work!' : 'Work done! Take a break!',
        icon: '/task_manager_icon.png'
      });
    }
  };

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const intervalCount = staticIntervalCountRef.current || 5;
  const currentFill = 100 - (localTime / pomodoro.initialTime) * 100;

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return {
      min: String(minutes).padStart(2, '0'),
      sec: String(seconds).padStart(2, '0')
    };
  };

  return (
    <section className="section">
      <div className='pomodoro__container'>
        <h2>{localIsBreak ? 'Break Time' : 'Work Time'}</h2>

        <div className="pomodoro__container-timer">
          <div className="pomodoro__container-timer-time">
            {formatTime(localTime).min}:{formatTime(localTime).sec}
          </div>
        </div>

        <div className="pomodoro__container__controls">
          {!localIsActive ? (
            <button onClick={handleStartTimer}>
              <FaPlay />
            </button>
          ) : (
            <button onClick={handlePauseTimer}>
              <FaPause />
            </button>
          )}
          <button onClick={handleResetTimer}>
            <GrPowerReset />
          </button>
        </div>

        <div className="pomodoro__intervals">
          {[...Array(intervalCount)].map((_, index) => {
            let fillWidth = 0;

            if (index < localCompletedIntervals) {
              fillWidth = 100; // completed intervals fully filled
            } else if (index === localCompletedIntervals && !localIsBreak) {
              fillWidth = currentFill; // current interval filling
            }

            return (
              <div key={index} className="interval-bar">
                <div
                  className="interval-fill"
                  style={{
                    width: `${fillWidth}%`,
                    backgroundColor: localIsBreak ? '#FF9800' : '#2196F3'
                  }}
                />
                <span className="interval-text">{Math.round(fillWidth)}%</span>
              </div>
            );
          })}
        </div>

        <div className="pomodoro__container-status">
          <p>Completed: {localCompletedIntervals}/{intervalCount} intervals</p>
          <p>Current: {localIsBreak ? 'Break' : 'Work'} session</p>
          <p>Work: {pomodoro.initialTime / 60} min | Break: {pomodoro.breakInterval / 60} min</p>
        </div>
      </div>
    </section>
  );
};

export default Pomodoro;

////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { FaPlay, FaPause } from "react-icons/fa";
// import { GrPowerReset } from "react-icons/gr";
// import useSound from 'use-sound';
// import endSound from '../assets/audio/end_sound.ogg';
// import startSound from '../assets/audio/start_sound.mp3';
// import {
//   startTimer,
//   pauseTimer,
//   resetTimer,
//   updateTime,
//   completeWorkInterval,
//   completeBreakInterval
// } from '../features/pomodoroSlice';

// const Pomodoro = () => {
//   const dispatch = useDispatch();
//   const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro[0]);

//   const [localTime, setLocalTime] = useState(pomodoro.time);
//   const [localIsActive, setLocalIsActive] = useState(false);
//   const [localIsBreak, setLocalIsBreak] = useState(pomodoro.isBreak);
//   const [localCompletedIntervals, setLocalCompletedIntervals] = useState(
//     typeof pomodoro.intervalCount === 'object' ? pomodoro.intervalCount.passed : 0
//   );

//   const intervalRef = useRef(null);
//   const staticIntervalCountRef = useRef(null);






//   // Store the interval count statically when component mounts
//   useEffect(() => {
//     if (staticIntervalCountRef.current === null) {
//       staticIntervalCountRef.current = typeof pomodoro.intervalCount === 'object' ? pomodoro.intervalCount.count : 5;
//     }
//   }, []);

//   const fillPercentage = 100 - (localTime / pomodoro.initialTime) * 100;
//   const intervalCount = staticIntervalCountRef.current || 5;


// const totalSteps = intervalCount; // total intervals
// const totalDuration = pomodoro.initialTime * intervalCount; // full work duration (without breaks)
// const completedPortion = localCompletedIntervals / totalSteps; 
// const currentPortion = (pomodoro.initialTime - localTime) / pomodoro.initialTime / totalSteps; 
// const overallFill = (completedPortion + currentPortion) * 100;




  

//   // const sounds = [startSound, endSound]



//   const [playEnd] = useSound(endSound , {
//     onload: () => console.log("End Sound loaded successfully"),
//     onerror: (err) => console.error("End Sound failed to load", err)
//   });

//   const [playStart] = useSound(startSound , {
//     onload: () => console.log("Start Sound loaded successfully"),
//     onerror: (err) => console.error("Start Sound failed to load", err)
//   });

//   // Sync with Redux state
//   useEffect(() => {
//     setLocalTime(pomodoro.time);
//     setLocalIsBreak(pomodoro.isBreak);
//     setLocalCompletedIntervals(
//       typeof pomodoro.intervalCount === 'object' ? pomodoro.intervalCount.passed : 0
//     );
//   }, [pomodoro]);

//   // const handleStartTimer = () => {
//   //   if (localIsActive) return; // Prevent multiple starts

//   //   setLocalIsActive(true);
//   //   dispatch(startTimer());

//   //   intervalRef.current = setInterval(() => {
//   //     setLocalTime(prevTime => {
//   //       const newTime = prevTime - 1;

//   //       if (newTime <= 0) {
//   //         clearInterval(intervalRef.current);
//   //         setLocalIsActive(false);
//   //         dispatch(pauseTimer());
//   //         playEnd(); 
//   //         // playStart();
//   //         showNotification();

//   //         handlePeriodEnd();
//   //         return 0;
//   //       }

//   //       dispatch(updateTime(newTime));
//   //       return newTime;
//   //     });
//   //   }, 1000);
//   // };


// const handleStartTimer = () => {
//   if (localIsActive) return;

//   setLocalIsActive(true);
//   dispatch(startTimer());

//   intervalRef.current = setInterval(() => {
//     setLocalTime(prevTime => {
//       const newTime = prevTime - 1;

//       if (newTime <= 0) {
//         clearInterval(intervalRef.current);
//         setLocalIsActive(false);
//         dispatch(pauseTimer());
//         showNotification();
//         handlePeriodEnd(); // sound logic handled inside
//         return 0;
//       }

//       dispatch(updateTime(newTime));
//       return newTime;
//     });
//   }, 1000);
// };

// //   const handleStartTimer = () => {
// //   if (localIsActive) return;

// //   playStart(); // play sound when user presses play
// //   setLocalIsActive(true);
// //   dispatch(startTimer());

// //   intervalRef.current = setInterval(() => {
// //     setLocalTime(prevTime => {
// //       const newTime = prevTime - 1;

// //       if (newTime <= 0) {
// //         clearInterval(intervalRef.current);
// //         setLocalIsActive(false);
// //         dispatch(pauseTimer());
// //         playEnd(); 
// //         showNotification();
// //         handlePeriodEnd();
// //         return 0;
// //       }

// //       dispatch(updateTime(newTime));
// //       return newTime;
// //     });
// //   }, 1000);
// // };


// //   const handlePeriodEnd = () => {
// //   if (localIsBreak) {
// //     // Break finished → Work should start
// //     dispatch(completeBreakInterval());
// //     playEnd();   // 🔔 break end
// //     playStart(); // ▶️ work start (optional auto-start)
// //     // keep timer paused if you want user to press play
// //   } else {
// //     // Work finished → Break should start
// //     dispatch(completeWorkInterval());
// //     playEnd();   // 🔔 work end
// //     playStart(); // ▶️ break start (optional auto-start)
// //   }

// //   // Check if cycles are done
// //   if (localCompletedIntervals + 1 >= intervalCount) {
// //     alert("All intervals completed!");
// //     dispatch(resetTimer());
// //   }
// // };

// const handlePeriodEnd = () => {
//   if (localIsBreak) {
//     // 🔔 Break finished → play START sound only
//     dispatch(completeBreakInterval());
//     playStart();  

//     if (localCompletedIntervals + 1 >= intervalCount) {
//       alert("All intervals completed!");
//       dispatch(resetTimer());
//     }

//   } else {
//     // 🔔 Work finished → play END sound only
//     dispatch(completeWorkInterval());
//     playEnd();
//   }
// };



// //   const handlePeriodEnd = () => {
// //     if (localIsBreak) {
// //       // Break time ended, prepare for next work interval (manual start)
// //       if (localCompletedIntervals < intervalCount) {
// //         dispatch(completeBreakInterval());
// //         // Don't auto-start, wait for user to click play
// //         // playEnd();   // 🔔 play end sound
// //         // playStart(); // ▶️ play start sound (starting new work)
// //       } else {
// //         // All intervals completed
// //         alert('All intervals completed!');
// //         dispatch(resetTimer());
// //       }
// //     } else {
// //       // Work time ended → switch to break
// //       dispatch(completeWorkInterval());
// //       playEnd();
// //       // Do not auto-start, just notify user
// //       // play();
// //       // showNotification();
// //     }
// //     // } else {
// //     //   // Work time ended, automatically start break
// //     //   dispatch(completeWorkInterval());
// //     //   // Auto-start break timer after a short delay
// //     //   setTimeout(() => {
// //     //     handleStartTimer();
// //     //   }, 1000);
// //   }
// // // };

// const handlePauseTimer = () => {
//   clearInterval(intervalRef.current);
//   setLocalIsActive(false);
//   dispatch(pauseTimer());
// };

// const handleResetTimer = () => {
//   clearInterval(intervalRef.current);
//   setLocalIsActive(false);
//   setLocalIsBreak(false);
//   setLocalCompletedIntervals(0);
//   // Reset the static interval count to current settings
//   staticIntervalCountRef.current = typeof pomodoro.intervalCount === 'object'
//  ? pomodoro.intervalCount.count : 4;
//   dispatch(resetTimer());
// };

// const formatTime = (timeInSeconds) => {
//   const minutes = Math.floor(timeInSeconds / 60);
//   const seconds = timeInSeconds % 60;
//   return {
//     min: String(minutes).padStart(2, '0'),
//     sec: String(seconds).padStart(2, '0')
//   };
// };

// const showNotification = () => {
//   if (Notification.permission === 'granted') {
//     new Notification('Pomodoro Timer', {
//       body: localIsBreak ? 'Break time is over! Time to work!' : 'Work time is over! Take a break!',
//       icon: '/task_manager_icon.png'
//     });
//   }
// };

// useEffect(() => {
//   if (Notification.permission !== 'granted') {
//     Notification.requestPermission();
//   }
// }, []);

// const renderIntervals = () => {
//   return [...Array(intervalCount)].map((_, index) => (
//     <div
//       key={index}
//       className='pomodoro__container-interval-item'
//       style={{
//         backgroundColor: index < localCompletedIntervals ? '#4CAF50' : '#e0e0e0',
//         color: index < localCompletedIntervals ? 'white' : 'black'
//       }}
//     >
//       {index + 1}
//     </div>
//   ));
// };


// const percent = ((localCompletedIntervals + (1 - localTime / pomodoro.initialTime)) / intervalCount) * 100

// return (
//   <section className="section">
//     <div className='pomodoro__container'>
//       <h2>{localIsBreak ? 'Break Time' : 'Work Time'}</h2>

//       <div className="pomodoro__container-timer">
//         <div className="pomodoro__container-timer-time">
//           {formatTime(localTime).min}
//         </div>
//         <div className="pomodoro__container-timer-time">
//           {formatTime(localTime).sec}
//         </div>
//       </div>

//       <div className="pomodoro__container__controls">
//         {!localIsActive ? (
//           <button onClick={handleStartTimer}>
//             <FaPlay />
//           </button>
//         ) : (
//           <button onClick={handlePauseTimer}>
//             <FaPause />
//           </button>
//         )}
//         <button onClick={handleResetTimer}>
//           <GrPowerReset />
//         </button>
//       </div>

//       <div className='pomodoro__container-interval-container'>
//         {renderIntervals()}
//       </div>

//       {/* <div className="pomodoro__progress-bar">
//   {/* <div
//     className="pomodoro__progress-bar-fill"
//     style={{
//       width: `${overallFill}%`,
//       backgroundColor: localIsBreak ? "#FF9800" : "#2196F3"
//     }}
//   />
// </div>v */} 

//       {/* <div className="pomodoro__container-element-container">
//         {[...Array(intervalCount)].map((_, index) => {
//           const isCurrent = index === localCompletedIntervals && localIsActive;
//           return (
//             <div key={index} className="pomodoro__container-interval-item">
//               {isCurrent && (
//                 <div
//                   className="pomodoro__container-interval-fill"
//                   style={{
//                     width: `${fillPercentage}%`,
//                     backgroundColor: localIsBreak ? '#FF9800' : '#2196F3'
//                   }}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div> */}


//       <div className="pomodoro__container-element-container">
//   {/* <div className="pomodoro__container-interval-item-fill"> */}
//     <div
//       className="pomodoro__container-interval-fill"
//       style={{
//         // width: `${((localCompletedIntervals + (1 - localTime / pomodoro.initialTime)) / intervalCount) * 100}%`,
//         width: `${percent}%`,
//         backgroundColor: localIsBreak ? '#FF9800' : '#2196F3'
//         // backgroundColor: '#2196F3'
//       }}
//       // {...percent}

//     />
//     <span className="progress-text">{percent.toFixed(0)}%</span>
    
//   {/* </div> */}
// </div>

//       <div className="pomodoro__container-status">
//         <p>Completed: {localCompletedIntervals}/{intervalCount} intervals</p>
//         <p>Current: {localIsBreak ? 'Break' : 'Work'} session</p>
//         <p>Work: {pomodoro.initialTime / 60} min | Break: {pomodoro.breakInterval / 60} min</p>
//         <p>Breaks: {intervalCount - 1}</p>
//       </div>
//     </div>
//   </section>
// );
// };

// export default Pomodoro;