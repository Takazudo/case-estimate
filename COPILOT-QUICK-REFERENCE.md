# Takazudo Modular: Panels - Quick Reference for GitHub Copilot

## Project at a Glance
Interactive case customizer for Takazudo Modular synthesizer cases with real-time pricing. React 19 + Next.js 15 + TypeScript + Tailwind CSS 4 + pnpm monorepo.

**Key URLs:**
- Production: https://panels.takazudomodular.com/
- Docs: https://panels.takazudomodular.com/doc/

---

## Code Patterns to Follow

### File Naming (CRITICAL)
Use **kebab-case** for ALL TypeScript/JavaScript files:
- Components: `case-selector.tsx` (NOT `CaseSelector.tsx`)
- Hooks: `use-url-persistence.ts` (NOT `useUrlPersistence.ts`)  
- Utils: `panel-colors.ts` (NOT `panelColors.ts`)
- Tests: `url-encoder.test.ts`

Export functions/components still use PascalCase.

### Imports
Always use `@/` path alias:
```typescript
import { cases } from '@/data/cases';
import CaseSelector from '@/components/case-selector';
import { useUrlPersistence } from '@/hooks/use-url-persistence';
```

### Component Structure
```typescript
'use client';  // If using hooks/state

import { useState } from 'react';
import type { Case } from '@/types';

interface MyComponentProps {
  case: Case;
  onSelect: (caseId: string) => void;
}

export default function MyComponent({ case, onSelect }: MyComponentProps) {
  return <div>...</div>;
}
```

### Testing
Tests live alongside source files:
- `utils/panel-colors.test.ts` (Vitest, jsdom)
- Run: `pnpm test` or `pnpm test:run`

---

## Project Structure

```
components/          49 files, ~5000 LOC
├── configurator.tsx (main state management)
├── case-visualizer.tsx (SVG visualization)
└── [modal/, article/ subdirectories]

data/               Configuration & static data
├── cases.ts        150+ case models
├── colors.ts       Color palettes
├── gallery-data.ts Gallery content
└── *.test.ts       Data validation tests

hooks/              Custom React hooks
├── use-url-persistence.ts (URL query sync)
├── use-local-storage-color.ts (color storage)
└── [6 more hooks]

utils/              Utility functions
├── url-encoder.ts (compact URLs)
├── panel-colors.ts (color logic)
└── *.test.ts

types/index.ts      Core TypeScript types
app/                Next.js App Router
├── (configurator)/ Case builder section
├── (content)/      Article section
└── gallery/        Gallery section
```

---

## Key Types

```typescript
interface Case {
  name: string;
  hp: number;
  material: 'acrylic' | '3dp';  // Discriminated union
  panels: Panel[];
}

interface Panel { id: string; name: string; }
interface Color { id: string; name: string; value: string; ... }
interface RailOption { type: string; name: string; price: number; }
```

---

## TypeScript Rules
- ✅ Strict mode enabled
- ✅ No unused variables/params
- ✅ No implicit any (warn)
- ✅ All imports explicit
- ✅ ESLint enforces these

Run checks: `pnpm run check:fix`

---

## Formatting
- **Line width:** 100 chars (Prettier)
- **Indentation:** 2 spaces
- **Quotes:** Single quotes
- **Commas:** Trailing commas (all)
- **Auto-fix:** `pnpm run format:fix`

---

## Available Commands

```bash
# Development
pnpm run dev              # Port 3200
pnpm run build            # Production build

# Code Quality
pnpm run lint             # Check linting
pnpm run typecheck        # TypeScript check
pnpm run format           # Check Prettier
pnpm run check:fix        # Fix everything at once

# Testing
pnpm test                 # Vitest (watch)
pnpm test:run            # Vitest (single run)
pnpm test:smoke          # Playwright smoke tests

# Pre-push
pnpm run b4push          # Quick validation
pnpm run b4push:full     # Full validation
```

---

## State Management Pattern

**File:** `components/configurator.tsx`

State tracked in URL query params (`?c=caseId&p=colorIds`):
```typescript
const { selectedCase, panelColorIds } = getInitialStateFromUrl();
// ... use hooks to sync back to URL
```

