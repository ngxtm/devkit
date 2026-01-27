# Codebase Understanding Phase

**When to skip:** If provided with scouter reports, skip this phase.

## Core Activities

### Parallel Scout Agents

- Use `/scouter:{variant}` (preferred) or `/scouter` (fallback) slash command to search the codebase for files needed to complete the task
- Each scouter locates files needed for specific task aspects
- Wait for all scouter agents to report back before analysis
- Efficient for finding relevant code across large codebases

### Essential Documentation Review

ALWAYS read these files first when they exist under `./documents/`:

1. **`~/.{TOOL}/agent-assistant/rules/AGENT-RULES.md`** (IMPORTANT)
   (Fallback: `~/.{TOOL}/agent-assistant/rules/AGENT-RULES.md`)
   - File Name Conventions & Size Management
   - Development rules and best practices
   - Code quality standards & Security guidelines

2. **`./documents/knowledge-overview.md`** — Project purpose, goals, tech stack, getting started
3. **`./documents/knowledge-architecture.md`** — System design, components, data flow, patterns
4. **`./documents/knowledge-source-base.md`** — Project structure, modules, entry points
5. **`./documents/knowledge-domain.md`** — Data models, API contracts, domain entities
6. **`./documents/knowledge-standards.md`** — Coding conventions, naming, commit format
7. **`./docs/design-guidelines.md`** (if exists) — Design system, branding, UI/UX
   - Design system guidelines
   - Branding and UI/UX conventions
   - Component library usage

### Environment Analysis

- Review development environment setup
- Analyze dotenv files and configuration
- Identify required dependencies
- Understand build and deployment processes

### Pattern Recognition

- Study existing patterns in codebase
- Identify conventions and architectural decisions
- Note consistency in implementation approaches
- Understand error handling patterns

### Integration Planning

- Identify how new features integrate with existing architecture
- Map dependencies between components
- Understand data flow and state management
- Consider backward compatibility

## Best Practices

- Start with documentation before diving into code
- Use scouts for targeted file discovery
- Document patterns found for consistency
- Note any inconsistencies or technical debt
- Consider impact on existing features
