---
description: Request AI reviews from Codex and GitHub Copilot for current PR
---

Request AI-powered code reviews from both Codex and GitHub Copilot for the current pull request.

**Instructions:**

1. **Get the current PR number:**
   ```bash
   gh pr view --json number -q .number
   ```

2. **Check if this is a re-review request:**
   ```bash
   gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/reviews --jq '.[] | select(.user.login | contains("copilot")) | {user: .user.login, state: .state}'
   ```

3. **Post Codex review trigger:**
  - Always post "@codex review" comment to trigger Codex
   ```bash
   gh pr comment {PR_NUMBER} --body "@codex review"
   ```

4. **Handle GitHub Copilot reviewer:**
  - **If Copilot has NOT reviewed yet:** Add as reviewer using API
   ```bash
   gh api --method POST repos/{owner}/{repo}/pulls/{PR_NUMBER}/requested_reviewers \
     -f "reviewers[]=Copilot"
   ```

  - **If Copilot HAS already reviewed:** Inform user to manually re-request via UI
    - GitHub's API does NOT support re-requesting Copilot reviews programmatically
    - Attempted workaround (DELETE then POST) also fails - API accepts but doesn't add Copilot
    - User MUST: Go to PR → Reviewers section → Click re-review button (↻) next to Copilot
    - Alternative: Configure "Review new pushes" in repo settings for automatic re-reviews

5. **Report results:**
  - Codex: Always reports success with comment link
  - Copilot: Report if added as new reviewer OR if manual re-request needed

**Error Handling:**
- If no PR found: Inform user
- If API fails: Show error and suggest manual steps
- If Copilot already reviewed: Explain manual re-request process

**Example Output:**

For first-time review:
```
✅ AI reviews requested for PR #42

📝 Codex: Review triggered - https://github.com/user/repo/pull/42#comment-xxx
🤖 GitHub Copilot: Added as reviewer
```

For re-review:
```
✅ AI review re-requested for PR #42

📝 Codex: Review triggered - https://github.com/user/repo/pull/42#comment-xxx
🤖 GitHub Copilot: Already reviewed this PR
   → To re-request: Go to PR → Reviewers → Click re-review button next to Copilot
   → Or: Copilot may auto-review new pushes if configured in repo settings
```

**Note:** GitHub Copilot's PR review API has limitations. Once Copilot submits a review, it cannot be easily re-requested programmatically. The most reliable method for re-reviews is:
1. Using the GitHub UI re-request button, OR
2. Configuring automatic "Review new pushes" in repository settings
