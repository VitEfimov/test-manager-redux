import React, { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../features/taskSlice';
import { useClickOutside } from '../custom-hooks/ClickOut';


const AddTask = ({ date }) => {
    const dispatch = useDispatch();
    const activeBoardId = useSelector(state => state.userReducer.activeBoardId);
    const [addTaskForm, setAddTaskForm] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [taskPrioritySelect, setTaskPrioritySelect] = useState(false);
    const dueDateRef = useRef(null);

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
            boardId: activeBoardId || 'main',
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
        setCompletionDate(getCompletionDate(date));
        setAddTaskForm(false);
    };

    const handleDeleteTask = () => {
        setTaskName('');
        setTaskPriority('');
        setCompletionDate(getCompletionDate(date));
        setAddTaskForm(false);
    };
    const handlePriorityChange = () => {
        setTaskPrioritySelect(!taskPrioritySelect)
    }
    const handleTaskPriorityChange = (priority) => {
        setTaskPriority(priority);
        setTaskPrioritySelect(false);
    };

    const addTaskFormRef = useRef(null)
    useClickOutside(addTaskFormRef, () => setAddTaskForm(false))
    return (
        <div className='add-task' ref={addTaskFormRef}>
            {addTaskForm &&
                <div className='task-row add-task-row'>
                    <span className='task-drag-handle col-drag add-task-drag-hidden'></span>
                    
                    <button className="task-check" onClick={handleDeleteTask} title="Cancel" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdDelete size={18} style={{ color: 'var(--text-secondary)' }} />
                    </button>

                    <div className='task-title col-task add-task-title-container'>
                        <div className="task-title-auto-resize-wrapper">
                            <div className="task-title-ghost">{(taskName || "Enter task name...") + ' '}</div>
                            <textarea
                                className='section__task-input task-title-input add-task-title-input'
                                id="section__task-name"
                                placeholder="Enter task name..."
                                value={taskName}
                                onChange={(e) => handleAddTaskName(e)}
                                required
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddTask();
                                    }
                                }}
                                autoFocus rows={1}
                            />
                        </div>
                    </div>
                    
                    <div className='task-due col-due task-due-btn' ref={dueDateRef}>
                        <div className='add-task-due-container'>
                            <input
                                className="input-field add-task-due-input"
                                type="date"
                                value={completionDate ? dayjs(completionDate).format('YYYY-MM-DD') : ''}
                                onChange={(e) => {
                                    const newDate = e.target.value ? dayjs(e.target.value).format('MMMM D, YYYY') : '';
                                    setCompletionDate(newDate);
                                }}
                            />
                        </div>
                    </div>

                    <div className='task-priority col-priority'>
                        {taskPrioritySelect ? (
                            <div className='section__task-priority-select task-priority-dropdown'>
                                {['Low', 'Medium', 'High'].map((option) => (
                                    <button
                                        key={option}
                                        className={`section__task-priority-btn ${option.toLowerCase()}`}
                                        onClick={() => handleTaskPriorityChange(option)}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <span className={`section-badge priority-text-${taskPriority?.toLowerCase() || 'none'} task-priority-btn`} onClick={handlePriorityChange}>
                                {taskPriority || 'Priority'}
                            </span>
                        )}
                    </div>

                    <div className='task-delete col-delete add-task-actions'>
                        <button className='task-add-submit-btn' onClick={handleAddTask}>
                            Add
                        </button>
                    </div>
                </div>
            }
            <div className={`add__task ${date}`}>
                {!addTaskForm &&
                    <button className='add__task-btn' onClick={handleAddTaskForm}>
                        Add task
                    </button>
                }
            </div>
            <div className='section__line-bottom add-task'></div>
        </div>
    );
};

export default AddTask;
