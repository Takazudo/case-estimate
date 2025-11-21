---
description: Start implementation from a GitHub issue with automated branch setup and PR creation
---

# Issue Start Workflow

Accepts a GitHub Issue URL and starts implementation based on that Issue.

## Overview

This command starts implementation from an existing GitHub Issue and automates:
- Exploration of code and Issue comments
- Creation of appropriate branch
- Initial commit and push
- Pull Request creation
- AI review requests

## Workflow

### Step 1: Receive Issue URL

Receive Issue URL from user:
```
Example: https://github.com/Takazudo/case-estimate/issues/123
```

If Issue URL is not provided, ask the user:
```
Please provide the GitHub Issue URL.
Example: https://github.com/Takazudo/case-estimate/issues/123
```

### Step 2: Explore Issue

Get Issue details with `gh issue view` command:

```bash
gh issue view <ISSUE_NUMBER> --json title,body,comments,number
```

Information to retrieve:
- Issue number
- Title
- Body
- Comments (may contain implementation details or requirements)

### Step 3: Explore Codebase

Explore related code based on Issue content:
- Search for files or components mentioned in the Issue
- Check related existing implementation patterns
- Understand technical background needed for implementation

**Important**: If there are unclear points or ambiguous requirements, ask the user at this stage.

### Step 4: Verify Base Branch

Check current branch:
```bash
git branch --show-current
```

**Base Branch Decision Rules**:
- **Default**: Most new implementations start from `main` branch
- **Exception**: If a different base branch is specified in the Issue, use that
- **Verification**: Search Issue body/comments for keywords like "base branch", "from branch"

If current branch is not the correct base:
```bash
git checkout <BASE_BRANCH>
git pull origin <BASE_BRANCH>
```

### Step 5: Create New Branch

Branch name format: `topic/#{ISSUE_NO}/{FEATURE_NAME}`

Examples:
- `topic/#123/add-mercari-shops-workflow`
- `topic/#456/fix-panel-color-picker`

```bash
git checkout -b topic/#<ISSUE_NO>/<FEATURE_NAME>
```

**Determining FEATURE_NAME**:
- Generate a concise English name from Issue title
- Use kebab-case (lowercase + hyphens)
- Keep to approximately 20-40 characters

### Step 6: Create Initial Commit

Create an empty commit:
```bash
git commit --allow-empty -m "=== start <FEATURE_NAME> implementation ==="
```

Example:
```bash
git commit --allow-empty -m "=== start mercari-shops-workflow implementation ==="
```

### Step 7: Push Branch

Push the new branch to remote:
```bash
git push -u origin topic/#<ISSUE_NO>/<FEATURE_NAME>
```

### Step 8: Create Pull Request

**Important**: Always create PR against the **base branch** (usually `main`, or as specified in Issue)

