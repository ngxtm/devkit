# [3.6.0](https://github.com/ngxtm/devkit/compare/v3.5.0...v3.6.0) (2026-02-06)


### Features

* **init:** add interactive tool selection menu ([568ddb1](https://github.com/ngxtm/devkit/commit/568ddb18792c0cb384a4f247444af0a499b59751))

# [3.5.0](https://github.com/ngxtm/devkit/compare/v3.4.1...v3.5.0) (2026-02-06)


### Features

* **skill:** add /learn interactive step-by-step learning mode ([d63a64f](https://github.com/ngxtm/devkit/commit/d63a64fc0b78398c19df3af1833c972152d173bc))

## [3.4.1](https://github.com/ngxtm/devkit/compare/v3.4.0...v3.4.1) (2026-02-03)


### Bug Fixes

* **publish:** include rules directory in npm package                                              The rules/ directory was missing from the files array in package.json, causing `devkit rules` to show 0 available rules when installed globally. ([3f74be6](https://github.com/ngxtm/devkit/commit/3f74be6373d44f64e21a6283138533577efb4ba3))

# [3.4.0](https://github.com/ngxtm/devkit/compare/v3.3.0...v3.4.0) (2026-02-03)


### Features

* **cli:** add rules management commands (add/remove/rules) ([9cdcdde](https://github.com/ngxtm/devkit/commit/9cdcddef75c008432f225ba89cafab2e8448cbf3))

# [3.3.0](https://github.com/ngxtm/devkit/compare/v3.2.0...v3.3.0) (2026-02-03)


### Features

* **rules:** add dotnet rules from upstream ([855edfa](https://github.com/ngxtm/devkit/commit/855edfa6506e586b11f54df90ff98a2d12aade46))
* **sync:** replace auto-sync with manual sync workflow ([5c9d51d](https://github.com/ngxtm/devkit/commit/5c9d51d6300eb6c202c923c285d2ad8fa1c46401))

# [3.2.0](https://github.com/ngxtm/devkit/compare/v3.1.0...v3.2.0) (2026-02-02)


### Features

* **scripts:** add sync:rules for manual rule sync from skill-rule ([9779967](https://github.com/ngxtm/devkit/commit/97799674ec7a252717beed2d27cb7297d1293f72))

# [3.1.0](https://github.com/ngxtm/devkit/compare/v3.0.3...v3.1.0) (2026-02-02)


### Bug Fixes

* **ci:** add validate_skills.py and fix SKILL.md frontmatter errors ([ca0d133](https://github.com/ngxtm/devkit/commit/ca0d133c714501cb1c4926a9fceeaa7d24bb8160))


### Features

* **skills:** auto-sync from upstream sources ([45b4155](https://github.com/ngxtm/devkit/commit/45b41556894d4b3e01aa534b6f6d9b70913a9beb))
* **skills:** auto-sync from upstream sources ([5505ecd](https://github.com/ngxtm/devkit/commit/5505ecd27bd8ba445ec0466a3c92942b70319346))

## [3.0.3](https://github.com/ngxtm/devkit/compare/v3.0.2...v3.0.3) (2026-01-31)


### Bug Fixes

* **ci:** enable CodeRabbit reviews and add CI for sync PRs ([a916ae3](https://github.com/ngxtm/devkit/commit/a916ae32f6edf9aa0cf83b81cc3c24b17f899e00))

## [3.0.2](https://github.com/ngxtm/devkit/compare/v3.0.1...v3.0.2) (2026-01-31)


### Bug Fixes

* **ci:** update create-pull-request action from v5 to v7 ([143b607](https://github.com/ngxtm/devkit/commit/143b60731bba83834cf70f2bf0519a78a2f788d8))

## [3.0.1](https://github.com/ngxtm/devkit/compare/v3.0.0...v3.0.1) (2026-01-29)


### Bug Fixes

* **tests:** resolve test failures across multiple suites ([4303a8d](https://github.com/ngxtm/devkit/commit/4303a8d00d12b6ab2237aafb92ec7ac841f42af1))

# [3.0.0](https://github.com/ngxtm/devkit/compare/v2.1.0...v3.0.0) (2026-01-29)


### Features

* **v3:** refactor to per-project installation with smart tech detection ([3bc8c00](https://github.com/ngxtm/devkit/commit/3bc8c002671adbb8e536bef92cb2f89c5080e3c4))


### BREAKING CHANGES

* **v3:** Remove global `devkit install` command

   - Add `devkit init` as primary command for per-project installation
   - Add smart project detection (Flutter, React, Next.js, NestJS, Golang, Python, etc.)
   - Install only tech-specific rules based on detection (~500KB vs 59MB)
   - Merge commands from agent-assistant and claudekit sources
   - Add `devkit update` for re-detection and rule updates
   - Add `devkit detect` to show detected technologies
   - Create shared utils module for DRY code
   - Add path validation and JSON parsing error handling
   - Generate merged-commands/ with 100 unified commands
   - Generate templates/ with organized rules per tech stack
   - Generate rules-index.json for rule metadata

   This reduces context usage from ~59MB to ~300-500KB per project,
   avoiding context limit crashes while ensuring best practices
   are enforced for the detected tech stack.

# [2.1.0](https://github.com/ngxtm/devkit/compare/v2.0.2...v2.1.0) (2026-01-28)


### Features

* add devkit init command for per-project installation ([c222e59](https://github.com/ngxtm/devkit/commit/c222e59a966d4f06466fc8190bda544c6a19abfb))
* update lite mode ([9a9f6f6](https://github.com/ngxtm/devkit/commit/9a9f6f6c48eb8351280c3a384ddb30fe87892b48))

## [2.0.2](https://github.com/ngxtm/devkit/compare/v2.0.1...v2.0.2) (2026-01-28)


### Bug Fixes

* install commands to correct directory for Claude Code ([b1f0f59](https://github.com/ngxtm/devkit/commit/b1f0f59d99144170e415962cf79988bc5d11b2bb))

## [2.0.1](https://github.com/ngxtm/devkit/compare/v2.0.0...v2.0.1) (2026-01-28)


### Bug Fixes

* update skill config with correct directory names ([68d305d](https://github.com/ngxtm/devkit/commit/68d305df56fd5bf4e12e4e9a97e4a6dc3a30c226))

# [2.0.0](https://github.com/ngxtm/devkit/compare/v1.0.0...v2.0.0) (2026-01-28)


### Features

* add index-only install mode and uninstall command ([286549b](https://github.com/ngxtm/devkit/commit/286549b05b75534539cf6a197cef141ae1491fdb))


### BREAKING CHANGES

* Default install now uses index-only mode.
   Use --full flag for previous behavior.

# 1.0.0 (2026-01-28)


### Bug Fixes

* add .npmrc creation and token verification step ([41a2a7c](https://github.com/ngxtm/devkit/commit/41a2a7c1fd7a34df55f69adef3a63cba274dd796))
* add conventional-changelog-conventionalcommits dependency ([8c846fe](https://github.com/ngxtm/devkit/commit/8c846fe0d99224022f203c8c8bcfa3fcdf88a07a))
* add package-lock.json for CI ([0dc57fa](https://github.com/ngxtm/devkit/commit/0dc57fa307d8a886da33a22bf8b68266a35c3eab))
* update repository URL to ngxtm/devkit ([90365d8](https://github.com/ngxtm/devkit/commit/90365d8067d8cc433487a2659cf6e9d5ffccf59f))


### Features

* initial release v1.0.0 ([7cc1e60](https://github.com/ngxtm/devkit/commit/7cc1e603d0a00fd6f3ad0bdefadcebfe151649f6))
* initial unified agent assistant with 414 skills, hooks, and claudekit integration ([0c7c1dd](https://github.com/ngxtm/devkit/commit/0c7c1ddc2274c179518da439b511f378c5c88b23))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure
- Multi-source skill sync from antigravity-awesome-skills and agent-assistant
- Matrix skill discovery system
- GitHub Actions for auto-sync and releases
- CLI for installation
- Rules sync from skill-rule

### Changed
- N/A

### Fixed
- N/A
