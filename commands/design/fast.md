---
description: ⚡ Quick Design — Rapid component/UI design
version: "1.0"
category: design
execution-mode: execute
---

# /design:fast — Rapid Design

> **MISSION**: Quickly create design for simple components or UI elements.

<request>$ARGUMENTS</request>

---

## ⚠️ CRITICAL: DELIVERABLE FILE RULES

```yaml
deliverable_files:
  designer: "./reports/designs/DESIGN-{request}.md" # For substantial designs

enforcement:
  - Simple component → Chat output OK
  - Page/feature design → MUST create design file
```

All files in `./reports/` → English only.

---

---

## 🎭 Phase 1: CONTEXT ANALYSIS

| Attribute | Value                         |
| --------- | ----------------------------- |
| **Role**  | `scouter`                     |
| **Goal**  | Find existing design patterns |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Find existing design patterns. [See exit criteria below]", description="scouter")

**Exit Criteria:**

- [ ] Existing patterns found
- [ ] Design system understood
- [ ] **METHODOLOGY CHECK**: Output aligns with `scouter` Thinking Protocol

---

## 🎭 Phase 2: DESIGN CREATION

| Attribute | Value                  |
| --------- | ---------------------- |
| **Role**  | `designer`             |
| **Goal**  | Create design solution |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a designer. Create design solution. [See exit criteria below]", description="designer")

**Exit Criteria:**

- [ ] Design created
- [ ] Accessibility considered
- [ ] Specs provided
- [ ] **METHODOLOGY CHECK**: Output aligns with `designer` Thinking Protocol

---

## ESCALATION

| Condition                  | Route To       |
| -------------------------- | -------------- |
| More complex than expected | `/design:hard` |
| Implementation needed      | `/code:fast`   |

---

## COMPLETION

Present design with:

1. ✅ **Done** — Design complete
2. 💻 **Implement** → `/code:fast`
3. 🔄 **Iterate** — Refine design
