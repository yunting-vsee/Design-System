/**
 * Deterministic mock data for the Chat page pattern.
 *
 * Three record states are supported:
 *   - `empty`  — no conversations, no selection
 *   - `single` — one conversation, one message
 *   - `many`   — 10 conversations, 30+ messages spanning multiple days
 *
 * The fixtures are static module-level constants (no `Math.random`,
 * no `Date.now()`) so visual review of the kitchen-sink is stable
 * across reloads.
 */
import type { RecordState } from "../types";

/* ─── Public types — what ChatPattern consumes ─── */

export type Presence = "online" | "away" | "offline";

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  isGroup: boolean;
  presence: Presence;
  unread: number;
  muted: boolean;
  lastMessagePreview: string;
  lastMessageTime: string; // already formatted (e.g. "10:32", "Mon", "Apr 12")
  lastMessageFromMe: boolean;
}

export interface Message {
  id: string;
  /** Sender id — must match a Conversation participant or be `"me"`. */
  from: "me" | string;
  senderName: string;
  text: string;
  /** ISO timestamp; ChatPattern formats for display + day-divider grouping. */
  timestamp: string;
  /** When `me`-side: which delivery state to show on the LAST own bubble. */
  status?: "sent" | "delivered" | "read";
  /** System notices render as a centered, italic line — no bubble. */
  systemEvent?: boolean;
}

export interface ChatMocks {
  /** All conversations to show in the left rail (already ordered). */
  conversations: Conversation[];
  /** Conversation id auto-selected on mount. `null` = no selection. */
  selectedId: string | null;
  /** Messages keyed by conversation id. */
  messagesByConversation: Record<string, Message[]>;
  /** Optional: one conversation may be flagged as having a typing peer. */
  typingConversationId?: string | null;
}

/* ─── Internal helpers — keep deterministic, no clock reads ─── */

// A fixed reference point so day-dividers + relative dates are stable.
// Tuesday, 2026-04-28 14:00 UTC.
const NOW = new Date("2026-04-28T14:00:00Z");

const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3_600_000).toISOString();
const daysAgo = (d: number, hour = 9, minute = 0) => {
  const dt = new Date(NOW);
  dt.setUTCDate(dt.getUTCDate() - d);
  dt.setUTCHours(hour, minute, 0, 0);
  return dt.toISOString();
};

/* ─── Empty ─── */

const EMPTY: ChatMocks = {
  conversations: [],
  selectedId: null,
  messagesByConversation: {},
};

/* ─── Single ─── */

const SINGLE_ID = "u-sarah";
const SINGLE: ChatMocks = {
  conversations: [
    {
      id: SINGLE_ID,
      name: "Dr. Sarah Chen",
      initials: "SC",
      isGroup: false,
      presence: "online",
      unread: 0,
      muted: false,
      lastMessagePreview: "Sounds good, thanks!",
      lastMessageTime: "10:14",
      lastMessageFromMe: false,
    },
  ],
  selectedId: SINGLE_ID,
  messagesByConversation: {
    [SINGLE_ID]: [
      {
        id: "m1",
        from: SINGLE_ID,
        senderName: "Dr. Sarah Chen",
        text: "Sounds good, thanks!",
        timestamp: minutesAgo(12),
      },
    ],
  },
};

/* ─── Many ─── */

