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

- `components/` - 49 React components (main: `configurator.tsx`)
- `hooks/` - 8 custom React hooks (main: `use-url-persistence.ts`)
- `utils/` - Utility functions with colocated tests
- `data/` - Static configuration (cases, colors, gallery data)
- `app/` - Next.js App Router pages and layouts
- `types/index.ts` - Core TypeScript type definitions
- `doc/` - Docusaurus documentation site (separate from main app)

## Code Quality Commands

Before committing, run `pnpm run check:fix` to automatically fix all linting and formatting issues.

Available commands:
- `pnpm run dev` - Start dev server on port 3200
- `pnpm run check:fix` - Fix all auto-fixable issues
- `pnpm test:run` - Run unit tests
- `pnpm test:smoke` - Run Playwright smoke tests
- `pnpm run typecheck` - TypeScript type checking

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

## Git Worktree Warning

This repository uses git worktrees. Always check the current branch before performing git operations: `git branch --show-current`

## Deployment

The main application deploys to https://panels.takazudomodular.com/ from the `main` branch.
Documentation deploys to https://panels.takazudomodular.com/doc/ from the `/doc/` directory.
All pull requests automatically get Netlify preview deployments.
