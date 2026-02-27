#!/usr/bin/env node

/**
 * Build Compact Skill Index
 *
 * Creates a minimal index (~20-30KB) for auto-skill detection
 * without overwhelming Claude's context window.
 *
 * Output: skills-compact.json
 * Format: { "skill-name": { "c": "category", "d": "short description" } }
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const GRAPH_FILE = path.join(__dirname, '..', 'skills-graph.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'skills-compact.json');

// Weight defaults — keep in sync with build-skill-graph.js
const WEIGHT_DEFAULTS = { enhances: 'strong', 'pairs-with': 'moderate' };

// Category short codes
const CATEGORY_CODES = {
  'security': 'sec',
  'devops': 'ops',
  'ai-ml': 'ai',
  'testing': 'test',
  'database': 'db',
  'mobile': 'mob',
  'rust': 'rs',
  'golang': 'go',
  'python': 'py',
  'data': 'data',
  'performance': 'perf',
  'architecture': 'arch',
  'git-workflow': 'git',
  'documentation': 'doc',
  'backend': 'be',
  'frontend': 'fe',
  'other': 'other'
};

// Category patterns — ORDER MATTERS: specific categories first, broad ones last
const CATEGORY_PATTERNS = [
  ['security',     /security|auth|oauth|jwt|owasp|pentest|penetration|vulnerability|exploit|xss|injection|privilege.escalation|active.directory|attack|malware|forensic|reverse.engineer|red.team|burp|shodan|metasploit|sqlmap|brute.?force|encryption|crypto(?!currency)|firewall|ids|ips|siem|soc|threat|cve|hardening|compliance|gdpr|pci|sast|dast|ctf/i],
  ['devops',       /docker|kubernetes|k8s|ci[\/-]?cd|deploy|aws|azure|gcp|cloud|terraform|ansible|helm|istio|linkerd|jenkins|github.actions|gitlab.ci|argocd|pulumi|vagrant|prometheus|grafana|monitoring|observability|sre|incident|on.call|runbook|infrastructure|server.management|nginx|apache|load.balancer|cdn/i],
  ['ai-ml',        /\bai\b|machine.learning|\bml\b|\bllm\b|agent(?!.assistant)|openai|anthropic|langchain|langgraph|prompt|embedding|rag\b|mcp\b|fine.tuning|hugging.face|transformer|gpt|claude|gemini|diffusion|stable|midjourney|vision|nlp|neural|deep.learning|tensor|torch|crew.?ai|autogen|semantic|vector/i],
  ['testing',      /\btest|jest|vitest|playwright|cypress|tdd|bdd|e2e|qa\b|regression|unit.test|integration.test|mock|stub|fixture|coverage|assertion/i],
  ['database',     /database|sql\b|postgres|mysql|mongo|redis|prisma|drizzle|supabase|firebase|dynamo|cassandra|cockroach|sqlite|migration|schema|query.optim|nosql|elasticsearch|clickhouse|neon/i],
  ['mobile',       /mobile|react.native|flutter|ios\b|android|swift(?!ui)|kotlin(?!.specialist)|expo|dart\b|xcode|app.store|play.store/i],
  ['rust',         /\brust\b|cargo|tokio|actix|wasm/i],
  ['golang',       /\bgolang\b|\bgo\b(?!ogle|dot|od)|gin\b|echo\b|fiber\b/i],
  ['python',       /\bpython\b|django|flask|fastapi|pandas|numpy|scipy|jupyter|pip\b|poetry|uv\b.*package/i],
  ['data',         /\bdata\b.*(?:engineer|pipeline|quality|warehouse)|analytics|etl\b|spark\b|kafka\b|airflow|dbt\b|streaming/i],
  ['performance',  /performance|profiling|optimization|cache|benchmark|latency|throughput|memory.leak/i],
  ['architecture', /architecture|system.design|design.pattern|\bsolid\b|clean.architecture|\bddd\b|event.sourc|cqrs|hexagonal|microservice.pattern|domain.driven/i],
  ['git-workflow', /\bgit\b|github|gitlab|pull.request|\bpr\b|code.review|branching|merge|commit|changelog|version|release/i],
  ['documentation',/\bdoc\b|readme|api.doc|swagger|openapi|technical.writing|jsdoc|typedoc/i],
  ['backend',      /node\.?js|express|nest\.?js|fastify|hono|backend|server|api\b|rest\b|graphql|grpc|webhook|middleware|routing|endpoint|websocket/i],
  ['frontend',     /react(?!.native)|vue|angular|svelte|next\.?js|nuxt|remix|astro|frontend|ui\b|ux\b|css|tailwind|component|html|dom|browser|responsive|accessibility|wcag|animation|canvas|three\.?js|d3/i],
];

/**
 * Parse YAML frontmatter
 */
function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};

  const lines = yaml.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  }

  return result;
}

