/**
 * DebugControls — the kitchen-sink toolbar.
 *
 * Pattern picker (RAC <Select>) on the left, record-state radio (RAC
 * <RadioGroup>) on the right. Reusable: any future host that wants to
 * toggle between "0 / 1 / many" record states + a pattern from a
 * registry can drop this in.
 */
import {
  Select,
  SelectValue,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  RadioGroup,
  Radio,
  Label,
} from "react-aria-components";
import { ChevronDown } from "lucide-react";
import {
  RECORD_STATES,
  RECORD_STATE_LABELS,
  type AnyPattern,
  type RecordState,
} from "./types";

export interface DebugControlsProps {
  patterns: AnyPattern[];
  selectedPatternId: string;
  onSelectPattern: (id: string) => void;
  recordState: RecordState;
  onChangeRecordState: (state: RecordState) => void;
}

export function DebugControls({
  patterns,
  selectedPatternId,
  onSelectPattern,
  recordState,
  onChangeRecordState,
}: DebugControlsProps) {
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
`;
