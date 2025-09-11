#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color to class mapping for x2 models (12 panels)
// Based on the actual SVG colors found
const colorToClass = {
  '#231f20': 'a', // black - side1
  '#f0f': 'b', // magenta - side2
  '#9e005d': 'c', // dark magenta - side3
  '#00a99d': 'd', // teal - side4
  '#fbb040': 'e', // orange - back1
  '#be1e2d': 'f', // red - back2
  '#ff7bac': 'g', // pink - bottom1
  '#ed1e79': 'h', // hot pink - bottom2
  '#8dc63f': 'i', // green - bottom3
  '#39b54a': 'j', // green2 - bottom4
  '#f9ed32': 'k', // yellow - front1
  '#c69c6d': 'l', // brown - front2
};

function convertSvg(filePath) {
  let svgContent = fs.readFileSync(filePath, 'utf8');

  // Add style definitions if not present
  if (!svgContent.includes('<style>')) {
    const styleBlock = `<defs><style>.a{fill:#231f20;}.b{fill:#f0f;}.c{fill:#9e005d;}.d{fill:#00a99d;}.e{fill:#fbb040;}.f{fill:#be1e2d;}.g{fill:#ff7bac;}.h{fill:#ed1e79;}.i{fill:#8dc63f;}.j{fill:#39b54a;}.k{fill:#f9ed32;}.l{fill:#c69c6d;}</style></defs>`;
    svgContent = svgContent.replace(/<svg[^>]*>/, (match) => match + styleBlock);
  }

  // Replace inline styles with classes
  Object.entries(colorToClass).forEach(([color, className]) => {
    // Replace style="fill:COLOR;" or style="fill:COLOR" with class="CLASS"
    const regex = new RegExp(`style="fill:${color.replace('#', '#?')};?"`, 'gi');
    svgContent = svgContent.replace(regex, `class="${className}"`);
  });

  // Save the converted file
  fs.writeFileSync(filePath, svgContent);
}

// Process all x2 SVG files
const svgDir = path.join(__dirname, '..', 'public', 'svg');
const x2Files = [
  'zudo-block-40x2-type-a.svg',
  'zudo-block-40x2-type-b.svg',
  'zudo-block-40x2-lite-type-a.svg',
  'zudo-block-40x2-lite-type-b.svg',
  'zudo-block-60x2-type-a.svg',
  'zudo-block-60x2-type-b.svg',
  'zudo-block-60x2-lite-type-a.svg',
  'zudo-block-60x2-lite-type-b.svg',
];

x2Files.forEach((file) => {
  const filePath = path.join(svgDir, file);
  if (fs.existsSync(filePath)) {
    convertSvg(filePath);
    console.error(`Converted ${file}`);
  } else {
    console.error(`File not found: ${filePath}`);
  }
});
