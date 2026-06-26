import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Section from './Section';
import AddTask from './AddTask';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import getFilters from '../list-view/filters';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { updateTask, deleteTask } from '../features/taskSlice';
import { addBoardAsync, renameBoardAsync, deleteBoardAsync, setActiveBoardId } from '../features/userSlice';
import ColumnResizer from './ColumnResizer';
import DetailPanel from './DetailPanel';
import Description from './Description';

dayjs.extend(isSameOrBefore);

const ListOfSections = ({ sidebarView }) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.taskReducer.tasks || []);
    const theme = useSelector(state => state.themeReducer);
    const boards = useSelector(state => state.userReducer.boards) || [{ id: 'main', name: 'Main' }];
    const activeBoardId = useSelector(state => state.userReducer.activeBoardId);
    const isAuthenticated = useSelector(state => state.userReducer.isAuthenticated);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        missed: true,
        today: true,
        tomorrow: true
    });
    const [openMenuSectionId, setOpenMenuSectionId] = useState(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.section-action-wrapper')) {
                setOpenMenuSectionId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleAddBoard = () => {
        const boardLimit = isAuthenticated ? 6 : 2;
        if (boards.length >= boardLimit) {
            alert(`You have reached the maximum number of boards (${boardLimit}) for your current plan. Please ${isAuthenticated ? 'upgrade' : 'login'} to add more.`);
            return;
        }
        const name = prompt('Enter new board name:');
        if (name && name.trim()) {
            const id = new Date().getTime().toString();
            dispatch(setActiveBoardId(id));
            dispatch(addBoardAsync({ id, name: name.trim() })).then((action) => {
                if (action.meta.requestStatus === 'rejected') {
                    const errorMsg = action.error?.message || 'Unknown error';
                    alert('Failed to save the new board. Error: ' + errorMsg);
                }
            });
        }
    };

    const handleRenameBoard = (id, currentName) => {
        const name = prompt('Enter new name for the board:', currentName);
        if (name && name.trim() && name !== currentName) {
            dispatch(renameBoardAsync({ id, name: name.trim() }));
        }
    };

    const handleDeleteBoard = (id) => {
        if (id === 'main') {
            alert('Cannot delete the Main board.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this board? ALL tasks in this board will be permanently deleted!')) {
            dispatch(deleteBoardAsync(id));
            tasks.filter(t => (t.boardId || 'main') === id).forEach(t => dispatch(deleteTask({ taskId: t.id })));
        }
    };

    const renderSectionItems = (tasksList, sectionId) => {
        return tasksList.map((task, index) => (
            <Section 
                key={task.id} 
                task={task} 
                index={index} 
                checked={sectionId === 'completed'}
                selectedTaskId={selectedTaskId}
                setSelectedTaskId={setSelectedTaskId}
            />
        ));
    };

    const renderSectionHeader = (id, title, tasksFiltered, colorClass, customTitleColor) => {
        const isExpanded = !!expandedSections[id];
        const isMenuOpen = openMenuSectionId === id;

        return (
            <div className={`section-header section-header-no-padding ${id === 'completed' ? 'completed-section-header' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span 
                        className={`section-title ${colorClass}`} 
                        style={{ color: customTitleColor || '', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => toggleSection(id)}
                    >
                        <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'}`} style={{ fontSize: '0.8em', opacity: 0.7 }}></i>
                        {title}
                    </span>
                </div>
                
                <div className="section-action-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span 
                        className={`section-badge ${colorClass}`} 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuSectionId(isMenuOpen ? null : id); }} 
                        style={{ cursor: 'pointer' }}
                    >
                        {tasksFiltered.length}
                    </span>
                    {(tasksFiltered.length > 0 || id === 'completed') && (
                        <span 
                            className="section-action-dots" 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuSectionId(isMenuOpen ? null : id); }} 
                            style={{ cursor: 'pointer', padding: '0 8px', fontSize: '1.2em', fontWeight: 'bold', color: 'var(--text-secondary)' }}
                        >
                            ⋮
                        </span>
                    )}
                    
                    {isMenuOpen && tasksFiltered.length > 0 && (
                        <div className="section-action-menu" style={{ 
                            position: 'absolute', top: '100%', right: '0', background: 'var(--bg-card)', 
                            border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 100, 
                            boxShadow: 'var(--shadow-md)', minWidth: '150px', padding: '5px 0', marginTop: '5px',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            {id !== 'completed' && id !== 'later' && (
                                <div className="section-action-item" onClick={(e) => { e.stopPropagation(); handleCompleteSectionTasks(tasksFiltered, title); setOpenMenuSectionId(null); }}>Complete all</div>
                            )}
                            {id !== 'completed' && id !== 'later' && (
                                <div className="section-action-item" onClick={(e) => { e.stopPropagation(); handleMoveForward(tasksFiltered, id); setOpenMenuSectionId(null); }}>Move forward</div>
                            )}
                            {id === 'later' && (
                                <div className="section-action-item" onClick={(e) => { e.stopPropagation(); handleCompleteSectionTasks(tasksFiltered, title); setOpenMenuSectionId(null); }}>Complete all</div>
                            )}
                            <div className="section-action-item" onClick={(e) => { e.stopPropagation(); handleDeleteSectionTasks(tasksFiltered, title); setOpenMenuSectionId(null); }} style={{ color: 'var(--color-danger)' }}>Delete all</div>
                        </div>
                    )}
                </div>
            </div>
        );
    };


    // Unused variables removed
    // useEffect(() => {
    //     const handler = (e) => {
    //         if (openRef.current && !openRef.current.contains(e.target)) {
    //             setOpen(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handler);
    //     return () => {
    //         document.removeEventListener('mousedown', handler);
    //     }
    // },[]);

    // useEffect(() => {
    //     const handler = (e) => {
    //         if (openRef.current && !openRef.current.contains(e.target)) {
    //             setOpen(false);
    //         }
    //     };

    //     document.addEventListener('mousedown', handler);
    //     return () => document.removeEventListener('mousedown', handler);
    // }, []);


    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setCurrentTime(Date.now());
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);
    const sortedTasks = useMemo(() => {
        return [...tasks]
            .filter(task => (task.boardId || 'main') === activeBoardId)
            .sort((a, b) => {
            const dateA = dayjs(a.completionDate);
            const dateB = dayjs(b.completionDate);
            if (dateA.isSame(dateB, 'day')) {
                const timeA = a.time || '';
                const timeB = b.time || '';
                if (timeA === timeB) return 0;
                return timeA.localeCompare(timeB)
            }
            return dateA - dateB;
        });
    }, [tasks, activeBoardId]);

    const { missedFiltered, todayFiltered, tomorrowFiltered, onThisWeekFiltered, onNextWeekFiltered, laterFiltered, completedFiltered } = useMemo(() => {
        const FILTERS = getFilters();
        const now = dayjs();
        return {
            missedFiltered: sortedTasks.filter(task => dayjs(task.completionDate).isBefore(now, 'day') && !task.completed),
            todayFiltered: sortedTasks.filter(task => dayjs(task.completionDate).isSame(now, 'day') && !task.completed),
            tomorrowFiltered: sortedTasks.filter(task => dayjs(task.completionDate).isSame(FILTERS.tomorrow, 'day') && !task.completed),
            onThisWeekFiltered: sortedTasks.filter(task =>
                dayjs(task.completionDate).isAfter(now.add(1, 'day'), 'day') &&
                dayjs(task.completionDate).isSameOrBefore(FILTERS['on-this-week'], 'day') && !task.completed
            ),
            onNextWeekFiltered: sortedTasks.filter(task =>
                !dayjs(task.completionDate).isSame(now.add(1, 'day'), 'day') &&
                dayjs(task.completionDate).isAfter(FILTERS['on-this-week'], 'day') &&
                dayjs(task.completionDate).isSameOrBefore(FILTERS['on-next-week'], 'day') && !task.completed
            ),
            laterFiltered: sortedTasks.filter(task =>
                dayjs(task.completionDate).isAfter(FILTERS['on-next-week'], 'day') && !task.completed
            ),
            completedFiltered: sortedTasks.filter(task => task.completed)
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortedTasks, currentTime]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const task = tasks.find(t => t.id === draggableId);
        if (!task) return;

        let newCompletionDate = task.completionDate;
        let newCompleted = task.completed; // Default to current completion status

        const today = dayjs(); // Use consistent reference time

        // Handle dragging into or out of "Completed"
        if (destination.droppableId === 'completed') {
            newCompleted = true;
        } else {
            newCompleted = false;
        }

        switch (destination.droppableId) {
            case 'today':
                newCompletionDate = today.toISOString();
                break;
            case 'tomorrow':
                newCompletionDate = today.add(1, 'day').toISOString();
                break;
            case 'on-this-week':
                // Logic to ensure it lands in "this week" but not today/tomorrow if possible, or just default to end of week
                // For simplicity, let's pick the last day of this week (isoWeek) or just the current date if it already fits the filter, 
                // but the filter logic in ListOfSections implies specific buckets.
                // The 'on-this-week' filter checks: !today, !tomorrow, <= endOfIsoWeek.
                // So settng to endOfIsoWeek is safe.
                newCompletionDate = today.endOf('isoWeek').toISOString();
                break;
            case 'on-next-week':
                // Filter: > endOfThisWeek && <= endOfNextWeek
                newCompletionDate = today.add(1, 'week').startOf('isoWeek').toISOString();
                break;
            case 'later':
                // Filter: > endOfNextWeek
                newCompletionDate = today.add(2, 'week').startOf('isoWeek').toISOString();
                break;
            case 'missed':
                newCompletionDate = today.subtract(1, 'day').toISOString();
                break;
            case 'completed':
                // Keep original date or update? Start with keeping original date, just mark completed.
                break;
            default:
                break;
        }

        dispatch(updateTask({
            taskId: task.id,
            completionDate: newCompletionDate,
            completed: newCompleted
        }));
    };

    const handleMoveForward = (sectionTasks, currentSectionId) => {
        if (sectionTasks.length === 0) return;
        const today = dayjs();
        let newDate;
        switch (currentSectionId) {
            case 'missed':
                newDate = today.toISOString();
                break;
            case 'today':
                newDate = today.add(1, 'day').toISOString();
                break;
            case 'tomorrow':
                newDate = today.endOf('isoWeek').toISOString();
                break;
            case 'on-this-week':
                newDate = today.add(1, 'week').startOf('isoWeek').toISOString();
                break;
            case 'on-next-week':
                newDate = today.add(2, 'week').startOf('isoWeek').toISOString();
                break;
            default:
                return;
        }

        if (window.confirm(`Are you sure you want to move all tasks forward?`)) {
            sectionTasks.forEach(task => {
                dispatch(updateTask({
                    taskId: task.id,
                    completionDate: newDate,
                    completed: false
                }));
            });
        }
    };

    const handleCompleteSectionTasks = (sectionTasks, sectionName) => {
        if (sectionTasks.length === 0) return;
        if (window.confirm(`Are you sure you want to complete all tasks in ${sectionName}?`)) {
            sectionTasks.forEach(task => {
                dispatch(updateTask({
                    taskId: task.id,
                    completed: true
                }));
            });
        }
    };

    const handleDeleteSectionTasks = (sectionTasks, sectionName) => {
        if (sectionTasks.length === 0) return;
        if (window.confirm(`Are you sure you want to delete all tasks in ${sectionName}? This action cannot be undone.`)) {
            sectionTasks.forEach(task => {
                dispatch(deleteTask({ taskId: task.id }));
            });
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="content list-of-sections-wrapper">
                <section className={`task-list list-of-sections-task-list ${sidebarView ? 'section open' : 'section close'}`}>
                    <div className="board-tabs">
                        {boards.map(board => (
                            <div 
                                key={board.id} 
                                className={`board-tab ${activeBoardId === board.id ? 'active' : ''}`}
                                onClick={() => dispatch(setActiveBoardId(board.id))}
                                onDoubleClick={() => handleRenameBoard(board.id, board.name)}
                                title="Double-click to rename"
                            >
                                <span>{board.name}</span>
                                {board.id !== 'main' && (
                                    <button 
                                        className="board-tab-btn-delete"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board.id); }}
                                        title="Delete board"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))}
                        {boards.length < (isAuthenticated ? 6 : 2) && (
                            <button 
                                className="board-tab-btn-add"
                                onClick={handleAddBoard}
                                title="Add new board"
                            >
                                +
                            </button>
                        )}
                    </div>

                    <div className='col-headers'>
                        <div className="col-drag"></div>
                        <div className="col-check"></div>
                        <div className='col-header col-task col-header-relative'>
                            Tasks
                            <ColumnResizer columnKey="taskName" currentWidthDvw={theme.columnWidths.taskName} minWidth={15} />
                        </div>
                        <div className='col-header col-due col-header-relative'>
                            Due date
                            <ColumnResizer columnKey="dueDate" currentWidthDvw={theme.columnWidths.dueDate} minWidth={8} />
                        </div>
                        <div className='col-header col-priority col-header-relative'>
                            Priority
                            <ColumnResizer columnKey="priority" currentWidthDvw={theme.columnWidths.priority} minWidth={5} />
                        </div>
                    </div>
                    {/* <section className='section'> */}
                    {missedFiltered && missedFiltered.length > 0 && (
                        <Droppable droppableId="missed">
                            {(provided) => (
                                <ul
                                    className='section__field'
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {renderSectionHeader('missed', 'Missed tasks', missedFiltered, 'missed', 'rgb(241, 81, 81)')}
                                    {expandedSections['missed'] && renderSectionItems(missedFiltered, 'missed')}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    )}
                    <Droppable droppableId="today">
                        {(provided) => (
                            <ul
                                className='section__field'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {renderSectionHeader('today', `Today (${dayjs().format('dddd')})`, todayFiltered, 'today')}
                                {expandedSections['today'] && renderSectionItems(todayFiltered, 'today')}
                                {provided.placeholder}
                                <AddTask date="today" />
                            </ul>
                        )}
                    </Droppable>
                    <Droppable droppableId="tomorrow">
                        {(provided) => (
                            <ul
                                className='section__field'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {renderSectionHeader('tomorrow', `Tomorrow (${dayjs().add(1, 'day').format('dddd')})`, tomorrowFiltered, 'today')}
                                {expandedSections['tomorrow'] && renderSectionItems(tomorrowFiltered, 'tomorrow')}
                                {provided.placeholder}
                                <AddTask
                                    date="tomorrow"
                                />
                            </ul>
                        )}
                    </Droppable>
                    <Droppable droppableId="on-this-week">
                        {(provided) => (
                            <ul
                                className='section__field'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {renderSectionHeader('on-this-week', 'This week', onThisWeekFiltered, 'today')}
                                {expandedSections['on-this-week'] && renderSectionItems(onThisWeekFiltered, 'on-this-week')}
                                {provided.placeholder}
                                <AddTask
                                    date="on-this-week"
                                />
                            </ul>
                        )}
                    </Droppable>
                    <Droppable droppableId="on-next-week">
                        {(provided) => (
                            <ul
                                className='section__field'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {renderSectionHeader('on-next-week', 'Next week', onNextWeekFiltered, 'today')}
                                {expandedSections['on-next-week'] && renderSectionItems(onNextWeekFiltered, 'on-next-week')}
                                {provided.placeholder}
                                <AddTask
                                    date="on-next-week"
                                />
                            </ul>
                        )}
                    </Droppable>
                    <Droppable droppableId="later">
                        {(provided) => (
                            <ul
                                className='section__field'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {renderSectionHeader('later', 'Later', laterFiltered, 'today')}
                                {expandedSections['later'] && renderSectionItems(laterFiltered, 'later')}
                                {provided.placeholder}
                                <AddTask
                                    date="later"
                                />
                            </ul>
                        )}
                    </Droppable>
                    <Droppable droppableId="completed">
                        {(provided) => (
                            <ul
                                className='section__field completed'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {renderSectionHeader('completed', 'Completed', completedFiltered, 'today')}
                                {expandedSections['completed'] && renderSectionItems(completedFiltered, 'completed')}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>



                </section>
                
            </div>
            
            {/* Desktop Detail Panel */}
            {isDesktop && (
                <DetailPanel 
                    task={selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null} 
                    onClose={() => setSelectedTaskId(null)}
                    onSave={(updatedTask) => dispatch(updateTask(updatedTask))}
                    onDelete={() => {
                        if (selectedTaskId && window.confirm('Are you sure you want to delete this task?')) {
                            dispatch(deleteTask({ taskId: selectedTaskId }));
                            setSelectedTaskId(null);
                        }
                    }}
                />
            )}
            
            {selectedTaskId && !isDesktop && (
                <Description
                    task={tasks.find(t => t.id === selectedTaskId)}
                    setModal={() => setSelectedTaskId(null)}
                    setTaskName={() => {}}
                    setTaskPriority={() => {}}
                />
            )}
            
        </DragDropContext >
    );
};

export default ListOfSections;
