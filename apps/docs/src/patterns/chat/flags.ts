/**
 * Flag definitions for the chat pattern.
 *
 * Lives in its own module (rather than in ChatPattern.tsx) so the
 * `react-refresh/only-export-components` lint rule stays clean — the
 * .tsx file can export only the component, while constants and types
 * are imported from here by the kitchen-sink registry.
 *
 * Each flag is wired into runtime behaviour by ChatPattern:
 * - `typing`       — show / hide the "… is typing" indicator + header subtitle
 * - `readReceipts` — show / hide the delivery status icon on the last own bubble
 * - `rtl`          — flip the chat surface to right-to-left layout (dir="rtl")
 */
import type { PatternFlag } from "../types";

export const CHAT_PATTERN_FLAGS: PatternFlag[] = [
  {
    id: "typing",
    label: "Typing indicator",
    default: true,
    description: "Animated dots + 'typing…' subtitle",
  },
  {
    id: "readReceipts",
    label: "Read receipts",
    default: true,
    description: "Sent / Delivered / Read on own bubbles",
  },
  {
    id: "rtl",
    label: "RTL",
    default: false,
    description: "Right-to-left layout (dir attribute)",
  },
];
