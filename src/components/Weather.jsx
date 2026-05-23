import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FaSun, FaCloud, FaSmog, FaSnowflake, FaCloudRain } from "react-icons/fa";
import { IoThunderstorm } from "react-icons/io5";
//57d454440cf91b5aeae1124affbb74e7

const Weather = () => {

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weather = useSelector(state => state.weatherReducer.weather);
  const weatherCity = weather[0]?.city;
  const weatherApi = weather[0]?.apiKey;

  const weatherIcons = {
    Clear: <FaSun />,
    Clouds: <FaCloud />,
    Atmosphere: <FaSmog />,
    Snow: <FaSnowflake />,
    Rain: <FaCloudRain />,
    Thunderstorm: <IoThunderstorm />
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!weatherCity || !weatherApi) {
        setError('Add settings to display weather');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${weatherApi}&units=imperial`);
        const data = await response.json();
        
        if (!response.ok || data.cod !== 200) {
          setError(data.message || 'Failed to fetch weather data.');
        } else {
          setWeatherData(data);
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Network error. Failed to fetch weather.');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    const intervalId = setInterval(fetchWeather, 3600000);
    return () => clearInterval(intervalId);
  }, [weatherCity, weatherApi]);

  return (
    <div className='weather__container'>
      {loading ? (
        <div className="header__weather-info" style={{ color: 'var(--dark-font-color-grey)' }}>
          <span>⏳ Loading weather...</span>
        </div>
      ) : error ? (
        <div className="header__weather-info" style={{ color: 'var(--red_color)', fontWeight: '500' }}>
          <span>⚠️ {error}</span>
        </div>
      ) : weatherData && weatherData.name ? (
        <div className="header__weather-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div>
            City: {weatherData.name} | Temperature: {Math.round(weatherData.main?.temp)}&deg;F | Weather: {weatherData.weather?.[0]?.main}
            <span style={{ marginLeft: '6px', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              {weatherIcons[weatherData.weather?.[0]?.main] || <FaCloud />}
            </span>
          </div>
        </div>
      ) : (
        <div className="header__weather-info">
          <p>Add settings to display weather</p>
        </div>
      )}
    </div>
  );
}

export default Weather;