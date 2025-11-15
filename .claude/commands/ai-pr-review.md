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
- **IMPORTANT:** GitHub Copilot cannot be added as a reviewer via API in most repositories
- The API call may succeed but Copilot won't actually be assigned
- **Always instruct the user to manually add Copilot:**
  1. Go to the PR page: https://github.com/{owner}/{repo}/pull/{PR_NUMBER}
  2. In the right sidebar under "Reviewers", click the gear icon
  3. Select "Copilot" from the list
  4. Copilot will automatically start reviewing

- **Attempt API call anyway** (in case repo has special access):
   ```bash
   gh api --method POST repos/{owner}/{repo}/pulls/{PR_NUMBER}/requested_reviewers \
     -f "reviewers[]=Copilot"
   ```

- **Then verify** if it actually worked:
   ```bash
   gh api repos/{owner}/{repo}/pulls/{PR_NUMBER} --jq '.requested_reviewers[] | select(.login == "Copilot") | .login'
   ```

5. **Report results:**
- Codex: Always reports success with comment link
- Copilot: Report API attempt result AND always provide manual instructions

**Error Handling:**
- If no PR found: Inform user
- If API fails: Show error and suggest manual steps
- If Copilot already reviewed: Explain manual re-request process

**Example Output:**

For first-time review:
```
✅ AI reviews requested for PR #42

📝 Codex: Review triggered - https://github.com/user/repo/pull/42#comment-xxx

🤖 GitHub Copilot: API call made, but verification shows Copilot was NOT assigned
   → Please manually add Copilot as a reviewer:
   → 1. Visit: https://github.com/user/repo/pull/42
   → 2. Click the gear icon next to "Reviewers" in the right sidebar
   → 3. Select "Copilot" from the list
   → 4. Copilot will automatically start reviewing
```

If API call succeeds:
```
✅ AI reviews requested for PR #42

📝 Codex: Review triggered - https://github.com/user/repo/pull/42#comment-xxx
🤖 GitHub Copilot: Successfully assigned as reviewer ✓
```

**Note:** GitHub Copilot's PR review API has significant limitations:
- In most repositories, the API accepts the request but doesn't actually assign Copilot
- The most reliable method is to manually add Copilot through the GitHub UI
- Once added, Copilot will automatically review the PR
- For re-reviews, use the re-request button (↻) next to Copilot in the UI
