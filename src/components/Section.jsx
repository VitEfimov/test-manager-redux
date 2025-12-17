import React from 'react'
import { MdDelete } from "react-icons/md";
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FcAcceptDatabase, FcDataRecovery, FcDatabase } from "react-icons/fc";
import { ImMenu } from "react-icons/im";
import { useClickOutside } from '../custom-hooks/ClickOut';

import { Draggable } from '@hello-pangea/dnd';


import { GrDrag } from "react-icons/gr";
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
  const [taskTime, setTaskTime] = useState(task.time || '')
  const [taskPrioritySelect, setTaskPrioritySelect] = useState(false)
  // const [selectedDate, setSelectedDate] = useState(dayjs(task.completionDate));
  const [selectedDate, setSelectedDate] = useState(task.completionDate ? new Date(task.completionDate) : new Date());
  const [checkboxChecked, setCheckboxChecked] = useState(task.completed);
  const [showDatePicker, setShowDatePicker] = useState(false);

  console.log(showDatePicker);


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
    // setShowDatePicker(!showDatePicker);
    // if (showDatePicker == true){
    //   setShowDatePicker(false)
    // }
    // setShowDatePicker(true)
    setShowDatePicker(prev => !prev);
  }

  const handleDateSelection = (date) => {
    const isoDate = dayjs(date).toISOString();
    setSelectedDate(date);
    dispatch(updateTask({
      taskId: task.id,
      completionDate: isoDate,
    }));
  };

  const handleTimeChange = (e) => {
    setTaskTime(e.target.value);
    dispatch(updateTask({ taskId: task.id, time: e.target.value }))

  }

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


  const [openModalTaskId, setOpenModalTaskId] = useState(null);
  const [openPopup, setOpenPopup] = useState(null)
  const [modal, setModal] = useState(false)
  const handleModal = () => {
    if (modal === true) {
      setModal(false)
      setModal(true)
    }
    setModal(!modal);
  }

  const handleModalOpt = () => {
    setOpenModalTaskId(openPopup === 'description' ? null : 'description')

  }

  // console.log("rendering Section:", task.id, task.completionDate);

  const priorityRef = useRef(null)

  useClickOutside(priorityRef, () => setTaskPrioritySelect(false))



  return (
    <Draggable draggableId={task.id.toString()} index={typeof index === 'number' ? index : 0}>
      {(provided) => (
        <li
          className={`section__task ${task.completed ? 'completed-task' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className='section__task-name'>
            <span
              className='section__task-icon'
            >
              <GrDrag className='section__task-icon__grdrag' />
            </span>
            <input className='section_task-checkbox'
              type="checkbox"
              checked={!!task.completed}
              onChange={handleCheckbox}
            />
            {editingTaskName && !task.completed ? (
              <input
                className='section__task-input'
                value={taskName ?? ""}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{ verticalAlign: 'middle' }} />
            ) : (
              <label
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

          {/* <div className='section__task-date' onClick={handleDatePicker}> */}
          <div className='section__task-date'>

            {
              showDatePicker && !task.completed ? (
                <DatePicker
                  handleDateSelection={handleDateSelection}
                  setShowDatePicker={setShowDatePicker}
                  currentDate={selectedDate}
                />
              ) : (
                <p onClick={handleDatePicker}>{dayjs(task.completionDate).format('MMMM D, YYYY')}</p>
                // <p>{dayjs(task.completionDate).format('MMMM D, YYYY')}</p>

              )
            }
          </div>

          <div ref={priorityRef} className='section__task-priority'>
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


