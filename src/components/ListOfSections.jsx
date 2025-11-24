import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Section from './Section';
import AddTask from './AddTask';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import FILTERS from '../list-view/filters';
import HeaderListOfSection from './HeaderListOfSection';
import { updateTask } from '../features/taskSlice';


dayjs.extend(isSameOrBefore);

const ListOfSections = ({ sidebarView }) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.taskReducer.tasks || []);
    const [missedTasks, setMissedTasks] = useState(false);




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

        let newDate = dayjs().toISOString();
        let isCompleted = false;

        switch (destination.droppableId) {
            case 'today':
                newDate = dayjs().toISOString();
                break;
            case 'tomorrow':
                newDate = dayjs().add(1, 'day').toISOString();
                break;
            case 'on-this-week':
                newDate = dayjs().endOf('week').isoWeekday(7).toISOString();
                break;
            case 'on-next-week':
                newDate = dayjs().add(1, 'week').isoWeekday(7).toISOString();
                break;
            case 'later':
                newDate = dayjs().add(3, 'week').startOf('week').toISOString();
                break;
            case 'completed':
                isCompleted = true;
                newDate = dayjs().toISOString(); // Or keep existing date?
                break;
            default:
                newDate = dayjs().toISOString();
        }

        dispatch(updateTask({
            taskId: draggableId,
            completionDate: newDate,
            completed: isCompleted
        }));
    };


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                {/* <HeaderListOfSection/> */}
                <section className={sidebarView ? 'section' : 'section-without-sidebar'}>
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
                        <Droppable droppableId="missed">
                            {(provided) => (
                                <ul
                                    className='section__field'
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className='section__field-header'>
                                        <h3 style={{ color: 'crimson' }}>Missed tasks</h3>
                                    </div>
                                    <div className='section__line-top'></div>
                                    {sortedTasks
                                        .filter(task => dayjs(task.completionDate).isBefore(dayjs(), 'day') && !task.completed)
                                        .map((task, index) => (
                                            <Section
                                                key={task.id}
                                                task={task}
                                                index={index}
                                                checked={false}
                                            />
                                        ))}
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
                                        !dayjs(task.completionDate).isSameOrBefore(FILTERS.today) &&
                                        !dayjs(task.completionDate).isSame(FILTERS.tomorrow) &&
                                        dayjs(task.completionDate).isSameOrBefore(FILTERS['on-this-week'])
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
                                        !dayjs(task.completionDate).isSame(FILTERS.tomorrow) &&
                                        dayjs(task.completionDate).isAfter(FILTERS['on-this-week'])
                                        && dayjs(task.completionDate).isSameOrBefore(FILTERS['on-next-week'])
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
                                        dayjs(task.completionDate).isAfter(FILTERS['on-next-week']) && !task.completed)
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
                    <Droppable droppableId="completed">
                        {(provided) => (
                            <ul
                                className='section__field completed'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h3>Completed</h3>
                                <div className='section__line-top'></div>
                                {sortedTasks
                                    .filter(task => task.completed).map((task, index) => (
                                        <Section
                                            key={task.id}
                                            task={task}
                                            index={index}
                                            checked={true}
                                        />
                                    ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>


                </section>
                {/* </section> */}
            </div>
        </DragDropContext>
    );
};

export default ListOfSections;
