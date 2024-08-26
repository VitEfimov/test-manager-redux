import DatePicker from "react-datepicker";
import React, {useState} from 'react';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";

const ReactDatePicker = ({ handleDateSelection, setShowDatePicker }) => {
    const [selected, setSelected] = useState(null);

    const handleDayClick = (day) => {
      setSelected(day);
      handleDateSelection(day);
      setShowDatePicker(false); 
    };
  
    const handleMonthChange = (newMonth) => {
      setSelected(newMonth);
      setShowDatePicker(true); 
    };
  
    return (
      <div>
        <DatePicker
          className='date__picker'
          selected={selected}
          onDayClick={handleDayClick}
          onMonthChange={handleMonthChange}
          fromYear={2024}
          toYear={2090}
          mode='single'
        />
      </div>
    );
  };


export default ReactDatePicker