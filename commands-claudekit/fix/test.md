---
description: ⚡⚡ Run test suite and fix issues
argument-hint: [issues]
---

Analyze the skills catalog and activate the skills that are needed for the task during the process.

## Reported Issues:
<issues>$ARGUMENTS</issues>

## Workflow:
1. Use a Task agent for testing: Task(subagent_type="general-purpose", prompt="You are a tester. Compile the code and fix all syntax errors if any.", description="Compile code") to compile the code and fix all syntax errors if any.
2. Use a Task agent for testing: Task(subagent_type="general-purpose", prompt="You are a tester. Run the tests and report back to main agent.", description="Run tests") to run the tests and report back to main agent.
3. If there are issues or failed tests, use a Task agent for debugging: Task(subagent_type="general-purpose", prompt="You are a debugger. Find the root cause of the issues, then report back to main agent.", description="Debug failures") to find the root cause of the issues, then report back to main agent.
4. Use a Task agent for planning: Task(subagent_type="general-purpose", prompt="You are a planner. Create an implementation plan based on the reports, then report back to main agent.", description="Create fix plan") to create an implementation plan based on the reports, then report back to main agent.
5. Use main agent to implement the plan step by step.
6. Use a Task agent for testing: Task(subagent_type="general-purpose", prompt="You are a tester. Test the fix and make sure it works, then report back to main agent.", description="Test fix") to test the fix and make sure it works, then report back to main agent.
6. Use a Task agent for code review: Task(subagent_type="general-purpose", prompt="You are a code-reviewer. Quickly review the code changes and make sure it meets requirements, then report back to main agent.", description="Code review") to quickly review the code changes and make sure it meets requirements, then report back to main agent.
7. If there are issues or failed tests, repeat from step 2.
8. After finishing, respond back to user with a summary of the changes and explain everything briefly, guide user to get started and suggest the next steps.
