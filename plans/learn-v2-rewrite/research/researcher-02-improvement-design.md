# Research: Improvement Design for /learn v2.0

## 1. Adaptive Difficulty → Use Existing coding-level
Instead of new 3-mode system, leverage existing `codingLevel` (0-5):
- Level 0-1: Deep mode (full concepts, analogies, socratic questions)
- Level 2-3: Standard mode (concepts + code, balanced)
- Level 4-5: Quick mode (minimal explanation, jump to code)
- If not set, ask user at start

## 2. Phase Numbering Fix
Current: 7 phases (0-6) but checkpoints say "1/5"
Fix: 4 phases (INIT, LEARN, BUILD, WRAP-UP) - simpler, accurate
- INIT: detect + setup + codebase scan
- LEARN: concepts + socratic questions (skip if Quick mode)
- BUILD: code + verify + test (the core)
- WRAP-UP: summary + quiz + save

## 3. Web Search Integration
Add to LEARN phase:
```
Before explaining, search official docs:
WebSearch("{topic} {language} official documentation 2026")
WebFetch relevant result for latest API/patterns
```
Keep it optional - only when topic involves APIs or evolving tech.

## 4. Better Verify Strategy
Tiered verification:
1. Syntax check (existing) - always
2. Run code snippet - when possible
3. Run/write tests - for BUILD steps
4. Use project's existing test framework if detected

## 5. Socratic Method
Add "Think First" before each concept:
```
Before I explain, what do you think {concept} does?
[wait for user]
[then explain, referencing their answer]
```
Only in Deep/Standard modes. Skip in Quick.

## 6. Resume Support
YAML frontmatter in output file:
```yaml
---
topic: "JWT auth"
phase: BUILD
step: 3/5
mode: standard
started: 2026-02-16
---
```
On `/learn "topic"` → check for existing file → offer resume.

## 7. Tutorial Location
Change: `.claude/learn/` → `learn/` at project root
Better: Let user configure, default to `learn/`

## 8. Modern Languages
Merge with detect.js supported languages. Add:
- Dart/Flutter: `dart analyze`
- Kotlin: `kotlinc -script`
- Swift: `swift build`
- Unity C#: `dotnet build`
- Elixir: `mix compile`
- Lua: `luac -p`
- Zig: `zig build`

## 9. File Size Reduction
Target: <200 lines (from 477)
- Remove verbose markdown templates (AI knows how to format)
- Remove example session (20+ lines saved)
- Merge phases (7→4)
- Use concise instruction style like cook.md

## 10. Codebase-Aware
In INIT phase:
- Scan project structure (key dirs, patterns)
- Read relevant existing code
- Teach using project's conventions, not generic examples
- Reference existing files when applicable

## Architecture Decision
Single file rewrite, not split. Reasons:
- All other commands are single files
- Simpler maintenance
- skills/learn/SKILL.md should be identical copy (or removed, reference core-commands)