/**
 * Categorize skill
 */
function categorizeSkill(name, description) {
  const nameText = name.toLowerCase();
  const fullText = `${name} ${description}`.toLowerCase();

  // Match on name first (more reliable), then fall back to description
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(nameText)) {
      return CATEGORY_CODES[category] || category;
    }
  }
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(fullText)) {
      return CATEGORY_CODES[category] || category;
    }
  }

  return 'other';
}

/**
 * Shorten description to max 60 chars
 */
function shortenDesc(desc) {
  if (!desc) return '';

  // Remove markdown, newlines, extra spaces
  let clean = desc
    .replace(/\r?\n/g, ' ')
    .replace(/[#*`_\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= 60) return clean;

  // Cut at word boundary
  const cut = clean.slice(0, 57);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + '...';
}

/**
 * Build compact index
 */
function buildCompactIndex() {
  console.log('Building compact skill index...\n');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name)
    .sort();

  console.log(`Found ${skillDirs.length} skill directories`);

  const index = {
    _categories: CATEGORY_CODES,
    skills: {}
  };
  let processedCount = 0;

  for (const skillName of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillName);
    const skillFile = path.join(skillPath, 'SKILL.md');

    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    const description = frontmatter.description || '';
    const category = categorizeSkill(skillName, description);

    // Include category and short description for semantic matching
    const shortDesc = shortenDesc(description);
    index.skills[skillName] = shortDesc ? { c: category, d: shortDesc } : category;

    processedCount++;
  }

  console.log(`Processed ${processedCount} skills`);

  // Merge cascade fields from skills-graph.json
  if (fs.existsSync(GRAPH_FILE)) {
    let graph;
    try {
      graph = JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf-8'));
    } catch (e) {
      console.error(`Warning: skills-graph.json is malformed, skipping cascade merge: ${e.message}`);
      graph = null;
    }

    if (graph) {

    // Build set of quarantined skills
    const quarantined = new Set();
    for (const [name, data] of Object.entries(graph.graph || {})) {
      if (data._security === 'quarantined') quarantined.add(name);
    }

    // Merge cascade fields into compact skills
    let cascadeCount = 0;
    for (const [name, data] of Object.entries(graph.graph || {})) {
      if (quarantined.has(name)) continue;
      if (!index.skills[name]) continue;
      if (!data.connections) continue;

      // Ensure skill entry is an object (not just a category string)
      if (typeof index.skills[name] === 'string') {
        index.skills[name] = { c: index.skills[name] };
      }

      const enhances = (data.connections.enhances || []).filter(s => !quarantined.has(s));
      const pairsWith = (data.connections['pairs-with'] || []).filter(s => !quarantined.has(s));
      const weights = data.connections.weights || {};
      const domain = data.connections.domain || [];

      if (enhances.length) index.skills[name].e = enhances;
      if (pairsWith.length) index.skills[name].p = pairsWith;

      // Only include non-default weights
      const nonDefaultWeights = {};
      for (const [target, weight] of Object.entries(weights)) {
        if (quarantined.has(target)) continue;
        const isEnhance = enhances.includes(target);
        const isPair = pairsWith.includes(target);
        if (isEnhance && weight !== WEIGHT_DEFAULTS.enhances) nonDefaultWeights[target] = weight;
        else if (isPair && weight !== WEIGHT_DEFAULTS['pairs-with']) nonDefaultWeights[target] = weight;
      }
      if (Object.keys(nonDefaultWeights).length) index.skills[name].w = nonDefaultWeights;

      if (domain.length) index.skills[name].k = domain;

      cascadeCount++;
    }

    // Copy _recipes (removing quarantined skill refs)
    if (graph._recipes && Object.keys(graph._recipes).length) {
      index._recipes = {};
      for (const [name, recipe] of Object.entries(graph._recipes)) {
        const cleanSkills = (recipe.skills || []).filter(s => !quarantined.has(s));
        if (cleanSkills.length < 2) continue;
        index._recipes[name] = {
          d: recipe.description || '',
          triggers: recipe.triggers || [],
          skills: cleanSkills,
          workflow: recipe.workflow || []
        };
      }
    }

    console.log(`Merged cascade fields for ${cascadeCount} skills from graph`);
    if (quarantined.size) console.log(`Quarantined: ${quarantined.size} skills excluded`);
    } // if (graph)
  }

  // Write output (no pretty print for smaller size)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));

  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`\nGenerated: ${OUTPUT_FILE}`);
  console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`Skills: ${Object.keys(index.skills).length}`);

  // Category distribution
  const catCount = {};
  for (const val of Object.values(index.skills)) {
    const cat = typeof val === 'string' ? val : val.c;
    catCount[cat] = (catCount[cat] || 0) + 1;
  }

  console.log('\nCategory distribution:');
  Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

  return index;
}

// Run
buildCompactIndex();
