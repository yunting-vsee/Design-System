/**
 * Sidebar — left-rail debug surface used by the standalone kitchen sink.
 *
 * Adapted from va-main's `DebugPanel` idiom: monospace + uppercase
 * eyebrow labels, grouped sections separated by a thin top-border, pill
 * buttons. Adopts brand colour rather than va-main's amber accent because
 * this surface is a docs feature, not a debug overlay.
 *
 * Reusable: this module ships <Sidebar>, <SidebarGroup>, <SidebarEyebrow>,
 * <SidebarPill>, and <SidebarPillRow>. Any future host that wants the
 * same chrome (e.g. a clinic-pattern simulation panel) can drop them in
 * without depending on the StandaloneKitchenSink wiring.
 *
 * Accessibility:
 *   - <Sidebar> renders as `<aside>` with an explicit aria-label.
 *   - <SidebarGroup> exposes the eyebrow text as the group's heading
 *     via `role="group"` + `aria-labelledby`.
 *   - <SidebarPill> is a labelled <button>; pressed state is conveyed
 *     via `aria-pressed`. Destructive variant carries danger colour
 *     against a transparent background to keep ≥4.5:1 contrast in light
 *     and dark modes.
 *   - All interactive elements expose visible focus (2px brand outline).
 */
import type { ReactNode } from "react";

export interface SidebarProps {
  ariaLabel: string;
  children: ReactNode;
}

export function Sidebar({ ariaLabel, children }: SidebarProps) {
  return (
    <aside className="ks-sidebar" aria-label={ariaLabel}>
      {children}
      <SidebarStyles />
    </aside>
  );
}

export interface SidebarGroupProps {
  /** Stable id so `aria-labelledby` can wire the eyebrow as a heading. */
  id: string;
  /** Eyebrow text — UPPERCASE rendering is applied via CSS. */
  eyebrow: string;
  children: ReactNode;
}

export function SidebarGroup({ id, eyebrow, children }: SidebarGroupProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      className="ks-sidebar-group"
      role="group"
      aria-labelledby={headingId}
    >
      <SidebarEyebrow id={headingId}>{eyebrow}</SidebarEyebrow>
      <div className="ks-sidebar-group-body">{children}</div>
    </section>
  );
}

export interface SidebarEyebrowProps {
  id?: string;
  children: ReactNode;
}

export function SidebarEyebrow({ id, children }: SidebarEyebrowProps) {
  return (
    <div id={id} className="ks-sidebar-eyebrow">
      {children}
    </div>
  );
}

/**
 * Pill-shaped button used across the sidebar — theme buttons, simulation
 * actions, "+ New Chat", "Clear All". Accepts `pressed` for toggle state
 * (theme buttons), `variant` for destructive (Clear All), and `tone` for
 * the brand-fill primary (active theme).
 */
export interface SidebarPillProps {
  label: string;
  onClick: () => void;
  /** Toggle state for theme/mode buttons. Sets aria-pressed. */
  pressed?: boolean;
  /** `default` → grey-200 background, `destructive` → danger outline. */
  variant?: "default" | "destructive";
  /** When pressed, fill the pill with brand colour. */
  tone?: "neutral" | "primary";
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Optional title (tooltip / hover). */
  title?: string;
  /** When true, the pill expands to fill its row. */
  fullWidth?: boolean;
  /** Optional explicit aria-label — overrides label-as-name. */
  ariaLabel?: string;
}

