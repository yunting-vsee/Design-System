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
  TagGroup,
  TagList,
  Tag,
  ComboBox,
  Header,
  Section as AriaSection,
  Separator,
  Menu,
  MenuItem,
  MenuTrigger,
  DatePicker,
  DateInput,
  DateSegment,
  Calendar as AriaCalendar,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarCell,
  Heading,
  Dialog,
  TimeField,
} from "react-aria-components";
import { today, getLocalTimeZone, Time, CalendarDateTime } from "@internationalized/date";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  // ChevronUp, // commented out: Collapse / Accordion is commented out
  X,
  Search,
  FileText,
  Palette,
  LayoutGrid,
  Layers,
  Settings,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Archive,
  CheckCircle,
  XCircle,
  Inbox,
  Menu as MenuIcon,
  Plus,
  Download,
  Send,
  Heart,
  Share2,
  Pencil,
  Calendar,
  Upload,
  Loader2,
  ChevronLeft,
  Eye,
  EyeOff,
  Clock,
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
      { label: "Badges, Tags & Status", id: "badges" },
      { label: "Feedback & Notifications", id: "feedback" },
      { label: "Navigation", id: "navigation" },
      { label: "Dropdowns", id: "dropdowns" },
      { label: "Overlays", id: "overlay" },
      { label: "Others", id: "data" },
    ],
  },
  {
    group: "Patterns",
    icon: <Layers size={14} />,
    items: [
      // { label: "EMR Patterns", id: "emr" },
      { label: "Layouts", id: "layouts" },
    ],
  },
  {
    group: "Engineering",
    icon: <Settings size={14} />,
    items: [
      { label: "Design Tokens", id: "tokens" },
      { label: "White-Label", id: "theming" },
      { label: "Form.io Integration", id: "formio" },
    ],
  },
];

