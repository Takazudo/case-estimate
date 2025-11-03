---
description: Generate concise custom instructions for GitHub Copilot
---

Generate a simplified, one-page custom instruction document optimized for GitHub Copilot.

This document should be concise (1-2 pages max) since Copilot has limited context window. Focus on:

**Key Information to Include:**

1. **Critical Code Conventions**
   - File naming rules (kebab-case)
   - Import patterns (@/ alias)
   - Component structure

2. **Tech Stack**
   - React 19 + Next.js 15
   - TypeScript (strict mode)
   - Tailwind CSS 4

3. **Code Patterns**
   - Client vs server components
   - Hook patterns
   - Type definitions
   - Testing approach

4. **Quick Examples**
   - Component template
   - Hook template
   - Test template

**Instructions:**

1. Read CLAUDE.md to understand the project
2. Explore key files:
   - `src/components/configurator.tsx` (main patterns)
   - `src/hooks/use-url-persistence.ts` (hook pattern)
   - `types/index.ts` (type definitions)
   - `eslint.config.js` (code rules)
3. Generate a concise markdown document covering the essentials
4. Save it as `COPILOT.md` in the project root
5. Keep it under 200 lines - focus on actionable patterns
6. Use code examples liberally
7. Highlight critical "don't do this" warnings

The goal is to give Copilot just enough context to generate code that follows our conventions without needing to ask questions.
