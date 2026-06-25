import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask } from '../features/taskSlice';
import { useClickOutside } from '../custom-hooks/ClickOut';
import dayjs from 'dayjs';
import ReactDOM from 'react-dom';

import TiptapEditor from './TiptapEditor';
import { useTaskRepeat } from '../custom-hooks/useTaskRepeat';

const Description = ({ task, setModal, setTaskName, setTaskPriority }) => {
  const dispatch = useDispatch();
  const { generateRepeatingTasks } = useTaskRepeat();
  const theme = useSelector(state => state.themeReducer);
  // eslint-disable-next-line no-unused-vars
  const timeFormat = theme.timeFormat || '12h';
  const [formData, setFormData] = useState({
    name: task.taskname,
    priority: task.priority,
    completed: task.completed,
    completionDate: task.completionDate,
    time: task.time || "",
    descriptionText: task.description?.text || '',
    descriptionImg: task.description?.img || '',
    descriptionUrl: task.description?.url || '',
    repeat: 'None',
    repeatEndDate: ''
  });

  useEffect(() => {
    setFormData({
      name: task.taskname,
      priority: task.priority,
      completed: task.completed,
      completionDate: task.completionDate,
      time: task.time || "",
      descriptionText: task.description?.text || '',
      descriptionImg: task.description?.img || '',
      descriptionUrl: task.description?.url || '',
      repeat: 'None'
    });
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (htmlContent) => {
    setFormData({ ...formData, descriptionText: htmlContent });
  };

  const textAreaRef = useRef(null);

  const adjustTextareaHeight = (element) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight(textAreaRef.current);
  }, [formData.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = {
      taskId: task.id,
      name: formData.name,
      priority: formData.priority,
      completed: formData.completed,
      completionDate: formData.completionDate,
      time: formData.time,
      description: {
        text: formData.descriptionText,
        img: formData.descriptionImg,
        url: formData.descriptionUrl,
      },
    };
    dispatch(updateTask(updatedTask));

    setTaskName(formData.name);
    setTaskPriority(formData.priority);
    setModal(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the task "${formData.name}"?`)) {
      dispatch(deleteTask({ taskId: task.id }));
      setModal(false);
    }
  };

  const handleClose = () => {
    setModal(false);
  };

  const descriptionRef = useRef(null);
  useClickOutside(descriptionRef, handleClose);

  // Swipe down to close functionality
  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(null);

  const handleTouchStart = (e) => {
    if (descriptionRef.current && descriptionRef.current.scrollTop <= 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === null) return;
    const y = e.touches[0].clientY;
    const deltaY = y - startY;
    
    // Only allow dragging downwards
    if (deltaY > 0) {
      setCurrentY(deltaY);
      if (descriptionRef.current) {
        descriptionRef.current.style.transform = `translateY(${deltaY}px)`;
        descriptionRef.current.style.transition = 'none';
      }
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      // Swiped down far enough, close the modal
      handleClose();
    } else {
      // Snap back
      if (descriptionRef.current) {
        descriptionRef.current.style.transform = '';
        descriptionRef.current.style.transition = 'transform 0.3s ease-out';
      }
    }
    setStartY(null);
    setCurrentY(null);
  };

  return ReactDOM.createPortal(
    <div className="description__modal v2-description-modal">
      <div 
        ref={descriptionRef} 
        className="description__modal-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="modal-drag-indicator"
        ></div>
        
        <div 
          className="modal-header"
        >
          <h2>Edit Task</h2>
          <button type="button" className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>TASK TITLE</label>
            <textarea
              ref={textAreaRef}
              className="input-field task-name-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onInput={(e) => adjustTextareaHeight(e.target)}
              rows={1}
              style={{ overflow: 'hidden', resize: 'none' }}
              placeholder="Enter task name"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>PRIORITY</label>
              <div className="input-with-icon">
                <span className="icon">🚩</span>
                <select
                  className="input-field"
                  name="priority"
                  value={formData.priority || 'None'}
                  onChange={handleChange}
                >
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="form-group half">
              <label>REPEAT</label>
              <div className="input-with-icon">
                <span className="icon">🔁</span>
                <select
                  className="input-field"
                  name="repeat"
                  value={formData.repeat}
                  onChange={handleChange}
                >
                  <option value="None">None</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {formData.repeat && formData.repeat !== 'None' && (
            <div style={{ padding: '12px', background: 'var(--bg-sidebar)', borderRadius: '8px', margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '0.5px' }}>REPEAT CONFIGURATION</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', width: '70px' }}>Start Date:</span>
                    <input 
                        type="date" 
                        className="input-field" 
                        style={{flex: 1, backgroundColor: 'var(--surface-container)', border: '1px solid var(--border-color)'}} 
                        value={formData.repeatStartDate || (formData.completionDate ? dayjs(formData.completionDate).format('YYYY-MM-DD') : '')} 
                        onChange={(e) => setFormData(prev => ({...prev, repeatStartDate: e.target.value}))}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', width: '70px' }}>End Date:</span>
                    <input 
                        type="date" 
                        className="input-field" 
                        style={{flex: 1, backgroundColor: 'var(--surface-container)'}} 
                        value={formData.repeatEndDate || ''}
                        onChange={(e) => setFormData(prev => ({...prev, repeatEndDate: e.target.value}))}
                    />
                </div>
                <button 
                    type="button"
                    className="btn-save" 
                    style={{marginTop: '5px', width: '100%', justifyContent: 'center'}}
                    onClick={() => {
                        const success = generateRepeatingTasks(task, formData, {
                            frequency: formData.repeat,
                            startDate: formData.repeatStartDate || formData.completionDate || new Date().toISOString(),
                            endDate: formData.repeatEndDate
                        });
                        if (success) {
                            setFormData(prev => ({...prev, repeat: 'None', repeatEndDate: '', repeatStartDate: ''}));
                        }
                    }}
                >
                    Generate Tasks
                </button>
            </div>
          )}

          <div className="form-row">
            <div className="form-group half">
              <label>DUE DATE</label>
              <div className="input-with-icon">
                <span className="icon">📅</span>
                <input
                  className="input-field"
                  type="date"
                  name="completionDate"
                  value={formData.completionDate ? dayjs(formData.completionDate).format('YYYY-MM-DD') : ''}
                  onChange={(e) => {
                    const newDate = e.target.value ? dayjs(e.target.value).toISOString() : '';
                    setFormData({ ...formData, completionDate: newDate });
                  }}
                />
              </div>
            </div>
            <div className="form-group half">
              <label>TIME</label>
              <div className="input-with-icon">
                <span className="icon">🕒</span>
                <input 
                  className="input-field"
                  type="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>DESCRIPTION</label>
            <TiptapEditor 
              content={formData.descriptionText} 
              onChange={handleEditorChange} 
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-delete"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default Description;


// import React, { useState, useEffect, useRef} from 'react';
// import { useDispatch } from 'react-redux';
// import { updateTask } from '../features/taskSlice';
// import { useClickOutside } from '../custom-hooks/ClickOut';
// import dayjs from 'dayjs';

// const Description = ({ task, setModal, setTaskName, setTaskPriority}) => {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     name: task.taskname,
//     priority: task.priority,
//     completed: task.completed,
//     completionDate: task.completionDate,
//     descriptionText: task.description?.text || '',
//     descriptionImg: task.description?.img || '',
//     descriptionUrl: task.description?.url || '',
//   });

//   useEffect(() => {
//     setFormData({
//       name: task.taskname,
//       priority: task.priority,
//       completed: task.completed,
//       completionDate: task.completionDate,
//       descriptionText: task.description?.text || '',
//       descriptionImg: task.description?.img || '',
//       descriptionUrl: task.description?.url || '',
//     });
//   }, [task]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedTask = {
//       taskId: task.id,
//       name: formData.name,
//       priority: formData.priority,
//       completed: formData.completed,
//       completionDate: formData.completionDate,
//       description: {
//         text: formData.descriptionText,
//         img: formData.descriptionImg,
//         url: formData.descriptionUrl,
//       },
//     };
//     dispatch(updateTask(updatedTask));
//     setTaskName(formData.name);
//     setTaskPriority(formData.priority);
//     setModal(false);
//   };

//     const descriptionRef = useRef(null)
  
//     useClickOutside(descriptionRef, () => setModal(false))

//   return (
//     <div ref={descriptionRef} className="description__modal">
//       <div className="description__modal-content">
//         <span className="description__close" onClick={() => setModal(false)}>&times;</span>
//         <form onSubmit={handleSubmit}>
//           <label>Task:</label>
//           <input className='description__input task-name' type="text" name="name" value={formData.name} onChange={handleChange} />
//           <label>Priority:</label>
//           <select 
//           className='description__input' 
//           name="priority" 
//           value={formData.priority} 
//           onChange={handleChange}>
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
          
//           <label>Completion Date:</label>
//           <input className='description__input' type="text" name="completionDate" value={dayjs(formData.completionDate).format('MMMM D, YYYY')} onChange={handleChange} disabled/>
          
//           <label>Description:</label>
//           <textarea className='description__input' name="descriptionText" value={formData.descriptionText} onChange={handleChange}></textarea>
          

//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Description;




// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { updateTask } from '../features/taskSlice';

// const Description = ({ task, setModal }) => {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     name: task.taskname,
//     priority: task.priority,
//     completed: task.completed,
//     completionDate: task.completionDate,
//     descriptionText: task.description?.text || '',
//     descriptionImg: task.description?.img || '',
//     descriptionUrl: task.description?.url || '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(updateTask({ taskId: task.id, ...formData }));
//     setModal(false);
//   };

//   return (
//     <div className="modal">
      
//       <div className="modal-content">
//         {/* <button onClick={()=>setModal(false)}>close</button> */}
//         <span className="close" onClick={() => setModal(false)}>&times;</span>
//         <form onSubmit={handleSubmit}>
//           <label>Task:</label>
//           <textarea type="text" name="name" value={formData.name} onChange={handleChange} />
//           <label>Priority:</label>
//           {/* <input type="text" name="priority" value={formData.priority} onChange={handleChange} /> */}

//           <select name="priority" value={formData.priority} onChange={handleChange}>
//           <option>Low</option>
//           <option>Medium</option>
//           <option>High</option>
//           </select>
//           <label>Completion Date:</label>
//           <input type="text" name="completionDate" value={formData.completionDate} onChange={handleChange} />
//           <label>Description:</label>
//           <textarea name="descriptionText" value={formData.descriptionText} onChange={handleChange}></textarea>
//           <label>Description URL:</label>
//           <input type="text" name="descriptionUrl" value={formData.descriptionUrl} onChange={handleChange} />
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Description;



// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { updateTask, deleteTask } from '../features/taskSlice';


// const Description = ({task,setModal}) => {

//   const dispatch = useDispatch();
//   // const tasks = useSelector(state => state.taskSlice.tasks);

//     const handleUpdateTask = (updatedFields) => {
//         // Update task fields using the provided logic
//         updateTask({
//           taskId: task.id,
//           name: updatedFields.name || task.taskname,
//           priority: updatedFields.priority || task.priority,
//           completed: updatedFields.completed || task.completed,
//           completionDate: updatedFields.completionDate || task.completionDate,
//           description: updatedFields.description
//             ? {
//                 text: updatedFields.description.text || '',
//                 img: updatedFields.description.img || '',
//                 url: updatedFields.description.url || '',
//               }
//             : task.description,
//         });
//         setModal(false); // Close the modal after updating
//       };


//       // const handleTaskPriorityChange = (selectedOption) => {
//       //   setTaskPriority(selectedOption.value);
//       //   dispatch(
//       //     updateTask({
//       //       taskId: task.id,
//       //       priority: selectedOption.value,
//       //     })
//       //   );
//       //   setTaskPrioritySelect(false);
//       // };
    
//   return (
//     <div>Description</div>
//   )
// }

// export default Description