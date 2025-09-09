import React, { useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useClickOutside } from '../custom-hooks/ClickOut';
import dayjs from 'dayjs';

const DatePicker = ({ handleDateSelection, setShowDatePicker, currentDate }) => {
  const [previewDate, setPreviewDate] = useState(currentDate ? new Date(currentDate) : new Date());

  const handleDayClick = (day) => {
    setPreviewDate(day);
  };

  const handleSetDate = () => {
    handleDateSelection(previewDate);
    
    setShowDatePicker(false);
  };

  const handleCancel = () => {
    setShowDatePicker(false);
    // setShowDatePicker(!setShowDatePicker);
    console.log("Cancel clicked!");
  };

  const dayPickerRef = useRef(null)

  useClickOutside(dayPickerRef, () => setShowDatePicker(false))

  return (
    <div ref={dayPickerRef} className="date-picker-container">
      <DayPicker
        className='date__picker'
        selected={previewDate}
        onDayClick={handleDayClick}
        fromYear={2024}
        toYear={2090}
        mode='single'
        showOutsideDays
      />
      <div className="date-picker-controls">
        <button 
          className="date-picker-set-btn" 
          onClick={handleSetDate}
        >
          Set
        </button>
        <button 
          className="date-picker-cancel-btn" 
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DatePicker;

