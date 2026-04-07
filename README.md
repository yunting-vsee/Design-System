# Getting Started with VSee Design System

## Overview

The VSee Design System is built with **React Aria** (Adobe's accessibility-first component library) and styled with **CSS custom properties**. It provides a complete set of UI components, design tokens, and brand theming for VSee Clinic applications.

## Tech Stack

- **React 18+** with TypeScript
- **React Aria Components** for accessible, unstyled primitives
- **Tailwind CSS v4** for utility classes
- **CSS Custom Properties** for design tokens
- **Lucide React** for icons
- **Vite** for build tooling

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd design-system

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Project Structure

```
design-system/
  src/
    index.css      # Design tokens, CSS variables, Tailwind theme
    App.css        # Component styles
    App.tsx        # All component demos and documentation
  public/
    fonts/         # Legend font files
    favicon.svg
    icons.svg
```

## Using Design Tokens

Copy the `:root` block from `src/index.css` into your project's global CSS to get all design tokens:

### Brand Colors

```css
:root {
  --brand: #0D875C;
  --brand-hover: #0B7550;
  --brand-active: #096843;
  --brand-dark: #0A6B49;
  --brand-darker: #074D35;
  --brand-light: #E6F5EE;
  --brand-50: #F0FAF5;
}
```

### Semantic Colors

```css
:root {
  --success: #0D875C;   --success-light: #E6F5EE;
  --info: #196CD2;      --info-light: #E0F2FE;
  --warning: #FFCB5A;   --warning-light: #FEF3C7;
  --danger: #DC2626;    --danger-light: #FEE2E2;
}
```

### Typography

```css
:root {
  --font: 'Legend', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --text-xs: 12px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 18px;
  --text-2xl: 20px;
  --text-3xl: 24px;
  --text-4xl: 30px;
}
```

### Spacing (4px base)

```css
:root {
  --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 20px;  --sp-6: 24px;  --sp-8: 32px;  --sp-10: 40px;
  --sp-12: 48px; --sp-16: 64px; --sp-20: 80px; --sp-24: 96px;
}
```

### Radius

```css
:root {
  --r-sm: 6px;  --r-md: 8px;   --r-lg: 12px;  --r-xl: 16px;
  --r-2xl: 24px; --r-full: 9999px;
}
```

## Brand Theming (White-Label)

The design system supports multiple brand themes via the `data-theme` attribute on the root HTML element. Three themes are available out of the box:

### Default (Green)

No attribute needed. This is the default VSee brand.

### Ocean Blue

```html
<html data-theme="blue">
```

```css
[data-theme="blue"] {
  --brand: #0891B2;
  --brand-hover: #0E7490;
  --brand-active: #155E75;
  --brand-dark: #0E7490;
  --brand-darker: #164E63;
  --brand-light: #E0F7FA;
  --brand-50: #ECFEFF;
}
```

### Royal Purple

```html
<html data-theme="purple">
```

```css
[data-theme="purple"] {
  --brand: #7C3AED;
  --brand-hover: #6D31D6;
  --brand-active: #5E28BF;
  --brand-dark: #6332C4;
  --brand-darker: #47248C;
  --brand-light: #EDE9FE;
  --brand-50: #F5F3FF;
}
```

### Switching Themes in JavaScript

```js
// Set theme
document.documentElement.setAttribute("data-theme", "blue");

// Reset to default
document.documentElement.removeAttribute("data-theme");
```

### Creating a Custom Theme

To add your own brand color, define a new `[data-theme]` block with all 7 brand variables:

```css
[data-theme="your-theme"] {
  --brand: #______;        /* Main brand color */
  --brand-hover: #______;  /* Slightly darker for hover */
  --brand-active: #______; /* Darker for pressed/active */
  --brand-dark: #______;   /* Dark variant (gradients) */
  --brand-darker: #______; /* Darkest variant (gradients) */
  --brand-light: #______;  /* Light tint background */
  --brand-50: #______;     /* Very light tint background */
}
```

## Component Usage

All components use React Aria primitives with CSS class-based styling. Below are examples for the most common components.

### Buttons

```tsx
import { Button } from "react-aria-components";

<Button className="btn btn-primary">Primary</Button>
<Button className="btn btn-secondary">Secondary</Button>
<Button className="btn btn-ghost">Ghost</Button>
<Button className="btn btn-danger">Danger</Button>
<Button className="btn btn-link">Link</Button>
```

**Sizes:** Add `btn-sm` or `btn-lg` for small/large variants.

**With icon:**

```tsx
<Button className="btn btn-primary">
  <Plus size={16} /> Add Item
</Button>
```

### Form Elements

```tsx
import { TextField, Input, Label, TextArea, Select, SelectValue, Popover, ListBox, ListBoxItem } from "react-aria-components";

{/* Text input */}
<TextField>
  <Label className="label">Email</Label>
  <Input className="input" placeholder="you@example.com" />
</TextField>

{/* Textarea */}
<TextField>
  <Label className="label">Notes</Label>
  <TextArea className="input" rows={3} />
</TextField>

{/* Select */}
<Select className="select-trigger">
  <Label className="label">Country</Label>
  <SelectValue />
  <Popover className="select-popover">
    <ListBox>
      <ListBoxItem className="select-option">United States</ListBoxItem>
      <ListBoxItem className="select-option">Canada</ListBoxItem>
    </ListBox>
  </Popover>
</Select>
```

### Checkbox & Switch

```tsx
import { Checkbox, Switch } from "react-aria-components";

<Checkbox className="checkbox">
  <div className="checkbox-box">
    <Check size={12} />
  </div>
  Accept terms
</Checkbox>

<Switch className="switch">
  <div className="switch-track">
    <div className="switch-thumb" />
  </div>
  Enable notifications
</Switch>
```

### Badges & Tags

```tsx
{/* Badge */}
<span className="badge badge-success">
  <span className="badge-dot" /> Active
</span>
<span className="badge badge-info">
  <span className="badge-dot" /> Info
</span>
<span className="badge badge-warning">
  <span className="badge-dot" /> Pending
</span>
<span className="badge badge-danger">
  <span className="badge-dot" /> Error
</span>

{/* Tags (React Aria) */}
<TagGroup>
  <TagList className="tag-list">
    <Tag className="tag">React</Tag>
    <Tag className="tag">TypeScript</Tag>
  </TagList>
</TagGroup>
```

### Alerts / Notifications

```tsx
<div className="alert alert-success">
  <CheckCircle size={16} />
  <div>
    <div className="alert-title">Success</div>
    <div className="alert-desc">Your changes have been saved.</div>
  </div>
</div>

<div className="alert alert-danger">
  <XCircle size={16} />
  <div>
    <div className="alert-title">Error</div>
    <div className="alert-desc">Something went wrong.</div>
  </div>
</div>
```

### Navigation — Tabs

```tsx
import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";

<Tabs>
  <TabList className="tab-list">
    <Tab className="tab" id="tab1">General</Tab>
    <Tab className="tab" id="tab2">Settings</Tab>
  </TabList>
  <TabPanel id="tab1">General content</TabPanel>
  <TabPanel id="tab2">Settings content</TabPanel>
</Tabs>
```

### Navigation — Breadcrumbs

```tsx
import { Breadcrumbs, Breadcrumb, Link } from "react-aria-components";

<Breadcrumbs className="breadcrumb">
  <Breadcrumb><Link>Home</Link></Breadcrumb>
  <Breadcrumb><Link>Patients</Link></Breadcrumb>
  <Breadcrumb>John Doe</Breadcrumb>
</Breadcrumbs>
```

### Tooltip

```tsx
import { TooltipTrigger, Tooltip, Button } from "react-aria-components";

<TooltipTrigger>
  <Button className="btn btn-ghost">Hover me</Button>
  <Tooltip className="tooltip">Helpful information</Tooltip>
</TooltipTrigger>
```

## Accessibility

All interactive components are built on React Aria, which provides:

- Full **keyboard navigation** (Tab, Arrow keys, Enter, Escape)
- **ARIA attributes** automatically applied
- **Focus management** for modals, menus, and overlays
- **Screen reader** announcements for state changes

Color contrast meets **WCAG AA** (4.5:1 for text, 3:1 for UI elements) across all themes.

## Browser Support

- Chrome / Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
