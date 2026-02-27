#!/usr/bin/env node

/**
 * Build Skill Graph
 *
 * Validates and cleans skills-graph.json:
 * - Removes orphaned entries (skills/commands that no longer exist)
 * - Validates connections (removes broken links)
 * - Validates recipes (removes broken skill refs, deletes recipes with <2 skills)
 * - Cleans orphaned weights
 * - Recomputes _meta.stats and _tiers
 *
 * Runs BEFORE build-compact-index so compact can merge cascade data.
 */

const fs = require('fs');
const path = require('path');

const GRAPH_FILE = path.join(__dirname, '..', 'skills-graph.json');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const COMMANDS_DIR = path.join(__dirname, '..', '.claude', 'commands');

// Weight defaults — keep in sync with build-compact-index.js
const WEIGHT_DEFAULTS = { enhances: 'strong', 'pairs-with': 'moderate' };

function buildSkillGraph() {
  console.log('Building skill graph...\n');

  // 1. Read or init graph
  let graph;
  if (fs.existsSync(GRAPH_FILE)) {
    try {
      graph = JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf-8'));
    } catch (e) {
      console.error(`Error: skills-graph.json is malformed: ${e.message}`);
      process.exit(1);
    }
  } else {
    graph = {
      _meta: {
        version: 2,
        lastUpdated: new Date().toISOString().split('T')[0],
        stats: {
          totalSkills: 0, graphedSkills: 0,
          connections: 0, strongConnections: 0, moderateConnections: 0, weakConnections: 0,
          density: 0.0, recipes: 0
        }
      },
      _tiers: { 't1-orchestrator': [], 't2-hub': [], 't3-utility': [], 't4-connected': [], 't4-standalone': [] },
      _recipes: {},
      graph: {}
    };
  }

  // Ensure sections exist
  if (!graph._recipes) graph._recipes = {};
  if (!graph.graph) graph.graph = {};

  // 2. Get current skills list (skills/ dirs + .claude/commands/ files, recursive)
  const skillDirs = fs.existsSync(SKILLS_DIR)
    ? fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'))
        .map(d => d.name)
    : [];

  const commandNames = [];
  if (fs.existsSync(COMMANDS_DIR)) {
    const scanDir = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          commandNames.push(entry.name.replace('.md', ''));
        } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
          scanDir(path.join(dir, entry.name));
        }
      }
    };
    scanDir(COMMANDS_DIR);
  }

  const currentSkills = new Set([...skillDirs, ...commandNames]);

  // 3. Remove orphaned graph entries
  let orphansRemoved = 0;
  for (const name of Object.keys(graph.graph)) {
    if (!currentSkills.has(name)) {
      delete graph.graph[name];
      orphansRemoved++;
    }
  }

  // 4. Validate connections (remove broken links) + clean weights
  let brokenLinksRemoved = 0;
  for (const data of Object.values(graph.graph)) {
    if (!data.connections) continue;

    for (const connType of ['enhances', 'pairs-with']) {
      if (data.connections[connType]) {
        const before = data.connections[connType].length;
        data.connections[connType] = data.connections[connType]
          .filter(target => currentSkills.has(target));
        brokenLinksRemoved += before - data.connections[connType].length;
      }
    }

    // Clean orphaned weights (weight entry but target not in enhances/pairs-with)
    if (data.connections.weights) {
      const validTargets = new Set([
        ...(data.connections.enhances || []),
        ...(data.connections['pairs-with'] || [])
      ]);
      for (const target of Object.keys(data.connections.weights)) {
        if (!validTargets.has(target)) {
          delete data.connections.weights[target];
        }
      }
    }
  }

  // 4.5. Validate recipes (remove broken skill references)
  let recipesRemoved = 0;
  for (const [name, recipe] of Object.entries(graph._recipes)) {
    if (recipe.skills) {
      recipe.skills = recipe.skills.filter(s => currentSkills.has(s));
    }
    if (!recipe.skills || recipe.skills.length < 2) {
      delete graph._recipes[name];
      recipesRemoved++;
    }
  }

  // 5. Recompute _meta.stats (including weight breakdown)
  let strongCount = 0, moderateCount = 0, weakCount = 0;
  let totalConnections = 0;

  for (const data of Object.values(graph.graph)) {
    const enhances = data.connections?.enhances || [];
    const pairsWith = data.connections?.['pairs-with'] || [];
    const weights = data.connections?.weights || {};

    totalConnections += enhances.length + pairsWith.length;

    for (const s of enhances) {
      const w = weights[s] || WEIGHT_DEFAULTS.enhances;
      if (w === 'strong') strongCount++;
      else if (w === 'moderate') moderateCount++;
      else weakCount++;
    }
    for (const s of pairsWith) {
      const w = weights[s] || WEIGHT_DEFAULTS['pairs-with'];
      if (w === 'strong') strongCount++;
      else if (w === 'moderate') moderateCount++;
      else weakCount++;
    }
  }

  const graphedCount = Object.keys(graph.graph).length;
  graph._meta.stats = {
    totalSkills: currentSkills.size,
    graphedSkills: graphedCount,
    connections: totalConnections,
    strongConnections: strongCount,
    moderateConnections: moderateCount,
    weakConnections: weakCount,
    density: graphedCount > 0
      ? parseFloat((totalConnections / graphedCount).toFixed(2))
      : 0,
    recipes: Object.keys(graph._recipes).length
  };
  graph._meta.lastUpdated = new Date().toISOString().split('T')[0];

  // 6. Recompute _tiers
  graph._tiers = {
    't1-orchestrator': [],
    't2-hub': [],
    't3-utility': [],
    't4-connected': [],
    't4-standalone': []
  };

  for (const [name, data] of Object.entries(graph.graph)) {
    const hasConnections = (data.connections?.enhances?.length || 0) +
                           (data.connections?.['pairs-with']?.length || 0) > 0;
    const tierKey = {
      1: 't1-orchestrator',
      2: 't2-hub',
      3: 't3-utility',
      4: hasConnections ? 't4-connected' : 't4-standalone'
    }[data.tier] || 't4-standalone';

    graph._tiers[tierKey].push(name);
  }

  // Sort each tier array
  for (const arr of Object.values(graph._tiers)) arr.sort();

  // 7. Write validated graph
  fs.writeFileSync(GRAPH_FILE, JSON.stringify(graph, null, 2) + '\n');

  // 8. Report
  const s = graph._meta.stats;
  console.log(`Graph: ${s.graphedSkills}/${s.totalSkills} skills mapped, ${s.connections} connections (${s.strongConnections} strong, ${s.moderateConnections} moderate, ${s.weakConnections} weak), ${s.recipes} recipes, density ${s.density}`);

  if (orphansRemoved) console.log(`  Cleaned: ${orphansRemoved} orphaned entries`);
  if (brokenLinksRemoved) console.log(`  Cleaned: ${brokenLinksRemoved} broken links`);
  if (recipesRemoved) console.log(`  Cleaned: ${recipesRemoved} invalid recipes`);
}

buildSkillGraph();
