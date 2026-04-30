/**
 * KitchenSink — landing surface for the docs site's "Pages" section.
 *
 * Acts as an SPA-within-the-SPA: when App.tsx routes to "Pages", it
 * renders this component instead of the foundations / components
 * scroll-stack. Internally:
 *
 *   1. A registry of patterns (data-driven — to add a second pattern,
 *      import its component + getMocks and append a registry entry).
 *   2. A toolbar (DebugControls) that picks a pattern + record state.
 *   3. A live preview frame that renders the selected pattern with the
 *      mocks for that record state. Mocks flow as a prop, so the
 *      record-state toggle re-renders the pattern with new data — no
 *      remount hack required.
 *
 * Architecture call: each pattern owns its own `getMocks(state)` so the
 * host doesn't need to know any pattern-specific shape. The registry
 * stores patterns as `AnyPattern` (Pattern<unknown>) and the renderer
 * thunk hands the pattern its own mocks back through its declared
 * Component prop type.
 */
import { useMemo, useState } from "react";
import { DebugControls } from "./DebugControls";
import { ChatPattern } from "./chat/ChatPattern";
import { getChatMocks } from "./chat/mocks";
import type { AnyPattern, Pattern, RecordState } from "./types";

/* ─── Registry ─── */

const ChatPatternEntry: Pattern<ReturnType<typeof getChatMocks>> = {
  id: "chat",
  label: "Chat",
  description:
    "Two-pane chat surface: conversation rail on the left, header / message stream / composer on the right. Mirrors the Phoenix chat layout using only @vsee/ui tokens.",
  Component: ChatPattern,
  getMocks: getChatMocks,
};

const PATTERNS: AnyPattern[] = [
  ChatPatternEntry as unknown as AnyPattern,
];

/* ─── Host ─── */

export function KitchenSink() {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    PATTERNS[0].id,
  );
  const [recordState, setRecordState] = useState<RecordState>("many");

  const pattern = useMemo(
    () => PATTERNS.find((p) => p.id === selectedPatternId) ?? PATTERNS[0],
    [selectedPatternId],
  );

  // Memoise the mock factory invocation so children that depend on
  // `mocks` identity (e.g. ChatPattern's selection-reset effect) don't
  // re-run on unrelated re-renders.
  const mocks = useMemo(
    () => pattern.getMocks(recordState),
    [pattern, recordState],
  );

  const PatternComponent = pattern.Component;

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
        onSelectPattern={setSelectedPatternId}
        recordState={recordState}
        onChangeRecordState={setRecordState}
      />

      <div className="ks-pattern-meta">
        <div className="ks-pattern-name">{pattern.label}</div>
        <p className="ks-pattern-desc">{pattern.description}</p>
      </div>

      <div className="ks-pattern-frame">
        {/* key forces a fresh mount on record-state toggle so each pattern
            can keep its own selection/draft state in plain useState
            without an opt-in reset effect. */}
        <PatternComponent key={`${pattern.id}:${recordState}`} mocks={mocks} />
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
`;
