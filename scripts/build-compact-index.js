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
const OUTPUT_FILE = path.join(__dirname, '..', 'skills-compact.json');

// Category short codes
const CATEGORY_CODES = {
  'frontend': 'fe',
  'backend': 'be',
  'database': 'db',
  'mobile': 'mob',
  'devops': 'ops',
  'testing': 'test',
  'security': 'sec',
  'ai-ml': 'ai',
  'python': 'py',
  'golang': 'go',
  'rust': 'rs',
  'data': 'data',
  'git-workflow': 'git',
  'documentation': 'doc',
  'performance': 'perf',
  'architecture': 'arch',
  'other': 'other'
};

// Category patterns
const CATEGORY_PATTERNS = {
  'frontend': /react|vue|angular|svelte|next|nuxt|remix|astro|frontend|ui|ux|css|tailwind|component/i,
  'backend': /node|express|nest|fastify|hono|backend|server|api|rest|graphql|grpc|microservice/i,
  'database': /database|sql|postgres|mysql|mongo|redis|prisma|drizzle|supabase|firebase/i,
  'mobile': /mobile|react-native|flutter|ios|android|swift|kotlin|expo/i,
  'devops': /docker|kubernetes|k8s|ci|cd|deploy|aws|azure|gcp|cloud|terraform/i,
  'testing': /test|jest|vitest|playwright|cypress|tdd|bdd|e2e/i,
  'security': /security|auth|oauth|jwt|owasp|pentest|vulnerability/i,
  'ai-ml': /ai|ml|llm|agent|openai|anthropic|langchain|prompt|embedding|rag|mcp/i,
  'python': /python|django|flask|fastapi|pandas|numpy/i,
  'golang': /golang|go\b|gin|echo|fiber/i,
  'rust': /rust|cargo|tokio|actix/i,
  'data': /data|analytics|etl|pipeline|spark|kafka/i,
  'git-workflow': /git|github|gitlab|review|pr|merge|commit/i,
  'documentation': /doc|readme|api-doc|swagger|openapi/i,
  'performance': /performance|optimization|cache|profiling/i,
  'architecture': /architecture|design|pattern|solid|clean|ddd/i
};

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
  const text = `${name} ${description}`.toLowerCase();

  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (pattern.test(text)) {
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

    // Ultra-compact: just category code
    index.skills[skillName] = category;

    processedCount++;
  }

  console.log(`Processed ${processedCount} skills`);

  // Write output (no pretty print for smaller size)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));

  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`\nGenerated: ${OUTPUT_FILE}`);
  console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`Skills: ${Object.keys(index.skills).length}`);

  // Category distribution
  const catCount = {};
  for (const cat of Object.values(index.skills)) {
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
