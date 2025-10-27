# Deploying to Netlify from GitHub Actions

## Overview

While Netlify provides built-in CI/CD, deploying from GitHub Actions gives you more control over the build process, allows integration with other CI steps, and enables custom deployment logic.

## Why Deploy from GitHub Actions?

### Advantages

1. **Unified CI/CD Pipeline** - Run tests, quality checks, and deployment in one workflow
2. **Custom Build Logic** - Complex build steps that Netlify's CI can't handle
3. **Conditional Deployment** - Deploy only after specific checks pass
4. **Build Artifacts Reuse** - Build once, deploy multiple times
5. **Better Control** - Full control over build environment and dependencies
6. **Integration** - Easy integration with other GitHub Actions tools

### When to Use

- You need to run extensive tests before deployment
- Your build process requires specific tools or configurations
- You want to deploy to multiple environments
- You need to coordinate deployment with other services

## Setup: Disable Netlify's Auto-Deploy

To prevent conflicts, disable Netlify's automatic builds:

### Via Netlify Dashboard

1. Go to **Site Settings** → **Build & deploy**
2. Under **Continuous deployment**, click **Edit settings**
3. Set **Build command** to empty or a no-op command
4. **Save** changes

### Via netlify.toml (Recommended)

Create `netlify.toml` in your repository root:

```toml
[build]
  # Disable automatic builds - we deploy from GitHub Actions
  command = "echo 'Build disabled - deploying from GitHub Actions'"
  publish = "out"

[build.environment]
  # Set Node.js version if needed
  NODE_VERSION = "20"
```

This approach is version-controlled and more maintainable.

## Implementation

### Prerequisites

1. **Netlify Auth Token**
  - Go to **User settings** → **Applications** → **Personal access tokens**
  - Create new token with "Deploy" permissions
  - Add to GitHub secrets as `NETLIFY_AUTH_TOKEN`

2. **Netlify Site ID**
  - Go to **Site settings** → **General** → **Site details**
  - Copy **API ID**
  - Add to GitHub secrets as `NETLIFY_SITE_ID`

### Basic Deployment Workflow

```yaml
name: Deploy to Netlify

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3.0
        with:
          publish-dir: ./out
          production-deploy: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Deploy from GitHub Actions - ${{ github.sha }}'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 5
```

### With Quality Gates

This project's approach - only deploy after all checks pass:

```yaml
name: Production Deploy

on:
  push:
    branches:
      - main

jobs:
  quality-checks:
    runs-on: ubuntu-latest
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

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type checking
        run: pnpm run typecheck

      - name: Linting
        run: pnpm run lint

      - name: Unit tests
        run: pnpm run test:run

      - name: Build
        run: pnpm run build
        env:
          NODE_ENV: production

  deploy:
    runs-on: ubuntu-latest
    needs: quality-checks
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

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build with docs
        run: pnpm run build:with-docs
        env:
          NODE_ENV: production

      - name: Deploy to Netlify Production
        uses: nwtgck/actions-netlify@v3.0
        with:
          publish-dir: ./out
          production-deploy: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Production deploy - ${{ github.sha }}'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 10
```

## Using Netlify CLI Directly

For more control, use Netlify CLI instead of the action:

```yaml
- name: Install Netlify CLI
  run: npm install -g netlify-cli

- name: Deploy to Netlify
  run: |
    netlify deploy \
      --dir=./out \
      --site=${{ secrets.NETLIFY_SITE_ID }} \
      --auth=${{ secrets.NETLIFY_AUTH_TOKEN }} \
      --prod \
      --message="Deploy from GitHub Actions - ${{ github.sha }}"
```

### Capturing Deploy URL

```yaml
- name: Deploy to Netlify
  id: netlify-deploy
  run: |
    OUTPUT=$(netlify deploy \
      --dir=./out \
      --site=${{ secrets.NETLIFY_SITE_ID }} \
      --auth=${{ secrets.NETLIFY_AUTH_TOKEN }} \
      --prod \
      --json)

    DEPLOY_URL=$(echo "$OUTPUT" | jq -r '.deploy_url')
    echo "deploy-url=$DEPLOY_URL" >> $GITHUB_OUTPUT
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

- name: Output deployment URL
  run: echo "Deployed to ${{ steps.netlify-deploy.outputs.deploy-url }}"
```

## Common Patterns

### Deploy Only on Tag

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Deploy with Environment Variables

```yaml
- name: Build with environment
  run: pnpm run build
  env:
    NODE_ENV: production
    API_URL: ${{ secrets.PROD_API_URL }}
    FEATURE_FLAG_X: true
```

### Multi-Environment Deployment

```yaml
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    # Deploy to staging site

  deploy-production:
    if: github.ref == 'refs/heads/main'
    # Deploy to production site
```

## Troubleshooting

### Build Works Locally but Fails in CI

- Check Node.js version matches
- Verify all dependencies are in `package.json`
- Check for environment-specific code
- Review build logs for missing environment variables

### Deployment Timeout

- Increase `timeout-minutes` in the deploy step
- Check if build artifacts are too large
- Consider using deploy preview to debug

### Concurrent Deployments

Netlify queues concurrent deploys. Add concurrency control:

```yaml
concurrency:
  group: netlify-deploy-${{ github.ref }}
  cancel-in-progress: true
```

## Best Practices

1. **Always run quality checks before deploy** - Prevent broken deployments
2. **Use build caching** - Speed up CI with dependency and build caching
3. **Separate build and deploy** - Reuse build artifacts when possible
4. **Add deployment notifications** - Post to Slack, Discord, etc.
5. **Monitor deploy time** - Optimize if deploys take too long
6. **Use deploy previews for PRs** - Test before merging

## Security Considerations

1. **Never commit secrets** - Use GitHub Secrets for tokens
2. **Limit token permissions** - Use tokens with minimum required permissions
3. **Rotate tokens regularly** - Update tokens periodically
4. **Use environment-specific secrets** - Different tokens for staging/production

## Additional Resources

- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [actions-netlify GitHub Action](https://github.com/nwtgck/actions-netlify)
- [Netlify API Documentation](https://docs.netlify.com/api/get-started/)

## Related

- [PR Preview Deployments](./netlify-pr-preview.md) - Automatic preview URLs for pull requests
