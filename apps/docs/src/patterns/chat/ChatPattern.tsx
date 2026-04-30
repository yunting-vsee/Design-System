/**
 * ChatPattern — the @vsee/ui-flavoured rendering of the Phoenix chat surface.
 *
 * This component is purely presentational — all data comes in via the
 * `mocks` prop. The kitchen-sink host (KitchenSink.tsx) owns the record-
 * state radio and feeds the matching mocks down. To use this pattern in a
 * different consumer (Phoenix, an integration test, a Storybook entry),
 * pass a different `ChatMocks` object — the shape is what matters, not the
 * source.
 *
 * Layout:
 *   [ left rail: conversation list (~280px) ] [ main: header / messages / composer ]
 *
 * Accessibility:
 *   - Conversation list uses React Aria `ListBox` for keyboard nav, focus
 *     ring, role=listbox/option semantics.
 *   - Message stream is `role="log"` so screen readers announce new
 *     messages and the user can navigate by virtual cursor.
 *   - Composer uses React Aria `TextField` + `TextArea` with a visible
 *     placeholder and an `sr-only` label (the chat header carries the
 *     visible "who you are messaging" context).
 *   - Day-divider is `role="separator"` with an `aria-label` carrying the
 *     date so the announcement isn't just a bare hairline.
 *   - Icon-only Buttons (call, video, info, send, attach, emoji) carry
 *     explicit `aria-label`s and meet 24×24 minimum target size.
 *   - Reduced motion: typing-dot animation is gated by a media query.
 */
import { useMemo, useState, useRef, useEffect } from "react";
import {
  Button,
  ListBox,
  ListBoxItem,
  TextField,
  TextArea,
  Label,
} from "react-aria-components";
import {
  Phone,
  Video,
  Info,
  Send,
  Paperclip,
  Smile,
  MessageSquare,
  Search,
  MoreHorizontal,
  Users,
  BellOff,
  Check,
  CheckCheck,
} from "lucide-react";
import { Avatar } from "./components/Avatar";
import type { ChatMocks, Conversation, Message } from "./mocks";

export interface ChatPatternProps {
  mocks: ChatMocks;
}

