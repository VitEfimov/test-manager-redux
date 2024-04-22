import React, { useState } from 'react'
import { updateTask } from '../features/boardSlice';
import { useDispatch } from 'react-redux';


const TaskPrioritySelect = ({task,checked,currentBoardId}) => {

    const list =  ['Medium', 'Low', 'High'];
    const dispatch = useDispatch();

    const [taskPrioritySelect, setTaskPrioritySelect] = useState(false)
    const [taskPriority, setTaskPriority] = useState(task.priority || '');

    const handlePriorityChange = () => {
        setTaskPrioritySelect(!taskPrioritySelect)
    }


//     <TaskPrioritySelect //for add task
//     task={{ priority: taskPriority }}
//     handleTaskPriority={handleTaskPriority}
// />
    const handleTaskPriorityChange = (selectedOption) => {
        setTaskPriority(selectedOption.value);
        dispatch(
          updateTask({
            boardId: currentBoardId,
            taskId: task.id,
            priority: selectedOption.value,
          })
        );
        setTaskPrioritySelect(false);
      };

  return (
    <div className='section__task-priority'>
     
     
      {taskPrioritySelect && !checked 
      ?
      <div className='section__task-priority-select'>
        {
          list.map((option) => (
            <div className='select'>
            <button
              key={option}
              className={`section__task-priority-btn ${option.toLowerCase()}`}
              onClick={() => handleTaskPriorityChange({value: option})}>
                {option}
              </button></div>
          ))
        }

      </div>
      :
      <button 
            className={`section__task-priority-btn ${task.priority ? task.priority.toLowerCase() : null}`} 
            onClick={handlePriorityChange}
            disabled={checked}
          >
            {task.priority}
      </button>}
      </div>
  )
}

export default TaskPrioritySelect