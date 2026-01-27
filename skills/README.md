# Skills Directory

This directory contains all merged skills from:
- [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) (Primary)
- [agent-assistant](https://github.com/hainamchung/agent-assistant) (Secondary)

Skills are auto-synced daily via GitHub Actions.

## Manual Sync

To manually sync skills:

```bash
# Clone sources
git clone --depth 1 https://github.com/sickn33/antigravity-awesome-skills.git /tmp/antigravity
git clone --depth 1 https://github.com/hainamchung/agent-assistant.git /tmp/agent-assistant

# Run sync
python scripts/sync_skills.py \
  --primary /tmp/antigravity/skills \
  --secondary /tmp/agent-assistant/skills \
  --target ./skills
```
