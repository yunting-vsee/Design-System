/**
 * Shared host-state hook for the kitchen-sink showcase.
 *
 * Both <KitchenSink /> (embedded) and <StandaloneKitchenSink /> (full-
 * screen) call this hook, so flag values, pattern selection, and record
 * state are wired identically — the only difference is the chrome
 * around them.
 *
 * Lives in its own .ts file (not a .tsx with a component) so the
 * `react-refresh/only-export-components` lint rule stays clean.
 */
import { useMemo, useState } from "react";
import { PATTERNS } from "./registry";
import {
  defaultFlagValues,
  type AnyPattern,
  type FlagValues,
  type RecordState,
} from "./types";

export interface KitchenSinkHostState {
  selectedPatternId: string;
  setSelectedPatternId: (id: string) => void;
  recordState: RecordState;
  setRecordState: (state: RecordState) => void;
  pattern: AnyPattern;
  mocks: unknown;
  flags: FlagValues;
  setFlag: (id: string, value: boolean) => void;
}

export function useKitchenSinkHostState(): KitchenSinkHostState {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    PATTERNS[0].id,
  );
  const [recordState, setRecordState] = useState<RecordState>("many");

  const pattern = useMemo(
    () => PATTERNS.find((p) => p.id === selectedPatternId) ?? PATTERNS[0],
    [selectedPatternId],
  );

  // Per-pattern flag values. Keyed by pattern id so flipping patterns
  // doesn't cross-contaminate flag state — each pattern keeps its own
  // toggle history while the user explores.
  const [flagsByPattern, setFlagsByPattern] = useState<Record<string, FlagValues>>(
    () => {
      const out: Record<string, FlagValues> = {};
      for (const p of PATTERNS) out[p.id] = defaultFlagValues(p.flags);
      return out;
    },
  );

  const flags = flagsByPattern[pattern.id] ?? {};

  const setFlag = (id: string, value: boolean) => {
    setFlagsByPattern((prev) => ({
      ...prev,
      [pattern.id]: { ...(prev[pattern.id] ?? {}), [id]: value },
    }));
  };

  // Memoise the mock factory invocation so children that depend on
  // `mocks` identity (e.g. ChatPattern's selection-reset effect) don't
  // re-run on unrelated re-renders.
  const mocks = useMemo(
    () => pattern.getMocks(recordState),
    [pattern, recordState],
  );

  return {
    selectedPatternId,
    setSelectedPatternId,
    recordState,
    setRecordState,
    pattern,
    mocks,
    flags,
    setFlag,
  };
}
