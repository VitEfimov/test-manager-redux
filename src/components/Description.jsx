import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask } from '../features/taskSlice';
import dayjs from 'dayjs';

const Description = ({ task, setModal, setTaskName, setTaskPriority}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: task.taskname,
    priority: task.priority,
    completed: task.completed,
    completionDate: task.completionDate,
    descriptionText: task.description?.text || '',
    descriptionImg: task.description?.img || '',
    descriptionUrl: task.description?.url || '',
  });

  useEffect(() => {
    setFormData({
      name: task.taskname,
      priority: task.priority,
      completed: task.completed,
      completionDate: task.completionDate,
      descriptionText: task.description?.text || '',
      descriptionImg: task.description?.img || '',
      descriptionUrl: task.description?.url || '',
    });
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = {
      taskId: task.id,
      name: formData.name,
      priority: formData.priority,
      completed: formData.completed,
      completionDate: formData.completionDate,
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const updatedTask = {
  //     taskId: task.id,
  //     name: formData.name,
  //     priority: formData.priority,
  //     completed: formData.completed,
  //     completionDate: formData.completionDate,
  //     description: {
  //       text: formData.descriptionText,
  //       img: formData.descriptionImg,
  //       url: formData.descriptionUrl,
  //     },
  //   };
  //   dispatch(updateTask(updatedTask));
  //   setModal(false);
  // };
  return (
    <div className="description__modal">
      <div className="description__modal-content">
        <span className="description__close" onClick={() => setModal(false)}>&times;</span>
        <form onSubmit={handleSubmit}>
          <label>Task:</label>
          <input className='description__input task-name' type="text" name="name" value={formData.name} onChange={handleChange} />
          <label>Priority:</label>
          <select 
          className='description__input' 
          name="priority" 
          value={formData.priority} 
          onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          
          <label>Completion Date:</label>
          <input className='description__input' type="text" name="completionDate" value={dayjs(formData.completionDate).format('MMMM D, YYYY')} onChange={handleChange} disabled/>
          
          <label>Description:</label>
          <textarea className='description__input' name="descriptionText" value={formData.descriptionText} onChange={handleChange}></textarea>
          
          {/* <label>Description URL:</label>
          <input className='desctiption__input' type="text" name="descriptionUrl" value={formData.descriptionUrl} onChange={handleChange} />
           */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Description;




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