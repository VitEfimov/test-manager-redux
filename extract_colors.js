const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const colorRegex = /:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[a-zA-Z]+)(?![a-zA-Z0-9_-])(?:[\s!]*)/g;

function findColors(dir) {
    const colors = new Set();
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findColors(fullPath).forEach(c => colors.add(c));
        } else if (fullPath.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Remove comments to avoid false positives
            const noComments = content.replace(/\/\*[\s\S]*?\*\//g, '');
            // Only look at lines that don't contain 'var('
            const lines = noComments.split('\n').filter(line => !line.includes('var('));
            
            for (const line of lines) {
                const match = line.match(/(color|background|background-color|border|border-color|border-top|border-bottom|border-left|border-right|box-shadow|text-shadow|fill|stroke)\s*:\s*([^;]+)/i);
                if (match) {
                    const value = match[2].trim();
                    // Extract colors from the value
                    const colorMatches = value.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|white|black|red|green|blue|gray|grey|yellow|orange|purple|transparent)/gi);
                    if (colorMatches) {
                        for (const c of colorMatches) {
                            colors.add(c.toLowerCase());
                        }
                    }
                }
            }
        }
    }
    return Array.from(colors);
}

const allColors = findColors(srcDir);
allColors.sort();
console.log(JSON.stringify(allColors, null, 2));
