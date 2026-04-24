# Changelog

Apr 24
  Color tokens
  - --vsee-success-light #F9FEF6 → #F1F9E1 (warmer, more saturated light-green).
  - --vsee-info-light #E0F2FE → #EBF7FE (lighter/cooler).
  - --vsee-danger #DC2626 → #D31212; --vsee-danger-light #FEE2E2 → #FEE7E7.

  Slider (new primitive)
  - Added .slider — custom-styled <input type="range"> with no native track chrome. 8px track, 16px brand thumb, cross-browser via -webkit-appearance:none + ::-webkit-slider-runnable-track/::-webkit-slider-thumb + ::-moz-range-track/::-moz-range-progress/::-moz-range-thumb. Disabled state greys thumb + fill (no opacity).
  - Docs demo in Components → Others with a live value + disabled example. WebKit fill is painted via a linear-gradient on the input's own background; Firefox uses native ::-moz-range-progress.

  Badge
  - Height 20px; padding 0 var(--vsee-sp-3) (12px); line-height: 1; box-sizing: border-box — total box is exactly 20×auto regardless of consumer box-sizing.

  Sidebar layout
  - .sidebar-layout: removed border-radius + min-height so the card fits its content.
  - .sidebar-panel: padding-bottom now = calc(sp-4 + sp-3 + caption-size × 1.4), matching the .sidebar-heading height for symmetric top/bottom gutters.
  - .sidebar-heading: line-height 1.4 (deterministic height for the padding calc).

  Dropdown + Select hover
  - .dropdown-item[data-focused] and .select-option[data-focused] now only change background (was also swapping color to --brand-dark). Text/icon color stays put on hover; [data-selected] on .select-option still inverts to white on brand.

  Phone field
  - .phone-ext-label color --text-secondary → --text-primary.

  Anchor bar (new helpers, currently unused)
  - .anchor-bar-right + .anchor-bar-group-title added for a right-aligned group within the anchor bar. Left in place for a future patterns/right-nav iteration; no current consumer.

  Docs site (App.tsx)
  - Overlays: Modal / Dialog moved here from PatternsLayouts; now button-triggered with a fixed-position backdrop (fadeIn). Dropdown Button moved in full (3 live demos — Actions secondary, MoreHorizontal icon, New Order with grouped Lab Orders / Imaging sections) from the Dropdowns section.
  - Dropdowns: section hidden (NAV entry removed; <ComponentsDropdowns /> render commented). Function + Select Dropdown subsection preserved for future re-home.
  - PatternsLayouts: simplified to an empty stub; render call commented. Sidebar + Content preserved as a commented block in Components → Others.
  - Feedback & Notifications: Notifications subsection moved above Empty State and its title cleared. Toast Notifications preview replaced with 4 permanent .notification variants (success / error / warning / info) at max-width 400, matching the button-triggered version below. Trimmed the margin between Toast Notifications and the trigger buttons via a new optional `style` prop on SubSection.
  - Section and SubSection helpers skip the title <div> when title is empty.
  - Others: new Slider subsection (live value + disabled example).

  Roadmap
  - Phase 2 PatternsLayouts item now flags the Sidebar split: extract a SidebarNav primitive + SidebarLayout composition so the rail is standalone-usable; move .sidebar-panel border-right onto the composed-layout selector.

  Tooling
  - .gitignore: added /design-system.esproj, /design-system.esproj.user, /Design System.sln, /package-lock.json, .vscode/.

