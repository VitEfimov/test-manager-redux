import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask } from '../features/taskSlice';
import dayjs from 'dayjs';

const Description = ({ task, setModal, setTaskName, setTaskPriority }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: task.taskname,
    priority: task.priority,
    completed: task.completed,
    completionDate: task.completionDate,
    time: task.time || '',
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
      time: task.time || '',
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
          <input className='description__input' type="text" name="completionDate" value={dayjs(formData.completionDate).format('MMMM D, YYYY')} onChange={handleChange} disabled />

          <label>Time:</label>
          <input className='description__input' type="time" name="time" value={formData.time} onChange={handleChange} />

          <label>Description:</label>
          <textarea className='description__input' name="descriptionText" value={formData.descriptionText} onChange={handleChange}></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Description;