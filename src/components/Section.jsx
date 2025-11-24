import React from 'react'
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FcAcceptDatabase, FcDataRecovery, FcDatabase } from "react-icons/fc";
import { ImMenu } from "react-icons/im";


import { GrDrag } from "react-icons/gr";
import { Draggable } from '@hello-pangea/dnd';
import { updateTask, deleteTask } from '../features/taskSlice';
import DatePicker from './DatePicker';
import Description from './Description';
import { TfiLayoutMenuV } from "react-icons/tfi";
import ReactDatePicker from './ReactDatePicker';

dayjs.extend(isoWeek);
const Section = ({ task, checked, destination, index }) => {

  const dispatch = useDispatch();
  const taskId = task.id;
  const [taskName, setTaskName] = useState(task.taskname);
  const [taskPriority, setTaskPriority] = useState(task.priority || '');
  const [taskPrioritySelect, setTaskPrioritySelect] = useState(false)
  // const [selectedDate, setSelectedDate] = useState(dayjs(task.completionDate));
  const [selectedDate, setSelectedDate] = useState(task.completionDate ? new Date(task.completionDate) : new Date());
  const [taskTime, setTaskTime] = useState(task.time || '');
  const [checkboxChecked, setCheckboxChecked] = useState(task.completed);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleSaveChanges = () => {
    dispatch(updateTask({ taskId, name: taskName, completionDate: selectedDate.toISOString(), time: taskTime }));
  };

  const handleCheckbox = () => {
    const newCheckboxChecked = !checkboxChecked;
    // console.log("newCheckboxChecked", newCheckboxChecked);
    setCheckboxChecked(newCheckboxChecked);
    if (task.completed === true) {
      // console.log('task.completed', task.completed);
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
    // if (showDatePicker === false) {
    //   setShowDatePicker(true);
    // }else{setShowDatePicker(false);}
    setShowDatePicker(true);
  }

  const handleDateSelection = (date) => {
    const isoDate = dayjs(date).toISOString();
    setSelectedDate(date); // Keep it as native Date
    dispatch(updateTask({
      taskId: task.id,
      completionDate: isoDate,
    }));
  };

  const handleTimeChange = (e) => {
    setTaskTime(e.target.value);
    dispatch(updateTask({ taskId: task.id, time: e.target.value }));
  };

  // const handleDateSelection = (date) => {
  //   setSelectedDate(dayjs(date));
  //   dispatch(
  //     updateTask({
  //       taskId: task.id,
  //       completionDate: dayjs(date).toISOString(),
  //     })
  //   );
  // };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleInputBlur();
    }
  };
  const [modal, setModal] = useState(false)
  const handleModal = () => { setModal(!modal); }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <li
          className={`section__task ${task.completed ? 'completed-task' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className='section__task-name' {...provided.dragHandleProps}>
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

            {task.description.text ? (
              <button className='section__task-name-description' onClick={handleModal}><FcAcceptDatabase />
              </button>
            ) : (
              <button className='section__task-name-description' onClick={handleModal}><FcDatabase />

              </button>
            )}

            {/* <button className='section__task-name-description' onClick={handleModal}><TfiLayoutMenuV />
        </button> */}
            {modal && !task.completed
              ?
              <Description
                className="section__task-name-description-icon"
                key={task.id}
                task={task}
                setModal={setModal}
                setTaskName={setTaskName}
                setTaskPriority={setTaskPriority}
              />
              :
              null
            }
          </div>

          <div className='section__task-date' onClick={handleDatePicker}>
            {
              showDatePicker && !task.completed ? (
                <DatePicker
                  handleDateSelection={handleDateSelection}
                  setShowDatePicker={setShowDatePicker}
                  currentDate={selectedDate}
                />
              ) : (
                <div className="section__task-date-display">
                  <p>{dayjs(selectedDate).format('MMMM D, YYYY')}</p>
                  {!task.completed && taskTime && (
                    <input
                      type="time"
                      value={taskTime}
                      onClick={(e) => e.stopPropagation()}
                      onChange={handleTimeChange}
                      className="section__task-time-display"
                    />
                  )}
                </div>
              )
            }
          </div>
          {/* <div className='section__task-date' onClick={handleDatePicker} >
        {
          showDatePicker &&
            !task.completed
            ?
            // <ReactDatePicker
            // handleDateSelection={handleDateSelection}
            // setShowDatePicker={setShowDatePicker}/>
            <DatePicker
              handleDateSelection={handleDateSelection}
              setShowDatePicker={setShowDatePicker}
            />
            :
            <p>
              {dayjs(task.completionDate).format('MMMM D, YYYY')}
            </p>}
      </div> */}
          <div className='section__task-priority'>
            {taskPrioritySelect && !task.completed ? (
              <div className='section__task-priority-select'>
                {['Low', 'Medium', 'High'].map((option) => (
                  <div key={option}>
                    <button
                      className={`section__task-priority-option ${option.toLowerCase()}`}
                      onClick={() => handleTaskPriorityChange({ value: option })}
                    >
                      {option}
                    </button>
                    <button
                      className={`section__task-priority-option-media ${option.toLowerCase()}`}
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
                  className={`section__task-priority-button ${typeof taskPriority === 'string' ? taskPriority.toLowerCase() : ''}`}
                  onClick={handlePriorityChange}
                  disabled={checked}
                >{taskPriority || 'Priority'}
                </button>
                <button
                  className={`section__task-priority-button-media ${typeof taskPriority === 'string' ? taskPriority.toLowerCase() : ''}`}
                  onClick={handlePriorityChange}
                  disabled={checked}
                >{taskPriority.substring(0, 1) || 'Prt'}
                </button>
              </div>
            )}
          </div>
          <div className='section__task-delete-btn'>
            <MdDelete onClick={handleDeleteTask} />
          </div>
        </li>
      )}
    </Draggable>
  )
}

export default Section;
