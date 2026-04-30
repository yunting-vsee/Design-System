/**
 * StandaloneKitchenSink — full-screen kitchen-sink mode.
 *
 * Activated by the URL hash `#kitchen-sink-fullscreen`. App.tsx listens to
 * `hashchange` and swaps this in for the regular docs site chrome — no
 * router added, no second Vite entry. Hash-based so the page can be
 * deep-linked, refreshed, and shared.
 *
 * Layout — adapted from va-main's DebugPanel idiom:
 *
 *   .ks-standalone (fixed inset:0, flex-row)
 *   ├── .ks-sidebar  (280px fixed, scrolls internally)
 *   │   └── header eyebrow + back link
 *   │   └── group: PATTERN (picker)
 *   │   └── group: DISPLAY (theme + brand swatches + light/dark)
 *   │   └── group: PATTERN FLAGS (per-pattern switches)
 *   │   └── group: CHAT SIMULATION (Conversations: N, + New Chat, Clear All, Records)
 *   │   └── footer: brand line + version pill
 *   └── .ks-stage     (flex:1, full height — pattern fills it)
 *
 * The sidebar replaces the previous top-toolbar treatment. The stage
 * holds the pattern at 100% of available size so the chat surface
 * expands to fill the viewport — no padding, no extra eyebrows above.
 *
 * Activation:
 *   - The embedded KitchenSink has an "Open in full screen" button that
 *     sets `window.location.hash = STANDALONE_HASH`.
 *   - A keyboard shortcut Cmd/Ctrl+Shift+K toggles full-screen from
 *     anywhere in the docs site (App.tsx wires the global listener).
 *   - "Back to docs" — small inline link at the top of the sidebar —
 *     clears the hash.
 *
 * The standalone mode SHARES `useKitchenSinkHostState` with the embedded
 * KitchenSink so flag values, selection, record state, and simulation
 * actions behave identically — the only difference is the chrome around
 * them.
 *
 * Accessibility:
 *   - Sidebar is `<aside aria-label="Kitchen sink controls">`.
 *   - Each group is `role="group"` with `aria-labelledby` pointing at
 *     its eyebrow heading.
 *   - Brand picker buttons carry `aria-pressed` for toggle semantics +
 *     `aria-label` so the colour name is announced.
 *   - Light/dark switch is a labelled <button> with `aria-pressed`.
 *   - "Back to docs" is a labelled link-styled <button>.
 *   - Layout respects `prefers-reduced-motion` (no entrance transitions).
 *   - Visible focus rings inherit from the sidebar primitives.
 */
import { useEffect } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import {
  Select,
  SelectValue,
  Button as RACButton,
  Popover,
  ListBox,
  ListBoxItem,
  RadioGroup,
  Radio,
  Switch,
  Label,
} from "react-aria-components";
import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarGroup,
  SidebarPill,
  SidebarPillRow,
} from "./sidebar/Sidebar";
import { PATTERNS, STANDALONE_HASH } from "./registry";
import { useKitchenSinkHostState } from "./useKitchenSinkHost";
import {
  RECORD_STATES,
  RECORD_STATE_LABELS,
  type RecordState,
} from "./types";

export interface StandaloneKitchenSinkProps {
  brandTheme: string;
  setBrandTheme: (next: string) => void;
  darkMode: boolean;
  setDarkMode: (next: boolean) => void;
  /** Called when the user clicks "Back to docs". */
  onExit: () => void;
}

const BRAND_OPTIONS = [
  { id: "", label: "Green", swatch: "var(--vsee-brand)", title: "Green (default)" },
  { id: "blue", label: "Blue", swatch: "#0891B2", title: "Ocean Blue" },
  { id: "purple", label: "Purple", swatch: "#7C3AED", title: "Royal Purple" },
];

