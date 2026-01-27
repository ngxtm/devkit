#!/bin/bash
# ============================================================
# Initial Sync Script for Linux/Mac
# Run this once after cloning to populate skills
# ============================================================

set -e

echo "============================================================"
echo "DEVKIT AGENT ASSISTANT - INITIAL SYNC"
echo "============================================================"

TEMP_DIR="/tmp/devkit-sync"
mkdir -p "$TEMP_DIR"

echo ""
echo "[1/4] Cloning antigravity-awesome-skills..."
git clone --depth 1 https://github.com/sickn33/antigravity-awesome-skills.git "$TEMP_DIR/antigravity"

echo ""
echo "[2/4] Cloning agent-assistant..."
git clone --depth 1 https://github.com/hainamchung/agent-assistant.git "$TEMP_DIR/agent-assistant"

echo ""
echo "[3/4] Cloning skill-rule..."
git clone --depth 1 https://github.com/ngxtm/skill-rule.git "$TEMP_DIR/skill-rule"

echo ""
echo "[4/4] Running sync..."
python3 scripts/sync_skills.py \
  --primary "$TEMP_DIR/antigravity/skills" \
  --secondary "$TEMP_DIR/agent-assistant/skills" \
  --target ./skills

echo ""
echo "Copying agents and commands from agent-assistant..."
cp -r "$TEMP_DIR/agent-assistant/agents/"* ./agents/
cp -r "$TEMP_DIR/agent-assistant/commands/"* ./commands/
cp -r "$TEMP_DIR/agent-assistant/matrix-skills/"* ./matrix-skills/

echo ""
echo "Copying rules from skill-rule..."
cp -r "$TEMP_DIR/skill-rule/rules/"* ./rules/

echo ""
echo "Updating matrix indexes..."
python3 scripts/update_matrix.py

echo ""
echo "============================================================"
echo "SYNC COMPLETE!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. Review the synced content"
echo "  2. Commit and push to your repository"
echo "  3. Configure npm publishing (add NPM_TOKEN secret)"
echo ""
