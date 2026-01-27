#!/usr/bin/env python3
"""
Sync Skills from Multiple Upstream Sources

This script merges skills from multiple repositories with conflict detection
and priority-based resolution.

Usage:
    python sync_skills.py --primary /path/to/primary --secondary /path/to/secondary --target ./skills
"""

import os
import sys
import shutil
import argparse
import yaml
import json
from datetime import datetime
from pathlib import Path


def load_config(config_path: str) -> dict:
    """Load SYNC_CONFIG.yaml"""
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def get_skill_metadata(skill_path: Path) -> dict:
    """Extract metadata from SKILL.md frontmatter"""
    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return {}

    try:
        with open(skill_md, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse YAML frontmatter
        if content.startswith('---'):
            end = content.find('---', 3)
            if end != -1:
                frontmatter = content[3:end].strip()
                return yaml.safe_load(frontmatter) or {}
    except Exception as e:
        print(f"  Warning: Could not parse {skill_md}: {e}")

    return {}


def get_skill_modified_time(skill_path: Path) -> datetime:
    """Get the latest modification time of any file in the skill directory"""
    latest = datetime.min
    for file in skill_path.rglob('*'):
        if file.is_file():
            mtime = datetime.fromtimestamp(file.stat().st_mtime)
            if mtime > latest:
                latest = mtime
    return latest


def merge_skills(primary_dir: str, secondary_dir: str, target_dir: str,
                 strategy: str = 'prefer-primary') -> dict:
    """
    Merge skills from primary and secondary sources into target.

    Strategy:
    - prefer-primary: Always use primary if exists
    - prefer-newer: Compare modification times
    - manual-review: Create conflict markers
    """
    primary_path = Path(primary_dir)
    secondary_path = Path(secondary_dir)
    target_path = Path(target_dir)

    report = {
        'added_from_primary': [],
        'added_from_secondary': [],
        'updated': [],
        'conflicts': [],
        'skipped': [],
        'total_skills': 0
    }

    # Ensure target directory exists
    target_path.mkdir(parents=True, exist_ok=True)

    # Get all skill names from both sources
    primary_skills = set()
    secondary_skills = set()

    if primary_path.exists():
        primary_skills = {d.name for d in primary_path.iterdir()
                         if d.is_dir() and not d.name.startswith('.')}

    if secondary_path.exists():
        secondary_skills = {d.name for d in secondary_path.iterdir()
                           if d.is_dir() and not d.name.startswith('.')}

    all_skills = primary_skills | secondary_skills
    print(f"\nFound {len(primary_skills)} skills in primary source")
    print(f"Found {len(secondary_skills)} skills in secondary source")
    print(f"Total unique skills: {len(all_skills)}\n")

    # Process each skill
    for skill_name in sorted(all_skills):
        in_primary = skill_name in primary_skills
        in_secondary = skill_name in secondary_skills
        target_skill_path = target_path / skill_name

        if in_primary and in_secondary:
            # Skill exists in both sources
            if strategy == 'prefer-primary':
                source = primary_path / skill_name
                shutil.copytree(source, target_skill_path, dirs_exist_ok=True)
                report['updated'].append(skill_name)
                print(f"  [PRIMARY] {skill_name}")

            elif strategy == 'prefer-newer':
                primary_time = get_skill_modified_time(primary_path / skill_name)
                secondary_time = get_skill_modified_time(secondary_path / skill_name)

                if primary_time >= secondary_time:
                    source = primary_path / skill_name
                    print(f"  [PRIMARY-NEWER] {skill_name}")
                else:
                    source = secondary_path / skill_name
                    print(f"  [SECONDARY-NEWER] {skill_name}")

                shutil.copytree(source, target_skill_path, dirs_exist_ok=True)
                report['updated'].append(skill_name)

            else:  # manual-review
                # Copy primary and create conflict marker
                source = primary_path / skill_name
                shutil.copytree(source, target_skill_path, dirs_exist_ok=True)

                # Create conflict file
                conflict_file = target_skill_path / '.CONFLICT'
                with open(conflict_file, 'w') as f:
                    f.write(f"CONFLICT: Skill exists in both sources\n")
                    f.write(f"Primary: {primary_path / skill_name}\n")
                    f.write(f"Secondary: {secondary_path / skill_name}\n")
                    f.write(f"Resolve manually and delete this file.\n")

                report['conflicts'].append(skill_name)
                print(f"  [CONFLICT] {skill_name}")

        elif in_primary:
            # Only in primary
            source = primary_path / skill_name
            shutil.copytree(source, target_skill_path, dirs_exist_ok=True)
            report['added_from_primary'].append(skill_name)
            print(f"  [+PRIMARY] {skill_name}")

        else:
            # Only in secondary
            source = secondary_path / skill_name
            shutil.copytree(source, target_skill_path, dirs_exist_ok=True)
            report['added_from_secondary'].append(skill_name)
            print(f"  [+SECONDARY] {skill_name}")

    report['total_skills'] = len(all_skills)
    return report


def save_report(report: dict, output_path: str):
    """Save merge report as JSON"""
    report['timestamp'] = datetime.now().isoformat()
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)


def main():
    parser = argparse.ArgumentParser(description='Sync skills from multiple sources')
    parser.add_argument('--primary', required=True, help='Primary source directory')
    parser.add_argument('--secondary', required=True, help='Secondary source directory')
    parser.add_argument('--target', required=True, help='Target directory')
    parser.add_argument('--config', default='SYNC_CONFIG.yaml', help='Config file path')
    parser.add_argument('--strategy', default='prefer-primary',
                        choices=['prefer-primary', 'prefer-newer', 'manual-review'])

    args = parser.parse_args()

    print("=" * 60)
    print("SKILL SYNC - Multi-Source Merger")
    print("=" * 60)
    print(f"Primary:   {args.primary}")
    print(f"Secondary: {args.secondary}")
    print(f"Target:    {args.target}")
    print(f"Strategy:  {args.strategy}")
    print("=" * 60)

    # Load config if exists
    config = {}
    if os.path.exists(args.config):
        config = load_config(args.config)
        strategy = config.get('sync', {}).get('merge_strategy', args.strategy)
    else:
        strategy = args.strategy

    # Perform merge
    report = merge_skills(
        args.primary,
        args.secondary,
        args.target,
        strategy
    )

    # Print summary
    print("\n" + "=" * 60)
    print("SYNC COMPLETE")
    print("=" * 60)
    print(f"Total skills:        {report['total_skills']}")
    print(f"From primary:        {len(report['added_from_primary'])}")
    print(f"From secondary:      {len(report['added_from_secondary'])}")
    print(f"Updated (overlap):   {len(report['updated'])}")
    print(f"Conflicts:           {len(report['conflicts'])}")

    # Save report
    save_report(report, 'sync_report.json')
    print(f"\nReport saved to: sync_report.json")

    if report['conflicts']:
        print(f"\n⚠️  {len(report['conflicts'])} conflicts need manual review!")
        sys.exit(1)


if __name__ == '__main__':
    main()
