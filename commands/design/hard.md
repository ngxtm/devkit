---
description: ⚡⚡⚡ Full Design — Complete design process with research
version: "1.0"
category: design
execution-mode: execute
---

# /design:hard — Full Design Process

> **MISSION**: Execute complete design process with research, exploration, and iteration.

<request>$ARGUMENTS</request>

---

## ⚠️ CRITICAL: DELIVERABLE FILE RULES

```yaml
deliverable_files:
  researcher: "./reports/researchers/RESEARCH-{request}.md"
  scouter: "./reports/scouts/SCOUT-{request}.md"
  designer: "./reports/designs/DESIGN-{request}.md" # MANDATORY OUTPUT

enforcement:
  - Design phase MUST create design file
  - Design file is the deliverable for implementation phases
```

All files in `./reports/` → English only.

---

## 🎭 Phase 1: REQUIREMENTS DISCOVERY

| Attribute | Value                       |
| --------- | --------------------------- |
| **Role**  | `brainstormer`              |
| **Goal**  | Clarify design requirements |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. Clarify design requirements. [See exit criteria below]", description="brainstormer")

**Exit Criteria:**

- [ ] Requirements clear
- [ ] User needs identified
- [ ] Constraints documented
- [ ] **METHODOLOGY CHECK**: Output aligns with `brainstormer` Thinking Protocol (Socratic questioning, assumption surfacing)

---

## 🎭 Phase 2: RESEARCH

| Attribute | Value                           |
| --------- | ------------------------------- |
| **Role**  | `researcher`                    |
| **Goal**  | Research design patterns and UX |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Research design patterns and UX. [See exit criteria below]", description="researcher")

**Exit Criteria:**

- [ ] Patterns researched
- [ ] Best practices identified
- [ ] **METHODOLOGY CHECK**: Output aligns with `researcher` Thinking Protocol (sources cited, evidence-based)

---

## 🎭 Phase 3: CODEBASE ANALYSIS

| Attribute | Value                      |
| --------- | -------------------------- |
| **Role**  | `scouter`                  |
| **Goal**  | Map existing design system |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Map existing design system. [See exit criteria below]", description="scouter")

**Exit Criteria:**

- [ ] Design system documented
- [ ] Component inventory
- [ ] Integration points
- [ ] **METHODOLOGY CHECK**: Output aligns with `scouter` Thinking Protocol (file locations, patterns documented)

---

## 🎭 Phase 4: DESIGN CREATION

| Attribute | Value                  |
| --------- | ---------------------- |
| **Role**  | `designer`             |
| **Goal**  | Full design with specs |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a designer. Create full design with specs. [See exit criteria below]", description="designer")

**Exit Criteria:**

- [ ] Design complete
- [ ] All states covered
- [ ] Accessibility verified
- [ ] Specs documented
- [ ] **METHODOLOGY CHECK**: Output aligns with `designer` Thinking Protocol (user empathy, accessibility-first, visual hierarchy)

---

## 🎭 Phase 5: DESIGN REVIEW

| Attribute | Value                 |
| --------- | --------------------- |
| **Role**  | `reviewer`            |
| **Goal**  | Review design quality |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a reviewer. Review design quality. [See exit criteria below]", description="reviewer")

**Exit Criteria:**

- [ ] Design reviewed
- [ ] Standards met
- [ ] Approved
- [ ] **METHODOLOGY CHECK**: Output aligns with `reviewer` Thinking Protocol (specific feedback, priority matrix)

---

## COMPLETION

Present design with:

1. ✅ **Done** — Design approved
2. 💻 **Implement** → `/code:hard`
3. 🔄 **Iterate** — Further refinement
