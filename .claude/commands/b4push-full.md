---
description: Run full pre-push validation including panel color mapping tests
---

Run `pnpm b4push:full` to execute comprehensive pre-push validation checks.

This command runs everything in the quick b4push PLUS:

- Code quality checks (typecheck, lint, format)
- Unit tests
- Build verification (main app + docs)
- Production build smoke tests
- **Panel color mapping e2e tests (16 comprehensive tests)**

⚠️ **Note:** This takes 10-15 minutes due to e2e tests. Use this before:
- Pushing changes to CaseVisualizer component
- Pushing changes to URL encoding/decoding
- Pushing changes to panel mappings
- Creating releases

For quick validation, use `/b4push` instead.

**Instructions:**

1. Execute `pnpm b4push:full` using the Bash tool
2. If the command succeeds, report success to the user
3. If errors or warnings occur:
  - Analyze the errors/warnings
  - If they are fixable code issues (linting errors, type errors, test failures), fix them automatically
  - If they are e2e test failures, analyze the screenshots/traces and fix the underlying issue
  - If they appear to be maintenance updates (dependency updates, configuration changes), ask the user how to proceed
4. After fixing issues, run `pnpm b4push:full` again to verify the fixes
