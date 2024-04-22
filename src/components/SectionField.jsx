import React from 'react';
import Section from './Section';
import AddTask from './AddTask';
import dayjs from 'dayjs';

const DateSection = ({ date, tasks }) => {
    return (
        <ul className='section__field'>
            <h3>{date}</h3>
            <div className='section__line-top'></div>
            {tasks.map(task => (
                <Section key={task.id} task={task} />
            ))}
            <AddTask date={date} />
        </ul>
    );
};

export default DateSection;
