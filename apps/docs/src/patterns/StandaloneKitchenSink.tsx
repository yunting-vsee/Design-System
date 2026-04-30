/**
 * StandaloneKitchenSink — full-screen kitchen-sink mode.
 *
 * Activated by the URL hash `#kitchen-sink-fullscreen`. App.tsx listens to
 * `hashchange` and swaps this in for the regular docs site chrome — no
 * router added, no second Vite entry. Hash-based so the page can be
 * deep-linked, refreshed, and shared.
 *
 * Visual idiom — adapted from va-main's DebugPanel:
 *   - Sticky-top toolbar with overline-styled section headers + monospace
 *     labels in the brand-picker / mode rows. Reads as a "debug surface"
 *     without adopting va-main's amber colour (this is a docs feature,
 *     not a debug feature, so it stays on-brand).
 *   - The pattern itself fills 100vh below the toolbar (`flex: 1; min-height:
 *     0`), so the chat surface's two-pane layout expands to use all
 *     available space rather than the embedded mode's fixed-size frame.
 *
 * Activation:
 *   - The embedded KitchenSink has an "Open in full screen" button that
 *     sets `window.location.hash = STANDALONE_HASH`.
 *   - A keyboard shortcut Cmd/Ctrl+Shift+K toggles full-screen from
 *     anywhere in the docs site (App.tsx wires the global listener).
 *   - "Back to docs" in the toolbar clears the hash.
 *
 * The standalone mode SHARES `useKitchenSinkHostState` with the embedded
 * KitchenSink so flag values, selection, and record state behave
 * identically — the only difference is the chrome around them.
 *
 * Accessibility:
 *   - The toolbar is `role="toolbar"` with `aria-label="Pattern controls"`
 *     (inherited from DebugControls).
 *   - Brand picker buttons carry `aria-pressed` for state semantics.
 *   - Light/dark switch is a labelled <button> with `aria-pressed`.
 *   - "Back to docs" is a labelled <button>.
 *   - Layout respects `prefers-reduced-motion` (no entrance transitions).
 *   - Visible focus rings inherit from the docs-site root [data-focus-visible].
 */
import { useEffect } from "react";
import { ArrowLeft, Maximize2, Moon, Sun } from "lucide-react";
import { DebugControls } from "./DebugControls";
import { PATTERNS, STANDALONE_HASH } from "./registry";
import { useKitchenSinkHostState } from "./useKitchenSinkHost";

export interface StandaloneKitchenSinkProps {
  brandTheme: string;
  setBrandTheme: (next: string) => void;
  darkMode: boolean;
  setDarkMode: (next: boolean) => void;
  /** Called when the user clicks "Back to docs". */
  onExit: () => void;
}

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
      <header className="ks-standalone-toolbar" role="banner">
        <div className="ks-standalone-toolbar-row">
          <div className="ks-standalone-brand">
            <Maximize2 size={14} aria-hidden="true" className="ks-standalone-brand-icon" />
            <span className="ks-standalone-brand-eyebrow">Kitchen Sink</span>
            <span className="ks-standalone-brand-pill">Standalone</span>
          </div>

          <div className="ks-standalone-theme-group" role="group" aria-label="Brand theme">
            <span className="ks-standalone-overline" aria-hidden="true">Brand</span>
            {[
              { id: "", label: "Green", swatch: "var(--vsee-brand)", title: "Green (default)" },
              { id: "blue", label: "Blue", swatch: "#0891B2", title: "Ocean Blue" },
              { id: "purple", label: "Purple", swatch: "#7C3AED", title: "Royal Purple" },
            ].map(({ id, label, swatch, title }) => {
              const active = brandTheme === id;
              return (
                <button
                  key={id || "default"}
                  type="button"
                  className={`ks-standalone-brand-dot${active ? " is-active" : ""}`}
                  onClick={() => setBrandTheme(id)}
                  aria-label={`Brand: ${label}`}
                  aria-pressed={active}
                  title={title}
                  style={{ background: swatch }}
                />
              );
            })}
          </div>

          <div className="ks-standalone-mode-group" role="group" aria-label="Color mode">
            <span className="ks-standalone-overline" aria-hidden="true">Mode</span>
            <button
              type="button"
              className="ks-standalone-mode-btn"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
            >
              {darkMode ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
              <span>{darkMode ? "Dark" : "Light"}</span>
            </button>
          </div>

          <button
            type="button"
            className="ks-standalone-exit"
            onClick={onExit}
            aria-label="Back to docs"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to docs</span>
          </button>
        </div>

        <div className="ks-standalone-toolbar-row ks-standalone-toolbar-row-controls">
          <DebugControls
            patterns={PATTERNS}
            selectedPatternId={pattern.id}
            onSelectPattern={host.setSelectedPatternId}
            recordState={host.recordState}
            onChangeRecordState={host.setRecordState}
            flags={pattern.flags}
            flagValues={flags}
            onChangeFlag={host.setFlag}
          />
        </div>
      </header>

      <main className="ks-standalone-stage" aria-label={`${pattern.label} pattern preview`}>
        {/* Same key strategy as the embedded host so record-state flips
            give each pattern fresh local state. */}
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
  flex-direction: column;
  background: var(--vsee-grey-200);
  color: var(--vsee-text-primary);
  font-family: var(--vsee-font-sans);
  /* Honour OS-level reduced-motion: no slide-in. */
}

