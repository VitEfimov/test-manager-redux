import React from 'react';

const About = () => {
  return (
    <section className='section' style={{ overflowY: 'auto', height: '100%', padding: '20px', paddingBottom: '80px' }}>
      <h1 className='about__header' style={{ marginBottom: '20px' }}>About Task Manager</h1>
      
      <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
        Welcome to your personal Task Manager! Here is a quick guide to help you get the most out of it.
      </p>

      <ul className='about__list' style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.5', paddingLeft: '20px' }}>
        <li>
          <strong style={{fontSize: '1.1em'}}>📊 Your Dashboard</strong><br/>
          Get a quick overview of your day! See how many tasks you've finished, what's due today, and what's coming up this week.
        </li>
        <li>
          <strong style={{fontSize: '1.1em'}}>🗂️ Your Task Board</strong><br/>
          This is where you organize everything!
          <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', listStyleType: 'circle' }}>
            <li><strong>Adding Tasks:</strong> Just type in the empty box at the bottom of any section.</li>
            <li><strong>Fixing Typos:</strong> Click right on the task name to change it instantly.</li>
            <li><strong>More Details:</strong> Click a task to open it up. You can write long notes, set exact times, or make it repeat automatically.</li>
            <li><strong>Quick Changes:</strong> Tap the due date or priority badge to change them without opening the task.</li>
            <li><strong>Moving Things:</strong> Grab any task and drag it exactly where you want it.</li>
            <li><strong>Done!</strong> Click the little circle to cross a task off your list.</li>
          </ul>
        </li>
        <li>
          <strong style={{fontSize: '1.1em'}}>⏱️ Focus Timer (Pomodoro)</strong><br/>
          Need to get in the zone? Use the timer to focus on your work for a little while, followed by a short break. It's a great way to stay productive!
        </li>
        <li>
          <strong style={{fontSize: '1.1em'}}>⚙️ Settings</strong><br/>
          Make the app yours! Switch to Dark Mode, tweak how long your focus timers run, and adjust the layout so it feels just right.
        </li>
      </ul>

      <h2 className='about__header' style={{ marginTop: '30px', marginBottom: '10px' }}>Creator</h2>
      <p style={{ fontSize: '1.1em', fontWeight: 'bold', color: 'var(--dark-font-color-white)' }}>
        Created by me
      </p>
    </section>
  );
};

export default About;
