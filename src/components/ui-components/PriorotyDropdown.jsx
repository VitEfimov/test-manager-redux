import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateTask } from '../../features/taskSlice';

export const PriorotyDropdown = ({ task,checked }) => {

  //   const dispatch = useDispatch();

  //   const [taskPriority, setTaskPriority] = useState(task.priority || '');
  //   console.log('taskPriority PriorotyDropdown',taskPriority);
  //   console.log('taskPriority PriorotyDropdown',taskPriority.option);

  //   const [taskPrioritySelect, setTaskPrioritySelect] = useState(false)


  //   const handlePriorityChange = () => {
  //       setTaskPrioritySelect(!taskPrioritySelect)
  //     }

    
  // const handleTaskPriorityChange = (selectedOption) => {
  //   setTaskPriority(selectedOption.value);
  //   dispatch(
  //     updateTask({
  //       taskId: task.id,
  //       priority: selectedOption.value,
  //     })
  //   );
  //   setTaskPrioritySelect(false);
  // };
  return (
    <div className='section__task-priority'> 
        {/* {taskPrioritySelect && !task.completed
        ?
        <div className='section__task-priority-select'>
          {
            ['Low', 'Medium', 'High'].map((option) => (
              <div className='select'>
                <button
                  // key={option}
                  className={`section__task-priority-btn ${option.toLowerCase()}`}
                  onClick={() => handleTaskPriorityChange({ value: option })}>
                  {option}
                </button></div>
            ))
          }

        </div>
        :
        <button
        className={`section__task-priority-btn ${taskPriority.option ? taskPriority.option.toLowerCase() : null}`}
        onClick={handlePriorityChange}
        disabled={checked}
      >
        {taskPriority}
      </button> */}
        {/* } */}
        </div>
  )
}
