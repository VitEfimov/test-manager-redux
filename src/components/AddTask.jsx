import React from 'react'
import dayjs from 'dayjs';
import { MdDelete } from "react-icons/md";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../features/taskSlice';
import { PriorotyDropdown } from './ui-components/PriorotyDropdown';
import DatePicker from './DatePicker';


const AddTask = ({ date }) => {
    const dispatch = useDispatch();
    const [addTaskForm, setAddTaskForm] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [taskPrioritySelect, setTaskPrioritySelect] = useState(false)

    const handleAddTaskForm = () => {
        setAddTaskForm(!addTaskForm);
    };

    const handleAddTaskName = (e) => setTaskName(e.target.value);

    const getCompletionDate = (date) => {
        switch (date) {
            case "today":
                return dayjs().format('MMMM D, YYYY');
            case "tomorrow":
                return dayjs()
                    .add(1, 'day')
                    .format('MMMM D, YYYY');
            case "on-this-week":
                return dayjs()
                    .endOf('week')
                    .isoWeekday(7)
                    .format('MMMM D, YYYY');
            case "on-next-week":
                return dayjs()
                    .add(1, 'week')
                    .isoWeekday(7)
                    .format('MMMM D, YYYY');
            case "later":
                return dayjs()
                    .add(3, 'week')
                    .startOf('week')
                    .format('MMMM D, YYYY');
            default:
                return '';
        }
    };


    const [completionDate, setCompletionDate] = useState(getCompletionDate(date))

    const handleAddTask = () => {
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }

        const newTask = {
            id: new Date().getTime().toString(),
            taskname: taskName,
            creationDate: new Date().toLocaleDateString(),
            lastUpdatedDate: null,
            completionDate: completionDate,
            priority: taskPriority,
            completed: false,
            description: {
                text: '',
                img: '',
                url: '',
            },
        };

        dispatch(addTask({
            task: newTask
        }));

        setTaskName('');
        setTaskPriority('');
        setAddTaskForm(false);
    };

    const handleDeleteTask = () => {
        setAddTaskForm(false);

    };
    const handlePriorityChange = () => {
        setTaskPrioritySelect(!taskPrioritySelect)
    }
    const handleTaskPriorityChange = (priority) => {
        setTaskPriority(priority);
        setTaskPrioritySelect(false);
    };



    return (
        <div className='add-task'>
            {addTaskForm &&
                <div className='section__task add-task'>
                    <div className='section__task-name add-task'>
                        <span className='section__task-icon add-task'>&#8789;</span>
                        <input
                            className='section_task-checkbox add-task'
                            type="checkbox"
                            disabled
                        />
                        <input
                            className='section__task-input add-task'
                            id="section__task-name"
                            contentEditable={true}
                            placeholder="Enter task name..."
                            value={taskName}
                            onChange={(e) => handleAddTaskName(e)}
                            required
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTask();
                                }
                            }}
                        />
                    </div>
                    <div className='section__task-date add-task'>
                        <p>{getCompletionDate(date)}</p>
                    </div>

                    <div className='section__task-priority add-task'>
                        {taskPrioritySelect
                            ?
                            <div className='section__task-priority-select add-task'>
                                {
                                    ['High', 'Medium', 'Low'].map((option) => (
                                        <div className='select add-task'>
                                            <button
                                                key={option}
                                                className={`section__task-priority-btn ${option.toLowerCase()} add-task`}
                                                onClick={() => handleTaskPriorityChange(option)}>
                                                {option}
                                            </button></div>
                                    ))
                                }
                            </div>
                            :
                            <button className='add__task-btn'
                                onClick={handlePriorityChange}
                            >
                                <p className={`section__task-priority-btn ${typeof taskPriority === 'string' ? taskPriority.toLowerCase() : ''} add-task`}>{taskPriority || 'Task priority'}</p>
                            </button>}
                    </div>
                    <div className='section__task-delete-btn add-task'>
                        <MdDelete onClick={handleDeleteTask} />
                    </div>
                </div>
            }
            <div className={`add__task ${date}`}>
                {!addTaskForm ?
                    <button className='add__task-btn' onClick={handleAddTaskForm}>
                        Add task...
                    </button>
                    :
                    <button className='add__task-btn click_to_add_task' onClick={handleAddTask}>
                        Click to add task
                    </button>}
            </div>
            <div className='section__line-bottom add-task'></div>
        </div>
    );
};

export default AddTask;



