# GitHub Copilot Instructions - Takazudo Modular Panels

This is an interactive case customizer for Takazudo Modular synthesizer cases built with React 19, Next.js 15, TypeScript (strict mode), and Tailwind CSS 4.

## Critical File Naming Convention

All TypeScript and JavaScript files MUST use kebab-case naming, not PascalCase. This is enforced by ESLint and is non-negotiable.

Examples:
- Components: `case-selector.tsx` NOT `CaseSelector.tsx`
- Hooks: `use-url-persistence.ts` NOT `useUrlPersistence.ts`
- Utils: `panel-colors.ts` NOT `panelColors.ts`
- Tests: `url-encoder.test.ts` NOT `urlEncoder.test.ts`

The exported component or function names should still use PascalCase (e.g., `export default function CaseSelector()`), but the file name must be kebab-case.

## Import Patterns

Always use the `@/` path alias for imports, never relative paths.

Examples:
- `import CaseSelector from '@/components/case-selector';`
- `import { useUrlPersistence } from '@/hooks/use-url-persistence';`
- `import { cases } from '@/data/cases';`
- `import type { Case, Panel } from '@/types';`

## Component Structure

For client components (components that use React hooks or state), always add the `'use client'` directive at the top of the file.

Use TypeScript interfaces for props, and always specify prop types explicitly.

Example:
```typescript
'use client';

import { useState } from 'react';
import type { Case } from '@/types';

interface CaseSelectorProps {
  selectedCase: Case | null;
  onSelect: (caseId: string) => void;
}

export default function CaseSelector({ selectedCase, onSelect }: CaseSelectorProps) {
  return <div>...</div>;
}
```

## Styling with Tailwind CSS

Use Tailwind CSS 4 classes exclusively. The project has custom design tokens with `zd-` prefix for colors and spacing.

Common color classes: `bg-zd-gray`, `text-zd-white`, `bg-zd-black`, `text-zd-gray`
Common spacing: `vgap-*` (vertical gaps), `hgap-*` (horizontal gaps)
Standard Tailwind utilities: `rounded-lg`, `border`, `p-4`, `flex`, `items-center`, etc.

Do not create custom CSS files. All styling should be done with Tailwind classes.

## TypeScript Types

The project uses strict TypeScript mode with no unused variables or implicit any types allowed.

Key types are defined in `types/index.ts`. Always check this file before creating new types.

Common types:
- `Case` - Represents a case model with `material: 'acrylic' | '3dp'`
- `Panel` - Individual panel with id and name
- `Color` - Color definition with id, name, and hex value
- `RailOption` - Rail configuration with pricing

Always import types with the `type` keyword: `import type { Case } from '@/types';`

## Custom Hooks Pattern

Custom hooks should follow this pattern:

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return { value, setValue };
}
```

Check `hooks/use-url-persistence.ts` for a reference implementation.

## Testing

Tests should be colocated with source files using the `.test.ts` or `.test.tsx` suffix.

The project uses Vitest for unit tests and Playwright for E2E tests.

Example test structure:
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './my-file';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('expected');
  });
});
```

## State Management

The main application state lives in `components/configurator.tsx` and uses URL query parameters for persistence.

State is synchronized to the URL using the `useUrlPersistence()` hook with a custom encoding format (`?c=caseId&p=colorIds`).

UI preferences (like selected colors) are persisted to localStorage using `useLocalStorageColor()`.

## Project Structure

**IMPORTANT**: Files are at the root level, NOT in a `src/` directory.

- `app/` - Next.js App Router pages and layouts (route groups: `(configurator)`, `(content)`, `gallery`)
- `components/` - 60+ React components (main: `configurator.tsx`)
  - `components/modal/` - Modal-related components
  - `components/article/` - Article/content components
- `hooks/` - 10 custom React hooks (main: `use-url-persistence.ts`)
- `utils/` - Utility functions with colocated tests
- `data/` - Static configuration (cases, colors, gallery data)
- `types/` - TypeScript type definitions
- `public/` - Static assets (images, SVGs)
- `doc/` - Docusaurus documentation site (separate from main app)
- `tests/` - Playwright E2E tests

## Code Quality Commands

Before committing, run `pnpm run check:fix` to automatically fix all linting and formatting issues.

Available commands:
- `pnpm run dev` - Start dev server on port 3200
- `pnpm run build` - Production build
- `pnpm run check:fix` - Fix all auto-fixable issues (lint + format)
- `pnpm run lint` / `pnpm run lint:fix` - ESLint checks
- `pnpm run format` / `pnpm run format:fix` - Prettier checks
- `pnpm run typecheck` - TypeScript type checking
- `pnpm test` - Run Vitest in watch mode
- `pnpm test:run` - Run Vitest once
- `pnpm test:smoke` - Run Playwright smoke tests
- `pnpm test:e2e` - Run all Playwright E2E tests
- `pnpm test:e2e:ui` - Run Playwright with UI
- `pnpm run b4push` - Quick pre-push validation
- `pnpm run b4push:full` - Full pre-push validation

## Code Style

- Line width: 100 characters (Prettier)
- Indentation: 2 spaces
- Quotes: Single quotes for strings
- Trailing commas: Always
- Semicolons: Always

These are enforced by Prettier and ESLint.

## Common Patterns to Follow

When creating a new component, check `components/case-selector.tsx` for reference.
When creating a new hook, check `hooks/use-url-persistence.ts` for reference.
When creating a new utility function, check `utils/panel-colors.ts` for reference.
When adding new types, check `types/index.ts` first to avoid duplication.

## Context Provider Pattern

For cross-component state management, use the React Context pattern with proper TypeScript typing:

```typescript
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export function MyProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState('');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

Check `components/navigation-context.tsx` for a complete example.

## Modal/Dialog Pattern

For modals with animations and accessibility:

```typescript
'use client';

import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={isOpen ? 'opacity-100' : 'opacity-0'}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}
```

Check `components/base-modal.tsx` and `components/gallery-dialog.tsx` for complete implementations.

## Error Boundary Pattern

For error handling, use a class component (the only class component in the codebase):

```typescript
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

Check `components/error-boundary.tsx` for reference.

## localStorage Hook Pattern

For localStorage with validation and type safety:

```typescript
'use client';

import { useState, useEffect } from 'react';

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => getStoredValue(key, defaultValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
```

Check `hooks/use-local-storage-color.ts` for reference.

## Accessibility Requirements

Always include proper ARIA attributes for interactive elements:

- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Buttons: `aria-label` when text isn't visible
- Navigation: `role="navigation"`, `aria-current` for active items
- Focus management: Use `useFocusTrap` hook for modal focus containment (see `hooks/use-focus-trap.ts`)

Keyboard navigation is critical - support Arrow keys, Enter, Escape, and Tab.

## Git Worktree Warning

This repository uses git worktrees. Always check the current branch before performing git operations: `git branch --show-current`

## Deployment

The main application deploys to https://panels.takazudomodular.com/ from the `main` branch.
Documentation deploys to https://panels.takazudomodular.com/doc/ from the `/doc/` directory.
All pull requests automatically get Netlify preview deployments.
