---
description: ⚡⚡⚡⚡ Analyze the codebase and create initial documentation
---

## Phase 1: Parallel Codebase Scouting

1. Scan the codebase and calculate the number of files with LOC in each directory (skip credentials, cache or external modules directories, such as `.claude`, `.opencode`, `.git`, `tests`, `node_modules`, `__pycache__`, `secrets`, etc.)
2. Target directories **that actually exist** - adapt to project structure, don't hardcode paths
3. Main agent spawns multiple Task agents for scouting via Task tool: Task(subagent_type="general-purpose", prompt="You are a scout. Read and analyze these directories...", description="Scout [area]")
   - Write a detailed instructions prompt for each Task agent with exact directories or files it should read
   - Each Task agent has less than 200K tokens of context window
   - Amount of Task agents depends on the current system resources available and project size in step 1
   - Each Task agent must return a detailed summary report to a main agent
5. Main agent merges scout reports into context summary and delegate to Task agent for docs management to update documentation (next phase)

## Phase 2: Documentation Creation (Task Agent for Docs Management)

Pass the gathered file list to Task agent for docs management to create initial documentation: Task(subagent_type="general-purpose", prompt="You are a docs-manager. Create initial documentation...", description="Create documentation")
- `README.md`: Update README with initial documentation (keep it under 300 lines)
- `docs/project-overview-pdr.md`: Project overview and PDR (Product Development Requirements)
- `docs/codebase-summary.md`: Codebase summary
- `docs/code-standards.md`: Codebase structure and code standards
- `docs/system-architecture.md`: System architecture
- `docs/project-roadmap.md`: Project roadmap
- `docs/deployment-guide.md` [optional]: Deployment guide
- `docs/design-guidelines.md` [optional]: Design guidelines

Use `docs/` directory as the source of truth for documentation.

## Phase 3: Size Check (Post-Generation)

After docs-manager completes:
1. Run `wc -l docs/*.md 2>/dev/null | sort -rn` to check LOC
2. Use `docs.maxLoc` from session context (default: 800)
3. For files exceeding limit:
   - Report which files exceed and by how much
   - docs-manager should have already split proactively per Section 6 guidelines
   - If still oversized, ask user: split now or accept as-is?

**IMPORTANT**: **Do not** start implementing.