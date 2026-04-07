# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **CI/CD**: GitHub Actions workflow to automatically deploy to GitHub Pages.
- **Theming**: Dynamic brand theming (Ocean Blue, Royal Purple) with a live switcher UI.
- **Forms**: Phone Input, Date/Time Pickers, Action Icons, and a complete Login Form template.
- **Layouts**: Interactive sidebar layout demo featuring multiple pages (Dashboard, Patients, etc.).
- **Components**: 9 new components including Dropdown Menu, Drawer, Collapse/Accordion, Tags, MultiSelect, Empty State, Dividers, Anchor Navigation, and Notifications.
- **Developer Tools**: `CodeBlock` component with syntax highlighting and usage snippets for all sections.
- **Interactivity**: Click-to-copy functionality for color swatches and tokens.
- **States**: Loading button variants and extensive disabled states for toggles and inputs.
- **Documentation**: Comprehensive `README.md` with usage instructions and token references.

### Changed
- **Accessibility**: Adjusted color palette (warning, danger, grey scales) to ensure WCAG AA contrast compliance.
- **Typography**: Normalized baseline font sizes from `--text-xs`/`--text-sm` to `--text-base` for better readability and updated the global font family.
- **Tokens**: Replaced hardcoded hex colors and pixel values with semantic CSS variables globally.
- **UI Refresh**: Restyled buttons (dimensions, padding, borders), tags, badges, dropdowns (capped at 33vh max-height), modal layouts, and pagination controls.
- **Architecture**: Integrated standalone EMR components directly into the main design system page.
- **Responsiveness**: Implemented a responsive layout supporting 1024px, 768px, and 480px breakpoints.
- **Naming Conventions**: Renamed `emr-*` CSS classes to generic names (e.g., `emr-tag` to `chip`) and renamed "Data Display" section to "Others" for broader applicability.

### Fixed
- **Tooltips**: Corrected `AriaTooltip` placement, keyboard support, hover delays, and enter/exit animations.
- **Typography**: Fixed grey text contrast issues in the typography overview section.
- **Layout**: Fixed phone extension input width to align properly with surrounding form elements.
- **Components**: Resolved `SelectValue` rendering issues and `MultiSelect` state behaviors.
- **Build**: Fixed React component build errors preventing automated deployment.

### Removed
- **Dependencies**: Removed numerous unused `lucide-react` icons and component imports to optimize bundle size.
- **Legacy Components**: Removed deprecated EMR specific status variants and the standalone EMR overview page (now unified).
