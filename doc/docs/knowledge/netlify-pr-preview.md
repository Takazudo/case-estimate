# Netlify PR Preview Deployments

## Overview

Automatic preview deployments for pull requests allow reviewers to test changes in a live environment before merging. This eliminates "works on my machine" issues and speeds up the review process.

## Benefits

### For Developers

- **Visual verification** - See UI changes in real browser
- **Share with stakeholders** - Non-technical reviewers can test
- **Test integrations** - Verify API integrations, third-party services
- **Mobile testing** - Test responsive design on actual devices

### For Teams

- **Faster reviews** - Reviewers can see changes immediately
- **Reduced bugs** - Catch issues before they reach production
- **Better collaboration** - Design and product teams can provide feedback
- **Documentation** - Preview URL serves as proof of implementation

## Implementation

### Prerequisites

Same as production deployment:

1. **Netlify Auth Token** - Add to `NETLIFY_AUTH_TOKEN` secret
2. **Netlify Site ID** - Add to `NETLIFY_SITE_ID` secret

### Basic PR Preview

```yaml
name: PR Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy Preview
        uses: nwtgck/actions-netlify@v3.0
        with:
          publish-dir: ./out
          production-deploy: false
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'PR #${{ github.event.pull_request.number }} preview'
          enable-pull-request-comment: true
          enable-commit-comment: false
          overwrites-pull-request-comment: true
          alias: pr-${{ github.event.pull_request.number }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Advanced: With Quality Checks

This project's implementation - only deploy if tests pass:

```yaml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]
    # No branch restriction - run for ALL PRs

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

      - name: Run type checking
        run: pnpm run typecheck

      - name: Run linting
        run: pnpm run lint

      - name: Run format check
        run: pnpm run format

      - name: Run unit tests
        run: pnpm run test:run

      - name: Build application
        run: pnpm run build
        env:
          NODE_ENV: production

  pr-preview:
    runs-on: ubuntu-latest
    needs: quality-checks # Only deploy if checks pass
    if: github.event_name == 'pull_request'
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

      - name: Build application with docs
        run: pnpm run build:with-docs
        env:
          NODE_ENV: production

      - name: Deploy PR Preview to Netlify
        id: netlify
        uses: nwtgck/actions-netlify@v3.0
        with:
          publish-dir: ./out
          production-deploy: false
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Deploy PR #${{ github.event.pull_request.number }} preview'
          enable-pull-request-comment: false # We'll create custom comment
          enable-commit-comment: false
          overwrites-pull-request-comment: true
          alias: pr-${{ github.event.pull_request.number }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 5

      - name: Comment PR with preview URLs
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            const prNumber = ${{ github.event.pull_request.number }};
            const deployUrl = '${{ steps.netlify.outputs.deploy-url }}';

            const comment = `### 🚀 Netlify Preview Deployment

            | Status | Preview | Documentation |
            |--------|---------|---------------|
            | ✅ Ready | [Visit Site](${deployUrl}) | [View Docs](${deployUrl}/doc/) |

            **Preview URLs:**
            - 🌐 Main Site: ${deployUrl}
            - 📚 Documentation: ${deployUrl}/doc/

            ---
            <sub>🤖 This preview will update automatically when you push new commits.</sub>`;

            // Find and update existing comment or create new one
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
            });

            const botComment = comments.find(comment =>
              comment.user.type === 'Bot' &&
              comment.body.includes('Netlify Preview Deployment')
            );

            if (botComment) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body: comment
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: prNumber,
                body: comment
              });
            }
```

## Key Features

### Stable Preview URLs

Using `alias` parameter creates predictable URLs:

```yaml
alias: pr-${{ github.event.pull_request.number }}
```

This generates URLs like:

- `https://pr-37--your-site.netlify.app/`

Benefits:

- **Consistent URL** - Same URL across commits
- **Easy sharing** - Share URL that doesn't change
- **Bookmarkable** - Stakeholders can bookmark for testing

### Custom PR Comments

The action can auto-comment, but custom comments provide better information:

```yaml
enable-pull-request-comment: false # Disable default
enable-commit-comment: false
```

Then use `actions/github-script` to create formatted comment with:

- Multiple preview URLs (main site, docs, etc.)
- Status information
- Build details
- Custom styling

### Update vs. Create Comments

The implementation updates existing comments instead of creating new ones:

```javascript
const botComment = comments.find(comment =>
  comment.user.type === 'Bot' &&
  comment.body.includes('Netlify Preview Deployment')
);

if (botComment) {
  // Update existing
  await github.rest.issues.updateComment(...)
} else {
  // Create new
  await github.rest.issues.createComment(...)
}
```

Benefits:

- **No spam** - One comment per PR
- **Clear history** - Easy to see latest deployment
- **Clean PR thread** - Reduces noise

## Advanced Patterns

### Preview for Specific Branches Only

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - main
      - develop
```

### Conditional Deployment

Skip preview for draft PRs:

```yaml
pr-preview:
  if: github.event.pull_request.draft == false
```

### Deploy Multiple Apps

Deploy frontend and backend separately:

```yaml
- name: Deploy Frontend
  uses: nwtgck/actions-netlify@v3.0
  with:
    publish-dir: ./frontend/out
    alias: pr-${{ github.event.pull_request.number }}-frontend

- name: Deploy Backend
  uses: nwtgck/actions-netlify@v3.0
  with:
    publish-dir: ./backend/out
    alias: pr-${{ github.event.pull_request.number }}-backend
```

### Environment Variables in Preview

```yaml
- name: Build with preview env vars
  run: npm run build
  env:
    NODE_ENV: preview
    API_URL: ${{ secrets.PREVIEW_API_URL }}
    FEATURE_PREVIEW: true
```

## Performance Optimization

### Reuse Build Artifacts

Don't rebuild for preview if already built in tests:

```yaml
quality-checks:
  steps:
    - name: Build
      run: npm run build

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-output
        path: ./out

pr-preview:
  needs: quality-checks
  steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-output
        path: ./out

    - name: Deploy (no rebuild needed)
      uses: nwtgck/actions-netlify@v3.0
```

### Concurrent Deployment

Allow preview to deploy while tests run:

```yaml
jobs:
  quality-checks:
    # ... tests

  e2e:
    needs: quality-checks
    # ... E2E tests

  pr-preview:
    needs: quality-checks # Only needs quality checks, not E2E
```

## Troubleshooting

### Preview Not Updating

- Check if `alias` parameter is set correctly
- Verify `overwrites-pull-request-comment: true`
- Check GitHub Actions logs for deployment errors

### Preview Shows Old Content

- Clear browser cache
- Check if build artifacts are cached incorrectly
- Verify build command runs in preview workflow

### Comment Not Posted

- Check `github-token` has `pull-requests: write` permission
- Verify bot has access to comment on PRs
- Review GitHub Actions logs for API errors

### Preview URL 404

- Verify `publish-dir` points to correct directory
- Check if build produces output
- Review Netlify deploy logs

## Cost Considerations

### Netlify Bandwidth

- Each preview deployment uses bandwidth
- Consider limiting preview branches
- Clean up old deployments regularly

### GitHub Actions Minutes

- Preview deployment uses CI minutes
- Optimize build time with caching
- Consider skipping preview for draft PRs

## Best Practices

1. **Always deploy after quality checks** - Don't deploy broken code
2. **Use stable URLs with alias** - Makes sharing easier
3. **Include multiple app sections** - Link to all parts of the app
4. **Update comments, don't spam** - Keep PR thread clean
5. **Add context to comments** - Include build time, commit SHA
6. **Test preview URLs** - Add smoke tests for preview deploys
7. **Set appropriate timeouts** - Prevent hung deployments
8. **Use concurrency control** - Cancel old deployments when new commits pushed

## Security

1. **Be careful with secrets in preview** - Don't expose production keys
2. **Consider authentication** - Add basic auth to preview deployments
3. **Limit preview access** - Use Netlify's access control if needed
4. **Clean up previews** - Remove old previews regularly

## Netlify Configuration

### Auto-cleanup Old Previews

In Netlify settings:

- **Deploys** → **Deploy contexts** → **Branch deploys** → Set retention

### Branch Deploy Controls

```toml
# netlify.toml
[context.deploy-preview]
  command = "echo 'Disabled - deploying from GitHub Actions'"

[context.branch-deploy]
  command = "echo 'Disabled - deploying from GitHub Actions'"
```

## Additional Resources

- [Netlify Deploy Previews Documentation](https://docs.netlify.com/site-deploys/deploy-previews/)
- [actions-netlify GitHub Action](https://github.com/nwtgck/actions-netlify)
- [GitHub Actions Script Documentation](https://github.com/actions/github-script)

## Related

- [Deploying to Netlify from GitHub Actions](./netlify-github-actions-deploy.md) - Production deployment setup
