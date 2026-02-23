---
name: react-doctor
description: Run react-doctor to scan React codebase for health issues. Diagnose security, performance, correctness, architecture problems with 0-100 score.
upstream: https://github.com/millionco/react-doctor
upstream-version: "0.0.0"
triggers:
  - react-doctor
  - react health
  - react scan
  - react lint
  - code health
  - react audit
  - react score
role: tool
scope: diagnostics
output-format: analysis
---

# React Doctor

Scan React codebase for security, performance, correctness, and architecture issues. Outputs a 0-100 health score with actionable diagnostics.

## When to Use

- After making React changes (catch issues early)
- During code review or PR review
- Finishing a feature before merge
- Periodic codebase health check
- Setting up CI quality gates

## Quick Start

```bash
# Full scan with file details
npx -y react-doctor@latest . --verbose

# Scan only changed files (vs base branch)
npx -y react-doctor@latest . --verbose --diff

# Score only (for CI)
npx -y react-doctor@latest . --score
```

## How It Works

Detects framework (Next.js, Vite, Remix, etc.), React version, and compiler setup, then runs two parallel passes:

1. **Lint** — 60+ rules across 8 categories
2. **Dead code** — unused files, exports, types, duplicates

## Rule Categories

| Category | Examples |
|----------|----------|
| State & Effects | missing deps, stale closures, unnecessary re-renders |
| Performance | unoptimized renders, missing memoization, large bundles |
| Architecture | circular deps, prop drilling, god components |
| Bundle Size | unused imports, heavy dependencies |
| Security | dangerouslySetInnerHTML, XSS vectors |
| Correctness | key prop misuse, effect cleanup, race conditions |
| Accessibility | missing ARIA, no-autofocus, semantic HTML |
| Framework-specific | Next.js patterns, React Native issues |

## CLI Flags

| Flag | Description |
|------|-------------|
| `--verbose` | Show file details and line numbers per rule |
| `--no-lint` | Skip linting |
| `--no-dead-code` | Skip dead code detection |
| `--score` | Output only the score |
| `--diff [base]` | Scan only files changed vs base branch |
| `--project <name>` | Select workspace project (comma-separated) |
| `-y, --yes` | Skip prompts, scan all workspace projects |
| `--fix` | Open Ami to auto-fix all issues |

## Configuration

Create `react-doctor.config.json` at project root:

```json
{
  "ignore": {
    "rules": ["react/no-danger", "knip/exports"],
    "files": ["src/generated/**"]
  }
}
```

Or use `"reactDoctor"` key in `package.json`. Config file takes precedence.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `ignore.rules` | `string[]` | `[]` | Rules to suppress (`plugin/rule` format) |
| `ignore.files` | `string[]` | `[]` | File globs to exclude |
| `lint` | `boolean` | `true` | Enable/disable lint checks |
| `deadCode` | `boolean` | `true` | Enable/disable dead code detection |
| `verbose` | `boolean` | `false` | Show file details per rule |
| `diff` | `boolean\|string` | — | Force diff mode or pin base branch |

## Node.js API

```js
import { diagnose } from "react-doctor/api";
const result = await diagnose(".", { lint: true, deadCode: true });
// result.score    → { score: 82, label: "Good" }
// result.diagnostics → Array of { filePath, plugin, rule, severity, message, help, line, column, category }
```

## Workflow

1. **Run scan** → `npx -y react-doctor@latest . --verbose`
2. **Read score** → 75+ Great, 50-74 Needs work, <50 Critical
3. **Fix errors first** → errors weigh more than warnings
4. **Re-run** → verify score improved
5. **Iterate** → address warnings if time permits

## Scoring

- **75-100** — Great health
- **50-74** — Needs work
- **0-49** — Critical issues
- Errors weigh more than warnings in score calculation

## GitHub Actions

```yaml
- uses: millionco/react-doctor@main
  with:
    diff: main
    verbose: true
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

Posts findings as PR comment when `github-token` is set on `pull_request` events.

## Related Skills

- **react-expert** — Fix identified React issues
- **code-review** — Include react-doctor scan in reviews
- **test-master** — Dead code findings inform test coverage gaps
