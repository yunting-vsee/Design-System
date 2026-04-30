/**
 * Avatar — initials-on-tinted-circle.
 *
 * Deterministic per-name palette so the same person looks the same across
 * the Chat list and the Chat header. Lives under `chat/components/` for
 * now; promote to `apps/docs/src/patterns/components/` (or eventually
 * `@vsee/ui`) once a second pattern needs it.
 *
 * Accessibility: this is a presentational visual. Callers should NOT pass
 * `aria-label` here; the conversation/message row already provides the
 * accessible name. The component is rendered with `aria-hidden` so screen
 * readers don't double-read the initials after the actual name.
 */

const PALETTE = [
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#F43F5E", // rose
  "#F97316", // orange
  "#0891B2", // cyan
  "#0D875C", // brand green
  "#3B82F6", // blue
];

function colorFor(seed: string): string {
  const key = (seed || "X").charCodeAt(0);
  return PALETTE[key % PALETTE.length];
}

export interface AvatarProps {
  /** 1-3 character initials. */
  initials: string;
  /** Pixel size. Default 40. */
  size?: number;
  /** Override the deterministic background. */
  background?: string;
}

export function Avatar({ initials, size = 40, background }: AvatarProps) {
  const bg = background ?? colorFor(initials);
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: bg,
        color: "#FFFFFF",
        borderRadius: "var(--vsee-r-full)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: Math.round(size * 0.36),
        letterSpacing: "0.5px",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {initials}
    </div>
  );
}
