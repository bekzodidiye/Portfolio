# GitHub Copilot & Agent Instructions

This repository is Bekzod Idiyev's Senior Full-Stack & Backend Portfolio built with React 19, TypeScript, Vite, and TailwindCSS v4.

## ⚠️ Mandatory Engineering Rules

Whenever a GitHub Copilot Agent or automated workspace session is initialized:

1. **Single Responsibility Principle (SRP) — 200-Line Limit:**
   - No `.ts` or `.tsx` file should exceed ~200 lines.
   - Decompose monolithic components into focused sub-components and custom hooks.
   - Refer to `.agents/rules/file_length_srp.md`.

2. **Strict Git Workflow:**
   - NEVER commit directly to `main`.
   - Always create a descriptive branch: `feat/...` or `fix/...`.
   - Submit changes via Pull Request (PR) targeting `main`.
   - Refer to `.agents/rules/git_workflow.md`.

3. **Code Verification:**
   - Verify TypeScript: `npx tsc --noEmit` must pass with 0 errors.
   - Verify Build: `npm run build` must succeed without warnings or errors.

4. **Multi-Agent System Standards:**
   - Full guidelines for architecture, security (OWASP Top 10), and accessibility (WCAG 2.1 AA) are codified in `AGENTS.md`.
