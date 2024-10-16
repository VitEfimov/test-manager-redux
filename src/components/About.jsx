import React from 'react';
import UseSound from './ui-components/UseSound';

const About = () => {
  return (
    <section className='section'>
      <h1 className='about__header'>About Task Manager App</h1>
      <UseSound/>
      <p>
        This is a task management app built with React and Redux.
      </p>
      <h2 className='about__header'>Features</h2>
      <ul className='about__list'>
        <p>Front-end application for managing tasks by date and day of the week.</p>
        <li>Used React-Redux for managing the store and retrieving data (used local storage; in the future, I will add H2 DB with Docker or MongoDB).
        </li>
        <li>Implemented dashboard features: retrieving analytics information about tasks, such as all open tasks, closed tasks, missed tasks, today's tasks, and weekly tasks.
        </li>
        <li>Implemented board features: adding tasks, editing tasks on the main panel, editing tasks with a description, editing the date of completion, editing priority, and deleting tasks.
        </li>
        <li>Implemented Pomodoro features: timer.
        </li>
        <li>Implemented weather features: retrieving current weather information, including temperature, weather condition, and weather icons. (To retrieve this information, please use a free API from openweathermap.org, which you can access after registration.)
        </li>
        <li>Implemented setting features: weather information settings, Pomodoro settings (not all functionality has been implemented yet).
        </li>
        <li>Login features: not implemented yet.
        </li>
      </ul>
      <h2 className='about__header'>Usage</h2>
      <h3 className='about__header'>Install</h3>
      <pre><code>npm install</code></pre>
      <h3 className='about__header'>Run</h3>
      <pre><code>npm start</code></pre>
      <p>
        This will run the app in development mode. Open <code>http://localhost:3000</code> to view it in the browser.
      </p>
      <p>
        The page will reload if you make edits. You will also see any lint errors in the console.
      </p>
      <h3 className='about__header'>Build</h3>
      <pre><code>npm run build</code></pre>
      <p>
        Builds the app for production to the <code>build</code> folder. It correctly bundles React in production mode and optimizes the build for the best performance.
      </p>
      <p>
        The build is minified and the filenames include the hashes. Your app is ready to be deployed!
      </p>
      <h2 className='about__header'>Structure</h2>
      <ul className='about__list'>
        <li><code>src/App.js</code> - Main App component</li>
        <li><code>src/index.js</code> - Entry point that renders App component</li>
        <li><code>src/components/</code> - React components for each feature</li>
        <li><code>src/slices/</code> - Redux slices for state management</li>
        <li><code>src/store.js</code> - Redux store configuration</li>
      </ul>
      <h2 className='about__header'>Technologies</h2>
      <ul className='about__list'>
        <li>React</li>
        <li>Redux + Redux Toolkit for state management</li>
        <li>React Router for routing</li>
        <li>React DnD for drag and drop reordering</li>
        <li>Local storage for persistence</li>
      </ul>
      <h2 className='about__header'>To Do</h2>
      <ul className='about__list'>
        <li>Add user accounts</li>
        <li>Sync state across devices/users</li>
      </ul>
      <h2 className='about__header'>License</h2>
      <p>
        This project is open source and available under the <a href="/path/to/license">MIT License</a>.
      </p>
    </section>

  );
};

export default About;
