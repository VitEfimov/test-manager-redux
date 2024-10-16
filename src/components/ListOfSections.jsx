import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Section from './Section';
import AddTask from './AddTask';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import FILTERS from '../list-view/filters';
import HeaderListOfSection from './HeaderListOfSection';


dayjs.extend(isSameOrBefore);

const ListOfSections = ({sidebarView}) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.taskReducer.tasks || []);
    const [missedTasks, setMissedTasks] = useState(false);


    const [open, setOpen] = useState(false);
    let openRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!openRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mouthdown', handler);
        return () => {
            document.removeEventListener('mouthdown', handler);
        }
    });




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


    return (
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
                    <ul className='section__field'>
                        <div className='section__field-header'>
                            {/* <input className='section_task-checkbox'
                                type="checkbox"
                              checked={task.completed}
                              onChange={handleCheckbox}
                            /> */}
                            <h3 style={{ color: 'crimson' }}>Missed tasks</h3>
                            
                        </div>
                        <div className='section__line-top'></div>
                        {sortedTasks
                            .filter(task => dayjs(task.completionDate).isBefore(dayjs(), 'day') && !task.completed)
                            .map(task => (
                                <Section
                                    key={task.id}
                                    task={task}
                                    checked={false}
                                    />
                            ))}
                    </ul>
                )}
                <ul className='section__field'>
                    <h3>Today</h3>
                    <div className='section__line-top'></div>
                    {sortedTasks
                        .filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day') && !task.completed)
                        .map(task => (
                            <Section key={task.id} task={task} />
                        ))}
                    <AddTask date="today" />
                </ul>
                <ul className='section__field'>
                    <h3>Tomorrow</h3>
                    <div className='section__line-top'></div>
                    {sortedTasks
                        .filter(task => dayjs(task.completionDate).isSame(FILTERS.tomorrow, 'day')
                            && !task.completed)
                        .map(task => (
                            <Section key={task.id} task={task} />
                        ))}
                    <AddTask
                        date="tomorrow"
                    />
                </ul>
                <ul className='section__field'>
                    <h3>On this week</h3>
                    <div className='section__line-top'></div>
                    {sortedTasks
                        .filter(task =>
                            !dayjs(task.completionDate).isSameOrBefore(FILTERS.today) &&
                            !dayjs(task.completionDate).isSame(FILTERS.tomorrow) &&
                            dayjs(task.completionDate).isSameOrBefore(FILTERS['on-this-week'])
                            && !task.completed
                        )
                        .map(task => (
                            <Section
                                key={task.id}
                                task={task}
                            />
                        ))}
                    <AddTask
                        date="on-this-week"
                    />
                </ul>
                <ul className='section__field'>
                    <h3>On next week</h3>
                    <div className='section__line-top'></div>
                    {sortedTasks
                        .filter(task =>
                            !dayjs(task.completionDate).isSame(FILTERS.tomorrow) &&
                            dayjs(task.completionDate).isAfter(FILTERS['on-this-week'])
                            && dayjs(task.completionDate).isSameOrBefore(FILTERS['on-next-week'])
                            && !task.completed)
                        .map(task => (
                            <Section
                                key={task.id}
                                task={task}
                            />
                        ))}
                    <AddTask
                        date="on-next-week"
                    />
                </ul>
                <ul className='section__field'>
                    <h3>Later</h3>
                    <div className='section__line-top'></div>
                    {sortedTasks
                        .filter(task =>
                            dayjs(task.completionDate).isAfter(FILTERS['on-next-week']) && !task.completed)
                        .map(task => (
                            <Section
                                key={task.id}
                                task={task}
                            />
                        ))}
                    <AddTask
                        date="later"
                    />
                </ul>
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
    );
};

export default ListOfSections;