/* Sticky toolbar — overline labels + monospace eyebrows mirror va-main's
   debug-panel idiom without adopting amber. Brand-coloured pill instead. */
.ks-standalone-toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--vsee-white);
  border-bottom: 1px solid var(--vsee-border);
  box-shadow: var(--vsee-shadow-sm);
  flex-shrink: 0;
}
.ks-standalone-toolbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--vsee-sp-4);
  padding: var(--vsee-sp-3) var(--vsee-sp-5);
  min-height: 48px;
}
.ks-standalone-toolbar-row-controls {
  border-top: 1px solid var(--vsee-border);
  padding-top: var(--vsee-sp-2);
  padding-bottom: var(--vsee-sp-2);
}
.ks-standalone-toolbar-row-controls .ks-toolbar {
  /* Inherit toolbar styles but flatten the bordered card look — the
     standalone toolbar already provides the chrome. */
  margin-bottom: 0;
  background: transparent;
  border: none;
  padding: 0;
  flex: 1;
}

/* Brand chip on the left edge */
.ks-standalone-brand {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
  flex-shrink: 0;
}
.ks-standalone-brand-icon { color: var(--vsee-brand); }
.ks-standalone-brand-eyebrow {
  font-family: var(--vsee-mono);
  font-size: var(--vsee-text-overline-size);
  font-weight: 700;
  color: var(--vsee-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.ks-standalone-brand-pill {
  font-family: var(--vsee-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--vsee-brand-dark);
  background: var(--vsee-brand-light);
  border: 1px solid var(--vsee-brand);
  border-radius: var(--vsee-r-full);
  padding: 1px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Overline labels — mirrors DebugPanel's CURRENT MODULE / DISPLAY headers */
.ks-standalone-overline {
  font-family: var(--vsee-mono);
  font-size: var(--vsee-text-overline-size);
  font-weight: 700;
  color: var(--vsee-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Brand picker — three swatches */
.ks-standalone-theme-group {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
}
.ks-standalone-brand-dot {
  width: 24px;
  height: 24px;
  border-radius: var(--vsee-r-full);
  border: 2px solid var(--vsee-border-strong);
  cursor: pointer;
  outline: none;
  padding: 0;
  transition: transform var(--vsee-t-fast), border-color var(--vsee-t-fast),
    box-shadow var(--vsee-t-fast);
}
.ks-standalone-brand-dot:hover {
  transform: scale(1.05);
  border-color: var(--vsee-text-primary);
}
.ks-standalone-brand-dot.is-active {
  border-color: var(--vsee-text-primary);
  box-shadow: 0 0 0 2px var(--vsee-white), 0 0 0 4px var(--vsee-brand);
}
.ks-standalone-brand-dot:focus-visible {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 3px;
}

/* Light/dark mode toggle */
.ks-standalone-mode-group {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
}
.ks-standalone-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
  height: 28px;
  padding: 0 var(--vsee-sp-3);
  background: var(--vsee-grey-200);
  color: var(--vsee-text-primary);
  border: 1px solid var(--vsee-border-strong);
  border-radius: var(--vsee-r-full);
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-caption-size);
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: background var(--vsee-t-fast);
  /* WCAG 2.5.8: 28px height + min text width clears 24×24. */
  min-width: 70px;
}
.ks-standalone-mode-btn:hover { background: var(--vsee-grey-300); }
.ks-standalone-mode-btn:focus-visible {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
}

/* Back-to-docs button — pushed to the right edge */
.ks-standalone-exit {
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
  height: 32px;
  padding: 0 var(--vsee-sp-3);
  background: var(--vsee-brand);
  color: #FFFFFF;
  border: 1px solid var(--vsee-brand);
  border-radius: var(--vsee-r-md);
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-caption-size);
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: background var(--vsee-t-fast);
}
.ks-standalone-exit:hover {
  background: var(--vsee-brand-semidark);
  border-color: var(--vsee-brand-semidark);
}
.ks-standalone-exit:focus-visible {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
  box-shadow: var(--vsee-shadow-focus);
}

/* Stage — the pattern fills the rest of the viewport. */
.ks-standalone-stage {
  flex: 1;
  min-height: 0;
  padding: var(--vsee-sp-4);
  overflow: auto;
  display: flex;
  flex-direction: column;
}
/* Override the chat-pattern's own height clamp when it's hosted full-screen,
   so the two-pane layout expands to fill the stage. Scoped via the
   .ks-standalone-stage parent so embedded use is unaffected. */
.ks-standalone-stage > .chat-pattern {
  height: 100%;
  flex: 1;
  min-height: 0;
}

@media (max-width: 720px) {
  .ks-standalone-stage { padding: var(--vsee-sp-2); }
  .ks-standalone-toolbar-row { padding: var(--vsee-sp-2) var(--vsee-sp-3); gap: var(--vsee-sp-3); }
  .ks-standalone-exit span { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .ks-standalone-brand-dot,
  .ks-standalone-mode-btn,
  .ks-standalone-exit { transition: none; }
}
`;
