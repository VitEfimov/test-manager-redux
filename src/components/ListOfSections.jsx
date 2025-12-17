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


dayjs.extend(isSameOrBefore);

const ListOfSections = ({ sidebarView }) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.taskReducer.tasks || []);
    const [missedTasks, setMissedTasks] = useState(false);


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

        const today = dayjs(); // Use consistent reference time

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
            default:
                break;
        }

        dispatch(updateTask({
            taskId: task.id,
            completionDate: newCompletionDate
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
                            <h2 className='header__board-sections-task-name'>Tasks</h2>
                            <h2 className='header__board-sections-due-date'>Due date</h2>
                            <h2 className='header__board-sections-priority'>Priority</h2>
                        </section>
                    </header>
                    {/* <section className='section'> */}
                    {missedTasks && (
                        <ul className='section__field'>
                            <div className='section__field-header'>
                                {/* <input className='section_task-checkbox'
                                type="checkbox"
                              checked={task.completed}
                              onChange={handleCheckbox}
                            /> */}
                                <h3 style={{ color: 'rgb(241, 81, 81)' }}>Missed tasks</h3>

                            </div>
                            <div className='section__line-top'></div>
                            {sortedTasks
                                .filter(task => dayjs(task.completionDate).isBefore(dayjs(), 'day') && !task.completed)
                                .map((task, index) => (
                                    <Section
                                        key={task.id}
                                        task={task}
                                        checked={false}
                                        index={index}
                                    />
                                ))}
                        </ul>
                    )}
                    <Droppable droppableId="today">
                        {(provided) => (
                            <ul
                                className='section__field'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h3>Today</h3>
                                <div className='section__line-top'></div>
                                {sortedTasks
                                    .filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day') && !task.completed)
                                    .map((task, index) => (
                                        <Section key={task.id} task={task} index={index} />
                                    ))}
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
                                <h3>Tomorrow</h3>
                                <div className='section__line-top'></div>
                                {sortedTasks
                                    .filter(task => dayjs(task.completionDate).isSame(FILTERS.tomorrow, 'day')
                                        && !task.completed)
                                    .map((task, index) => (
                                        <Section key={task.id} task={task} index={index} />
                                    ))}
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
                                <h3>On this week</h3>
                                <div className='section__line-top'></div>
                                {sortedTasks
                                    .filter(task =>
                                        !dayjs(task.completionDate).isSame(dayjs(), 'day') &&
                                        !dayjs(task.completionDate).isSame(dayjs().add(1, 'day'), 'day') &&
                                        dayjs(task.completionDate).isSameOrBefore(FILTERS['on-this-week'], 'day')
                                        && !task.completed
                                    )
                                    .map((task, index) => (
                                        <Section
                                            key={task.id}
                                            task={task}
                                            index={index}
                                        />
                                    ))}
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
                                <h3>On next week</h3>
                                <div className='section__line-top'></div>
                                {sortedTasks
                                    .filter(task =>
                                        !dayjs(task.completionDate).isSame(dayjs().add(1, 'day'), 'day') &&
                                        dayjs(task.completionDate).isAfter(FILTERS['on-this-week'], 'day')
                                        && dayjs(task.completionDate).isSameOrBefore(FILTERS['on-next-week'], 'day')
                                        && !task.completed)
                                    .map((task, index) => (
                                        <Section
                                            key={task.id}
                                            task={task}
                                            index={index}
                                        />
                                    ))}
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
                                <h3>Later</h3>
                                <div className='section__line-top'></div>
                                {sortedTasks
                                    .filter(task =>
                                        dayjs(task.completionDate).isAfter(FILTERS['on-next-week'], 'day') && !task.completed)
                                    .map((task, index) => (
                                        <Section
                                            key={task.id}
                                            task={task}
                                            index={index}
                                        />
                                    ))}
                                {provided.placeholder}
                                <AddTask
                                    date="later"
                                />
                            </ul>
                        )}
                    </Droppable>
                    <ul className='section__field completed'>
                        <h3>Completed</h3>
                        <div className='section__line-top'></div>
                        {sortedTasks
                            .filter(task => task.completed).map(task => (
                                <Section
                                    key={task.id}
                                    task={task}
                                    checked={true}
                                />
                            ))}
                    </ul>



                </section>
                {/* </section> */}
            </div>
        </DragDropContext >
    );
};

export default ListOfSections;
