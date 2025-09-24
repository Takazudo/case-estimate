# Takazudo Modular: Panels

## GitHub Integration

When given a GitHub URL, use the `gh` command to fetch information:

- For issues: `gh issue view <URL>`
- For pull requests: `gh pr view <URL>`
- For PR comments: `gh api repos/{owner}/{repo}/pulls/{number}/comments`
- For general API access: `gh api <endpoint>`

## Reference Project

When implementing features or following patterns, refer to:

- **Path**: `/Users/takazudo/repos/personal/takazudomodular`
- Use this project as reference for:
  - Component structure and naming conventions
  - MDX configuration and usage patterns
  - Styling approaches with Tailwind CSS
  - Next.js app router patterns
  - TypeScript patterns and types

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
npm run typecheck # Run TypeScript type checking
npm run test     # Run all Playwright tests
npm run test:smoke # Run smoke tests only
npm run test:ui  # Run tests with UI mode
npm run test:debug # Debug tests interactively
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
│   │   ├── colors.ts               # Color definitions
│   │   └── rails.ts                # Rail options with pricing logic
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

## Testing

### Smoke Tests

The project includes Playwright smoke tests that ensure:

- Page loads without 404 or JavaScript errors
- Core UI elements are visible and functional
- Case model switching works correctly
- No console errors occur during usage

### CI/CD

GitHub Actions runs automatically on:

- Every push to `main` branch
- Every pull request targeting `main`

CI pipeline includes:

1. TypeScript type checking
2. ESLint code quality checks
3. Prettier format validation
4. Build process verification
5. Smoke tests with Playwright

Test results and screenshots are automatically uploaded as artifacts on failure.

## Development Notes

- SVG viewBox dimensions have been adjusted from original 2834x2834 to actual content size
- Panel layout uses absolute positioning with calculated gaps
- Colors are stored as hex values and applied via SVG fill property
- Configuration is saved in URL query parameters for easy sharing