export function StandaloneKitchenSink({
  brandTheme,
  setBrandTheme,
  darkMode,
  setDarkMode,
  onExit,
}: StandaloneKitchenSinkProps) {
  const host = useKitchenSinkHostState();
  const { pattern, mocks, flags } = host;
  const PatternComponent = pattern.Component;

  // Lock body scroll while the standalone mode is mounted — the mode
  // owns the viewport, the docs-site scroll position behind it should be
  // preserved for when the user clicks "Back to docs".
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="ks-standalone" role="region" aria-label="Kitchen sink — full screen">
      <Sidebar ariaLabel="Kitchen sink controls">
        {/* ─── Header: back link + eyebrow ─── */}
        <div className="ks-standalone-sidebar-head">
          <button
            type="button"
            className="ks-standalone-back"
            onClick={onExit}
            aria-label="Back to docs"
          >
            <ArrowLeft size={12} aria-hidden="true" />
            <span>Back to docs</span>
          </button>
          <div className="ks-standalone-title">Kitchen Sink</div>
          <div className="ks-standalone-subtitle">Full-screen preview</div>
        </div>

        {/* ─── Pattern picker ─── */}
        <SidebarGroup id="ks-pattern" eyebrow="Pattern">
          <Select
            aria-label="Pattern"
            selectedKey={pattern.id}
            onSelectionChange={(key) => {
              if (typeof key === "string") host.setSelectedPatternId(key);
            }}
          >
            <Label className="sr-only">Pattern</Label>
            <RACButton className="ks-standalone-select-trigger">
              <SelectValue />
              <ChevronDown size={14} aria-hidden="true" />
            </RACButton>
            <Popover className="ks-standalone-popover">
              <ListBox className="ks-standalone-listbox">
                {PATTERNS.map((p) => (
                  <ListBoxItem
                    key={p.id}
                    id={p.id}
                    textValue={p.label}
                    className="ks-standalone-option"
                  >
                    {p.label}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
          <p className="ks-standalone-pattern-desc">{pattern.description}</p>
        </SidebarGroup>

        {/* ─── Display: brand swatches + light/dark ─── */}
        <SidebarGroup id="ks-display" eyebrow="Display">
          <div className="ks-standalone-row" role="group" aria-label="Brand theme">
            <span className="ks-standalone-row-label">Brand</span>
            <div className="ks-standalone-swatch-row">
              {BRAND_OPTIONS.map(({ id, label, swatch, title }) => {
                const active = brandTheme === id;
                return (
                  <button
                    key={id || "default"}
                    type="button"
                    className={`ks-standalone-swatch${active ? " is-active" : ""}`}
                    onClick={() => setBrandTheme(id)}
                    aria-label={`Brand: ${label}`}
                    aria-pressed={active}
                    title={title}
                    style={{ background: swatch }}
                  />
                );
              })}
            </div>
          </div>

          <div className="ks-standalone-row" role="group" aria-label="Color mode">
            <span className="ks-standalone-row-label">Mode</span>
            <SidebarPillRow ariaLabel="Color mode">
              <SidebarPill
                label="Light"
                icon={<Sun size={12} aria-hidden="true" />}
                pressed={!darkMode}
                tone="primary"
                onClick={() => setDarkMode(false)}
                fullWidth
              />
              <SidebarPill
                label="Dark"
                icon={<Moon size={12} aria-hidden="true" />}
                pressed={darkMode}
                tone="primary"
                onClick={() => setDarkMode(true)}
                fullWidth
              />
            </SidebarPillRow>
          </div>
        </SidebarGroup>

        {/* ─── Pattern flags ─── */}
        {pattern.flags && pattern.flags.length > 0 && (
          <SidebarGroup id="ks-flags" eyebrow="Pattern flags">
            <div className="ks-standalone-flag-list" role="group" aria-label="Pattern flags">
              {pattern.flags.map((f) => {
                const checked = flags?.[f.id] ?? f.default;
                return (
                  <Switch
                    key={f.id}
                    isSelected={checked}
                    onChange={(v) => host.setFlag(f.id, v)}
                    className="ks-standalone-flag-switch"
                  >
                    <span className="ks-standalone-flag-track" aria-hidden="true">
                      <span className="ks-standalone-flag-thumb" />
                    </span>
                    <span className="ks-standalone-flag-label" title={f.description}>
                      {f.label}
                    </span>
                  </Switch>
                );
              })}
            </div>
          </SidebarGroup>
        )}

        {/* ─── Simulation: counters + actions + records ─── */}
        {(pattern.simulationActions?.length ||
          pattern.simulationCounters?.length) && (
          <SidebarGroup
            id="ks-simulation"
            eyebrow={pattern.simulationLabel ?? `${pattern.label} simulation`}
          >
            {pattern.simulationCounters?.map((c) => {
              const value = host.readCounter(c.id);
              return (
                <div
                  key={c.id}
                  className="ks-standalone-counter"
                  data-counter-id={c.id}
                >
                  <span className="ks-standalone-counter-label">{c.label}</span>
                  <span
                    className="ks-standalone-counter-value"
                    data-testid={`counter-${c.id}`}
                  >
                    {value ?? 0}
                  </span>
                </div>
              );
            })}

            {pattern.simulationActions && pattern.simulationActions.length > 0 && (
              <SidebarPillRow ariaLabel="Simulation actions">
                {pattern.simulationActions.map((a) => (
                  <SidebarPill
                    key={a.id}
                    label={a.label}
                    onClick={() => host.runAction(a.id)}
                    variant={a.variant}
                    fullWidth
                  />
                ))}
              </SidebarPillRow>
            )}

            <div className="ks-standalone-row" role="group" aria-label="Records state">
              <span className="ks-standalone-row-label">Records</span>
              <RadioGroup
                aria-label="Records state"
                value={host.recordState}
                onChange={(v) => host.setRecordState(v as RecordState)}
                className="ks-standalone-records"
              >
                {RECORD_STATES.map((state) => (
                  <Radio
                    key={state}
                    value={state}
                    className="ks-standalone-record-pill"
                  >
                    {RECORD_STATE_LABELS[state]}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </SidebarGroup>
        )}

        {/* ─── Footer ─── */}
        <div className="ks-standalone-foot">
          <span className="ks-standalone-foot-eyebrow">VSee Design System</span>
          <span className="ks-standalone-foot-pill">Standalone</span>
        </div>
      </Sidebar>

      <main className="ks-stage" aria-label={`${pattern.label} pattern preview`}>
        {/* Same key strategy as the embedded host so record-state flips
            give each pattern fresh local state. Simulation actions
            mutate mocks without remounting (they don't change the key). */}
        <PatternComponent
          key={`${pattern.id}:${host.recordState}`}
          mocks={mocks}
          flags={flags}
        />
      </main>

      <StandaloneKitchenSinkStyles />
    </div>
  );
}

/* The hash constant is re-exported so consumers can inline-link it without
   pulling the whole KitchenSink module. */
export { STANDALONE_HASH };

function StandaloneKitchenSinkStyles() {
  return <style>{STANDALONE_CSS}</style>;
}

const STANDALONE_CSS = `
.ks-standalone {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: row;
  background: var(--vsee-grey-200);
  color: var(--vsee-text-primary);
  font-family: var(--vsee-font-sans);
}

/* Sidebar header — back link + title block */
.ks-standalone-sidebar-head {
  padding: var(--vsee-sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--vsee-sp-1);
  border-bottom: 1px solid var(--vsee-border);
}
.ks-standalone-back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-1);
  padding: 0;
  background: transparent;
  border: none;
  color: var(--vsee-text-secondary);
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-caption-size);
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: color var(--vsee-t-fast);
}
.ks-standalone-back:hover { color: var(--vsee-brand); text-decoration: underline; }
.ks-standalone-back:focus-visible {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
  border-radius: var(--vsee-r-sm);
}
.ks-standalone-title {
  font-family: var(--vsee-mono);
  font-size: var(--vsee-text-overline-size);
  font-weight: 700;
  color: var(--vsee-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--vsee-sp-2);
}
.ks-standalone-subtitle {
  font-size: var(--vsee-text-caption-size);
  color: var(--vsee-text-secondary);
  line-height: 1.3;
}

/* Pattern picker */
.ks-standalone-pattern-desc {
  font-size: var(--vsee-text-overline-size);
  color: var(--vsee-text-secondary);
  margin: 0;
  line-height: 1.5;
}
.ks-standalone-select-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vsee-sp-2);
  width: 100%;
  height: 32px;
  padding: 0 var(--vsee-sp-3);
  background: var(--vsee-white);
  color: var(--vsee-text-primary);
  border: 1px solid var(--vsee-border-strong);
  border-radius: var(--vsee-r-md);
  cursor: pointer;
  outline: none;
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-caption-size);
  font-weight: 600;
  transition: border-color var(--vsee-t-fast), box-shadow var(--vsee-t-fast);
}
.ks-standalone-select-trigger[data-hovered] { border-color: var(--vsee-grey-500); }
.ks-standalone-select-trigger[data-focus-visible] {
  border-color: var(--vsee-brand);
  box-shadow: var(--vsee-shadow-focus);
}
.ks-standalone-popover {
  background: var(--vsee-white);
  border: 1px solid var(--vsee-border);
  border-radius: var(--vsee-r-lg);
  box-shadow: var(--vsee-shadow-lg);
  padding: var(--vsee-sp-1);
  min-width: var(--trigger-width);
  z-index: 200;
  outline: none;
}
.ks-standalone-listbox { outline: none; padding: 0; }
.ks-standalone-option {
  font-size: var(--vsee-text-caption-size);
  padding: var(--vsee-sp-2) var(--vsee-sp-3);
  border-radius: var(--vsee-r-md);
  cursor: pointer;
  outline: none;
  color: var(--vsee-text-primary);
}
.ks-standalone-option[data-focused] { background: var(--vsee-brand-light); }
.ks-standalone-option[data-selected] { background: var(--vsee-brand); color: #FFFFFF; }

/* Generic row with leading label + trailing controls */
.ks-standalone-row {
  display: flex;
  flex-direction: column;
  gap: var(--vsee-sp-2);
}
.ks-standalone-row-label {
  font-size: var(--vsee-text-overline-size);
  font-weight: 600;
  color: var(--vsee-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* Brand swatches */
.ks-standalone-swatch-row {
  display: inline-flex;
  gap: var(--vsee-sp-2);
}
.ks-standalone-swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--vsee-r-full);
  border: 2px solid var(--vsee-border-strong);
  cursor: pointer;
  outline: none;
  padding: 0;
  transition: transform var(--vsee-t-fast), border-color var(--vsee-t-fast),
    box-shadow var(--vsee-t-fast);
}
.ks-standalone-swatch:hover {
  transform: scale(1.06);
  border-color: var(--vsee-text-primary);
}
.ks-standalone-swatch.is-active {
  border-color: var(--vsee-text-primary);
  box-shadow: 0 0 0 2px var(--vsee-grey-100), 0 0 0 4px var(--vsee-brand);
}
.ks-standalone-swatch:focus-visible {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 3px;
}

/* Flag switches — vertical list */
.ks-standalone-flag-list {
  display: flex;
  flex-direction: column;
  gap: var(--vsee-sp-2);
}
.ks-standalone-flag-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-3);
  cursor: pointer;
  outline: none;
  user-select: none;
  min-height: 24px;
}
.ks-standalone-flag-track {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 16px;
  background: var(--vsee-grey-500);
  border-radius: var(--vsee-r-full);
  transition: background var(--vsee-t-fast);
  flex-shrink: 0;
}
.ks-standalone-flag-thumb {
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  width: 12px;
  height: 12px;
  background: var(--vsee-white);
  border-radius: var(--vsee-r-full);
  box-shadow: var(--vsee-shadow-sm);
  transition: inset-inline-start var(--vsee-t-fast);
}
.ks-standalone-flag-switch[data-selected] .ks-standalone-flag-track {
  background: var(--vsee-brand);
}
.ks-standalone-flag-switch[data-selected] .ks-standalone-flag-thumb {
  inset-inline-start: 16px;
}
.ks-standalone-flag-switch[data-focus-visible] .ks-standalone-flag-track {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
}
.ks-standalone-flag-label {
  font-size: var(--vsee-text-caption-size);
  font-weight: 500;
  color: var(--vsee-text-primary);
}

/* Counter — Conversations: 15 */
.ks-standalone-counter {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--vsee-sp-2);
  padding: var(--vsee-sp-2) var(--vsee-sp-3);
  background: var(--vsee-white);
  border: 1px solid var(--vsee-border);
  border-radius: var(--vsee-r-md);
}
.ks-standalone-counter-label {
  font-size: var(--vsee-text-caption-size);
  color: var(--vsee-text-secondary);
}
.ks-standalone-counter-value {
  font-family: var(--vsee-mono);
  font-size: var(--vsee-text-body-size);
  font-weight: 700;
  color: var(--vsee-brand);
}

/* Records radio — vertical pill stack to fit the narrow sidebar */
.ks-standalone-records {
  display: flex;
  background: var(--vsee-grey-200);
  border: 1px solid var(--vsee-border-strong);
  border-radius: var(--vsee-r-full);
  padding: 2px;
}
.ks-standalone-record-pill {
  flex: 1 1 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 var(--vsee-sp-2);
  font-size: var(--vsee-text-overline-size);
  font-weight: 600;
  color: var(--vsee-text-secondary);
  border-radius: var(--vsee-r-full);
  cursor: pointer;
  outline: none;
  user-select: none;
  white-space: nowrap;
  transition: background var(--vsee-t-fast), color var(--vsee-t-fast);
}
.ks-standalone-record-pill[data-hovered] { color: var(--vsee-text-primary); }
.ks-standalone-record-pill[data-selected] {
  background: var(--vsee-brand);
  color: #FFFFFF;
}
.ks-standalone-record-pill[data-focus-visible] {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
}

/* Footer */
.ks-standalone-foot {
  margin-top: auto;
  padding: var(--vsee-sp-4);
  border-top: 1px solid var(--vsee-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vsee-sp-2);
  flex-shrink: 0;
}
.ks-standalone-foot-eyebrow {
  font-family: var(--vsee-mono);
  font-size: var(--vsee-text-overline-size);
  font-weight: 600;
  color: var(--vsee-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.ks-standalone-foot-pill {
  font-family: var(--vsee-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--vsee-brand-dark);
  background: var(--vsee-brand-light);
  border: 1px solid var(--vsee-brand);
  border-radius: var(--vsee-r-full);
  padding: 1px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Stage — pattern fills it 100% */
.ks-stage {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--vsee-grey-200);
  overflow: hidden;
}
.ks-stage > .chat-pattern {
  flex: 1;
  width: 100%;
  height: 100%;
  /* Override the embedded clamp so the pattern fills the stage. The
     scoped selector keeps embedded mode unaffected. */
  min-height: 0;
  border-radius: 0;
  border: none;
}

/* sr-only fallback for the visually-hidden Pattern label */
.ks-standalone .sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}

@media (max-width: 720px) {
  .ks-standalone { flex-direction: column; }
  .ks-sidebar { width: 100%; max-height: 50vh; border-right: none;
    border-bottom: 1px solid var(--vsee-border); }
  .ks-stage { height: 50vh; }
}

@media (prefers-reduced-motion: reduce) {
  .ks-standalone-swatch,
  .ks-standalone-flag-track,
  .ks-standalone-flag-thumb,
  .ks-standalone-record-pill { transition: none; }
}
`;
