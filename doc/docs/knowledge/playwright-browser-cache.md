# Playwright Browser Caching for GitHub Actions

## Overview

Playwright browser installation is one of the slowest parts of CI/CD pipelines. By caching the browsers, you can reduce E2E test job time by **60-70%**.

## Performance Impact

### Before Caching

- **Browser installation**: 7-10 minutes (downloading + installing dependencies)
- **Tests execution**: 45 seconds
- **Total**: 10+ minutes

### After Caching

- **First run** (cache miss): 4-5 minutes
- **Subsequent runs** (cache hit): 2-3 minutes
- **Time saved**: 5-7 minutes per run
- **Performance improvement**: 60-70% faster

## Implementation

### For pnpm projects

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            playwright-${{ runner.os }}-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run tests
        run: pnpm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

### For npm projects

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            playwright-${{ runner.os }}-

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run tests
        run: npm run test:e2e
```

### For Yarn projects

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            playwright-${{ runner.os }}-

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Install Playwright browsers
        run: yarn playwright install --with-deps chromium

      - name: Run tests
        run: yarn test:e2e
```

## Key Points

### Cache Path

- **Linux/macOS**: `~/.cache/ms-playwright`
- **Windows**: `%USERPROFILE%\AppData\Local\ms-playwright`

For cross-platform projects, use conditional paths:

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: |
      ~/.cache/ms-playwright
      ~/Library/Caches/ms-playwright
      ~/AppData/Local/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### Cache Key Strategy

The cache key includes:
1. **OS**: `${{ runner.os }}` - Separate cache per OS
2. **Lock file hash**: `${{ hashFiles('**/pnpm-lock.yaml') }}` - Invalidates when dependencies change

**Why hash the lock file?**
- Playwright version may change with dependency updates
- Ensures cache is rebuilt when Playwright is upgraded
- Prevents version mismatches

### Restore Keys

```yaml
restore-keys: |
  playwright-${{ runner.os }}-
```

This fallback allows:
- Use cache even if lock file changed slightly
- Faster than full re-download
- `playwright install` will only download missing/updated browsers

### Browser Selection

**Install only what you need:**

```yaml
# Single browser (fastest)
- run: pnpm exec playwright install --with-deps chromium

# Multiple browsers
- run: pnpm exec playwright install --with-deps chromium firefox

# All browsers (slowest, usually unnecessary)
- run: pnpm exec playwright install --with-deps
```

**Recommendation**: Use Chromium only for CI unless you need cross-browser testing.

### Timeout Configuration

Set appropriate timeout for first run (cache miss):

```yaml
e2e:
  runs-on: ubuntu-latest
  timeout-minutes: 15  # First run: ~10-12 min, Cached: ~2-3 min
```

## Troubleshooting

### Cache Not Working

Check if cache is being saved:

```yaml
- name: Cache Playwright browsers
  id: playwright-cache
  uses: actions/cache@v4
  # ... cache config

- name: Debug cache status
  run: |
    echo "Cache hit: ${{ steps.playwright-cache.outputs.cache-hit }}"
```

### Cache Too Large

If cache size becomes an issue:

1. **Install specific browser only**
   ```bash
   playwright install chromium  # No --with-deps
   ```

2. **Use Docker** (browsers pre-installed)
   ```yaml
   container:
     image: mcr.microsoft.com/playwright:v1.40.0-focal
   ```

### Version Conflicts

If you see "Browser version mismatch" errors:

1. Clear cache by changing the key:
   ```yaml
   key: playwright-v2-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
   ```

2. Or use `cache-version` parameter:
   ```yaml
   key: playwright-${{ runner.os }}-v${{ secrets.CACHE_VERSION }}-${{ hashFiles('**/pnpm-lock.yaml') }}
   ```

## Real-World Results

From our `case-estimate` project:

| Run Type | Time | Browser Install | Tests | Total |
|----------|------|----------------|-------|-------|
| Without cache (timeout) | - | ~8 minutes | ~45s | 10+ min (failed) |
| With cache (first run) | 4m37s | ~3-4 minutes | ~45s | 4m37s |
| With cache (subsequent) | ~2m30s | ~10 seconds | ~45s | ~2m30s |

**Result**: 60-70% faster CI runs after first cache build.

## Best Practices

1. **Always cache browsers** - The setup is trivial, benefits are huge
2. **Use specific browsers** - Install only what you test against
3. **Set appropriate timeouts** - Account for first run (cache miss)
4. **Version the cache key** - Easy way to invalidate when needed
5. **Monitor cache size** - Use `--with-deps` only when necessary

## Additional Resources

- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [GitHub Actions Cache Documentation](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Playwright Docker Images](https://playwright.dev/docs/ci#running-playwright-in-docker)

## Example Projects

- This project: `.github/workflows/pr-checks.yml`
- Reference implementation: See `e2e` job in PR checks workflow
