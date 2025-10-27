# Takazudo Modular: Panels

## Deployment

### Production URLs

- **Main Application**: https://panels.takazudomodular.com/
  - Deploys from `main` branch
  - Interactive configurator for case customization
- **Documentation**: https://panels.takazudomodular.com/doc/
  - Deploys from `/doc/` directory (Docusaurus)
  - Technical documentation and guides

### URL Mapping

When given a URL like `https://panels.takazudomodular.com/path` or `https://panels.takazudomodular.com/doc/path`, check the corresponding local files:

- `https://panels.takazudomodular.com/` → Root of the project (Vite app)
- `https://panels.takazudomodular.com/doc/` → `/doc/` directory (Docusaurus site)

## GitHub Integration

When given a GitHub URL, use the `gh` command to fetch information:

- For issues: `gh issue view <URL>`
- For pull requests: `gh pr view <URL>`
- For PR comments: `gh api repos/{owner}/{repo}/pulls/{number}/comments`
- For general API access: `gh api <endpoint>`

## Git Worktree

**IMPORTANT**: The `worktrees/` directory contains git worktree directories. Each worktree may have a different branch checked out.

⚠️ **Critical Notes**:

- When working in `worktrees/`, **be extremely careful with git operations**
- Each worktree is an independent working directory with its own checked-out branch
- Running git commands in a worktree affects only that specific worktree
- **Always verify which worktree and branch you're in** before performing git operations
- Confusion between worktrees can lead to changes being made on the wrong branch

**Best Practices**:

1. Always check the current branch: `git branch --show-current`
2. Verify you're in the correct worktree before making changes
3. Avoid running destructive git operations without confirmation
4. When referencing files, be aware of which worktree context you're in

## Reference Project

When implementing features or following patterns, refer to the environment variable `TAKAZUDO_MODULAR_LOCAL_LOCATION` for the reference project path.

Use this project as reference for:
- Component structure and naming conventions
- MDX configuration and usage patterns
- Styling approaches with Tailwind CSS
- Next.js app router patterns
- TypeScript patterns and types

## Project Overview

An interactive web application for customizing Takazudo Modular synthesizer cases. Users can select different case models, customize panel colors, choose rail types, and see real-time price estimates.

## Tech Stack

- React 19 with Next.js
- TypeScript
- Tailwind CSS 4
- pnpm workspace (monorepo with doc and sub-packages)

## Available Scripts

```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run preview  # Preview production build
pnpm run lint     # Run ESLint
pnpm run typecheck # Run TypeScript type checking
pnpm run test     # Run all Playwright tests
pnpm run test:smoke # Run smoke tests only
pnpm run test:ui  # Run tests with UI mode
pnpm run test:debug # Debug tests interactively
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
└── __inbox/                        # Developer notes and documentation inbox
```

### Developer Notes Inbox

The `__inbox/` directory is used as a documentation inbox for developer notes, code reviews, and implementation logs. Files in this directory are intentionally preserved and should not be treated as temporary files to be cleaned up. This includes:

- Code review notes
- Implementation documentation
- TDD development logs
- Migration plans
- Research notes

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
