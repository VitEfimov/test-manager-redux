import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { togglePomodoroSettings, setTime, setBreakInterval, setIntervalCount, setWorkSound, setBreakSound } from '../features/pomodoroSlice';

const PomodoroSettingsModal = () => {
  const dispatch = useDispatch();
  const { isSettingsOpen, pomodoro } = useSelector(state => state.pomodoroReducer);

  const modalRef = useRef(null);
  
  // Swipe down to close functionality
  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(null);


  const workMinutes = Math.floor(pomodoro[0].initialTime / 60);
  const workSeconds = pomodoro[0].initialTime % 60;
  const breakMinutes = Math.floor(pomodoro[0].breakInterval / 60);
  const breakSeconds = pomodoro[0].breakInterval % 60;
  const intervalCount = typeof pomodoro[0].intervalCount === 'object' ? pomodoro[0].intervalCount.count : 5;
  const workSound = pomodoro[0].workSound || 'default';
  const breakSound = pomodoro[0].breakSound || 'default';

  const [newWorkMin, setNewWorkMin] = useState(workMinutes);
  const [newWorkSec, setNewWorkSec] = useState(workSeconds);
  const [newBreakMin, setNewBreakMin] = useState(breakMinutes);
  const [newBreakSec, setNewBreakSec] = useState(breakSeconds);
  const [newIntervalCount, setNewIntervalCount] = useState(intervalCount);
  const [newWorkSound, setNewWorkSound] = useState(workSound);
  const [newBreakSound, setNewBreakSound] = useState(breakSound);
  
  const predefinedSounds = ['default', 'none', 'chime.wav', 'light ping.wav', 'notification.wav', 'end_sound.ogg', 'start_sound.mp3'];
  const [workSoundType, setWorkSoundType] = useState(predefinedSounds.includes(workSound) ? workSound : 'custom');
  const [breakSoundType, setBreakSoundType] = useState(predefinedSounds.includes(breakSound) ? breakSound : 'custom');

  const handleSetWorkMin = (e) => setNewWorkMin(parseInt(e.target.value) || 0);
  const handleSetWorkSec = (e) => setNewWorkSec(parseInt(e.target.value) || 0);
  const handleSetBreakMin = (e) => setNewBreakMin(parseInt(e.target.value) || 0);
  const handleSetBreakSec = (e) => setNewBreakSec(parseInt(e.target.value) || 0);
  const handleSetIntervalCount = (e) => {
    if (parseInt(e.target.value)>10) {
      alert("10 intervals maximum")
    } else {
      setNewIntervalCount(parseInt(e.target.value));
    }
  };

  const handleSave = () => {
    const totalWorkSeconds = newWorkMin * 60 + newWorkSec;
    const totalBreakSeconds = newBreakMin * 60 + newBreakSec;
    dispatch(setTime(totalWorkSeconds));
    dispatch(setBreakInterval(totalBreakSeconds));
    dispatch(setIntervalCount(newIntervalCount));
    dispatch(setWorkSound(newWorkSound));
    dispatch(setBreakSound(newBreakSound));
    dispatch(togglePomodoroSettings(false));
  };

  const onClose = () => dispatch(togglePomodoroSettings(false));

  const handleTouchStart = (e) => {
    if (modalRef.current && modalRef.current.scrollTop <= 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === null) return;
    const y = e.touches[0].clientY;
    const deltaY = y - startY;
    
    if (deltaY > 0) {
      setCurrentY(deltaY);
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(${deltaY}px)`;
        modalRef.current.style.transition = 'none';
      }
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      onClose();
    } else {
      if (modalRef.current) {
        modalRef.current.style.transform = '';
        modalRef.current.style.transition = 'transform 0.3s ease-out';
      }
    }
    setStartY(null);
    setCurrentY(null);
  };

  if (!isSettingsOpen) return null;

  return ReactDOM.createPortal(
    <div className="v2-description-modal theme-modal-overlay">
      <div ref={modalRef} className="description__modal-content theme-modal-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="modal-drag-indicator"
        ></div>
        <div className="modal-header">
          <h2>Pomodoro Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="theme-settings-body">
          <div className="theme-color-row">
            <label>Work interval</label>
            <div className="color-control flex-inputs sleek-inputs" style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <input type="number" min="0" max="120" value={newWorkMin} onChange={handleSetWorkMin} className="num-input" style={{width: '50px'}}/> <span>min</span>
              <input type="number" min="0" max="59" value={newWorkSec} onChange={handleSetWorkSec} className="num-input" style={{width: '50px'}}/> <span>sec</span>
            </div>
          </div>
          
          <div className="theme-color-row">
            <label>Break interval</label>
            <div className="color-control flex-inputs sleek-inputs" style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <input type="number" min="0" max="120" value={newBreakMin} onChange={handleSetBreakMin} className="num-input" style={{width: '50px'}}/> <span>min</span>
              <input type="number" min="0" max="59" value={newBreakSec} onChange={handleSetBreakSec} className="num-input" style={{width: '50px'}}/> <span>sec</span>
            </div>
          </div>
          
          <div className="theme-color-row">
            <label>Interval count</label>
            <div className="color-control">
               <input type="number" min="1" max="10" value={newIntervalCount} onChange={handleSetIntervalCount} className="num-input-large" style={{width: '60px'}}/>
            </div>
          </div>

          <div className="theme-color-row">
            <label>Work over sound</label>
            <div className="color-control">
              <select className="select-sleek" value={workSoundType} onChange={(e) => { setWorkSoundType(e.target.value); if (e.target.value !== 'custom') setNewWorkSound(e.target.value); }}>
                <option value="default">Default</option>
                <option value="none">None</option>
                <option value="chime.wav">Chime</option>
                <option value="light ping.wav">Light</option>
                <option value="notification.wav">Notif</option>
              </select>
            </div>
          </div>
          
          <div className="theme-color-row">
            <label>Break over sound</label>
            <div className="color-control">
               <select className="select-sleek" value={breakSoundType} onChange={(e) => { setBreakSoundType(e.target.value); if (e.target.value !== 'custom') setNewBreakSound(e.target.value); }}>
                <option value="default">Default</option>
                <option value="none">None</option>
                <option value="chime.wav">Chime</option>
                <option value="light ping.wav">Light</option>
                <option value="notification.wav">Notif</option>
              </select>
            </div>
          </div>

          <button className='btn-save-settings-header settings-save-btn' onClick={handleSave} style={{width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PomodoroSettingsModal;
