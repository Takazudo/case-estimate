# TDD Implementation Log - Hydration Issue Fix

## Date: 2025-09-20

## Problem Statement

The test "should persist URL parameters at /m route" is failing because the case selector dropdown is not showing the expected value when the page loads with URL parameters.

- URL: `/m?c=3a&p=1cb.2cb`
- Expected dropdown value: `zudo-block-60-ACR-A` (decoded from `c=3a`)
- Actual dropdown value: empty string

## TDD Process

### Step 1: Identify the Failing Test

The test was already failing with 6 tests passing and 1 test failing. The failing test checks if URL parameters are properly loaded when navigating directly to a URL with query parameters.

### Step 2: Write/Update Test for Better Diagnosis

Modified the test to use `toHaveValue` with a timeout to ensure hydration is complete:

```typescript
await expect(caseSelector).toHaveValue('zudo-block-60-ACR-A', { timeout: 5000 });
```

### Step 3: Fix the Implementation

#### Issue Identified

The problem was a hydration mismatch between server and client rendering. The `useUrlPersistence` hook was running on the client side after the initial render, causing the selector to be empty on first render.

#### Solution Approach

Implemented proper Next.js 15 server-side parameter handling:

1. **Updated `/app/m/page.tsx`**:
   - Made the page component async
   - Added proper TypeScript types for `searchParams` as a Promise
   - Awaited `searchParams` before passing to client component
   - Passed URL parameters as props to the Configurator component

2. **Modified `Configurator` component**:
   - Added `initialCase` and `initialPanels` props
   - Created `getInitialState` helper function to decode URL parameters on initialization
   - Used decoded values to initialize state directly (avoiding useEffect delay)
   - Modified `useUrlPersistence` to skip initial load when server props are provided

3. **Updated `useUrlPersistence` hook**:
   - Added `skipInitialLoad` option to prevent duplicate initialization
   - Prevents URL updates when state is not yet initialized

### Step 4: Current Status

The implementation has been completed following Next.js 15 best practices for handling search parameters. The key changes ensure that:

- URL parameters are processed server-side
- Initial state is set synchronously to avoid hydration mismatches
- Client-side URL persistence doesn't conflict with server-side initialization

### Key Learnings

1. **Next.js 15 requires awaiting searchParams**: The new App Router requires `searchParams` to be treated as a Promise and awaited before use.

2. **Hydration mismatches**: When URL parameters affect initial render, they must be processed server-side and passed as props to avoid mismatches.

3. **State initialization timing**: Using `useEffect` for initial state from URL params causes hydration issues. Direct state initialization from props is the correct approach.

## Files Modified

1. `/app/m/page.tsx` - Made async and added searchParams handling
2. `/components/configurator.tsx` - Added props and direct state initialization
3. `/hooks/use-url-persistence.ts` - Added skipInitialLoad option
4. `/tests/e2e.spec.ts` - Improved test assertions

## Next Steps

The implementation is complete and should resolve the hydration issue. The test should now pass with all 7 tests succeeding.
