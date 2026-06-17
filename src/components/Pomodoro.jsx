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
import { IoMdSettings } from "react-icons/io";
import useSound from 'use-sound';
import endSound from '../assets/audio/end_sound.ogg';
import startSound from '../assets/audio/start_sound.mp3';
import chimeSound from '../assets/audio/chime.wav';
import lightPingSound from '../assets/audio/light ping.wav';
import notificationSound from '../assets/audio/notification.wav';
import {
  startTimer,
  pauseTimer,
  resetTimer,
  updateTime,
  completeWorkInterval,
  completeBreakInterval,
  setTime,
  setBreakInterval,
  setIntervalCount,
  setWorkSound,
  setBreakSound
} from '../features/pomodoroSlice';
import '../styles/Pomodoro.css';

const SOUND_MAP = {
  'chime.wav': chimeSound,
  'light ping.wav': lightPingSound,
  'notification.wav': notificationSound,
  'end_sound.ogg': endSound,
  'start_sound.mp3': startSound
};

const Pomodoro = () => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro[0]);

  const [localTime, setLocalTime] = useState(pomodoro.time);
  const [localIsActive, setLocalIsActive] = useState(false);
  const [localIsBreak, setLocalIsBreak] = useState(pomodoro.isBreak);
  const [localCompletedIntervals, setLocalCompletedIntervals] = useState(
    typeof pomodoro.intervalCount === 'object' ? pomodoro.intervalCount.passed : 0
  );
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [workMin, setWorkMin] = useState(Math.floor(pomodoro.initialTime / 60));
  const [workSec, setWorkSec] = useState(pomodoro.initialTime % 60);
  const [breakMin, setBreakMin] = useState(Math.floor(pomodoro.breakInterval / 60));
  const [breakSec, setBreakSec] = useState(pomodoro.breakInterval % 60);
  const [intervalCountState, setIntervalCountState] = useState(typeof pomodoro.intervalCount === 'object' ? pomodoro.intervalCount.count : 5);
  const [workSoundType, setWorkSoundType] = useState(pomodoro.workSound || 'default');
  const [breakSoundType, setBreakSoundType] = useState(pomodoro.breakSound || 'default');

  const handleSaveSettings = () => {
    dispatch(setTime(workMin * 60 + workSec));
    dispatch(setBreakInterval(breakMin * 60 + breakSec));
    dispatch(setIntervalCount(intervalCountState));
    dispatch(setWorkSound(workSoundType));
    dispatch(setBreakSound(breakSoundType));
    
    staticIntervalCountRef.current = intervalCountState;
    
    if (!localIsActive) {
      if (!localIsBreak) {
        setLocalTime(workMin * 60 + workSec);
      } else {
        setLocalTime(breakMin * 60 + breakSec);
      }
    }
    setShowSettingsModal(false);
  };

  const intervalRef = useRef(null);
  const staticIntervalCountRef = useRef(null);

  useEffect(() => {
    if (staticIntervalCountRef.current === null) {
      staticIntervalCountRef.current = typeof pomodoro.intervalCount === 'object'
        ? pomodoro.intervalCount.count
        : 5;
    }
  }, []);

  const workSoundSrc = pomodoro.workSound && pomodoro.workSound !== 'default' && pomodoro.workSound !== 'none' 
    ? (SOUND_MAP[pomodoro.workSound] || pomodoro.workSound)
    : endSound;

  const breakSoundSrc = pomodoro.breakSound && pomodoro.breakSound !== 'default' && pomodoro.breakSound !== 'none'
    ? (SOUND_MAP[pomodoro.breakSound] || pomodoro.breakSound)
    : startSound;

  const [playEnd] = useSound(workSoundSrc);
  const [playStart] = useSound(breakSoundSrc);

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
      
  const handlePeriodEnd = () => {
    if (localIsBreak) {
      dispatch(completeBreakInterval());
      if (pomodoro.breakSound !== 'none') {
        try { playStart(); } catch(e) { console.warn('Audio play failed:', e); }
      }
      if (localCompletedIntervals >= staticIntervalCountRef.current) {
        alert("All intervals completed!");
        dispatch(resetTimer());
      }
    } else {
      dispatch(completeWorkInterval());
      if (pomodoro.workSound !== 'none') {
        try { playEnd(); } catch(e) { console.warn('Audio play failed:', e); }
      }
    }
  };

  const showNotification = () => {
    try {
      if ('Notification' in window && window.Notification && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: localIsBreak ? 'Break over! Time to work!' : 'Work done! Take a break!',
          icon: '/task_manager_icon.png'
        });
      }
    } catch (e) {
      console.error('Notification error:', e);
    }
  };

  useEffect(() => {
    try {
      if ('Notification' in window && window.Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    } catch (e) {
      console.error('Notification permission error:', e);
    }
  }, []);

  const intervalCount = staticIntervalCountRef.current || 5;
  const currentFill = Math.max(0, Math.min(100, 100 - (localTime / pomodoro.initialTime) * 100));

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return {
      min: String(minutes).padStart(2, '0'),
      sec: String(seconds).padStart(2, '0')
    };
  };

  return (
    <section className="section pomodoro-section">
      <div className='pomodoro__container'>
        <div className="pomodoro__header">
          <div className="pomodoro__header-text">
            <h1>Pomodoro</h1>
            <p>Stay focused, take breaks</p>
          </div>
          <button className="btn-customize-theme" onClick={() => setShowSettingsModal(true)}>
            <IoMdSettings /> Settings
          </button>
        </div>
        
        <div className="pomodoro__body pomodoro-single-page">
          <div className="pomodoro-col-left">
            <div className="pomodoro-timer-card">
              <div className="pomodoro__toggle">
                <div className={`toggle-btn ${!localIsBreak ? 'active' : ''}`}>Work Time</div>
                <div className={`toggle-btn ${localIsBreak ? 'active' : ''}`}>Break Time</div>
              </div>

              <div className="pomodoro__circle-timer">
                <svg viewBox="0 0 100 100" className="pomodoro-svg">
                  <circle cx="50" cy="50" r="45" className="circle-track" />
                  <circle 
                    cx="50" cy="50" r="45" 
                    className="circle-progress" 
                    style={{ strokeDashoffset: 283 - (283 * currentFill) / 100 }} 
                  />
                </svg>
                <div className="pomodoro__circle-text">
                  <div className="time">{formatTime(localTime).min}:{formatTime(localTime).sec}</div>
                  <div className="session-label">{localIsBreak ? 'Break session' : 'Work session'}</div>
                </div>
              </div>

              <div className="pomodoro__controls-mobile">
                <button className="btn-play-pause" onClick={localIsActive ? handlePauseTimer : handleStartTimer} aria-label={localIsActive ? "Pause Timer" : "Start Timer"}>
                  {localIsActive ? <FaPause /> : <FaPlay className="pomodoro-play-icon" />}
                </button>
                <button className="btn-reset" onClick={handleResetTimer} aria-label="Reset Timer">
                  <GrPowerReset />
                </button>
              </div>

              <div className="pomodoro__dots-container">
                <div className="pomodoro__dots">
                  {[...Array(intervalCount)].map((_, index) => {
                    const isCompleted = index < localCompletedIntervals;
                    const isCurrent = index === localCompletedIntervals && !localIsBreak;
                    const isActiveClass = isCompleted || isCurrent ? 'active' : '';
                    return <span key={index} className={`dot ${isActiveClass}`}></span>;
                  })}
                </div>
                <div className="pomodoro__intervals-text">
                  {Math.min(localCompletedIntervals + 1, intervalCount)} / {intervalCount} intervals completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSettingsModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal-content pomodoro-modal-content">
            <h3 className="settings-modal-title">Pomodoro Settings</h3>
            
            <div className="pomodoro__session-settings">
              <h4>Session settings</h4>
              <div className="setting-row">
                <span>Work interval</span>
                <div className="setting-control flex-inputs sleek-inputs">
                  <input type="number" min="0" max="120" value={workMin} onChange={(e) => setWorkMin(parseInt(e.target.value) || 0)} className="num-input"/> <span>min</span>
                  <input type="number" min="0" max="59" value={workSec} onChange={(e) => setWorkSec(parseInt(e.target.value) || 0)} className="num-input"/> <span>sec</span>
                </div>
              </div>
              <div className="setting-row">
                <span>Break interval</span>
                <div className="setting-control flex-inputs sleek-inputs">
                  <input type="number" min="0" max="120" value={breakMin} onChange={(e) => setBreakMin(parseInt(e.target.value) || 0)} className="num-input"/> <span>min</span>
                  <input type="number" min="0" max="59" value={breakSec} onChange={(e) => setBreakSec(parseInt(e.target.value) || 0)} className="num-input"/> <span>sec</span>
                </div>
              </div>
              <div className="setting-row setting-row-no-border">
                <span>Interval count</span>
                <div className="setting-control">
                  <input type="number" min="1" max="10" value={intervalCountState} onChange={(e) => setIntervalCountState(parseInt(e.target.value) || 1)} className="num-input-large"/>
                </div>
              </div>
            </div>

            <div className="pomodoro__session-settings">
              <h4>Sounds</h4>
              <div className="setting-row">
                <span className="sound-label">🎵 Work over sound</span>
                <select className="select-sleek" value={workSoundType} onChange={(e) => setWorkSoundType(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="none">None</option>
                  <option value="chime.wav">Chime</option>
                  <option value="light ping.wav">Light</option>
                  <option value="notification.wav">Notif</option>
                </select>
              </div>
              <div className="setting-row setting-row-no-border">
                <span className="sound-label">🎵 Break over sound</span>
                <select className="select-sleek" value={breakSoundType} onChange={(e) => setBreakSoundType(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="none">None</option>
                  <option value="chime.wav">Chime</option>
                  <option value="light ping.wav">Light</option>
                  <option value="notification.wav">Notif</option>
                </select>
              </div>
            </div>
            
            <div className="settings-modal-actions">
              <button className='btn-delete' onClick={() => setShowSettingsModal(false)}>Cancel</button>
              <button className='btn-save' onClick={handleSaveSettings}>Save</button>
            </div>
          </div>
        </div>
      )}
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