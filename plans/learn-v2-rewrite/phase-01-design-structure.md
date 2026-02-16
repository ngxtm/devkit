# Phase 1: Design New Structure

> Parent: [plan.md](./plan.md)

## Overview
- Date: 2026-02-16
- Priority: P1
- Implementation: Done
- Review: Approved

## Key Insights
- Current learn.md is 477 lines - 4x longer than the next largest command (code.md=205)
- Most bulk comes from verbose markdown templates the AI doesn't need
- Existing `codingLevel` system (0-5) already handles adaptive difficulty
- 7 phases is excessive - can merge to 4 without losing functionality

## New Phase Architecture

### Phase 1: INIT (auto, no user interaction)
- Detect language from project (use detect.js patterns + extended table)
- Scan project architecture (key dirs, file patterns, frameworks)
- Check for existing learn file (resume support)
- Set verify strategy
- Determine mode from codingLevel (0-1=Deep, 2-3=Standard, 4-5=Quick)
- If codingLevel not set → ask user

### Phase 2: LEARN (skip in Quick mode)
- WebSearch official docs for topic
- Socratic: ask user "What do you think X does?" before explaining
- Explain concepts using project's actual code as examples
- Checkpoint: understood? continue?

### Phase 3: BUILD (core phase)
- Plan implementation steps (3-7 steps)
- For each step:
  - Explain before coding (skip in Quick)
  - Write code (real, no placeholders)
  - Verify: syntax → run → test
  - Socratic: "Why did we use X instead of Y?" (Deep mode only)
  - Checkpoint per step

### Phase 4: WRAP-UP
- Summary of what was built
- Key takeaways
- Optional quiz (ask user)
- Save tutorial to `learn/{date}-{topic}.md`
- Suggest next learning topics

## Extended Language Table

| Language | Config Files | Verify Command |
|----------|-------------|----------------|
| TypeScript | tsconfig.json | `npx tsc --noEmit` |
| JavaScript | package.json, *.mjs | `node --check <file>` |
| Python | pyproject.toml, requirements.txt | `python -m py_compile <file>` + `python <file>` |
| Go | go.mod | `go build ./...` + `go test ./...` |
| Rust | Cargo.toml | `cargo check` + `cargo test` |
| Java | pom.xml, build.gradle | `javac <file>` / `./gradlew compileJava` |
| Kotlin | build.gradle.kts | `kotlinc <file>` / `./gradlew compileKotlin` |
| C# / Unity | *.csproj, *.sln | `dotnet build` |
| Dart/Flutter | pubspec.yaml | `dart analyze` + `flutter test` |
| Swift | Package.swift | `swift build` |
| PHP | composer.json | `php -l <file>` |
| Ruby | Gemfile | `ruby -c <file>` |
| Elixir | mix.exs | `mix compile` |
| Zig | build.zig | `zig build` |
| Lua | *.lua | `luac -p <file>` |
| Shell | *.sh | `bash -n <file>` + `shellcheck <file>` |
| C/C++ | Makefile, CMakeLists.txt | `make` / `cmake --build .` |

## Resume YAML Frontmatter

```yaml
---
topic: "JWT authentication"
language: typescript
phase: BUILD
step: 3
total_steps: 5
mode: standard
started: 2026-02-16T10:30:00
updated: 2026-02-16T11:15:00
---
```

## Todo
- [x] Design 4-phase architecture
- [x] Design extended language table
- [x] Design resume frontmatter format
- [x] Write the actual learn.md v2.0

## Success Criteria
- [x] New structure is clear and concise
- [x] All 10 improvements addressed in design
- [x] Compatible with codingLevel system

## Risk Assessment & Mitigations

| Risk | Severity | Status | Mitigation Applied |
|------|----------|--------|-------------------|
| Single file rewrite breaks existing `/learn` invocations | Low | Resolved | Kept same YAML frontmatter `name: learn` and `argument-hint: [topic]` — backward compatible |
| Skill file sync could be forgotten | Low | Resolved | Automated: both files verified identical via diff check |
| Design too ambitious for single file | Low | Resolved | Achieved 147 lines — well under 200 target |
