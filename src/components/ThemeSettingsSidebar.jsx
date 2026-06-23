import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeColor, setSourceColor, toggleSettingsOpen, resetTheme, setUserPicture, setHeaderBackgroundFit, setPresetTheme } from '../features/themeSlice';



const ThemeSettingsSidebar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.themeReducer);

  const modalRef = React.useRef(null);
  
  // Swipe down to close functionality
  const [startY, setStartY] = React.useState(null);
  const [currentY, setCurrentY] = React.useState(null);

  if (!theme.isSettingsOpen) return null;

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
          <div className="theme-color-section" style={{ padding: '0 20px', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Material You Theme</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Choose a source color and we'll generate a complete, accessible theme palette for you automatically.
            </p>
            
            <div className="theme-presets" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              {[
                { name: 'Forest', hex: '#4F7D4F' },
                { name: 'Ocean', hex: '#4F6FAE' },
                { name: 'Amethyst', hex: '#7953C2' },
                { name: 'Sunflower', hex: '#E4C938' }
              ].map(preset => (
                <div 
                  key={preset.name}
                  onClick={() => {
                    dispatch(setSourceColor(preset.hex));
                    dispatch(setPresetTheme('default'));
                  }}
                  style={{
                    width: '45px', height: '45px', borderRadius: '50%', 
                    backgroundColor: preset.hex, cursor: 'pointer',
                    border: (theme.sourceColor || '#4F7D4F').toUpperCase() === preset.hex.toUpperCase() 
                      ? '3px solid var(--text-primary)' 
                      : '2px solid transparent',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s'
                  }}
                  title={preset.name}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
            
            <div className="custom-color-picker" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '30px' }}>
              <label style={{ fontWeight: 'bold' }}>Custom Color: </label>
              <input 
                type="color" 
                value={theme.sourceColor || '#4F7D4F'} 
                onChange={(e) => {
                  dispatch(setSourceColor(e.target.value));
                  dispatch(setPresetTheme('default'));
                }}
                style={{ cursor: 'pointer', width: '50px', height: '50px', padding: '0', border: 'none', borderRadius: '8px', background: 'transparent' }}
              />
              <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', backgroundColor: 'var(--bg-main)', padding: '5px 10px', borderRadius: '4px' }}>
                {(theme.sourceColor || '#4F7D4F').toUpperCase()}
              </span>
            </div>
          </div>

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
            </button>
            <button 
              style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-primary)', color: 'var(--text-inverse)', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ThemeSettingsSidebar;
