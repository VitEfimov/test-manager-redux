import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../features/taskSlice';
import DatePicker from './DatePicker';
import { useClickOutside } from '../custom-hooks/ClickOut';


const AddTask = ({ date }) => {
    const dispatch = useDispatch();
    const activeBoardId = useSelector(state => state.userReducer.activeBoardId);
    const [addTaskForm, setAddTaskForm] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [taskPrioritySelect, setTaskPrioritySelect] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerPos, setDatePickerPos] = useState({ top: 0, left: 0 });
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

    const addTaskFormRef = useRef(null)
    useClickOutside(addTaskFormRef, () => setAddTaskForm(false))
    
    const handleShowDatePicker = () => {
        if (dueDateRef.current) {
            const rect = dueDateRef.current.getBoundingClientRect();
            setDatePickerPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        }
        setShowDatePicker(true);
    };

    return (
        <div className='add-task' ref={addTaskFormRef}>
            {addTaskForm &&
                <div className='task-row add-task-row'>
                    <span className='task-drag-handle col-drag' style={{ visibility: 'hidden' }}></span>
                    
                    <button className="task-check" disabled>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                    </button>

                    <div className='task-title col-task' style={{ display: 'flex', flex: 1, minWidth: 0 }}>
                        <input
                            className='task-title-input'
                            id="section__task-name"
                            style={{ width: '100%', outline: 'none', background: 'transparent', border: '1px solid var(--dark-background-color-main-priority)', padding: '5px', borderRadius: '5px', color: 'inherit' }}
                            placeholder="Enter task name..."
                            value={taskName}
                            onChange={(e) => handleAddTaskName(e)}
                            required
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTask();
                                }
                            }}
                            autoFocus
                        />
                    </div>
                    
                    <div className='task-due col-due task-due-btn' ref={dueDateRef}>
                        {showDatePicker ? (
                            <DatePicker
                                handleDateSelection={(selectedDate) => {
                                    setCompletionDate(dayjs(selectedDate).format('MMMM D, YYYY'));
                                }}
                                setShowDatePicker={setShowDatePicker}
                                currentDate={completionDate}
                            />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', cursor: 'pointer' }} onClick={handleShowDatePicker}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="task-due-icon">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    {completionDate}
                                </div>
                            </div>
                        )}
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

                    <div className='task-delete col-delete' style={{ display: 'flex', gap: '5px' }}>
                        <button className='task-delete-btn' onClick={handleDeleteTask}>
                            <MdDelete size={18} />
                        </button>
                        <button className='task-add-submit-btn' onClick={handleAddTask} style={{ background: '#4a7a4a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold' }}>
                            Add
                        </button>
                    </div>
                </div>
            }
            <div className={`add__task ${date}`}>
                {!addTaskForm &&
                    <button className='add__task-btn' onClick={handleAddTaskForm}>
                        Add task...
                    </button>
                }
            </div>
            <div className='section__line-bottom add-task'></div>
        </div>
    );
};

export default AddTask;
