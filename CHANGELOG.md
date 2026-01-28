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
