/**
 * DebugControls — the kitchen-sink toolbar.
 *
 * Pattern picker (RAC <Select>) → record-state radio (RAC <RadioGroup>)
 * → per-pattern flag toggles (RAC <Switch>) → optional trailing slot for
 * host-supplied actions (e.g. "Open in full screen", "Back to docs").
 *
 * Reusable: any future host that wants to toggle between "0 / 1 / many"
 * record states + a pattern from a registry can drop this in. Flags +
 * trailing slot are both optional, so the simplest call site stays
 * three props long.
 */
import type { ReactNode } from "react";
import {
  Select,
  SelectValue,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  RadioGroup,
  Radio,
  Switch,
  Label,
} from "react-aria-components";
import { ChevronDown } from "lucide-react";
import {
  RECORD_STATES,
  RECORD_STATE_LABELS,
  type AnyPattern,
  type FlagValues,
  type PatternFlag,
  type RecordState,
} from "./types";

export interface DebugControlsProps {
  patterns: AnyPattern[];
  selectedPatternId: string;
  onSelectPattern: (id: string) => void;
  recordState: RecordState;
  onChangeRecordState: (state: RecordState) => void;
  /** Per-pattern flags published by the active pattern. */
  flags?: PatternFlag[];
  /** Current flag values, keyed by `PatternFlag.id`. */
  flagValues?: FlagValues;
  /** Called when a flag toggle flips. */
  onChangeFlag?: (id: string, value: boolean) => void;
  /** Optional trailing slot — host-supplied actions on the right edge. */
  trailing?: ReactNode;
}

