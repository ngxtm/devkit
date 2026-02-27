---
name: subagent-driven-development
description: "Use when executing implementation plans with independent tasks in the current session"
risk: unknown
source: community
---

# Task Agent-Driven Development

Execute plan by dispatching fresh Task agent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Core principle:** Fresh Task agent per task + two-stage review (spec then quality) = high quality, fast iteration

## When to Use

```dot
digraph when_to_use {
    "Have implementation plan?" [shape=diamond];
    "Tasks mostly independent?" [shape=diamond];
    "Stay in this session?" [shape=diamond];
    "subagent-driven-development" [shape=box];
    "executing-plans" [shape=box];
    "Manual execution or brainstorm first" [shape=box];

    "Have implementation plan?" -> "Tasks mostly independent?" [label="yes"];
    "Have implementation plan?" -> "Manual execution or brainstorm first" [label="no"];
    "Tasks mostly independent?" -> "Stay in this session?" [label="yes"];
    "Tasks mostly independent?" -> "Manual execution or brainstorm first" [label="no - tightly coupled"];
    "Stay in this session?" -> "subagent-driven-development" [label="yes"];
    "Stay in this session?" -> "executing-plans" [label="no - parallel session"];
}
```

**vs. Executing Plans (parallel session):**
- Same session (no context switch)
- Fresh Task agent per task (no context pollution)
- Two-stage review after each task: spec compliance first, then code quality
- Faster iteration (no human-in-loop between tasks)

## The Process

```dot
digraph process {
    rankdir=TB;

    subgraph cluster_per_task {
        label="Per Task";
        "Dispatch implementer Task agent (./implementer-prompt.md)" [shape=box];
        "Implementer Task agent asks questions?" [shape=diamond];
        "Answer questions, provide context" [shape=box];
        "Implementer Task agent implements, tests, commits, self-reviews" [shape=box];
        "Dispatch spec reviewer Task agent (./spec-reviewer-prompt.md)" [shape=box];
        "Spec reviewer Task agent confirms code matches spec?" [shape=diamond];
        "Implementer Task agent fixes spec gaps" [shape=box];
        "Dispatch code quality reviewer Task agent (./code-quality-reviewer-prompt.md)" [shape=box];
        "Code quality reviewer Task agent approves?" [shape=diamond];
        "Implementer Task agent fixes quality issues" [shape=box];
        "Mark task complete in TodoWrite" [shape=box];
    }

    "Read plan, extract all tasks with full text, note context, create TodoWrite" [shape=box];
    "More tasks remain?" [shape=diamond];
    "Dispatch final code reviewer Task agent for entire implementation" [shape=box];
    "Use superpowers:finishing-a-development-branch" [shape=box style=filled fillcolor=lightgreen];

    "Read plan, extract all tasks with full text, note context, create TodoWrite" -> "Dispatch implementer Task agent (./implementer-prompt.md)";
    "Dispatch implementer Task agent (./implementer-prompt.md)" -> "Implementer Task agent asks questions?";
    "Implementer Task agent asks questions?" -> "Answer questions, provide context" [label="yes"];
    "Answer questions, provide context" -> "Dispatch implementer Task agent (./implementer-prompt.md)";
    "Implementer Task agent asks questions?" -> "Implementer Task agent implements, tests, commits, self-reviews" [label="no"];
    "Implementer Task agent implements, tests, commits, self-reviews" -> "Dispatch spec reviewer Task agent (./spec-reviewer-prompt.md)";
    "Dispatch spec reviewer Task agent (./spec-reviewer-prompt.md)" -> "Spec reviewer Task agent confirms code matches spec?";
    "Spec reviewer Task agent confirms code matches spec?" -> "Implementer Task agent fixes spec gaps" [label="no"];
    "Implementer Task agent fixes spec gaps" -> "Dispatch spec reviewer Task agent (./spec-reviewer-prompt.md)" [label="re-review"];
    "Spec reviewer Task agent confirms code matches spec?" -> "Dispatch code quality reviewer Task agent (./code-quality-reviewer-prompt.md)" [label="yes"];
    "Dispatch code quality reviewer Task agent (./code-quality-reviewer-prompt.md)" -> "Code quality reviewer Task agent approves?";
    "Code quality reviewer Task agent approves?" -> "Implementer Task agent fixes quality issues" [label="no"];
    "Implementer Task agent fixes quality issues" -> "Dispatch code quality reviewer Task agent (./code-quality-reviewer-prompt.md)" [label="re-review"];
    "Code quality reviewer Task agent approves?" -> "Mark task complete in TodoWrite" [label="yes"];
    "Mark task complete in TodoWrite" -> "More tasks remain?";
    "More tasks remain?" -> "Dispatch implementer Task agent (./implementer-prompt.md)" [label="yes"];
    "More tasks remain?" -> "Dispatch final code reviewer Task agent for entire implementation" [label="no"];
    "Dispatch final code reviewer Task agent for entire implementation" -> "Use superpowers:finishing-a-development-branch";
}
```

