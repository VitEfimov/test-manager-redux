import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setColumnWidth } from '../features/themeSlice';

const ColumnResizer = ({ columnKey, currentWidthDvw, minWidth = 5 }) => {
  const dispatch = useDispatch();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = currentWidthDvw;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - startX.current;
    const deltaDvw = (deltaX / window.innerWidth) * 100;
    
    let newWidth = startWidth.current + deltaDvw;
    
    // Limit min width
    if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    // Determine which CSS variable to update for live preview
    let cssVar = '';
    if (columnKey === 'taskName') cssVar = '--col-task-width';
    else if (columnKey === 'dueDate') cssVar = '--col-due-width';
    else if (columnKey === 'priority') cssVar = '--col-priority-width';

    if (cssVar) {
      document.documentElement.style.setProperty(cssVar, `${newWidth}dvw`);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const deltaX = e.clientX - startX.current;
    const deltaDvw = (deltaX / window.innerWidth) * 100;
    
    let newWidth = startWidth.current + deltaDvw;
    if (newWidth < minWidth) newWidth = minWidth;

    // Save to Redux on release
    dispatch(setColumnWidth({ key: columnKey, value: newWidth }));

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = '';
  };

  return (
    <div 
      className="column-resizer" 
      onMouseDown={handleMouseDown}
      style={{
        width: '10px',
        cursor: 'col-resize',
        height: '100%',
        position: 'absolute',
        right: '-5px',
        top: 0,
        zIndex: 10
      }}
    />
  );
};

export default ColumnResizer;