export function ChatPattern({ mocks }: ChatPatternProps) {
  // Selection + draft are plain local state. The host (KitchenSink)
  // re-mounts this component via a `key` prop on record-state toggle,
  // so these initialisers re-run with the fresh mocks — no sync effect.
  const [selectedId, setSelectedId] = useState<string | null>(mocks.selectedId);
  const [draft, setDraft] = useState("");

  const selected = useMemo<Conversation | null>(
    () => mocks.conversations.find((c) => c.id === selectedId) ?? null,
    [mocks.conversations, selectedId],
  );

  const messages = selectedId
    ? mocks.messagesByConversation[selectedId] ?? []
    : [];

  return (
    <div className="chat-pattern">
      <ConversationRail
        conversations={mocks.conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <main className="chat-pattern-main" aria-label="Conversation">
        {selected ? (
          <>
            <ChatHeader
              conversation={selected}
              isTyping={
                mocks.typingConversationId === selected.id ? true : false
              }
            />
            <MessageStream
              messages={messages}
              showTyping={mocks.typingConversationId === selected.id}
            />
            <Composer
              draft={draft}
              onDraftChange={setDraft}
              recipientName={selected.name}
            />
          </>
        ) : (
          <NoSelectionPlaceholder hasConversations={mocks.conversations.length > 0} />
        )}
      </main>

      <ChatPatternStyles />
    </div>
  );
}

/* ─── Conversation rail ─── */

function ConversationRail({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="chat-rail" aria-label="Conversations">
      <div className="chat-rail-header">
        <div className="chat-rail-title">Chats</div>
        <div className="chat-rail-search">
          <Search size={14} aria-hidden="true" className="chat-rail-search-icon" />
          {/* Visual-only filter — wiring it would require a controlled
              search state we'd thread through to the host. The rail
              search is part of the visual spec; behaviour is the
              consuming app's responsibility. */}
          <input
            type="text"
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="chat-rail-search-input"
          />
        </div>
      </div>

      {conversations.length === 0 ? (
        <EmptyConversationList />
      ) : (
        <ListBox
          aria-label="Conversations"
          selectionMode="single"
          selectedKeys={selectedId ? [selectedId] : []}
          onSelectionChange={(keys) => {
            // RAC fires Set<Key> for multiple, "all" for select-all. With
            // selectionMode="single" we get a single-element Set.
            if (keys === "all") return;
            const next = keys.values().next().value;
            if (typeof next === "string") onSelect(next);
          }}
          className="chat-rail-list"
        >
          {conversations.map((c) => (
            <ListBoxItem
              key={c.id}
              id={c.id}
              textValue={c.name}
              className="chat-rail-row"
            >
              <ConversationRow conversation={c} />
            </ListBoxItem>
          ))}
        </ListBox>
      )}
    </aside>
  );
}

function ConversationRow({ conversation: c }: { conversation: Conversation }) {
  return (
    <>
      <div className="chat-rail-row-avatar">
        <Avatar initials={c.initials} size={40} />
        {!c.isGroup && c.presence !== "offline" && (
          <span
            aria-hidden="true"
            className={`chat-presence-dot chat-presence-${c.presence}`}
          />
        )}
      </div>
      <div className="chat-rail-row-body">
        <div className="chat-rail-row-line1">
          <span className="chat-rail-row-name">{c.name}</span>
          <span className="chat-rail-row-time">{c.lastMessageTime}</span>
        </div>
        <div className="chat-rail-row-line2">
          <span className="chat-rail-row-preview">
            {c.lastMessageFromMe ? "" : ""}
            {c.lastMessagePreview}
          </span>
          {c.muted && (
            <BellOff
              size={12}
              aria-label="Muted"
              className="chat-rail-row-mute"
            />
          )}
          {c.unread > 0 && (
            <span
              className="chat-rail-row-badge"
              aria-label={`${c.unread} unread message${c.unread === 1 ? "" : "s"}`}
            >
              {c.unread > 99 ? "99+" : c.unread}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function EmptyConversationList() {
  return (
    <div className="chat-empty-state" role="status">
      <div className="chat-empty-state-icon" aria-hidden="true">
        <MessageSquare size={28} />
      </div>
      <div className="chat-empty-state-title">No conversations yet</div>
      <div className="chat-empty-state-desc">
        Start a new chat to see it here.
      </div>
    </div>
  );
}

/* ─── Chat header ─── */

function ChatHeader({
  conversation: c,
  isTyping,
}: {
  conversation: Conversation;
  isTyping: boolean;
}) {
  const subtitle = isTyping
    ? "typing…"
    : c.isGroup
      ? "Group conversation"
      : c.presence === "online"
        ? "Online"
        : c.presence === "away"
          ? "Away"
          : "Offline";

  return (
    <header className="chat-header">
      <div className="chat-header-identity">
        <div className="chat-rail-row-avatar">
          {c.isGroup ? (
            <div
              aria-hidden="true"
              className="chat-header-group-avatar"
            >
              <Users size={18} />
            </div>
          ) : (
            <Avatar initials={c.initials} size={36} />
          )}
          {!c.isGroup && c.presence !== "offline" && (
            <span
              aria-hidden="true"
              className={`chat-presence-dot chat-presence-${c.presence}`}
            />
          )}
        </div>
        <div className="chat-header-text">
          <div className="chat-header-name">{c.name}</div>
          <div
            className={`chat-header-subtitle${isTyping ? " chat-header-subtitle-typing" : ""}`}
          >
            {subtitle}
          </div>
        </div>
      </div>
      <div className="chat-header-actions">
        <Button
          aria-label="Start voice call"
          className="chat-icon-btn"
        >
          <Phone size={16} aria-hidden="true" />
        </Button>
        <Button
          aria-label="Start video call"
          className="chat-icon-btn"
        >
          <Video size={16} aria-hidden="true" />
        </Button>
        <Button
          aria-label={c.isGroup ? "Show group details" : "Show contact details"}
          className="chat-icon-btn"
        >
          {c.isGroup ? (
            <Users size={16} aria-hidden="true" />
          ) : (
            <Info size={16} aria-hidden="true" />
          )}
        </Button>
        <Button aria-label="More options" className="chat-icon-btn">
          <MoreHorizontal size={16} aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}

/* ─── Message stream ─── */

function MessageStream({
  messages,
  showTyping,
}: {
  messages: Message[];
  showTyping: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change. Auto-scrolling is the
    // expected behaviour for a chat surface; if a future iteration adds
    // "you've scrolled up" detection, this becomes conditional.
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
        className="chat-stream chat-stream-empty"
      >
        <div className="chat-empty-state" role="status">
          <div className="chat-empty-state-icon" aria-hidden="true">
            <MessageSquare size={28} />
          </div>
          <div className="chat-empty-state-title">No messages yet</div>
          <div className="chat-empty-state-desc">
            Send a message to start the conversation.
          </div>
        </div>
      </div>
    );
  }

  // Track the index of the last own-sent message so we can show its
  // delivery status only there (matches Phoenix / iMessage).
  let lastOwnIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].from === "me" && !messages[i].systemEvent) {
      lastOwnIdx = i;
      break;
    }
  }

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversation messages"
      className="chat-stream"
    >
      {messages.map((m, i) => {
        const prev = i > 0 ? messages[i - 1] : null;
        const showDivider = needsDayDivider(prev, m);
        return (
          <div key={m.id} className="chat-stream-cell">
            {showDivider && <DayDivider timestamp={m.timestamp} />}
            {m.systemEvent ? (
              <SystemMessage text={m.text} />
            ) : (
              <MessageBubble
                message={m}
                showStatus={i === lastOwnIdx}
              />
            )}
          </div>
        );
      })}
      {showTyping && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}

function needsDayDivider(prev: Message | null, current: Message): boolean {
  if (!prev) return true;
  const a = new Date(prev.timestamp);
  const b = new Date(current.timestamp);
  return (
    a.getUTCFullYear() !== b.getUTCFullYear() ||
    a.getUTCMonth() !== b.getUTCMonth() ||
    a.getUTCDate() !== b.getUTCDate()
  );
}

function DayDivider({ timestamp }: { timestamp: string }) {
  const label = useMemo(() => formatDayLabel(timestamp), [timestamp]);
  return (
    <div
      role="separator"
      aria-label={label}
      className="chat-day-divider"
    >
      <span className="chat-day-divider-line" aria-hidden="true" />
      <span className="chat-day-divider-label">{label}</span>
      <span className="chat-day-divider-line" aria-hidden="true" />
    </div>
  );
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(d);
}

function formatClockTime(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function SystemMessage({ text }: { text: string }) {
  return (
    <div className="chat-system-msg" role="note">
      {text}
    </div>
  );
}

function MessageBubble({
  message: m,
  showStatus,
}: {
  message: Message;
  showStatus: boolean;
}) {
  const isOwn = m.from === "me";
  const time = formatClockTime(m.timestamp);
  return (
    <div className={`chat-msg-row${isOwn ? " is-own" : ""}`}>
      <div className={`chat-msg-bubble${isOwn ? " is-own" : ""}`}>
        {m.text}
      </div>
      <div className="chat-msg-meta">
        <span className="chat-msg-time">{time}</span>
        {isOwn && showStatus && m.status && (
          <span
            className="chat-msg-status"
            aria-label={statusLabel(m.status)}
          >
            {m.status === "read" ? (
              <CheckCheck size={12} aria-hidden="true" className="chat-msg-status-read" />
            ) : m.status === "delivered" ? (
              <CheckCheck size={12} aria-hidden="true" />
            ) : (
              <Check size={12} aria-hidden="true" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}

function statusLabel(status: NonNullable<Message["status"]>): string {
  return status === "read"
    ? "Read"
    : status === "delivered"
      ? "Delivered"
      : "Sent";
}

function TypingIndicator() {
  return (
    <div className="chat-msg-row" aria-label="Other person is typing">
      <div className="chat-typing-bubble" aria-hidden="true">
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot" />
      </div>
    </div>
  );
}

/* ─── Composer ─── */

function Composer({
  draft,
  onDraftChange,
  recipientName,
}: {
  draft: string;
  onDraftChange: (next: string) => void;
  recipientName: string;
}) {
  const canSend = draft.trim().length > 0;
  const handleSend = () => {
    if (!canSend) return;
    onDraftChange("");
  };

  return (
    <div className="chat-composer">
      <Button aria-label="Attach file" className="chat-icon-btn chat-composer-icon">
        <Paperclip size={16} aria-hidden="true" />
      </Button>
      <TextField
        aria-label={`Message ${recipientName}`}
        value={draft}
        onChange={onDraftChange}
        className="chat-composer-field"
      >
        <Label className="sr-only">Message {recipientName}</Label>
        <TextArea
          placeholder={`Message ${recipientName}`}
          rows={1}
          className="chat-composer-textarea"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
      </TextField>
      <Button
        aria-label="Add emoji"
        className="chat-icon-btn chat-composer-icon"
      >
        <Smile size={16} aria-hidden="true" />
      </Button>
      <Button
        aria-label="Send message"
        isDisabled={!canSend}
        onPress={handleSend}
        className={`chat-composer-send${canSend ? " is-active" : ""}`}
      >
        <Send size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}

/* ─── Empty placeholder when no conversation is selected ─── */

function NoSelectionPlaceholder({ hasConversations }: { hasConversations: boolean }) {
  return (
    <div className="chat-no-selection" role="status">
      <div className="chat-empty-state-icon" aria-hidden="true">
        <MessageSquare size={32} />
      </div>
      <div className="chat-empty-state-title">
        {hasConversations
          ? "Pick a conversation to start chatting"
          : "Start a conversation"}
      </div>
      <div className="chat-empty-state-desc">
        {hasConversations
          ? "Your messages will appear here once you select a chat from the list."
          : "Once you have conversations, they'll show up in the list on the left."}
      </div>
    </div>
  );
}

/* ─── Pattern-scoped CSS ─── */
/* Co-located with the component so consumers get one import. Uses only
   @vsee/ui tokens — no Phoenix-only ones. Class names are namespaced
   with `chat-` to avoid collisions with the docs site shell. */

function ChatPatternStyles() {
  return (
    <style>{CHAT_PATTERN_CSS}</style>
  );
}

const CHAT_PATTERN_CSS = `
.chat-pattern {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: clamp(560px, 70vh, 760px);
  background: var(--vsee-white);
  border: 1px solid var(--vsee-border);
  border-radius: var(--vsee-r-xl);
  overflow: hidden;
  font-family: var(--vsee-font-sans);
  color: var(--vsee-text-primary);
}

@media (max-width: 720px) {
  .chat-pattern { grid-template-columns: 1fr; }
  .chat-pattern .chat-rail { display: none; }
}

/* Rail */
.chat-rail {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--vsee-border);
  background: var(--vsee-grey-100);
  min-width: 0;
}
.chat-rail-header {
  padding: var(--vsee-sp-4);
  border-bottom: 1px solid var(--vsee-border);
  display: flex;
  flex-direction: column;
  gap: var(--vsee-sp-3);
  background: var(--vsee-white);
}
.chat-rail-title {
  font-size: var(--vsee-text-h4-size);
  font-weight: 700;
  color: var(--vsee-text-primary);
  letter-spacing: -0.2px;
}
.chat-rail-search {
  position: relative;
  display: flex;
  align-items: center;
}
.chat-rail-search-icon {
  position: absolute;
  left: var(--vsee-sp-3);
  color: var(--vsee-text-secondary);
  pointer-events: none;
}
.chat-rail-search-input {
  width: 100%;
  height: 34px;
  padding: 0 var(--vsee-sp-3) 0 var(--vsee-sp-8);
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-caption-size);
  color: var(--vsee-text-primary);
  background: var(--vsee-white);
  border: 1px solid var(--vsee-border-strong);
  border-radius: var(--vsee-r-md);
  outline: none;
  transition: border-color var(--vsee-t-fast), box-shadow var(--vsee-t-fast);
}
.chat-rail-search-input::placeholder { color: var(--vsee-text-secondary); }
.chat-rail-search-input:focus { border-color: var(--vsee-brand); box-shadow: var(--vsee-shadow-focus); }

.chat-rail-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--vsee-sp-1) 0;
  outline: none;
  list-style: none;
  margin: 0;
}
.chat-rail-row {
  display: flex;
  align-items: center;
  gap: var(--vsee-sp-3);
  padding: var(--vsee-sp-3) var(--vsee-sp-4);
  border-inline-start: 3px solid transparent;
  cursor: pointer;
  outline: none;
  transition: background var(--vsee-t-fast);
  min-height: 44px; /* WCAG 2.5.8 — primary touch target */
}
.chat-rail-row[data-hovered] { background-image: var(--vsee-hover-overlay); }
.chat-rail-row[data-focus-visible] {
  box-shadow: inset 0 0 0 2px var(--vsee-brand);
}
.chat-rail-row[data-selected] {
  background: var(--vsee-brand-light);
  border-inline-start-color: var(--vsee-brand);
}
.chat-rail-row[data-selected] .chat-rail-row-name { color: var(--vsee-brand-dark); }

.chat-rail-row-avatar {
  position: relative;
  flex-shrink: 0;
}
.chat-presence-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: var(--vsee-r-full);
  border: 2px solid var(--vsee-grey-100);
  background: var(--vsee-grey-700);
}
.chat-presence-online { background: var(--vsee-success); }
.chat-presence-away { background: var(--vsee-warning); }
.chat-presence-offline { background: var(--vsee-grey-700); }

.chat-rail-row-body {
  flex: 1;
  min-width: 0;
}
.chat-rail-row-line1 {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--vsee-sp-2);
  margin-bottom: 2px;
}
.chat-rail-row-name {
  font-weight: 600;
  font-size: var(--vsee-text-body-size);
  color: var(--vsee-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.chat-rail-row-time {
  font-size: var(--vsee-text-overline-size);
  color: var(--vsee-text-secondary);
  flex-shrink: 0;
}
.chat-rail-row-line2 {
  display: flex;
  align-items: center;
  gap: var(--vsee-sp-2);
}
.chat-rail-row-preview {
  flex: 1;
  font-size: var(--vsee-text-caption-size);
  color: var(--vsee-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.chat-rail-row-mute {
  color: var(--vsee-text-secondary);
  flex-shrink: 0;
}
.chat-rail-row-badge {
  flex-shrink: 0;
  background: var(--vsee-brand);
  color: #FFFFFF;
  font-size: var(--vsee-text-overline-size);
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: var(--vsee-r-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Main column */
.chat-pattern-main {
  display: flex;
  flex-direction: column;
  background: var(--vsee-white);
  min-width: 0;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vsee-sp-3);
  padding: var(--vsee-sp-3) var(--vsee-sp-5);
  border-bottom: 1px solid var(--vsee-border);
  flex-shrink: 0;
}
.chat-header-identity {
  display: flex;
  align-items: center;
  gap: var(--vsee-sp-3);
  min-width: 0;
  flex: 1;
}
.chat-header-group-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--vsee-r-full);
  background: var(--vsee-brand-light);
  color: var(--vsee-brand-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chat-header-text { min-width: 0; }
.chat-header-name {
  font-weight: 700;
  font-size: var(--vsee-text-h5-size);
  color: var(--vsee-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chat-header-subtitle {
  font-size: var(--vsee-text-overline-size);
  color: var(--vsee-text-secondary);
  margin-top: 2px;
}
.chat-header-subtitle-typing { color: var(--vsee-brand); font-weight: 600; }
.chat-header-actions {
  display: flex;
  gap: var(--vsee-sp-2);
  flex-shrink: 0;
}

/* Icon buttons (header + composer trailing icons) — use design-system btn
   focus + hover semantics but a smaller circular footprint. 32px square
   meets 24×24 minimum target with comfortable margin. */
.chat-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--vsee-r-md);
  border: none;
  background: transparent;
  color: var(--vsee-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: background var(--vsee-t-fast), color var(--vsee-t-fast);
  flex-shrink: 0;
}
.chat-icon-btn[data-hovered] {
  background-image: var(--vsee-hover-overlay);
  color: var(--vsee-text-primary);
}
.chat-icon-btn[data-focus-visible] {
  box-shadow: var(--vsee-shadow-focus);
  outline: 2px solid var(--vsee-brand);
  outline-offset: 1px;
}

/* Stream */
.chat-stream {
  flex: 1;
  overflow-y: auto;
  padding: var(--vsee-sp-4) var(--vsee-sp-5);
  display: flex;
  flex-direction: column;
}
.chat-stream-empty {
  align-items: center;
  justify-content: center;
}
.chat-stream-cell { display: contents; }

.chat-day-divider {
  display: flex;
  align-items: center;
  gap: var(--vsee-sp-3);
  margin: var(--vsee-sp-4) 0 var(--vsee-sp-2);
}
.chat-day-divider-line {
  flex: 1;
  height: 1px;
  background: var(--vsee-border);
}
.chat-day-divider-label {
  font-size: var(--vsee-text-overline-size);
  font-weight: 600;
  color: var(--vsee-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chat-system-msg {
  align-self: center;
  font-size: var(--vsee-text-overline-size);
  color: var(--vsee-text-secondary);
  font-style: italic;
  padding: var(--vsee-sp-1) var(--vsee-sp-3);
  margin: var(--vsee-sp-1) 0;
  text-align: center;
  max-width: 80%;
}

/* Bubble rows */
.chat-msg-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: var(--vsee-sp-2);
  max-width: 75%;
}
.chat-msg-row.is-own {
  align-self: flex-end;
  align-items: flex-end;
}
.chat-msg-bubble {
  padding: var(--vsee-sp-3) var(--vsee-sp-4);
  background: var(--vsee-grey-300);
  color: var(--vsee-text-primary);
  font-size: var(--vsee-text-body-size);
  line-height: 1.5;
  border-radius: 16px 16px 16px 4px;
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.chat-msg-bubble.is-own {
  background: var(--vsee-brand);
  color: #FFFFFF;
  border-radius: 16px 16px 4px 16px;
}
.chat-msg-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-1);
  margin-top: 4px;
  font-size: var(--vsee-text-overline-size);
  color: var(--vsee-text-secondary);
}
.chat-msg-time { font-size: var(--vsee-text-overline-size); }
.chat-msg-status { display: inline-flex; }
.chat-msg-status-read { color: var(--vsee-brand); }

/* Typing dots — gated by reduced-motion. */
.chat-typing-bubble {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: var(--vsee-sp-3) var(--vsee-sp-4);
  background: var(--vsee-grey-300);
  border-radius: 16px 16px 16px 4px;
}
.chat-typing-dot {
  width: 6px; height: 6px;
  background: var(--vsee-text-secondary);
  border-radius: var(--vsee-r-full);
  animation: chat-typing-bounce 1.2s infinite;
}
.chat-typing-dot:nth-child(2) { animation-delay: 0.2s; }
.chat-typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes chat-typing-bounce {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}
@media (prefers-reduced-motion: reduce) {
  .chat-typing-dot { animation: none; opacity: 0.7; }
}

/* Composer */
.chat-composer {
  display: flex;
  align-items: flex-end;
  gap: var(--vsee-sp-2);
  padding: var(--vsee-sp-3) var(--vsee-sp-4);
  border-top: 1px solid var(--vsee-border);
  background: var(--vsee-white);
  flex-shrink: 0;
}
.chat-composer-icon {
  margin-bottom: 4px; /* align with textarea baseline */
}
.chat-composer-field { flex: 1; min-width: 0; display: flex; }
.chat-composer-textarea {
  width: 100%;
  resize: none;
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-body-size);
  line-height: 1.5;
  color: var(--vsee-text-primary);
  background: var(--vsee-grey-200);
  border: 1px solid transparent;
  border-radius: var(--vsee-r-lg);
  padding: var(--vsee-sp-2) var(--vsee-sp-3);
  min-height: 38px;
  max-height: 160px;
  outline: none;
  transition: border-color var(--vsee-t-fast), box-shadow var(--vsee-t-fast);
}
.chat-composer-textarea::placeholder { color: var(--vsee-text-secondary); }
.chat-composer-textarea:focus,
.chat-composer-textarea[data-focused] {
  border-color: var(--vsee-brand);
  box-shadow: var(--vsee-shadow-focus);
  background: var(--vsee-white);
}
.chat-composer-send {
  width: 38px;
  height: 38px;
  border-radius: var(--vsee-r-full);
  border: none;
  background: var(--vsee-grey-400);
  color: var(--vsee-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: background var(--vsee-t-fast), color var(--vsee-t-fast);
  flex-shrink: 0;
}
.chat-composer-send.is-active {
  background: var(--vsee-brand);
  color: #FFFFFF;
}
.chat-composer-send.is-active[data-hovered] {
  background-image: var(--vsee-hover-overlay);
}
.chat-composer-send[data-disabled] { cursor: not-allowed; }
.chat-composer-send[data-focus-visible] {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
  box-shadow: var(--vsee-shadow-focus);
}

/* Empty / no-selection placeholders */
.chat-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--vsee-sp-2);
  padding: var(--vsee-sp-8) var(--vsee-sp-4);
  text-align: center;
}
.chat-empty-state-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--vsee-r-full);
  background: var(--vsee-brand-light);
  color: var(--vsee-brand-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--vsee-sp-2);
}
.chat-empty-state-title {
  font-size: var(--vsee-text-h5-size);
  font-weight: 600;
  color: var(--vsee-text-primary);
}
.chat-empty-state-desc {
  font-size: var(--vsee-text-caption-size);
  color: var(--vsee-text-secondary);
  max-width: 280px;
  line-height: 1.5;
}
.chat-no-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--vsee-sp-8);
  gap: var(--vsee-sp-2);
}
.chat-no-selection .chat-empty-state-title {
  font-size: var(--vsee-text-subtitle-size);
}

/* sr-only — ensures visually-hidden labels still expose to AT. */
.chat-pattern .sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
`;
