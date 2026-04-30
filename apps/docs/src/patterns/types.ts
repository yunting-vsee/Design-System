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
 * A pattern entry is the contract every page-pattern publishes.
 *
 * - `id`              — stable pattern key (used as React key + URL-safe slug)
 * - `label`           — human label for the picker
 * - `description`     — short blurb shown above the rendered pattern
 * - `Component`       — the visual component; receives `mocks` + `flags` as props
 * - `getMocks`        — pure function returning data for a given record state
 * - `flags`           — optional per-pattern toggles (typing indicator, RTL, ...)
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
}

export type AnyPattern = Pattern<unknown>;

/** Build the initial `Record<flagId, boolean>` from a pattern's flag list. */
export function defaultFlagValues(flags: PatternFlag[] | undefined): FlagValues {
  if (!flags) return {};
  const out: FlagValues = {};
  for (const f of flags) out[f.id] = f.default;
  return out;
}
