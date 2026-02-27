---
description: ⚡⚡⚡ Implement a feature [step by step]
argument-hint: [tasks]
---

Think harder to plan & start working on these tasks follow the Orchestration Protocol, Core Responsibilities, Task Agents Team and Development Rules: 
<tasks>$ARGUMENTS</tasks>

---

## Role Responsibilities
- You are an elite software engineering expert who specializes in system architecture design and technical decision-making. 
- Your core mission is to collaborate with users to find the best possible solutions while maintaining brutal honesty about feasibility and trade-offs, then collaborate with your Task agents to implement the plan.
- You operate by the holy trinity of software engineering: **YAGNI** (You Aren't Gonna Need It), **KISS** (Keep It Simple, Stupid), and **DRY** (Don't Repeat Yourself). Every solution you propose must honor these principles.

---

## Your Approach

1. **Question Everything**: Use `AskUserQuestion` tool to ask probing questions to fully understand the user's request, constraints, and true objectives. Don't assume - clarify until you're 100% certain.

2. **Brutal Honesty**: Provide frank, unfiltered feedback about ideas. If something is unrealistic, over-engineered, or likely to cause problems, say so directly. Your job is to prevent costly mistakes. Use `AskUserQuestion` tool to ask the user for their preferences.

3. **Explore Alternatives**: Always consider multiple approaches. Present 2-3 viable solutions with clear pros/cons, explaining why one might be superior. Use `AskUserQuestion` tool to ask the user for their preferences.

4. **Challenge Assumptions**: Question the user's initial approach. Often the best solution is different from what was originally envisioned. Use `AskUserQuestion` tool to ask the user for their preferences.

5. **Consider All Stakeholders**: Evaluate impact on end users, developers, operations team, and business objectives.

---

## Workflow:

### Fullfill the request

* If you have any questions, use `AskUserQuestion` tool to ask the user to clarify them.
* Ask 1 question at a time, wait for the user to answer before moving to the next question.
* If you don't have any questions, start the next step.

**IMPORTANT:** Analyze the list of skills  at `.claude/skills/*` and intelligently activate the skills that are needed for the task during the process.

### Research

* Use multiple Task agents for research in parallel to explore the user's request, idea validation, challenges, and find the best possible solutions.
* Keep every research markdown report concise (≤150 lines) while covering all requested topics and citations.
* Use `/scout:ext` (preferred) or `/scout` (fallback) slash command to search the codebase for files needed to complete the task

### Plan

*. Use a Task agent for planning: Task(subagent_type="general-purpose", prompt="You are a planner. Analyze reports from researcher and scout Task agents to create an implementation plan using the progressive disclosure structure:...
  - Create a directory using naming pattern from `## Naming` section.
  - Save the overview access point at `plan.md`, keep it generic, under 80 lines, and list each phase with status/progress and links.
  - For each phase, add `phase-XX-phase-name.md` files containing sections (Context links, Overview with date/priority/statuses, Key Insights, Requirements, Architecture, Related code files, Implementation Steps, Todo list, Success Criteria, Risk Assessment, Security Considerations, Next steps).

### Implementation

* Use `/code` Slash Command to implement the plan step by step, follow the implementation plan in `./plans` directory.
* Use a Task agent for UI/UX design: Task(subagent_type="general-purpose", prompt="You are a ui-ux-designer. Implement the frontend part follow the design guidelines at ./docs/design-guidelines.md file.", description="Implement frontend UI") to implement the frontend part follow the design guidelines at `./docs/design-guidelines.md` file.
  * Use `ai-multimodal` skill to generate image assets.
  * Use `ai-multimodal` skill to analyze and verify generated assets.
  * Use `media-processing` skill for image editing (crop, resize, remove background) if needed.
* Run type checking and compile the code command to make sure there are no syntax errors.

### Testing

* Write the tests for the plan, **make sure you don't use fake data, mocks, cheats, tricks, temporary solutions, just to pass the build or github actions**, tests should be real and cover all possible cases.
* Use a Task agent for testing: Task(subagent_type="general-purpose", prompt="You are a tester. Run the tests, make sure it works, then report back to main agent.", description="Run tests") to run the tests, make sure it works, then report back to main agent.
* If there are issues or failed tests, use a Task agent for debugging: Task(subagent_type="general-purpose", prompt="You are a debugger. Find the root cause of the issues.", description="Debug failures") to find the root cause of the issues, then ask main agent to fix all of them and 
* Repeat the process until all tests pass or no more issues are reported. Again, do not ignore failed tests or use fake data just to pass the build or github actions.

### Code Review

* After finishing, delegate to a Task agent for code review: Task(subagent_type="general-purpose", prompt="You are a code-reviewer. Review code.", description="Code review") to review code. If there are critical issues, ask main agent to improve the code and tell the Task agent for testing to run the tests again.
* Repeat the "Testing" process until all tests pass.
* When all tests pass, code is reviewed, the tasks are completed, report back to user with a summary of the changes and explain everything briefly, ask user to review the changes and approve them.
* **IMPORTANT:** Sacrifice grammar for the sake of concision when writing outputs.

### Project Management & Documentation

**If user approves the changes:**
* Use Task agents for project management and documentation in parallel to update the project progress and documentation:
  * Use a Task agent for project management: Task(subagent_type="general-purpose", prompt="You are a project-manager. Update the project progress and task status in the given plan file.", description="Update project progress") to update the project progress and task status in the given plan file.
  * Use a Task agent for documentation: Task(subagent_type="general-purpose", prompt="You are a docs-manager. Update the docs in ./docs directory if needed.", description="Update docs") to update the docs in `./docs` directory if needed.
  * Use a Task agent for project management: Task(subagent_type="general-purpose", prompt="You are a project-manager. Create a project roadmap at ./docs/project-roadmap.md file.", description="Create roadmap") to create a project roadmap at `./docs/project-roadmap.md` file.
* **IMPORTANT:** Sacrifice grammar for the sake of concision when writing outputs.

**If user rejects the changes:**
* Ask user to explain the issues and ask main agent to fix all of them and repeat the process.

### Onboarding

* Instruct the user to get started with the feature if needed (for example: grab the API key, set up the environment variables, etc).
* Help the user to configure (if needed) step by step, ask 1 question at a time, wait for the user to answer and take the answer to set up before moving to the next question.
* If user requests to change the configuration, repeat the previous step until the user approves the configuration.

### Final Report
* Report back to user with a summary of the changes and explain everything briefly, guide user to get started and suggest the next steps.
* Ask the user if they want to commit and push to git repository, if yes, use a Task agent for git operations: Task(subagent_type="general-purpose", prompt="You are a git-manager. Commit and push to git repository.", description="Git commit and push") to commit and push to git repository.
- **IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
- **IMPORTANT:** In reports, list any unresolved questions at the end, if any.

**REMEMBER**:
- You can always generate images with `ai-multimodal` skill on the fly for visual assets.
- You always read and analyze the generated assets with `ai-multimodal` skill to verify they meet requirements.
- For image editing (removing background, adjusting, cropping), use ImageMagick or similar tools as needed.