export function SidebarPill({
  label,
  onClick,
  pressed,
  variant = "default",
  tone = "neutral",
  icon,
  title,
  fullWidth,
  ariaLabel,
}: SidebarPillProps) {
  const variantClass =
    variant === "destructive"
      ? " ks-sidebar-pill-danger"
      : tone === "primary" && pressed
        ? " ks-sidebar-pill-primary"
        : "";
  const widthClass = fullWidth ? " ks-sidebar-pill-full" : "";
  return (
    <button
      type="button"
      className={`ks-sidebar-pill${variantClass}${widthClass}`}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      aria-pressed={pressed}
      title={title}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/** A row of pills — used for paired actions (+ New Chat | Clear All). */
export interface SidebarPillRowProps {
  children: ReactNode;
  /** "Pattern controls" / "Theme buttons" — labels the row group. */
  ariaLabel?: string;
}

export function SidebarPillRow({ children, ariaLabel }: SidebarPillRowProps) {
  return (
    <div className="ks-sidebar-pill-row" role="group" aria-label={ariaLabel}>
      {children}
    </div>
  );
}

/* ─── Pattern-scoped CSS ─── */

function SidebarStyles() {
  return <style>{SIDEBAR_CSS}</style>;
}

const SIDEBAR_CSS = `
.ks-sidebar {
  width: 280px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--vsee-grey-100);
  border-right: 1px solid var(--vsee-border);
  font-family: var(--vsee-font-sans);
  color: var(--vsee-text-primary);
  overflow-y: auto;
  overflow-x: hidden;
}

.ks-sidebar-group {
  padding: var(--vsee-sp-4);
  border-top: 1px solid var(--vsee-border);
}
.ks-sidebar-group:first-child { border-top: none; }
.ks-sidebar-group-body {
  display: flex;
  flex-direction: column;
  gap: var(--vsee-sp-3);
  margin-top: var(--vsee-sp-3);
}

/* Eyebrow — monospace, uppercase, secondary text. Mirrors va-main DebugPanel. */
.ks-sidebar-eyebrow {
  font-family: var(--vsee-mono);
  font-size: var(--vsee-text-overline-size);
  font-weight: 700;
  color: var(--vsee-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* Pill buttons — used everywhere in the sidebar. Pill shape, 28px height
   meets WCAG 2.5.8 with comfortable hit area. */
.ks-sidebar-pill-row {
  display: flex;
  gap: var(--vsee-sp-2);
  align-items: center;
  flex-wrap: wrap;
}
.ks-sidebar-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vsee-sp-2);
  height: 30px;
  padding: 0 var(--vsee-sp-3);
  background: var(--vsee-white);
  color: var(--vsee-text-primary);
  border: 1px solid var(--vsee-border-strong);
  border-radius: var(--vsee-r-full);
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-caption-size);
  font-weight: 600;
  cursor: pointer;
  outline: none;
  user-select: none;
  white-space: nowrap;
  transition: background var(--vsee-t-fast), border-color var(--vsee-t-fast),
    color var(--vsee-t-fast);
}
.ks-sidebar-pill:hover {
  background: var(--vsee-grey-200);
  border-color: var(--vsee-grey-500);
}
.ks-sidebar-pill[aria-pressed="true"] {
  background: var(--vsee-brand-light);
  color: var(--vsee-brand-dark);
  border-color: var(--vsee-brand);
}
.ks-sidebar-pill:focus-visible {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
}
.ks-sidebar-pill-full { flex: 1 1 auto; min-width: 0; }

/* Primary pill — used for the active theme button */
.ks-sidebar-pill-primary,
.ks-sidebar-pill-primary[aria-pressed="true"] {
  background: var(--vsee-brand);
  color: #FFFFFF;
  border-color: var(--vsee-brand);
}
.ks-sidebar-pill-primary:hover {
  background: var(--vsee-brand-semidark);
  border-color: var(--vsee-brand-semidark);
}

/* Destructive pill — danger-coloured text + border on transparent
   background to keep ≥4.5:1 contrast in light + dark + brand themes. */
.ks-sidebar-pill-danger {
  color: var(--vsee-danger);
  border-color: var(--vsee-danger);
  background: transparent;
}
.ks-sidebar-pill-danger:hover {
  background: var(--vsee-danger-light);
  color: var(--vsee-danger);
  border-color: var(--vsee-danger);
}
.ks-sidebar-pill-danger:focus-visible {
  outline-color: var(--vsee-danger);
}

@media (prefers-reduced-motion: reduce) {
  .ks-sidebar-pill { transition: none; }
}
`;