export function DebugControls({
  patterns,
  selectedPatternId,
  onSelectPattern,
  recordState,
  onChangeRecordState,
  flags,
  flagValues,
  onChangeFlag,
  trailing,
}: DebugControlsProps) {
  const hasFlags = !!flags && flags.length > 0 && !!onChangeFlag;
  return (
    <div className="ks-toolbar" role="toolbar" aria-label="Pattern controls">
      <div className="ks-toolbar-group">
        <Select
          aria-label="Pattern"
          selectedKey={selectedPatternId}
          onSelectionChange={(key) => {
            if (typeof key === "string") onSelectPattern(key);
          }}
        >
          <Label className="ks-toolbar-label">Pattern</Label>
          <Button className="ks-toolbar-select-trigger">
            <SelectValue />
            <ChevronDown size={14} aria-hidden="true" />
          </Button>
          <Popover className="ks-toolbar-popover">
            <ListBox className="ks-toolbar-listbox">
              {patterns.map((p) => (
                <ListBoxItem
                  key={p.id}
                  id={p.id}
                  textValue={p.label}
                  className="ks-toolbar-option"
                >
                  {p.label}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
      </div>

      <div className="ks-toolbar-group">
        <RadioGroup
          aria-label="Record state"
          value={recordState}
          onChange={(v) => onChangeRecordState(v as RecordState)}
          className="ks-radio-group"
        >
          <Label className="ks-toolbar-label">Records</Label>
          <div className="ks-radio-pills">
            {RECORD_STATES.map((state) => (
              <Radio key={state} value={state} className="ks-radio-pill">
                {RECORD_STATE_LABELS[state]}
              </Radio>
            ))}
          </div>
        </RadioGroup>
      </div>

      {hasFlags && (
        <div className="ks-toolbar-group ks-toolbar-flags">
          <span className="ks-toolbar-label" aria-hidden="true">Flags</span>
          <div className="ks-flag-list" role="group" aria-label="Pattern flags">
            {flags!.map((f) => {
              const checked = flagValues?.[f.id] ?? f.default;
              return (
                <Switch
                  key={f.id}
                  isSelected={checked}
                  onChange={(v) => onChangeFlag!(f.id, v)}
                  className="ks-flag-switch"
                >
                  <span className="ks-flag-track" aria-hidden="true">
                    <span className="ks-flag-thumb" />
                  </span>
                  <span className="ks-flag-label" title={f.description}>
                    {f.label}
                  </span>
                </Switch>
              );
            })}
          </div>
        </div>
      )}

      {trailing && <div className="ks-toolbar-trailing">{trailing}</div>}

      <ToolbarStyles />
    </div>
  );
}

function ToolbarStyles() {
  return <style>{TOOLBAR_CSS}</style>;
}

const TOOLBAR_CSS = `
.ks-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--vsee-sp-6);
  padding: var(--vsee-sp-3) var(--vsee-sp-4);
  background: var(--vsee-grey-100);
  border: 1px solid var(--vsee-border);
  border-radius: var(--vsee-r-lg);
  margin-bottom: var(--vsee-sp-6);
  font-family: var(--vsee-font-sans);
}
.ks-toolbar-group {
  display: flex;
  align-items: center;
  gap: var(--vsee-sp-2);
  min-width: 0;
}
.ks-toolbar-label {
  font-size: var(--vsee-text-overline-size);
  font-weight: 700;
  color: var(--vsee-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: var(--vsee-sp-1);
}
.ks-toolbar-select-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
  height: 34px;
  padding: 0 var(--vsee-sp-3);
  background: var(--vsee-white);
  color: var(--vsee-text-primary);
  border: 1px solid var(--vsee-border-strong);
  border-radius: var(--vsee-r-md);
  cursor: pointer;
  outline: none;
  font-family: var(--vsee-font-sans);
  font-size: var(--vsee-text-body-size);
  font-weight: 500;
  min-width: 160px;
  transition: border-color var(--vsee-t-fast), box-shadow var(--vsee-t-fast);
}
.ks-toolbar-select-trigger[data-hovered] { border-color: var(--vsee-grey-500); }
.ks-toolbar-select-trigger[data-focus-visible] {
  border-color: var(--vsee-brand);
  box-shadow: var(--vsee-shadow-focus);
}
.ks-toolbar-popover {
  background: var(--vsee-white);
  border: 1px solid var(--vsee-border);
  border-radius: var(--vsee-r-lg);
  box-shadow: var(--vsee-shadow-lg);
  padding: var(--vsee-sp-1);
  min-width: var(--trigger-width);
  z-index: 50;
  outline: none;
}
.ks-toolbar-listbox { outline: none; padding: 0; }
.ks-toolbar-option {
  font-size: var(--vsee-text-body-size);
  padding: var(--vsee-sp-2) var(--vsee-sp-3);
  border-radius: var(--vsee-r-md);
  cursor: pointer;
  outline: none;
  color: var(--vsee-text-primary);
}
.ks-toolbar-option[data-focused] { background: var(--vsee-brand-light); }
.ks-toolbar-option[data-selected] { background: var(--vsee-brand); color: #FFFFFF; }

/* Radio pills */
.ks-radio-group { display: inline-flex; align-items: center; gap: var(--vsee-sp-2); }
.ks-radio-pills {
  display: inline-flex;
  background: var(--vsee-grey-200);
  border: 1px solid var(--vsee-border-strong);
  border-radius: var(--vsee-r-full);
  padding: 2px;
}
.ks-radio-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 var(--vsee-sp-3);
  font-size: var(--vsee-text-caption-size);
  font-weight: 600;
  color: var(--vsee-text-secondary);
  border-radius: var(--vsee-r-full);
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: background var(--vsee-t-fast), color var(--vsee-t-fast);
}
.ks-radio-pill[data-hovered] { color: var(--vsee-text-primary); }
.ks-radio-pill[data-selected] {
  background: var(--vsee-brand);
  color: #FFFFFF;
}
.ks-radio-pill[data-focus-visible] {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
}

/* Per-pattern flag toggles */
.ks-toolbar-flags { gap: var(--vsee-sp-3); }
.ks-flag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--vsee-sp-3);
  align-items: center;
}
.ks-flag-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
  cursor: pointer;
  outline: none;
  user-select: none;
  /* Target size: track 32×18 + label — full hit zone on the row >= 24px tall. */
  min-height: 24px;
}
.ks-flag-track {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  background: var(--vsee-grey-500);
  border-radius: var(--vsee-r-full);
  transition: background var(--vsee-t-fast);
  flex-shrink: 0;
}
.ks-flag-thumb {
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  width: 14px;
  height: 14px;
  background: var(--vsee-white);
  border-radius: var(--vsee-r-full);
  box-shadow: var(--vsee-shadow-sm);
  transition: inset-inline-start var(--vsee-t-fast);
}
.ks-flag-switch[data-selected] .ks-flag-track { background: var(--vsee-brand); }
.ks-flag-switch[data-selected] .ks-flag-thumb { inset-inline-start: 16px; }
.ks-flag-switch[data-focus-visible] .ks-flag-track {
  outline: 2px solid var(--vsee-brand);
  outline-offset: 2px;
}
.ks-flag-label {
  font-size: var(--vsee-text-caption-size);
  font-weight: 500;
  color: var(--vsee-text-primary);
  white-space: nowrap;
}

/* Trailing slot — host-supplied actions (e.g. full-screen / back-to-docs) */
.ks-toolbar-trailing {
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--vsee-sp-2);
}

@media (prefers-reduced-motion: reduce) {
  .ks-flag-track,
  .ks-flag-thumb { transition: none; }
}
`;
