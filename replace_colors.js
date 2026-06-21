const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const varMap = {
    '--dark-background-color-main': '--bg-main',
    '--dark-background-color-sidebar': '--bg-sidebar',
    '--dark-background-color-card': '--bg-card',
    '--dark-background-color-select': '--bg-hover',
    '--dark-button-hover-color': '--bg-hover',
    '--dark-font-color-white': '--text-primary',
    '--dark-font-color-grey': '--text-secondary',
    '--dark-font-color-black': '--text-inverse',
    '--dark-font-color-sidebar': '--text-primary',
    '--dark-font-color-card': '--text-primary',
    '--dark-font-color-board': '--text-primary',
    '--dark-btn-color': '--text-secondary',
};

const colorMap = {
    // Primary
    '#4a7a4a': 'var(--color-primary)',
    '#5a8a5a': 'var(--color-primary)',
    '#3a633a': 'var(--color-primary-hover)',
    '#eef3eb': 'var(--color-primary-light)',

    // Backgrounds
    '#f4f1ec': 'var(--bg-main)',
    '#f9f9f9': 'var(--bg-main)',
    '#fafafa': 'var(--bg-main)',
    '#f0f0f0': 'var(--bg-main)',
    '#ffffff': 'var(--bg-card)',
    '#fff': 'var(--bg-card)',
    'white': 'var(--bg-card)', /* Need to be careful with white/black */
    '#eee': 'var(--bg-secondary)',
    '#e0e0e0': 'var(--bg-secondary)',
    '#f4ecf8': 'var(--bg-secondary)',

    // Texts
    '#333': 'var(--text-primary)',
    '#2c2c2c': 'var(--text-primary)',
    '#444': 'var(--text-primary)',
    '#555': 'var(--text-primary)',
    '#666': 'var(--text-secondary)',
    '#888': 'var(--text-secondary)',
    '#999': 'var(--text-secondary)',
    'grey': 'var(--text-secondary)',
    '#000': 'var(--text-inverse)', /* In dark mode, #000 should usually be inverted */
    'black': 'var(--text-inverse)',

    // Borders
    '#ccc': 'var(--border-color)',
    '#cccccc': 'var(--border-color)',
    '#ddd': 'var(--border-color)',
    '#dcdcdc': 'var(--border-color-light)',

    // Alerts
    '#e74c3c': 'var(--color-danger)',
    '#ff4d4f': 'var(--color-danger)',
    'red': 'var(--color-danger)',
    'rgb(241, 81, 81)': 'var(--color-danger)',
    '#27ae60': 'var(--color-success)',

    // Shadows
    '0 4px 15px rgba(0, 0, 0, 0.05)': 'var(--shadow-sm)',
    '0 4px 15px rgba(0, 0, 0, 0.1)': 'var(--shadow-md)',
    '0 10px 30px rgba(0, 0, 0, 0.1)': 'var(--shadow-md)',
    '0 4px 15px rgba(74, 122, 74, 0.2)': 'var(--shadow-sm)',
    '0 4px 15px rgba(74, 122, 74, 0.3)': 'var(--shadow-md)'
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceColorsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // First, replace old CSS variables
    for (const [oldVar, newVar] of Object.entries(varMap)) {
        const regex = new RegExp(escapeRegExp(oldVar), 'g');
        content = content.replace(regex, newVar);
    }

    // Next, replace specific shadow declarations first (longer matches)
    const shadowKeys = Object.keys(colorMap).filter(k => k.startsWith('0 '));
    for (const key of shadowKeys) {
        const regex = new RegExp(escapeRegExp(key), 'gi');
        content = content.replace(regex, colorMap[key]);
    }

    // Replace color hexes and keywords safely
    // Look for: color: #fff; background: white; etc.
    const properties = [
        'color', 'background-color', 'background', 'border', 'border-color', 
        'border-top', 'border-bottom', 'border-left', 'border-right', 'fill', 'stroke'
    ];

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        // Skip :root declarations to not mess up our definitions
        if (filePath.endsWith('App.css') && i < 100) continue; 

        let line = lines[i];
        
        for (const prop of properties) {
            // Check if the line has this property
            const regexProp = new RegExp(`(${prop}\\s*:.*?;)`, 'i');
            if (regexProp.test(line)) {
                // Now replace colors inside the value
                const otherKeys = Object.keys(colorMap).filter(k => !k.startsWith('0 '));
                for (const key of otherKeys) {
                    // Make sure we only match whole words for keywords like white, red, black, grey
                    let regexStr;
                    if (['white', 'black', 'red', 'grey'].includes(key)) {
                        regexStr = `\\b${key}\\b`;
                    } else {
                        regexStr = escapeRegExp(key) + '(?![a-zA-Z0-9])'; // Don't match #ccc inside #cccccc
                    }
                    
                    const regex = new RegExp(regexStr, 'gi');
                    
                    // Special safety for white/black: only replace if not already inside a var() or something weird
                    if (line.includes('var(') && (key === 'white' || key === 'black')) {
                        continue;
                    }

                    // Special safety for color: white vs background: white
                    if (key === 'white') {
                        if (prop === 'color' || prop === 'fill') {
                            line = line.replace(regex, 'var(--text-inverse)');
                        } else {
                            line = line.replace(regex, 'var(--bg-card)');
                        }
                    } else if (key === '#fff' || key === '#ffffff') {
                        if (prop === 'color' || prop === 'fill') {
                            line = line.replace(regex, 'var(--text-inverse)');
                        } else {
                            line = line.replace(regex, 'var(--bg-card)');
                        }
                    } else if (key === 'black' || key === '#000') {
                        if (prop === 'color' || prop === 'fill') {
                            line = line.replace(regex, 'var(--text-primary)');
                        } else {
                            line = line.replace(regex, 'var(--text-inverse)');
                        }
                    } else {
                        line = line.replace(regex, colorMap[key]);
                    }
                }
            }
        }
        lines[i] = line;
    }

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.css')) {
            console.log(`Processing ${fullPath}...`);
            replaceColorsInFile(fullPath);
        }
    }
}

processDirectory(srcDir);
console.log('Done!');
