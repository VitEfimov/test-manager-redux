import React from 'react';

const About = () => {
  return (
    <section className='section' style={{paddingLeft:'35px'}}>
      <h1 className='about__header'>About Task Manager App</h1>
      <p>
        This is a task management app built with React and Redux.
      </p>
      <h2 className='about__header'>Features</h2>
      <ul className='about__list'>
        <li>Create multiple boards to organize tasks</li>
        <li>Add, edit, and delete tasks on a board</li>
        <li>Mark tasks as completed</li>
        <li>Reorder tasks within a board</li>
        <li>Persist data in local storage</li>
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