Apr 17
  Typography
  - System font switched from Plus Jakarta Sans to Figtree (loaded via Google Fonts).
  - Composite text tokens (--text-display, --text-h1…h5, --text-body-lg, --text-body, --text-caption, --text-overline) removed — use size + weight
  directly.

  Color tokens
  - Removed: --brand-hover, --danger-hover, all --status-* (EMR), and the shadcn-style @theme block (--color-primary*, --color-background,
  --color-foreground, --color-secondary*, --color-muted*, --color-accent*, --color-destructive*, --color-success*, --color-info*, --color-warning*,
  --color-border, --color-input, --color-ring, --color-card*, oklch radii).
  - Semantic values retuned: success greener (#367D17), success-light lighter (#F9FEF6), info #196CD2, warning #FFCB5A, plus success-dark /
  warning-on-solid / success-border adjustments.
  - Grey scale re-tuned across all 9 stops (softer/warmer).
  - --link-hover now resolves to --brand-semidark (was --brand-hover).

  Buttons
  - .btn-group now has an animated sliding pill (::before positioned via --slider-x/--slider-w, measured in useLayoutEffect).
  - New .btn-group-square modifier (square corners via --r-sm).
  - .btn-warning text uses --warning-on-solid.
  - .btn[data-disabled] uses --text-secondary + --border-strong; no longer sets pointer-events:none.
  - .btn padding tokenized (var(--sp-3) var(--sp-5)); .btn-sm 30px, .btn-lg 48px.

  Inputs
  - .input-lg removed; .input-sm added (34px, --r-xs).
  - New .input-icon-btn-sm and .input-sm.input-with-icon-right.
  - Forms demo: "Large & Disabled" card replaced with "Small & Disabled" SearchField.

  Toggles
  - Thumb 20×20 → 16×16 (both plain and labeled variants).
  - Labeled track 62 → 56px; plain track 44 → 46px.
  - Disabled state now greys thumb (--grey-300) and track (--grey-500) instead of using opacity: 0.5.
  - .toggle-text weight 700 → 500.
  - Typography demo's "Unavailable" switch now uses labeled variant.

  Other
  - [data-focus-visible] outline → var(--brand) (ring token removed).
  - README: "all 7 brand variables" → "all 6"; --brand-hover row deleted from custom-theme template.
  - Deleted local .claude/settings.local.json.

Apr 16
  Color tokens
  - --brand-active → --brand-semidark (renamed across :root, blue, purple themes; hex unchanged).                                                            - Removed --text-tertiary (#6F7787) — use --text-secondary instead.
  - Removed --text-brand — use --brand directly.
  - --success decoupled from --brand: #0D875C → #367D17 (olive green).
  - --success-light #E6F5EE → #F9FEF6; --success-dark #065F46 → #265C10; --success-border #A7F3D0 → #DAF1C1.

  New: universal hover overlay
  - Added --hover-overlay: linear-gradient(rgba(0,0,0,0.07), rgba(0,0,0,0.07)).
  - ~20 hover rules converted from hardcoded background: var(--grey-100|200|brand-hover|danger-hover|...) to background-image: var(--hover-overlay).
  Affected selectors: .ds-nav-link, .st-row, all .btn-*[data-hovered], .btn-group .btn.active-group[data-hovered], .phone-country-btn, .calendar-nav-btn,
  .calendar-cell, .input-icon-btn, .navbar-link, .page-btn, .table tr:hover td, .modal-close, .sidebar-menu-item, .anchor-link, .drawer-close,
  .notification-close, .code-toggle.

  Spacing/radius tokenization (~50 sites)
  - 40px → var(--sp-10), 32px → var(--sp-8), 20px → var(--sp-5), 16px → var(--sp-4), 12px → var(--sp-3), 8px → var(--sp-2), 4px → var(--sp-1) across
  avatar, input, calendar-nav, navbar-link, theme-btn, copy-toast, tag-list, multiselect, tooltip, status, dropdown-item, code-toggle, etc.
  - border-radius: 8px → var(--r-md); 4px → var(--r-xs).

  Components
  - Removed .btn-xl variant (lg/default/sm remain); demos and CodeBlock strings updated.
  - .btn-warning color reverted --warning-on-solid → --text-primary (light + dark).
  - .section-label color --text-brand → --brand.
  - --text-tertiary → --text-secondary across ~30 selectors (swatches, nav, form hints, calendar headers, payment fields, drawer labels, empty states,
  dropdown header, etc.) and ~10 inline style props in App.tsx.

  Dark mode
  - Added [data-mode="dark"] .copy-toast (grey-900 bg, white text).
  - Added [data-mode="dark"] .section-label (--brand-dark).

  Repo housekeeping
  - .gitignore: added .claude/.
  - .claude/settings.local.json: added 14 permission entries (Gmail/Asana MCP, Bash patterns, Read scope).

Apr 9
  - Added a live date/time format preview line under the Typography section that detects the user's browser language
    and displays the corresponding date format (e.g., MM/DD/YYYY for en-US, DD/MM/YYYY for en-GB, YYYY/MM/DD for ja-JP, etc.).

Apr 9
  Font System
  - Consolidated --font and --font-sans into a single --font-sans variable, removing the redundant --font declaration from :root and updating all 16 references across App.css and index.c
  UI Fixes
  - Changed .payment-label color from --text-tertiary to --text-primary for better readability

- Apr 8
  - Add dropdown unit example to Input with Unit code block
  - Fix unequal card widths in form grid by adding min-width: 0 to .card

- Apr 8
  Foundations — Typography

  - Added --r-xs (4px) square to Border Radius display
  - Moved Shadows next to Spacing (right column), moved Border Radius below Spacing (full width)
  - Renamed all typography size tokens from generic (--text-xs, --text-sm, --text-base, etc.) to semantic names (--text-overline-size,
  --text-caption-size, --text-body-size, --text-h5-size, --text-h4-size, --text-h3-size, --text-h2-size, --text-h1-size, --text-display-size)
  - Added --text-body-lg-size (16px) as separate token from --text-h5-size
  - Added --text-subtitle-size (18px) for subtitles/modal headers
  - Created utility classes: .text-display, .text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-body-lg, .text-body, .text-caption,
  .text-overline — each bundles font-size, font-weight, line-height, and letter-spacing
  - Typography section now displays class names (e.g. .text-h1) and font sizes (e.g. 48px) as labels
  - Added --sp-32: 128px spacing token
  - Added "Date Format" subsection showing US format (MMM D, YYYY at h:mm A) with live current time and code example

  Foundations — Colors (Dark Mode)

  - Fixed --brand-dark for non-green themes in dark mode:
    - Blue theme: #67E8F9
    - Purple theme: #C4B5FD

  Components — Form Elements

  - Restructured form section layout: removed grid g2 form-grid wrappers
  - Row 1: Text Inputs + Select & Textarea (side by side) with dedicated CodeBlock
  - Row 2: Checkboxes & Radios + Large & Disabled (side by side) with dedicated CodeBlock

  Components — Advanced Inputs

  - Restructured into rows of 2 cards, each with its own CodeBlock:
    - Row 1: Phone Number + Date Picker
    - Row 2: Input with Action Icon + Input with Unit
    - Row 3: Payment Input + Login Form
    - Row 4: Inline Inputs (existing)

  Components — Payment Input (new)

  - Created reusable PaymentInput component with props:
    - cardPlaceholder, expiryPlaceholder, cvvPlaceholder
    - onCardChange, onExpiryChange, onCvvChange (all optional)
  - Card number row: credit card icon + "Card" label + auto-formatted input (groups of 4)
  - Card number masking: digits 5–12 show as • when blurred, visible when focused
  - Expiry row: calendar icon + "Expiry" label + auto-formatted MM / YY input
  - CVV row: lock icon + "CVV" label + type="password" input (max 3 digits)
  - Stripe-like single bordered box with --r-md radius matching other inputs

  Components — Signature Pad (new)

  - Created reusable SignaturePad component with props:
    - onSign(dataUrl, timestamp), onClear
    - placeholder, width, height, strokeWidth, strokeColor (all optional)
  - Canvas-based drawing with mouse and touch support
  - 2x canvas resolution for crisp lines
  - Quadratic curve interpolation for smooth strokes
  - States: empty (pencil icon + placeholder), drawing (Clear + Confirm buttons), signed (locked with timestamp)
  - Clear button inside the box (top-right) with X icon + "Clear" text
  - Confirm button on the right, timestamp on the left
  - Once confirmed, signature is locked — no editing or clearing
  - onSign returns PNG data URL and Date object
  - SignaturePadDemo wrapper for design system page with pre-signed example
  - Fixed footer min-height: 28px to prevent layout shift

- Apr 7
  - feat: expand form components with units, steppers, and inline patterns General Configuration
   - .claude/settings.local.json: Added Bash(echo "exit: $?") to the list of allowed commands.
   - CHANGELOG.md: Updated with a new entry for April 7th regarding the addition of a placeholder for disabled input fields.

  Design System Improvements
  Foundations & Tokens
   - index.css: Introduced a new border-radius token --r-xs: 4px.
   - App.css:
     - Renamed .radius-demo to .radius-preview for better naming consistency.
     - Increased the opacity of disabled input fields (.input[disabled]) from 0.5 to 0.7 for better readability.

  New Components & Features
   - Unit & Number Inputs: Added a new UnitInputs component that demonstrates:
     - Inputs with static units (e.g., "ml").
     - Inputs with dropdown unit selection (e.g., "kg/lb").
     - Number stepper functionality using NumberField.
   - Inline Inputs: Implemented a comprehensive "Inline Inputs" section in the forms demo, showing how inputs, selects, and date pickers can be
     used within text sentences or compact rows.
   - Add a placeholder for the disabled input field

  Code Refactoring & Cleanup
   - Component Renaming: Refactored several "Demo" components to standard names for a cleaner structure:
     - ToggleDemo → Toggle
     - ButtonGroupDemo → ButtonGroup
     - PhoneInputDemo → PhoneInput
     - InputWithIconDemo → InputWithIcon
     - LoginDemo → Login
   - UI Enhancements:
     - Added a placeholder to the disabled field in the Forms section.
  Technical Changes
   - Imports: Added NumberField, ChevronUp, and Minus to the react-aria-components and lucide-react imports in App.tsx.

- Apr 7
  - style: update toggle button off-state color and unify track styles
  - Change toggle-track off-state from --grey-400 to --grey-700 to match toggle-track-labeled (Auto-save) off-state color
  - Add dark mode override for both toggle off states using --grey-500 for better contrast on dark backgrounds

- Apr 7
  - feat: add dark mode with toggle switcher and elevated surface system
  - Add dark mode toggle (Sun/Moon switcher) in sidebar
  - Add [data-mode="dark"] CSS variables in index.css that invert
    neutral scale, text, border, and semantic color tokens
  - Override -dark tokens (success, info, warning, danger, brand) to
    light values for readable contrast on dark backgrounds
  - Increase shadow opacity (0.3–0.4) for visibility on dark surfaces
  - Add --surface-elevated token for cards, modals, popovers, drawers,
    toasts, dropdowns, and notifications
  - Pin light-mode colors for btn-warning, badge-solid-warning,
    badge-solid-neutral, chip, and tooltip in dark mode
  - Replace hardcoded `background: white` with `var(--white)` in App.css
  - Support combined brand theme + dark mode (green, blue, purple)
  - Update White-Label Theming section with dark mode docs and code examples
  - Update Design Tokens section description to mention dark mode support

- Apr 7
  - style: docs: update changelog to reflect all updates

- Apr 7
  - style: update global font family and references
  - Updated global font family definitions and associated references across the project.

- **285c971**
  - refactor: update color tokens, add click-to-copy, and fix UI components
  - Added `--link` and `--link-hover` CSS tokens in `index.css` that reference `var(--brand)` and `var(--brand-hover)` to dynamically adapt across all themes.
  - Applied global `<a>` tag styling using the new link tokens (incorporating color, hover state, transition, and text-decoration removal).
  - Updated all color swatches to display both the CSS token name and its corresponding hex value.
  - Added click-to-copy functionality to all design token rows (`st-row`).
  - Applied hover styling and pointer cursors to the token elements.
  - Added an `isDisabled` state to the "In-person" radio button.
  - Applied `[data-disabled]` CSS styling (reduced opacity, muted circle, and not-allowed cursor) to disabled radio inputs.
  - Performed a Code Block audit and applied 6 distinct fixes.

- **85d9934**
  - style: fix grey text contrast in typography section
  - Fixed grey text color contrast in the typography section to ensure readability.

- **21eeb54**
  - docs: add comprehensive README and update brand color tokens
  - Added a comprehensive `README.md` file outlining project documentation.
  - Updated brand color tokens across the styling definitions.

- **5a52d54**
  - style: adjust button dimensions and padding
  - Adjusted global button dimensions and internal padding for better proportions.

- **172d11f**
  - style: update phone extension input width
  - Updated the width of the phone extension input field to align better with standard form layouts.

- **e8c6039**
  - fix: resolve react component errors for deployment
  - Resolved React component errors and warnings to ensure successful deployment builds.

- **676f00d** - feat: implement dynamic brand theming and restyle components
  - Added two new brand color themes: Ocean Blue (`#0891B2`) and Royal Purple (`#7C3AED`).
  - Introduced theme switcher dots in the sidebar, located beneath the logo.
  - Enabled clickable theme cards in the White-Label section to switch themes dynamically.
  - Updated the Design Tokens section to include theme override code blocks.
  - Expanded the White-Label section to include explicit instructions (HTML, JS, React) for theme implementation.
  - Lightened the entire greyscale palette by two steps, excluding `--black` (`#111827`).
  - Updated brand color swatches to utilize CSS variables instead of hardcoded hex strings.
  - Applied `badge-success` colors to multiple active states across the app (anchor links, nav links, avatars, select options, dropdown items, and action feedback).
  - Standardized button heights to 38px, including icon buttons (`38px` x `38px`).
  - Updated border thickness to 2px for secondary, ghost, and danger-outline buttons.
  - Set the background of `btn-danger-outline` to white.
  - Updated disabled buttons to feature a `--grey-400` background, `--grey-800` text, and a `--grey-500` border.
  - Darkened the background and text colors of neutral badges.
  - Increased the avatar text size for default (`--text-base`) and large (`--text-xl`) variants.
  - Darkened the toggle track to `--grey-600` for unavailable toggles.
  - Added an "Always On" disabled toggle variant to the toggle demo.
  - Capped all dropdown popovers at one-third of the screen height (`33vh`) and ensured they are scrollable.
  - Created a dedicated "Dropdowns" navigation section, migrating the Dropdown Menu from "Overlays".
  - Restyled the Country dropdown to match the Specialty dropdown's design.
  - Applied `width: var(--trigger-width)` to `select-popover` elements to ensure precise width matching.
  - Removed dividers from the modal component (`border-bottom` on `.modal-head` and `border-top` on `.modal-actions`).
  - Removed the CodeBlock from the modal demo.
  - Removed dividers between items and surrounding content within the Collapse/Accordion component.
  - Applied a persistent grey background to the Collapse trigger and removed its hover state.
  - Added two data lines to the Vitals display.
  - Commented out the entire Collapse/Accordion subsection under "Others".
  - Reordered sections: moved Tooltips to "Overlays" and positioned "Overlays" above "Others" in both navigation and the main page.
  - Updated the phone extension input: reduced width to 48px, decreased label padding to 4px, and adjusted input padding (0px left, 8px right).
  - Commented out the Dividers subsection under "Spacing & Layout" (preserving the underlying code).

- **eb59268**
  - refactor: rename Data Display to Others, unify input icon pattern
  - Renamed the "Data Display" section to "Others".
  - Temporarily commented out the Patient Card, Data Table, and EMR Patterns subsections.
  - Moved Progress Bars to the "Others" section.
  - Redesigned the search, select, and date/time fields to follow a unified `.input-icon-wrap` pattern.
  - Fixed the `MultiSelect` selection behavior (resolving `selectedKey={null}`).
  - Added a max-height scrolling behavior to the dropdown menu.
  - Commented out the `PatternsEMR` function definition to prevent deployment build errors.

- **44813ff**
  - refactor: simplify badges and tags, remove EMR status variants
  - Updated badge dots to utilize darker color variants and increased their padding.
  - Removed the EMR Order Status section (7 status classes).
  - Removed the Tag Variants section (6 colored tag classes).
  - Redesigned chips to use a rounded rectangle shape with a `--brand-50` background and no border.
  - Restyled the tags container to resemble an input field.
  - Removed legacy EMR status tokens from `index.css`.

- **293e501**
  - chore: remove unused icon imports
  - Removed unused `lucide-react` imports (Phone, Lock, and Link2) to clean up the codebase.

- **f2516a9**
  - feat: add Phone Input, Date/Time Pickers, Action Icons, and Login Form
  - Added a Phone Input component with 3 variants: country code, country code + extension, and simple.
  - Implemented Date Picker, Time Picker, and combined Date+Time Picker components featuring a calendar popover.
  - Added an Input component with Action Icons (such as copy buttons and external links).
  - Introduced a comprehensive Login Form demo (including email, password with show/hide functionality, and remember me).
  - Added `@internationalized/date` as a project dependency.
  - Enabled the `CodeBlock` component to be collapsible via a "Show code" / "Hide code" toggle.
  - Moved the search icon positioning to the right side of the input.
  - Replaced the native `<select>` element in the modal with a React Aria `<Select>`.
  - Updated the error field label from "Phone" to "Full Name".

- **f9550ce**
  - refactor: rename emr-* classes, add loading buttons and labeled toggles
  - Renamed all `emr-*` CSS classes to generic names (e.g., `emr-tag` to `chip`, `emr-divider` to `divider`).
  - Redesigned the button group into a pill-shaped segmented control with a brand-colored active state.
  - Added loading button styles featuring a spinner animation.
  - Improved toggle switches: updated row layout, implemented a disabled state, and added a new labeled On/Off variant.
  - Moved toggle components from the Forms section to the Buttons section.
  - Applied `.form-grid` background styling.
  - Updated `index.css` semantic color values (`--info` to `#196CD2`, `--warning` to `#FFCB5A`).

- **1e77bfc**
  - feat: add CodeBlock component with usage snippets for all sections
  - Created a reusable `CodeBlock` helper component.
  - Added `<CodeBlock>` usage snippets to all component sections (Buttons, Forms, Badges, Feedback, Navigation, Data Display, and Overlays).
  - Changed the shadow layout to a 3-column grid structure.
  - Updated border-radius and shadow labels to display their exact token names (e.g., `--r-sm`, `--shadow-xs`).

- **a08ec4a**
  - style: add disabled input/button styles and redesign pagination
  - Added specific `.input[disabled]` CSS styling (grey background, 0.5 opacity, and not-allowed cursor).
  - Removed the wrapping `.card` div around the Form.io installation code block.
  - Updated disabled buttons to display explicit grey colors rather than relying solely on reduced opacity.
  - Redesigned pagination controls to feature borderless transparent buttons, a reduced 28x28 size, and the brand color for the active page.

- **cdf4f9e**
  - feat: add interactive sidebar layout demo and update white-label theming
  - Replaced the static sidebar demo with an interactive version featuring 6 pages (Dashboard, Patients, Appointments, Messages, Lab Results, and Settings).
  - Reduced the sidebar width from 260px to 200px.
  - Updated the White-Label theme code (renamed to "blue-variant", added OKLCH format with hex comments, and included additional variable overrides).

- **de56d02**
  - fix: expand Design Tokens reference, update radius scale, improve mobile nav
  - Split the mobile navigation into separate open/close buttons with proper positioning.
  - Removed the "Block & Icon" button subsection.
  - Expanded the Design Tokens code block significantly to include all font, color, radius, shadow, spacing, and status tokens.
  - Increased the `index.css` border-radius values by one step and introduced a `--shadow-xl` token.

- **3f4dc8f**
  - refactor: integrate EMR components into main page, add anchor bar
  - Eliminated the standalone EMR Page and integrated all components into the main page sections.
  - Added a sticky anchor navigation bar to the top of the main page.
  - Implemented a full mobile-responsive layout with 1024px, 768px, and 480px breakpoints.
  - Moved "White-Label" and "Form.io" sections from "Patterns" to "Engineering".
  - Renamed multiple sections (e.g., "Badges & Status" is now "Badges, Tags & Status").
  - Updated button state terminology from "Active" to "Pressed" and added a "With Icons" subsection.
  - Rewrote the Design Tokens code block to display full `@theme` and `:root` configurations.
  - Replaced hardcoded colors with semantic design tokens.

- **a15a55b**
  - feat: normalize font sizes to base and add 9 new components
  - Normalized all small text from `--text-xs`/`--text-sm` to `--text-base` to improve readability.
  - Added a comprehensive EMR Page featuring 9 new component demos: Dropdown Menu, Drawer, Collapse/Accordion, Tags, MultiSelect, Empty State, Dividers, Anchor Navigation, and Notifications.
  - Converted Form.io code samples to syntax-highlighted JSX.
  - Added `white-space: nowrap` styling to `.btn` classes.
  - Renamed the sidebar title from "Design System v4.0" to "Design System".

- **01e3e57**
  - chore: remove unused imports and fix SelectValue rendering
  - Removed the unused `useRef` import.
  - Removed approximately 20 unused component and icon imports (e.g., ProgressBar, Table, Dialog, NumberField, and various Lucide icons).
  - Fixed the `SelectValue` rendering pattern.

- **e042212**
  - ci: move deploy workflow to repo root and update config
  - Updated the GitHub Actions deployment workflow configuration.
  - Moved `deploy.yml` from `design-system/.github/` to the repository root `.github/` to ensure correct GitHub Actions detection.

- **92c39d5**
  - feat: improve accessibility, UI components, and add CI/CD deployment
  - Ensured all color contrast meets WCAG AA standards.
  - Implemented design tokens globally.
  - Fixed tooltip positioning and interaction.
  - Improved the Form.io section layout.

- **4feab2d**
  - Initial commit
  - Initialized standard project structure.

- **7d27459**
  - Setup attributes
  - Configured `.gitattributes` and `.gitignore` files.
