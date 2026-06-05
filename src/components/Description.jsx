import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask } from '../features/taskSlice';
import { useClickOutside } from '../custom-hooks/ClickOut';
import dayjs from 'dayjs';
import ReactDOM from 'react-dom';
import { addMultipleTasks } from '../features/taskSlice';


const Description = ({ task, setModal, setTaskName, setTaskPriority }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.themeReducer);
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
    repeat: 'None'
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

    if (formData.repeat && formData.repeat !== 'None') {
        const tasksToGenerate = [];
        const endDate = dayjs(formData.completionDate || dayjs()).add(6, 'month');
        let currentIterDate = dayjs(formData.completionDate || dayjs());
        
        while (true) {
            currentIterDate = formData.repeat === 'Daily' ? currentIterDate.add(1, 'day') : currentIterDate.add(1, 'week');
            if (currentIterDate.isAfter(endDate)) break;
            
            const newTaskId = new Date().getTime().toString() + Math.random().toString(36).substr(2, 9);
            tasksToGenerate.push({
                id: newTaskId,
                boardId: task.boardId || 'main',
                taskname: formData.name,
                priority: formData.priority,
                completed: false,
                completionDate: currentIterDate.toISOString(),
                time: formData.time,
                description: {
                    text: formData.descriptionText,
                    img: formData.descriptionImg,
                    url: formData.descriptionUrl,
                },
                lastUpdatedDate: new Date().toISOString()
            });
        }

        if (tasksToGenerate.length > 0) {
            dispatch(addMultipleTasks({ tasks: tasksToGenerate }));
            alert(`Generated ${tasksToGenerate.length} recurring tasks!`);
        }
    }

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

  const handleAutoSave = () => {
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

    if (formData.repeat && formData.repeat !== 'None') {
        const tasksToGenerate = [];
        const endDate = dayjs(formData.completionDate || dayjs()).add(6, 'month');
        let currentIterDate = dayjs(formData.completionDate || dayjs());
        
        while (true) {
            currentIterDate = formData.repeat === 'Daily' ? currentIterDate.add(1, 'day') : currentIterDate.add(1, 'week');
            if (currentIterDate.isAfter(endDate)) break;
            
            const newTaskId = new Date().getTime().toString() + Math.random().toString(36).substr(2, 9);
            tasksToGenerate.push({
                id: newTaskId,
                boardId: task.boardId || 'main',
                taskname: formData.name,
                priority: formData.priority,
                completed: false,
                completionDate: currentIterDate.toISOString(),
                time: formData.time,
                description: {
                    text: formData.descriptionText,
                    img: formData.descriptionImg,
                    url: formData.descriptionUrl,
                },
                lastUpdatedDate: new Date().toISOString()
            });
        }

        if (tasksToGenerate.length > 0) {
            dispatch(addMultipleTasks({ tasks: tasksToGenerate }));
            alert(`Generated ${tasksToGenerate.length} recurring tasks!`);
        }
    }

    setTaskName(formData.name);
    setTaskPriority(formData.priority);
    setModal(false);
  };

  const descriptionRef = useRef(null);
  useClickOutside(descriptionRef, handleAutoSave);

  return ReactDOM.createPortal(
    <div className="description__modal">
      <div ref={descriptionRef} className="description__modal-content">
        <span className="description__close" onClick={handleAutoSave}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <label>Task:</label>
          <textarea
            ref={textAreaRef}
            className="description__input-task-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onInput={(e) => adjustTextareaHeight(e.target)}
            rows={1}
            style={{ overflow: 'hidden', resize: 'none' }}
          />
          <label>Priority:</label>
          <select
            className="description__input"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="null">Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label>Completion Date:</label>
          <input
            className="description__input"
            type="date"
            name="completionDate"
            value={formData.completionDate ? dayjs(formData.completionDate).format('YYYY-MM-DD') : ''}
            onChange={(e) => {
              const newDate = e.target.value ? new Date(e.target.value).toISOString() : '';
              setFormData({ ...formData, completionDate: newDate });
            }}
          />

          <label>Time:</label>
          <input className='description__input'
            type="time" name="time" 
            value={formData.time} 
            onChange={handleChange} />

          <label>Repeat (Max 6 Months):</label>
          <select
            className="description__input"
            name="repeat"
            value={formData.repeat}
            onChange={handleChange}
          >
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>

          <label>Description:</label>
          <textarea
            className="description__input-description-field"
            name="descriptionText"
            value={formData.descriptionText}
            onChange={handleChange}
          ></textarea>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {/* <button type="submit" style={{ flex: 1 }}>Submit</button> */}
            <button
              type="button"
              onClick={handleDelete}
              style={{
                flex: 1,
                backgroundColor: 'rgb(241, 81, 81)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out'
              }}
            >
              Delete Task
            </button>
            <button type="submit" style={{ flex: 1 }}>Submit</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
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