## Prompt Templates

- `./implementer-prompt.md` - Dispatch implementer Task agent
- `./spec-reviewer-prompt.md` - Dispatch spec compliance reviewer Task agent
- `./code-quality-reviewer-prompt.md` - Dispatch code quality reviewer Task agent

## Example Workflow

```
You: I'm using Task Agent-Driven Development to execute this plan.

[Read plan file once: docs/plans/feature-plan.md]
[Extract all 5 tasks with full text and context]
[Create TodoWrite with all tasks]

Task 1: Hook installation script

[Get Task 1 text and context (already extracted)]
[Dispatch implementation Task agent with full task text + context]

Implementer: "Before I begin - should the hook be installed at user or system level?"

You: "User level (~/.config/superpowers/hooks/)"

Implementer: "Got it. Implementing now..."
[Later] Implementer:
  - Implemented install-hook command
  - Added tests, 5/5 passing
  - Self-review: Found I missed --force flag, added it
  - Committed

[Dispatch spec compliance reviewer]
Spec reviewer: ✅ Spec compliant - all requirements met, nothing extra

[Get git SHAs, dispatch code quality reviewer]
Code reviewer: Strengths: Good test coverage, clean. Issues: None. Approved.

[Mark Task 1 complete]

Task 2: Recovery modes

[Get Task 2 text and context (already extracted)]
[Dispatch implementation Task agent with full task text + context]

Implementer: [No questions, proceeds]
Implementer:
  - Added verify/repair modes
  - 8/8 tests passing
  - Self-review: All good
  - Committed

[Dispatch spec compliance reviewer]
Spec reviewer: ❌ Issues:
  - Missing: Progress reporting (spec says "report every 100 items")
  - Extra: Added --json flag (not requested)

[Implementer fixes issues]
Implementer: Removed --json flag, added progress reporting

[Spec reviewer reviews again]
Spec reviewer: ✅ Spec compliant now

[Dispatch code quality reviewer]
Code reviewer: Strengths: Solid. Issues (Important): Magic number (100)

[Implementer fixes]
Implementer: Extracted PROGRESS_INTERVAL constant

[Code reviewer reviews again]
Code reviewer: ✅ Approved

[Mark Task 2 complete]

...

[After all tasks]
[Dispatch final code-reviewer]
Final reviewer: All requirements met, ready to merge

Done!
```

## Advantages

**vs. Manual execution:**
- Task agents follow TDD naturally
- Fresh context per task (no confusion)
- Parallel-safe (Task agents don't interfere)
- Task agent can ask questions (before AND during work)

**vs. Executing Plans:**
- Same session (no handoff)
- Continuous progress (no waiting)
- Review checkpoints automatic

**Efficiency gains:**
- No file reading overhead (controller provides full text)
- Controller curates exactly what context is needed
- Task agent gets complete information upfront
- Questions surfaced before work begins (not after)

**Quality gates:**
- Self-review catches issues before handoff
- Two-stage review: spec compliance, then code quality
- Review loops ensure fixes actually work
- Spec compliance prevents over/under-building
- Code quality ensures implementation is well-built

**Cost:**
- More Task agent invocations (implementer + 2 reviewers per task)
- Controller does more prep work (extracting all tasks upfront)
- Review loops add iterations
- But catches issues early (cheaper than debugging later)

## Red Flags

**Never:**
- Skip reviews (spec compliance OR code quality)
- Proceed with unfixed issues
- Dispatch multiple implementation Task agents in parallel (conflicts)
- Make Task agent read plan file (provide full text instead)
- Skip scene-setting context (Task agent needs to understand where task fits)
- Ignore Task agent questions (answer before letting them proceed)
- Accept "close enough" on spec compliance (spec reviewer found issues = not done)
- Skip review loops (reviewer found issues = implementer fixes = review again)
- Let implementer self-review replace actual review (both are needed)
- **Start code quality review before spec compliance is ✅** (wrong order)
- Move to next task while either review has open issues

**If Task agent asks questions:**
- Answer clearly and completely
- Provide additional context if needed
- Don't rush them into implementation

**If reviewer finds issues:**
- Implementer (same Task agent) fixes them
- Reviewer reviews again
- Repeat until approved
- Don't skip the re-review

**If Task agent fails task:**
- Dispatch fix Task agent with specific instructions
- Don't try to fix manually (context pollution)

## Integration

**Required workflow skills:**
- **superpowers:writing-plans** - Creates the plan this skill executes
- **superpowers:requesting-code-review** - Code review template for reviewer Task agents
- **superpowers:finishing-a-development-branch** - Complete development after all tasks

**Task agents should use:**
- **superpowers:test-driven-development** - Task agents follow TDD for each task

**Alternative workflow:**
- **superpowers:executing-plans** - Use for parallel session instead of same-session execution
