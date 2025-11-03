# Takazudo Modular: Panels - Codebase Overview

## Project Summary
Interactive web application for customizing Takazudo Modular synthesizer cases. Users can select case models, customize panel colors, choose rail types, and see real-time price estimates. Features URL persistence for sharing configurations and presets for different case models.

**Production URLs:**
- Main App: https://panels.takazudomodular.com/
- Documentation: https://panels.takazudomodular.com/doc/

---

## Tech Stack

### Core Framework
- **React 19** with **Next.js 15.5.3** (App Router)
- **TypeScript 5.9** (strict mode, ES2022 target)
- **Tailwind CSS 4** (custom theming)
- **MDX 3.1** for documentation content

### Package Management
- **pnpm** workspace (monorepo structure)
  - Root: main application
  - `/doc`: Docusaurus documentation
  - `/sub-packages/*`: utility packages (md-formatter)

### Build & Tooling
- **Next.js** with static export (`output: 'export'`, dist: `out/`)
- **Vite** dev server (custom port configuration)
- **Playwright** for E2E/smoke testing
- **Vitest** for unit/component testing
- **ESLint** with flat config (v9.35)
- **Prettier** for code formatting

---

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── (configurator)/           # Case configurator section
│   │   ├── layout.tsx
│   │   └── m/page.tsx           # Main configurator page
│   ├── (content)/                # Content/article section
│   │   ├── layout.tsx
│   │   └── modules/page.tsx
│   ├── gallery/                  # Gallery section
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components (~5000 LOC across 49 files)
│   ├── configurator.tsx          # Main state management component
│   ├── case-selector.tsx         # Case model dropdown
│   ├── case-visualizer.tsx       # SVG visualization (28KB)
│   ├── color-picker.tsx          # Color selection UI
│   ├── panel-list.tsx            # Panel customization list
│   ├── price-table.tsx           # Pricing display
│   ├── controls-sidebar.tsx      # Controls panel
│   ├── app-header.tsx            # Top navigation
│   ├── error-boundary.tsx        # Error handling
│   ├── modal/                    # Modal components
│   ├── article/                  # Article display components
│   └── [20+ specialized components]
│
├── data/                         # Configuration & static data
│   ├── cases.ts                  # Case model definitions (~150+ models)
│   ├── colors.ts                 # Color palette definitions
│   ├── rails.ts                  # Rail type & pricing options
│   ├── case-groups.ts            # Case grouping logic
│   ├── gallery-data.ts           # Gallery content (~30KB)
│   ├── navigation.ts             # Navigation structure
│   └── *.test.ts                 # Data validation tests
│
├── hooks/                        # Custom React hooks
│   ├── use-url-persistence.ts    # URL query parameter management
│   ├── use-local-storage-color.ts # Color persistence
│   ├── use-focus-trap.ts         # Modal focus management
│   ├── use-blurhash-placeholder.ts
│   ├── use-gallery-keyboard-navigation.ts
│   ├── use-lock-body-scroll.ts
│   └── use-scroll-to-top.ts
│
├── utils/                        # Utility functions
│   ├── panel-colors.ts           # Color selection logic (10KB)
│   ├── url-encoder.ts            # URL compression/decompression (6KB)
│   ├── panel-color-utils.ts      # Color utilities
│   ├── panel-patterns.ts         # SVG pattern definitions
│   ├── cdn-urls.ts               # CDN configuration
│   └── *.test.ts                 # Utility tests
│
├── types/                        # TypeScript definitions
│   ├── index.ts                  # Core type definitions
│   └── mdx.d.ts                  # MDX type declarations
│
├── public/                       # Static assets
│   └── svg/                      # Case SVG diagrams
│
├── tests/                        # E2E tests
│   └── e2e.spec.ts              # Playwright smoke tests
│
├── doc/                          # Docusaurus documentation site
│   └── [separate pnpm workspace]
│
└── Configuration files
    ├── next.config.mjs           # Next.js config (MDX, static export)
    ├── tsconfig.json             # TypeScript config (strict mode)
    ├── eslint.config.js          # ESLint flat config
    ├── tailwind.config.js        # Tailwind configuration
    ├── vitest.config.ts          # Unit test runner config
    ├── playwright.config.ts      # E2E test configuration
    ├── .prettierrc                # Prettier config (100 char line width)
    └── pnpm-workspace.yaml       # Workspace definition
