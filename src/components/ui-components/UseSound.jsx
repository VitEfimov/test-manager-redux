import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
// import end_sound from '../assets/audio/end_sound.ogg'
// import end_sound from './assets/audio/end_sound.ogg';

const UseSound = () => {
    const [time, setTime] = useState(3);
    const [play] = useSound('./start_sound.mp3', {
        onload: () => console.log("Sound loaded successfully"),
        onerror: (err) => console.error("Sound failed to load", err)
    });

    useEffect(() => {
        if (time > 0) {
          const timerId = setInterval(() => {
            setTime(time - 1);
          }, 1000);
    
          return () => clearInterval(timerId);
        } else {
          console.log("Playing sound");
          play(); // Play sound when timer reaches 0
        }
    }, [time, play]);

    return (
      <div>
        <h1>Time Left: {time} seconds</h1>
      </div>
    )
}

export default UseSound;