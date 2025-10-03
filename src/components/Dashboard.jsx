import React from 'react'
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import FILTERS from '../list-view/filters';
const Dashboard = () => {

    const tasks = useSelector(state => state.taskReducer.tasks || []);

    // const todayTasks = tasks.filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day') && !task.completed);
    // // const weekTasks = tasks.filter(task => dayjs(task.completionDate).isAfter(dayjs().endOf('week')) &&
    // const thisWeekTasks = tasks.filter(task => dayjs(task.completionDate).isAfter(dayjs(), 'day') &&
    //                                     dayjs(task.completionDate).isSameOrBefore(dayjs().endOf('week')) && !task.completed);
    // const nextWeekTasks = tasks.filter(task => dayjs(task.completionDate).isAfter(dayjs().endOf('week')) && !task.completed)
    // const laterTasks = tasks.filter(task => dayjs(task.completionDate).isAfter(dayjs().endOf('week')) && !task.completed)
    // const missedTasks = tasks.filter(task => dayjs(task.completionDate).isBefore(dayjs(), 'day') && !task.completed);


    const todayTasks = tasks.filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day') && !task.completed);
    // const weekTasks = tasks.filter(task => dayjs(task.completionDate).isAfter(dayjs().endOf('week')) &&
    const tomorrowTasks = tasks.filter(task => dayjs(task.completionDate).isSame(FILTERS.tomorrow, 'day')
                            && !task.completed)

    const thisWeekTasks = tasks.filter(task =>
                            !dayjs(task.completionDate).isSameOrBefore(FILTERS.today) &&
                            !dayjs(task.completionDate).isSame(FILTERS.tomorrow) &&
                            dayjs(task.completionDate).isSameOrBefore(FILTERS['on-this-week'])
                            && !task.completed
                        )
    const nextWeekTasks = tasks.filter(task =>
                            !dayjs(task.completionDate).isSame(FILTERS.tomorrow) &&
                            dayjs(task.completionDate).isAfter(FILTERS['on-this-week'])
                            && dayjs(task.completionDate).isSameOrBefore(FILTERS['on-next-week'])
                            && !task.completed)
    const laterTasks = tasks.filter(task =>
                            dayjs(task.completionDate).isAfter(FILTERS['on-next-week']) && !task.completed)
    const missedTasks = tasks.filter(task => dayjs(task.completionDate).isBefore(dayjs(), 'day') && !task.completed);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;


    

    return (
        <section className='section'>
            <section className='dashboard-component'>
                <section className='dashboard__section'>
                    <h2>Today date</h2>
                    <div>{dayjs().format('MMMM D, YYYY')}</div>
                </section>
                {/* <section className='dashboard__section'>
                    <h2>Total tasks</h2>
                    <div>{totalTasks - completedTasks}</div>
                </section> */}
                <section className='dashboard__section'>
                    <h2>Total tasks</h2>
                     {missedTasks.length !== 0 ? (
                        
                        <div style={{ color: 'crimson' }}>{totalTasks - completedTasks}</div>
                    ) : (
                        <div>{missedTasks.length}</div>
                    )}
                </section>
                <section className='dashboard__section'>
                    <h2>Completed tasks</h2>
                    <div>{completedTasks}</div>
                </section>
                <section className='dashboard__section'>
                    <h2>Today tasks</h2>
                    <div>{todayTasks.length}</div>
                </section>
                <section className='dashboard__section'>
                    <h2>Tommorrow tasks</h2>
                    <div>{tomorrowTasks.length}</div>
                </section>
                <section className='dashboard__section'>
                    <h2>This week tasks</h2>
                    <div>{thisWeekTasks.length}</div>
                </section>
                <section className='dashboard__section'>
                    <h2>Next week tasks</h2>
                    <div>{nextWeekTasks.length}</div>
                </section>
                <section className='dashboard__section'>
                    <h2>Later tasks</h2>
                    <div>{laterTasks.length}</div>
                </section>
                <section className='dashboard__section'>
                    <h2>Missed tasks</h2>
                    {missedTasks.length !== 0 ? (
                        <div style={{ color: 'crimson' }}>{missedTasks.length}</div>
                    ) : (
                        <div>{missedTasks.length}</div>
                    )}
                </section>
            </section>
        </section>
    )
}


export default Dashboard