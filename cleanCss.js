const fs = require('fs');

const cssContent = fs.readFileSync('src/App.css', 'utf-8');

// We want to extract V2 styles and generic classes, and throw away V1 legacy ones.
// V1 classes are mostly at the top up until line ~3500.
// Let's just output everything from line 1 to 52, AND anything containing .v2-layout, .global-loader, .spinner, .modal-, .btn-, .settings-, .theme-

const keepList = [
    '.global-loader', '.spinner', '.modal-', '.btn-', '.input-', '.settings-', '.theme-', '.form-group',
    '.color-picker', '.hex-value', '.upload-box', '.setting-row', '.toggle-switch', '.text-input-sleek', '.select-sleek',
    '.dashboard-v2', '.cat-card', '.progress-card', '.stat-card', '.cat-info', '.cat-icon', '.progress-svg',
    '.dashboard__header', '.dashboard__top-cards', '.dashboard__categories'
];

let finalCss = '';

// Get lines 1-52 as global CSS
const lines = cssContent.split('\n');
for (let i = 0; i < 52; i++) {
    finalCss += lines[i] + '\n';
}

// Now parse the rest of the file block by block
let currentIndex = cssContent.indexOf('\n', cssContent.split('\n').slice(0, 52).join('\n').length);

function extractBlocks(text) {
    let blocks = [];
    let i = 0;
    while (i < text.length) {
        let braceStart = text.indexOf('{', i);
        if (braceStart === -1) break;
        
        // Find the start of the selector (backwards from braceStart until a '}' or start of string)
        let selectorStart = text.lastIndexOf('}', braceStart);
        if (selectorStart === -1) selectorStart = 0;
        else selectorStart += 1;

        // Skip comments between selectorStart and braceStart
        let selectorText = text.substring(selectorStart, braceStart).trim();

        // Find matching closing brace
        let braceDepth = 1;
        let braceEnd = braceStart + 1;
        while (braceDepth > 0 && braceEnd < text.length) {
            if (text[braceEnd] === '{') braceDepth++;
            if (text[braceEnd] === '}') braceDepth--;
            braceEnd++;
        }

        let fullBlock = text.substring(selectorStart, braceEnd);
        blocks.push({ selector: selectorText, content: fullBlock, start: selectorStart, end: braceEnd });
        i = braceEnd;
    }
    return blocks;
}

const blocks = extractBlocks(cssContent.substring(currentIndex));

for (const block of blocks) {
    const sel = block.selector;
    let shouldKeep = false;
    
    if (sel.includes('.v2-layout')) shouldKeep = true;
    else if (sel.startsWith('@media')) {
        // keep all media queries for now if they contain v2-layout or our keepList
        if (block.content.includes('.v2-layout') || keepList.some(k => block.content.includes(k))) {
            shouldKeep = true;
        }
    } else if (sel.startsWith('@keyframes')) {
        shouldKeep = true;
    } else if (keepList.some(k => sel.includes(k))) {
        shouldKeep = true;
    }
    
    if (shouldKeep) {
        // Strip .v2-layout
        let contentToKeep = block.content.replace(/\.v2-layout\s*/g, '');
        // Sometimes leaves dangling commas like `, .col-headers`
        contentToKeep = contentToKeep.replace(/,\s*\./g, ', .'); 
        finalCss += '\n' + contentToKeep + '\n';
    }
}

fs.writeFileSync('src/App.css', finalCss);
console.log('App.css successfully cleaned and v2-layout stripped!');