```

---

## Code Style & Conventions

### File Naming
- **All TypeScript/JavaScript files use kebab-case:**
  - ✅ `case-selector.tsx`, `use-url-persistence.ts`, `panel-colors.ts`
  - ❌ `CaseSelector.tsx`, `useUrlPersistence.ts`, `panelColors.ts`
- Component exports still use **PascalCase** (React convention)
  ```tsx
  // File: case-selector.tsx
  export default function CaseSelector() { ... }
  ```
- Applies to: components (`.tsx`), modules (`.ts`), and tests (`.test.ts`)

### Code Formatting
- **Prettier** with:
  - 100 character line width
  - 2-space indentation
  - Single quotes
  - Trailing commas (all)
  - Always arrow parens
- **ESLint** rules:
  - Flat config (ESLint v9)
  - React 19 compatible (no JSX import requirement)
  - TypeScript strict checking (`@typescript-eslint/no-unused-vars`, `no-explicit-any: warn`)
  - Next.js plugin enabled
  - No console.log allowed (warn/error only)
  - Prettier integration enforced

### TypeScript Configuration
- **Strict mode enabled** (all strict checks active)
- Target: **ES2022**
- Module: **esnext**
- Path alias: `@/*` → root directory
- Strict type checking:
  - `noUnusedLocals`, `noUnusedParameters`
  - `noImplicitReturns`, `noFallthroughCasesInSwitch`

---

## Key Patterns & Architecture

### State Management (Configurator)
**File:** `components/configurator.tsx`
- **Client-side component** using React hooks
- State tracked in URL query parameters for sharing
- URL format: `?c={caseId}&p={colorIds}`
- Default color initialization on first load
- localStorage integration for background/grid colors

**Key hooks:**
- `useUrlPersistence()` - Syncs state to URL
- `useLocalStorageColor()` - Persists UI colors

### Component Organization
- **Smart components** handle state logic (marked with `'use client'`)
- **Presentational components** receive props
- Modal components isolated in `/components/modal/`
- Article/content components in `/components/article/`
- Layout components in `/app/*/layout.tsx`

### Data Structure Patterns
```typescript
// Type definitions (types/index.ts)
interface Case {
  name: string;
  hp: number;
  material: 'acrylic' | '3dp';  // Material type discriminator
  panels: Panel[];
}

interface Panel { id: string; name: string; }
interface RailOption { type: string; name: string; price: number; }
```

### URL Persistence
- Custom encoding/decoding for compact URLs
- Case ID + panel color IDs in query params
- Decompression on page load via `getInitialStateFromUrl()`
- Falls back to first available case if no params

### SVG Visualization
- Large component: `case-visualizer.tsx` (28KB)
- Inline SVG with dynamic fill properties
- Color application via CSS/SVG fill attribute
- Absolute positioning for panel layout with calculated gaps

### Testing Strategy

**Vitest (Unit/Component Tests)**
- Test files colocate with source: `*.test.ts`, `*.spec.ts`
- jsdom environment for DOM testing
- Test paths configured in `vitest.config.ts`:
  ```
  utils/, hooks/, components/, app/, data/
  ```
- Excluded: tests/, .next/, doc/, out/

**Playwright (E2E/Smoke Tests)**
- **Location:** `tests/e2e.spec.ts`
- **Purpose:** Smoke tests to verify:
  - Page loads without 404 or JavaScript errors
  - No console errors during usage
  - Core UI elements visible and functional
  - Case model switching works
- **CI runs on:** Every push to `main` AND all PRs
- **Production config:** `playwright.config.production.ts`
- **Commands:**
  ```bash
  pnpm test:smoke                # Smoke tests (dev)
  pnpm test:smoke:production     # Smoke tests (prod)
  pnpm test:e2e                  # Full E2E suite
  pnpm test:e2e:ui              # Interactive mode
  pnpm test:e2e:debug           # Debug mode
  ```

---

## Available Commands

```bash
# Development
pnpm run dev              # Start dev server (port 3200)
pnpm run dev2             # Secondary dev server (port 3201)
pnpm run build            # Build for production
pnpm run preview          # Preview production build
pnpm run build:with-docs  # Build app + docs

# Code Quality
pnpm run lint             # Check linting
pnpm run lint:fix         # Fix linting issues
pnpm run typecheck        # TypeScript type checking
pnpm run format           # Check Prettier formatting
pnpm run format:fix       # Fix formatting
pnpm run format:md        # Check Markdown formatting
pnpm run format:md:fix    # Fix Markdown
pnpm run check            # Run all checks (lint, typecheck, format)
pnpm run check:fix        # Fix all issues

# Testing
pnpm test                 # Run Vitest (watch mode)
pnpm test:ui             # Vitest UI mode
pnpm test:run            # Vitest single run
pnpm test:coverage       # Coverage report
pnpm test:smoke          # Playwright smoke tests
pnpm test:e2e            # Full E2E suite
pnpm test:e2e:ui         # E2E with UI

# Documentation
pnpm run doc:dev         # Dev server for docs
pnpm run doc:build       # Build documentation
pnpm run doc:serve       # Preview built docs

