import React from 'react'
import { MdDelete } from "react-icons/md";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { FcAcceptDatabase, FcDatabase } from "react-icons/fc";
import { useClickOutside } from '../custom-hooks/ClickOut';

import { Draggable } from '@hello-pangea/dnd';


import { GrDrag } from "react-icons/gr";
import { updateTask, deleteTask } from '../features/taskSlice';
import DatePicker from './DatePicker';
import Description from './Description';
import '../styles/Section.css';



dayjs.extend(isoWeek);
const Section = ({ task, index, checked, isDraggable = true, selectedTaskId, setSelectedTaskId }) => {

  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState(task.taskname);
  const [taskPriority, setTaskPriority] = useState(task.priority);
  const [taskTime, setTaskTime] = useState(task.time);

  const theme = useSelector(state => state.themeReducer);
  const timeFormat = theme.timeFormat || '12h';
  const dateFormat = theme.dateFormat || 'MMMM D';
  const taskNameWrap = theme.taskNameWrap || 'wrap';

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedDate, setSelectedDate] = useState(task.completionDate ? new Date(task.completionDate) : new Date());
  const [checkboxChecked, setCheckboxChecked] = useState(task.completed);
  const [showDatePicker, setShowDatePicker] = useState(false);

  console.log(showDatePicker);


  const handleSaveChanges = () => {
    dispatch(updateTask({ taskId: task.id, name: taskName, completionDate: selectedDate.toISOString(), time: taskTime }));
  };

  const handleCheckbox = () => {
    const newCheckboxChecked = !checkboxChecked;
    setCheckboxChecked(newCheckboxChecked);
    if (task.completed === true) {
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
    if (window.confirm(`Are you sure you want to delete the task "${task.taskname}"?`)) {
      dispatch(deleteTask({
        taskId: task.id
      }));
    }
  };

  const [editingTaskName, setEditingTaskName] = useState(false);

  const handleTaskNameChange = () => {
    setEditingTaskName(true);
  };

  const handleInputChange = (event) => {
    setTaskName(event.target.value);
  };

  useEffect(() => {
    setTaskName(task.taskname);
    setTaskPriority(task.priority);
    setTaskTime(task.time);
    setSelectedDate(task.completionDate ? new Date(task.completionDate) : new Date());
  }, [task.taskname, task.priority, task.time, task.completionDate]);

  const handleInputBlur = () => {
    setEditingTaskName(false);
    handleSaveChanges();
  };

  const textAreaRef = useRef(null);

  const adjustTextareaHeight = (element) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (editingTaskName) {
      adjustTextareaHeight(textAreaRef.current);
    }
  }, [editingTaskName, taskName]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInputBlur();
    }
  };

  const handleDatePicker = () => {
    if (window.innerWidth <= 768) {
      setModal(true);
      return;
    }
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

  const [taskPrioritySelect, setTaskPrioritySelect] = useState(false)
  const [modal, setModal] = useState(false)
  const handleModal = () => {
    setModal(!modal);
  }

  const priorityRef = useRef(null)

  useClickOutside(priorityRef, () => setTaskPrioritySelect(false))



  const getPriorityBgColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'rgba(241, 81, 81, 0.3)';
      case 'medium':
        return 'rgba(218, 143, 3, 0.3)';
      case 'low':
        return 'rgba(71, 133, 71, 0.3)';
      default:
        return 'transparent';
    }
  };

  const renderContent = (provided) => (
    <li
      className={`task-row section__task ${task.completed ? 'completed-task' : ''} ${selectedTaskId === task.id ? 'selected' : ''}`}
      onClick={(e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.closest('button') === null && e.target.closest('.section__task-priority-select') === null) {
          if (!isMobile) {
            if (setSelectedTaskId) setSelectedTaskId(task.id);
          }
        }
      }}
      ref={provided?.innerRef}
      {...provided?.draggableProps}
    >
        {/* DESKTOP V2 STRUCTURE (now used everywhere) */}
        <>
          <span className='section__task-icon task-drag-handle col-drag' {...provided?.dragHandleProps}>
            <GrDrag className='section__task-icon__grdrag' />
          </span>
          
          <button className="task-check" onClick={handleCheckbox}>
            {task.completed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="task-icon-done">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </button>

          <div className={`task-title task-title-wrapper wrap-${taskNameWrap} ${task.completed ? 'done' : ''} col-task`}>
            {editingTaskName && !task.completed ? (
              <textarea
                ref={textAreaRef} className='section__task-input task-title-input' value={taskName ?? ""}
                onChange={handleInputChange} onInput={(e) => adjustTextareaHeight(e.target)} onBlur={handleInputBlur} onKeyDown={handleKeyDown}
                onFocus={(e) => { const val = e.target.value; e.target.value = ''; e.target.value = val; adjustTextareaHeight(e.target); e.target.selectionStart = e.target.value.length; }}
                autoFocus rows={1}
              />
            ) : (
              <label className={`section__task-label task-title-label priority-name-${taskPriority?.toLowerCase() || 'none'}`} onClick={handleTaskNameChange}>
                {task.name || taskName}
              </label>
            )}
          </div>

          <div className="task-due col-due task-due-btn" onClick={(e) => {
            e.stopPropagation();
            if (setSelectedTaskId) setSelectedTaskId(task.id);
          }}>
            {showDatePicker && !task.completed && !isMobile ? (
              <DatePicker handleDateSelection={handleDateSelection} setShowDatePicker={setShowDatePicker} currentDate={selectedDate} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {!isMobile && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="task-due-icon">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  )}
                  {dayjs(task.completionDate).format(dateFormat === 'short' ? 'MMM D' : 'MMM DD, YYYY')}
                </div>
                {task.time && (
                  <span style={{ fontSize: '10px', color: '#999', marginLeft: isMobile ? '0' : '15px', fontWeight: 'normal' }}>
                    {timeFormat === '24h' ? task.time : (() => {
                      const [h, m] = task.time.split(':');
                      if (!h || !m) return task.time;
                      const hInt = parseInt(h, 10);
                      const ampm = hInt >= 12 ? 'PM' : 'AM';
                      const h12 = hInt % 12 || 12;
                      return `${h12}:${m} ${ampm}`;
                    })()}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className='section__task-priority col-priority' ref={priorityRef}>
            {taskPrioritySelect && !task.completed ? (
              <div className='section__task-priority-select task-priority-dropdown'>
                {['Low', 'Medium', 'High'].map((option) => (
                  <button key={option} className={`section__task-priority-btn ${option.toLowerCase()}`} onClick={() => handleTaskPriorityChange({ value: option })}>{option}</button>
                ))}
              </div>
            ) : (
              <span className={`section-badge priority-text-${taskPriority?.toLowerCase() || 'none'} task-priority-btn`} onClick={handlePriorityChange}>
                {taskPriority || 'Priority'}
              </span>
            )}
          </div>
        </>
    </li>
  );

  if (!isDraggable) {
    return renderContent();
  }

  return (
    <Draggable draggableId={task.id.toString()} index={typeof index === 'number' ? index : 0}>
      {(provided) => renderContent(provided)}
    </Draggable>
  )
}

export default React.memo(Section);


