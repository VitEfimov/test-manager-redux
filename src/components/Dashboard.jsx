import React from 'react'
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import getFilters from '../list-view/filters';
import { MdNotifications } from "react-icons/md";
import '../styles/Dashboard.css';

dayjs.extend(isSameOrBefore);
const Dashboard = () => {

    const tasks = useSelector(state => state.taskReducer.tasks || []);

    const todayTasks = tasks.filter(task => dayjs(task.completionDate).isSame(dayjs(), 'day') && !task.completed);
    const FILTERS = getFilters();
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


    

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const currentFill = Math.max(0, Math.min(100, 100 - completionPercentage)); // strokeDashoffset for circle

  return (
    <section className='section dashboard-v2'>
      <div className="dashboard__header-wrapper">
        <div className="dashboard__header">
          <div className="dashboard__header-title">
            <div className="date">{dayjs().format('dddd, MMMM D')}</div>
            <h1>Dashboard</h1>
          </div>
          <button className="btn-notification" aria-label="Notifications">
            <MdNotifications />
          </button>
        </div>

        <div className="dashboard__top-cards">
          <div className="dash-card progress-card">
            <div className="progress-circle-container">
              <svg viewBox="0 0 100 100" className="progress-svg">
                <circle cx="50" cy="50" r="40" className="circle-track" />
                <circle 
                  cx="50" cy="50" r="40" 
                  className="circle-progress" 
                  style={{ strokeDashoffset: 251.2 - (251.2 * currentFill) / 100 }} 
                />
              </svg>
              <div className="progress-text-inner">
                <span className="percent">{completionPercentage}%</span>
                <span className="label">complete</span>
              </div>
            </div>
            <div className="progress-info">
              <h3>{completionPercentage === 100 ? 'Perfect!' : completionPercentage >= 50 ? 'Great progress!' : 'Keep going!'}</h3>
              <p>{completedTasks} of {totalTasks} tasks<br/>completed today</p>
              <div className="tags">
                {missedTasks.length > 0 && <span className="tag missed">{missedTasks.length} missed</span>}
                {todayTasks.length > 0 && <span className="tag today">{todayTasks.length} today</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__categories">
        <h4 className="categories-title">ALL CATEGORIES</h4>
        <div className="categories-grid">
          <div className="cat-card border-green">
            <div className="cat-icon color-green">📚</div>
            <div className="cat-info">
              <span className="cat-title">Total tasks</span>
              <span className="cat-sub">all tasks</span>
            </div>
            <span className="cat-num color-green">{totalTasks}</span>
          </div>

          <div className="cat-card border-green">
            <div className="cat-icon color-green">✅</div>
            <div className="cat-info">
              <span className="cat-title">Completed</span>
              <span className="cat-sub">done</span>
            </div>
            <span className="cat-num color-green">{completedTasks}</span>
          </div>

          <div className="cat-card border-yellow">
            <div className="cat-icon color-yellow">☀️</div>
            <div className="cat-info">
              <span className="cat-title">Today</span>
              <span className="cat-sub">due today</span>
            </div>
            <span className="cat-num color-yellow">{todayTasks.length}</span>
          </div>

          <div className="cat-card border-blue">
            <div className="cat-icon color-blue">📅</div>
            <div className="cat-info">
              <span className="cat-title">Tomorrow</span>
              <span className="cat-sub">coming up</span>
            </div>
            <span className="cat-num color-blue">{tomorrowTasks.length}</span>
          </div>

          <div className="cat-card border-purple">
            <div className="cat-icon color-purple">📈</div>
            <div className="cat-info">
              <span className="cat-title">This week</span>
              <span className="cat-sub">this week</span>
            </div>
            <span className="cat-num color-purple">{thisWeekTasks.length}</span>
          </div>

          <div className="cat-card border-teal">
            <div className="cat-icon color-teal">🕒</div>
            <div className="cat-info">
              <span className="cat-title">Next week</span>
              <span className="cat-sub">next week</span>
            </div>
            <span className="cat-num color-teal">{nextWeekTasks.length}</span>
          </div>

          <div className="cat-card border-brown">
            <div className="cat-icon color-brown">⭐</div>
            <div className="cat-info">
              <span className="cat-title">Later</span>
              <span className="cat-sub">future</span>
            </div>
            <span className="cat-num color-brown">{laterTasks.length}</span>
          </div>

          <div className="cat-card border-red">
            <div className="cat-icon color-red">❗</div>
            <div className="cat-info">
              <span className="cat-title">Missed</span>
              <span className="cat-sub">overdue</span>
            </div>
            <span className="cat-num color-red">{missedTasks.length}</span>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Dashboard