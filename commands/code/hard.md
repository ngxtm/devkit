---
description: Full Development Cycle — Plan, Implement, Test, Review
version: "1.0"
category: engineering
execution-mode: execute
---

# /code:hard — Full Development Cycle

> **MISSION**: Execute complete development workflow with planning, implementation, testing, and review.

<task>$ARGUMENTS</task>

---

## CRITICAL: PHASE CONTINUITY RULES

```yaml
phase_continuity:
  rule: "Each phase MUST reference and follow outputs from prior phases"

  check_for_files:
    - "./reports/brainstorms/BRAINSTORM-{task}.md"
    - "./reports/scouts/SCOUT-{task}.md"
    - "./reports/plans/PLAN-{task}.md"

  enforcement:
    - Phase 3 (Planning) MUST incorporate Scout findings
    - Phase 4 (Implementation) MUST follow the Plan file exactly
    - Phase 5 (Testing) MUST verify all plan checkpoints
    - If prior phase file missing → MUST create it
```

All files in `./reports/` → English only.

## INPUT REQUIREMENTS & VERIFICATION MATRIX

```yaml
phase_dependencies:
  phase_1_requirements:
    input_required: "User Request"
    blocking: false

  phase_2_scout:
    input_required: "User Request"
    blocking: false
    output: "./reports/scouts/SCOUT-{task}.md"

  phase_3_planning:
    input_required:
      - "./reports/scouts/SCOUT-{task}.md"
    blocking: true
    verification: "Plan MUST cite Scout findings"
    output: "./reports/plans/PLAN-{task}.md"

  phase_4_implementation:
    input_required:
      - "./reports/plans/PLAN-{task}.md" # MANDATORY
    blocking: true
    verification: "Implementation MUST follow plan step-by-step"
    deviation_protocol: "STOP → Document → Request Re-Planning"

  phase_5_testing:
    input_required:
      - "./reports/plans/PLAN-{task}.md"
      - "Code changes from Phase 4"
    blocking: true
    verification: "Tests MUST cover all plan checkpoints"

  phase_6_review:
    input_required:
      - "./reports/plans/PLAN-{task}.md"
      - "Code + Tests"
    blocking: true
    verification: "Code MUST match plan intent"
```

## BLOCKING ENFORCEMENT

```
BEFORE entering any BLOCKING phase:
  1. CHECK: Does required input file exist?
  2. IF missing:
     a. OUTPUT: "BLOCKED: Missing [{file}]"
     b. ROUTE to creating agent
     c. WAIT for creation
  3. IF exists:
     a. READ and LOCK as constraint
     b. PROCEED
```

---

## Execution

One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: REQUIREMENTS ANALYSIS

| Attribute   | Value                             |
| ----------- | --------------------------------- |
| **Role**    | `brainstormer`                    |
| **Goal**    | Clarify requirements if ambiguous |
| **Trigger** | If requirements unclear           |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. Clarify requirements if ambiguous using Socratic questioning and assumption surfacing. Exit when: requirements clear, scope defined, acceptance criteria established.", description="brainstormer: Clarify requirements if ambiguous")

**Exit Criteria:**

- [ ] Requirements clear
- [ ] Scope defined
- [ ] Acceptance criteria established

---

## Phase 2: CODEBASE ANALYSIS

| Attribute | Value                         |
| --------- | ----------------------------- |
| **Role**  | `scouter`                     |
| **Goal**  | Full codebase context mapping |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Perform full codebase context mapping. Exit when: architecture understood, patterns documented, integration points identified.", description="scouter: Full codebase context mapping")

**Exit Criteria:**

- [ ] Architecture understood
- [ ] Patterns documented
- [ ] Integration points identified

---

## Phase 3: IMPLEMENTATION PLANNING

| Attribute | Value                      |
| --------- | -------------------------- |
| **Role**  | `planner`                  |
| **Goal**  | Create implementation plan |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a planner. Create an implementation plan incorporating Scout findings. Exit when: plan created, steps defined, risks identified.", description="planner: Create implementation plan")

**Exit Criteria:**

- [ ] Plan created
- [ ] Steps defined
- [ ] Risks identified

---

## Phase 4: IMPLEMENTATION

| Attribute | Value                               |
| --------- | ----------------------------------- |
| **Role**  | `tech-lead` → routes to specialists |
| **Goal**  | Execute plan with specialist agents |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tech-lead. Execute the implementation plan, routing to specialist engineers as needed. READ the plan completely BEFORE any implementation. Implement EXACTLY as specified. If deviation needed: STOP, document, request re-planning. Exit when: all plan steps executed, code complete, documentation updated, no unauthorized deviations.", description="tech-lead: Execute implementation plan")

### INPUT REQUIREMENTS (BLOCKING)

```yaml
required_inputs:
  mandatory:
    - file: "./reports/plans/PLAN-{task}.md"
      action: "READ first, FOLLOW exactly"
      if_missing: "STOP → Route to planner"
```

### STRICT ADHERENCE DIRECTIVE

```
1. READ plan completely BEFORE any implementation
2. FOR EACH plan step:
   a. Implement EXACTLY as specified
   b. Mark complete: - [ ] → - [x]
3. IF deviation needed:
   a. STOP
   b. REQUEST Re-Planning
   c. DO NOT proceed with own interpretation
```

**Exit Criteria:**

- [ ] All plan steps executed
- [ ] Code complete
- [ ] Documentation updated
- [ ] **Each plan step has corresponding implementation**
- [ ] **No unauthorized deviations**

---

## Phase 5: TESTING

| Attribute | Value                 |
| --------- | --------------------- |
| **Role**  | `tester`              |
| **Goal**  | Comprehensive testing |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Perform comprehensive testing of the implementation. Verify all plan checkpoints. Exit when: tests written, all tests pass, coverage adequate.", description="tester: Comprehensive testing")

**Exit Criteria:**

- [ ] Tests written
- [ ] All tests pass
- [ ] Coverage adequate

---

## Phase 6: REVIEW

| Attribute | Value               |
| --------- | ------------------- |
| **Role**  | `reviewer`          |
| **Goal**  | Code quality review |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a reviewer. Perform code quality review. Check plan compliance, standards, and blocking issues. Exit when: code reviewed, standards met, no blocking issues.", description="reviewer: Code quality review")

**Exit Criteria:**

- [ ] Code reviewed
- [ ] Standards met
- [ ] No blocking issues

---

## COMPLETION

Present implementation report with:

1. **Done** — Feature complete
2. **Deploy** → `/deploy:preview`
3. **Docs** → `/docs:core`
