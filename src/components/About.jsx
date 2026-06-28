import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAboutOpen } from '../features/themeSlice';

const About = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.themeReducer);

  if (!theme.isAboutOpen) return null;

  const onClose = () => dispatch(toggleAboutOpen(false));

  const tutorialData = [
    {
      id: 1,
      title: "Quick Edits",
      imagePlaceholder: "Screenshot: Task Row showing Date & Priority",
      notes: [
        "Click the Date badge to change when a task is due without opening it.",
        "Click the Priority flag to quickly adjust importance.",
        "Click the Task Name to rename it instantly."
      ]
    },
    {
      id: 2,
      title: "Full Details & Repetition",
      imagePlaceholder: "Screenshot: Edit Task Panel",
      notes: [
        "Click anywhere else on the task to open the full edit panel.",
        "Use the Repeat dropdown to automatically generate future tasks (Daily, Weekly, Monthly)."
      ]
    },
    {
      id: 3,
      title: "Board Organization",
      imagePlaceholder: "Screenshot: Dragging a task on the Board",
      notes: [
        "Grab any task and drag it to a new column.",
        "Type in the empty box at the bottom of any section to add tasks rapidly."
      ]
    }
  ];

  return ReactDOM.createPortal(
    <div className="v2-description-modal theme-modal-overlay">
      <div className="description__modal-content theme-modal-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>About TaskFlow</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="theme-settings-body" style={{ overflowY: 'auto', padding: '20px' }}>
          <h1 className='about__header' style={{ marginBottom: '10px' }}>Quick Start Guide</h1>
          <p style={{ marginBottom: '30px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            Welcome to your Task Manager! Check out the visual guide below to learn the best tips and tricks.
          </p>

          <div className="tutorial-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {tutorialData.map(step => (
              <div key={step.id} className="tutorial-step" style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: 'var(--surface-container)', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>{step.id}. {step.title}</h3>
                
                <div style={{ width: '100%', minHeight: '200px', backgroundColor: 'var(--bg-main)', border: '2px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontWeight: 'bold', padding: '20px', textAlign: 'center' }}>
                  [ {step.imagePlaceholder} ]
                </div>

                <div style={{ marginTop: '10px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>Notes</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {step.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <h2 className='about__header' style={{ marginTop: '30px', marginBottom: '10px' }}>Creator</h2>
          <p style={{ fontSize: '1.1em', fontWeight: 'bold', color: 'var(--dark-font-color-white)' }}>
            Created by me
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default About;
