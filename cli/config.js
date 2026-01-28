/**
 * Devkit Configuration
 *
 * Defines skill categories and minimal skill sets for optimized installation.
 *
 * NOTE: Commands (/plan, /brainstorm, /cook, etc.) and Agents are ALWAYS installed
 * regardless of --minimal or --category options. Only the skills/ directory is filtered.
 */

// Core skills that are always installed with --minimal
// These are reference/best-practice skills, not commands
const MINIMAL_SKILLS = [
  // Best practices
  'react-best-practices',
  'typescript-best-practices',
  'postgres-best-practices',
  'api-security-best-practices',
  // Core workflows
  'git-commit',
  'code-review',
  'debugging',
  'testing',
  'refactoring',
  // Architecture
  'api-patterns',
  'architecture',
  'clean-code',
  // Operations
  'documentation',
  'error-handling',
  'logging',
  'performance-optimization',
  'security-best-practices',
  // AI/MCP
  'mcp-management',
  'sequential-thinking'
];

// Skill categories for --category option
const SKILL_CATEGORIES = {
  'react': [
    'react-best-practices',
    'react-native',
    'nextjs',
    'remix',
    'vite-react',
    'react-query',
    'react-hooks',
    'react-testing',
    'react-performance'
  ],
  'typescript': [
    'typescript-best-practices',
    'typescript-advanced',
    'typescript-patterns',
    'zod-validation'
  ],
  'node': [
    'nodejs',
    'nestjs',
    'express',
    'fastify',
    'prisma',
    'drizzle'
  ],
  'database': [
    'postgres-best-practices',
    'mongodb',
    'redis',
    'sql-optimization',
    'database-design'
  ],
  'devops': [
    'docker',
    'kubernetes',
    'ci-cd',
    'github-actions',
    'terraform',
    'aws',
    'cloudflare-expert'
  ],
  'testing': [
    'testing',
    'jest',
    'playwright',
    'cypress',
    'vitest',
    'test-driven-development'
  ],
  'security': [
    'security-best-practices',
    'api-security-best-practices',
    'owasp',
    'authentication',
    'authorization'
  ],
  'ai': [
    'ai-agents-architect',
    'ai-product',
    'mcp-management',
    'prompt-engineering',
    'langchain',
    'openai-integration'
  ],
  'mobile': [
    'react-native',
    'flutter',
    'ios-development',
    'android-development',
    'mobile-optimization'
  ],
  'frontend': [
    'css-architecture',
    'tailwindcss',
    'animation',
    'accessibility',
    'responsive-design',
    'web-performance'
  ],
  'backend': [
    'api-patterns',
    'microservices',
    'event-driven',
    'caching',
    'queue-systems',
    'rate-limiting'
  ],
  'tools': [
    'git-commit',
    'code-review',
    'debugging',
    'refactoring',
    'documentation',
    'repomix'
  ]
};

// Get all available categories
function getCategories() {
  return Object.keys(SKILL_CATEGORIES);
}

// Get skills for specific categories
function getSkillsForCategories(categories) {
  const skills = new Set();

  for (const category of categories) {
    const categorySkills = SKILL_CATEGORIES[category.toLowerCase()];
    if (categorySkills) {
      categorySkills.forEach(skill => skills.add(skill));
    }
  }

  return Array.from(skills);
}

// Check if a skill matches the filter
function shouldIncludeSkill(skillName, options = {}) {
  const { minimal, categories, selectedSkills } = options;

  // If specific skills are selected, check against that list
  if (selectedSkills && selectedSkills.length > 0) {
    return selectedSkills.some(s =>
      skillName.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(skillName.toLowerCase())
    );
  }

  // If minimal mode, only include minimal skills
  if (minimal) {
    return MINIMAL_SKILLS.some(s =>
      skillName.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(skillName.toLowerCase())
    );
  }

  // If categories specified, check against category skills
  if (categories && categories.length > 0) {
    const categorySkills = getSkillsForCategories(categories);
    return categorySkills.some(s =>
      skillName.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(skillName.toLowerCase())
    );
  }

  // Default: include all
  return true;
}

module.exports = {
  MINIMAL_SKILLS,
  SKILL_CATEGORIES,
  getCategories,
  getSkillsForCategories,
  shouldIncludeSkill
};
