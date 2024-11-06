import { hexToHSL } from '../src/lib/colorConverter';

const hexColor = process.argv[2];

if (!hexColor) {
    console.error('Please provide a hex color value as an argument');
    process.exit(1);
}

try {
    const hslValue = hexToHSL(hexColor);
    console.log(hslValue);
} catch (error) {
    console.error('Invalid hex color value', error);
    process.exit(1);
} 