#!/usr/bin/env node

/**
 * Build Smart Skill Index
 *
 * Creates multiple index files for intelligent skill detection:
 * 1. skills-keywords.json - Keyword → Skills mapping for fast lookup
 * 2. skills-categories.json - Category-based compact index for LLM
 * 3. skills-triggers.json - Trigger patterns → Skills mapping
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const OUTPUT_DIR = path.join(__dirname, '..');

// Common stop words to exclude from keywords
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
  'use', 'using', 'used', 'create', 'creating', 'build', 'building',
  'implement', 'implementing', 'add', 'adding', 'make', 'making',
  'skill', 'skills', 'expert', 'pro', 'master', 'specialist', 'guide'
]);

// Category definitions based on keywords
const CATEGORY_PATTERNS = {
  'frontend': /react|vue|angular|svelte|next|nuxt|remix|astro|solid|qwik|frontend|ui|ux|css|tailwind|styled|component/i,
  'backend': /node|express|nest|fastify|hono|koa|backend|server|api|rest|graphql|grpc|microservice/i,
  'database': /database|sql|postgres|mysql|mongo|redis|prisma|drizzle|typeorm|sequelize|supabase|firebase/i,
  'mobile': /mobile|react-native|flutter|ios|android|swift|kotlin|expo|capacitor/i,
  'devops': /docker|kubernetes|k8s|ci|cd|deploy|aws|azure|gcp|cloud|terraform|pulumi|ansible/i,
  'testing': /test|jest|vitest|playwright|cypress|testing|tdd|bdd|e2e|unit|integration/i,
  'security': /security|auth|oauth|jwt|owasp|pentest|vulnerability|encryption|crypto/i,
  'ai-ml': /ai|ml|llm|agent|openai|anthropic|langchain|prompt|embedding|vector|rag|mcp/i,
  'python': /python|django|flask|fastapi|pandas|numpy|pytorch|tensorflow/i,
  'golang': /golang|go\b|gin|echo|fiber|goroutine/i,
  'rust': /rust|cargo|tokio|actix|wasm/i,
  'data': /data|analytics|etl|pipeline|warehouse|spark|kafka|airflow/i,
  'git-workflow': /git|github|gitlab|review|pr|merge|branch|commit|version/i,
  'documentation': /doc|documentation|readme|api-doc|swagger|openapi|markdown/i,
  'performance': /performance|optimization|cache|profiling|benchmark|speed/i,
  'architecture': /architecture|design|pattern|solid|clean|hexagonal|ddd|cqrs/i
};

/**
 * Parse YAML frontmatter from markdown
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
 * Extract keywords from text
 */
function extractKeywords(text) {
  if (!text) return [];

  // Normalize and split
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  // Also extract compound terms (e.g., "react-native" → "react-native", "react", "native")
  const compounds = text
    .toLowerCase()
    .match(/[a-z]+-[a-z]+(-[a-z]+)*/g) || [];

  return [...new Set([...words, ...compounds])];
}

/**
 * Extract trigger patterns from skill content
 */
