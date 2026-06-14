import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { addMultipleTasks } from '../features/taskSlice';

const DetailPanel = ({ task, onClose, onSave, onDelete }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (task) {
            setFormData({
                name: task.taskname || task.name || '',
                completionDate: task.completionDate || '',
                priority: task.priority || '',
                time: task.time || '',
                repeat: 'None',
                descriptionText: task.description?.text || ''
            });
        }
    }, [task]);

    if (!task) {
        return (
            <div className="detail-panel">
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888' }}>
                    Select a task to view details
                </div>
            </div>
        );
    }

    const priorityColor = () => {
        if (!formData.priority) return '';
        const p = formData.priority.toLowerCase();
        if (p === 'high') return 'high';
        if (p === 'medium') return 'medium';
        if (p === 'low') return 'low';
        return '';
    };

    const handleAutoSave = (overrides = {}) => {
        const newData = { ...formData, ...overrides };
        const updatedTask = {
            taskId: task.id,
            name: newData.name,
            priority: newData.priority === 'None' ? '' : newData.priority,
            completionDate: newData.completionDate,
            time: newData.time,
            description: {
                ...task.description,
                text: newData.descriptionText
            }
        };
        if (onSave) onSave(updatedTask);

        if (newData.repeat && newData.repeat !== 'None') {
            const tasksToGenerate = [];
            const endDate = dayjs(newData.completionDate || dayjs()).add(6, 'month');
            let currentIterDate = dayjs(newData.completionDate || dayjs());
            
            while (true) {
                currentIterDate = newData.repeat === 'Daily' ? currentIterDate.add(1, 'day') : currentIterDate.add(1, 'week');
                if (currentIterDate.isAfter(endDate)) break;
                
                const newTaskId = new Date().getTime().toString() + Math.random().toString(36).substr(2, 9);
                tasksToGenerate.push({
                    id: newTaskId,
                    boardId: task.boardId || 'main',
                    taskname: newData.name,
                    priority: newData.priority === 'None' ? '' : newData.priority,
                    completed: false,
                    completionDate: currentIterDate.toISOString(),
                    time: newData.time,
                    description: {
                        ...task.description,
                        text: newData.descriptionText
                    },
                    lastUpdatedDate: new Date().toISOString()
                });
            }

            if (tasksToGenerate.length > 0) {
                dispatch(addMultipleTasks({ tasks: tasksToGenerate }));
                alert(`Generated ${tasksToGenerate.length} recurring tasks!`);
                // Reset repeat so it doesn't fire again
                setFormData(prev => ({ ...prev, repeat: 'None' }));
            }
        }
    };

    const handleChangeAndSave = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        handleAutoSave({ [field]: value });
    };

    return (
        <div className="detail-panel">
            <div className="detail-header">
                <div className="detail-header-left" style={{flex: 1, marginRight: '16px'}}>
                    <button className={`detail-check ${task.completed ? 'done' : ''}`} disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            {task.completed && <polyline points="8 12 11 15 16 9" />}
                        </svg>
                    </button>
                    <input 
                        className="detail-input-title"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        onBlur={() => handleAutoSave()}
                        placeholder="Task name"
                    />
                </div>
                <button className="detail-close" onClick={onClose} aria-label="Close Details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <div className="detail-body">
                <div className="detail-row">
                    <svg className="detail-row-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="detail-row-label">Due date</span>
                    <input 
                        type="date"
                        className="detail-input-date"
                        value={formData.completionDate ? dayjs(formData.completionDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => {
                            const val = e.target.value ? new Date(e.target.value).toISOString() : '';
                            handleChangeAndSave('completionDate', val);
                        }}
                    />
                </div>
                <div className="detail-row">
                    <svg className="detail-row-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                    <span className="detail-row-label">Priority</span>
                    <select 
                        className={`detail-input-select ${priorityColor()}`}
                        value={formData.priority || 'None'}
                        onChange={(e) => handleChangeAndSave('priority', e.target.value)}
                    >
                        <option value="None">None</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="detail-row">
                    <svg className="detail-row-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="detail-row-label">Time</span>
                    <input 
                        type="time" 
                        className="detail-input-date"
                        value={formData.time || ''} 
                        onChange={(e) => handleChangeAndSave('time', e.target.value)}
                    />
                </div>
                <div className="detail-row">
                    <svg className="detail-row-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="17 1 21 5 17 9" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <polyline points="7 23 3 19 7 15" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    <span className="detail-row-label">Repeat</span>
                    <select 
                        className="detail-input-select"
                        value={formData.repeat || 'None'}
                        onChange={(e) => handleChangeAndSave('repeat', e.target.value)}
                    >
                        <option value="None">None</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                    </select>
                </div>
                <div className="detail-divider"></div>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <div className="detail-section-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
                            <line x1="17" y1="10" x2="3" y2="10" />
                            <line x1="21" y1="6" x2="3" y2="6" />
                            <line x1="21" y1="14" x2="3" y2="14" />
                            <line x1="17" y1="18" x2="3" y2="18" />
                        </svg>
                        Description
                    </div>
                    <textarea 
                        className="detail-input-textarea"
                        value={formData.descriptionText || ''}
                        onChange={(e) => setFormData({...formData, descriptionText: e.target.value})}
                        onBlur={() => handleAutoSave()}
                        placeholder="Add a description..."
                    />
                </div>

                <div className="detail-divider"></div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="detail-section-label" style={{marginBottom: '8px'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Activity
                    </div>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.8'}}>
                        <li style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#ccc', marginRight: '8px'}}></span>
                            Created task - {
                                (() => {
                                    const ts = parseInt(String(task.id).slice(0, 13), 10);
                                    if (!isNaN(ts) && ts > 1600000000000 && ts < 2500000000000) return dayjs(ts).format('MMM D, YYYY h:mm A');
                                    return 'Unknown time';
                                })()
                            }
                        </li>
                        {task.completed && (
                        <li style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#27ae60', marginRight: '8px'}}></span>
                            Completed - {task.completedAt ? dayjs(task.completedAt).format('MMM D, YYYY h:mm A') : 'Unknown time'}
                        </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="detail-footer" style={{justifyContent: 'flex-end'}}>
                <button className="detail-btn delete" onClick={onDelete} style={{flex: '0 0 auto', padding: '8px 16px'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Delete Task
                </button>
            </div>
        </div>
    );
};

export default DetailPanel;
