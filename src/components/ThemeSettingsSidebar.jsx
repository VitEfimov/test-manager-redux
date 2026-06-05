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
    <div className="theme-settings-sidebar">
      <div className="theme-settings-header">
        <h3>Theme Settings</h3>
        <button className="theme-settings-close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="theme-settings-body">
        <div className="theme-settings-group">
          <label htmlFor="sidebarBg">Sidebar Background</label>
          <input 
            id="sidebarBg"
            type="color" 
            value={theme.colors.sidebarBg ?? '#699b69'} 
            onChange={(e) => handleColorChange(e, 'sidebarBg')} 
          />
        </div>

        <div className="theme-settings-group">
          <label htmlFor="mainBg">Main Background</label>
          <input 
            id="mainBg"
            type="color" 
            value={theme.colors.mainBg ?? '#e7e2e2'} 
            onChange={(e) => handleColorChange(e, 'mainBg')} 
          />
        </div>

        <div className="theme-settings-group">
          <label htmlFor="headerBg">Header Background</label>
          <input 
            id="headerBg"
            type="color" 
            value={theme.colors.headerBg ?? theme.colors.mainBg ?? '#e7e2e2'} 
            onChange={(e) => handleColorChange(e, 'headerBg')} 
          />
        </div>

        <div className="theme-settings-group">
          <label htmlFor="textColor">Text Color</label>
          <input 
            id="textColor"
            type="color" 
            value={theme.colors.textColor ?? '#000000'} 
            onChange={(e) => handleColorChange(e, 'textColor')} 
          />
        </div>

        <div className="theme-settings-group">
          <label htmlFor="userPictureUpload">Header Banner (Max 1MB)</label>
          <input 
            id="userPictureUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ 
              width: '100%', 
              padding: '5px 0',
              color: 'inherit',
              fontSize: '0.85em'
            }}
          />
          {theme.userPicture && (
            <button 
              onClick={() => {
                dispatch(setUserPicture(null));
                document.getElementById('userPictureUpload').value = '';
              }}
              style={{
                marginTop: '10px',
                padding: '5px',
                width: '100%',
                cursor: 'pointer',
                backgroundColor: 'rgba(241, 81, 81, 0.2)',
                border: '1px solid rgba(241, 81, 81, 0.5)',
                color: 'inherit',
                borderRadius: '4px'
              }}
            >
              Remove Image
            </button>
          )}
        </div>

        <div className="theme-settings-group">
          <label htmlFor="headerBackgroundFit">Header Image Fit</label>
          <select 
            id="headerBackgroundFit" 
            value={theme.headerBackgroundFit || 'cover'} 
            onChange={(e) => dispatch(setHeaderBackgroundFit(e.target.value))}
          >
            <option value="cover">Cover (Crop to fill)</option>
            <option value="contain">Contain (Fit entirely)</option>
            <option value="100% 100%">Fill (Stretch)</option>
            <option value="auto">Auto (Original Size)</option>
          </select>
        </div>



        <div className="theme-settings-footer">
          <button className="settings__save-btn" onClick={handleReset} style={{ width: '100%', marginTop: '20px' }}>
            Reset to Default
          </button>
          {/* <button className="settings__save-btn" onClick={handleReset} style={{ width: '100%', marginTop: '20px' }}>
            Save
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsSidebar;
