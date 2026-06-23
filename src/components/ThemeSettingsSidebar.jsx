import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeColor, toggleSettingsOpen, resetTheme, setUserPicture, setHeaderBackgroundFit, setPresetTheme } from '../features/themeSlice';

const ColorRow = ({ label, id, colorValue, defaultColor, onChange }) => {
  const [textValue, setTextValue] = useState((colorValue || defaultColor).toUpperCase());

  useEffect(() => {
    setTextValue((colorValue || defaultColor).toUpperCase());
  }, [colorValue, defaultColor]);

  const handleTextChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    
    if (/^[#a-fA-F0-9]*$/.test(val) && val.length <= 7) {
      setTextValue(val);
      if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
        onChange(val);
      }
    }
  };

  const handlePickerChange = (e) => {
    const val = e.target.value;
    setTextValue(val.toUpperCase());
    onChange(val);
  };

  const getPickerValue = () => {
    let val = colorValue || defaultColor;
    if (/^#([0-9A-F]{3})$/i.test(val)) {
      val = '#' + val[1]+val[1] + val[2]+val[2] + val[3]+val[3];
    }
    return val;
  };

  return (
    <div className="theme-color-row">
      <label htmlFor={id}>{label}</label>
      <div className="color-control">
        <input 
          id={id}
          type="color" 
          className="color-picker"
          value={getPickerValue()} 
          onChange={handlePickerChange} 
        />
        <input 
          type="text" 
          className="hex-value-input" 
          value={textValue} 
          onChange={handleTextChange} 
          style={{ width: '70px', border: '1px solid gray', background: 'transparent', color: 'inherit', padding: '2px 4px', borderRadius: '4px' }} 
        />
      </div>
    </div>
  );
};

const ThemeSettingsSidebar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.themeReducer);

  const modalRef = React.useRef(null);
  
  // Swipe down to close functionality
  const [startY, setStartY] = React.useState(null);
  const [currentY, setCurrentY] = React.useState(null);

  const [localColors, setLocalColors] = React.useState(theme.colors);

  React.useEffect(() => {
    if (theme.isSettingsOpen) {
      setLocalColors(theme.colors);
    }
  }, [theme.isSettingsOpen, theme.colors]);

  if (!theme.isSettingsOpen) return null;

  const handleColorChange = (e, key) => {
    setLocalColors(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = () => {
    Object.keys(localColors).forEach(key => {
      dispatch(setThemeColor({ key, value: localColors[key] }));
    });
    // If they manually customize the theme, switch off any preset!
    dispatch(setPresetTheme('default'));
    dispatch(toggleSettingsOpen(false));
  };

  const handleReset = () => {
    dispatch(resetTheme());
  };

  const onClose = () => dispatch(toggleSettingsOpen(false));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert("Image is too large. Please select an image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setUserPicture(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTouchStart = (e) => {
    if (modalRef.current && modalRef.current.scrollTop <= 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === null) return;
    const y = e.touches[0].clientY;
    const deltaY = y - startY;
    
    if (deltaY > 0) {
      setCurrentY(deltaY);
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(${deltaY}px)`;
        modalRef.current.style.transition = 'none';
      }
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      onClose();
    } else {
      if (modalRef.current) {
        modalRef.current.style.transform = '';
        modalRef.current.style.transition = 'transform 0.3s ease-out';
      }
    }
    setStartY(null);
    setCurrentY(null);
  };

  return ReactDOM.createPortal(
    <div className="v2-description-modal theme-modal-overlay">
      <div 
        ref={modalRef} 
        className="description__modal-content theme-modal-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="modal-drag-indicator"
        ></div>
        <div 
          className="modal-header"
        >
          <h2>Theme Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="theme-settings-body">
          <ColorRow 
            label="SIDEBAR" 
            id="sidebarBg" 
            colorValue={localColors.sidebarBg} 
            defaultColor="#699B69" 
            onChange={(val) => handleColorChange({target: {value: val}}, 'sidebarBg')} 
          />

          <ColorRow 
            label="BACKGROUND" 
            id="mainBg" 
            colorValue={localColors.mainBg} 
            defaultColor="#E7E2E2" 
            onChange={(val) => handleColorChange({target: {value: val}}, 'mainBg')} 
          />

          <ColorRow 
            label="HEADER" 
            id="headerBg" 
            colorValue={localColors.headerBg} 
            defaultColor={localColors.mainBg || "#E7E2E2"} 
            onChange={(val) => handleColorChange({target: {value: val}}, 'headerBg')} 
          />

          <ColorRow 
            label="TEXT" 
            id="textColor" 
            colorValue={localColors.textColor} 
            defaultColor="#000000" 
            onChange={(val) => handleColorChange({target: {value: val}}, 'textColor')} 
          />

          <ColorRow 
            label="CARD BACKGROUND" 
            id="cardBg" 
            colorValue={localColors.cardBg} 
            defaultColor={localColors.mainBg || "#FFFFFF"} 
            onChange={(val) => handleColorChange({target: {value: val}}, 'cardBg')} 
          />

          <ColorRow 
            label="SIDEBAR TEXT" 
            id="sidebarText" 
            colorValue={localColors.sidebarText} 
            defaultColor={localColors.textColor || "#000000"} 
            onChange={(val) => handleColorChange({target: {value: val}}, 'sidebarText')} 
          />

          <ColorRow 
            label="CARD TEXT" 
            id="cardText" 
            colorValue={localColors.cardText} 
            defaultColor={localColors.textColor || "#000000"} 
            onChange={(val) => handleColorChange({target: {value: val}}, 'cardText')} 
          />

          <ColorRow 
            label="BOARD TEXT" 
            id="boardText" 
            colorValue={localColors.boardText} 
            defaultColor={localColors.textColor || "#000000"} 
            onChange={(val) => handleColorChange({target: {value: val}}, 'boardText')} 
          />

          <div className="theme-upload-group">
            <label>Header banner image</label>
            <div className="upload-box" onClick={() => document.getElementById('userPictureUpload').click()}>
              <input 
                id="userPictureUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <span>Tap to upload (max 1MB)</span>
              </div>
            </div>
            {theme.userPicture && (
              <button 
                className="btn-remove-image"
                onClick={() => {
                  dispatch(setUserPicture(null));
                  document.getElementById('userPictureUpload').value = '';
                }}
              >
                Remove Image
              </button>
            )}
          </div>

          <div className="theme-upload-group" style={{ marginTop: '15px' }}>
            <label>Header Image Fit</label>
            <select 
              className="select-sleek full-width"
              value={theme.headerBackgroundFit || 'cover'} 
              onChange={(e) => dispatch(setHeaderBackgroundFit(e.target.value))}
            >
              <option value="cover">Cover (Crop to fill)</option>
              <option value="contain">Contain (Fit entirely)</option>
              <option value="100% 100%">Fill (Stretch)</option>
              <option value="auto">Auto (Original Size)</option>
            </select>
          </div>

          <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn-delete" style={{ flex: 1 }} onClick={handleReset}>
              Reset Defaults
            </button><button 
              style={{ flex: 1, padding: '10px', backgroundColor: '#699b69', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={handleSave}
            >
              Save Theme
            </button>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ThemeSettingsSidebar;