# Git Hooks
pnpm run b4push          # Pre-push validation (quick)
pnpm run b4push:full     # Pre-push validation (complete)
```

---

## TypeScript & Type System

### Core Types (`types/index.ts`)
```typescript
interface Panel { id: string; name: string; }
interface RailOption { type: string; name: string; price: number; }
interface Case {
  name: string;
  hp: number;
  material: 'acrylic' | '3dp';
  panels: Panel[];
}
interface Color {
  id: string; name: string; value: string;
  material: string; opacity?: number; imageUrl?: string;
}
interface Series {
  id: string; name: string; description?: string;
  colors: { all?: string; primary?: string; secondary?: string; };
}
interface Cases { [key: string]: Case; }
interface Colors {
  acrylic: Color[];
  '3dp': Color[];
  series: { acrylic: Series[]; '3dp': Series[]; };
}
```

### Type Patterns
- **Discriminated unions** for material types (`'acrylic' | '3dp'`)
- **Index signatures** for flexible data structures
- **Generic helper types** (e.g., `CaseEntry = [string, Case]`)
- **MDX type declarations** via `types/mdx.d.ts`

---

## Styling & Tailwind

### Configuration
- **Version:** Tailwind CSS 4
- **Font stack:**
  - Primary: Futura, Century Gothic, sans-serif
  - Body: Helvetica, sans-serif
  - Mono: Menlo, Monaco, Consolas
- **Custom tokens:** Appears to use design system with `zd-` prefix (e.g., `bg-zd-gray`, `text-zd-white`)
- **Content paths:** `app/`, `pages/`, `components/` + mdx

### Design System Classes
Custom theme with space/gap tokens:
- `vgap-*` - Vertical gap spacing
- `hgap-*` - Horizontal gap spacing
- Color tokens: `zd-white`, `zd-gray`, `zd-gray2`, `zd-link`

---

## CI/CD & Deployment

### GitHub Actions
- **Triggers:** Every push to `main` + all PRs
- **Pipeline:**
  1. TypeScript type checking
  2. ESLint linting
  3. Prettier formatting
  4. Unit tests (Vitest)
  5. Build verification (app + docs)
  6. Smoke tests (Playwright)
  7. Automatic Netlify preview deployment

### Preview Deployments
- **Automatic for all PRs** (regardless of target branch)
- **URL format:** `https://deploy-preview-{number}--{site-name}.netlify.app/`
- **Includes:** Main app + `/doc/` documentation
- **Auto-comment** with links + commit info

### Production Deployment
- **Source:** `main` branch
- **Platform:** Netlify
- **Output:** Static files from `out/` directory (Next.js export)
- **Documentation:** Built from `/doc` subdirectory

---

## Important Notes for Developers

### Git Worktrees
⚠️ The `worktrees/` directory contains independent git worktrees:
- Each worktree has its own checked-out branch
- Running git commands in a worktree affects only that worktree
- Always verify current branch: `git branch --show-current`
- Avoid destructive git operations without confirmation

### Import Paths
- Use `@/` alias for all imports (root directory)
- **Example:** `import { cases } from '@/data/cases'`

### Environment Variables
- Reference project path: `TAKAZUDO_MODULAR_LOCAL_LOCATION` env var
- Use as reference for patterns and conventions

### Developer Notes
- `/\_\_inbox/` directory preserves developer notes, code reviews, and logs
- Do not delete—intended for documentation

---

## Key Components for Reference

### High-Impact Components
1. **configurator.tsx** - Main application state logic
2. **case-visualizer.tsx** - Complex SVG visualization
3. **color-picker.tsx** - Color selection UI
4. **controls-sidebar.tsx** - Control panel layout

### Utility Functions
- `url-encoder.ts` - Compact URL serialization
- `panel-colors.ts` - Complex color logic
- `panel-color-utils.ts` - Color utilities

### Custom Hooks
- `use-url-persistence.ts` - URL sync pattern
- `use-focus-trap.ts` - Modal accessibility
- `use-local-storage-color.ts` - Persistence pattern

---

## Quick Start for Copilot

When using GitHub Copilot with this project:
1. **Follow kebab-case naming** for all new files
2. **Use `@/` imports** for all local code
3. **Check `types/index.ts`** before creating new types
4. **Reference existing components** in `/components/` for patterns
5. **Add tests** alongside features (colocate `.test.ts` files)
6. **Use Tailwind classes** with custom `zd-` tokens
7. **Mark client components** with `'use client'` directive
8. **Use TypeScript strict mode** (enabled in project)
9. **Run checks:** `pnpm run check:fix` before committing
10. **Review data/cases.ts** for case model structure before adding cases

---

## Git Status
- **Current Branch:** main (clean working tree)
- **Recent Commits:**
  - 15ecc9e - claude tweak
  - 3fd509d - Merge PR #39 (builder tweaks)
  - 4b918f3 - PR review feedback
  - dcef83f - Next.js ESLint plugin config
  - ffa33d9 - Next.js ESLint plugin addition
