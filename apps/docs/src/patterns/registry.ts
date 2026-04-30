/**
 * Kitchen-sink pattern registry + standalone-mode constants.
 *
 * Kept in a non-component module so the pattern entries and helpers can
 * be imported from any host (embedded `KitchenSink`, full-screen
 * `StandaloneKitchenSink`, future tests) without tripping the
 * `react-refresh/only-export-components` lint rule.
 */
import { ChatPattern } from "./chat/ChatPattern";
import { CHAT_PATTERN_FLAGS } from "./chat/flags";
import { getChatMocks } from "./chat/mocks";
import type { AnyPattern, Pattern } from "./types";

/* ─── Registry ─── */

const ChatPatternEntry: Pattern<ReturnType<typeof getChatMocks>> = {
  id: "chat",
  label: "Chat",
  description:
    "Two-pane chat surface: conversation rail on the left, header / message stream / composer on the right. Mirrors the Phoenix chat layout using only @vsee/ui tokens.",
  Component: ChatPattern,
  getMocks: getChatMocks,
  flags: CHAT_PATTERN_FLAGS,
};

export const PATTERNS: AnyPattern[] = [
  ChatPatternEntry as unknown as AnyPattern,
];

/* ─── Standalone hash route ─── */

/** URL hash that flips the SPA into full-screen kitchen-sink mode. */
export const STANDALONE_HASH = "#kitchen-sink-fullscreen";

/** True when the current location matches the standalone hash. SSR-safe. */
export function isStandaloneHash(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hash === STANDALONE_HASH;
}
