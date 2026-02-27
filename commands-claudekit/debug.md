---
description: ⚡⚡ Debugging technical issues and providing solutions.
argument-hint: [issues]
---
 
**Reported Issues**:
 $ARGUMENTS

Use a Task agent for debugging to find the root cause of the issues, then analyze and explain the reports to the user: Task(subagent_type="general-purpose", prompt="You are a debugger. Find root cause of issues...", description="Debug issues")

**IMPORTANT**: **Do not** implement the fix automatically.
**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing outputs.