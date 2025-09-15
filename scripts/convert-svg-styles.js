#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color to class mapping (matching type A SVGs)
const colorToClass = {
  '#231f20': 'b', // black
  '#f0f': 'c', // magenta
  '#FF00FF': 'c', // magenta (alternative)
  '#8dc63f': 'd', // green
  '#be1e2d': 'e', // red
  '#BE1E2D': 'e', // red (alternative)
  '#f9ed32': 'f', // yellow
  '#F9ED32': 'f', // yellow (alternative)
  '#39b54a': 'g', // green2
  '#39B54A': 'g', // green2 (alternative)
  '#c69c6d': 'h', // brown
  '#C69C6D': 'h', // brown (alternative)
  '#fbb040': 'i', // orange
  '#FBB040': 'i', // orange (alternative)
};

function convertSvg(filePath) {
  let svgContent = fs.readFileSync(filePath, 'utf8');

  // Add style definitions if not present
  if (!svgContent.includes('<style>')) {
    const styleBlock = `<defs><style>.b{fill:#231f20;}.c{fill:#f0f;}.d{fill:#8dc63f;}.e{fill:#be1e2d;}.f{fill:#f9ed32;}.g{fill:#39b54a;}.h{fill:#c69c6d;}.i{fill:#fbb040;}</style></defs>`;
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

// Process all type B SVG files
const svgDir = path.join(__dirname, '..', 'public', 'svg');
const typeBFiles = [
  'zudo-block-40-ACR-B.svg',
  'zudo-block-40-3DP-B.svg',
  'zudo-block-60-ACR-B.svg',
  'zudo-block-60-3DP-B.svg',
];

typeBFiles.forEach((file) => {
  const filePath = path.join(svgDir, file);
  if (fs.existsSync(filePath)) {
    convertSvg(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
  }
});
