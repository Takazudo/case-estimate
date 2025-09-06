# Takazudo Modular Case Estimate App

## Project Overview
An interactive web application for customizing Takazudo Modular synthesizer cases. Users can select different case models, customize panel colors, choose rail types, and see real-time price estimates.

## Tech Stack
- React 19 with Vite
- Tailwind CSS 4
- SVG panel components

## Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
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
│   ├── App.jsx                  # Main application component
│   ├── components/
│   │   ├── CaseSelector.jsx     # Case model dropdown
│   │   ├── PanelLayout.jsx      # 2D panel visualization
│   │   ├── PanelSVG.jsx         # SVG panel components
│   │   ├── ColorPicker.jsx      # Color selection
│   │   ├── PanelList.jsx        # Panel list with selection
│   │   └── RailSelector.jsx     # Rail type selection
│   ├── data/
│   │   ├── cases.js             # Case configurations
│   │   └── colors.js            # Color definitions
│   └── assets/
│       └── panels/              # Original SVG files
└── svg/                         # Converted SVG files from AI
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