const MANY_CONVERSATIONS: Conversation[] = [
  {
    id: "u-sarah",
    name: "Dr. Sarah Chen",
    initials: "SC",
    isGroup: false,
    presence: "online",
    unread: 2,
    muted: false,
    lastMessagePreview: "Patient labs are in the chart.",
    lastMessageTime: "10:32",
    lastMessageFromMe: false,
  },
  {
    id: "u-marcus",
    name: "Marcus Johnson",
    initials: "MJ",
    isGroup: false,
    presence: "online",
    unread: 0,
    muted: false,
    lastMessagePreview: "You: I'll grab the consent form",
    lastMessageTime: "10:18",
    lastMessageFromMe: true,
  },
  {
    id: "g-rounds",
    name: "Cardiology Rounds",
    initials: "CR",
    isGroup: true,
    presence: "offline",
    unread: 5,
    muted: false,
    lastMessagePreview: "Aisha: Room 4 is ready",
    lastMessageTime: "09:52",
    lastMessageFromMe: false,
  },
  {
    id: "u-priya",
    name: "Priya Raman",
    initials: "PR",
    isGroup: false,
    presence: "away",
    unread: 0,
    muted: false,
    lastMessagePreview: "Sent the referral",
    lastMessageTime: "Mon",
    lastMessageFromMe: false,
  },
  {
    id: "g-clinic",
    name: "VSee Clinic Operations",
    initials: "VC",
    isGroup: true,
    presence: "offline",
    unread: 12,
    muted: true,
    lastMessagePreview: "Reminder: Tuesday standup at 9am",
    lastMessageTime: "Mon",
    lastMessageFromMe: false,
  },
  {
    id: "u-leon",
    name: "Leon Schwartz-Hoffmann",
    initials: "LS",
    isGroup: false,
    presence: "offline",
    unread: 0,
    muted: false,
    lastMessagePreview: "You: Catch up tomorrow morning?",
    lastMessageTime: "Sun",
    lastMessageFromMe: true,
  },
  {
    id: "u-amelia",
    name: "Amelia Park",
    initials: "AP",
    isGroup: false,
    presence: "online",
    unread: 1,
    muted: false,
    lastMessagePreview: "Photo",
    lastMessageTime: "Sun",
    lastMessageFromMe: false,
  },
  {
    id: "g-onboarding",
    name: "New Provider Onboarding",
    initials: "NP",
    isGroup: true,
    presence: "offline",
    unread: 0,
    muted: false,
    lastMessagePreview: "Welcome aboard, Dr. Wu!",
    lastMessageTime: "Apr 23",
    lastMessageFromMe: false,
  },
  {
    id: "u-jamal",
    name: "Jamal Carter",
    initials: "JC",
    isGroup: false,
    presence: "offline",
    unread: 0,
    muted: false,
    lastMessagePreview: "Got it — see you Friday",
    lastMessageTime: "Apr 21",
    lastMessageFromMe: false,
  },
  {
    id: "u-noor",
    name: "Noor Hassan",
    initials: "NH",
    isGroup: false,
    presence: "offline",
    unread: 0,
    muted: false,
    lastMessagePreview: "You: Thanks for the heads up",
    lastMessageTime: "Apr 18",
    lastMessageFromMe: true,
  },
];

