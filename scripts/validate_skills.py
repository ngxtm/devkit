#!/usr/bin/env python3
"""
Validate Skills Structure

Checks that all skills have valid SKILL.md files with required frontmatter.
"""

import os
import sys
import yaml
from pathlib import Path


def is_skill_container(skill_path: Path) -> bool:
    """Check if directory is a container for sub-skills (not a skill itself)."""
    # If it has no SKILL.md but contains subdirectories with SKILL.md, it's a container
    if (skill_path / 'SKILL.md').exists():
        return False
    for subdir in skill_path.iterdir():
        if subdir.is_dir() and (subdir / 'SKILL.md').exists():
            return True
    return False


def validate_skill(skill_path: Path) -> list[str]:
    """Validate a single skill directory. Returns list of errors."""
    errors = []
    skill_md = skill_path / 'SKILL.md'

    if not skill_md.exists():
        errors.append(f"Missing SKILL.md")
        return errors

    try:
        with open(skill_md, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for YAML frontmatter
        if not content.startswith('---'):
            errors.append("Missing YAML frontmatter (must start with ---)")
            return errors

        end = content.find('---', 3)
        if end == -1:
            errors.append("Invalid YAML frontmatter (missing closing ---)")
            return errors

        frontmatter = content[3:end].strip()
        metadata = yaml.safe_load(frontmatter) or {}

        # Check required fields
        if not metadata.get('name'):
            errors.append("Missing required field: name")
        if not metadata.get('description'):
            errors.append("Missing required field: description")

    except yaml.YAMLError as e:
        errors.append(f"Invalid YAML: {e}")
    except Exception as e:
        errors.append(f"Error reading file: {e}")

    return errors


def main():
    skills_dir = Path(__file__).parent.parent / 'skills'

    if not skills_dir.exists():
        print("Skills directory not found")
        sys.exit(1)

    skill_dirs = [d for d in skills_dir.iterdir()
                  if d.is_dir() and not d.name.startswith('.')
                  and not is_skill_container(d)]

    print(f"Validating {len(skill_dirs)} skills...")

    total_errors = 0
    for skill_path in sorted(skill_dirs):
        errors = validate_skill(skill_path)
        if errors:
            print(f"\n{skill_path.name}:")
            for error in errors:
                print(f"  - {error}")
            total_errors += len(errors)

    print(f"\n{'=' * 40}")
    if total_errors == 0:
        print(f"All {len(skill_dirs)} skills valid")
        sys.exit(0)
    else:
        print(f"Found {total_errors} error(s)")
        sys.exit(1)


if __name__ == '__main__':
    main()
