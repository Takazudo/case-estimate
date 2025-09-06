# Takazudo Modular Case Estimate App

## Project Overview

An interactive web application for customizing Takazudo Modular synthesizer cases. Users can select different case models, customize panel colors, choose rail types, and see real-time price estimates.

## Tech Stack

- React 19 with Vite
- TypeScript
- Tailwind CSS 4
- SVG panel components

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run typecheck # Run TypeScript type checking (if applicable)
```

## Code Style Guidelines

### File Naming Convention

All TypeScript and JavaScript files should use **kebab-case** naming:

- ✅ Good: `all-in-one-svg.tsx`, `case-selector.tsx`, `panel-list.tsx`
- ❌ Bad: `AllInOneSVG.tsx`, `CaseSelector.tsx`, `PanelList.tsx`

This applies to:

- Component files (`.tsx`, `.jsx`)
- TypeScript/JavaScript modules (`.ts`, `.js`)
- Test files (`.test.ts`, `.spec.ts`)

Note: The exported component names should still use PascalCase as per React conventions:

```tsx
// File: case-selector.tsx
export default function CaseSelector() { ... }
```

## Features

- 4 case models: Zudo Block 40/60 (acrylic and 3D printed "Lite" versions)
- Interactive panel selection with color customization
- Rail type selection (Lite, Dual, Metal) with pricing
- URL persistence for sharing configurations
- Presets for 3D printed models

## Project Structure

```
case-estimate/
├── src/
│   ├── app.tsx                      # Main application component
│   ├── components/
│   │   ├── all-in-one-svg.tsx      # All-in-one SVG visualization
│   │   ├── case-selector.tsx       # Case model dropdown
│   │   ├── color-picker.tsx        # Color selection
│   │   ├── panel-list.tsx          # Panel list with selection
│   │   └── rail-selector.tsx       # Rail type selection
│   ├── data/
│   │   ├── cases.ts                # Case configurations
│   │   └── colors.ts               # Color definitions
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   └── main.tsx                    # Application entry point
├── public/
│   └── svg/                        # Case SVG diagrams
│       ├── zudo-block-40.svg
│       ├── zudo-block-40-lite.svg
│       ├── zudo-block-60.svg
│       └── zudo-block-60-lite.svg
└── __inbox/                        # Temporary files and references
```

## Known Issues

- Side panel SVGs need viewBox adjustment for proper rendering
- Some panels may appear stretched or distorted

## AI File Conversion

The project includes scripts to convert Adobe Illustrator files to SVG:

- `convert-ai-to-svg.py` - Python script using AppleScript (macOS only)
- `convert-ai-to-svg.jsx` - ExtendScript for Adobe Illustrator

Usage:

```bash
./convert-ai-to-svg.py /path/to/ai/files -o /path/to/output
```

## Development Notes

- SVG viewBox dimensions have been adjusted from original 2834x2834 to actual content size
- Panel layout uses absolute positioning with calculated gaps
- Colors are stored as hex values and applied via SVG fill property
- Configuration is saved in URL query parameters for easy sharing
