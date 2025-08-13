import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';

const DatePicker = ({ handleDateSelection, setShowDatePicker, currentDate }) => {
  const [previewDate, setPreviewDate] = useState(currentDate ? new Date(currentDate) : new Date());

  const handleDayClick = (day) => {
    // Set preview date without applying it yet
    setPreviewDate(day);
  };

  const handleSetDate = () => {
    // Apply the preview date when Set button is clicked
    handleDateSelection(previewDate);
    setShowDatePicker(false);
  };

  const handleCancel = () => {
    // Cancel and close without applying changes
    setShowDatePicker(false);
  };

  return (
    <div className="date-picker-container">
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