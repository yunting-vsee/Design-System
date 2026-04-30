/**
 * Shared host-state hook for the kitchen-sink showcase.
 *
 * Both <KitchenSink /> (embedded) and <StandaloneKitchenSink /> (full-
 * screen) call this hook, so flag values, pattern selection, and record
 * state are wired identically — the only difference is the chrome
 * around them.
 *
 * Mocks are now state-backed (was useMemo) so simulation actions like
 * "+ New Chat" / "Clear All" can mutate them. The pattern still
 * remounts on `${pattern.id}:${recordState}` (host responsibility), so
 * flipping records gives each pattern fresh internal state — but
 * actions don't trigger a remount, just a re-render with new mocks.
 *
 * Lives in its own .ts file (not a .tsx with a component) so the
 * `react-refresh/only-export-components` lint rule stays clean.
 */
import { useCallback, useMemo, useState } from "react";
import { PATTERNS } from "./registry";
import {
  defaultFlagValues,
  type AnyPattern,
  type FlagValues,
  type PatternHostApi,
  type PatternSimulationAction,
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
  /** Read a pattern-supplied counter against the current host state. */
  readCounter: (counterId: string) => string | number | undefined;
  /** Invoke a pattern-supplied simulation action. No-op if the id is
      unknown or doesn't belong to the active pattern. */
  runAction: (actionId: string) => void;
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

  // Mocks are state-backed so simulation actions can mutate them.
  // Reset to the pattern factory synchronously during render whenever
  // pattern or record-state flips. Tracking the session key in a state
  // slot (rather than a ref) sidesteps the `react-hooks/refs` lint rule
  // and follows the React docs' "deriving state from props" pattern:
  // when the prior key differs, queue a setState during render — React
  // discards the tentative tree and re-renders with the fresh value, so
  // a freshly-remounted pattern sees the current mocks on its first
  // render rather than a one-render-stale snapshot.
  const sessionKey = `${pattern.id}:${recordState}`;
  const [mocks, setMocks] = useState<unknown>(() =>
    pattern.getMocks(recordState),
  );
  const [trackedSessionKey, setTrackedSessionKey] = useState<string>(sessionKey);
  if (trackedSessionKey !== sessionKey) {
    setTrackedSessionKey(sessionKey);
    setMocks(pattern.getMocks(recordState));
  }

  // Build the host API that simulation actions/counters consume. Stable
  // identity per render so consumers can pass it to a memoised child.
  const hostApi: PatternHostApi<unknown> = useMemo(
    () => ({
      getMocks: () => mocks,
      setMocks: (next: unknown) => setMocks(next),
      recordState,
      setRecordState,
    }),
    [mocks, recordState],
  );

  const readCounter = useCallback(
    (counterId: string): string | number | undefined => {
      const counter = pattern.simulationCounters?.find((c) => c.id === counterId);
      if (!counter) return undefined;
      return counter.read(hostApi);
    },
    [pattern, hostApi],
  );

  const runAction = useCallback(
    (actionId: string) => {
      const action = pattern.simulationActions?.find(
        (a: PatternSimulationAction<unknown>) => a.id === actionId,
      );
      if (!action) return;
      action.onRun(hostApi);
    },
    [pattern, hostApi],
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
    readCounter,
    runAction,
  };
}
