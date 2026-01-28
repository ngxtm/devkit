/**
 * Devkit Configuration
 *
 * Defines skill categories and minimal skill sets for optimized installation.
 *
 * NOTE: Commands (/plan, /brainstorm, /cook, etc.) and Agents are ALWAYS installed
 * regardless of --minimal or --category options. Only the skills/ directory is filtered.
 */

// Core skills that are always installed with --minimal
// Using exact directory names for accurate matching
const MINIMAL_SKILLS = [
  // Best practices
  'react-best-practices',
  'typescript-expert',
  'typescript-pro',
  'postgres-best-practices',
  'api-security-best-practices',
  'nodejs-best-practices',
  // Core workflows
  'code-review',
  'debugging',
  'testing-patterns',
  'code-refactoring',
  // Architecture
  'api-patterns',
  'architecture',
  'clean-code',
  'software-architecture',
  // Operations
  'code-documentation',
  'performance-profiling',
  // AI/MCP
  'mcp-management',
  'sequential-thinking',
  // Git
  'git-pushing'
];

// Skill categories for --category option
// Using patterns that match actual directory names
const SKILL_CATEGORIES = {
  'react': [
    'react-best-practices',
    'react-expert',
    'react-patterns',
    'react-ui-patterns',
    'react-native-expert',
    'react-flow-node',
    'nextjs-best-practices',
    'nextjs-developer',
    'nextjs-supabase-auth',
    'expo-app-design',
    'expo-deployment'
  ],
  'typescript': [
    'typescript-expert',
    'typescript-pro',
    'javascript-typescript',
    'javascript-mastery',
    'javascript-pro'
  ],
  'node': [
    'nodejs-best-practices',
    'nestjs-expert',
    'fastapi-expert',
    'fastapi-router',
    'prisma-expert',
    'bullmq-specialist',
    'bun-development'
  ],
  'python': [
    'python-development',
    'python-patterns',
    'python-pro',
    'django-expert',
    'fastapi-expert',
    'pydantic-models',
    'pandas-pro'
  ],
  'database': [
    'postgres-best-practices',
    'postgres-pro',
    'neon-postgres',
    'database-design',
    'database-optimizer',
    'databases',
    'nosql-expert',
    'sql-pro'
  ],
  'devops': [
    'docker-expert',
    'kubernetes-specialist',
    'terraform-engineer',
    'github-workflow-automation',
    'aws-serverless',
    'aws-cdk-development',
    'aws-cost-operations',
    'gcp-cloud-run',
    'cloudflare-expert',
    'vercel-deploy',
    'vercel-deployment',
    'devops',
    'devops-engineer'
  ],
  'testing': [
    'testing-patterns',
    'test-driven-development',
    'tdd-workflow',
    'playwright-expert',
    'playwright-skill',
    'test-master',
    'test-fixing',
    'qa-regression'
  ],
  'security': [
    'api-security-best-practices',
    'secure-code-guardian',
    'security-reviewer',
    'ethical-hacking-methodology',
    'pentest-checklist',
    'pentest-commands',
    'aws-penetration-testing',
    'cloud-penetration-testing',
    'top-web-vulnerabilities'
  ],
  'ai': [
    'ai-agents-architect',
    'ai-product',
    'ai-multimodal',
    'mcp-management',
    'mcp-developer',
    'mcp-builder',
    'prompt-engineering',
    'prompt-engineer',
    'langgraph',
    'langfuse',
    'crewai',
    'rag-architect',
    'rag-engineer',
    'rag-implementation',
    'llm-application-dev',
    'llm-app-patterns',
    'sequential-thinking',
    'agent-memory-mcp',
    'agent-memory-systems',
    'autonomous-agent-patterns'
  ],
  'mobile': [
    'react-native-expert',
    'flutter-expert',
    'expo-app-design',
    'expo-deployment',
    'mobile-design',
    'mobile-development',
    'swift-expert',
    'kotlin-specialist'
  ],
  'frontend': [
    'frontend-development',
    'frontend-design',
    'frontend-dev-guidelines',
    'tailwind-patterns',
    'ui-design-system',
    'ui-styling',
    'ui-ux-pro-max',
    'web-design-guidelines',
    'web-performance-optimization',
    'threejs',
    'vue-expert',
    'angular-architect'
  ],
  'backend': [
    'backend-development',
    'backend-dev-guidelines',
    'api-patterns',
    'api-designer',
    'microservices-architect',
    'graphql',
    'graphql-architect',
    'websocket-engineer'
  ],
  'tools': [
    'git-pushing',
    'code-review',
    'debugging',
    'debugging-wizard',
    'code-refactoring',
    'code-documentation',
    'repomix',
    'browser-automation',
    'cli-developer'
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
  const lowerSkillName = skillName.toLowerCase();

  // If specific skills are selected, check against that list
  if (selectedSkills && selectedSkills.length > 0) {
    return selectedSkills.some(s => {
      const lowerS = s.toLowerCase();
      return lowerSkillName === lowerS ||
             lowerSkillName.includes(lowerS) ||
             lowerS.includes(lowerSkillName);
    });
  }

  // If minimal mode, only include minimal skills
  if (minimal) {
    return MINIMAL_SKILLS.some(s => {
      const lowerS = s.toLowerCase();
      return lowerSkillName === lowerS ||
             lowerSkillName.includes(lowerS) ||
             lowerS.includes(lowerSkillName);
    });
  }

  // If categories specified, check against category skills
  if (categories && categories.length > 0) {
    const categorySkills = getSkillsForCategories(categories);
    return categorySkills.some(s => {
      const lowerS = s.toLowerCase();
      return lowerSkillName === lowerS ||
             lowerSkillName.includes(lowerS) ||
             lowerS.includes(lowerSkillName);
    });
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
