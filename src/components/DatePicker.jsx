import React, { useRef, useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useClickOutside } from '../custom-hooks/ClickOut';

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

  useEffect(() => {
    if (dayPickerRef.current) {
      const rect = dayPickerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      // If the datepicker goes below the visible screen area (60px buffer for bottom nav)
      if (rect.bottom > windowHeight - 60) {
        dayPickerRef.current.style.top = 'auto';
        dayPickerRef.current.style.bottom = '100%';
        dayPickerRef.current.style.marginBottom = '5px';
      }

      // If the datepicker goes beyond the right edge
      if (rect.right > windowWidth - 10) {
        dayPickerRef.current.style.right = '0';
        dayPickerRef.current.style.left = 'auto';
      }

      dayPickerRef.current.style.zIndex = '1000';
    }
  }, []);

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
        modifiersClassNames={{
          today: 'today-date',
          selected: 'my-selected'
        }}
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

