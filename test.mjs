import { themeFromSourceColor, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

const matTheme = themeFromSourceColor(argbFromHex('#4F7D4F'));
console.log(Object.keys(matTheme.schemes.light.toJSON()));
