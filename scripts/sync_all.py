#!/usr/bin/env python3
"""
Run all sync operations

This is the main entry point for syncing all sources.
"""

import subprocess
import sys
from pathlib import Path


def run_command(cmd: list, description: str) -> bool:
    """Run a command and return success status"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"{'='*60}")

    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0


def main():
    scripts_dir = Path(__file__).parent

    # Check if we have source directories (for local testing)
    # In CI, these are cloned by the workflow

    steps = [
        {
            'cmd': [sys.executable, str(scripts_dir / 'sync_skills.py'),
                    '--primary', '/tmp/antigravity/skills',
                    '--secondary', '/tmp/agent-assistant/skills',
                    '--target', './skills'],
            'description': 'Sync skills from upstream sources'
        },
        {
            'cmd': [sys.executable, str(scripts_dir / 'update_matrix.py')],
            'description': 'Update matrix index files'
        }
    ]

    for step in steps:
        if not run_command(step['cmd'], step['description']):
            print(f"\n❌ Failed: {step['description']}")
            sys.exit(1)

    print("\n" + "="*60)
    print("✅ ALL SYNC OPERATIONS COMPLETE")
    print("="*60)


if __name__ == '__main__':
    main()