const MANY_MESSAGES_SARAH: Message[] = [
  // Two days ago
  {
    id: "s-1",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "Morning! Did you get a chance to look over the discharge plan for Mr. Alvarez?",
    timestamp: daysAgo(2, 9, 5),
  },
  {
    id: "s-2",
    from: "me",
    senderName: "You",
    text: "Yes — looks good to me. The PT follow-up timing is the main thing I'd flag.",
    timestamp: daysAgo(2, 9, 12),
  },
  {
    id: "s-3",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "Agreed. I'll bump it to 48h post-discharge.",
    timestamp: daysAgo(2, 9, 14),
  },
  {
    id: "s-sys-1",
    from: "system",
    senderName: "system",
    text: "Dr. Sarah Chen added the chart to this conversation",
    timestamp: daysAgo(2, 9, 16),
    systemEvent: true,
  },
  {
    id: "s-4",
    from: "me",
    senderName: "You",
    text: "Perfect, thanks.",
    timestamp: daysAgo(2, 9, 18),
  },

  // Yesterday
  {
    id: "s-5",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "Quick question — are you on call this Saturday?",
    timestamp: daysAgo(1, 14, 30),
  },
  {
    id: "s-6",
    from: "me",
    senderName: "You",
    text: "I am. Why, do you need to swap?",
    timestamp: daysAgo(1, 14, 33),
  },
  {
    id: "s-7",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "If you're up for it, yes — my kid has a recital. Could trade for the Wed AM slot week after next.",
    timestamp: daysAgo(1, 14, 35),
  },
  {
    id: "s-8",
    from: "me",
    senderName: "You",
    text: "That works. I'll let scheduling know.",
    timestamp: daysAgo(1, 14, 41),
  },
  {
    id: "s-9",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "You're a lifesaver. Thank you!",
    timestamp: daysAgo(1, 14, 42),
  },
  {
    id: "s-10",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "Also — patient in room 4 needs a quick check when you get a sec.",
    timestamp: daysAgo(1, 16, 10),
  },
  {
    id: "s-11",
    from: "me",
    senderName: "You",
    text: "On my way.",
    timestamp: daysAgo(1, 16, 12),
  },

  // Today
  {
    id: "s-12",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "Hey — re: Alvarez, his Tuesday appt is confirmed.",
    timestamp: hoursAgo(5),
  },
  {
    id: "s-13",
    from: "me",
    senderName: "You",
    text: "Thanks for the update.",
    timestamp: hoursAgo(5),
  },
  {
    id: "s-14",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "And I just dropped his updated labs in the chart — A1c is down to 6.8.",
    timestamp: hoursAgo(2),
  },
  {
    id: "s-15",
    from: "me",
    senderName: "You",
    text: "Oh nice, that's a meaningful drop. I'll review before our next sync.",
    timestamp: hoursAgo(2),
  },
  {
    id: "s-16",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "Patient labs are in the chart. Let me know if anything looks off.",
    timestamp: minutesAgo(30),
  },
  {
    id: "s-17",
    from: "u-sarah",
    senderName: "Dr. Sarah Chen",
    text: "Also — quick FYI, his blood pressure has trended down since the medication adjustment.",
    timestamp: minutesAgo(28),
    status: "read",
  },
];

const MANY_MESSAGES_MARCUS: Message[] = [
  {
    id: "mj-1",
    from: "u-marcus",
    senderName: "Marcus Johnson",
    text: "Hey, do we still need the consent form for Friday's procedure?",
    timestamp: hoursAgo(7),
  },
  {
    id: "mj-2",
    from: "me",
    senderName: "You",
    text: "Yes — I'll grab the consent form on my way in.",
    timestamp: hoursAgo(6),
    status: "read",
  },
];

const MANY_MESSAGES_ROUNDS: Message[] = [
  {
    id: "r-sys-1",
    from: "system",
    senderName: "system",
    text: "Aisha created this group",
    timestamp: daysAgo(7, 8, 0),
    systemEvent: true,
  },
  {
    id: "r-1",
    from: "u-aisha",
    senderName: "Aisha Patel",
    text: "Morning team — rounds at 9.",
    timestamp: hoursAgo(8),
  },
  {
    id: "r-2",
    from: "me",
    senderName: "You",
    text: "On my way.",
    timestamp: hoursAgo(8),
  },
  {
    id: "r-3",
    from: "u-aisha",
    senderName: "Aisha Patel",
    text: "Room 4 is ready when you are.",
    timestamp: hoursAgo(4),
  },
];

const MANY: ChatMocks = {
  conversations: MANY_CONVERSATIONS,
  selectedId: "u-sarah",
  messagesByConversation: {
    "u-sarah": MANY_MESSAGES_SARAH,
    "u-marcus": MANY_MESSAGES_MARCUS,
    "g-rounds": MANY_MESSAGES_ROUNDS,
  },
  typingConversationId: "u-sarah",
};

/* ─── Public factory ─── */

export function getChatMocks(state: RecordState): ChatMocks {
  switch (state) {
    case "empty":
      return EMPTY;
    case "single":
      return SINGLE;
    case "many":
      return MANY;
  }
}
