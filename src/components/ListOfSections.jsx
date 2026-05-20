import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Section from './Section';
import AddTask from './AddTask';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import FILTERS from '../list-view/filters';
import HeaderListOfSection from './HeaderListOfSection';
import Sidebar from './Sidebar';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { updateTask } from '../features/taskSlice';
import ColumnResizer from './ColumnResizer';


dayjs.extend(isSameOrBefore);

const ListOfSections = ({ sidebarView }) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.taskReducer.tasks || []);
    const theme = useSelector(state => state.themeReducer);
    const [missedTasks, setMissedTasks] = useState(false);

    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
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
                            <span>Show Less</span>
                            <i className="fa-solid fa-chevron-up"></i>
                        </>
                    ) : (
                        <>
                            <span>Show All ({tasksList.length})</span>
                            <i className="fa-solid fa-chevron-down"></i>
                        </>
                    )}
                </button>
            </div>
        );
    };


    const [open, setOpen] = useState(false);
    let openRef = useRef();

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


    const handleMissedTasks = () => {
        if (sortedTasks.filter(task => dayjs(task.completionDate).isBefore(dayjs(), 'day') && !task.completed).length > 0) {
            console.log('missed tasks')
            setMissedTasks(true);
        } else {
            setMissedTasks(false);

        }
    };

    useEffect(() => {
        handleMissedTasks();
    }, [tasks]);



    const sortedTasks = [...tasks].sort((a, b) => {
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

    const missedFiltered = sortedTasks.filter(task => dayjs(task.completionDate).isBefore(dayjs(), 'day') && !task.completed);
    const todayFiltered = sortedTasks.filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day') && !task.completed);
    const tomorrowFiltered = sortedTasks.filter(task => dayjs(task.completionDate).isSame(FILTERS.tomorrow, 'day') && !task.completed);
    const onThisWeekFiltered = sortedTasks.filter(task =>
        dayjs(task.completionDate).isAfter(dayjs().add(1, 'day'), 'day') &&
        dayjs(task.completionDate).isSameOrBefore(FILTERS['on-this-week'], 'day')
        && !task.completed
    );
    const onNextWeekFiltered = sortedTasks.filter(task =>
        !dayjs(task.completionDate).isSame(dayjs().add(1, 'day'), 'day') &&
        dayjs(task.completionDate).isAfter(FILTERS['on-this-week'], 'day')
        && dayjs(task.completionDate).isSameOrBefore(FILTERS['on-next-week'], 'day')
        && !task.completed
    );
    const laterFiltered = sortedTasks.filter(task =>
        dayjs(task.completionDate).isAfter(FILTERS['on-next-week'], 'day') && !task.completed
    );
    const completedFiltered = sortedTasks.filter(task => task.completed);

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


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                {/* <HeaderListOfSection/> */}
                {/* <section className={sidebarView ? 'section' : 'section-without-sidebar'}> */}

                {/* <Sidebar
            /> */}
                <section className={sidebarView ? 'section open' : 'section close'}>

                    <header className='header__board'>
                        <div className='header__board-view'>
                            <button className="header__board-view-btn"><i className="fa-regular fa-rectangle-list"></i>List</button>
                            <button className="header__board-view-btn">Board</button>
                        </div>
                        <section className='header__board-sections'>
                            <h2 className='header__board-sections-task-name' style={{ position: 'relative' }}>
                                Tasks
                                <ColumnResizer columnKey="taskName" currentWidthDvw={theme.columnWidths.taskName} minWidth={15} />
                            </h2>
                            <h2 className='header__board-sections-due-date' style={{ position: 'relative' }}>
                                Due date
                                <ColumnResizer columnKey="dueDate" currentWidthDvw={theme.columnWidths.dueDate} minWidth={8} />
                            </h2>
                            <h2 className='header__board-sections-priority' style={{ position: 'relative' }}>
                                Priority
                                <ColumnResizer columnKey="priority" currentWidthDvw={theme.columnWidths.priority} minWidth={5} />
                            </h2>
                        </section>
                    </header>
                    {/* <section className='section'> */}
                    {missedTasks && (
                        <Droppable droppableId="missed">
                            {(provided) => (
                                <ul
                                    className='section__field'
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className='section__field-header'>
                                        {/* <input className='section_task-checkbox'
                                type="checkbox"
                                checked={task.completed}
                                onChange={handleCheckbox}
                            /> */}
                                        <h3 style={{ color: 'rgb(241, 81, 81)' }}>Missed tasks</h3>

                                    </div>
                                    <div className='section__line-top'></div>
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
                                <h3>Today ({dayjs().format('dddd')})</h3>
                                <div className='section__line-top'></div>
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
                                <h3>Tomorrow ({dayjs().add(1, 'day').format('dddd')})</h3>
                                <div className='section__line-top'></div>
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
                                <h3>On this week</h3>
                                <div className='section__line-top'></div>
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
                                <h3>On next week</h3>
                                <div className='section__line-top'></div>
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
                                <h3>Later</h3>
                                <div className='section__line-top'></div>
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
                                <h3>Completed</h3>
                                <div className='section__line-top'></div>
                                {renderSectionItems(completedFiltered, 'completed')}
                                {provided.placeholder}
                                {renderExpandCollapseButton(completedFiltered, 'completed')}
                            </ul>
                        )}
                    </Droppable>



                </section>
                {/* </section> */}
            </div>
        </DragDropContext >
    );
};

export default ListOfSections;
