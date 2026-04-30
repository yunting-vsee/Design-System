/**
 * KitchenSink — landing surface for the docs site's "Pages" section.
 *
 * Acts as an SPA-within-the-SPA: when App.tsx routes to "Pages", it
 * renders this component instead of the foundations / components
 * scroll-stack. Internally:
 *
 *   1. A registry of patterns (data-driven — to add a second pattern,
 *      import its component + getMocks and append a registry entry).
 *   2. A toolbar (DebugControls) that picks a pattern + record state +
 *      per-pattern flags.
 *   3. A live preview frame that renders the selected pattern with the
 *      mocks for that record state. Mocks flow as a prop, so the
 *      record-state toggle re-renders the pattern with new data — no
 *      remount hack required.
 *
 * Two host modes share the registry:
 *   - <KitchenSink />           — embedded, in-section (under "Pages")
 *   - <StandaloneKitchenSink /> — full-screen, hash-based route
 *
 * Architecture call: each pattern owns its own `getMocks(state)` so the
 * host doesn't need to know any pattern-specific shape. The registry
 * stores patterns as `AnyPattern` (Pattern<unknown>) and the renderer
 * thunk hands the pattern its own mocks back through its declared
 * Component prop type.
 */
import { Maximize2 } from "lucide-react";
import { DebugControls } from "./DebugControls";
import { PATTERNS, STANDALONE_HASH } from "./registry";
import { useKitchenSinkHostState } from "./useKitchenSinkHost";

/* ─── Host (embedded, in-section) ─── */

export function KitchenSink() {
  const host = useKitchenSinkHostState();
  const { pattern, mocks, flags } = host;
  const PatternComponent = pattern.Component;

  const openFullScreen = () => {
    // Switch into the standalone hash route. App.tsx listens for
    // `hashchange` and swaps in <StandaloneKitchenSink />.
    window.location.hash = STANDALONE_HASH;
  };

  return (
    <section
      id="pages"
      className="ds-section ks-section"
      aria-label="Page patterns"
    >
      <div className="section-label">Patterns</div>
      <div className="section-title">Pages</div>
      <div className="section-desc">
        Full-page compositions of @vsee/ui tokens and components, intended
        as a north-star for downstream consumers like Phoenix. Pick a
        pattern from the toolbar and flip between empty / single / many
        record states to verify each surface handles every population.
      </div>

      <DebugControls
        patterns={PATTERNS}
        selectedPatternId={pattern.id}
        onSelectPattern={host.setSelectedPatternId}
        recordState={host.recordState}
        onChangeRecordState={host.setRecordState}
        flags={pattern.flags}
        flagValues={flags}
        onChangeFlag={host.setFlag}
        trailing={
          <button
            type="button"
            className="ks-fullscreen-btn"
            onClick={openFullScreen}
            aria-label="Open kitchen sink in full screen"
            title="Open kitchen sink in full screen"
          >
            <Maximize2 size={14} aria-hidden="true" />
            <span>Full screen</span>
          </button>
        }
      />

      <div className="ks-pattern-meta">
        <div className="ks-pattern-name">{pattern.label}</div>
        <p className="ks-pattern-desc">{pattern.description}</p>
      </div>

      <div className="ks-pattern-frame">
        {/* key forces a fresh mount on record-state toggle so each pattern
            can keep its own selection/draft state in plain useState
            without an opt-in reset effect. */}
        <PatternComponent
          key={`${pattern.id}:${host.recordState}`}
          mocks={mocks}
          flags={flags}
        />
      </div>

      <KitchenSinkStyles />
    </section>
  );
}

function KitchenSinkStyles() {
  return <style>{KITCHEN_SINK_CSS}</style>;
}

const KITCHEN_SINK_CSS = `
.ks-section { max-width: none; }
.ks-pattern-meta {
  display: flex;
  flex-direction: column;
  gap: var(--vsee-sp-1);
  margin-bottom: var(--vsee-sp-4);
}
.ks-pattern-name {
  font-size: var(--vsee-text-subtitle-size);
  font-weight: 700;
  color: var(--vsee-text-primary);
}
.ks-pattern-desc {
  font-size: var(--vsee-text-caption-size);
  color: var(--vsee-text-secondary);
  margin: 0;
  max-width: 720px;
  line-height: 1.5;
}
.ks-pattern-frame {
  background: var(--vsee-grey-200);
  border: 1px solid var(--vsee-border);
  border-radius: var(--vsee-r-xl);
  padding: var(--vsee-sp-4);
}
@media (max-width: 720px) {
  .ks-pattern-frame { padding: var(--vsee-sp-2); }
}

/* "Open in full screen" button — sits on the trailing edge of the toolbar.
   Reuses the brand outline aesthetic without depending on the .btn class. */
.ks-fullscreen-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
  height: 34px;
  padding: 0 var(--vsee-sp-3);
  background: var(--vsee-white);
  color: var(--vsee-brand-dark);
  border: 1px solid var(--vsee-brand);
  border-radius: var(--vsee-r-md);
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-caption-size);
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: background var(--vsee-t-fast), color var(--vsee-t-fast),
    box-shadow var(--vsee-t-fast);
}
.ks-fullscreen-btn:hover { background: var(--vsee-brand-light); }
.ks-fullscreen-btn:focus-visible {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
  box-shadow: var(--vsee-shadow-focus);
}
`;
