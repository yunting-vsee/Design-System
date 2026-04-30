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
 * A pattern entry is the contract every page-pattern publishes.
 *
 * - `id`              — stable pattern key (used as React key + URL-safe slug)
 * - `label`           — human label for the picker
 * - `description`     — short blurb shown above the rendered pattern
 * - `Component`       — the visual component; receives `mocks` as the sole prop
 * - `getMocks`        — pure function returning data for a given record state
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
  Component: ComponentType<{ mocks: TMocks }>;
  getMocks: (state: RecordState) => TMocks;
}

export type AnyPattern = Pattern<unknown>;
