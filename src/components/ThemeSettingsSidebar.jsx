import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeColor, toggleSettingsOpen, resetTheme, setUserPicture, setHeaderBackgroundFit } from '../features/themeSlice';

const ThemeSettingsSidebar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.themeReducer);

  if (!theme.isSettingsOpen) return null;

  const handleColorChange = (e, key) => {
    dispatch(setThemeColor({ key, value: e.target.value }));
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

  return (
    <div className="v2-description-modal theme-modal-overlay">
      <div className="description__modal-content theme-modal-content">
        <div className="modal-drag-indicator"></div>
        <div className="modal-header">
          <h2>Theme Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="theme-settings-body">
          <div className="theme-color-row">
            <label htmlFor="sidebarBg">SIDEBAR</label>
            <div className="color-control">
              <input 
                id="sidebarBg"
                type="color" 
                className="color-picker"
                value={theme.colors.sidebarBg ?? '#699b69'} 
                onChange={(e) => handleColorChange(e, 'sidebarBg')} 
              />
              <span className="hex-value">{(theme.colors.sidebarBg ?? '#699b69').toUpperCase()}</span>
            </div>
          </div>

          <div className="theme-color-row">
            <label htmlFor="mainBg">BACKGROUND</label>
            <div className="color-control">
              <input 
                id="mainBg"
                type="color" 
                className="color-picker"
                value={theme.colors.mainBg ?? '#e7e2e2'} 
                onChange={(e) => handleColorChange(e, 'mainBg')} 
              />
              <span className="hex-value">{(theme.colors.mainBg ?? '#e7e2e2').toUpperCase()}</span>
            </div>
          </div>

          <div className="theme-color-row">
            <label htmlFor="headerBg">HEADER</label>
            <div className="color-control">
              <input 
                id="headerBg"
                type="color" 
                className="color-picker"
                value={theme.colors.headerBg ?? theme.colors.mainBg ?? '#e7e2e2'} 
                onChange={(e) => handleColorChange(e, 'headerBg')} 
              />
              <span className="hex-value">{(theme.colors.headerBg ?? theme.colors.mainBg ?? '#e7e2e2').toUpperCase()}</span>
            </div>
          </div>

          <div className="theme-color-row">
            <label htmlFor="textColor">TEXT</label>
            <div className="color-control">
              <input 
                id="textColor"
                type="color" 
                className="color-picker"
                value={theme.colors.textColor ?? '#000000'} 
                onChange={(e) => handleColorChange(e, 'textColor')} 
              />
              <span className="hex-value">{(theme.colors.textColor ?? '#000000').toUpperCase()}</span>
            </div>
          </div>

          <div className="theme-color-row">
            <label htmlFor="cardBg">CARD BACKGROUND</label>
            <div className="color-control">
              <input 
                id="cardBg"
                type="color" 
                className="color-picker"
                value={theme.colors.cardBg ?? theme.colors.mainBg ?? '#ffffff'} 
                onChange={(e) => handleColorChange(e, 'cardBg')} 
              />
              <span className="hex-value">{(theme.colors.cardBg ?? theme.colors.mainBg ?? '#ffffff').toUpperCase()}</span>
            </div>
          </div>

          <div className="theme-color-row">
            <label htmlFor="sidebarText">SIDEBAR TEXT</label>
            <div className="color-control">
              <input 
                id="sidebarText"
                type="color" 
                className="color-picker"
                value={theme.colors.sidebarText ?? theme.colors.textColor ?? '#ffffff'} 
                onChange={(e) => handleColorChange(e, 'sidebarText')} 
              />
              <span className="hex-value">{(theme.colors.sidebarText ?? theme.colors.textColor ?? '#ffffff').toUpperCase()}</span>
            </div>
          </div>

          <div className="theme-color-row">
            <label htmlFor="cardText">CARD TEXT</label>
            <div className="color-control">
              <input 
                id="cardText"
                type="color" 
                className="color-picker"
                value={theme.colors.cardText ?? theme.colors.textColor ?? '#000000'} 
                onChange={(e) => handleColorChange(e, 'cardText')} 
              />
              <span className="hex-value">{(theme.colors.cardText ?? theme.colors.textColor ?? '#000000').toUpperCase()}</span>
            </div>
          </div>

          <div className="theme-color-row">
            <label htmlFor="boardText">BOARD TEXT</label>
            <div className="color-control">
              <input 
                id="boardText"
                type="color" 
                className="color-picker"
                value={theme.colors.boardText ?? theme.colors.textColor ?? '#000000'} 
                onChange={(e) => handleColorChange(e, 'boardText')} 
              />
              <span className="hex-value">{(theme.colors.boardText ?? theme.colors.textColor ?? '#000000').toUpperCase()}</span>
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

          <div className="modal-actions theme-actions">
            <button className="btn-delete" onClick={handleReset}>
              Reset
            </button>
            <button className="btn-save" onClick={onClose}>
              Save theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsSidebar;
