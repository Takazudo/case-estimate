---
description: Request AI reviews from Codex and GitHub Copilot for current PR
---

# AI PR Review

Request AI-powered code reviews from both Codex and GitHub Copilot for the current pull request.

## What This Command Does

1. **Triggers Codex Review**: Posts `@codex review` comment on the PR
2. **Assigns GitHub Copilot**: Adds `copilot-pull-request-reviewer[bot]` as a reviewer

## Instructions

Execute the following steps:

1. **Get the current PR number**:
   ```bash
   gh pr view --json number -q .number
   ```

2. **Post Codex review trigger**:
   ```bash
   gh pr comment <PR_NUMBER> --body "@codex review"
   ```

3. **Get repository info and assign Copilot reviewer**:
   ```bash
   # Get owner and repo name
   REPO_INFO=$(gh repo view --json owner,name -q '.owner.login + "/" + .name')

   # Add Copilot as reviewer
   gh api --method POST repos/$REPO_INFO/pulls/<PR_NUMBER>/requested_reviewers \
     -f "reviewers[]=copilot-pull-request-reviewer[bot]"
   ```

4. **Report success**: Inform the user that both AI reviewers have been requested

## Error Handling

- If no PR is found for the current branch, inform the user
- If the API call fails, show the error message and suggest manual steps
- If Copilot is already a reviewer, that's okay (the API will handle it gracefully)

## Example Output

After successful execution, report:
```
✅ AI reviews requested for PR #123

📝 Codex: Review triggered with @codex mention
🤖 GitHub Copilot: Added as reviewer
```
