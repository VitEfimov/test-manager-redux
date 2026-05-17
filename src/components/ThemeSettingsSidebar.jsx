import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeColor, setFontSize, toggleSettingsOpen, resetTheme } from '../features/themeSlice';

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

  const handleFontSizeChange = (e) => {
    dispatch(setFontSize(e.target.value));
  };

  return (
    <div className="theme-settings-sidebar">
      <div className="theme-settings-header">
        <h3>Theme Settings</h3>
        <button className="theme-settings-close-btn" onClick={onClose}>X</button>
      </div>

      <div className="theme-settings-body">
        <div className="theme-settings-group">
          <label>Sidebar Background</label>
          <input 
            type="color" 
            value={theme.colors.sidebarBg ?? '#699b69'} 
            onChange={(e) => handleColorChange(e, 'sidebarBg')} 
          />
        </div>

        <div className="theme-settings-group">
          <label>Main Background</label>
          <input 
            type="color" 
            value={theme.colors.mainBg ?? '#e7e2e2'} 
            onChange={(e) => handleColorChange(e, 'mainBg')} 
          />
        </div>

        <div className="theme-settings-group">
          <label>Header Background</label>
          <input 
            type="color" 
            value={theme.colors.headerBg ?? theme.colors.mainBg ?? '#e7e2e2'} 
            onChange={(e) => handleColorChange(e, 'headerBg')} 
          />
        </div>

        <div className="theme-settings-group">
          <label>Text Color</label>
          <input 
            type="color" 
            value={theme.colors.textColor ?? '#000000'} 
            onChange={(e) => handleColorChange(e, 'textColor')} 
          />
        </div>

        <div className="theme-settings-group">
          <label>Font Size</label>
          <select value={theme.fontSize} onChange={handleFontSizeChange}>
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="big">Big</option>
          </select>
        </div>

        <div className="theme-settings-footer">
          <button className="settings__save-btn" onClick={handleReset} style={{ width: '100%', marginTop: '20px' }}>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsSidebar;