function App() {
  const [activeSection, setActiveSection] = useState("colors");
  const [navOpen, setNavOpen] = useState(false);
  const [brandTheme, setBrandTheme] = useState("");
  const toast = useCopyToast();

  /* apply brand theme to root element */
  useEffect(() => {
    if (brandTheme) {
      document.documentElement.setAttribute("data-theme", brandTheme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [brandTheme]);

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
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ds-root">
      {navOpen && <div className="ds-nav-overlay" onClick={() => setNavOpen(false)} />}

      {/* Mobile nav open button (visible when sidebar is hidden) */}
      {!navOpen && <button className="ds-nav-toggle-open" onClick={() => setNavOpen(true)}>
        <MenuIcon size={22} />
      </button>}

      {/* Sidebar */}
      <aside className={`ds-nav ${navOpen ? "open" : ""}`}>
        <div className="ds-nav-logo">
          <div>
            VSee
            <span className="ds-nav-version">Design System</span>
          </div>
          <button className="ds-nav-toggle" onClick={() => setNavOpen(!navOpen)}>
            <X size={20} />
          </button>
        </div>
        <div className="ds-theme-switcher">
          <div className="ds-theme-label">Brand Color</div>
          <div className="ds-theme-options">
            <button className={`ds-theme-dot ds-theme-green ${brandTheme === "" ? "active" : ""}`} onClick={() => setBrandTheme("")} title="Green (Default)" />
            <button className={`ds-theme-dot ds-theme-blue ${brandTheme === "blue" ? "active" : ""}`} onClick={() => setBrandTheme("blue")} title="Ocean Blue" />
            <button className={`ds-theme-dot ds-theme-purple ${brandTheme === "purple" ? "active" : ""}`} onClick={() => setBrandTheme("purple")} title="Royal Purple" />
          </div>
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

        {/* Anchor navigation bar */}
        <div className="anchor-bar">
          {NAV.map(g => {
            const firstId = g.items[0].id;
            const isActive = g.items.some(i => i.id === activeSection);
            return (
              <a
                key={g.group}
                href={`#${firstId}`}
                className={`anchor-link ${isActive ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); scrollTo(firstId); }}
              >
                {g.group}
              </a>
            );
          })}
        </div>

        <FoundationsColors copy={toast.copy} />
        <FoundationsTypography />
        <FoundationsSpacing />
        <ComponentsButtons />
        <ComponentsForms />
        <ComponentsBadges />
        <ComponentsFeedback />
        <ComponentsNavigation />
        <ComponentsDropdowns />
        <ComponentsOverlays />
        <ComponentsOthers />
        {/* <PatternsEMR /> */}
        <PatternsLayouts />
        <EngineeringTokens />
        <PatternsTheming brandTheme={brandTheme} setBrandTheme={setBrandTheme} />
        <PatternsFormio />

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

/* ─── Code Block helper ─── */
function CodeBlock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "var(--sp-4)" }}>
      <button className="code-toggle" onClick={() => setOpen(!open)}>
        <ChevronRight size={14} className={`code-toggle-icon ${open ? "open" : ""}`} />
        {open ? "Hide code" : "Show code"}
      </button>
      {open && code && <div className="code">{code}</div>}
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
          <Swatch large color="var(--brand-50)" name="Brand 50" hex="--brand-50" token="--brand-50" onClick={() => copy("var(--brand-50)")} />
          <Swatch large color="var(--brand-light)" name="Brand Light" hex="--brand-light" token="--brand-light" onClick={() => copy("var(--brand-light)")} />
          <Swatch large color="var(--brand)" name="Brand" hex="--brand" token="--brand" onClick={() => copy("var(--brand)")} />
          <Swatch large color="var(--brand-hover)" name="Hover" hex="--brand-hover" token="--brand-hover" onClick={() => copy("var(--brand-hover)")} />
          <Swatch large color="var(--brand-active)" name="Active" hex="--brand-active" token="--brand-active" onClick={() => copy("var(--brand-active)")} />
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
          { label: "Body LG", meta: "16px / 400", style: { fontSize: 16, lineHeight: 1.6 }, text: "Body text for longer-form content and introductory paragraphs." },
          { label: "Body", meta: "14px / 400", style: { fontSize: 14, lineHeight: 1.5 }, text: "Standard body text used throughout the application." },
          { label: "Caption", meta: "13px / 500", style: { fontSize: 13, fontWeight: 500 }, text: "Helper text, timestamps, and metadata" },
          { label: "Overline", meta: "12px / 700", style: { fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1px" }, text: "Section Label" },
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
      <div className="grid" style={{gap:"var(--sp-10)",gridTemplateColumns:"1fr 2fr"}}>
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
              { label: "--r-sm", val: 6 }, { label: "--r-md", val: 8 }, { label: "--r-lg", val: 12 },
              { label: "--r-xl", val: 16 }, { label: "--r-2xl", val: 24 },
              { label: "--r-full", val: 9999 },
            ].map((r) => (
              <div key={r.label} style={{textAlign:"center"}}>
                <div className="radius-demo" style={{borderRadius: r.val, width: 80, height: 80}}>{r.val === 9999 ? "∞" : `${r.val}px`}</div>
                <div className="radius-label">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="sub-title" style={{marginTop:"var(--sp-10)"}}>Shadows</div>
          <div className="shadow-stack">
            {["xs","sm","md","lg","xl"].map((s) => (
              <div key={s} className="shadow-card" style={{boxShadow:`var(--shadow-${s})`}}>--shadow-{s}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop:"var(--sp-8)"}} />
      {/* <SubSection title="Dividers" description="Horizontal separators used to visually group content within cards, panels, and forms.">
        <div className="preview-box">
          <div style={{ fontWeight: 600 }}>Patient Information</div>
          <div className="divider" />
          <div style={{ display: "flex", gap: "var(--sp-8)" }}>
            <span>Name: Jane Doe</span>
            <span>DOB: 03/15/1985</span>
            <span>MRN: 00284731</span>
          </div>
          <div className="divider divider-dashed" />
          <div style={{ display: "flex", gap: "var(--sp-8)" }}>
            <span>Provider: Dr. Sarah Chen</span>
            <span>Dept: Internal Medicine</span>
          </div>
          <div className="divider divider-thick" />
          <div style={{ color: "var(--text-tertiary)" }}>End of section</div>
        </div>
        <div style={{ marginTop: "var(--sp-6)" }}>
          <div className="sub-title">Divider with Label</div>
          <div className="preview-box">
            <div>Content above</div>
            <div className="divider-label"><span>OR</span></div>
            <div>Content below</div>
          </div>
        </div>
      </SubSection> */}
    </Section>
  );
}

function ToggleDemo() {
  const [switchOn, setSwitchOn] = useState(true);
  const [labeledSwitch, setLabeledSwitch] = useState(true);
  return (
    <div className="preview">
      <div className="toggle-list">
        <Switch isSelected={switchOn} onChange={setSwitchOn} className="toggle-wrap">
          <div className={`toggle-track ${switchOn ? "on" : ""}`}>
            <div className="toggle-thumb" />
          </div>
          <span className="toggle-label">Notifications</span>
        </Switch>
        <Switch isSelected={labeledSwitch} onChange={setLabeledSwitch} className="toggle-wrap">
          <div className={`toggle-track-labeled ${labeledSwitch ? "on" : ""}`}>
            <span className="toggle-text toggle-text-on">On</span>
            <span className="toggle-text toggle-text-off">Off</span>
            <div className="toggle-thumb-labeled" />
          </div>
          <span className="toggle-label">Auto-save</span>
        </Switch>
        <Switch isSelected={true} isDisabled className="toggle-wrap">
          <div className="toggle-track on">
            <div className="toggle-thumb" />
          </div>
          <span className="toggle-label">Always On</span>
        </Switch>
        <Switch isSelected={false} isDisabled className="toggle-wrap">
          <div className="toggle-track">
            <div className="toggle-thumb" />
          </div>
          <span className="toggle-label">Unavailable</span>
        </Switch>
      </div>
    </div>
  );
}

function ButtonGroupDemo({ labels, defaultActive }: { labels: string[]; defaultActive: string }) {
  const [active, setActive] = useState(defaultActive);
  return (
    <div className="preview">
      <div className="btn-group">
        {labels.map(label => (
          <Button key={label} className={`btn ${active === label ? "active-group" : ""}`} onPress={() => setActive(label)}>{label}</Button>
        ))}
      </div>
    </div>
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
        <CodeBlock
          code={`<Button className="btn btn-primary">Primary</Button>\n<Button className="btn btn-secondary">Secondary</Button>\n<Button className="btn btn-ghost">Ghost</Button>\n<Button className="btn btn-danger">Danger</Button>\n<Button className="btn btn-danger-outline">Danger Outline</Button>\n<Button className="btn btn-info">Info</Button>\n<Button className="btn btn-warning">Warning</Button>\n<Button className="btn btn-link">Link</Button>`}
        />
      </SubSection>

      <SubSection title="Sizes">
        <div className="preview">
          <Button className="btn btn-primary btn-xl">Extra Large</Button>
          <Button className="btn btn-primary btn-lg">Large</Button>
          <Button className="btn btn-primary">Default</Button>
          <Button className="btn btn-primary btn-sm">Small</Button>
        </div>
        <CodeBlock
          code={`<Button className="btn btn-primary btn-xl">Extra Large</Button>\n<Button className="btn btn-primary btn-lg">Large</Button>\n<Button className="btn btn-primary">Default</Button>\n<Button className="btn btn-primary btn-sm">Small</Button>`}
        />
      </SubSection>

      <SubSection title="Pill Shape">
        <div className="preview">
          <Button className="btn btn-primary btn-pill">Primary Pill</Button>
          <Button className="btn btn-secondary btn-pill">Secondary Pill</Button>
          <Button className="btn btn-ghost btn-pill">Ghost Pill</Button>
        </div>
        <CodeBlock
          code={`<Button className="btn btn-primary btn-pill">Primary Pill</Button>\n<Button className="btn btn-secondary btn-pill">Secondary Pill</Button>`}
        />
      </SubSection>

      <SubSection title="States">
        <div className="preview">
          <Button className="btn btn-primary">Default</Button>
          <Button className="btn btn-primary" style={{background:"var(--brand-hover)",boxShadow:"var(--shadow-sm)"}}>Hover</Button>
          <Button className="btn btn-primary" style={{background:"var(--brand)"}}>Pressed</Button>
          <Button className="btn btn-primary" style={{boxShadow:"var(--shadow-focus)",outline:"2px solid var(--brand)",outlineOffset:2}}>Focus</Button>
          <Button className="btn btn-primary" isDisabled>Disabled</Button>
        </div>
        <CodeBlock
          code={`/* States are handled via React Aria data attributes */\n.btn[data-hovered]  { background: var(--brand-hover); }\n.btn[data-pressed]  { background: var(--brand-active); }\n.btn[data-focus-visible] { box-shadow: var(--shadow-focus); }\n.btn[data-disabled] { opacity: 0.5; cursor: not-allowed; }`}
        />
      </SubSection>

      <SubSection title="Button Group">
        <ButtonGroupDemo labels={["Today", "Week", "Month"]} defaultActive="Week" />
        <CodeBlock
          code={`const [active, setActive] = useState("Week");\n\n<div className="btn-group">\n  {["Today", "Week", "Month"].map(label => (\n    <Button\n      key={label}\n      className={\`btn \${active === label ? "active-group" : ""}\`}\n      onPress={() => setActive(label)}\n    >{label}</Button>\n  ))}\n</div>`}
        />
      </SubSection>

      <SubSection title="Loading">
        <div className="preview">
          <Button className="btn btn-primary btn-loading" isDisabled><Loader2 size={16} className="btn-spinner" /> Saving...</Button>
          <Button className="btn btn-secondary btn-loading" isDisabled><Loader2 size={16} className="btn-spinner" /> Loading...</Button>
          <Button className="btn btn-ghost btn-loading" isDisabled><Loader2 size={16} className="btn-spinner" /> Please wait</Button>
          <Button className="btn btn-danger btn-loading" isDisabled><Loader2 size={16} className="btn-spinner" /> Deleting...</Button>
        </div>
        <CodeBlock
          code={`<Button className="btn btn-primary btn-loading" isDisabled>\n  <Loader2 size={16} className="btn-spinner" /> Saving...\n</Button>`}
        />
      </SubSection>

      <SubSection title="Toggles">
        <ToggleDemo />
        <CodeBlock
          code={`/* Default toggle */\n<Switch isSelected={on} onChange={setOn} className="toggle-wrap">\n  <div className={\`toggle-track \${on ? "on" : ""}\`}>\n    <div className="toggle-thumb" />\n  </div>\n  <span className="toggle-label">Notifications</span>\n</Switch>\n\n/* Labeled toggle (On/Off) */\n<Switch isSelected={on} onChange={setOn} className="toggle-wrap">\n  <div className={\`toggle-track-labeled \${on ? "on" : ""}\`}>\n    <span className="toggle-text toggle-text-on">On</span>\n    <span className="toggle-text toggle-text-off">Off</span>\n    <div className="toggle-thumb-labeled" />\n  </div>\n  <span className="toggle-label">Auto-save</span>\n</Switch>\n\n/* Disabled toggle */\n<Switch isSelected={false} isDisabled className="toggle-wrap">\n  <div className="toggle-track">\n    <div className="toggle-thumb" />\n  </div>\n  <span className="toggle-label">Unavailable</span>\n</Switch>`}
        />
      </SubSection>

      <SubSection title="With Icons" description="React Aria buttons support any child content — place icons before or after text, or use icon-only buttons.">
        <div className="preview">
          <Button className="btn btn-primary"><Plus size={16} /> New Patient</Button>
          <Button className="btn btn-secondary"><Download size={16} /> Export</Button>
          <Button className="btn btn-ghost"><Share2 size={16} /> Share</Button>
          <Button className="btn btn-danger"><Trash2 size={16} /> Delete</Button>
        </div>
        <div className="sub-title" style={{ marginTop: "var(--sp-6)" }}>Icon on Right</div>
        <div className="preview">
          <Button className="btn btn-primary">Send <Send size={16} /></Button>
          <Button className="btn btn-secondary">Upload <Upload size={16} /></Button>
          <Button className="btn btn-ghost">Schedule <Calendar size={16} /></Button>
        </div>
        <div className="sub-title" style={{ marginTop: "var(--sp-6)" }}>Icon Only</div>
        <div className="preview">
          <Button className="btn btn-primary btn-icon"><Plus size={18} /></Button>
          <Button className="btn btn-secondary btn-icon"><Pencil size={18} /></Button>
          <Button className="btn btn-ghost btn-icon"><Heart size={18} /></Button>
          <Button className="btn btn-danger btn-icon"><Trash2 size={18} /></Button>
          <Button className="btn btn-info btn-icon"><Info size={18} /></Button>
        </div>
        <div className="sub-title" style={{ marginTop: "var(--sp-6)" }}>Sizes with Icons</div>
        <div className="preview">
          <Button className="btn btn-primary btn-xl"><Plus size={18} /> Extra Large</Button>
          <Button className="btn btn-primary btn-lg"><Plus size={16} /> Large</Button>
          <Button className="btn btn-primary"><Plus size={16} /> Default</Button>
          <Button className="btn btn-primary btn-sm"><Plus size={14} /> Small</Button>
        </div>
        <CodeBlock
          code={`/* Icon left */\n<Button className="btn btn-primary"><Plus size={16} /> New Patient</Button>\n\n/* Icon right */\n<Button className="btn btn-primary">Send <Send size={16} /></Button>\n\n/* Icon only */\n<Button className="btn btn-primary btn-icon"><Plus size={18} /></Button>`}
        />
      </SubSection>

    </Section>
  );
}

const COUNTRIES = [
  { id: "+1", flag: "🇺🇸", code: "+1", label: "US" },
  { id: "+44", flag: "🇬🇧", code: "+44", label: "UK" },
  { id: "+81", flag: "🇯🇵", code: "+81", label: "JP" },
  { id: "+86", flag: "🇨🇳", code: "+86", label: "CN" },
  { id: "+91", flag: "🇮🇳", code: "+91", label: "IN" },
  { id: "+61", flag: "🇦🇺", code: "+61", label: "AU" },
  { id: "+49", flag: "🇩🇪", code: "+49", label: "DE" },
  { id: "+33", flag: "🇫🇷", code: "+33", label: "FR" },
  { id: "+886", flag: "🇹🇼", code: "+886", label: "TW" },
  { id: "+82", flag: "🇰🇷", code: "+82", label: "KR" },
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function PhoneInputDemo() {
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [ext, setExt] = useState("");
  const [phone3, setPhone3] = useState("");
  return (
    <>
      {/* Country code only */}
      <div className="form-group">
        <Label className="form-label">With Country Code</Label>
        <div className="phone-input-group">
          <Select defaultSelectedKey="+1" className="phone-country-select">
            <Button className="phone-country-btn">
              <SelectValue />
              <ChevronDown size={14} />
            </Button>
            <Popover className="select-popover">
              <ListBox className="select-listbox">
                {COUNTRIES.map(c => (
                  <ListBoxItem key={c.id} id={c.id} className="select-option" textValue={`${c.label} ${c.code}`}>
                    {c.label} {c.code}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
          <TextField className="field" style={{flex: 1}} value={phone1} onChange={(v) => setPhone1(formatPhone(v))}>
            <Input className="input phone-input" placeholder="(555) 123-4567" />
          </TextField>
        </div>
      </div>

      {/* Country code + Ext */}
      <div className="form-group">
        <Label className="form-label">With Country Code & Ext.</Label>
        <div className="phone-input-group">
          <Select defaultSelectedKey="+1" className="phone-country-select">
            <Button className="phone-country-btn">
              <SelectValue />
              <ChevronDown size={14} />
            </Button>
            <Popover className="select-popover">
              <ListBox className="select-listbox">
                {COUNTRIES.map(c => (
                  <ListBoxItem key={c.id} id={c.id} className="select-option" textValue={`${c.label} ${c.code}`}>
                    {c.label} {c.code}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
          <TextField className="field" style={{flex: 1}} value={phone2} onChange={(v) => setPhone2(formatPhone(v))}>
            <Input className="input phone-input-middle" placeholder="(555) 123-4567" />
          </TextField>
          <div className="phone-ext">
            <span className="phone-ext-label">Ext.</span>
            <TextField className="field" style={{width: 40}} value={ext} onChange={(v) => setExt(v.replace(/\D/g, "").slice(0, 6))}>
              <Input className="input phone-ext-input" placeholder="0000" />
            </TextField>
          </div>
        </div>
      </div>

      {/* Simple — no country, no ext */}
      <div className="form-group">
        <Label className="form-label">Simple</Label>
        <TextField className="field" value={phone3} onChange={(v) => setPhone3(formatPhone(v))}>
          <Input className="input" placeholder="(555) 123-4567" />
        </TextField>
      </div>
    </>
  );
}

function InputWithIconDemo() {
  const [url, setUrl] = useState("https://vsee.com");
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div className="form-group">
        <TextField className="field" defaultValue="REF-2026-04-0382">
          <Label className="form-label">Reference Code</Label>
          <div className="input-icon-wrap">
            <Input className="input input-with-icon-right" readOnly />
            <Button className="input-icon-btn" onPress={() => { navigator.clipboard.writeText("REF-2026-04-0382"); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </TextField>
      </div>
      <div className="form-group">
        <TextField className="field" value={url} onChange={setUrl}>
          <Label className="form-label">Website URL</Label>
          <div className="input-icon-wrap">
            <Input className="input input-with-icon-right" placeholder="https://example.com" />
            <Button className="input-icon-btn" onPress={() => { if (url) window.open(url, "_blank"); }}>
              <ExternalLink size={16} />
            </Button>
          </div>
        </TextField>
      </div>
    </>
  );
}

function LoginDemo() {
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  return (
    <Form className="login-form">
      <div className="form-group">
        <TextField className="field">
          <Label className="form-label">Email</Label>
          <Input className="input" placeholder="you@example.com" />
        </TextField>
      </div>
      <div className="form-group">
        <TextField className="field">
          <Label className="form-label">Password</Label>
          <div className="input-icon-wrap">
            <Input className="input input-with-icon-right" type={showPw ? "text" : "password"} placeholder="Enter password" />
            <Button className="input-icon-btn" onPress={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </TextField>
      </div>
      <div className="login-options">
        <Checkbox isSelected={remember} onChange={setRemember} className="check-item">
          <div className={`check-box ${remember ? "checked" : ""}`}>
            {remember && <svg viewBox="0 0 14 14" fill="none" className="check-svg"><path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          Remember me
        </Checkbox>
        <Link className="login-forgot">Forgot password?</Link>
      </div>
      <Button className="btn btn-primary btn-block">Sign In</Button>
    </Form>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — FORM ELEMENTS
   ═══════════════════════════════════════════ */
function ComponentsForms() {
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);

  /* MultiSelect state */
  const allSpecialties = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology",
    "Neurology", "Oncology", "Orthopedics", "Pediatrics",
    "Psychiatry", "Pulmonology", "Radiology", "Urology",
  ];
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(["Cardiology", "Neurology"]);
  const [comboValue, setComboValue] = useState("");
  const filteredSpecialties = allSpecialties.filter(
    s => !selectedSpecialties.includes(s) && s.toLowerCase().includes(comboValue.toLowerCase())
  );

  return (
    <Section id="forms" label="Components" title="Form Elements"
      description="Clean, accessible form controls with clear focus states and error handling.">
      <div className="grid g2 form-grid">
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
              <Label className="form-label">Full Name <span className="req">*</span></Label>
              <Input className="input error" defaultValue="" />
              <div className="form-error-text">Full name is required</div>
            </TextField>
          </div>
          <div className="form-group">
            <SearchField className="field">
              <Label className="form-label">Search</Label>
              <div className="input-icon-wrap">
                <Input className="input input-with-icon-right" placeholder="Search patients..." />
                <Button className="input-icon-btn">
                  <Search size={16} />
                </Button>
              </div>
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
          <div className="sub-title" style={{marginTop:"var(--sp-6)"}}>MultiSelect</div>
          <div className="multiselect-wrapper">
            <Label className="form-label">Filter by Specialty</Label>
            <div className="multiselect-container">
              <TagGroup onRemove={(keys) => setSelectedSpecialties(prev => prev.filter(s => !keys.has(s)))}>
                <TagList className="multiselect-tags">
                  {selectedSpecialties.map(s => (
                    <Tag key={s} id={s} className="chip" textValue={s}>
                      {s}
                      <Button slot="remove" className="tag-remove"><X size={12} /></Button>
                    </Tag>
                  ))}
                </TagList>
              </TagGroup>
              <ComboBox
                inputValue={comboValue}
                onInputChange={setComboValue}
                selectedKey={null}
                onSelectionChange={(key) => {
                  if (key && !selectedSpecialties.includes(String(key))) {
                    setSelectedSpecialties(prev => [...prev, String(key)]);
                  }
                  setComboValue("");
                }}
                menuTrigger="focus"
                allowsCustomValue
              >
                <Input className="multiselect-input" placeholder={selectedSpecialties.length ? "Add more..." : "Search specialties..."} />
                <Popover className="dropdown-popover">
                  <ListBox className="dropdown-menu">
                    {filteredSpecialties.map(s => (
                      <ListBoxItem key={s} id={s} className="dropdown-item">{s}</ListBoxItem>
                    ))}
                    {filteredSpecialties.length === 0 && (
                      <ListBoxItem id="__empty" className="dropdown-item" style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>
                        No matches found
                      </ListBoxItem>
                    )}
                  </ListBox>
                </Popover>
              </ComboBox>
              <Button className="input-icon-btn" onPress={() => { const input = document.querySelector('.multiselect-input') as HTMLInputElement; input?.focus(); }}>
                <Plus size={16} />
              </Button>
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
              <Label className="form-label">Disabled field</Label>
              <Input className="input" defaultValue="Read-only value" />
            </TextField>
          </div>
        </div>

      </div>
      <CodeBlock
        code={`/* Text Input */\n<TextField className="field">\n  <Label className="form-label">Email address</Label>\n  <Input className="input" placeholder="you@example.com" />\n</TextField>\n\n/* Input with error */\n<TextField isInvalid className="field">\n  <Label className="form-label">Full Name <span className="req">*</span></Label>\n  <Input className="input error" />\n  <div className="form-error-text">Full name is required</div>\n</TextField>\n\n/* Select */\n<Select className="field">\n  <Label className="form-label">Specialty</Label>\n  <Button className="input select-trigger">\n    <SelectValue />\n    <ChevronDown size={16} />\n  </Button>\n  <Popover className="select-popover">\n    <ListBox className="select-listbox">\n      <ListBoxItem className="select-option">Option</ListBoxItem>\n    </ListBox>\n  </Popover>\n</Select>\n\n/* MultiSelect */\n<div className="multiselect-wrapper">\n  <Label className="form-label">Filter by Specialty</Label>\n  <div className="multiselect-container">\n    <TagGroup onRemove={handleRemove}>\n      <TagList className="multiselect-tags">\n        <Tag className="chip" textValue="Cardiology">\n          Cardiology\n          <Button slot="remove" className="tag-remove"><X size={12} /></Button>\n        </Tag>\n      </TagList>\n    </TagGroup>\n    <ComboBox menuTrigger="focus" allowsCustomValue>\n      <Input className="multiselect-input" placeholder="Add more..." />\n      <Popover className="dropdown-popover">\n        <ListBox className="dropdown-menu">\n          <ListBoxItem className="dropdown-item">Option</ListBoxItem>\n        </ListBox>\n      </Popover>\n    </ComboBox>\n  </div>\n</div>\n\n/* Checkbox */\n<Checkbox isSelected={checked} onChange={setChecked} className="check-item">\n  <div className={\`check-box \${checked ? "checked" : ""}\`} />\n  Label text\n</Checkbox>\n\n/* Radio Group */\n<RadioGroup defaultValue="phone" className="radio-list">\n  <Radio value="phone" className="radio-item">\n    <div className="radio-circle" /><span>Phone call</span>\n  </Radio>\n</RadioGroup>`}
      />

      <div style={{marginTop:"var(--sp-16)"}} />
      <SubSection title="Advanced Inputs" description="Specialized form controls for phone numbers, dates, and inputs with action icons.">
        <div className="grid g2 form-grid">
          {/* Phone Input */}
          <div className="card">
            <div className="sub-title">Phone Number</div>
            <PhoneInputDemo />
          </div>

          {/* Date Picker */}
          <div className="card">
            <div className="sub-title">Date Picker</div>
            <div className="form-group">
              <DatePicker defaultValue={today(getLocalTimeZone())} className="field">
                <Label className="form-label">Appointment Date</Label>
                <Group className="date-input-group">
                  <DateInput className="input date-input">
                    {(segment) => <DateSegment segment={segment} className="date-segment" />}
                  </DateInput>
                  <Button className="input-icon-btn"><Calendar size={16} /></Button>
                </Group>
                <Popover className="date-popover">
                  <Dialog className="date-dialog">
                    <AriaCalendar className="calendar">
                      <header className="calendar-header">
                        <Button slot="previous" className="calendar-nav-btn"><ChevronLeft size={16} /></Button>
                        <Heading className="calendar-heading" />
                        <Button slot="next" className="calendar-nav-btn"><ChevronRight size={16} /></Button>
                      </header>
                      <CalendarGrid className="calendar-grid">
                        <CalendarGridHeader>
                          {(day) => <CalendarHeaderCell className="calendar-header-cell">{day}</CalendarHeaderCell>}
                        </CalendarGridHeader>
                        <CalendarGridBody>
                          {(date) => <CalendarCell date={date} className="calendar-cell" />}
                        </CalendarGridBody>
                      </CalendarGrid>
                    </AriaCalendar>
                  </Dialog>
                </Popover>
              </DatePicker>
            </div>

            <div className="form-group">
              <TimeField defaultValue={new Time(9, 0)} className="field">
                <Label className="form-label">Appointment Time</Label>
                <Group className="date-input-group">
                  <DateInput className="input date-input">
                    {(segment) => <DateSegment segment={segment} className="date-segment" />}
                  </DateInput>
                  <div className="input-icon-btn" style={{pointerEvents:"none"}}><Clock size={16} /></div>
                </Group>
              </TimeField>
            </div>

            <div className="form-group">
              <DatePicker defaultValue={new CalendarDateTime(2026, 4, 3, 9, 0)} granularity="minute" className="field">
                <Label className="form-label">Appointment Date & Time</Label>
                <Group className="date-input-group">
                  <DateInput className="input date-input">
                    {(segment) => <DateSegment segment={segment} className="date-segment" />}
                  </DateInput>
                  <Button className="input-icon-btn"><Calendar size={16} /></Button>
                </Group>
                <Popover className="date-popover">
                  <Dialog className="date-dialog">
                    <AriaCalendar className="calendar">
                      <header className="calendar-header">
                        <Button slot="previous" className="calendar-nav-btn"><ChevronLeft size={16} /></Button>
                        <Heading className="calendar-heading" />
                        <Button slot="next" className="calendar-nav-btn"><ChevronRight size={16} /></Button>
                      </header>
                      <CalendarGrid className="calendar-grid">
                        <CalendarGridHeader>
                          {(day) => <CalendarHeaderCell className="calendar-header-cell">{day}</CalendarHeaderCell>}
                        </CalendarGridHeader>
                        <CalendarGridBody>
                          {(date) => <CalendarCell date={date} className="calendar-cell" />}
                        </CalendarGridBody>
                      </CalendarGrid>
                    </AriaCalendar>
                  </Dialog>
                </Popover>
              </DatePicker>
            </div>
          </div>

          {/* Input with Action Icon */}
          <div className="card">
            <div className="sub-title">Input with Action Icon</div>
            <InputWithIconDemo />
          </div>

          {/* Login */}
          <div className="card">
            <div className="sub-title">Login Form</div>
            <LoginDemo />
          </div>
        </div>
        <CodeBlock
          code={`/* Phone — with Country Code */\n<div className="phone-input-group">\n  <Select defaultSelectedKey="+1" className="phone-country-select">\n    <Button className="phone-country-btn">\n      <SelectValue /><ChevronDown size={14} />\n    </Button>\n    <Popover className="select-popover">\n      <ListBox className="select-listbox">\n        <ListBoxItem id="+1">US +1</ListBoxItem>\n      </ListBox>\n    </Popover>\n  </Select>\n  <TextField className="field" style={{flex: 1}}>\n    <Input className="input phone-input" placeholder="(555) 123-4567" />\n  </TextField>\n</div>\n\n/* Phone — with Country Code & Ext. */\n<div className="phone-input-group">\n  <Select defaultSelectedKey="+1" className="phone-country-select">\n    ...\n  </Select>\n  <TextField className="field" style={{flex: 1}}>\n    <Input className="input phone-input-middle" placeholder="(555) 123-4567" />\n  </TextField>\n  <div className="phone-ext">\n    <span className="phone-ext-label">Ext.</span>\n    <TextField className="field" style={{width: 80}}>\n      <Input className="input phone-ext-input" placeholder="0000" />\n    </TextField>\n  </div>\n</div>\n\n/* Phone — Simple */\n<TextField className="field">\n  <Input className="input" placeholder="(555) 123-4567" />\n</TextField>\n\n/* Date Picker */\n<DatePicker className="field">\n  <Label className="form-label">Appointment Date</Label>\n  <Group className="date-input-group">\n    <DateInput className="input date-input">\n      {(segment) => <DateSegment segment={segment} />}\n    </DateInput>\n    <Button className="input-icon-btn"><Calendar size={16} /></Button>\n  </Group>\n  <Popover className="date-popover">\n    <Dialog><Calendar>...</Calendar></Dialog>\n  </Popover>\n</DatePicker>\n\n/* Time Picker */\n<TimeField className="field">\n  <Label className="form-label">Appointment Time</Label>\n  <Group className="date-input-group">\n    <DateInput className="input date-input">\n      {(segment) => <DateSegment segment={segment} />}\n    </DateInput>\n    <div className="input-icon-btn" style={{pointerEvents:"none"}}><Clock size={16} /></div>\n  </Group>\n</TimeField>\n\n/* Date & Time Picker */\n<DatePicker granularity="minute" className="field">\n  <Label className="form-label">Appointment Date & Time</Label>\n  <Group className="date-input-group">\n    <DateInput className="input date-input">\n      {(segment) => <DateSegment segment={segment} />}\n    </DateInput>\n    <Button className="input-icon-btn"><Calendar size={16} /></Button>\n  </Group>\n  <Popover className="date-popover">\n    <Dialog><Calendar>...</Calendar></Dialog>\n  </Popover>\n</DatePicker>\n\n/* Input with Copy Action */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" readOnly />\n  <Button className="input-icon-btn"><Copy size={16} /></Button>\n</div>\n\n/* Input with External Link */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" />\n  <Button className="input-icon-btn"><ExternalLink size={16} /></Button>\n</div>\n\n/* Login Form */\n<Form className="login-form">\n  <TextField className="field">\n    <Label className="form-label">Email</Label>\n    <Input className="input" placeholder="you@example.com" />\n  </TextField>\n  <TextField className="field">\n    <Label className="form-label">Password</Label>\n    <div className="input-icon-wrap">\n      <Input className="input input-with-icon-right" type="password" />\n      <Button className="input-icon-btn"><Eye size={16} /></Button>\n    </div>\n  </TextField>\n  <Checkbox className="check-item">Remember me</Checkbox>\n  <Button className="btn btn-primary btn-block">Sign In</Button>\n</Form>`}
        />
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — BADGES, TAGS & STATUS
   ═══════════════════════════════════════════ */
function ComponentsBadges() {
  const [tags, setTags] = useState([
    { id: "1", name: "Hypertension" },
    { id: "2", name: "Diabetes Type 2" },
    { id: "3", name: "Asthma" },
    { id: "4", name: "Allergies" },
    { id: "5", name: "COPD" },
  ]);

  return (
    <Section id="badges" label="Components" title="Badges, Tags & Status"
      description="Communicate states, categories, and counts with subtle visual indicators. Tags support keyboard navigation and removal.">

      <SubSection title="Soft Badges">
        <div className="preview">
          <span className="badge badge-success"><span className="badge-dot" /> Active</span>
          <span className="badge badge-info"><span className="badge-dot" /> Scheduled</span>
          <span className="badge badge-warning"><span className="badge-dot" /> Pending</span>
          <span className="badge badge-danger"><span className="badge-dot" /> Overdue</span>
          <span className="badge badge-neutral"><span className="badge-dot" /> Draft</span>
        </div>
        <CodeBlock
          code={`<span className="badge badge-success"><span className="badge-dot" /> Active</span>\n<span className="badge badge-info"><span className="badge-dot" /> Scheduled</span>\n<span className="badge badge-warning"><span className="badge-dot" /> Pending</span>\n<span className="badge badge-danger"><span className="badge-dot" /> Overdue</span>\n<span className="badge badge-neutral"><span className="badge-dot" /> Draft</span>`}
        />
      </SubSection>

      <SubSection title="Solid Badges">
        <div className="preview">
          <span className="badge badge-solid-success">Approved</span>
          <span className="badge badge-solid-info">Processing</span>
          <span className="badge badge-solid-warning">Review</span>
          <span className="badge badge-solid-danger">Urgent</span>
          <span className="badge badge-solid-neutral">Default</span>
        </div>
        <CodeBlock
          code={`<span className="badge badge-solid-success">Approved</span>\n<span className="badge badge-solid-info">Processing</span>\n<span className="badge badge-solid-warning">Review</span>\n<span className="badge badge-solid-danger">Urgent</span>\n<span className="badge badge-solid-neutral">Default</span>`}
        />
      </SubSection>

      <SubSection title="Removable Tags">
        <TagGroup
          selectionMode="none"
          onRemove={(keys) => setTags(prev => prev.filter(t => !keys.has(t.id)))}
        >
          <Label className="form-label">Active Diagnoses</Label>
          <TagList className="tag-list">
            {tags.map(tag => (
              <Tag key={tag.id} id={tag.id} className="chip" textValue={tag.name}>
                {tag.name}
                <Button slot="remove" className="tag-remove"><X size={12} /></Button>
              </Tag>
            ))}
          </TagList>
        </TagGroup>
        <CodeBlock
          code={`<TagGroup selectionMode="none" onRemove={handleRemove}>\n  <Label className="form-label">Active Diagnoses</Label>\n  <TagList className="tag-list">\n    <Tag id="1" className="chip" textValue="Hypertension">\n      Hypertension\n      <Button slot="remove" className="tag-remove"><X size={12} /></Button>\n    </Tag>\n  </TagList>\n</TagGroup>`}
        />
      </SubSection>

    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — FEEDBACK & NOTIFICATIONS
   ═══════════════════════════════════════════ */
function ComponentsFeedback() {
  /* Notification state */
  const [notifications, setNotifications] = useState<Array<{
    id: number; type: "success" | "error" | "info" | "warning"; title: string; message: string;
  }>>([]);
  let notifCounter = 0;
  const addNotification = (type: "success" | "error" | "info" | "warning", title: string, message: string) => {
    const id = ++notifCounter + Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Section id="feedback" label="Components" title="Feedback & Notifications"
      description="Alerts, toasts, progress indicators, empty states, and notifications for communicating system state.">

      <SubSection title="Alerts">
        <div className="alert-stack">
          <div className="alert alert-success"><span className="alert-icon"><CheckCircle2 size={18} /></span><div><strong>Changes saved</strong><br/>Your patient record has been updated successfully.</div></div>
          <div className="alert alert-info"><span className="alert-icon"><Info size={18} /></span><div><strong>Appointment reminder</strong><br/>Your next appointment is scheduled for tomorrow at 2:00 PM.</div></div>
          <div className="alert alert-warning"><span className="alert-icon"><AlertTriangle size={18} /></span><div><strong>Outstanding balance</strong><br/>This patient has an unpaid balance of $45.00.</div></div>
          <div className="alert alert-danger"><span className="alert-icon"><AlertCircle size={18} /></span><div><strong>Form submission failed</strong><br/>Please check the required fields and try again.</div></div>
        </div>
        <CodeBlock
          code={`<div className="alert alert-success">\n  <span className="alert-icon"><CheckCircle2 size={18} /></span>\n  <div><strong>Changes saved</strong><br/>Your patient record has been updated.</div>\n</div>\n\n/* Variants: alert-success | alert-info | alert-warning | alert-danger */`}
        />
      </SubSection>

      <SubSection title="Toast Notifications">
        <div className="toast-demo">
          <div className="toast toast-success"><div className="toast-body"><div className="toast-title">Appointment confirmed</div><div className="toast-msg">Feb 26, 2026 at 10:00 AM with Dr. Chen</div></div><span className="toast-close"><X size={16} /></span></div>
          <div className="toast toast-danger"><div className="toast-body"><div className="toast-title">Connection lost</div><div className="toast-msg">Please check your internet connection.</div></div><span className="toast-close"><X size={16} /></span></div>
          <div className="toast toast-info"><div className="toast-body"><div className="toast-title">New message</div><div className="toast-msg">You have 3 unread messages from patients.</div></div><span className="toast-close"><X size={16} /></span></div>
        </div>
        <CodeBlock
          code={`<div className="toast toast-success">\n  <div className="toast-body">\n    <div className="toast-title">Appointment confirmed</div>\n    <div className="toast-msg">Feb 26, 2026 at 10:00 AM</div>\n  </div>\n  <span className="toast-close"><X size={16} /></span>\n</div>\n\n/* Variants: toast-success | toast-danger | toast-info */`}
        />
      </SubSection>

      <SubSection title="Empty State" description="Placeholder content shown when a section has no data. Provides context and a call to action.">
        <div className="grid g2" style={{ gap: "var(--sp-6)" }}>
          <div className="empty-state">
            <div className="empty-state-icon"><Inbox size={40} /></div>
            <div className="empty-state-title">No Results Found</div>
            <div className="empty-state-desc">There are no lab results for this patient yet. Results will appear here once ordered labs have been processed.</div>
            <Button className="btn btn-primary" style={{ marginTop: "var(--sp-4)" }}>Order Lab Test</Button>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={40} /></div>
            <div className="empty-state-title">No Documents</div>
            <div className="empty-state-desc">This patient has no uploaded documents. Upload clinical documents, consent forms, or imaging reports.</div>
            <Button className="btn btn-secondary" style={{ marginTop: "var(--sp-4)" }}>Upload Document</Button>
          </div>
        </div>
        <CodeBlock
          code={`<div className="empty-state">\n  <div className="empty-state-icon"><Inbox size={40} /></div>\n  <div className="empty-state-title">No Results Found</div>\n  <div className="empty-state-desc">Description text here.</div>\n  <Button className="btn btn-primary">Action</Button>\n</div>`}
        />
      </SubSection>

      <SubSection title="Notifications" description="Toast-style notifications that appear in the corner. Used for system feedback — order confirmations, errors, warnings, and informational messages.">
        <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap" }}>
          <Button className="btn btn-primary" onPress={() => addNotification("success", "Order Submitted", "CBC lab order has been sent to the lab successfully.")}>
            <CheckCircle size={16} /> Success
          </Button>
          <Button className="btn btn-danger" onPress={() => addNotification("error", "Submission Failed", "Unable to submit order. Please check the connection and try again.")}>
            <XCircle size={16} /> Error
          </Button>
          <Button className="btn btn-warning" onPress={() => addNotification("warning", "Session Expiring", "Your session will expire in 5 minutes. Save your work.")}>
            <AlertTriangle size={16} /> Warning
          </Button>
          <Button className="btn btn-info" onPress={() => addNotification("info", "New Message", "Dr. Chen has sent a message regarding patient Jane Doe.")}>
            <Info size={16} /> Info
          </Button>
        </div>
        <CodeBlock
          code={`<div className="notification notification-success">\n  <div className="notification-icon"><CheckCircle size={18} /></div>\n  <div className="notification-content">\n    <div className="notification-title">Order Submitted</div>\n    <div className="notification-message">CBC lab order sent.</div>\n  </div>\n  <button className="notification-close"><X size={14} /></button>\n</div>\n\n/* Variants: notification-success | notification-error | notification-warning | notification-info */`}
        />
      </SubSection>

      {/* Notification container */}
      <div className="notification-container">
        {notifications.map(n => (
          <div key={n.id} className={`notification notification-${n.type}`}>
            <div className="notification-icon">
              {n.type === "success" && <CheckCircle size={18} />}
              {n.type === "error" && <XCircle size={18} />}
              {n.type === "warning" && <AlertTriangle size={18} />}
              {n.type === "info" && <Info size={18} />}
            </div>
            <div className="notification-content">
              <div className="notification-title">{n.title}</div>
              <div className="notification-message">{n.message}</div>
            </div>
            <button className="notification-close" onClick={() => removeNotification(n.id)}><X size={14} /></button>
          </div>
        ))}
      </div>
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
        <CodeBlock
          code={`<div className="navbar">\n  <div className="navbar-logo">VSee</div>\n  <div className="navbar-links">\n    <div className="navbar-link active">Dashboard</div>\n    <div className="navbar-link">Patients</div>\n    <div className="navbar-link">Schedule</div>\n  </div>\n  <div className="navbar-right">\n    <Button className="btn btn-ghost btn-sm">Help</Button>\n    <div className="avatar avatar-sm">PN</div>\n  </div>\n</div>`}
        />
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
        <CodeBlock
          code={`<Tabs>\n  <TabList className="tabs" aria-label="Clinic tabs">\n    <Tab id="patients" className="tab-item">Patients</Tab>\n    <Tab id="visits" className="tab-item">All Visits</Tab>\n    <Tab id="docs" className="tab-item">Documents</Tab>\n  </TabList>\n  <TabPanel id="patients" className="tab-content">Content</TabPanel>\n  <TabPanel id="visits" className="tab-content">Content</TabPanel>\n</Tabs>`}
        />
      </SubSection>

      <SubSection title="Breadcrumb">
        <div className="card">
          <Breadcrumbs className="breadcrumb">
            <Breadcrumb><Link>Dashboard</Link><span className="breadcrumb-sep"> &gt; </span></Breadcrumb>
            <Breadcrumb><Link>Patients</Link><span className="breadcrumb-sep"> &gt; </span></Breadcrumb>
            <Breadcrumb><Link className="breadcrumb-current">Michelle Doe</Link></Breadcrumb>
          </Breadcrumbs>
        </div>
        <CodeBlock
          code={`<Breadcrumbs className="breadcrumb">\n  <Breadcrumb>\n    <Link>Dashboard</Link>\n    <span className="breadcrumb-sep"> > </span>\n  </Breadcrumb>\n  <Breadcrumb>\n    <Link>Patients</Link>\n    <span className="breadcrumb-sep"> > </span>\n  </Breadcrumb>\n  <Breadcrumb>\n    <Link className="breadcrumb-current">Michelle Doe</Link>\n  </Breadcrumb>\n</Breadcrumbs>`}
        />
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
        <CodeBlock
          code={`<div className="pagination">\n  <button className="page-btn disabled">&larr;</button>\n  <button className="page-btn active">1</button>\n  <button className="page-btn">2</button>\n  <button className="page-btn">3</button>\n  <button className="page-btn">&rarr;</button>\n</div>`}
        />
      </SubSection>

      <SubSection title="Anchor Navigation" description="In-page navigation for long scrollable content. Used in encounter notes and multi-section forms. The sticky bar at the top of this page is a live example.">
        <div className="preview-box">
          <p>The anchor navigation bar fixed at the top of this page is a live demo of this component. It highlights the current section as you scroll and supports click-to-jump.</p>
          <div style={{ marginTop: "var(--sp-4)" }}>
            <div className="code">
              <span className="c">{"// Anchor navigation — sticky bar with scroll tracking"}</span>{"\n"}
              <span className="t">{"<div"}</span>{" "}<span className="p">className</span>{"="}<span className="s">"anchor-bar"</span><span className="t">{">"}</span>{"\n"}
              {"  "}<span className="t">{"<a"}</span>{" "}<span className="p">href</span>{"="}<span className="s">"#section-id"</span>{" "}<span className="p">className</span>{"="}<span className="s">"anchor-link active"</span><span className="t">{">"}</span>{"\n"}
              {"    Section Name\n"}
              {"  "}<span className="t">{"</a>"}</span>{"\n"}
              <span className="t">{"</div>"}</span>
            </div>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — DROPDOWNS
   ═══════════════════════════════════════════ */
function ComponentsDropdowns() {
  const [actionMsg, setActionMsg] = useState("");

  return (
    <Section id="dropdowns" label="Components" title="Dropdowns"
      description="Dropdown menus, select lists, and action menus. All dropdowns are capped at 1/3 screen height and scroll when content overflows.">

      <SubSection title="Select Dropdown" description="Standard select input with a scrollable list of options.">
        <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
          <Select className="field" style={{ minWidth: 200 }}>
            <Label className="form-label">Country</Label>
            <Button className="input select-trigger">
              <SelectValue>{({isPlaceholder, selectedText}) => isPlaceholder ? "Select a country..." : selectedText}</SelectValue>
              <ChevronDown size={16} className="select-chevron" />
            </Button>
            <Popover className="select-popover">
              <ListBox className="select-listbox">
                {["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan", "Brazil", "India", "Mexico", "South Korea", "Netherlands", "Sweden", "Norway", "Denmark", "Finland", "Spain", "Italy", "Portugal", "Switzerland"].map((c) => (
                  <ListBoxItem key={c} className="select-option" id={c}>{c}</ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>

        </div>
        <CodeBlock
          code={`<Select className="field">\n  <Label className="form-label">Country</Label>\n  <Button className="input select-trigger">\n    <SelectValue>\n      {({isPlaceholder, selectedText}) =>\n        isPlaceholder ? "Select a country..." : selectedText}\n    </SelectValue>\n    <ChevronDown size={16} className="select-chevron" />\n  </Button>\n  <Popover className="select-popover">\n    <ListBox className="select-listbox">\n      <ListBoxItem className="select-option" id="us">United States</ListBoxItem>\n      <ListBoxItem className="select-option" id="ca">Canada</ListBoxItem>\n    </ListBox>\n  </Popover>\n</Select>`}
        />
      </SubSection>

      <SubSection title="Dropdown Button" description="Action menus triggered by a button. Used for contextual actions on rows, cards, and toolbars.">
        <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
          <MenuTrigger>
            <Button className="btn btn-secondary">
              Actions <ChevronDown size={16} />
            </Button>
            <Popover className="dropdown-popover">
              <Menu className="dropdown-menu" onAction={(key) => setActionMsg(`Action: ${key}`)}>
                <MenuItem id="edit" className="dropdown-item"><Edit3 size={14} /> Edit Record</MenuItem>
                <MenuItem id="copy" className="dropdown-item"><Copy size={14} /> Duplicate</MenuItem>
                <MenuItem id="export" className="dropdown-item"><ExternalLink size={14} /> Export PDF</MenuItem>
                <MenuItem id="archive" className="dropdown-item"><Archive size={14} /> Archive</MenuItem>
                <Separator className="dropdown-separator" />
                <MenuItem id="delete" className="dropdown-item dropdown-item-danger"><Trash2 size={14} /> Delete</MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>

          <MenuTrigger>
            <Button className="btn btn-ghost btn-icon">
              <MoreHorizontal size={18} />
            </Button>
            <Popover className="dropdown-popover">
              <Menu className="dropdown-menu" onAction={(key) => setActionMsg(`Action: ${key}`)}>
                <MenuItem id="view" className="dropdown-item">View Details</MenuItem>
                <MenuItem id="assign" className="dropdown-item">Assign Provider</MenuItem>
                <MenuItem id="flag" className="dropdown-item">Flag for Review</MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>

          <MenuTrigger>
            <Button className="btn btn-primary">
              New Order <ChevronDown size={16} />
            </Button>
            <Popover className="dropdown-popover">
              <Menu className="dropdown-menu" onAction={(key) => setActionMsg(`Action: ${key}`)}>
                <AriaSection>
                  <Header className="dropdown-header">Lab Orders</Header>
                  <MenuItem id="cbc" className="dropdown-item">Complete Blood Count</MenuItem>
                  <MenuItem id="bmp" className="dropdown-item">Basic Metabolic Panel</MenuItem>
                  <MenuItem id="lipid" className="dropdown-item">Lipid Panel</MenuItem>
                </AriaSection>
                <Separator className="dropdown-separator" />
                <AriaSection>
                  <Header className="dropdown-header">Imaging</Header>
                  <MenuItem id="xray" className="dropdown-item">X-Ray</MenuItem>
                  <MenuItem id="mri" className="dropdown-item">MRI</MenuItem>
                </AriaSection>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
        {actionMsg && <div className="action-feedback"><CheckCircle2 size={14} /> {actionMsg}</div>}
        <CodeBlock
          code={`<MenuTrigger>\n  <Button className="btn btn-secondary">\n    Actions <ChevronDown size={16} />\n  </Button>\n  <Popover className="dropdown-popover">\n    <Menu className="dropdown-menu" onAction={handleAction}>\n      <MenuItem id="edit" className="dropdown-item">\n        <Edit3 size={14} /> Edit Record\n      </MenuItem>\n      <Separator className="dropdown-separator" />\n      <MenuItem id="delete" className="dropdown-item dropdown-item-danger">\n        <Trash2 size={14} /> Delete\n      </MenuItem>\n    </Menu>\n  </Popover>\n</MenuTrigger>`}
        />
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — OTHERS
   ═══════════════════════════════════════════ */
function ComponentsOthers() {
  // commented out: Collapse / Accordion is commented out
  // const [openPanels, setOpenPanels] = useState<Set<string>>(new Set(["vitals"]));
  // const togglePanel = (id: string) => {
  //   setOpenPanels(prev => {
  //     const next = new Set(prev);
  //     if (next.has(id)) next.delete(id); else next.add(id);
  //     return next;
  //   });
  // };
  // const collapseData = [
  //   { id: "vitals", title: "Vitals", content: <><div>BP: 120/80 mmHg · HR: 72 bpm · Temp: 98.6°F · SpO₂: 98% · RR: 16/min · Weight: 165 lbs</div><div>BP: 111/70 mmHg · HR: 82 bpm · Temp: 88.6°F · SpO₂: 98% · RR: 13/min · Weight: 85 lbs</div><div>BP: 90/67 mmHg · HR: 68 bpm · Temp: 95.1°F · SpO₂: 99% · RR: 17/min · Weight: 105 lbs</div></> },
  //   { id: "allergies", title: "Allergies", content: "Penicillin (Rash) · Sulfa drugs (Anaphylaxis) · Latex (Contact dermatitis)" },
  //   { id: "medications", title: "Current Medications", content: "Lisinopril 10mg daily · Metformin 500mg BID · Albuterol inhaler PRN · Atorvastatin 20mg daily" },
  //   { id: "history", title: "Medical History", content: "Type 2 Diabetes (2019) · Hypertension (2020) · Asthma (childhood) · Appendectomy (2015)" },
  // ];

  return (
    <Section id="data" label="Components" title="Others"
      description="Cards, tables, avatars, tooltips, and collapsible sections for displaying structured content.">

      {/* <SubSection title="Patient Card">
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
        <CodeBlock
          code={`<div className="panel">\n  <div className="panel-header">Patient Summary</div>\n  <div className="panel-body">\n    <div className="patient-row">\n      <div className="avatar avatar-lg">MD</div>\n      <div>\n        <div className="patient-name">Michelle Doe</div>\n        <div className="patient-meta">Female · 46 years · ID: 10042</div>\n      </div>\n    </div>\n    <div className="badge-row">\n      <span className="badge badge-success"><span className="badge-dot" /> Active</span>\n    </div>\n  </div>\n  <div className="panel-footer">\n    <Button className="btn btn-primary btn-sm">View Chart</Button>\n  </div>\n</div>`}
        />
      </SubSection> */}

      {/* <SubSection title="Data Table">
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
        <CodeBlock
          code={`<div className="panel">\n  <table className="table">\n    <thead>\n      <tr><th>Patient</th><th>Gender</th><th>Age</th><th>Status</th><th></th></tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>\n          <div className="table-patient">\n            <div className="avatar avatar-sm">MD</div>\n            <div>\n              <div className="table-patient-name">Michelle Doe</div>\n              <div className="table-patient-email">patient@vsee.com</div>\n            </div>\n          </div>\n        </td>\n        <td>Female</td>\n        <td>46</td>\n        <td><span className="badge badge-success"><span className="badge-dot" /> Active</span></td>\n        <td><Button className="btn btn-ghost btn-sm">View</Button></td>\n      </tr>\n    </tbody>\n  </table>\n</div>`}
        />
      </SubSection> */}

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
        <CodeBlock
          code={`<div className="progress-item">\n  <div className="progress-head">\n    <span className="progress-label">Profile Complete</span>\n    <span className="progress-val">75%</span>\n  </div>\n  <div className="progress-track">\n    <div className="progress-bar progress-bar-brand" style={{ width: "75%" }} />\n  </div>\n</div>\n\n/* Bar variants: progress-bar-brand | progress-bar-info | progress-bar-danger */`}
        />
      </SubSection>

      <SubSection title="Avatars">
        <div className="preview">
          <div className="avatar avatar-sm">A</div>
          <div className="avatar">PN</div>
          <div className="avatar avatar-lg">MD</div>
          <div className="avatar avatar-xl">JS</div>
        </div>
        <CodeBlock
          code={`<div className="avatar avatar-sm">A</div>   /* 28px */\n<div className="avatar">PN</div>            /* 36px (default) */\n<div className="avatar avatar-lg">MD</div>  /* 48px */\n<div className="avatar avatar-xl">JS</div>  /* 64px */`}
        />
      </SubSection>

      {/* <SubSection title="Collapse / Accordion" description="Expandable content sections. Used throughout the patient chart to organize vitals, history, allergies, and other clinical data.">
        <div className="collapse-group">
          {collapseData.map(item => (
            <div key={item.id} className={`collapse-item ${openPanels.has(item.id) ? "open" : ""}`}>
              <button className="collapse-trigger" onClick={() => togglePanel(item.id)}>
                <span className="collapse-trigger-text">{item.title}</span>
                {openPanels.has(item.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openPanels.has(item.id) && (
                <div className="collapse-content">{item.content}</div>
              )}
            </div>
          ))}
        </div>
        <CodeBlock
          code={`<div className="collapse-group">\n  <div className="collapse-item open">\n    <button className="collapse-trigger">\n      <span className="collapse-trigger-text">Vitals</span>\n      <ChevronUp size={16} />\n    </button>\n    <div className="collapse-content">BP: 120/80 mmHg · HR: 72 bpm</div>\n  </div>\n  <div className="collapse-item">\n    <button className="collapse-trigger">\n      <span className="collapse-trigger-text">Allergies</span>\n      <ChevronDown size={16} />\n    </button>\n  </div>\n</div>`}
        />
      </SubSection> */}
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — OVERLAYS
   ═══════════════════════════════════════════ */
function ComponentsOverlays() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Section id="overlay" label="Components" title="Overlays"
      description="Modals, tooltips, and drawer patterns for focused interactions.">

      <SubSection title="Modal / Dialog">
        <div className="modal-demo-bg">
          <div className="modal-box">
            <div className="modal-head">
              <h3>Cancel Appointment</h3>
              <Button className="modal-close"><X size={20} /></Button>
            </div>
            <div className="modal-content">
              <p style={{color:"var(--text-secondary)",marginBottom:"var(--sp-4)"}}>
                Are you sure you want to cancel this appointment with <strong>Dr. Sarah Chen</strong> on Feb 26, 2026?
              </p>
              <div className="form-group">
                <Select className="field">
                  <Label className="form-label">Reason for cancellation</Label>
                  <Button className="input select-trigger">
                    <SelectValue>{({isPlaceholder, selectedText}) => isPlaceholder ? "Select a reason..." : selectedText}</SelectValue>
                    <ChevronDown size={16} className="select-chevron" />
                  </Button>
                  <Popover className="select-popover">
                    <ListBox className="select-listbox">
                      <ListBoxItem id="conflict" className="select-option">Schedule conflict</ListBoxItem>
                      <ListBoxItem id="better" className="select-option">Feeling better</ListBoxItem>
                      <ListBoxItem id="other" className="select-option">Other</ListBoxItem>
                    </ListBox>
                  </Popover>
                </Select>
              </div>
            </div>
            <div className="modal-actions">
              <Button className="btn btn-ghost">Keep Appointment</Button>
              <Button className="btn btn-danger">Cancel Appointment</Button>
            </div>
          </div>
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
        <CodeBlock
          code={`<TooltipTrigger delay={300}>\n  <Button className="btn btn-ghost">Hover target</Button>\n  <AriaTooltip placement="top" className="tooltip-bubble">\n    This is a tooltip\n  </AriaTooltip>\n</TooltipTrigger>`}
        />
      </SubSection>

      <SubSection title="Drawer" description="A slide-in panel from the side of the screen. Used for detail views, editing records, and order entry without leaving the current context.">
        <Button className="btn btn-primary" onPress={() => setDrawerOpen(true)}>
          Open Patient Details
        </Button>

        {drawerOpen && (
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
            <div className="drawer-panel" onClick={e => e.stopPropagation()}>
              <div className="drawer-header">
                <div>
                  <div className="drawer-title">Patient Details</div>
                  <div className="drawer-subtitle">Jane Doe · MRN: 00284731</div>
                </div>
                <button className="drawer-close" onClick={() => setDrawerOpen(false)}><X size={20} /></button>
              </div>
              <div className="drawer-body">
                <div className="drawer-section-title">Demographics</div>
                <div className="drawer-field"><span className="drawer-label">Date of Birth</span><span>March 15, 1985</span></div>
                <div className="drawer-field"><span className="drawer-label">Gender</span><span>Female</span></div>
                <div className="drawer-field"><span className="drawer-label">Phone</span><span>(555) 234-5678</span></div>
                <div className="drawer-field"><span className="drawer-label">Email</span><span>jane.doe@email.com</span></div>

                <div className="divider" />

                <div className="drawer-section-title">Insurance</div>
                <div className="drawer-field"><span className="drawer-label">Provider</span><span>BlueCross BlueShield</span></div>
                <div className="drawer-field"><span className="drawer-label">Plan ID</span><span>BCB-9928371</span></div>
                <div className="drawer-field"><span className="drawer-label">Group</span><span>GRP-44210</span></div>

                <div className="divider" />

                <div className="drawer-section-title">Recent Encounters</div>
                <div className="drawer-encounter">
                  <div className="drawer-encounter-date">Mar 28, 2026</div>
                  <div className="drawer-encounter-type">Telemedicine — Follow-up</div>
                  <div className="drawer-encounter-provider">Dr. Sarah Chen</div>
                </div>
                <div className="drawer-encounter">
                  <div className="drawer-encounter-date">Feb 10, 2026</div>
                  <div className="drawer-encounter-type">In-Person — Annual Physical</div>
                  <div className="drawer-encounter-provider">Dr. Michael Park</div>
                </div>
              </div>
              <div className="drawer-footer">
                <Button className="btn btn-secondary" onPress={() => setDrawerOpen(false)}>Close</Button>
                <Button className="btn btn-primary">Edit Patient</Button>
              </div>
            </div>
          </div>
        )}
        <CodeBlock
          code={`<div className="drawer-overlay" onClick={close}>\n  <div className="drawer-panel" onClick={e => e.stopPropagation()}>\n    <div className="drawer-header">\n      <div>\n        <div className="drawer-title">Patient Details</div>\n        <div className="drawer-subtitle">Jane Doe · MRN: 00284731</div>\n      </div>\n      <button className="drawer-close" onClick={close}><X size={20} /></button>\n    </div>\n    <div className="drawer-body">\n      <div className="drawer-section-title">Demographics</div>\n      <div className="drawer-field">\n        <span className="drawer-label">Date of Birth</span>\n        <span>March 15, 1985</span>\n      </div>\n    </div>\n    <div className="drawer-footer">\n      <Button className="btn btn-secondary">Close</Button>\n      <Button className="btn btn-primary">Edit Patient</Button>\n    </div>\n  </div>\n</div>`}
        />
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   PATTERNS — EMR
   ═══════════════════════════════════════════ */
/*function PatternsEMR() {
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
          <div className="panel-header">Latest Vitals <span style={{fontSize:"var(--text-sm)",color:"var(--text-tertiary)",fontWeight:400,marginLeft:"auto"}}>Feb 26, 2026</span></div>
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
*/
/* ═══════════════════════════════════════════
   PATTERNS — LAYOUTS
   ═══════════════════════════════════════════ */
function PatternsLayouts() {
  const sidebarPages: Record<string, { title: string; content: React.ReactNode }> = {
    Dashboard: {
      title: "Dashboard",
      content: (
        <>
          <p style={{color:"var(--text-secondary)", marginBottom:"var(--sp-4)"}}>Welcome back, Dr. Chen. Here's your overview for today.</p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"var(--sp-3)"}}>
            {[{label:"Patients Today",val:"12"},{label:"Pending Orders",val:"5"},{label:"Messages",val:"3"}].map(s=>(
              <div key={s.label} style={{background:"var(--grey-100)",borderRadius:"var(--r-md)",padding:"var(--sp-4)",textAlign:"center"}}>
                <div style={{fontSize:"var(--text-2xl)",fontWeight:700,color:"var(--brand)"}}>{s.val}</div>
                <div style={{fontSize:"var(--text-sm)",color:"var(--text-secondary)"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    Patients: {
      title: "Patients",
      content: (
        <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-3)"}}>
          {[{name:"Michelle Doe",id:"10042",status:"Active"},{name:"John Smith",id:"10089",status:"Pending"},{name:"Alice Wong",id:"10115",status:"Inactive"}].map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"var(--sp-3)",background:"var(--grey-100)",borderRadius:"var(--r-md)"}}>
              <div><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:"var(--text-sm)",color:"var(--text-tertiary)"}}>ID: {p.id}</div></div>
              <span className={`badge ${p.status==="Active"?"badge-success":p.status==="Pending"?"badge-warning":"badge-neutral"}`}><span className="badge-dot" /> {p.status}</span>
            </div>
          ))}
        </div>
      ),
    },
    Appointments: {
      title: "Appointments",
      content: (
        <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-3)"}}>
          {[{time:"9:00 AM",patient:"Michelle Doe",type:"Follow-up"},{time:"10:30 AM",patient:"John Smith",type:"New Patient"},{time:"2:00 PM",patient:"Alice Wong",type:"Telemedicine"}].map(a=>(
            <div key={a.time} style={{display:"flex",gap:"var(--sp-4)",alignItems:"center",padding:"var(--sp-3)",background:"var(--grey-100)",borderRadius:"var(--r-md)"}}>
              <div style={{fontWeight:600,color:"var(--brand)",minWidth:70}}>{a.time}</div>
              <div><div style={{fontWeight:600}}>{a.patient}</div><div style={{fontSize:"var(--text-sm)",color:"var(--text-tertiary)"}}>{a.type}</div></div>
            </div>
          ))}
        </div>
      ),
    },
    Messages: {
      title: "Messages",
      content: <p style={{color:"var(--text-secondary)"}}>You have 3 unread messages from patients. Check your inbox for the latest updates.</p>,
    },
    "Lab Results": {
      title: "Lab Results",
      content: <p style={{color:"var(--text-secondary)"}}>2 new lab results are ready for review. Click a result to view the full report.</p>,
    },
    Settings: {
      title: "Settings",
      content: <p style={{color:"var(--text-secondary)"}}>Manage your profile, notification preferences, and clinic configuration.</p>,
    },
  };

  const [activePage, setActivePage] = useState("Dashboard");
  const page = sidebarPages[activePage];

  return (
    <Section id="layouts" label="Patterns" title="Layouts"
      description="Common layout patterns used across the VSee Clinic application.">

      <SubSection title="Sidebar + Content">
        <div className="sidebar-layout">
          <div className="sidebar-panel">
            <div className="sidebar-heading">Menu</div>
            {Object.keys(sidebarPages).map((item) => (
              <div key={item} className={`sidebar-menu-item ${activePage === item ? "active" : ""}`} onClick={() => setActivePage(item)}>{item}</div>
            ))}
          </div>
          <div className="sidebar-content">
            <div style={{fontSize:20,fontWeight:700,marginBottom:"var(--sp-4)"}}>{page.title}</div>
            {page.content}
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   PATTERNS — WHITE-LABEL THEMING
   ═══════════════════════════════════════════ */
function PatternsTheming({ brandTheme, setBrandTheme }: { brandTheme: string; setBrandTheme: (t: string) => void }) {
  return (
    <Section id="theming" label="Engineering" title="White-Label Theming"
      description={`VSee supports white-label customization per tenant. Override CSS variables via [data-theme] attributes. Click a card below to switch the theme live.`}>

      <div className="grid g3" style={{gap:"var(--sp-4)"}}>
        {[
          { name: "VSee Default", color: "#0D875C", theme: "" },
          { name: "Ocean Blue", color: "#0891B2", theme: "blue" },
          { name: "Royal Purple", color: "#7C3AED", theme: "purple" },
        ].map((t) => (
          <div key={t.name} className={`theme-card ${brandTheme === t.theme ? "theme-card-active" : ""}`} style={{cursor:"pointer"}} onClick={() => setBrandTheme(t.theme)}>
            <div className="theme-card-header"><div className="theme-card-dot" style={{background:t.color}} /> {t.name}</div>
            <div className="theme-card-body">
              <button className="theme-btn-primary" style={{background:t.color}}>Primary</button>
              <button className="theme-btn-secondary" style={{color:t.color,borderColor:t.color}}>Secondary</button>
            </div>
          </div>
        ))}
      </div>

      <div className="sub-title" style={{marginTop:"var(--sp-8)"}}>How to Switch Themes</div>
      <div className="sub-desc">Add a <code className="code-inline">data-theme</code> attribute to the <code className="code-inline">{"<html>"}</code> element. The attribute overrides all <code className="code-inline">--brand-*</code> CSS variables globally.</div>
      <div className="code">
        <span className="c">{"/* 1. In HTML — set the attribute */"}</span>{"\n"}
        <span className="t">{"<html"}</span>{" "}<span className="p">data-theme</span>{"="}<span className="s">"blue"</span><span className="t">{">"}</span>{"   "}<span className="c">{"/* Ocean Blue */"}</span>{"\n"}
        <span className="t">{"<html"}</span>{" "}<span className="p">data-theme</span>{"="}<span className="s">"purple"</span><span className="t">{">"}</span>{" "}<span className="c">{"/* Royal Purple */"}</span>{"\n"}
        <span className="t">{"<html>"}</span>{"                  "}<span className="c">{"/* Default Green (no attribute) */"}</span>{"\n\n"}

        <span className="c">{"/* 2. In JavaScript — switch dynamically */"}</span>{"\n"}
        <span className="c">{"// Set theme"}</span>{"\n"}
        {"document.documentElement."}<span className="p">setAttribute</span>{"("}<span className="s">"data-theme"</span>{", "}<span className="s">"blue"</span>{");\n\n"}
        <span className="c">{"// Reset to default"}</span>{"\n"}
        {"document.documentElement."}<span className="p">removeAttribute</span>{"("}<span className="s">"data-theme"</span>{");\n\n"}

        <span className="c">{"/* 3. In React — with state */"}</span>{"\n"}
        <span className="k">{"const"}</span>{" [theme, setTheme] = "}<span className="p">{"useState"}</span>{'("");\n\n'}
        <span className="p">{"useEffect"}</span>{"(() => {\n"}
        {"  "}<span className="k">{"if"}</span>{" (theme) {\n"}
        {"    document.documentElement."}<span className="p">setAttribute</span>{"("}<span className="s">"data-theme"</span>{", theme);\n"}
        {"  } "}<span className="k">{"else"}</span>{" {\n"}
        {"    document.documentElement."}<span className="p">removeAttribute</span>{"("}<span className="s">"data-theme"</span>{");\n"}
        {"  }\n"}
        {"}, [theme]);\n"}
      </div>

      <div className="sub-title" style={{marginTop:"var(--sp-8)"}}>Creating a Custom Theme</div>
      <div className="sub-desc">Define a new <code className="code-inline">[data-theme]</code> block with all 7 brand variables:</div>
      <div className="code">
        <span className="k">{"[data-theme=\"your-brand\"]"}</span>{" {\n"}
        {"  "}<span className="p">--brand</span>{": "}<span className="v">#______</span>{";        "}<span className="c">{"/* Main brand color */"}</span>{"\n"}
        {"  "}<span className="p">--brand-hover</span>{": "}<span className="v">#______</span>{";  "}<span className="c">{"/* Slightly darker for hover */"}</span>{"\n"}
        {"  "}<span className="p">--brand-active</span>{": "}<span className="v">#______</span>{"; "}<span className="c">{"/* Darker for pressed/active */"}</span>{"\n"}
        {"  "}<span className="p">--brand-dark</span>{": "}<span className="v">#______</span>{";   "}<span className="c">{"/* Dark variant (gradients) */"}</span>{"\n"}
        {"  "}<span className="p">--brand-darker</span>{": "}<span className="v">#______</span>{"; "}<span className="c">{"/* Darkest variant (gradients) */"}</span>{"\n"}
        {"  "}<span className="p">--brand-light</span>{": "}<span className="v">#______</span>{";  "}<span className="c">{"/* Light tint background */"}</span>{"\n"}
        {"  "}<span className="p">--brand-50</span>{": "}<span className="v">#______</span>{";     "}<span className="c">{"/* Very light tint background */"}</span>{"\n"}
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
    <Section id="formio" label="Engineering" title="Form.io + React Aria"
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
        <div className="code">
          <span className="c">{"// Returned by GET /form/patient-intake (Form.io API)"}</span>{"\n"}
          {"{\n"}
          {"  "}<span className="p">"title"</span>{": "}<span className="s">"Patient Intake Form"</span>{",\n"}
          {"  "}<span className="p">"components"</span>{": [\n"}
          {"    {\n"}
          {"      "}<span className="p">"type"</span>{":        "}<span className="s">"ariaTextfield"</span>{",    "}<span className="c">{"// ← custom component key"}</span>{"\n"}
          {"      "}<span className="p">"key"</span>{":         "}<span className="s">"firstName"</span>{",\n"}
          {"      "}<span className="p">"label"</span>{":       "}<span className="s">"First Name"</span>{",\n"}
          {"      "}<span className="p">"placeholder"</span>{": "}<span className="s">"Jane"</span>{",\n"}
          {"      "}<span className="p">"validate"</span>{":    { "}<span className="p">"required"</span>{": "}<span className="v">true</span>{" }\n"}
          {"    },\n"}
          {"    {\n"}
          {"      "}<span className="p">"type"</span>{":        "}<span className="s">"ariaTextfield"</span>{",\n"}
          {"      "}<span className="p">"key"</span>{":         "}<span className="s">"lastName"</span>{",\n"}
          {"      "}<span className="p">"label"</span>{":       "}<span className="s">"Last Name"</span>{",\n"}
          {"      "}<span className="p">"placeholder"</span>{": "}<span className="s">"Doe"</span>{",\n"}
          {"      "}<span className="p">"validate"</span>{":    { "}<span className="p">"required"</span>{": "}<span className="v">true</span>{" }\n"}
          {"    },\n"}
          {"    {\n"}
          {"      "}<span className="p">"type"</span>{":        "}<span className="s">"ariaTextfield"</span>{",\n"}
          {"      "}<span className="p">"inputType"</span>{":   "}<span className="s">"date"</span>{",\n"}
          {"      "}<span className="p">"key"</span>{":         "}<span className="s">"dob"</span>{",\n"}
          {"      "}<span className="p">"label"</span>{":       "}<span className="s">"Date of Birth"</span>{",\n"}
          {"      "}<span className="p">"validate"</span>{":    { "}<span className="p">"required"</span>{": "}<span className="v">true</span>{" }\n"}
          {"    },\n"}
          {"    {\n"}
          {"      "}<span className="p">"type"</span>{":        "}<span className="s">"ariaSelect"</span>{",       "}<span className="c">{"// ← custom Select"}</span>{"\n"}
          {"      "}<span className="p">"key"</span>{":         "}<span className="s">"insurance"</span>{",\n"}
          {"      "}<span className="p">"label"</span>{":       "}<span className="s">"Insurance Provider"</span>{",\n"}
          {"      "}<span className="p">"data"</span>{": {\n"}
          {"        "}<span className="p">"values"</span>{": [\n"}
          {"          { "}<span className="p">"label"</span>{": "}<span className="s">"Aetna"</span>{",            "}<span className="p">"value"</span>{": "}<span className="s">"aetna"</span>{"    },\n"}
          {"          { "}<span className="p">"label"</span>{": "}<span className="s">"BlueCross"</span>{",        "}<span className="p">"value"</span>{": "}<span className="s">"bluecross"</span>{" },\n"}
          {"          { "}<span className="p">"label"</span>{": "}<span className="s">"Cigna"</span>{",            "}<span className="p">"value"</span>{": "}<span className="s">"cigna"</span>{"    },\n"}
          {"          { "}<span className="p">"label"</span>{": "}<span className="s">"UnitedHealthcare"</span>{", "}<span className="p">"value"</span>{": "}<span className="s">"uhc"</span>{"      }\n"}
          {"        ]\n"}
          {"      }\n"}
          {"    },\n"}
          {"    {\n"}
          {"      "}<span className="p">"type"</span>{":        "}<span className="s">"ariaTextarea"</span>{",     "}<span className="c">{"// ← custom Textarea"}</span>{"\n"}
          {"      "}<span className="p">"key"</span>{":         "}<span className="s">"reasonForVisit"</span>{",\n"}
          {"      "}<span className="p">"label"</span>{":       "}<span className="s">"Reason for Visit"</span>{",\n"}
          {"      "}<span className="p">"placeholder"</span>{": "}<span className="s">"Describe your symptoms..."</span>{",\n"}
          {"      "}<span className="p">"rows"</span>{":        "}<span className="v">3</span>{"\n"}
          {"    },\n"}
          {"    {\n"}
          {"      "}<span className="p">"type"</span>{":        "}<span className="s">"ariaCheckbox"</span>{",     "}<span className="c">{"// ← custom Checkbox"}</span>{"\n"}
          {"      "}<span className="p">"key"</span>{":         "}<span className="s">"hipaaConsent"</span>{",\n"}
          {"      "}<span className="p">"label"</span>{":       "}<span className="s">"I have read and agree to the HIPAA Privacy Notice"</span>{",\n"}
          {"      "}<span className="p">"validate"</span>{":    { "}<span className="p">"required"</span>{": "}<span className="v">true</span>{" }\n"}
          {"    },\n"}
          {"    {\n"}
          {"      "}<span className="p">"type"</span>{":        "}<span className="s">"ariaButton"</span>{",\n"}
          {"      "}<span className="p">"action"</span>{":      "}<span className="s">"submit"</span>{",\n"}
          {"      "}<span className="p">"label"</span>{":       "}<span className="s">"Submit Intake Form"</span>{"\n"}
          {"    }\n"}
          {"  ]\n"}
          {"}"}
        </div>
      </SubSection>

      {/* ── Custom Component Bridge ── */}
      <SubSection title="Custom Component Registration">
        <p className="sub-desc">
          Each Form.io component type is mapped to a React component. The <code className="code-inline">component</code> object carries the schema properties; <code className="code-inline">onChange</code> updates the submission data.
        </p>
        <div className="code">
          <span className="c">{"// src/formio/aria-components.tsx"}</span>{"\n"}
          <span className="k">import</span>{" { "}<span className="f">TextField</span>{", "}<span className="f">Input</span>{", "}<span className="f">Label</span>{", "}<span className="f">TextArea</span>{", "}<span className="f">Checkbox</span>{", "}<span className="f">Button</span>{", "}<span className="f">Text</span>{" }\n"}
          {"  "}<span className="k">from</span>{" "}<span className="s">"react-aria-components"</span>{"\n\n"}
          <span className="c">{"// ariaTextfield → React Aria <TextField> + <Input>"}</span>{"\n"}
          <span className="k">export function</span>{" "}<span className="f">AriaTextfield</span>{"({ component, value, onChange, error }) {\n"}
          {"  "}<span className="k">return</span>{" (\n"}
          {"    "}<span className="t">{"<TextField"}</span>{"\n"}
          {"      "}<span className="p">value</span>{"={value ?? "}<span className="s">""</span>{"}\n"}
          {"      "}<span className="p">onChange</span>{"={onChange}\n"}
          {"      "}<span className="p">isInvalid</span>{"={!!error}\n"}
          {"      "}<span className="p">isRequired</span>{"={component.validate?.required}\n"}
          {"    "}<span className="t">{">"}</span>{"\n"}
          {"      "}<span className="t">{"<Label>"}</span>{"\n"}
          {"        {component.label}\n"}
          {"        {component.validate?.required && (\n"}
          {"          "}<span className="t">{"<span"}</span>{" "}<span className="p">style</span>{"={{ color: "}<span className="s">"var(--danger)"</span>{", marginLeft: "}<span className="v">2</span>{" }}"}<span className="t">{">"}</span>{"*"}<span className="t">{"</span>"}</span>{"\n"}
          {"        )}\n"}
          {"      "}<span className="t">{"</Label>"}</span>{"\n"}
          {"      "}<span className="t">{"<Input"}</span>{"\n"}
          {"        "}<span className="p">type</span>{"={component.inputType ?? "}<span className="s">"text"</span>{"}\n"}
          {"        "}<span className="p">placeholder</span>{"={component.placeholder}\n"}
          {"      "}<span className="t">{"/>"}</span>{"\n"}
          {"      {error && (\n"}
          {"        "}<span className="t">{"<Text"}</span>{" "}<span className="p">slot</span>{"="}<span className="s">"errorMessage"</span><span className="t">{">"}</span>{"{error}"}<span className="t">{"</Text>"}</span>{"\n"}
          {"      )}\n"}
          {"    "}<span className="t">{"</TextField>"}</span>{"\n"}
          {"  )\n"}
          {"}\n\n"}
          <span className="c">{"// ariaCheckbox → React Aria <Checkbox>"}</span>{"\n"}
          <span className="k">export function</span>{" "}<span className="f">AriaCheckbox</span>{"({ component, value, onChange, error }) {\n"}
          {"  "}<span className="k">return</span>{" (\n"}
          {"    "}<span className="t">{"<Checkbox"}</span>{"\n"}
          {"      "}<span className="p">isSelected</span>{"={!!value}\n"}
          {"      "}<span className="p">onChange</span>{"={(checked) => onChange(!!checked)}\n"}
          {"      "}<span className="p">isInvalid</span>{"={!!error}\n"}
          {"    "}<span className="t">{">"}</span>{"\n"}
          {"      {component.label}\n"}
          {"    "}<span className="t">{"</Checkbox>"}</span>{"\n"}
          {"  )\n"}
          {"}\n\n"}
          <span className="c">{"// Register all custom components"}</span>{"\n"}
          <span className="k">export const</span>{" "}<span className="f">customComponents</span>{" = {\n"}
          {"  "}<span className="p">ariaTextfield</span>{": "}<span className="f">AriaTextfield</span>{",\n"}
          {"  "}<span className="p">ariaTextarea</span>{":  "}<span className="f">AriaTextarea</span>{",\n"}
          {"  "}<span className="p">ariaSelect</span>{":    "}<span className="f">AriaSelect</span>{",\n"}
          {"  "}<span className="p">ariaCheckbox</span>{":  "}<span className="f">AriaCheckbox</span>{",\n"}
          {"  "}<span className="p">ariaButton</span>{":    "}<span className="f">AriaButton</span>{",\n"}
          {"}"}
        </div>
      </SubSection>

      {/* ── Wiring ── */}
      <SubSection title="Wiring it Together">
        <div className="code">
          <span className="c">{"// src/pages/PatientIntake.tsx"}</span>{"\n"}
          <span className="k">import</span>{" { "}<span className="f">Form</span>{" } "}<span className="k">from</span>{" "}<span className="s">"@formio/react"</span>{"\n"}
          <span className="k">import</span>{" { "}<span className="f">customComponents</span>{" } "}<span className="k">from</span>{" "}<span className="s">"@/formio/aria-components"</span>{"\n\n"}
          <span className="k">export function</span>{" "}<span className="f">PatientIntakePage</span>{"() {\n"}
          {"  "}<span className="k">const</span>{" "}<span className="f">handleSubmit</span>{" = (submission: { data: Record<string, unknown> }) => {\n"}
          {"    console."}<span className="f">log</span>{"("}<span className="s">"Form.io submission →"</span>{", submission.data)\n"}
          {"    "}<span className="c">{"// POST to your backend or Form.io submission endpoint"}</span>{"\n"}
          {"  }\n\n"}
          {"  "}<span className="k">return</span>{" (\n"}
          {"    "}<span className="t">{"<Form"}</span>{"\n"}
          {"      "}<span className="c">{"// Fetch schema from Form.io server by form path"}</span>{"\n"}
          {"      "}<span className="p">src</span>{"="}<span className="s">"https://your-project.form.io/patient-intake"</span>{"\n\n"}
          {"      "}<span className="c">{"// Inject React Aria as the renderer for each component type"}</span>{"\n"}
          {"      "}<span className="p">options</span>{"={{ components: customComponents }}\n\n"}
          {"      "}<span className="p">onSubmit</span>{"={handleSubmit}\n"}
          {"    "}<span className="t">{"/>"}</span>{"\n"}
          {"  )\n"}
          {"}"}
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
        <div className="code">
{`# Install Form.io React renderer + core library
npm install @formio/react formiojs

# React Aria components (already included in this project)
npm install react-aria-components`}
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
        <span className="c">{"/* index.css — VSee Clinic Design Tokens */"}</span>{"\n\n"}
        <span className="k">@import</span>{" "}<span className="s">"tailwindcss"</span>{";\n\n"}
        <span className="c">{"/* ── Tailwind v4 Theme ── */"}</span>{"\n"}
        <span className="k">@theme</span>{" {\n"}
        {"  "}<span className="c">{"/* Fonts */"}</span>{"\n"}
        {"  "}<span className="p">--font-sans</span>{": "}<span className="v">"Legend", "Inter", system-ui, -apple-system, sans-serif</span>{";\n"}
        {"  "}<span className="p">--font-heading</span>{": "}<span className="v">"Legend", "Inter", system-ui, -apple-system, sans-serif</span>{";\n"}
        {"  "}<span className="p">--font-mono</span>{": "}<span className="v">ui-monospace, "Cascadia Code", "Fira Code", Consolas, monospace</span>{";\n\n"}
        {"  "}<span className="c">{"/* Colors */"}</span>{"\n"}
        {"  "}<span className="p">--color-primary</span>{": "}<span className="v">oklch(0.52 0.14 162)</span>{";\n"}
        {"  "}<span className="p">--color-primary-foreground</span>{": "}<span className="v">#ffffff</span>{";\n"}
        {"  "}<span className="p">--color-primary-hover</span>{": "}<span className="v">oklch(0.46 0.14 162)</span>{";\n"}
        {"  "}<span className="p">--color-background</span>{": "}<span className="v">#ffffff</span>{";\n"}
        {"  "}<span className="p">--color-foreground</span>{": "}<span className="v">oklch(0.16 0.02 265)</span>{";\n"}
        {"  "}<span className="p">--color-secondary</span>{": "}<span className="v">oklch(0.96 0.005 265)</span>{";\n"}
        {"  "}<span className="p">--color-secondary-foreground</span>{": "}<span className="v">oklch(0.16 0.02 265)</span>{";\n"}
        {"  "}<span className="p">--color-muted</span>{": "}<span className="v">oklch(0.96 0.005 265)</span>{";\n"}
        {"  "}<span className="p">--color-muted-foreground</span>{": "}<span className="v">oklch(0.52 0.01 265)</span>{";\n"}
        {"  "}<span className="p">--color-accent</span>{": "}<span className="v">oklch(0.95 0.04 162)</span>{";\n"}
        {"  "}<span className="p">--color-accent-foreground</span>{": "}<span className="v">oklch(0.35 0.1 162)</span>{";\n"}
        {"  "}<span className="p">--color-destructive</span>{": "}<span className="v">oklch(0.58 0.22 25)</span>{";\n"}
        {"  "}<span className="p">--color-destructive-foreground</span>{": "}<span className="v">#ffffff</span>{";\n"}
        {"  "}<span className="p">--color-success</span>{": "}<span className="v">oklch(0.62 0.17 145)</span>{";\n"}
        {"  "}<span className="p">--color-success-foreground</span>{": "}<span className="v">#ffffff</span>{";\n"}
        {"  "}<span className="p">--color-info</span>{": "}<span className="v">oklch(0.62 0.14 250)</span>{";\n"}
        {"  "}<span className="p">--color-info-foreground</span>{": "}<span className="v">#ffffff</span>{";\n"}
        {"  "}<span className="p">--color-warning</span>{": "}<span className="v">oklch(0.65 0.17 70)</span>{";\n"}
        {"  "}<span className="p">--color-warning-foreground</span>{": "}<span className="v">#422006</span>{";\n"}
        {"  "}<span className="p">--color-border</span>{": "}<span className="v">oklch(0.92 0.005 265)</span>{";\n"}
        {"  "}<span className="p">--color-input</span>{": "}<span className="v">oklch(0.92 0.005 265)</span>{";\n"}
        {"  "}<span className="p">--color-ring</span>{": "}<span className="v">oklch(0.52 0.14 162)</span>{";\n"}
        {"  "}<span className="p">--color-card</span>{": "}<span className="v">#ffffff</span>{";\n"}
        {"  "}<span className="p">--color-card-foreground</span>{": "}<span className="v">oklch(0.16 0.02 265)</span>{";\n\n"}
        {"  "}<span className="c">{"/* Radius */"}</span>{"\n"}
        {"  "}<span className="p">--radius-sm</span>{": "}<span className="v">0.375rem</span>{";\n"}
        {"  "}<span className="p">--radius-md</span>{": "}<span className="v">0.5rem</span>{";\n"}
        {"  "}<span className="p">--radius-lg</span>{": "}<span className="v">0.75rem</span>{";\n"}
        {"  "}<span className="p">--radius-xl</span>{": "}<span className="v">1rem</span>{";\n\n"}
        {"  "}<span className="c">{"/* Shadows */"}</span>{"\n"}
        {"  "}<span className="p">--shadow-sm</span>{": "}<span className="v">0 1px 2px 0 rgb(0 0 0 / 0.05)</span>{";\n"}
        {"  "}<span className="p">--shadow-md</span>{": "}<span className="v">0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)</span>{";\n"}
        {"  "}<span className="p">--shadow-lg</span>{": "}<span className="v">0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)</span>{";\n"}
        {"  "}<span className="p">--shadow-xl</span>{": "}<span className="v">0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)</span>{";\n"}
        {"}\n\n"}
        <span className="c">{"/* ── CSS Custom Properties ── */"}</span>{"\n"}
        <span className="k">:root</span>{" {\n"}
        {"  "}<span className="c">{"/* Brand */"}</span>{"\n"}
        {"  "}<span className="p">--brand</span>{": "}<span className="v">#0D875C</span>{";     "}<span className="p">--brand-hover</span>{": "}<span className="v">#0B7550</span>{";\n"}
        {"  "}<span className="p">--brand-active</span>{": "}<span className="v">#096843</span>{"; "}<span className="p">--brand-dark</span>{": "}<span className="v">#0A6B49</span>{";\n"}
        {"  "}<span className="p">--brand-darker</span>{": "}<span className="v">#074D35</span>{";\n"}
        {"  "}<span className="p">--brand-light</span>{": "}<span className="v">#E6F5EE</span>{";  "}<span className="p">--brand-50</span>{": "}<span className="v">#F0FAF5</span>{";\n"}
        {"}\n\n"}
        <span className="c">{"/* ── Brand theme: Ocean Blue ── */"}</span>{"\n"}
        <span className="k">{"[data-theme=\"blue\"]"}</span>{" {\n"}
        {"  "}<span className="p">--brand</span>{": "}<span className="v">#0891B2</span>{";     "}<span className="p">--brand-hover</span>{": "}<span className="v">#0E7490</span>{";\n"}
        {"  "}<span className="p">--brand-active</span>{": "}<span className="v">#155E75</span>{"; "}<span className="p">--brand-dark</span>{": "}<span className="v">#0E7490</span>{";\n"}
        {"  "}<span className="p">--brand-darker</span>{": "}<span className="v">#164E63</span>{";\n"}
        {"  "}<span className="p">--brand-light</span>{": "}<span className="v">#E0F7FA</span>{";  "}<span className="p">--brand-50</span>{": "}<span className="v">#ECFEFF</span>{";\n"}
        {"}\n\n"}
        <span className="c">{"/* ── Brand theme: Royal Purple ── */"}</span>{"\n"}
        <span className="k">{"[data-theme=\"purple\"]"}</span>{" {\n"}
        {"  "}<span className="p">--brand</span>{": "}<span className="v">#7C3AED</span>{";     "}<span className="p">--brand-hover</span>{": "}<span className="v">#6D31D6</span>{";\n"}
        {"  "}<span className="p">--brand-active</span>{": "}<span className="v">#5E28BF</span>{"; "}<span className="p">--brand-dark</span>{": "}<span className="v">#6332C4</span>{";\n"}
        {"  "}<span className="p">--brand-darker</span>{": "}<span className="v">#47248C</span>{";\n"}
        {"  "}<span className="p">--brand-light</span>{": "}<span className="v">#EDE9FE</span>{";  "}<span className="p">--brand-50</span>{": "}<span className="v">#F5F3FF</span>{";\n"}
        {"}\n\n"}
        <span className="k">:root</span>{" {\n"}
        {"  "}<span className="c">{"/* Semantic (AA on white) */"}</span>{"\n"}
        {"  "}<span className="p">--success</span>{": "}<span className="v">#0D875C</span>{";   "}<span className="p">--success-light</span>{": "}<span className="v">#E6F5EE</span>{";\n"}
        {"  "}<span className="p">--info</span>{": "}<span className="v">#0575AD</span>{";      "}<span className="p">--info-light</span>{": "}<span className="v">#E0F2FE</span>{";\n"}
        {"  "}<span className="p">--warning</span>{": "}<span className="v">#D97706</span>{";   "}<span className="p">--warning-light</span>{": "}<span className="v">#FEF3C7</span>{";\n"}
        {"  "}<span className="p">--danger</span>{": "}<span className="v">#DC2626</span>{";    "}<span className="p">--danger-light</span>{": "}<span className="v">#FEE2E2</span>{";\n"}
        {"  "}<span className="p">--danger-hover</span>{": "}<span className="v">#B91C1C</span>{";\n\n"}
        {"  "}<span className="c">{"/* Semantic dark text (AA on matching -light bg) */"}</span>{"\n"}
        {"  "}<span className="p">--success-dark</span>{": "}<span className="v">#065F46</span>{"; "}<span className="p">--info-dark</span>{": "}<span className="v">#075985</span>{";\n"}
        {"  "}<span className="p">--warning-dark</span>{": "}<span className="v">#92400E</span>{"; "}<span className="p">--danger-dark</span>{": "}<span className="v">#991B1B</span>{";\n"}
        {"  "}<span className="p">--warning-on-solid</span>{": "}<span className="v">#422006</span>{";\n\n"}
        {"  "}<span className="c">{"/* Semantic borders (alerts) */"}</span>{"\n"}
        {"  "}<span className="p">--success-border</span>{": "}<span className="v">#A7F3D0</span>{"; "}<span className="p">--info-border</span>{": "}<span className="v">#BAE6FD</span>{";\n"}
        {"  "}<span className="p">--warning-border</span>{": "}<span className="v">#FDE68A</span>{"; "}<span className="p">--danger-border</span>{": "}<span className="v">#FECACA</span>{";\n\n"}
        {"  "}<span className="c">{"/* Neutrals (AA-compliant) */"}</span>{"\n"}
        {"  "}<span className="p">--black</span>{": "}<span className="v">#111827</span>{";\n"}
        {"  "}<span className="p">--grey-900</span>{": "}<span className="v">#1F2937</span>{"; "}<span className="p">--grey-800</span>{": "}<span className="v">#374151</span>{"; "}<span className="p">--grey-700</span>{": "}<span className="v">#4B5563</span>{";\n"}
        {"  "}<span className="p">--grey-600</span>{": "}<span className="v">#6B7280</span>{"; "}<span className="p">--grey-500</span>{": "}<span className="v">#868E9C</span>{"; "}<span className="p">--grey-400</span>{": "}<span className="v">#D1D5DB</span>{";\n"}
        {"  "}<span className="p">--grey-300</span>{": "}<span className="v">#E5E7EB</span>{"; "}<span className="p">--grey-200</span>{": "}<span className="v">#F3F4F6</span>{"; "}<span className="p">--grey-100</span>{": "}<span className="v">#F9FAFB</span>{";\n"}
        {"  "}<span className="p">--white</span>{": "}<span className="v">#FFFFFF</span>{";\n\n"}
        {"  "}<span className="c">{"/* Text (≥ 4.5:1 on white) */"}</span>{"\n"}
        {"  "}<span className="p">--text-primary</span>{": "}<span className="v">#111827</span>{"; "}<span className="p">--text-secondary</span>{": "}<span className="v">#6B7280</span>{";\n"}
        {"  "}<span className="p">--text-tertiary</span>{": "}<span className="v">#6F7787</span>{"; "}<span className="p">--text-brand</span>{": "}<span className="v">#0D875C</span>{";\n\n"}
        {"  "}<span className="c">{"/* Borders */"}</span>{"\n"}
        {"  "}<span className="p">--border</span>{": "}<span className="v">#E5E7EB</span>{"; "}<span className="p">--border-strong</span>{": "}<span className="v">#D1D5DB</span>{";\n\n"}
        {"  "}<span className="c">{"/* Typography */"}</span>{"\n"}
        {"  "}<span className="p">--font</span>{": "}<span className="v">'Legend', 'Inter', -apple-system, sans-serif</span>{";\n"}
        {"  "}<span className="p">--mono</span>{": "}<span className="v">'SF Mono', 'Fira Code', 'Consolas', monospace</span>{";\n"}
        {"  "}<span className="p">--text-xs</span>{": "}<span className="v">12px</span>{"; "}<span className="p">--text-sm</span>{": "}<span className="v">13px</span>{"; "}<span className="p">--text-base</span>{": "}<span className="v">14px</span>{"; "}<span className="p">--text-lg</span>{": "}<span className="v">16px</span>{";\n"}
        {"  "}<span className="p">--text-xl</span>{": "}<span className="v">18px</span>{"; "}<span className="p">--text-2xl</span>{": "}<span className="v">20px</span>{"; "}<span className="p">--text-3xl</span>{": "}<span className="v">24px</span>{"; "}<span className="p">--text-4xl</span>{": "}<span className="v">30px</span>{";\n"}
        {"  "}<span className="p">--text-5xl</span>{": "}<span className="v">36px</span>{"; "}<span className="p">--text-6xl</span>{": "}<span className="v">48px</span>{"; "}<span className="p">--text-7xl</span>{": "}<span className="v">60px</span>{";\n\n"}
        {"  "}<span className="c">{"/* Spacing (4px base) */"}</span>{"\n"}
        {"  "}<span className="p">--sp-1</span>{": "}<span className="v">4px</span>{";  "}<span className="p">--sp-2</span>{": "}<span className="v">8px</span>{";  "}<span className="p">--sp-3</span>{": "}<span className="v">12px</span>{"; "}<span className="p">--sp-4</span>{": "}<span className="v">16px</span>{";\n"}
        {"  "}<span className="p">--sp-5</span>{": "}<span className="v">20px</span>{"; "}<span className="p">--sp-6</span>{": "}<span className="v">24px</span>{"; "}<span className="p">--sp-8</span>{": "}<span className="v">32px</span>{"; "}<span className="p">--sp-10</span>{": "}<span className="v">40px</span>{";\n"}
        {"  "}<span className="p">--sp-12</span>{": "}<span className="v">48px</span>{"; "}<span className="p">--sp-16</span>{": "}<span className="v">64px</span>{"; "}<span className="p">--sp-20</span>{": "}<span className="v">80px</span>{"; "}<span className="p">--sp-24</span>{": "}<span className="v">96px</span>{";\n\n"}
        {"  "}<span className="c">{"/* Radius */"}</span>{"\n"}
        {"  "}<span className="p">--r-sm</span>{": "}<span className="v">6px</span>{"; "}<span className="p">--r-md</span>{": "}<span className="v">8px</span>{"; "}<span className="p">--r-lg</span>{": "}<span className="v">12px</span>{"; "}<span className="p">--r-xl</span>{": "}<span className="v">16px</span>{";\n"}
        {"  "}<span className="p">--r-2xl</span>{": "}<span className="v">24px</span>{"; "}<span className="p">--r-full</span>{": "}<span className="v">9999px</span>{";\n\n"}
        {"  "}<span className="c">{"/* Shadows */"}</span>{"\n"}
        {"  "}<span className="p">--shadow-xs</span>{": "}<span className="v">0 1px 2px rgba(0,0,0,0.05)</span>{";\n"}
        {"  "}<span className="p">--shadow-focus</span>{": "}<span className="v">0 0 0 3px rgba(13,135,92,0.15)</span>{";\n\n"}
        {"  "}<span className="c">{"/* Status (EMR) */"}</span>{"\n"}
        {"  "}<span className="p">--status-ordered</span>{": "}<span className="v">#0D875C</span>{";     "}<span className="p">--status-scheduled</span>{": "}<span className="v">#0575AD</span>{";\n"}
        {"  "}<span className="p">--status-overdue</span>{": "}<span className="v">#DC2626</span>{";     "}<span className="p">--status-in-progress</span>{": "}<span className="v">#D97706</span>{";\n"}
        {"  "}<span className="p">--status-cancelled</span>{": "}<span className="v">#9CA3AF</span>{";   "}<span className="p">--status-resulted</span>{": "}<span className="v">#0D875C</span>{";\n"}
        {"  "}<span className="p">--status-completed</span>{": "}<span className="v">#374151</span>{";\n\n"}
        {"  "}<span className="c">{"/* Transitions */"}</span>{"\n"}
        {"  "}<span className="p">--ease</span>{": "}<span className="v">cubic-bezier(0.4, 0, 0.2, 1)</span>{";\n"}
        {"  "}<span className="p">--t-fast</span>{": "}<span className="v">150ms var(--ease)</span>{"; "}<span className="p">--t-base</span>{": "}<span className="v">200ms var(--ease)</span>{"; "}<span className="p">--t-slow</span>{": "}<span className="v">300ms var(--ease)</span>{";\n"}
        {"}"}
      </div>
    </Section>
  );
}

export default App;
