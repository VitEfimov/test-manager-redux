import React from 'react'
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
const Dashboard = () => {

    const tasks = useSelector(state => state.taskReducer.tasks || []);

    const todayTasks = tasks.filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day'));
    const weekTasks = tasks.filter(task => dayjs(task.completionDate).isSameOrBefore(dayjs().endOf('week')));
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
        <section className='dashboard__section'>
            <h2>Total tasks</h2> 
            <div>{totalTasks}</div>
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
            <h2>Week tasks</h2>
            <div>{weekTasks.length}</div>

        </section>
        <section className='dashboard__section'>
            <h2>Missed tasks</h2>
            {missedTasks.length !== 0 ? (
                <div style={{ color: 'crimson' }}>{missedTasks.length}</div>
            ): (
                <div>{missedTasks.length}</div>
            )}
        </section>
    </section>
    </section>
    )
}


export default Dashboard