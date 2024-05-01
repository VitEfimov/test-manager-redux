import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FaSun, FaCloud, FaSmog, FaSnowflake, FaCloudRain } from "react-icons/fa";
import { IoThunderstorm } from "react-icons/io5";
//57d454440cf91b5aeae1124affbb74e7

const Weather = () => {

  const [weatherData, setWeatherData] = useState(null);
  const weather = useSelector(state => state.weatherReducer.weather);
  const weatherCity = weather[0].city;
  const weatherApi = weather[0].apiKey;

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
      if (weatherCity && weatherApi) {
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${weatherApi}&units=imperial`);
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };
    fetchWeather();
    const intervalId = setInterval(fetchWeather, 3600000);
    return () => clearInterval(intervalId);
  }, [weatherCity,weatherApi]);

  return (
    <div className='weather__container'>
      {weatherData ? (
        <div className="header__weather-info">
          {weatherData.name && <div>City: {weatherData.name}</div>}
          {weatherData.main && <div>Temperature: {weatherData.main.temp}&deg;F</div>}
          {weatherData.weather && weatherData.weather.length > 0 && (
            <div>
              Weather: {weatherData.weather[0].main}<span>     </span>
              {weatherIcons[weatherData.weather[0].main]}
            </div>
          )}
        </div>
      ):'Add weather settings to see weather info'}
    </div>
  )
}

export default Weather