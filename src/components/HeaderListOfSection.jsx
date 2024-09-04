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
                    <h2 className='header__board-sections-task-name'>Tasks</h2>
                    <h2 className='header__board-sections-due-date'>Due date</h2>
                    <h2 className='header__board-sections-priority'>Priority</h2>
                </section>
            </header>
    </div>
  )
}

export default HeaderListOfSection