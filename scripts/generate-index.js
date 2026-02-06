#!/usr/bin/env node

/**
 * Generate Skills Index
 *
 * Scans all skills and creates a single SKILLS_INDEX.md file
 * containing summaries of all available skills.
 *
 * This allows Claude to know what skills exist without loading
 * all 3500+ files into context.
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const OUTPUT_FILE = path.join(__dirname, '..', 'SKILLS_INDEX.md');

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content) {
  // Normalize line endings to LF
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};

  // Simple YAML parser for name/description
  const lines = yaml.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
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
 * Get first paragraph after frontmatter as description fallback
 */
function getFirstParagraph(content) {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/, '');
  // Remove title
  const withoutTitle = withoutFrontmatter.replace(/^#[^\n]*\n*/, '');
  // Get first non-empty paragraph
  const paragraphs = withoutTitle.split(/\n\n+/);
  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```')) {
      // Limit to 200 chars
      return trimmed.slice(0, 200) + (trimmed.length > 200 ? '...' : '');
    }
  }
  return '';
}

/**
 * Scan a skill directory and extract metadata
 */
function scanSkill(skillPath, skillName) {
  const skillFile = path.join(skillPath, 'SKILL.md');
  const agentsFile = path.join(skillPath, 'AGENTS.md');

  let content = '';
  let sourceFile = '';

  if (fs.existsSync(skillFile)) {
    content = fs.readFileSync(skillFile, 'utf-8');
    sourceFile = 'SKILL.md';
  } else if (fs.existsSync(agentsFile)) {
    content = fs.readFileSync(agentsFile, 'utf-8');
    sourceFile = 'AGENTS.md';
  } else {
    // Try to find any .md file
    const files = fs.readdirSync(skillPath).filter(f => f.endsWith('.md'));
    if (files.length > 0) {
      content = fs.readFileSync(path.join(skillPath, files[0]), 'utf-8');
      sourceFile = files[0];
    }
  }

  if (!content) {
    return null;
  }

  const frontmatter = parseFrontmatter(content);

  return {
    name: frontmatter.name || skillName,
    description: frontmatter.description || getFirstParagraph(content),
    path: `skills/${skillName}`,
    sourceFile
  };
}

/**
 * Categorize skills based on name patterns
 */
function categorizeSkill(name) {
  const lowerName = name.toLowerCase();

  if (/react|next|remix|vue|angular|svelte/.test(lowerName)) return 'Frontend Frameworks';
  if (/node|express|nest|fastify|hono/.test(lowerName)) return 'Backend/Node.js';
  if (/python|django|flask|fastapi/.test(lowerName)) return 'Python';
  if (/database|postgres|mysql|mongo|redis|sql/.test(lowerName)) return 'Databases';
  if (/docker|kubernetes|k8s|ci|cd|deploy|aws|cloud|terraform/.test(lowerName)) return 'DevOps/Cloud';
  if (/test|jest|playwright|cypress|vitest/.test(lowerName)) return 'Testing';
  if (/security|auth|owasp|crypto/.test(lowerName)) return 'Security';
  if (/ai|agent|llm|mcp|prompt|openai|anthropic/.test(lowerName)) return 'AI/Agents';
  if (/mobile|react-native|flutter|ios|android/.test(lowerName)) return 'Mobile';
  if (/git|review|debug|refactor|documentation/.test(lowerName)) return 'Development Tools';
  if (/api|rest|graphql|grpc/.test(lowerName)) return 'API Design';
  if (/css|tailwind|style|animation|ui|ux/.test(lowerName)) return 'UI/Styling';
  if (/typescript|javascript|js|ts/.test(lowerName)) return 'TypeScript/JavaScript';

  return 'Other';
}

/**
 * Main function
 */
function generateIndex() {
  console.log('Scanning skills directory...');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name)
    .sort();

  console.log(`Found ${skillDirs.length} skill directories`);

  const skills = [];
  const categorized = {};

  for (const skillName of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillName);
    const skillInfo = scanSkill(skillPath, skillName);

    if (skillInfo) {
      skills.push(skillInfo);

      const category = categorizeSkill(skillName);
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(skillInfo);
    }
  }

  console.log(`Extracted metadata from ${skills.length} skills`);

  // Generate markdown
  let output = `# Skills Index

> Auto-generated index of ${skills.length} available skills.
> Use this to discover skills without loading all files into context.
>
> **To use a skill**: Read the full skill at \`~/.claude/skills/<skill-name>/SKILL.md\`

## Quick Reference

| Category | Count |
|----------|-------|
`;

  // Sort categories by count
  const sortedCategories = Object.entries(categorized)
    .sort((a, b) => b[1].length - a[1].length);

  for (const [category, categorySkills] of sortedCategories) {
    output += `| ${category} | ${categorySkills.length} |\n`;
  }

  output += `\n---\n\n`;

  // Output by category
  for (const [category, categorySkills] of sortedCategories) {
    output += `## ${category}\n\n`;

    for (const skill of categorySkills) {
      const desc = skill.description
        ? skill.description.replace(/\n/g, ' ').slice(0, 150)
        : 'No description';
      output += `### ${skill.name}\n`;
      output += `\`${skill.path}\`\n\n`;
      output += `${desc}${skill.description && skill.description.length > 150 ? '...' : ''}\n\n`;
    }
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`\nGenerated: ${OUTPUT_FILE}`);
  console.log(`File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);

  // Also generate a compact JSON version for programmatic use
  const jsonOutput = path.join(__dirname, '..', 'skills-index.json');
  const jsonData = skills.map(s => ({
    name: s.name,
    path: s.path,
    description: s.description ? s.description.slice(0, 200) : ''
  }));
  fs.writeFileSync(jsonOutput, JSON.stringify(jsonData, null, 2));
  console.log(`Generated: ${jsonOutput}`);
}

// Run
generateIndex();
