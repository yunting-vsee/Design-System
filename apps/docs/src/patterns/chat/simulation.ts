/**
 * Simulation actions + counters for the chat pattern.
 *
 * Lives in its own module (rather than ChatPattern.tsx) so the
 * `react-refresh/only-export-components` lint rule stays clean — the
 * .tsx file exports only the component, while plain functions/objects
 * stay importable from the registry without a Fast Refresh penalty.
 *
 * `chat:new`     — push a synthetic conversation onto the rail and seed
 *                  it with a starter system message. Doesn't auto-select
 *                  (matches va-main's "+ New Chat" semantics — the user
 *                  picks when to enter the room).
 * `chat:clear`   — wipe conversations + messages so the empty-state UI
 *                  takes over. Marked `destructive` so the sidebar
 *                  renders it with danger-coloured outlines. Does NOT
 *                  flip recordState — the user owns that toggle.
 *
 * Conversation counter — reads `mocks.conversations.length` so the
 * sidebar live-updates as actions fire.
 */
import type {
  PatternSimulationAction,
  PatternSimulationCounter,
} from "../types";
import type { ChatMocks, Conversation, Message } from "./mocks";

/* Synthetic-user roster — deterministic, used for repeated "+ New Chat"
   clicks. Cycles: when the action is invoked more times than the roster
   has entries, the suffix increments ("Synthetic User 7" etc.). */
const SYNTHETIC_NAMES = [
  "Riley Adams",
  "Quinn Blake",
  "Avery Chen",
  "Jordan Diaz",
  "Casey Erikson",
  "Morgan Flores",
];

function syntheticInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function nextSyntheticConversation(existing: Conversation[]): Conversation {
  // Count synthetic conversations already on the rail so repeat clicks
  // produce stable, distinct names. Matches va-main's deterministic
  // simulation idiom.
  const count = existing.filter((c) => c.id.startsWith("syn-")).length;
  const name = SYNTHETIC_NAMES[count % SYNTHETIC_NAMES.length] ??
    `Synthetic User ${count + 1}`;
  const id = `syn-${count + 1}`;
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return {
    id,
    name,
    initials: syntheticInitials(name),
    isGroup: false,
    presence: "online",
    unread: 0,
    muted: false,
    lastMessagePreview: "",
    lastMessageTime: time,
    lastMessageFromMe: false,
  };
}

function starterMessage(conversation: Conversation): Message {
  return {
    id: `${conversation.id}-sys-1`,
    from: "system",
    senderName: "system",
    text: `${conversation.name} joined the conversation`,
    timestamp: new Date().toISOString(),
    systemEvent: true,
  };
}

export const CHAT_SIMULATION_COUNTERS: PatternSimulationCounter<ChatMocks>[] = [
  {
    id: "conversations",
    label: "Conversations",
    read: (host) => host.getMocks().conversations.length,
  },
];

export const CHAT_SIMULATION_ACTIONS: PatternSimulationAction<ChatMocks>[] = [
  {
    id: "chat:new",
    label: "+ New Chat",
    onRun: (host) => {
      const current = host.getMocks();
      const conversation = nextSyntheticConversation(current.conversations);
      host.setMocks({
        ...current,
        // Prepend so the freshest synthetic entry sits at the top of the
        // rail — matches the inbox-style ordering Phoenix users expect.
        conversations: [conversation, ...current.conversations],
        messagesByConversation: {
          ...current.messagesByConversation,
          [conversation.id]: [starterMessage(conversation)],
        },
      });
    },
  },
  {
    id: "chat:clear",
    label: "Clear All",
    variant: "destructive",
    onRun: (host) => {
      host.setMocks({
        conversations: [],
        selectedId: null,
        messagesByConversation: {},
      });
    },
  },
];
