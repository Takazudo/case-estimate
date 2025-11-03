# Copilot Custom Instructions - Takazudo Modular Panels

Interactive case customizer | React 19 + Next.js 15 + TypeScript + Tailwind CSS 4

---

## Critical Rules

### File Naming (MUST FOLLOW)
**kebab-case** for ALL files:
- ✅ `case-selector.tsx`, `use-url-persistence.ts`, `panel-colors.ts`
- ❌ `CaseSelector.tsx`, `useUrlPersistence.ts`, `panelColors.ts`

### Imports
Always use `@/` alias:
```typescript
import CaseSelector from '@/components/case-selector';
import { useUrlPersistence } from '@/hooks/use-url-persistence';
```

### Component Pattern
```typescript
'use client';  // Add if using hooks/state

import type { Case } from '@/types';

interface Props {
  case: Case;
  onSelect: (id: string) => void;
}

export default function MyComponent({ case, onSelect }: Props) {
  return <div className="bg-zd-gray text-zd-white">...</div>;
}
```

### Hook Pattern
```typescript
'use client';

import { useState, useEffect } from 'react';

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { /* ... */ }, []);
  return { value, setValue };
}
```

### Test Pattern
```typescript
// File: utils/my-util.test.ts (same directory as source)
import { describe, it, expect } from 'vitest';
import { myUtil } from './my-util';

describe('myUtil', () => {
  it('should work correctly', () => {
    expect(myUtil('input')).toBe('expected');
  });
});
```

---

## Key Types

```typescript
interface Case {
  name: string;
  hp: number;
  material: 'acrylic' | '3dp';
  panels: Panel[];
}

interface Panel { id: string; name: string; }
interface Color { id: string; name: string; value: string; }
```

Check `/types/index.ts` before creating new types.

---

## Project Structure

```
components/          49 components (main: configurator.tsx)
hooks/              8 custom hooks (main: use-url-persistence.ts)
utils/              Helpers with tests
data/               Static config (cases, colors, gallery)
app/                Next.js App Router pages
types/index.ts      Core TypeScript definitions
```

---

## Commands

```bash
pnpm run dev              # Dev server (port 3200)
pnpm run check:fix        # Fix all linting/formatting
pnpm test:run            # Unit tests
pnpm test:smoke          # E2E smoke tests
pnpm run b4push          # Pre-commit checks
```

---

## Code Style

- **Strict TypeScript** - No unused vars, explicit imports
- **Tailwind CSS 4** - Use `bg-zd-*`, `text-zd-*` color tokens
- **Prettier** - 100 char line width, 2 spaces, single quotes
- **Tests** - Colocate with source files (`.test.ts` suffix)

---

## State Management

Main state lives in `components/configurator.tsx`:
- URL query params for case/color selection (`?c=...&p=...`)
- `useUrlPersistence()` syncs state to URL
- `useLocalStorageColor()` persists UI preferences

---

## Common Patterns

**Client Component:**
```typescript
'use client';
import { useState } from 'react';
```

**Import Types:**
```typescript
import type { Case, Panel } from '@/types';
```

**Tailwind Classes:**
```typescript
className="bg-zd-gray text-zd-white rounded-lg border p-4"
```

---

## Before Committing

1. Run `pnpm run check:fix` - Fixes all auto-fixable issues
2. Run `pnpm test:run` - Ensure tests pass
3. Check TypeScript errors - Should be zero

---

## Reference Files

- Component example → `components/case-selector.tsx`
- Hook example → `hooks/use-url-persistence.ts`
- Util example → `utils/panel-colors.ts`
- Type definitions → `types/index.ts`
- Data structure → `data/cases.ts`

---

## Git Worktree Warning

⚠️ Check current branch before git operations:
```bash
git branch --show-current
```

---

**Full docs:** `COPILOT-QUICK-REFERENCE.md` | **Detailed:** `CODEBASE-SUMMARY.md`
