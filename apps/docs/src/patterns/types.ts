/**
 * Shared type vocabulary for the kitchen-sink "Pages" showcase.
 *
 * RecordState drives the empty / single / many toggle that every pattern
 * wires to its mock data factory. The Pattern shape is the registry entry
 * a pattern publishes so the host can render it without knowing anything
 * pattern-specific.
 */
import type { ComponentType } from "react";

export type RecordState = "empty" | "single" | "many";

export const RECORD_STATES: RecordState[] = ["empty", "single", "many"];

export const RECORD_STATE_LABELS: Record<RecordState, string> = {
  empty: "None",
  single: "One",
  many: "Many",
};

/**
 * A binary flag a pattern publishes for the toolbar to surface.
 *
 * Each pattern declares its own flag list (e.g. chat: typing indicator,
 * read receipts, RTL). The host renders one toggle per flag, keeps a
 * `Record<flagId, boolean>` of the values, and threads them into the
 * pattern's props. Patterns aren't required to wire every flag into
 * runtime behaviour — surfacing the affordance in the toolbar is enough
 * for documentation, and behaviour can be wired incrementally.
 *
 * Reusable extension point: Settings / Calls patterns will declare their
 * own flags via the same shape.
 */
export interface PatternFlag {
  /** Stable, URL-safe key used for state + as the React key. */
  id: string;
  /** Human label shown next to the toggle. */
  label: string;
  /** Initial value when the host first renders the toolbar. */
  default: boolean;
  /** Optional one-line caption for low-affordance flags. */
  description?: string;
}

export type FlagValues = Record<string, boolean>;

/**
 * Live host API exposed to pattern simulation actions + counters.
 *
 * Lets a pattern's "+ New X" / "Clear All" affordances mutate the host's
 * mocks state without owning React state themselves. The host (kitchen-
 * sink) builds a fresh `PatternHostApi` each render and passes it into
 * the action's `onRun` callback.
 *
 * `TMocks` is the pattern's own mock shape; the kitchen-sink registry
 * narrows from `unknown` to the pattern's declared shape via the same
 * `Pattern<TMocks>` boundary that the renderer uses.
 */
export interface PatternHostApi<TMocks = unknown> {
  /** Current mocks. */
  getMocks: () => TMocks;
  /** Replace the mocks wholesale. The host re-renders the pattern with
      the new value but does NOT remount it (so plain useState inside the
      pattern survives). To force a remount, flip recordState. */
  setMocks: (next: TMocks) => void;
  /** Current empty / single / many state. */
  recordState: RecordState;
  /** Force-flip the record state (e.g. clearing might reset to "empty"). */
  setRecordState: (state: RecordState) => void;
}

/**
 * A simulation action a pattern publishes to the host's debug sidebar.
 *
 * Renders as a button under a "CHAT SIMULATION" / "CLINIC SIMULATION"
 * group. Patterns wire their domain logic in `onRun`; the host invokes
 * it with a fresh `PatternHostApi` so the action can read + replace the
 * mocks without holding React state itself.
 *
 * Action ids follow `<pattern>:<verb>` (e.g. "chat:new", "chat:clear")
 * for traceability + telemetry. Variant defaults to `default`; pass
 * `destructive` for "Clear All" / "Reset" affordances — the host renders
 * those with a danger-coloured outline.
 */
export interface PatternSimulationAction<TMocks = unknown> {
  id: string;
  label: string;
  variant?: "default" | "destructive";
  onRun: (host: PatternHostApi<TMocks>) => void;
}

/**
 * A live read-out a pattern publishes to the sidebar — e.g. "Conversations: 15".
 *
 * `read` runs every render so the value tracks current mocks. Patterns
 * own the formatting (return `"15"`, `"3 patients"`, etc.) — the host
 * renders the label + value pair without interpretation.
 */
export interface PatternSimulationCounter<TMocks = unknown> {
  id: string;
  label: string;
  read: (host: PatternHostApi<TMocks>) => string | number;
}

/**
 * A pattern entry is the contract every page-pattern publishes.
 *
 * - `id`               — stable pattern key (used as React key + URL-safe slug)
 * - `label`            — human label for the picker
 * - `description`      — short blurb shown above the rendered pattern
 * - `Component`        — the visual component; receives `mocks` + `flags` as props
 * - `getMocks`         — pure function returning data for a given record state
 * - `flags`            — optional per-pattern toggles (typing indicator, RTL, ...)
 * - `simulationLabel`  — optional eyebrow text for the sidebar simulation group
 *                        (e.g. "Chat simulation" — defaults to `${label} simulation`)
 * - `simulationCounters` — optional live read-outs ("Conversations: N")
 * - `simulationActions`  — optional buttons ("+ New Chat", "Clear All")
 *
 * `Component` is parameterised by the mock shape it consumes. The registry
 * stores patterns through the `Pattern<unknown>` alias so the host can hold
 * heterogeneous patterns in one array; each entry casts its own mock type at
 * the boundary.
 */
export interface Pattern<TMocks> {
  id: string;
  label: string;
  description: string;
  Component: ComponentType<{ mocks: TMocks; flags: FlagValues }>;
  getMocks: (state: RecordState) => TMocks;
  flags?: PatternFlag[];
  simulationLabel?: string;
  simulationCounters?: PatternSimulationCounter<TMocks>[];
  simulationActions?: PatternSimulationAction<TMocks>[];
}

export type AnyPattern = Pattern<unknown>;

/** Build the initial `Record<flagId, boolean>` from a pattern's flag list. */
export function defaultFlagValues(flags: PatternFlag[] | undefined): FlagValues {
  if (!flags) return {};
  const out: FlagValues = {};
  for (const f of flags) out[f.id] = f.default;
  return out;
}
