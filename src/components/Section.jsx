import React from 'react'
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { BsThreeDotsVertical } from "react-icons/bs";
import { GrDrag } from "react-icons/gr";
import { updateTask, deleteTask } from '../features/taskSlice';
import DatePicker from './DatePicker';
import Description from './Description';

dayjs.extend(isoWeek);

const Section = ({ task, checked, destination }) => {

  const dispatch = useDispatch();
  const taskId = task.id;
  const [taskName, setTaskName] = useState(task.taskname);
  const [taskPriority, setTaskPriority] = useState(task.priority || '');
  const [taskPrioritySelect, setTaskPrioritySelect] = useState(false)
  const [selectedDate, setSelectedDate] = useState(dayjs(task.completionDate));
  const [checkboxChecked, setCheckboxChecked] = useState(task.completed);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveChanges = () => {
    dispatch(updateTask({ taskId, name: taskName, completionDate: selectedDate.toISOString() }));
  };

  const handleCheckbox = () => {
    const newCheckboxChecked = !checkboxChecked;
    console.log("newCheckboxChecked", newCheckboxChecked);
    setCheckboxChecked(newCheckboxChecked);
    if (task.completed === true) {
      console.log('task.completed', task.completed);
      dispatch(
        updateTask({
          taskId: task.id,
          completed: false
        })
      );
    } else {
      dispatch(
        updateTask({
          taskId: task.id,
          completed: true
        })
      );
    }
  };

  const handlePriorityChange = () => {
    setTaskPrioritySelect(!taskPrioritySelect)
  }

  const handleTaskPriorityChange = (selectedOption) => {
    setTaskPriority(selectedOption.value);
    dispatch(
      updateTask({
        taskId: task.id,
        priority: selectedOption.value,
      })
    );
    setTaskPrioritySelect(false);
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask({
      taskId: task.id
    }));
  };

  const [editingTaskName, setEditingTaskName] = useState(false);

  const handleTaskNameChange = () => {
    setEditingTaskName(true);
  };

  const handleInputChange = (event) => {
    setTaskName(event.target.value);
  };

  useEffect(() => {
    if (taskName !== task.taskname) {
      dispatch(updateTask({
        taskId: task.id,
        name: taskName,
      }));
    }
  }, [taskName, task.taskname, dispatch, task.id]);

  const handleInputBlur = () => {
    setEditingTaskName(false);
    handleSaveChanges();
  };

  const handleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  }

  const handleDateSelection = (date) => {
    setSelectedDate(dayjs(date));
    dispatch(
      updateTask({
        taskId: task.id,
        completionDate: dayjs(date).toISOString(),
      })
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleInputBlur();
    }
  };
  const [modal, setModal] = useState(false)
  const handleModal = () => { setModal(!modal); }

  return (
    <li className={`section__task ${task.completed ? 'completed-task' : ''}`}>
      <div className='section__task-name'>
        <span className='section__task-icon' draggable><GrDrag className='section__task-icon__grdrag' />

        </span>
        <input className='section_task-checkbox'
          type="checkbox"
          checked={task.completed}
          onChange={handleCheckbox}
        />
        {editingTaskName && !task.completed ? (
          <input
            className='section__task-input'
            value={taskName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            autoFocus
            style={{ verticalAlign: 'middle' }} />
        ) : (
          <label draggable
            className='section__task-label'
            htmlFor="section__task-name"
            onClick={handleTaskNameChange}
            style={{ lineHeight: 'normal' }}
          >
            {task.name || taskName}
          </label>
        )}
        <button className='section__task-name-description' onClick={handleModal}><BsThreeDotsVertical />
        </button>
        {modal
          ?
          <Description
          className="section__task-name-description-icon"
            key={task.id}
            task={task}
            setModal={setModal}
            setTaskName={setTaskName}
            setTaskPriority={setTaskPriority} />
          :
          null
        }
      </div>
      <div className='section__task-date' onClick={handleDatePicker} >
        {showDatePicker && !task.completed
          ?
          <DatePicker
            handleDateSelection={handleDateSelection}
            setShowDatePicker={setShowDatePicker}
          />
          :
          <p>
            {dayjs(task.completionDate).format('MMMM D, YYYY')}
          </p>}
      </div>
      <div className='section__task-priority'>
        {taskPrioritySelect && !task.completed ? (
          <div className='section__task-priority-select'>
            {['Low', 'Medium', 'High'].map((option) => (
              <div key={option}>
                <button
                  className={`section__task-priority-btn ${option.toLowerCase()}`}
                  onClick={() => handleTaskPriorityChange({ value: option })}
                >
                  {option}
                </button>
                <button
                  className={`section__task-priority-btn-media-option ${option.toLowerCase()}`}
                  onClick={() => handleTaskPriorityChange({ value: option })}
                >
                  {option}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              className={`section__task-priority-btn ${typeof taskPriority === 'string' ? taskPriority.toLowerCase() : ''}`}
              onClick={handlePriorityChange}
              disabled={checked}
            >{taskPriority || 'Priority'}
            </button>
            <button
              className={`section__task-priority-btn-media ${typeof taskPriority === 'string' ? taskPriority.toLowerCase() : ''}`}
              onClick={handlePriorityChange}
              disabled={checked}
            >{taskPriority.substring(0, 1) || 'Priority'}
            </button>
          </div>
        )}
      </div>
      <div className='section__task-delete-btn'>
        <MdDelete onClick={handleDeleteTask} />
      </div>
    </li>
  )
}

export default Section;


