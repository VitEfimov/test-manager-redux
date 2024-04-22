import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWeatherCity, updateWeatherApi } from '../features/weatherSlice'; 
import { setBreakInterval, setIntervalCount, updateTime } from '../features/pomodoroSlice';
import {updateUserName, updateUserEmail, updateUserPassword} from '../features/userSlice';


const Settings = ({setCurrentPage}) => {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weatherReducer.weather);
  const pomodoro = useSelector(state => state.pomodoroReducer.pomodoro);
  const user = useSelector(state => state.userReducer.user);

  const weatherCity = weather[0].city;
  const weatherApi = weather[0].apiKey;
  const time = pomodoro[0].time/60;
  const breakInterval = pomodoro[0].breakInterval;
  const intervalCount = pomodoro[0].intervalCount;

  const [userName, setUserName] = useState(user[0].name);
  const [password, setPassword] = useState(user[0].password);
  const [email, setEmail] = useState(user[0].email);

  const [newCity, setNewCity] = useState(weatherCity);
  const [newApiKey, setNewApiKey] = useState(weatherApi)
  const [newWorkInterval, setNewWorkInterval] = useState(time);
  const [newBreakInterval, setNewBreakInterval] = useState(breakInterval)
  const [newIntervalCount, setNewIntervalCount] = useState(intervalCount);

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleUserPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleUserEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCityChange = (e) => {
    setNewCity(e.target.value);
  };

  const handleCityApi = (e) => {
    setNewApiKey(e.target.value);
  };

  const handleSetWorkInterval = (e) => {
    setNewWorkInterval(e.target.value);
  };
  const handleSetBreakInterval = (e) => {
    setNewBreakInterval(e.target.value);
  };
  const handleSetIntervalCount = (e) => {
    setNewIntervalCount(e.target.value);
  };

  const handleSave = () => {
    dispatch(updateWeatherCity(newCity));
    dispatch(updateWeatherApi(newApiKey))
    dispatch(updateTime(newWorkInterval*60))
    dispatch(setBreakInterval(newBreakInterval))
    dispatch(setIntervalCount(newIntervalCount))
    dispatch(updateUserName(userName))
    dispatch(updateUserEmail(email))
    dispatch(updateUserPassword(password))
    setCurrentPage('Board');
  };

  return (
    <section className='section'>
      <button className='settings__save-btn' onClick={handleSave}>Save</button>

      <div className='settings__conteiner'>
      <div className='settings__block'>
          <h3>User Information</h3>
          <div className='settings__item'>
            <label className='settings__item-label'>User name:</label>
            <input type="text" value={userName} onChange={handleUserNameChange} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label' placeholder={newApiKey}>eMail:</label>
            <input type="email" value={email} onChange={handleUserEmailChange} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label' placeholder={newApiKey}>Password:</label>
            <input type="password" value={password} onChange={handleUserPasswordChange} />
          </div>
        </div>
        <div className='settings__block'>
          <h3>Weather</h3>
          <div className='settings__item'>
            <label className='settings__item-label'>Weather City:</label>
            <input type="text" value={newCity} onChange={handleCityChange} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label' placeholder={newApiKey}>Weather Api:</label>
            <input type="text" value={newApiKey} onChange={handleCityApi} />
          </div>
        </div>
        <div className='settings__block'>
          <h3>Promodoro</h3>
          <div className='settings__item'>
            <label className='settings__item-label'>Work interval (minutes):</label>
            <input type="number" value={newWorkInterval} onChange={handleSetWorkInterval} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label'>Break interval (minutes):</label>
            <input type="number" value={newBreakInterval} onChange={handleSetBreakInterval} />
          </div>
          <div className='settings__item'>
            <label className='settings__item-label'>Interval count:</label>
            <input type="number" value={newIntervalCount} onChange={handleSetIntervalCount} />
          </div>

        </div>
        <div className='settings__block' >
          <h3>Other</h3>
          <div className='settings__item' >
            <label className='settings__item-label' disabled>Color:</label>
            <input type="text" style={{backgroundColor: 'green', userSelect:'none'}} value="TODO"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Settings