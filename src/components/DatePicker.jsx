// import React from 'react';
// import {DayPicker} from 'react-day-picker';
// import LocalizedFormat from 'dayjs/plugin/localizedFormat';
// import dayjs from 'dayjs';
// import 'react-day-picker/dist/style.css';
// dayjs.extend(LocalizedFormat)

// const DatePicker = ({ handleDateSelection, setShowDatePicker, selectedDate }) => {

//     const [selected, setSelected] = React.useState(selectedDate)


//     // const handleDayClick = (day) => {
//     //   setSelected(day);
//     //   handleDateSelection(day);
//     //   // setShowDatePicker(false);
//     // };
//     const handleDayClick = (day) => {
//       console.log('day',day);
//       console.log('selected',selected);
// const formattedDay = dayjs(day).format('MMMM D, YYYY');
// const formattedSelected = dayjs(selected).format('MMMM D, YYYY');
// console.log('formattedDay',formattedDay);
// console.log(day==selected);
// console.log(formattedDay===formattedSelected);
// // if (dayjs(day).isSame(selected, 'day')) {
// //   setShowDatePicker(false); 
// // }

//       if (formattedDay===formattedSelected) {
//         setSelected(day);
//           handleDateSelection(day);
//           setShowDatePicker(false); 
//       } else {
//           setSelected(day);
//           handleDateSelection(day);
//       }
//   };
  

//     const handleMonthChange = (newMonth) => {
//       setSelected(newMonth);
//     };

//   return (
//     <DayPicker
//     className='date__picker'
//     onDayClick={handleDayClick}
//     // onMonthChange={handleMonthChange}
//     onSelect={setSelected}
//     fromYear={2024}
//     toYear={2090}
//     mode='single'
//     defaultMonth={selected}
//     modifiersClassNames={{
//         selected: 'my-selected',
//         today: 'my-today'
//       }}
//       modifiersStyles={{
//         disabled: { fontSize: '75%' }
//       }}
// />
//   )
// }

// export default DatePicker





import React from 'react';
import {DayPicker} from 'react-day-picker';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import 'react-day-picker/dist/style.css';
dayjs.extend(LocalizedFormat)

const DatePicker = ({ handleDateSelection, setShowDatePicker }) => {

    const [selected, setSelected] = React.useState(null)

    // const handleDayClick = (day) => {
    //     setSelected(day);
    //     handleDateSelection(day);
    //     setShowDatePicker(false);
    //     console.log("handleDayClick + day",day);
    // };
    // const handleMonthChange = (newMonth) => {
    //   setSelected(newMonth);

    // };

    const handleDayClick = (day) => {
      setSelected(day);
      handleDateSelection(day);
      setShowDatePicker(false);
      console.log("handleDayClick + day", day);
    };
  
    const handleMonthChange = (newMonth) => {
      setShowDatePicker();
      setSelected(newMonth);
    };


  return (
    <DayPicker
    className='date__picker'
    onDayClick={handleDayClick}
    onMonthChange={handleMonthChange}
    onSelect={setSelected}
    fromYear={2024}
    toYear={2090}
    mode='single'
    // defaultMonth={selected}
    modifiersClassNames={{
        selected: 'my-selected',
        today: 'my-today'
      }}
      modifiersStyles={{
        disabled: { fontSize: '75%' }
      }}
/>
  )
}

export default DatePicker