```bash
gh pr create --base <BASE_BRANCH> --title "<TITLE>" --body "$(cat <<'EOF'
Closes #<ISSUE_NO>

## Summary
<Issue title and overview>

## Implementation Details
<Summary of what will be implemented>

## Related Issue
#<ISSUE_NO>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**PR Title Format**:
- Include issue number and title
- Examples: `feat: Add Mercari Shops workflow (#123)`
- Examples: `fix: Fix panel color picker bug (#456)`

### Step 9: Request AI Reviews

Execute `/ai-pr-review` command processing on the created PR:

1. **Request Codex Review**:
```bash
gh pr comment <PR_NUMBER> --body "@codex review"
```

2. **Assign GitHub Copilot as Reviewer**:
Note: GitHub Copilot typically needs to be added manually through the UI. The API call may succeed but Copilot might not actually be assigned. Always inform the user to manually verify and add Copilot if needed.

```bash
gh api --method POST repos/Takazudo/case-estimate/pulls/<PR_NUMBER>/requested_reviewers \
  -f "reviewers[]=Copilot"
```

Then provide manual instructions to the user:
- Visit: https://github.com/Takazudo/case-estimate/pull/<PR_NUMBER>
- Click the gear icon next to "Reviewers" in the right sidebar
- Select "Copilot" from the list

### Step 10: Start Implementation

Once setup is complete, start implementation:
- Implement feature based on Issue requirements
- Explore code as needed
- Commit & push regularly

### Step 11: Final Report

Report the following to the user:

```
✅ Preparation complete for Issue #<ISSUE_NO> implementation

Executed operations:
  ✓ Explored and understood Issue content
  ✓ Verified base branch: <BASE_BRANCH>
  ✓ Created new branch: topic/#<ISSUE_NO>/<FEATURE_NAME>
  ✓ Created initial commit and pushed
  ✓ Created Pull Request: #<PR_NUMBER>
  ✓ Requested Codex review
  ⚠️  GitHub Copilot: Please add manually through UI

📋 Issue: <ISSUE_URL>
🔀 PR: <PR_URL>
🌿 Branch: topic/#<ISSUE_NO>/<FEATURE_NAME>
📍 Base: <BASE_BRANCH>

Starting implementation...
```

Then begin implementation.

## Error Handling

- **Invalid Issue URL**: Request correct format URL
- **Issue doesn't exist**: Verify issue number
- **Branch already exists**: Confirm how to handle existing branch
- **Push error**: Check permissions and remote settings
- **PR creation error**: Check if PR already exists
- **AI review error**: Display error content (continue processing)

## Usage Examples

### Basic Usage

```bash
/issue-start https://github.com/Takazudo/case-estimate/issues/123
```

or

```bash
/issue-start #123
```

Expected output:
```
Exploring Issue #123...

📋 Issue #123: "Add Mercari Shops delivery workflow"

Confirmed requirements:
- Add shipping method selection
- Implement delivery time calculator
- Update price estimation

Current branch: main ✓
Will use as base branch.

Creating new branch: topic/#123/add-mercari-shops-workflow
Creating initial commit...
Pushing...
Creating Pull Request...

✅ Preparation complete for Issue #123 implementation

Executed operations:
  ✓ Explored and understood Issue content
  ✓ Verified base branch: main
  ✓ Created new branch: topic/#123/add-mercari-shops-workflow
  ✓ Created initial commit and pushed
  ✓ Created Pull Request: #456
  ✓ Requested Codex review
  ⚠️  GitHub Copilot: Please add manually through UI

📋 Issue: https://github.com/Takazudo/case-estimate/issues/123
🔀 PR: https://github.com/Takazudo/case-estimate/pull/456
🌿 Branch: topic/#123/add-mercari-shops-workflow
📍 Base: main

Starting implementation...
```

### When Base Branch is Specified

If Issue body contains something like:
```
Note: This should be branched from `feature/new-panel-system` instead of main
```

Output:
```
Exploring Issue #123...

📋 Issue #123: "Add custom panel shapes support"

⚠️  Found base branch specification in Issue: feature/new-panel-system
Current branch: main
Switching to base branch...

git checkout feature/new-panel-system
git pull origin feature/new-panel-system

Creating new branch: topic/#123/add-custom-panel-shapes
...

📍 Base: feature/new-panel-system
```

## Technical Notes

- **Issue Number Extraction**: Extract number from URL or `#123` format
- **GitHub CLI**: Use `gh` command for all GitHub operations
- **Repository**: `Takazudo/case-estimate`
- **Branch Naming**: Follow strict format `topic/#<NO>/<NAME>`
- **PR Base**: Use `main` unless explicitly specified in Issue

## Takazudo Modular Project Specific Notes

- **Package Manager**: Use `pnpm`
- **File Naming**: Use kebab-case for all TypeScript/JavaScript files (e.g., `case-selector.tsx`, not `CaseSelector.tsx`)
- **Component Names**: Use PascalCase for exported component names (React convention)
- **Documentation**: Developer notes go in `__inbox/` directory
- **Tech Stack**: React 19 with Next.js, TypeScript, Tailwind CSS 4
- **Testing**: Playwright smoke tests included; run with `pnpm run test`
- **CI/CD**: Automatic preview deployments for all PRs via Netlify

## Your Response

When this command is executed:

1. **Verify Issue URL**: Get Issue URL or number from arguments
2. **Explore Issue**: Get content with `gh issue view`
3. **Explore Code**: Investigate related code (as needed)
4. **Confirm Unclear Points**: Ask user if requirements are ambiguous
5. **Execute Branch Creation Flow**: Run Steps 4-8 sequentially
6. **AI Review**: Execute `/ai-pr-review` processing
7. **Start Implementation**: Implement based on Issue requirements
8. **Final Report**: Report executed operations and links

**Important**: Execute all operations automatically and start implementation after completion. Only ask for confirmation when requirements are unclear.
