import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { updateTask } from '../features/taskSlice';
import Description from './Description';
import Section from './Section';
import { BsGripVertical } from "react-icons/bs";
import '../styles/Calendar.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  const tasks = useSelector(state => state.taskReducer?.tasks || []);
  const theme = useSelector(state => state.themeReducer || {});
  const dispatch = useDispatch();

  // Find all dates that have tasks
  const datesWithTasks = useMemo(() => {
    const dates = [];
    tasks.forEach(t => {
      if (t.completionDate) {
        dates.push(new Date(t.completionDate));
      }
    });
    return dates;
  }, [tasks]);

  // Find tasks for selected date
  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    
    return tasks.filter(t => {
      if (!t.completionDate) return false;
      const tDate = new Date(t.completionDate);
      return tDate.getFullYear() === selectedDate.getFullYear() &&
             tDate.getMonth() === selectedDate.getMonth() &&
             tDate.getDate() === selectedDate.getDate();
    });
  }, [selectedDate, tasks]);

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };

  const handleToggleCompletion = (e, task) => {
    e.stopPropagation();
    dispatch(updateTask({ taskId: task.id, completed: !task.completed }));
  };

  const handleUpdateTaskName = (taskId, newName) => {
    dispatch(updateTask({ taskId, name: newName }));
  };

  // Custom Day cell styles/modifiers
  const modifiers = {
    hasTask: datesWithTasks
  };

  const modifiersStyles = {
    hasTask: {
      position: 'relative'
    }
  };

  // Render dot indicator
  const formatDay = (day) => {
    return day.getDate();
  };

  return (
    <div className="calendar-view">
      
      <div className="calendar-top">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(day) => { if(day) setSelectedDate(day) }}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: (props) => {
              const { date, activeModifiers } = props;
              return (
                <div className="calendar-day-content">
                  {date.getDate()}
                  {activeModifiers.hasTask && (
                    <div className="task-dot" />
                  )}
                </div>
              );
            }
          }}
        />
      </div>

      <div className="calendar-bottom">
        <h3 className="calendar-date-header">
          {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select a date'}
        </h3>
        
        {selectedTasks.length === 0 ? (
          <p className="calendar-no-tasks">No tasks for this date.</p>
        ) : (
          <div className="calendar-task-list">
            {selectedTasks.map((task, index) => {
              const isSelected = selectedTaskId === task.id;
              return (
                <div key={task.id} className="calendar-task-item">
                  <Section 
                    task={task} 
                    index={index}
                    isDraggable={false}
                    selectedTaskId={selectedTaskId}
                    setSelectedTaskId={setSelectedTaskId}
                    hideDate={true}
                    calendarMode={true}
                  />
                  
                  {isSelected && (
                    <div className="task-description-wrapper">
                      <Description 
                        task={task} 
                        setModal={() => setSelectedTaskId(null)} 
                        setTaskName={() => {}} 
                        setTaskPriority={() => {}} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default CalendarView;
