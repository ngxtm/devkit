---
description: Show mesh health dashboard — tiers, connections, quality, recipes
argument-hint: [--detailed] [--domain <keyword>]
---

# Skill Mesh Dashboard

Read `skills-graph.json` and present mesh health metrics.

## Arguments

Parse `$ARGUMENTS` for flags:
- `--detailed`: Show per-skill breakdown
- `--domain <keyword>`: Filter to specific domain

## Workflow

### Step 1: Load Data

Read `skills-graph.json`. If doesn't exist → "Mesh not initialized. Run /skill:mesh-init first."

### Step 2: Compute Metrics

From the graph data, compute:

1. **Coverage**: `_meta.stats.graphedSkills` / `_meta.stats.totalSkills` (%)
2. **Tier Distribution**: count entries in each `_tiers` array
3. **Connection Stats**: from `_meta.stats` — total, strong/moderate/weak, density
4. **Quality Distribution**: scan all `graph.*` entries for quality scores → compute min, max, avg, median. **Exclude quality=0 skills** (unevaluated/empty) from avg/median calculations; report them separately as "Unevaluated: N"
5. **Top 10 Most Connected**: sort skills by (enhances.length + pairs-with.length), take top 10
6. **Isolated Skills**: count of `_tiers["t4-standalone"]`
7. **Domain Distribution**: aggregate all `connections.domain` arrays → count per keyword, sort descending
8. **Recipes**: count of `_recipes` entries, count unique skills across all recipes
9. **Security**: count skills with `_security: "quarantined"`

If `--domain <keyword>`: filter all metrics to skills whose `connections.domain` contains the keyword.

### Step 3: Present Dashboard

```
## Devkit Mesh Health

### Coverage
X / Y skills mapped (Z%)

### Tier Distribution
| Tier | Count | % |
|------|-------|---|
| T1 Orchestrator | A | |
| T2 Hub | B | |
| T3 Utility | C | |
| T4 Connected | D | |
| T4 Standalone | E | |

### Connections
- Total edges: N
- Strong: S | Moderate: M | Weak: W
- Avg connections/skill: X.X
- Max connections: Y (skill-name)
- Skills with 0 connections: Z

### Quality Scores
- Average: X | Median: Y
- Range: [min - max]
- Below 40: N (low quality)
- Above 80: M (high quality)

### Recipes
- Total recipes: R
- Skills covered by recipes: S / total

### Top 10 Connected Skills
1. skill-name (N connections: S strong, M moderate)
2. ...

### Top Domains
1. domain-keyword (N skills)
2. ...

### Security
- Quarantined skills: P

### Action Items
- Run `/skill:curate` to address issues found
- Run `/skill:mesh-init --resume` if unevaluated skills remain
```

### If --detailed

After the dashboard, show per-skill table:

```
### All Skills (sorted by quality desc)
| Skill | Tier | Quality | Enhances | Pairs-With | Domain |
|-------|------|---------|----------|------------|--------|
| skill-name | 3 | 82 | 2 | 5 | react, frontend |
```

### If --domain

Filter everything to skills whose `connections.domain` contains the specified keyword. Add header: "Filtered to domain: <keyword>"

## Important

- Read-only — never modifies the graph
- If graph is empty, suggest `/skill:mesh-init`
- Present data concisely, use tables for structured data
- **IMPORTANT:** Sacrifice grammar for the sake of concision when writing outputs.
