import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Input,
  Label,
  TextArea,
  Checkbox,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Form,
  Group,
  Select,
  SelectValue,
  ListBox,
  ListBoxItem,
  Popover,
  RadioGroup,
  Radio,
  SearchField,
  Breadcrumbs,
  Breadcrumb,
  Link,
  TooltipTrigger,
  Tooltip as AriaTooltip,
} from "react-aria-components";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  FileText,
  Palette,
  LayoutGrid,
  Layers,
  Settings,
} from "lucide-react";
import "./App.css";

/* ─── Copy-to-clipboard helper ─── */
function useCopyToast() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setText(val);
    setShow(true);
    setTimeout(() => setShow(false), 1500);
  };
  return { show, text, copy };
}

/* ─── Sidebar Navigation ─── */
const NAV = [
  {
    group: "Foundations",
    icon: <Palette size={14} />,
    items: [
      { label: "Colors", id: "colors" },
      { label: "Typography", id: "typography" },
      { label: "Spacing & Layout", id: "spacing" },
    ],
  },
  {
    group: "Components",
    icon: <LayoutGrid size={14} />,
    items: [
      { label: "Buttons", id: "buttons" },
      { label: "Form Elements", id: "forms" },
      { label: "Badges & Status", id: "badges" },
      { label: "Feedback", id: "feedback" },
      { label: "Navigation", id: "navigation" },
      { label: "Data Display", id: "data" },
      { label: "Overlays", id: "overlay" },
    ],
  },
  {
    group: "Patterns",
    icon: <Layers size={14} />,
    items: [
      { label: "EMR Patterns", id: "emr" },
      { label: "Layouts", id: "layouts" },
      { label: "White-Label", id: "theming" },
      { label: "Form.io Integration", id: "formio" },
    ],
  },
  {
    group: "Engineering",
    icon: <Settings size={14} />,
    items: [{ label: "Design Tokens", id: "tokens" }],
  },
];