function extractTriggers(content, skillName) {
  const triggers = [];

  // Look for explicit trigger patterns in content
  const triggerMatch = content.match(/trigger[s]?\s*(?:on|:)\s*["']?([^"'\n]+)/gi);
  if (triggerMatch) {
    triggerMatch.forEach(m => {
      const pattern = m.replace(/trigger[s]?\s*(?:on|:)\s*["']?/i, '').trim();
      if (pattern) triggers.push(pattern.toLowerCase());
    });
  }

  // Look for "Use when" patterns
  const useWhenMatch = content.match(/use\s+(?:this\s+)?(?:skill\s+)?when[:\s]+([^\n.]+)/gi);
  if (useWhenMatch) {
    useWhenMatch.forEach(m => {
      const pattern = m.replace(/use\s+(?:this\s+)?(?:skill\s+)?when[:\s]+/i, '').trim();
      if (pattern) triggers.push(pattern.toLowerCase());
    });
  }

  // Add skill name variations as triggers
  triggers.push(skillName);
  triggers.push(skillName.replace(/-/g, ' '));

  return [...new Set(triggers)];
}

/**
 * Determine category for a skill
 */
function categorizeSkill(name, description) {
  const text = `${name} ${description}`.toLowerCase();

  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (pattern.test(text)) {
      return category;
    }
  }

  return 'other';
}

/**
 * Scan all skills and build indexes
 */
function buildIndexes() {
  console.log('Building smart skill indexes...\n');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name)
    .sort();

  console.log(`Found ${skillDirs.length} skill directories`);

  // Data structures for indexes
  const keywordIndex = {};      // keyword → [skills]
  const categoryIndex = {};     // category → [{name, description, keywords}]
  const triggerIndex = {};      // trigger → [skills]
  const skillMeta = [];         // Full skill metadata

  let processedCount = 0;

  for (const skillName of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillName);
    const skillFile = path.join(skillPath, 'SKILL.md');

    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    const name = frontmatter.name || skillName;
    const description = frontmatter.description || '';

    // Extract keywords from name and description
    const keywords = extractKeywords(`${name} ${description}`);

    // Extract triggers
    const triggers = extractTriggers(content, skillName);

    // Categorize
    const category = categorizeSkill(name, description);

    // Build keyword index
    for (const keyword of keywords) {
      if (!keywordIndex[keyword]) {
        keywordIndex[keyword] = [];
      }
      if (!keywordIndex[keyword].includes(skillName)) {
        keywordIndex[keyword].push(skillName);
      }
    }

    // Build trigger index
    for (const trigger of triggers) {
      if (!triggerIndex[trigger]) {
        triggerIndex[trigger] = [];
      }
      if (!triggerIndex[trigger].includes(skillName)) {
        triggerIndex[trigger].push(skillName);
      }
    }

    // Build category index
    if (!categoryIndex[category]) {
      categoryIndex[category] = [];
    }
    categoryIndex[category].push({
      name: skillName,
      displayName: name,
      description: description.slice(0, 150),
      keywords: keywords.slice(0, 10)
    });

    // Full metadata
    skillMeta.push({
      name: skillName,
      displayName: name,
      description: description.slice(0, 200),
      category,
      keywords: keywords.slice(0, 15),
      triggers: triggers.slice(0, 5)
    });

    processedCount++;
  }

  console.log(`Processed ${processedCount} skills`);

  // Sort keyword index by relevance (fewer skills = more specific)
  const sortedKeywordIndex = {};
  Object.keys(keywordIndex)
    .sort()
    .forEach(key => {
      // Only include keywords that map to <= 20 skills (too generic otherwise)
      if (keywordIndex[key].length <= 20) {
        sortedKeywordIndex[key] = keywordIndex[key];
      }
    });

  // Write keyword index
  const keywordFile = path.join(OUTPUT_DIR, 'skills-keywords.json');
  fs.writeFileSync(keywordFile, JSON.stringify(sortedKeywordIndex, null, 2));
  console.log(`\nGenerated: ${keywordFile}`);
  console.log(`  Keywords: ${Object.keys(sortedKeywordIndex).length}`);
  console.log(`  Size: ${(fs.statSync(keywordFile).size / 1024).toFixed(1)} KB`);

  // Write category index (compact for LLM)
  const categoryFile = path.join(OUTPUT_DIR, 'skills-categories.json');
  const compactCategories = {};
  for (const [cat, skills] of Object.entries(categoryIndex)) {
    compactCategories[cat] = {
      count: skills.length,
      skills: skills.map(s => ({
        n: s.name,
        d: s.description.slice(0, 80)
      }))
    };
  }
  fs.writeFileSync(categoryFile, JSON.stringify(compactCategories, null, 2));
  console.log(`\nGenerated: ${categoryFile}`);
  console.log(`  Categories: ${Object.keys(compactCategories).length}`);
  console.log(`  Size: ${(fs.statSync(categoryFile).size / 1024).toFixed(1)} KB`);

  // Write trigger index
  const triggerFile = path.join(OUTPUT_DIR, 'skills-triggers.json');
  fs.writeFileSync(triggerFile, JSON.stringify(triggerIndex, null, 2));
  console.log(`\nGenerated: ${triggerFile}`);
  console.log(`  Triggers: ${Object.keys(triggerIndex).length}`);
  console.log(`  Size: ${(fs.statSync(triggerFile).size / 1024).toFixed(1)} KB`);

  // Write full metadata (for advanced use)
  const metaFile = path.join(OUTPUT_DIR, 'skills-meta.json');
  fs.writeFileSync(metaFile, JSON.stringify(skillMeta, null, 2));
  console.log(`\nGenerated: ${metaFile}`);
  console.log(`  Skills: ${skillMeta.length}`);
  console.log(`  Size: ${(fs.statSync(metaFile).size / 1024).toFixed(1)} KB`);

  // Generate summary stats
  console.log('\n' + '='.repeat(50));
  console.log('Category Distribution:');
  console.log('='.repeat(50));
  Object.entries(categoryIndex)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([cat, skills]) => {
      console.log(`  ${cat}: ${skills.length} skills`);
    });

  return {
    keywords: Object.keys(sortedKeywordIndex).length,
    categories: Object.keys(categoryIndex).length,
    triggers: Object.keys(triggerIndex).length,
    skills: skillMeta.length
  };
}

// Run
buildIndexes();