Uses custom hooks:
- `useUrlPersistence()` - Syncs state to URL
- `useLocalStorageColor()` - Persists UI colors to localStorage

---

## Component Patterns

**Smart Component (stateful):**
```typescript
'use client';
import { useState } from 'react';

export default function Configurator() {
  const [selected, setSelected] = useState<string | null>(null);
  return <PresentationalComponent selected={selected} onChange={setSelected} />;
}
```

**Presentational Component (stateless):**
```typescript
interface Props { selected: string; onChange: (id: string) => void; }
export default function List({ selected, onChange }: Props) {
  return <select value={selected} onChange={(e) => onChange(e.target.value)} />;
}
```

---

## Colors & Styling

Uses Tailwind CSS 4 with custom design system tokens:
- `bg-zd-gray`, `text-zd-white` - Color tokens
- `vgap-*`, `hgap-*` - Spacing tokens
- `rounded-lg`, `border` - Standard Tailwind

No custom CSS needed—use Tailwind classes.

---

## Testing Strategy

**Unit/Component (Vitest):**
```typescript
// File: utils/panel-colors.test.ts
import { describe, it, expect } from 'vitest';
import { derivePanelColors } from './panel-colors';

describe('derivePanelColors', () => {
  it('should return expected colors', () => {
    const result = derivePanelColors('acrylic', {});
    expect(result).toBeDefined();
  });
});
```

**E2E (Playwright):**
```typescript
// File: tests/e2e.spec.ts
test('should load without errors', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Takazudo/i })).toBeVisible();
});
```

Commands:
- `pnpm test` - Watch mode
- `pnpm test:smoke` - Smoke tests
- `pnpm test:e2e:ui` - Interactive E2E

---

## CI/CD Pipeline

Runs on: Every push to `main` + ALL PRs

1. TypeScript typecheck
2. ESLint linting
3. Prettier formatting
4. Unit tests (Vitest)
5. Build (Next.js + docs)
6. Smoke tests (Playwright)
7. Netlify preview deployment (auto-comment on PR)

---

## Git Worktree Warning
⚠️ Each worktree has independent branch state. Check current branch:
```bash
git branch --show-current
```

---

## Before Committing

```bash
# Run all checks
pnpm run check:fix

# Run tests
pnpm test:run

# Run specific checks if needed
pnpm run lint:fix
pnpm run format:fix
pnpm run typecheck
```

---

## Reference Files to Check

- **New component?** → Review `/components/case-selector.tsx`
- **New hook?** → Review `/hooks/use-url-persistence.ts`
- **New utility?** → Review `/utils/panel-colors.ts`
- **New type?** → Check `/types/index.ts` first
- **New case model?** → Review `/data/cases.ts` structure

---

## Tips for Working with Copilot

1. Mention file names in kebab-case explicitly
2. Reference existing components/patterns
3. Ask for tests alongside features
4. Verify TypeScript types before implementation
5. Run `pnpm run check:fix` after generation
6. Review ESLint warnings in generated code
7. Check Prettier formatting manually on complex code

---

## Build Output

- **Development:** `pnpm run dev` → served on port 3200
- **Production:** `pnpm run build` → static files in `/out/`
- **Documentation:** Built from `/doc/` with Docusaurus
- **Deployment:** Netlify (automatic from main branch)

---

## Important Directories

- `/app/` - Next.js pages (don't modify structure lightly)
- `/components/` - Reusable React components
- `/data/` - Static configuration data
- `/hooks/` - Custom React hooks
- `/utils/` - Utility functions
- `/types/` - TypeScript type definitions
- `/tests/` - E2E tests (Playwright)
- `/doc/` - Documentation site (Docusaurus)
- `/__inbox/` - Developer notes (keep preserved)

---

## Monorepo Structure

```bash
pnpm-workspace.yaml defines:
.                   # Main app (this project)
doc/               # Documentation (Docusaurus)
sub-packages/*     # Utility packages (md-formatter)
```

Commands in root workspace run for all packages.

---

**Full details:** See `CODEBASE-SUMMARY.md` in project root