function App() {
  const [activeSection, setActiveSection] = useState("colors");
  const toast = useCopyToast();

  /* scroll-based active nav tracking */
  useEffect(() => {
    const ids = NAV.flatMap((g) => g.items.map((i) => i.id));
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ds-root">
      {/* Sidebar */}
      <aside className="ds-nav">
        <div className="ds-nav-logo">
          VSee
          <span className="ds-nav-version">Design System v4.0</span>
        </div>
        <nav className="ds-nav-groups">
          {NAV.map((section) => (
            <div key={section.group} className="ds-nav-group">
              <div className="ds-nav-group-title">
                {section.icon}
                {section.group}
              </div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`ds-nav-link ${activeSection === item.id ? "active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="ds-main">
        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">React Aria + Tailwind — 2026</div>
          <h1>VSee Clinic<br />Design System</h1>
          <p>The single source of truth for design and engineering. Modern, accessible, and built for telehealth at scale.</p>
          <div className="hero-stats">
            <div><div className="hero-stat-val">60+</div><div className="hero-stat-label">Design Tokens</div></div>
            <div><div className="hero-stat-val">25+</div><div className="hero-stat-label">Components</div></div>
            <div><div className="hero-stat-val">AA</div><div className="hero-stat-label">WCAG Compliant</div></div>
            <div><div className="hero-stat-val">4px</div><div className="hero-stat-label">Base Grid</div></div>
          </div>
        </div>

        <FoundationsColors copy={toast.copy} />
        <FoundationsTypography />
        <FoundationsSpacing />
        <ComponentsButtons />
        <ComponentsForms />
        <ComponentsBadges />
        <ComponentsFeedback />
        <ComponentsNavigation />
        <ComponentsDataDisplay />
        <ComponentsOverlays />
        <PatternsEMR />
        <PatternsLayouts />
        <PatternsTheming />
        <PatternsFormio />
        <EngineeringTokens />

        {/* Footer */}
        <div className="ds-footer">
          <div className="ds-footer-logo">VSee</div>
          <div className="ds-footer-sub">Design System v4.0 · 2026</div>
          <div className="ds-footer-meta">Legend · 4px grid · WCAG AA · White-label ready</div>
        </div>
      </div>

      {/* Copy toast */}
      <div className={`copy-toast ${toast.show ? "show" : ""}`}>Copied {toast.text}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION WRAPPERS
   ═══════════════════════════════════════════ */
function Section({ id, label, title, description, children }: {
  id: string; label: string; title: string; description: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section id={id} className="ds-section">
      <div className="section-label">{label}</div>
      <div className="section-title">{title}</div>
      <div className="section-desc">{description}</div>
      {children}
    </section>
  );
}

function SubSection({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="subsection">
      <div className="sub-title">{title}</div>
      {description && <div className="sub-desc">{description}</div>}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOUNDATIONS — COLORS
   ═══════════════════════════════════════════ */
function Swatch({ color, name, hex, token, large, onClick }: {
  color: string; name: string; hex: string; token?: string; large?: boolean; onClick: () => void;
}) {
  return (
    <div className={`swatch ${large ? "swatch-large" : ""}`} onClick={onClick}>
      <div className="swatch-color" style={{ background: color }} />
      <div className="swatch-info">
        <div className="swatch-name">{name}</div>
        <div className="swatch-hex">{hex}</div>
        {token && <div className="swatch-token">{token}</div>}
      </div>
    </div>
  );
}

function FoundationsColors({ copy }: { copy: (v: string) => void }) {
  return (
    <Section id="colors" label="Foundation" title="Colors"
      description="A refined, accessible palette built on VSee's brand green. Every color has been tested for WCAG AA contrast compliance.">

      <SubSection title="Brand" description="The primary brand scale — from light tints to deep active states.">
        <div className="swatch-row">
          <Swatch large color="#F0FAF5" name="Brand 50" hex="#F0FAF5" token="--brand-50" onClick={() => copy("#F0FAF5")} />
          <Swatch large color="#E6F5EE" name="Brand Light" hex="#E6F5EE" token="--brand-light" onClick={() => copy("#E6F5EE")} />
          <Swatch large color="#0D875C" name="Brand" hex="#0D875C" token="--brand" onClick={() => copy("#0D875C")} />
          <Swatch large color="#0B7550" name="Hover" hex="#0B7550" token="--brand-hover" onClick={() => copy("#0B7550")} />
          <Swatch large color="#096843" name="Active" hex="#096843" token="--brand-active" onClick={() => copy("#096843")} />
        </div>
      </SubSection>

      <SubSection title="Semantic" description="Communicating meaning — success, information, warning, and danger states.">
        <div className="swatch-row">
          <Swatch color="#0D875C" name="Success" hex="#0D875C" onClick={() => copy("#0D875C")} />
          <Swatch color="#0575AD" name="Info" hex="#0575AD" onClick={() => copy("#0575AD")} />
          <Swatch color="#D97706" name="Warning" hex="#D97706" onClick={() => copy("#D97706")} />
          <Swatch color="#DC2626" name="Danger" hex="#DC2626" onClick={() => copy("#DC2626")} />
        </div>
        <div className="swatch-row">
          <Swatch color="#E6F5EE" name="Success Light" hex="#E6F5EE" onClick={() => copy("#E6F5EE")} />
          <Swatch color="#E0F2FE" name="Info Light" hex="#E0F2FE" onClick={() => copy("#E0F2FE")} />
          <Swatch color="#FEF3C7" name="Warning Light" hex="#FEF3C7" onClick={() => copy("#FEF3C7")} />
          <Swatch color="#FEE2E2" name="Danger Light" hex="#FEE2E2" onClick={() => copy("#FEE2E2")} />
        </div>
      </SubSection>

      <SubSection title="Neutrals">
        <div className="swatch-row">
          <Swatch color="#111827" name="Black" hex="#111827" onClick={() => copy("#111827")} />
          <Swatch color="#1F2937" name="900" hex="#1F2937" onClick={() => copy("#1F2937")} />
          <Swatch color="#374151" name="800" hex="#374151" onClick={() => copy("#374151")} />
          <Swatch color="#4B5563" name="700" hex="#4B5563" onClick={() => copy("#4B5563")} />
          <Swatch color="#6B7280" name="600" hex="#6B7280" onClick={() => copy("#6B7280")} />
        </div>
        <div className="swatch-row">
          <Swatch color="#868E9C" name="500" hex="#868E9C" onClick={() => copy("#868E9C")} />
          <Swatch color="#D1D5DB" name="400" hex="#D1D5DB" onClick={() => copy("#D1D5DB")} />
          <Swatch color="#E5E7EB" name="300" hex="#E5E7EB" onClick={() => copy("#E5E7EB")} />
          <Swatch color="#F3F4F6" name="200" hex="#F3F4F6" onClick={() => copy("#F3F4F6")} />
          <Swatch color="#F9FAFB" name="100" hex="#F9FAFB" onClick={() => copy("#F9FAFB")} />
        </div>
      </SubSection>

      <SubSection title="Surfaces & Text">
        <div className="grid g2">
          <div className="card">
            <div className="card-inner-title">Surfaces</div>
            <div className="surface-text-list">
              <div className="st-row"><div className="st-swatch" style={{background:"#FFFFFF",border:"1px solid #E5E7EB"}} /><div><div className="st-name">Page</div><div className="st-val">#FFFFFF</div></div></div>
              <div className="st-row"><div className="st-swatch" style={{background:"#F9FAFB",border:"1px solid #E5E7EB"}} /><div><div className="st-name">Subtle</div><div className="st-val">#F9FAFB</div></div></div>
              <div className="st-row"><div className="st-swatch" style={{background:"#F3F4F6",border:"1px solid #E5E7EB"}} /><div><div className="st-name">Muted</div><div className="st-val">#F3F4F6</div></div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-inner-title">Text Colors</div>
            <div className="surface-text-list">
              <div className="st-row"><div className="st-swatch" style={{background:"#111827"}} /><div><div className="st-name">Primary</div><div className="st-val">#111827 — Headings, body</div></div></div>
              <div className="st-row"><div className="st-swatch" style={{background:"#6B7280"}} /><div><div className="st-name">Secondary</div><div className="st-val">#6B7280 — Descriptions</div></div></div>
              <div className="st-row"><div className="st-swatch" style={{background:"#6F7787"}} /><div><div className="st-name">Tertiary</div><div className="st-val">#6F7787 — Placeholders</div></div></div>
              <div className="st-row"><div className="st-swatch" style={{background:"#0D875C"}} /><div><div className="st-name">Link</div><div className="st-val">#0D875C — Links, brand text</div></div></div>
            </div>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   FOUNDATIONS — TYPOGRAPHY
   ═══════════════════════════════════════════ */
function FoundationsTypography() {
  return (
    <Section id="typography" label="Foundation" title="Typography"
      description="Legend is our system font — clean, legible, and optimized for UI. The type scale uses a harmonious progression from 12px to 60px.">

      <div className="card" style={{marginBottom:"var(--sp-8)"}}>
        {[
          { label: "Display", meta: "60px / 800", style: { fontSize: 60, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05 }, text: "Design for health" },
          { label: "H1", meta: "48px / 800", style: { fontSize: 48, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1 }, text: "Page title" },
          { label: "H2", meta: "36px / 700", style: { fontSize: 36, fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.15 }, text: "Section heading" },
          { label: "H3", meta: "24px / 700", style: { fontSize: 24, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.2 }, text: "Subsection" },
          { label: "H4", meta: "20px / 600", style: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 }, text: "Card title" },
          { label: "H5", meta: "16px / 600", style: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 }, text: "Label heading" },
          { label: "Body LG", meta: "16px / 400", style: { fontSize: 16, lineHeight: 1.6, color: "var(--grey-600)" }, text: "Body text for longer-form content and introductory paragraphs." },
          { label: "Body", meta: "14px / 400", style: { fontSize: 14, lineHeight: 1.5 }, text: "Standard body text used throughout the application." },
          { label: "Caption", meta: "13px / 500", style: { fontSize: 13, fontWeight: 500, color: "var(--grey-600)" }, text: "Helper text, timestamps, and metadata" },
          { label: "Overline", meta: "12px / 700", style: { fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1px", color: "var(--grey-500)" }, text: "Section Label" },
        ].map((t) => (
          <div key={t.label} className="type-row">
            <div className="type-meta">
              <div className="type-meta-label">{t.label}</div>
              <div className="type-meta-value">{t.meta}</div>
            </div>
            <div className="type-preview" style={t.style}>{t.text}</div>
          </div>
        ))}
      </div>

      <SubSection title="Font Weights">
        <div className="preview vertical">
          {[
            { w: 400, label: "Regular 400 — For body text and descriptions" },
            { w: 500, label: "Medium 500 — For captions and secondary emphasis" },
            { w: 600, label: "Semi Bold 600 — For labels and small headings" },
            { w: 700, label: "Bold 700 — For headings and strong emphasis" },
            { w: 800, label: "Extra Bold 800 — For display and page titles" },
          ].map((f) => (
            <div key={f.w} style={{ fontSize: 20, fontWeight: f.w }}>{f.label}</div>
          ))}
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   FOUNDATIONS — SPACING & LAYOUT
   ═══════════════════════════════════════════ */
function FoundationsSpacing() {
  const spaces = [
    { token: "--sp-1", px: 4 }, { token: "--sp-2", px: 8 }, { token: "--sp-3", px: 12 },
    { token: "--sp-4", px: 16 }, { token: "--sp-6", px: 24 }, { token: "--sp-8", px: 32 },
    { token: "--sp-10", px: 40 }, { token: "--sp-12", px: 48 }, { token: "--sp-16", px: 64 },
    { token: "--sp-24", px: 96 },
  ];

  return (
    <Section id="spacing" label="Foundation" title="Spacing & Layout"
      description="A 4px-based spacing scale ensures consistent rhythm across every component and layout.">
      <div className="grid g2" style={{gap:"var(--sp-10)"}}>
        <div>
          <div className="sub-title">Spacing Scale</div>
          {spaces.map((s) => (
            <div key={s.token} className="space-row">
              <div className="space-label">{s.token}</div>
              <div className="space-bar" style={{ width: s.px }} />
              <div className="space-val">{s.px}px</div>
            </div>
          ))}
        </div>
        <div>
          <div className="sub-title">Border Radius</div>
          <div className="radius-row">
            {[
              { label: "sm", val: 6 }, { label: "md", val: 8 }, { label: "lg", val: 12 },
              { label: "xl", val: 16 }, { label: "2xl", val: 24 },
              { label: "full", val: 9999, small: true },
            ].map((r) => (
              <div key={r.label} style={{textAlign:"center"}}>
                <div className="radius-demo" style={{borderRadius: r.val, width: r.small ? 60 : 80}}>{r.val === 9999 ? "∞" : r.val}</div>
                <div className="radius-label">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="sub-title" style={{marginTop:"var(--sp-10)"}}>Shadows</div>
          <div className="shadow-stack">
            {["xs","sm","md","lg","xl"].map((s) => (
              <div key={s} className="shadow-card" style={{boxShadow:`var(--shadow-${s})`}}>shadow-{s}</div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — BUTTONS
   ═══════════════════════════════════════════ */
function ComponentsButtons() {
  return (
    <Section id="buttons" label="Components" title="Buttons"
      description="Buttons communicate actions. Primary for key actions, secondary for supporting, ghost for tertiary.">

      <SubSection title="Variants">
        <div className="preview">
          <Button className="btn btn-primary">Primary</Button>
          <Button className="btn btn-secondary">Secondary</Button>
          <Button className="btn btn-ghost">Ghost</Button>
          <Button className="btn btn-danger">Danger</Button>
          <Button className="btn btn-danger-outline">Danger Outline</Button>
          <Button className="btn btn-info">Info</Button>
          <Button className="btn btn-warning">Warning</Button>
          <Button className="btn btn-link">Link</Button>
        </div>
      </SubSection>

      <SubSection title="Sizes">
        <div className="preview">
          <Button className="btn btn-primary btn-xl">Extra Large</Button>
          <Button className="btn btn-primary btn-lg">Large</Button>
          <Button className="btn btn-primary">Default</Button>
          <Button className="btn btn-primary btn-sm">Small</Button>
        </div>
      </SubSection>

      <SubSection title="Pill Shape">
        <div className="preview">
          <Button className="btn btn-primary btn-pill">Primary Pill</Button>
          <Button className="btn btn-secondary btn-pill">Secondary Pill</Button>
          <Button className="btn btn-ghost btn-pill">Ghost Pill</Button>
        </div>
      </SubSection>

      <SubSection title="States">
        <div className="preview">
          <Button className="btn btn-primary">Default</Button>
          <Button className="btn btn-primary" style={{background:"var(--brand-hover)"}}>Hover</Button>
          <Button className="btn btn-primary" style={{background:"var(--brand-active)"}}>Active</Button>
          <Button className="btn btn-primary" style={{boxShadow:"var(--shadow-focus)",outline:"2px solid var(--brand)",outlineOffset:2}}>Focus</Button>
          <Button className="btn btn-primary" isDisabled>Disabled</Button>
        </div>
      </SubSection>

      <SubSection title="Button Group">
        <div className="preview">
          <div className="btn-group">
            <Button className="btn btn-ghost">Today</Button>
            <Button className="btn btn-ghost active-group">Week</Button>
            <Button className="btn btn-ghost">Month</Button>
          </div>
        </div>
      </SubSection>

      <SubSection title="Block & Icon">
        <div className="preview vertical" style={{maxWidth:400}}>
          <Button className="btn btn-primary btn-block btn-lg">Sign In</Button>
          <Button className="btn btn-ghost btn-block">Create Account</Button>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — FORM ELEMENTS
   ═══════════════════════════════════════════ */
function ComponentsForms() {
  const [switchOn, setSwitchOn] = useState(true);
  const [switchOff, setSwitchOff] = useState(false);
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);

  return (
    <Section id="forms" label="Components" title="Form Elements"
      description="Clean, accessible form controls with clear focus states and error handling.">
      <div className="grid g2" style={{gap:"var(--sp-8)"}}>
        {/* Text Inputs */}
        <div className="card">
          <div className="sub-title">Text Inputs</div>
          <div className="form-group">
            <TextField className="field">
              <Label className="form-label">Email address</Label>
              <Input className="input" placeholder="you@example.com" />
            </TextField>
          </div>
          <div className="form-group">
            <TextField className="field">
              <Label className="form-label">Full name <span className="req">*</span></Label>
              <Input className="input" defaultValue="Penny Ng" />
              <div className="form-hint">As it appears on your medical license</div>
            </TextField>
          </div>
          <div className="form-group">
            <TextField isInvalid className="field">
              <Label className="form-label">Phone <span className="req">*</span></Label>
              <Input className="input error" defaultValue="" />
              <div className="form-error-text">Phone number is required</div>
            </TextField>
          </div>
          <div className="form-group">
            <SearchField className="field">
              <Label className="form-label">Search</Label>
              <Group className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <Input className="input search-input" placeholder="Search patients..." />
              </Group>
            </SearchField>
          </div>
        </div>

        {/* Select & Textarea */}
        <div className="card">
          <div className="sub-title">Select & Textarea</div>
          <div className="form-group">
            <Select className="field">
              <Label className="form-label">Specialty</Label>
              <Button className="input select-trigger">
                <SelectValue>{({isPlaceholder, selectedText}) => isPlaceholder ? "Select a specialty..." : selectedText}</SelectValue>
                <ChevronDown size={16} className="select-chevron" />
              </Button>
              <Popover className="select-popover">
                <ListBox className="select-listbox">
                  <ListBoxItem id="internal" className="select-option">Internal Medicine</ListBoxItem>
                  <ListBoxItem id="family" className="select-option">Family Medicine</ListBoxItem>
                  <ListBoxItem id="peds" className="select-option">Pediatrics</ListBoxItem>
                </ListBox>
              </Popover>
            </Select>
          </div>
          <div className="form-group">
            <TextField className="field">
              <Label className="form-label">Notes</Label>
              <TextArea className="input textarea" rows={3} placeholder="Add clinical notes..." />
            </TextField>
          </div>
          <div style={{marginTop:"var(--sp-6)"}}>
            <div className="sub-title">Toggles</div>
            <div className="toggle-list">
              <Switch isSelected={switchOn} onChange={setSwitchOn} className="toggle-wrap">
                <div className={`toggle-track ${switchOn ? "on" : ""}`}>
                  <div className="toggle-thumb" />
                </div>
                <span className="toggle-label">Notifications enabled</span>
              </Switch>
              <Switch isSelected={switchOff} onChange={setSwitchOff} className="toggle-wrap">
                <div className={`toggle-track ${switchOff ? "on" : ""}`}>
                  <div className="toggle-thumb" />
                </div>
                <span className="toggle-label">Dark mode</span>
              </Switch>
            </div>
          </div>
        </div>

        {/* Checkboxes & Radios */}
        <div className="card">
          <div className="sub-title">Checkboxes</div>
          <div className="check-list">
            <Checkbox isSelected={check1} onChange={setCheck1} className="check-item">
              <div className={`check-box ${check1 ? "checked" : ""}`}>
                {check1 && <svg viewBox="0 0 14 14" fill="none" className="check-svg"><path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              Show consultations
            </Checkbox>
            <Checkbox isSelected={check2} onChange={setCheck2} className="check-item">
              <div className={`check-box ${check2 ? "checked" : ""}`}>
                {check2 && <svg viewBox="0 0 14 14" fill="none" className="check-svg"><path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              Only my patients
            </Checkbox>
            <Checkbox isDisabled className="check-item disabled">
              <div className="check-box" />
              Archived (disabled)
            </Checkbox>
          </div>
          <div className="sub-title" style={{marginTop:"var(--sp-5)"}}>Radios</div>
          <RadioGroup defaultValue="phone" className="radio-list">
            <Radio value="phone" className="radio-item">
              <div className="radio-circle" /><span>Phone call</span>
            </Radio>
            <Radio value="video" className="radio-item">
              <div className="radio-circle" /><span>Video call</span>
            </Radio>
            <Radio value="person" className="radio-item">
              <div className="radio-circle" /><span>In-person</span>
            </Radio>
          </RadioGroup>
        </div>

        {/* Large & Disabled */}
        <div className="card">
          <div className="sub-title">Large Input</div>
          <div className="form-group">
            <TextField className="field">
              <Label className="form-label">Patient Search</Label>
              <Input className="input input-lg" placeholder="Search by name, ID, or phone..." />
            </TextField>
          </div>
          <div className="sub-title" style={{marginTop:"var(--sp-6)"}}>Disabled State</div>
          <div className="form-group">
            <TextField isDisabled className="field">
              <Input className="input" defaultValue="Read-only value" style={{opacity:0.5,cursor:"not-allowed"}} />
            </TextField>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — BADGES & STATUS
   ═══════════════════════════════════════════ */
function ComponentsBadges() {
  return (
    <Section id="badges" label="Components" title="Badges & Status"
      description="Communicate states, categories, and counts with subtle visual indicators.">

      <SubSection title="Soft Badges">
        <div className="preview">
          <span className="badge badge-success"><span className="badge-dot" /> Active</span>
          <span className="badge badge-info"><span className="badge-dot" /> Scheduled</span>
          <span className="badge badge-warning"><span className="badge-dot" /> Pending</span>
          <span className="badge badge-danger"><span className="badge-dot" /> Overdue</span>
          <span className="badge badge-neutral"><span className="badge-dot" /> Draft</span>
          <span className="badge badge-brand"><span className="badge-dot" /> New</span>
        </div>
      </SubSection>

      <SubSection title="Solid Badges">
        <div className="preview">
          <span className="badge badge-solid-success">Approved</span>
          <span className="badge badge-solid-info">Processing</span>
          <span className="badge badge-solid-warning">Review</span>
          <span className="badge badge-solid-danger">Urgent</span>
        </div>
      </SubSection>

      <SubSection title="EMR Order Status" description="Clinical workflow statuses used across the EMR module.">
        <div className="preview">
          <span className="status status-ordered"><span className="status-dot" /> Ordered</span>
          <span className="status status-scheduled"><span className="status-dot" /> Scheduled</span>
          <span className="status status-overdue"><span className="status-dot" /> Overdue</span>
          <span className="status status-in-progress"><span className="status-dot" /> In Progress</span>
          <span className="status status-cancelled"><span className="status-dot" /> Cancelled</span>
          <span className="status status-resulted"><span className="status-dot" /> Resulted</span>
          <span className="status status-completed"><span className="status-dot" /> Completed</span>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — FEEDBACK
   ═══════════════════════════════════════════ */
function ComponentsFeedback() {
  return (
    <Section id="feedback" label="Components" title="Feedback"
      description="Alerts, toasts, and progress indicators for communicating system state.">

      <SubSection title="Alerts">
        <div className="alert-stack">
          <div className="alert alert-success"><span className="alert-icon"><CheckCircle2 size={18} /></span><div><strong>Changes saved</strong><br/>Your patient record has been updated successfully.</div></div>
          <div className="alert alert-info"><span className="alert-icon"><Info size={18} /></span><div><strong>Appointment reminder</strong><br/>Your next appointment is scheduled for tomorrow at 2:00 PM.</div></div>
          <div className="alert alert-warning"><span className="alert-icon"><AlertTriangle size={18} /></span><div><strong>Outstanding balance</strong><br/>This patient has an unpaid balance of $45.00.</div></div>
          <div className="alert alert-danger"><span className="alert-icon"><AlertCircle size={18} /></span><div><strong>Form submission failed</strong><br/>Please check the required fields and try again.</div></div>
        </div>
      </SubSection>

      <SubSection title="Toast Notifications">
        <div className="toast-demo">
          <div className="toast toast-success"><div className="toast-body"><div className="toast-title">Appointment confirmed</div><div className="toast-msg">Feb 26, 2026 at 10:00 AM with Dr. Chen</div></div><span className="toast-close"><X size={16} /></span></div>
          <div className="toast toast-danger"><div className="toast-body"><div className="toast-title">Connection lost</div><div className="toast-msg">Please check your internet connection.</div></div><span className="toast-close"><X size={16} /></span></div>
          <div className="toast toast-info"><div className="toast-body"><div className="toast-title">New message</div><div className="toast-msg">You have 3 unread messages from patients.</div></div><span className="toast-close"><X size={16} /></span></div>
        </div>
      </SubSection>

      <SubSection title="Progress Bars">
        <div className="card" style={{maxWidth:500}}>
          <div className="progress-item">
            <div className="progress-head"><span className="progress-label">Profile Complete</span><span className="progress-val">75%</span></div>
            <div className="progress-track"><div className="progress-bar progress-bar-brand" style={{width:"75%"}} /></div>
          </div>
          <div className="progress-item">
            <div className="progress-head"><span className="progress-label">Upload Progress</span><span className="progress-val">45%</span></div>
            <div className="progress-track"><div className="progress-bar progress-bar-info" style={{width:"45%"}} /></div>
          </div>
          <div className="progress-item">
            <div className="progress-head"><span className="progress-label">Storage Used</span><span className="progress-val">90%</span></div>
            <div className="progress-track"><div className="progress-bar progress-bar-danger" style={{width:"90%"}} /></div>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — NAVIGATION
   ═══════════════════════════════════════════ */
function ComponentsNavigation() {
  return (
    <Section id="navigation" label="Components" title="Navigation"
      description="Navigation patterns for consistent wayfinding across the application.">

      <SubSection title="Top Navigation Bar">
        <div className="navbar">
          <div className="navbar-logo">VSee</div>
          <div className="navbar-links">
            <div className="navbar-link active">Dashboard</div>
            <div className="navbar-link">Patients</div>
            <div className="navbar-link">Schedule</div>
            <div className="navbar-link">Messages</div>
          </div>
          <div className="navbar-right">
            <Button className="btn btn-ghost btn-sm">Help</Button>
            <div className="avatar avatar-sm">PN</div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Tabs">
        <div className="card">
          <Tabs>
            <TabList className="tabs" aria-label="Clinic tabs">
              <Tab id="patients" className="tab-item">Patients</Tab>
              <Tab id="visits" className="tab-item">All Visits</Tab>
              <Tab id="docs" className="tab-item">Documents</Tab>
              <Tab id="labs" className="tab-item">Lab Results</Tab>
            </TabList>
            <TabPanel id="patients" className="tab-content">Tab content area</TabPanel>
            <TabPanel id="visits" className="tab-content">All visits content</TabPanel>
            <TabPanel id="docs" className="tab-content">Documents content</TabPanel>
            <TabPanel id="labs" className="tab-content">Lab results content</TabPanel>
          </Tabs>
        </div>
      </SubSection>

      <SubSection title="Breadcrumb">
        <div className="card">
          <Breadcrumbs className="breadcrumb">
            <Breadcrumb><Link>Dashboard</Link></Breadcrumb>
            <Breadcrumb><Link>Patients</Link></Breadcrumb>
            <Breadcrumb><Link className="breadcrumb-current">Michelle Doe</Link></Breadcrumb>
          </Breadcrumbs>
        </div>
      </SubSection>

      <SubSection title="Pagination">
        <div className="card">
          <div className="pagination">
            <button className="page-btn disabled">&larr;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">&rarr;</button>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — DATA DISPLAY
   ═══════════════════════════════════════════ */
function ComponentsDataDisplay() {
  return (
    <Section id="data" label="Components" title="Data Display"
      description="Cards, tables, avatars, and tooltips for displaying structured content.">

      <SubSection title="Patient Card">
        <div className="grid g2" style={{gap:"var(--sp-4)"}}>
          <div className="panel">
            <div className="panel-header">Patient Summary</div>
            <div className="panel-body">
              <div className="patient-row">
                <div className="avatar avatar-lg">MD</div>
                <div>
                  <div className="patient-name">Michelle Doe</div>
                  <div className="patient-meta">Female · 46 years · ID: 10042</div>
                </div>
              </div>
              <div className="badge-row">
                <span className="badge badge-success"><span className="badge-dot" /> Active</span>
                <span className="badge badge-info"><span className="badge-dot" /> Insured</span>
              </div>
            </div>
            <div className="panel-footer">
              <Button className="btn btn-primary btn-sm">View Chart</Button>
              <Button className="btn btn-ghost btn-sm">Message</Button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">Upcoming Appointments <span className="badge badge-neutral" style={{marginLeft:"auto"}}>3</span></div>
            <div className="panel-body" style={{padding:0}}>
              {[
                { dr: "Dr. Sarah Chen", date: "Feb 26, 2026 · 10:00 AM", badge: "badge-info", status: "Confirmed" },
                { dr: "Dr. James Park", date: "Mar 3, 2026 · 2:30 PM", badge: "badge-warning", status: "Pending" },
                { dr: "Lab Work", date: "Mar 10, 2026 · 8:00 AM", badge: "badge-success", status: "Scheduled" },
              ].map((a, i) => (
                <div key={i} className="appt-row">
                  <div><div className="appt-dr">{a.dr}</div><div className="appt-date">{a.date}</div></div>
                  <span className={`badge ${a.badge}`}><span className="badge-dot" /> {a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Data Table">
        <div className="panel">
          <table className="table">
            <thead>
              <tr><th>Patient</th><th>Gender</th><th>Age</th><th>Last Visit</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {[
                { initials: "MD", name: "Michelle Doe", email: "patient@vsee.com", gender: "Female", age: 46, visit: "Feb 20, 2026", badge: "badge-success", status: "Active" },
                { initials: "JS", name: "John Smith", email: "john@example.com", gender: "Male", age: 32, visit: "Feb 18, 2026", badge: "badge-warning", status: "Pending" },
                { initials: "AW", name: "Alice Wong", email: "alice@example.com", gender: "Female", age: 58, visit: "Jan 15, 2026", badge: "badge-neutral", status: "Inactive" },
              ].map((p) => (
                <tr key={p.initials}>
                  <td>
                    <div className="table-patient">
                      <div className="avatar avatar-sm">{p.initials}</div>
                      <div><div className="table-patient-name">{p.name}</div><div className="table-patient-email">{p.email}</div></div>
                    </div>
                  </td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.visit}</td>
                  <td><span className={`badge ${p.badge}`}><span className="badge-dot" /> {p.status}</span></td>
                  <td><Button className="btn btn-ghost btn-sm">View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection title="Avatars">
        <div className="preview">
          <div className="avatar avatar-sm">A</div>
          <div className="avatar">PN</div>
          <div className="avatar avatar-lg">MD</div>
          <div className="avatar avatar-xl">JS</div>
        </div>
      </SubSection>

      <SubSection title="Tooltips">
        <div className="preview" style={{padding:"60px 24px 24px"}}>
          <TooltipTrigger delay={300}>
            <Button className="btn btn-ghost">Hover target</Button>
            <AriaTooltip placement="top" className="tooltip-bubble">This is a tooltip</AriaTooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={300}>
            <Button className="btn btn-primary btn-sm">Save</Button>
            <AriaTooltip placement="top" className="tooltip-bubble">Save patient record</AriaTooltip>
          </TooltipTrigger>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — OVERLAYS
   ═══════════════════════════════════════════ */
function ComponentsOverlays() {
  return (
    <Section id="overlay" label="Components" title="Overlays"
      description="Modals, dialogs, and overlay patterns for focused interactions.">

      <SubSection title="Modal / Dialog">
        <div className="modal-demo-bg">
          <div className="modal-box">
            <div className="modal-head">
              <h3>Cancel Appointment</h3>
              <button className="modal-close"><X size={20} /></button>
            </div>
            <div className="modal-content">
              <p style={{color:"var(--grey-600)",marginBottom:"var(--sp-4)"}}>
                Are you sure you want to cancel this appointment with <strong>Dr. Sarah Chen</strong> on Feb 26, 2026?
              </p>
              <div className="form-group">
                <label className="form-label">Reason for cancellation</label>
                <select className="input native-select">
                  <option>Select a reason...</option>
                  <option>Schedule conflict</option>
                  <option>Feeling better</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <Button className="btn btn-ghost">Keep Appointment</Button>
              <Button className="btn btn-danger">Cancel Appointment</Button>
            </div>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   PATTERNS — EMR
   ═══════════════════════════════════════════ */
function PatternsEMR() {
  return (
    <Section id="emr" label="Patterns" title="EMR Patterns"
      description="Clinical workflow patterns specific to the VSee EMR platform — order management, patient charts, and medical records.">

      <SubSection title="Orders Table">
        <div className="panel">
          <div className="panel-header">Lab Orders <Button className="btn btn-primary btn-sm" style={{marginLeft:"auto"}}>+ New Order</Button></div>
          <table className="table">
            <thead><tr><th>Order</th><th>Type</th><th>Ordered By</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td style={{fontWeight:600}}>CBC with Differential</td><td>Lab</td><td>Dr. Chen</td><td>Feb 25, 2026</td><td><span className="status status-ordered"><span className="status-dot" /> Ordered</span></td></tr>
              <tr><td style={{fontWeight:600}}>Lipid Panel</td><td>Lab</td><td>Dr. Park</td><td>Feb 20, 2026</td><td><span className="status status-resulted"><span className="status-dot" /> Resulted</span></td></tr>
              <tr><td style={{fontWeight:600}}>Chest X-Ray</td><td>Imaging</td><td>Dr. Chen</td><td>Feb 18, 2026</td><td><span className="status status-scheduled"><span className="status-dot" /> Scheduled</span></td></tr>
              <tr><td style={{fontWeight:600}}>HbA1c</td><td>Lab</td><td>Dr. Park</td><td>Jan 15, 2026</td><td><span className="status status-overdue"><span className="status-dot" /> Overdue</span></td></tr>
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection title="Vitals Card">
        <div className="panel" style={{maxWidth:500}}>
          <div className="panel-header">Latest Vitals <span style={{fontSize:13,color:"var(--grey-500)",fontWeight:400,marginLeft:"auto"}}>Feb 26, 2026</span></div>
          <div className="panel-body">
            <div className="vitals-grid">
              <div className="vital"><div className="vital-val" style={{color:"var(--brand)"}}>120/80</div><div className="vital-label">Blood Pressure</div></div>
              <div className="vital"><div className="vital-val">72</div><div className="vital-label">Heart Rate</div></div>
              <div className="vital"><div className="vital-val">98.6°</div><div className="vital-label">Temperature</div></div>
              <div className="vital"><div className="vital-val" style={{color:"var(--success)"}}>98%</div><div className="vital-label">SpO2</div></div>
              <div className="vital"><div className="vital-val">16</div><div className="vital-label">Resp Rate</div></div>
              <div className="vital"><div className="vital-val" style={{color:"var(--warning)"}}>28.5</div><div className="vital-label">BMI</div></div>
            </div>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   PATTERNS — LAYOUTS
   ═══════════════════════════════════════════ */
function PatternsLayouts() {
  return (
    <Section id="layouts" label="Patterns" title="Layouts"
      description="Common layout patterns used across the VSee Clinic application.">

      <SubSection title="Sidebar + Content">
        <div className="sidebar-layout">
          <div className="sidebar-panel">
            <div className="sidebar-heading">Menu</div>
            {["Dashboard","Patients","Appointments","Messages","Lab Results","Settings"].map((item, i) => (
              <div key={item} className={`sidebar-menu-item ${i === 0 ? "active" : ""}`}>{item}</div>
            ))}
          </div>
          <div className="sidebar-content">
            <div style={{fontSize:20,fontWeight:700,marginBottom:"var(--sp-4)"}}>Dashboard</div>
            <div style={{color:"var(--grey-600)"}}>Main content area with sidebar navigation pattern. Used across most admin and clinician views.</div>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   PATTERNS — WHITE-LABEL THEMING
   ═══════════════════════════════════════════ */
function PatternsTheming() {
  return (
    <Section id="theming" label="Patterns" title="White-Label Theming"
      description={`VSee supports white-label customization per tenant. Override CSS variables via [data-theme] attributes.`}>

      <div className="grid g3" style={{gap:"var(--sp-4)"}}>
        {[
          { name: "VSee Default", color: "#0D875C" },
          { name: "Blue Variant", color: "#2563EB" },
          { name: "Purple Variant", color: "#7C3AED" },
        ].map((t) => (
          <div key={t.name} className="theme-card">
            <div className="theme-card-header"><div className="theme-card-dot" style={{background:t.color}} /> {t.name}</div>
            <div className="theme-card-body">
              <button className="theme-btn-primary" style={{background:t.color}}>Primary</button>
              <button className="theme-btn-secondary" style={{color:t.color,borderColor:t.color}}>Secondary</button>
            </div>
          </div>
        ))}
      </div>

      <div className="code" style={{marginTop:"var(--sp-6)"}}>
        <span className="c">{"/* Override for a specific tenant */"}</span>{"\n"}
        <span className="c">{"/* Add [data-theme=\"blue-health\"] to html or body */"}</span>{"\n\n"}
        {"[data-theme="}<span className="v">"blue-health"</span>{"] {\n"}
        {"  "}<span className="p">--brand</span>{": "}<span className="v">#2563EB</span>{";\n"}
        {"  "}<span className="p">--brand-hover</span>{": "}<span className="v">#1D4ED8</span>{";\n"}
        {"  "}<span className="p">--brand-active</span>{": "}<span className="v">#1E40AF</span>{";\n"}
        {"  "}<span className="p">--brand-light</span>{": "}<span className="v">#EFF6FF</span>{";\n"}
        {"  "}<span className="p">--brand-50</span>{": "}<span className="v">#F0F6FF</span>{";\n"}
        {"}"}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   PATTERNS — FORM.IO INTEGRATION
   ═══════════════════════════════════════════ */
function PatternsFormio() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [insurance, setInsurance] = useState("");
  const [reason, setReason] = useState("");
  const [hipaa, setHipaa] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setSubmitted(false); setFirstName(""); setLastName("");
    setDob(""); setInsurance(""); setReason(""); setHipaa(false);
  };

  return (
    <Section id="formio" label="Patterns" title="Form.io + React Aria"
      description={<>Form.io is a headless form platform — forms are defined as JSON schemas on a server and rendered client-side via <code className="code-inline">@formio/react</code>. Registering React Aria components as Form.io <em>custom components</em> gives you runtime-driven, dynamic forms that look and feel like the rest of your design system.</>}>

      {/* ── How it works ── */}
      <SubSection title="How it works">
        <div className="arch-pipeline">
          <div className="arch-step">
            <div className="arch-step-title">Form.io Builder</div>
            <div className="arch-step-desc">Drag-and-drop form builder or JSON editor hosted on form.io or self-hosted</div>
          </div>
          <div className="arch-arrow"><ChevronRight size={20} /></div>
          <div className="arch-step">
            <div className="arch-step-title">Form Schema</div>
            <div className="arch-step-desc">Form definition fetched at runtime — no redeploy needed to change a form</div>
          </div>
          <div className="arch-arrow"><ChevronRight size={20} /></div>
          <div className="arch-step">
            <div className="arch-step-title">{"<Form>"}</div>
            <div className="arch-step-desc">Renders schema, handles validation, submissions, and multi-step logic</div>
          </div>
          <div className="arch-arrow"><ChevronRight size={20} /></div>
          <div className="arch-step">
            <div className="arch-step-title">Custom Components</div>
            <div className="arch-step-desc">TextField, Checkbox, Select etc. registered as Form.io custom component overrides</div>
          </div>
        </div>
      </SubSection>

      {/* ── JSON Schema ── */}
      <SubSection title="Form.io JSON Schema">
        <p className="sub-desc">
          The server returns a JSON schema like this. The <code className="code-inline">type</code> field maps to the registered custom component.
        </p>
        <div className="card">
          <div className="code">
{`// Returned by GET /form/patient-intake (Form.io API)
{
  "title": "Patient Intake Form",
  "components": [
    {
      "type":        "ariaTextfield",    // ← custom component key
      "key":         "firstName",
      "label":       "First Name",
      "placeholder": "Jane",
      "validate":    { "required": true }
    },
    {
      "type":        "ariaTextfield",
      "key":         "lastName",
      "label":       "Last Name",
      "placeholder": "Doe",
      "validate":    { "required": true }
    },
    {
      "type":        "ariaTextfield",
      "inputType":   "date",
      "key":         "dob",
      "label":       "Date of Birth",
      "validate":    { "required": true }
    },
    {
      "type":        "ariaSelect",       // ← custom Select
      "key":         "insurance",
      "label":       "Insurance Provider",
      "data": {
        "values": [
          { "label": "Aetna",            "value": "aetna"    },
          { "label": "BlueCross",        "value": "bluecross" },
          { "label": "Cigna",            "value": "cigna"    },
          { "label": "UnitedHealthcare", "value": "uhc"      }
        ]
      }
    },
    {
      "type":        "ariaTextarea",     // ← custom Textarea
      "key":         "reasonForVisit",
      "label":       "Reason for Visit",
      "placeholder": "Describe your symptoms...",
      "rows":        3
    },
    {
      "type":        "ariaCheckbox",     // ← custom Checkbox
      "key":         "hipaaConsent",
      "label":       "I have read and agree to the HIPAA Privacy Notice",
      "validate":    { "required": true }
    },
    {
      "type":        "ariaButton",
      "action":      "submit",
      "label":       "Submit Intake Form"
    }
  ]
}`}
          </div>
        </div>
      </SubSection>

      {/* ── Custom Component Bridge ── */}
      <SubSection title="Custom Component Registration">
        <p className="sub-desc">
          Each Form.io component type is mapped to a React component. The <code className="code-inline">component</code> object carries the schema properties; <code className="code-inline">onChange</code> updates the submission data.
        </p>
        <div className="card">
          <div className="code">
{`// src/formio/aria-components.tsx
import { TextField, Input, Label, TextArea, Checkbox, Button, Text }
  from "react-aria-components"

// ariaTextfield → React Aria <TextField> + <Input>
export function AriaTextfield({ component, value, onChange, error }) {
  return (
    <TextField
      value={value ?? ""}
      onChange={onChange}
      isInvalid={!!error}
      isRequired={component.validate?.required}
    >
      <Label>
        {component.label}
        {component.validate?.required && (
          <span style={{ color: "var(--danger)", marginLeft: 2 }}>*</span>
        )}
      </Label>
      <Input
        type={component.inputType ?? "text"}
        placeholder={component.placeholder}
      />
      {error && (
        <Text slot="errorMessage">{error}</Text>
      )}
    </TextField>
  )
}

// ariaCheckbox → React Aria <Checkbox>
export function AriaCheckbox({ component, value, onChange, error }) {
  return (
    <Checkbox
      isSelected={!!value}
      onChange={(checked) => onChange(!!checked)}
      isInvalid={!!error}
    >
      {component.label}
    </Checkbox>
  )
}

// Register all custom components
export const customComponents = {
  ariaTextfield: AriaTextfield,
  ariaTextarea:  AriaTextarea,
  ariaSelect:    AriaSelect,
  ariaCheckbox:  AriaCheckbox,
  ariaButton:    AriaButton,
}`}
          </div>
        </div>
      </SubSection>

      {/* ── Wiring ── */}
      <SubSection title="Wiring it Together">
        <div className="card">
          <div className="code">
{`// src/pages/PatientIntake.tsx
import { Form } from "@formio/react"
import { customComponents } from "@/formio/aria-components"

export function PatientIntakePage() {
  const handleSubmit = (submission: { data: Record<string, unknown> }) => {
    console.log("Form.io submission →", submission.data)
    // POST to your backend or Form.io submission endpoint
  }

  return (
    <Form
      // Fetch schema from Form.io server by form path
      src="https://your-project.form.io/patient-intake"

      // Inject React Aria as the renderer for each component type
      options={{ components: customComponents }}

      onSubmit={handleSubmit}
    />
  )
}`}
          </div>
        </div>
      </SubSection>

      {/* ── Live Demo ── */}
      <SubSection title="Live Preview — Patient Intake Form">
        <p className="sub-desc">
          This is what the form above renders using the React Aria custom components. All validation, layout, and
          field logic come from the JSON schema; the React Aria components supply only styling and accessibility.
        </p>
        <div className="grid g2" style={{gap:"var(--sp-6)"}}>
          {/* Form card */}
          <div className="panel">
            <div className="panel-header">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <FileText size={18} style={{color:"var(--brand)"}} />
                Patient Intake Form
              </div>
            </div>
            <div className="panel-body">
              <p style={{fontSize:"var(--text-sm)",color:"var(--text-tertiary)",marginBottom:"var(--sp-4)"}}>
                Rendered by <code className="code-inline">@formio/react</code> · React Aria custom components
              </p>
              {submitted ? (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"var(--sp-3)",padding:"var(--sp-8) 0",textAlign:"center"}}>
                  <CheckCircle2 size={48} style={{color:"var(--brand)"}} />
                  <p style={{fontSize:"var(--text-base)",fontWeight:600}}>Intake form submitted!</p>
                  <p style={{fontSize:"var(--text-sm)",color:"var(--text-secondary)"}}>
                    {firstName} {lastName} · {insurance || "No insurance"}
                  </p>
                  <Button className="btn btn-ghost btn-sm" onPress={resetForm}>Reset form</Button>
                </div>
              ) : (
                <Form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <div className="grid g2" style={{gap:"var(--sp-3)",marginBottom:"var(--sp-4)"}}>
                    <div className="form-group" style={{marginBottom:0}}>
                      <TextField value={firstName} onChange={setFirstName} isRequired className="field">
                        <Label className="form-label">First Name <span className="req">*</span></Label>
                        <Input className="input" placeholder="Jane" />
                      </TextField>
                    </div>
                    <div className="form-group" style={{marginBottom:0}}>
                      <TextField value={lastName} onChange={setLastName} isRequired className="field">
                        <Label className="form-label">Last Name <span className="req">*</span></Label>
                        <Input className="input" placeholder="Doe" />
                      </TextField>
                    </div>
                  </div>
                  <div className="form-group">
                    <TextField value={dob} onChange={setDob} isRequired className="field">
                      <Label className="form-label">Date of Birth <span className="req">*</span></Label>
                      <Input className="input" type="date" />
                    </TextField>
                  </div>
                  <div className="form-group">
                    <Select className="field" selectedKey={insurance || undefined} onSelectionChange={(k) => setInsurance(k as string)}>
                      <Label className="form-label">Insurance Provider</Label>
                      <Button className="input select-trigger">
                        <SelectValue>{({isPlaceholder, selectedText}) => isPlaceholder ? "Select provider…" : selectedText}</SelectValue>
                        <ChevronDown size={16} className="select-chevron" />
                      </Button>
                      <Popover className="select-popover">
                        <ListBox className="select-listbox">
                          <ListBoxItem id="aetna" className="select-option">Aetna</ListBoxItem>
                          <ListBoxItem id="bluecross" className="select-option">BlueCross</ListBoxItem>
                          <ListBoxItem id="cigna" className="select-option">Cigna</ListBoxItem>
                          <ListBoxItem id="uhc" className="select-option">UnitedHealthcare</ListBoxItem>
                        </ListBox>
                      </Popover>
                    </Select>
                  </div>
                  <div className="form-group">
                    <TextField value={reason} onChange={setReason} className="field">
                      <Label className="form-label">Reason for Visit</Label>
                      <TextArea className="input textarea" placeholder="Describe your symptoms or reason for visit…" rows={3} />
                    </TextField>
                  </div>
                  <div className="form-group">
                    <div className="hipaa-box">
                      <Checkbox isSelected={hipaa} onChange={setHipaa} className="check-item">
                        <div className={`check-box ${hipaa ? "checked" : ""}`}>
                          {hipaa && <svg viewBox="0 0 14 14" fill="none" className="check-svg"><path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                        <span style={{fontSize:"var(--text-sm)",lineHeight:1.4}}>I have read and agree to the HIPAA Privacy Notice <span className="req">*</span></span>
                      </Checkbox>
                    </div>
                  </div>
                  <Button type="submit" className="btn btn-primary btn-block" isDisabled={!hipaa}>
                    Submit Intake Form
                  </Button>
                </Form>
              )}
            </div>
          </div>

          {/* Responsibility cards */}
          <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-4)"}}>
            <div className="panel">
              <div className="panel-header">What Form.io handles</div>
              <div className="panel-body">
                <ul className="resp-list">
                  {["Schema fetch & caching","Field-level validation rules (required, min/max, regex)","Conditional visibility logic","Multi-step wizard / page navigation","Submission to Form.io or custom endpoint","Offline drafts & resume"].map(item => (
                    <li key={item}><CheckCircle2 size={14} style={{color:"var(--brand)",flexShrink:0}} /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header">What React Aria handles</div>
              <div className="panel-body">
                <ul className="resp-list">
                  {["Visual styling & brand tokens","Keyboard navigation & focus rings","ARIA labels, roles, error associations","React Aria accessibility primitives","Consistent hover / focus / disabled states","Design system token inheritance"].map(item => (
                    <li key={item}><CheckCircle2 size={14} style={{color:"var(--brand)",flexShrink:0}} /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SubSection>

      {/* ── Install ── */}
      <SubSection title="Install">
        <div className="card">
          <div className="code">
{`# Install Form.io React renderer + core library
npm install @formio/react formiojs

# React Aria components (already included in this project)
npm install react-aria-components`}
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   ENGINEERING — DESIGN TOKENS
   ═══════════════════════════════════════════ */
function EngineeringTokens() {
  return (
    <Section id="tokens" label="Engineering" title="Design Tokens"
      description="Copy the :root block into your global CSS. Available as CSS custom properties, Tokens Studio JSON, and Figma Variables.">
      <div className="code">
        <span className="c">{"/* VSee Clinic Design Tokens — v4.0 */"}</span>{"\n"}
        <span className="c">{"/* Full token reference: see vsee-tokens.css */"}</span>{"\n\n"}
        <span className="c">{"/* Brand */"}</span>{"\n"}
        <span className="p">--brand</span>{": "}<span className="v">#0D875C</span>{";  "}<span className="p">--brand-hover</span>{": "}<span className="v">#0B7550</span>{";\n"}
        <span className="p">--brand-active</span>{": "}<span className="v">#096843</span>{";  "}<span className="p">--brand-light</span>{": "}<span className="v">#E6F5EE</span>{";\n\n"}
        <span className="c">{"/* Semantic */"}</span>{"\n"}
        <span className="p">--success</span>{": "}<span className="v">#0D875C</span>{";  "}<span className="p">--info</span>{": "}<span className="v">#0575AD</span>{";\n"}
        <span className="p">--warning</span>{": "}<span className="v">#D97706</span>{";  "}<span className="p">--danger</span>{": "}<span className="v">#DC2626</span>{";\n\n"}
        <span className="c">{"/* Typography */"}</span>{"\n"}
        <span className="p">--font</span>{": "}<span className="v">'Legend', sans-serif</span>{";\n"}
        <span className="p">--text-base</span>{": "}<span className="v">14px</span>{";  "}<span className="c">{"/* scale: 12 → 60px */"}</span>{"\n\n"}
        <span className="c">{"/* Spacing (4px base) */"}</span>{"\n"}
        <span className="p">--sp-1</span>{": "}<span className="v">4px</span>{"; "}<span className="p">--sp-2</span>{": "}<span className="v">8px</span>{"; "}<span className="p">--sp-4</span>{": "}<span className="v">16px</span>{"; "}<span className="p">--sp-8</span>{": "}<span className="v">32px</span>{";\n\n"}
        <span className="c">{"/* Radius */"}</span>{"\n"}
        <span className="p">--r-sm</span>{": "}<span className="v">6px</span>{"; "}<span className="p">--r-md</span>{": "}<span className="v">8px</span>{"; "}<span className="p">--r-lg</span>{": "}<span className="v">12px</span>{"; "}<span className="p">--r-full</span>{": "}<span className="v">9999px</span>{";"}
      </div>
    </Section>
  );
}

export default App;
