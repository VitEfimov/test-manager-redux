import React from 'react'

const HeaderListOfSection = () => {
  return (
    <div>
        <header className='header__board'>
                <div className='header__board-view'>
                    <button className="header__board-view-btn"><i className="fa-regular fa-rectangle-list"></i>List</button>
                    <button className="header__board-view-btn">Board</button>
                </div>
                <section className='header__board-sections'>
                    <div style={{gridColumn: 'span 2'}}></div>
                    <h2 className='header__board-sections-task-name'>TASKS</h2>
                    <h2 className='header__board-sections-due-date'>DUE DATE</h2>
                    <h2 className='header__board-sections-priority'>PRIORITY</h2>
                </section>
            </header>
    </div>
  )
}

export default HeaderListOfSection