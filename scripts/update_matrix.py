#!/usr/bin/env python3
"""
Update Matrix Index Files

This script scans all skills and auto-generates/updates the matrix-skills
YAML files for skill discovery.

Usage:
    python update_matrix.py
"""

import os
import yaml
from pathlib import Path
from collections import defaultdict
from datetime import datetime


# Category mappings for auto-categorization
CATEGORY_KEYWORDS = {
    'backend': ['api', 'backend', 'server', 'database', 'sql', 'rest', 'graphql',
                'fastapi', 'nestjs', 'django', 'express', 'prisma', 'orm'],
    'frontend': ['react', 'vue', 'angular', 'frontend', 'css', 'tailwind', 'ui',
                 'nextjs', 'nuxt', 'svelte', 'component', 'styling'],
    'security': ['security', 'pentest', 'xss', 'sql-injection', 'auth', 'csrf',
                 'vulnerability', 'hacking', 'exploit', 'firewall', 'encryption'],
    'devops': ['docker', 'kubernetes', 'ci-cd', 'deployment', 'aws', 'azure',
               'gcp', 'terraform', 'ansible', 'monitoring', 'logging'],
    'ai-ml': ['ai', 'ml', 'machine-learning', 'llm', 'agent', 'rag', 'prompt',
              'embeddings', 'fine-tuning', 'neural', 'deep-learning'],
    'mobile': ['mobile', 'ios', 'android', 'react-native', 'flutter', 'swift',
               'kotlin', 'expo'],
    'data': ['data', 'analytics', 'pandas', 'spark', 'etl', 'warehouse',
             'bigquery', 'snowflake', 'dbt'],
    'quality': ['test', 'testing', 'qa', 'tdd', 'bdd', 'playwright', 'jest',
                'cypress', 'debugging', 'code-review'],
    'design': ['design', 'ux', 'ui-ux', 'figma', 'prototype', 'accessibility',
               'color', 'typography', 'responsive'],
    'tools': ['git', 'cli', 'bash', 'scripting', 'automation', 'workflow',
              'productivity', 'terminal'],
    'languages': ['typescript', 'python', 'golang', 'rust', 'java', 'csharp',
                  'php', 'ruby', 'cpp'],
    'cloud': ['aws', 'azure', 'gcp', 'cloud', 'serverless', 'lambda', 'functions',
              'cdn', 's3', 'cloudflare'],
    'architecture': ['architecture', 'microservices', 'monolith', 'design-patterns',
                     'ddd', 'event-driven', 'cqrs', 'clean-code'],
}


def get_skill_metadata(skill_path: Path) -> dict:
    """Extract metadata from SKILL.md frontmatter"""
    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return {}

    try:
        with open(skill_md, 'r', encoding='utf-8') as f:
            content = f.read()

        if content.startswith('---'):
            end = content.find('---', 3)
            if end != -1:
                frontmatter = content[3:end].strip()
                return yaml.safe_load(frontmatter) or {}
    except Exception:
        pass

    return {}


def categorize_skill(skill_name: str, metadata: dict) -> str:
    """Determine the category of a skill based on name and metadata"""
    # Check metadata first
    if 'category' in metadata:
        return metadata['category'].lower()

    # Match by keywords in skill name
    skill_lower = skill_name.lower()
    description = metadata.get('description', '').lower()

    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in skill_lower or keyword in description:
                return category

    # Default category
    return 'tools'


def scan_skills(skills_dir: str) -> dict:
    """Scan all skills and categorize them"""
    skills_path = Path(skills_dir)
    categorized = defaultdict(list)

    if not skills_path.exists():
        print(f"Warning: Skills directory not found: {skills_dir}")
        return categorized

    for skill_dir in skills_path.iterdir():
        if not skill_dir.is_dir() or skill_dir.name.startswith('.'):
            continue

        skill_name = skill_dir.name
        metadata = get_skill_metadata(skill_dir)
        category = categorize_skill(skill_name, metadata)

        try:
            priority = int(metadata.get('priority', 5))
        except (ValueError, TypeError):
            priority = 5

        skill_entry = {
            'skill_id': skill_name,
            'category': 'core',
            'priority_score': priority,
            'relevance_mapping': {
                'agents': [],
                'profiles': [f"{category}:*"]
            },
            'description': metadata.get('description', f"Skill: {skill_name}")
        }

        categorized[category].append(skill_entry)

    return categorized


def generate_matrix_files(categorized_skills: dict, output_dir: str):
    """Generate matrix-skills YAML files"""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate category files
    for category, skills in categorized_skills.items():
        file_path = output_path / f"{category}.yaml"

        content = {
            'domain': category,
            'description': f"Skills related to {category}",
            'skill_count': len(skills),
            'updated': datetime.now().isoformat(),
            'skills': sorted(skills, key=lambda x: -x['priority_score'])
        }

        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(content, f, default_flow_style=False, sort_keys=False,
                      allow_unicode=True)

        print(f"  Generated: {file_path.name} ({len(skills)} skills)")

    # Generate index file
    generate_index(categorized_skills, output_path)


def generate_index(categorized_skills: dict, output_path: Path):
    """Generate _index.yaml"""
    total_skills = sum(len(skills) for skills in categorized_skills.values())

    domains = {}
    for category, skills in categorized_skills.items():
        domains[category] = {
            'file': f"{category}.yaml",
            'skill_count': len(skills),
            'description': f"Skills for {category} development"
        }

    index_content = {
        'name': "Devkit Agent Assistant Matrix Index",
        'description': "Central registry for skill discovery system",
        'total_skills': total_skills,
        'domain_count': len(categorized_skills),
        'updated': datetime.now().isoformat(),
        'domains': domains,
        'agent_profiles': {
            'backend-engineer': {
                'inherit_from': ['backend', 'database', 'api', 'security']
            },
            'frontend-engineer': {
                'inherit_from': ['frontend', 'design', 'performance']
            },
            'fullstack-engineer': {
                'inherit_from': ['backend', 'frontend', 'devops']
            },
            'security-engineer': {
                'inherit_from': ['security', 'backend']
            },
            'devops-engineer': {
                'inherit_from': ['devops', 'cloud', 'tools']
            },
            'data-engineer': {
                'inherit_from': ['data', 'backend', 'cloud']
            },
            'mobile-engineer': {
                'inherit_from': ['mobile', 'frontend']
            },
            'architect': {
                'inherit_from': ['architecture', 'backend', 'frontend', 'cloud']
            }
        }
    }

    index_file = output_path / '_index.yaml'
    with open(index_file, 'w', encoding='utf-8') as f:
        yaml.dump(index_content, f, default_flow_style=False, sort_keys=False,
                  allow_unicode=True)

    print(f"\n  Generated: _index.yaml (Total: {total_skills} skills)")


def main():
    print("=" * 60)
    print("MATRIX INDEX UPDATER")
    print("=" * 60)

    skills_dir = './skills'
    matrix_dir = './matrix-skills'

    print(f"\nScanning skills in: {skills_dir}")
    categorized = scan_skills(skills_dir)

    if not categorized:
        print("No skills found!")
        return

    print(f"\nFound {sum(len(s) for s in categorized.values())} skills in {len(categorized)} categories")
    print("\nGenerating matrix files...")
    generate_matrix_files(categorized, matrix_dir)

    print("\n" + "=" * 60)
    print("MATRIX UPDATE COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()
