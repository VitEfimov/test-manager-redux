// import React, {useState} from 'react';
// import { DayPicker } from 'react-day-picker';
// import LocalizedFormat from 'dayjs/plugin/localizedFormat';
// import dayjs from 'dayjs';
// import 'react-day-picker/dist/style.css';

// dayjs.extend(LocalizedFormat);

// const DatePicker = ({ handleDateSelection, setShowDatePicker }) => {
//   const [selected, setSelected] = useState(null);

//   const handleDayClick = (day) => {
//     setSelected(day);
//     handleDateSelection(day);
//     setShowDatePicker(false); 
//   };

//   const handleMonthChange = (newMonth) => {
//     setSelected(newMonth);
//     setShowDatePicker(true); 
//   };

//   return (
//     <div>
//       <DayPicker
//         className='date__picker'
//         selected={selected}
//         onDayClick={handleDayClick}
//         onMonthChange={handleMonthChange}
//         fromYear={2024}
//         toYear={2090}
//         mode='single'
//       />
//     </div>
//   );
// };

// export default DatePicker;

// import React, {useState} from 'react';
// import { DayPicker } from 'react-day-picker';
// import LocalizedFormat from 'dayjs/plugin/localizedFormat';
// import dayjs from 'dayjs';
// import 'react-day-picker/dist/style.css';

// dayjs.extend(LocalizedFormat);

// const DatePicker = ({ handleDateSelection, setShowDatePicker }) => {

  
//   const [selected, setSelected] = useState(null);

//   const handleDayClick = (day) => {
//     setSelected(day);
//     handleDateSelection(day);
//     setShowDatePicker(false); 
//   };

//   const handleMonthChange = (newMonth) => {
//     setSelected(newMonth);
//     setShowDatePicker(true); 
//   };

//   return (
//     <div>
//       <DayPicker
//         className='date__picker'
//         selected={selected}
//         onDayClick={handleDayClick}
//         onMonthChange={handleMonthChange}
//         fromYear={2024}
//         toYear={2090}
//         mode='single'
//       />
//     </div>
//   );
// };

// export default DatePicker;

import React, {useState} from 'react';
import { DayPicker } from 'react-day-picker';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import 'react-day-picker/dist/style.css';



dayjs.extend(LocalizedFormat);

const DatePicker = ({ handleDateSelection, setShowDatePicker }) => {

  
  const [selected, setSelected] = useState(dayjs().startOf('day'));

  const handleDayClick = (day) => {
    setSelected(day);
    handleDateSelection(day);
    setShowDatePicker(false); 
  };

  const handleMonthChange = (newMonth) => {
    setSelected(newMonth);
    // setShowDatePicker(true); 
  };

  return (
    <div>
      <DayPicker
        className='date__picker'
        selected={selected}
        onDayClick={handleDayClick}
        onMonthChange={handleMonthChange}
        fromYear={2024}
        toYear={2090}
        mode='single'
        showOutsideDays={true}
        // modifiers={
        //   {selected: 'my-selected-date',
        //     today: 'today-date'
        //   }
        // }
      />
    </div>
  );
};

export default DatePicker;

// ///////////////////////////



// import React, { useState } from 'react';
// import { DayPicker } from 'react-day-picker';
// import LocalizedFormat from 'dayjs/plugin/localizedFormat';
// import dayjs from 'dayjs';
// import 'react-day-picker/dist/style.css';

// dayjs.extend(LocalizedFormat);

// const DatePicker = ({ handleDateSelection, setShowDatePicker }) => {
//   const [selected, setSelected] = useState(dayjs().startOf('day'));

//   const handleDayClick = (day) => {
//     // Convert the selected day and clicked day to comparable formats
//     const newSelectedDay = dayjs(day).startOf('day');
//     const currentSelectedDay = dayjs(selected).startOf('day');

//     // Only change selection if the clicked day is different
//     if (!newSelectedDay.isSame(currentSelectedDay)) {
//       setSelected(newSelectedDay);
//       handleDateSelection(newSelectedDay.toDate()); 
//       setShowDatePicker(false); // Pass the selected day to parent
//     }

//     // Close the modal whether the day changes or not
//     setShowDatePicker(false); 
//   };

//   return (
//     <div>
//       <DayPicker
//         className='date__picker'
//         selected={selected.toDate()} // Pass the selected date as a JS Date object
//         onDayClick={handleDayClick}
//         fromYear={2024}
//         toYear={2090}
//         mode='single'
//         showOutsideDays={true}
//       />
//     </div>
//   );
// };

// export default DatePicker;