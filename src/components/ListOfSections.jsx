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
    const [expandedSections, setExpandedSections] = useState({});
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

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

    const limit = theme.defaultTaskLimit !== undefined ? theme.defaultTaskLimit : 10;

    const renderSectionItems = (tasksList, sectionId) => {
        const isExpanded = !!expandedSections[sectionId];
        const displayTasks = isExpanded ? tasksList : tasksList.slice(0, limit);
        return displayTasks.map((task, index) => (
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

    const renderExpandCollapseButton = (tasksList, sectionId) => {
        if (tasksList.length <= limit) return null;
        const isExpanded = !!expandedSections[sectionId];
        return (
            <div className="section__expand-collapse-container">
                <button 
                    type="button" 
                    className="section__expand-collapse-btn" 
                    onClick={() => toggleSection(sectionId)}
                >
                    {isExpanded ? (
                        <>
                            <span>View Less</span>
                            <i className="fa-solid fa-chevron-up"></i>
                        </>
                    ) : (
                        <>
                            <span>View All ({tasksList.length})</span>
                            <i className="fa-solid fa-chevron-down"></i>
                        </>
                    )}
                </button>
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
                                    <div className='section__field-header section-header section-header-no-padding' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className="section-title missed" style={{ color: 'rgb(241, 81, 81)' }}>Missed tasks</span>
                                            <select className="section-action-select" value="" onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'complete') handleCompleteSectionTasks(missedFiltered, 'Missed tasks');
                                                if (val === 'move-forward') handleMoveForward(missedFiltered, 'missed');
                                                if (val === 'delete') handleDeleteSectionTasks(missedFiltered, 'Missed tasks');
                                            }} title="Section Actions">
                                                <option value="" disabled hidden>▼</option>
                                                <option value="complete">Complete all</option>
                                                <option value="move-forward">Move forward</option>
                                                <option value="delete">Delete all</option>
                                            </select>
                                        </div>
                                        <span className="section-badge missed">{missedFiltered.length}</span>
                                    </div>

                                    {renderSectionItems(missedFiltered, 'missed')}
                                    {provided.placeholder}
                                    {renderExpandCollapseButton(missedFiltered, 'missed')}
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
                                <div className="section-header section-header-no-padding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="section-title today">Today ({dayjs().format('dddd')})</span>
                                        <select className="section-action-select" value="" onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'complete') handleCompleteSectionTasks(todayFiltered, 'Today');
                                            if (val === 'move-forward') handleMoveForward(todayFiltered, 'today');
                                            if (val === 'delete') handleDeleteSectionTasks(todayFiltered, 'Today');
                                        }} title="Section Actions">
                                            <option value="" disabled hidden>▼</option>
                                            <option value="complete">Complete all</option>
                                            <option value="move-forward">Move forward</option>
                                            <option value="delete">Delete all</option>
                                        </select>
                                    </div>
                                    <span className="section-badge today">{todayFiltered.length}</span>
                                </div>

                                {renderSectionItems(todayFiltered, 'today')}
                                {provided.placeholder}
                                {renderExpandCollapseButton(todayFiltered, 'today')}
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
                                <div className="section-header section-header-no-padding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="section-title today">Tomorrow ({dayjs().add(1, 'day').format('dddd')})</span>
                                        <select className="section-action-select" value="" onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'complete') handleCompleteSectionTasks(tomorrowFiltered, 'Tomorrow');
                                            if (val === 'move-forward') handleMoveForward(tomorrowFiltered, 'tomorrow');
                                            if (val === 'delete') handleDeleteSectionTasks(tomorrowFiltered, 'Tomorrow');
                                        }} title="Section Actions">
                                            <option value="" disabled hidden>▼</option>
                                            <option value="complete">Complete all</option>
                                            <option value="move-forward">Move forward</option>
                                            <option value="delete">Delete all</option>
                                        </select>
                                    </div>
                                    <span className="section-badge today">{tomorrowFiltered.length}</span>
                                </div>

                                {renderSectionItems(tomorrowFiltered, 'tomorrow')}
                                {provided.placeholder}
                                {renderExpandCollapseButton(tomorrowFiltered, 'tomorrow')}
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
                                <div className="section-header section-header-no-padding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="section-title today">This week</span>
                                        <select className="section-action-select" value="" onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'complete') handleCompleteSectionTasks(onThisWeekFiltered, 'On this week');
                                            if (val === 'move-forward') handleMoveForward(onThisWeekFiltered, 'on-this-week');
                                            if (val === 'delete') handleDeleteSectionTasks(onThisWeekFiltered, 'On this week');
                                        }} title="Section Actions">
                                            <option value="" disabled hidden>▼</option>
                                            <option value="complete">Complete all</option>
                                            <option value="move-forward">Move forward</option>
                                            <option value="delete">Delete all</option>
                                        </select>
                                    </div>
                                    <span className="section-badge today">{onThisWeekFiltered.length}</span>
                                </div>

                                {renderSectionItems(onThisWeekFiltered, 'on-this-week')}
                                {provided.placeholder}
                                {renderExpandCollapseButton(onThisWeekFiltered, 'on-this-week')}
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
                                <div className="section-header section-header-no-padding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="section-title today">Next week</span>
                                        <select className="section-action-select" value="" onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'complete') handleCompleteSectionTasks(onNextWeekFiltered, 'On next week');
                                            if (val === 'move-forward') handleMoveForward(onNextWeekFiltered, 'on-next-week');
                                            if (val === 'delete') handleDeleteSectionTasks(onNextWeekFiltered, 'On next week');
                                        }} title="Section Actions">
                                            <option value="" disabled hidden>▼</option>
                                            <option value="complete">Complete all</option>
                                            <option value="move-forward">Move forward</option>
                                            <option value="delete">Delete all</option>
                                        </select>
                                    </div>
                                    <span className="section-badge today">{onNextWeekFiltered.length}</span>
                                </div>

                                {renderSectionItems(onNextWeekFiltered, 'on-next-week')}
                                {provided.placeholder}
                                {renderExpandCollapseButton(onNextWeekFiltered, 'on-next-week')}
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
                                <div className="section-header section-header-no-padding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="section-title today">Later</span>
                                        <select className="section-action-select" value="" onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'complete') handleCompleteSectionTasks(laterFiltered, 'Later');
                                            if (val === 'delete') handleDeleteSectionTasks(laterFiltered, 'Later');
                                        }} title="Section Actions">
                                            <option value="" disabled hidden>▼</option>
                                            <option value="complete">Complete all</option>
                                            <option value="delete">Delete all</option>
                                        </select>
                                    </div>
                                    <span className="section-badge today">{laterFiltered.length}</span>
                                </div>

                                {renderSectionItems(laterFiltered, 'later')}
                                {provided.placeholder}
                                {renderExpandCollapseButton(laterFiltered, 'later')}
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
                                <div className="completed-section-header">
                                    <div className="section-header section-header-no-padding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className="section-title today">Completed</span>
                                            {completedFiltered.length > 0 && (
                                                <select className="section-action-select" value="" onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === 'delete') {
                                                        if(window.confirm('Are you sure you want to delete all completed tasks?')) {
                                                            completedFiltered.forEach(task => dispatch(deleteTask({ taskId: task.id })));
                                                        }
                                                    }
                                                }} title="Section Actions">
                                                    <option value="" disabled hidden>▼</option>
                                                    <option value="delete">Delete all</option>
                                                </select>
                                            )}
                                        </div>
                                        <span className="section-badge today">{completedFiltered.length}</span>
                                    </div>
                                </div>
                                {renderSectionItems(completedFiltered, 'completed')}
                                {provided.placeholder}
                                {renderExpandCollapseButton(completedFiltered, 'completed')}
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
