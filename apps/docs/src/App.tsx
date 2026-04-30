import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
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
  NumberField,
} from "react-aria-components";
import { today, getLocalTimeZone, Time, CalendarDateTime } from "@internationalized/date";
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
  MoreHorizontal,
  MessageSquare,
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
  Sun,
  Moon,
  CreditCard,
  Lock,
} from "lucide-react";

// Component visual styles come from `@vsee/ui/styles.css`, loaded via `src/index.css`.

// Pages section — kitchen-sink showcase. Lives under apps/docs/src/patterns/.
import { KitchenSink } from "./patterns/KitchenSink";

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
      { label: "Overlays", id: "overlay" },
      { label: "Others", id: "data" },
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
  {
    group: "Pages",
    icon: <MessageSquare size={14} />,
    items: [
      { label: "Kitchen Sink", id: "pages" },
    ],
  },
];

// Patterns is rendered on the right of the anchor-bar, not the left sidebar.
// Layouts is commented out for now — PatternsLayouts has no visible content
// after its subsections moved to Components → Others.
const PATTERNS_GROUP = {
  group: "Patterns",
  icon: <Layers size={14} />,
  items: [] as { label: string; id: string }[],
};

function App() {
  const [activeSection, setActiveSection] = useState("colors");
  const [navOpen, setNavOpen] = useState(false);
  const [brandTheme, setBrandTheme] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const toast = useCopyToast();

  /* apply brand theme to root element */
  useEffect(() => {
    if (brandTheme) {
      document.documentElement.setAttribute("data-theme", brandTheme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [brandTheme]);

  /* apply dark mode to root element */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-mode", "dark");
    } else {
      document.documentElement.removeAttribute("data-mode");
    }
  }, [darkMode]);

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
          <div className="ds-theme-label" style={{marginTop:"var(--vsee-sp-3)"}}>Mode</div>
          <button className="ds-mode-switch" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Switch to Light" : "Switch to Dark"}>
            <Sun size={12} className="ds-mode-icon ds-mode-icon-light" />
            <span className={`ds-mode-track ${darkMode ? "on" : ""}`}>
              <span className="ds-mode-thumb" />
            </span>
            <Moon size={12} className="ds-mode-icon ds-mode-icon-dark" />
          </button>
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
          {/* Patterns — right-aligned group with its title + per-item links.
              Trailing prototype-page links open the self-contained HTML mocks
              in a new tab (they live in apps/docs/public/). */}
          <div className="anchor-bar-right">
            <span className="anchor-bar-group-title">
              {PATTERNS_GROUP.icon}
              {PATTERNS_GROUP.group}
            </span>
            {PATTERNS_GROUP.items.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`anchor-link ${activeSection === item.id ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}
              >
                {item.label}
              </a>
            ))}
            <a
              href={`${import.meta.env.BASE_URL}login.html`}
              target="_blank"
              rel="noopener"
              className="anchor-link anchor-link-external"
              title="Open the login prototype in a new tab"
            >
              Login <ExternalLink size={12} />
            </a>
            <a
              href={`${import.meta.env.BASE_URL}preference.html`}
              target="_blank"
              rel="noopener"
              className="anchor-link anchor-link-external"
              title="Open the preferences prototype in a new tab"
            >
              Preferences <ExternalLink size={12} />
            </a>
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
        {/* <ComponentsDropdowns /> — section hidden. Select Dropdown is the only remaining subsection; Dropdown Button moved to Overlays. Function kept for future use. */}
        <ComponentsOverlays />
        <ComponentsOthers />
        {/* <PatternsEMR /> */}
        {/* <PatternsLayouts /> — section is empty after Sidebar+Content and Modal/Dialog moved to Components → Others */}
        <EngineeringTokens />
        <PatternsTheming brandTheme={brandTheme} setBrandTheme={setBrandTheme} />
        <PatternsFormio />
        <KitchenSink />

        {/* Footer */}
        <div className="ds-footer">
          <div className="ds-footer-logo">VSee</div>
          <div className="ds-footer-sub">Design System · 2026</div>
          <div className="ds-footer-meta">Figtree · 4px grid · WCAG AA · White-label ready</div>
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
  id: string; label: string; title: string; description: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <section id={id} className="ds-section">
      <div className="section-label">{label}</div>
      {title && <div className="section-title">{title}</div>}
      <div className="section-desc">{description}</div>
      {children}
    </section>
  );
}

function SubSection({ title, description, style, children }: {
  title: string; description?: string; style?: React.CSSProperties; children: React.ReactNode;
}) {
  return (
    <div className="subsection" style={style}>
      {title && <div className="sub-title">{title}</div>}
      {description && <div className="sub-desc">{description}</div>}
      {children}
    </div>
  );
}

/* ─── Code Block helper ─── */
function CodeBlock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "var(--vsee-sp-4)" }}>
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
function Swatch({ color, name, hex, large, onClick }: {
  color: string; name: string; hex: string; large?: boolean; onClick: () => void;
}) {
  return (
    <div className={`swatch ${large ? "swatch-large" : ""}`} onClick={onClick}>
      <div className="swatch-color" style={{ background: color }} />
      <div className="swatch-info">
        <div className="swatch-name">{name}</div>
        <div className="swatch-hex">{hex}</div>
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
          <Swatch large color="var(--vsee-brand-50)" name="--vsee-brand-50" hex="#F0FAF5" onClick={() => copy("var(--vsee-brand-50)")} />
          <Swatch large color="var(--vsee-brand-light)" name="--vsee-brand-light" hex="#E6F5EE" onClick={() => copy("var(--vsee-brand-light)")} />
          <Swatch large color="var(--vsee-brand)" name="--vsee-brand" hex="#0D875C" onClick={() => copy("var(--vsee-brand)")} />
          <Swatch large color="var(--vsee-brand-semidark)" name="--vsee-brand-semidark" hex="#096843" onClick={() => copy("var(--vsee-brand-semidark)")} />
        </div>
      </SubSection>

      <SubSection title="Semantic" description="Communicating meaning — success, information, warning, and danger states.">
        <div className="swatch-row">
          <Swatch color="var(--vsee-success)" name="--vsee-success" hex="#367D17" onClick={() => copy("var(--vsee-success)")} />
          <Swatch color="var(--vsee-info)" name="--vsee-info" hex="#196CD2" onClick={() => copy("var(--vsee-info)")} />
          <Swatch color="var(--vsee-warning)" name="--vsee-warning" hex="#FFCB5A" onClick={() => copy("var(--vsee-warning)")} />
          <Swatch color="var(--vsee-danger)" name="--vsee-danger" hex="#D31212" onClick={() => copy("var(--vsee-danger)")} />
        </div>
        <div className="swatch-row">
          <Swatch color="var(--vsee-success-light)" name="--vsee-success-light" hex="#F1F9E1" onClick={() => copy("var(--vsee-success-light)")} />
          <Swatch color="var(--vsee-info-light)" name="--vsee-info-light" hex="#EBF7FE" onClick={() => copy("var(--vsee-info-light)")} />
          <Swatch color="var(--vsee-warning-light)" name="--vsee-warning-light" hex="#FEF3C7" onClick={() => copy("var(--vsee-warning-light)")} />
          <Swatch color="var(--vsee-danger-light)" name="--vsee-danger-light" hex="#FEE7E7" onClick={() => copy("var(--vsee-danger-light)")} />
        </div>
      </SubSection>

      <SubSection title="Neutrals">
        <div className="swatch-row">
          <Swatch color="var(--vsee-black)" name="--vsee-black" hex="#111827" onClick={() => copy("var(--vsee-black)")} />
          <Swatch color="var(--vsee-grey-900)" name="--vsee-grey-900" hex="#4B5563" onClick={() => copy("var(--vsee-grey-900)")} />
          <Swatch color="var(--vsee-grey-800)" name="--vsee-grey-800" hex="#6B7280" onClick={() => copy("var(--vsee-grey-800)")} />
          <Swatch color="var(--vsee-grey-700)" name="--vsee-grey-700" hex="#9CA3AF" onClick={() => copy("var(--vsee-grey-700)")} />
          <Swatch color="var(--vsee-grey-600)" name="--vsee-grey-600" hex="#B0B7C3" onClick={() => copy("var(--vsee-grey-600)")} />
        </div>
        <div className="swatch-row">
          <Swatch color="var(--vsee-grey-500)" name="--vsee-grey-500" hex="#C9CED6" onClick={() => copy("var(--vsee-grey-500)")} />
          <Swatch color="var(--vsee-grey-400)" name="--vsee-grey-400" hex="#E8EAED" onClick={() => copy("var(--vsee-grey-400)")} />
          <Swatch color="var(--vsee-grey-300)" name="--vsee-grey-300" hex="#F1F2F4" onClick={() => copy("var(--vsee-grey-300)")} />
          <Swatch color="var(--vsee-grey-200)" name="--vsee-grey-200" hex="#F8F9FA" onClick={() => copy("var(--vsee-grey-200)")} />
          <Swatch color="var(--vsee-grey-100)" name="--vsee-grey-100" hex="#FCFCFD" onClick={() => copy("var(--vsee-grey-100)")} />
        </div>
      </SubSection>

      <SubSection title="Surfaces & Text">
        <div className="grid g2">
          <div className="card">
            <div className="card-inner-title">Surfaces</div>
            <div className="surface-text-list">
              <div className="st-row" onClick={() => copy("var(--vsee-white)")}><div className="st-swatch" style={{background:"var(--vsee-white)",border:"1px solid var(--vsee-border)"}} /><div><div className="st-name">--vsee-white</div><div className="st-val">#FFFFFF</div></div></div>
              <div className="st-row" onClick={() => copy("var(--vsee-grey-200)")}><div className="st-swatch" style={{background:"var(--vsee-grey-200)",border:"1px solid var(--vsee-border)"}} /><div><div className="st-name">--vsee-grey-200</div><div className="st-val">#F8F9FA</div></div></div>
              <div className="st-row" onClick={() => copy("var(--vsee-grey-300)")}><div className="st-swatch" style={{background:"var(--vsee-grey-300)",border:"1px solid var(--vsee-border)"}} /><div><div className="st-name">--vsee-grey-300</div><div className="st-val">#F1F2F4</div></div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-inner-title">Text Colors</div>
            <div className="surface-text-list">
              <div className="st-row" onClick={() => copy("var(--vsee-text-primary)")}><div className="st-swatch" style={{background:"var(--vsee-text-primary)"}} /><div><div className="st-name">--vsee-text-primary</div><div className="st-val">#111827</div></div></div>
              <div className="st-row" onClick={() => copy("var(--vsee-text-secondary)")}><div className="st-swatch" style={{background:"var(--vsee-text-secondary)"}} /><div><div className="st-name">--vsee-text-secondary</div><div className="st-val">#6B7280</div></div></div>
              <div className="st-row" onClick={() => copy("var(--vsee-link)")}><div className="st-swatch" style={{background:"var(--vsee-link)"}} /><div><div className="st-name">--vsee-link</div><div className="st-val">#0D875C</div></div></div>
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
      description="Figtree is our system font — clean, legible, and optimized for UI. The type scale uses a harmonious progression from 12px to 60px.">

      <div className="card" style={{marginBottom:"var(--vsee-sp-8)"}}>
        {[
          { cls: "text-display", size: "60px", text: "Design for health" },
          { cls: "text-h1", size: "48px", text: "Page title" },
          { cls: "text-h2", size: "36px", text: "Section heading" },
          { cls: "text-h3", size: "24px", text: "Subsection" },
          { cls: "text-h4", size: "20px", text: "Card title" },
          { cls: "text-h5", size: "16px", text: "Label heading" },
          { cls: "text-body-lg", size: "16px", text: "Body text for longer-form content and introductory paragraphs." },
          { cls: "text-body", size: "14px", text: "Standard body text used throughout the application." },
          { cls: "text-caption", size: "13px", text: "Helper text, timestamps, and metadata" },
          { cls: "text-overline", size: "12px", text: "Section Label" },
        ].map((t) => (
          <div key={t.cls} className="type-row">
            <div className="type-meta">
              <div className="type-meta-label">.{t.cls}</div>
              <div className="type-meta-value">{t.size}</div>
            </div>
            <div className={`type-preview ${t.cls}`}>{t.text}</div>
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

      <SubSection title="Date Format">
        <div className="card" style={{padding:"var(--vsee-sp-4) var(--vsee-sp-6)", display:"flex", flexDirection:"column", gap:"var(--vsee-sp-3)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div className="text-caption" style={{color:"var(--vsee-text-secondary)",marginBottom:"var(--vsee-sp-1)"}}>US Format</div>
              <div className="text-body" style={{fontWeight:600}}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
            </div>
            <code style={{fontSize:"var(--vsee-text-caption-size)",color:"var(--vsee-text-secondary)",background:"var(--vsee-grey-100)",padding:"var(--vsee-sp-1) var(--vsee-sp-2)",borderRadius:"var(--vsee-r-sm)"}}>MMM D, YYYY, h:mm A</code>
          </div>
          <hr style={{border:"none",borderTop:"1px solid var(--vsee-grey-200)",margin:0}} />
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div className="text-caption" style={{color:"var(--vsee-text-secondary)",marginBottom:"var(--vsee-sp-1)"}}>Browser Locale ({navigator.language})</div>
              <div className="text-body" style={{fontWeight:600}}>{new Date().toLocaleDateString(navigator.language, { month: "short", day: "numeric", year: "numeric" })}, {new Date().toLocaleTimeString(navigator.language, { hour: "numeric", minute: "2-digit" })}</div>
            </div>
            <code style={{fontSize:"var(--vsee-text-caption-size)",color:"var(--vsee-text-secondary)",background:"var(--vsee-grey-100)",padding:"var(--vsee-sp-1) var(--vsee-sp-2)",borderRadius:"var(--vsee-r-sm)"}}>{navigator.language}</code>
          </div>
        </div>
        <CodeBlock
          code={`/* Browser-locale Date Format */\nconst formatDate = (date: Date) => {\n  const locale = navigator.language; // e.g. "en-US", "zh-TW", "ja-JP"\n  const dateStr = date.toLocaleDateString(locale, {\n    month: "short", day: "numeric", year: "numeric"\n  });\n  const timeStr = date.toLocaleTimeString(locale, {\n    hour: "numeric", minute: "2-digit"\n  });\n  return \`\${dateStr} \${timeStr}\`;\n};\n\n// Examples by locale:\n// "en-US"  → "Apr 10, 2026, 8:35 PM"\n// "zh-TW"  → "2026年4月10日 下午8:35"\n// "ja-JP"  → "2026年4月10日 20:35"\n// "de-DE"  → "10. Apr. 2026, 20:35"`}
        />
      </SubSection>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   FOUNDATIONS — SPACING & LAYOUT
   ═══════════════════════════════════════════ */
function FoundationsSpacing() {
  const spaces = [
    { token: "--vsee-sp-1", px: 4 }, { token: "--vsee-sp-2", px: 8 }, { token: "--vsee-sp-3", px: 12 },
    { token: "--vsee-sp-4", px: 16 }, { token: "--vsee-sp-6", px: 24 }, { token: "--vsee-sp-8", px: 32 },
    { token: "--vsee-sp-10", px: 40 }, { token: "--vsee-sp-12", px: 48 }, { token: "--vsee-sp-16", px: 64 },
    { token: "--vsee-sp-24", px: 96 }, { token: "--vsee-sp-32", px: 128 },
  ];

  return (
    <Section id="spacing" label="Foundation" title="Spacing & Layout"
      description="A 4px-based spacing scale ensures consistent rhythm across every component and layout.">
      <div className="grid" style={{gap:"var(--vsee-sp-10)",gridTemplateColumns:"1fr 2fr"}}>
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
          <div className="sub-title">Shadows</div>
          <div className="shadow-stack">
            {["xs","sm","md","lg","xl"].map((s) => (
              <div key={s} className="shadow-card" style={{boxShadow:`var(--vsee-shadow-${s})`}}>--vsee-shadow-{s}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop:"var(--vsee-sp-10)"}}>
        <div className="sub-title">Border Radius</div>
        <div className="radius-row">
          {[
            { label: "--vsee-r-xs", val: 4 }, { label: "--vsee-r-sm", val: 6 }, { label: "--vsee-r-md", val: 8 }, { label: "--vsee-r-lg", val: 12 },
            { label: "--vsee-r-xl", val: 16 }, { label: "--vsee-r-2xl", val: 24 },
            { label: "--vsee-r-full", val: 9999 },
          ].map((r) => (
            <div key={r.label} style={{textAlign:"center"}}>
              <div className="radius-preview" style={{borderRadius: r.val, width: 80, height: 80}}>{r.val === 9999 ? "∞" : `${r.val}px`}</div>
              <div className="radius-label">{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:"var(--vsee-sp-8)"}} />
      {/* <SubSection title="Dividers" description="Horizontal separators used to visually group content within cards, panels, and forms.">
        <div className="preview-box">
          <div style={{ fontWeight: 600 }}>Patient Information</div>
          <div className="divider" />
          <div style={{ display: "flex", gap: "var(--vsee-sp-8)" }}>
            <span>Name: Jane Doe</span>
            <span>DOB: 03/15/1985</span>
            <span>MRN: 00284731</span>
          </div>
          <div className="divider divider-dashed" />
          <div style={{ display: "flex", gap: "var(--vsee-sp-8)" }}>
            <span>Provider: Dr. Sarah Chen</span>
            <span>Dept: Internal Medicine</span>
          </div>
          <div className="divider divider-thick" />
          <div style={{ color: "var(--vsee-text-secondary)" }}>End of section</div>
        </div>
        <div style={{ marginTop: "var(--vsee-sp-6)" }}>
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

function Toggle() {
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
          <div className="toggle-track-labeled">
            <span className="toggle-text toggle-text-on">On</span>
            <span className="toggle-text toggle-text-off">Off</span>
            <div className="toggle-thumb-labeled" />
          </div>
          <span className="toggle-label">Unavailable</span>
        </Switch>
      </div>
    </div>
  );
}

function ButtonGroup({ labels, defaultActive, className = "" }: { labels: string[]; defaultActive: string; className?: string }) {
  const [active, setActive] = useState(defaultActive);
  const groupRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const group = groupRef.current;
    const btn = btnRefs.current[active];
    const first = btnRefs.current[labels[0]];
    if (!group || !btn || !first) return;
    group.style.setProperty("--slider-x", `${btn.offsetLeft - first.offsetLeft}px`);
    group.style.setProperty("--slider-w", `${btn.offsetWidth}px`);
  }, [active, labels]);

  return (
    <div className={`btn-group ${className}`} ref={groupRef}>
      {labels.map(label => (
        <Button
          key={label}
          ref={(el: HTMLButtonElement | null) => { btnRefs.current[label] = el; }}
          className={`btn ${active === label ? "active-group" : ""}`}
          onPress={() => setActive(label)}
        >
          {label}
        </Button>
      ))}
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
          <Button className="btn btn-primary btn-lg">Large</Button>
          <Button className="btn btn-primary">Default</Button>
          <Button className="btn btn-primary btn-sm">Small</Button>
        </div>
        <CodeBlock
          code={`<Button className="btn btn-primary btn-lg">Large</Button>\n<Button className="btn btn-primary">Default</Button>\n<Button className="btn btn-primary btn-sm">Small</Button>`}
        />
      </SubSection>

      <SubSection title="Pill Shape">
        <div className="preview">
          <Button className="btn btn-primary btn-pill">Primary Pill</Button>
          <Button className="btn btn-secondary btn-pill">Secondary Pill</Button>
          <Button className="btn btn-ghost btn-pill">Ghost Pill</Button>
        </div>
        <CodeBlock
          code={`<Button className="btn btn-primary btn-pill">Primary Pill</Button>\n<Button className="btn btn-secondary btn-pill">Secondary Pill</Button>\n<Button className="btn btn-ghost btn-pill">Ghost Pill</Button>`}
        />
      </SubSection>

      <SubSection title="States">
        <div className="preview">
          <Button className="btn btn-primary">Default</Button>
          <Button className="btn btn-primary" style={{backgroundImage:"var(--vsee-hover-overlay)",boxShadow:"var(--vsee-shadow-sm)"}}>Hover</Button>
          <Button className="btn btn-primary" style={{background:"var(--vsee-brand)"}}>Pressed</Button>
          <Button className="btn btn-primary" style={{boxShadow:"var(--vsee-shadow-focus)",outline:"2px solid var(--vsee-brand)",outlineOffset:2}}>Focus</Button>
          <Button className="btn btn-primary" isDisabled>Disabled</Button>
        </div>
        <CodeBlock
          code={`/* States are handled via React Aria data attributes */\n.btn[data-hovered]  { background-image: var(--vsee-hover-overlay); }\n.btn[data-pressed]  { background: var(--vsee-brand-semidark); }\n.btn[data-focus-visible] { box-shadow: var(--vsee-shadow-focus); }\n.btn[data-disabled] { opacity: 0.5; cursor: not-allowed; }`}
        />
      </SubSection>

      <SubSection title="Button Group">
        <div className="preview">
          <ButtonGroup labels={["Today", "Week", "Month"]} defaultActive="Week" />
          <ButtonGroup labels={["Day", "Week", "Month", "Year"]} defaultActive="Month" className="btn-group-square" />
        </div>
        <CodeBlock
          code={`const [active, setActive] = useState("Week");\n\n<div className="btn-group">\n  {["Today", "Week", "Month"].map(label => (\n    <Button\n      key={label}\n      className={\`btn \${active === label ? "active-group" : ""}\`}\n      onPress={() => setActive(label)}\n    >{label}</Button>\n  ))}\n</div>\n\n{/* Square variant */}\n<div className="btn-group btn-group-square">...</div>`}
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
        <Toggle />
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
        <div className="sub-title" style={{ marginTop: "var(--vsee-sp-6)" }}>Icon on Right</div>
        <div className="preview">
          <Button className="btn btn-primary">Send <Send size={16} /></Button>
          <Button className="btn btn-secondary">Upload <Upload size={16} /></Button>
          <Button className="btn btn-ghost">Schedule <Calendar size={16} /></Button>
        </div>
        <div className="sub-title" style={{ marginTop: "var(--vsee-sp-6)" }}>Icon Only</div>
        <div className="preview">
          <Button className="btn btn-primary btn-icon"><Plus size={18} /></Button>
          <Button className="btn btn-secondary btn-icon"><Pencil size={18} /></Button>
          <Button className="btn btn-ghost btn-icon"><Heart size={18} /></Button>
          <Button className="btn btn-danger btn-icon"><Trash2 size={18} /></Button>
          <Button className="btn btn-info btn-icon"><Info size={18} /></Button>
        </div>
        <div className="sub-title" style={{ marginTop: "var(--vsee-sp-6)" }}>Sizes with Icons</div>
        <div className="preview">
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

function PhoneInput() {
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
            <TextField className="field" style={{width: 46}} value={ext} onChange={(v) => setExt(v.replace(/\D/g, "").slice(0, 6))}>
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

/* ── Payment Input (reusable) ── */
function PaymentInput({
  onCardChange,
  onExpiryChange,
  onCvvChange,
  cardPlaceholder = "1234 5678 9012 3456",
  expiryPlaceholder = "MM / YY",
  cvvPlaceholder = "123",
}: {
  onCardChange?: (value: string) => void;
  onExpiryChange?: (value: string) => void;
  onCvvChange?: (value: string) => void;
  cardPlaceholder?: string;
  expiryPlaceholder?: string;
  cvvPlaceholder?: string;
}) {
  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };
  const maskCard = (val: string) => {
    const digits = val.replace(/\D/g, "");
    const masked = digits.split("").map((d, i) => i >= 4 && i < 12 ? "\u2022" : d).join("");
    return masked.replace(/(.{4})(?=.)/g, "$1 ");
  };
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };
  const [card, setCard] = useState("");
  const [cardFocused, setCardFocused] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <div className="payment-input">
      <div className="payment-row payment-card-row">
        <CreditCard size={16} className="payment-icon" />
        <label className="payment-label" style={{paddingLeft:"var(--vsee-sp-2)"}}>Card #</label>
        <input
          className="payment-field payment-card"
          placeholder={cardPlaceholder}
          value={cardFocused ? card : maskCard(card)}
          onFocus={() => setCardFocused(true)}
          onBlur={() => setCardFocused(false)}
          onChange={(e) => { const v = formatCard(e.target.value); setCard(v); onCardChange?.(v); }}
        />
      </div>
      <div className="payment-row payment-detail-row">
        <div className="payment-detail-col">
          <Calendar size={16} className="payment-icon" />
          <label className="payment-label" style={{paddingLeft:"var(--vsee-sp-2)"}}>Expiry</label>
          <input
            className="payment-field payment-expiry"
            placeholder={expiryPlaceholder}
            value={expiry}
            onChange={(e) => { const v = formatExpiry(e.target.value); setExpiry(v); onExpiryChange?.(v); }}
          />
        </div>
        <div className="payment-divider" />
        <div className="payment-detail-col">
          <Lock size={16} className="payment-icon" />
          <label className="payment-label" style={{paddingLeft:"var(--vsee-sp-2)"}}>CVV</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={3}
            className="payment-field payment-cvv"
            placeholder={cvvPlaceholder}
            value={cvv}
            onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setCvv(v); onCvvChange?.(v); }}
          />
        </div>
      </div>
    </div>
  );
}

function InputWithIcon() {
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

function UnitInputs() {
  return (
    <>
      {/* Static unit */}
      <div className="form-group">
        <TextField className="field">
          <Label className="form-label">Dosage</Label>
          <div className="input-icon-wrap">
            <Input className="input input-with-icon-right" placeholder="0" />
            <div className="input-icon-btn" style={{pointerEvents:"none"}}>
              <span className="input-unit-label">ml</span>
            </div>
          </div>
        </TextField>
      </div>

      {/* Dropdown unit */}
      <div className="form-group">
        <TextField className="field">
          <Label className="form-label">Weight</Label>
          <div className="input-icon-wrap">
            <Input className="input input-with-icon-right" placeholder="0" />
            <Select defaultSelectedKey="kg" className="input-unit-select">
              <Button className="input-icon-btn input-unit-select-btn">
                <SelectValue />
                <ChevronDown size={12} />
              </Button>
              <Popover className="select-popover">
                <ListBox className="select-listbox">
                  <ListBoxItem id="kg" className="select-option">kg</ListBoxItem>
                  <ListBoxItem id="lb" className="select-option">lb</ListBoxItem>
                </ListBox>
              </Popover>
            </Select>
          </div>
        </TextField>
      </div>

      {/* Number stepper */}
      <div className="form-group">
        <NumberField defaultValue={5} minValue={0} maxValue={10} className="field">
          <Label className="form-label">Quantity</Label>
          <Group className="input-icon-wrap">
            <Input className="input input-with-icon-right stepper-input" />
            <div className="input-icon-btn stepper-btns">
              <Button slot="decrement" className="stepper-half">&minus;</Button>
              <div className="stepper-divider" />
              <Button slot="increment" className="stepper-half">+</Button>
            </div>
          </Group>
        </NumberField>
      </div>

    </>
  );
}

function Login() {
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

/* ── Signature Pad (reusable) ── */
function SignaturePad({
  onSign,
  onClear,
  placeholder = "Sign here",
  width = 500,
  height = 160,
  strokeWidth = 4,
  strokeColor,
}: {
  onSign?: (dataUrl: string, timestamp: Date) => void;
  onClear?: () => void;
  placeholder?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number }[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: e.nativeEvent.offsetX * scaleX, y: e.nativeEvent.offsetY * scaleY };
  }, []);

  const getStrokeColor = useCallback(() => {
    if (strokeColor) return strokeColor;
    return getComputedStyle(canvasRef.current!).getPropertyValue("--vsee-text-primary").trim() || "#111827";
  }, [strokeColor]);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (signed) return;
    const pos = getPos(e);
    points.current = [pos];
    setDrawing(true);
    setHasStrokes(true);
  }, [signed, getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    points.current.push(pos);
    const pts = points.current;
    if (pts.length < 3) return;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = getStrokeColor();
    ctx.beginPath();
    const prev = pts[pts.length - 3];
    const cp = pts[pts.length - 2];
    const curr = pts[pts.length - 1];
    ctx.moveTo(prev.x, prev.y);
    ctx.quadraticCurveTo(cp.x, cp.y, (cp.x + curr.x) / 2, (cp.y + curr.y) / 2);
    ctx.stroke();
  }, [drawing, getPos, strokeWidth, getStrokeColor]);

  const endDraw = useCallback(() => { setDrawing(false); points.current = []; }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    setSigned(false);
    setSignedAt(null);
    onClear?.();
  }, [onClear]);

  const confirm = useCallback(() => {
    if (!hasStrokes) return;
    const now = new Date();
    const label = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setSignedAt(label);
    setSigned(true);
    onSign?.(canvasRef.current!.toDataURL("image/png"), now);
  }, [hasStrokes, onSign]);

  return (
    <>
      <div
        className={`signature-pad${signed ? " signed" : ""}`}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      >
        {!hasStrokes && (
          <div className="signature-placeholder">
            <Pencil size={24} />
            <span>{placeholder}</span>
          </div>
        )}
        <canvas ref={canvasRef} width={width * 2} height={height * 2} className="signature-canvas" />
        {hasStrokes && !signed && <button className="signature-clear" onClick={clear}><X size={14} /> Clear</button>}
      </div>
      <div className="signature-footer">
        {signedAt ? <span className="signature-timestamp">Signed {signedAt}</span> : <span />}
        {hasStrokes && !signed ? <button className="signature-confirm" onClick={confirm}>Confirm</button> : <span />}
      </div>
    </>
  );
}

/* ── Signature Pad Demo (for design system page) ── */
function SignaturePadDemo({ label, preSigned }: { label: string; preSigned?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!preSigned) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(80, 40); ctx.quadraticCurveTo(80, 90, 60, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(85, 70); ctx.quadraticCurveTo(100, 40, 120, 70);
    ctx.quadraticCurveTo(135, 95, 155, 65);
    ctx.quadraticCurveTo(170, 40, 185, 70);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(215, 40); ctx.lineTo(215, 100);
    ctx.moveTo(215, 40); ctx.quadraticCurveTo(270, 45, 270, 70);
    ctx.quadraticCurveTo(270, 95, 215, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(280, 55); ctx.quadraticCurveTo(280, 95, 300, 95);
    ctx.quadraticCurveTo(320, 95, 310, 55);
    ctx.moveTo(320, 70); ctx.quadraticCurveTo(340, 55, 350, 70);
    ctx.quadraticCurveTo(360, 95, 340, 95);
    ctx.stroke();
  }, [preSigned]);

  if (preSigned) {
    return (
      <div>
        <div className="form-label" style={{marginBottom:"var(--vsee-sp-2)"}}>{label}</div>
        <div className="signature-pad signed">
          <canvas ref={canvasRef} width={500} height={160} className="signature-canvas" />
        </div>
        <div className="signature-footer">
          <span className="signature-timestamp">Signed Apr 8, 2026 at 2:34 PM</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="form-label" style={{marginBottom:"var(--vsee-sp-2)"}}>{label}</div>
      <SignaturePad onSign={(dataUrl, ts) => console.log("Signed:", ts, dataUrl.slice(0, 50))} />
    </div>
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
      <div className="grid g2" style={{gap:"var(--vsee-sp-6)"}}>
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
          <div className="sub-title" style={{marginTop:"var(--vsee-sp-6)"}}>MultiSelect</div>
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
                      <ListBoxItem id="__empty" className="dropdown-item" style={{ color: "var(--vsee-text-secondary)", fontStyle: "italic" }}>
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
      </div>
      <CodeBlock
        code={`/* Text Input */\n<TextField className="field">\n  <Label className="form-label">Email address</Label>\n  <Input className="input" placeholder="you@example.com" />\n</TextField>\n\n/* Input with error */\n<TextField isInvalid className="field">\n  <Label className="form-label">Full Name <span className="req">*</span></Label>\n  <Input className="input error" />\n  <div className="form-error-text">Full name is required</div>\n</TextField>\n\n/* Select */\n<Select className="field">\n  <Label className="form-label">Specialty</Label>\n  <Button className="input select-trigger">\n    <SelectValue />\n    <ChevronDown size={16} />\n  </Button>\n  <Popover className="select-popover">\n    <ListBox className="select-listbox">\n      <ListBoxItem className="select-option">Option</ListBoxItem>\n    </ListBox>\n  </Popover>\n</Select>\n\n/* MultiSelect */\n<div className="multiselect-wrapper">\n  <Label className="form-label">Filter by Specialty</Label>\n  <div className="multiselect-container">\n    <TagGroup onRemove={handleRemove}>\n      <TagList className="multiselect-tags">\n        <Tag className="chip" textValue="Cardiology">\n          Cardiology\n          <Button slot="remove" className="tag-remove"><X size={12} /></Button>\n        </Tag>\n      </TagList>\n    </TagGroup>\n    <ComboBox menuTrigger="focus" allowsCustomValue>\n      <Input className="multiselect-input" placeholder="Add more..." />\n      <Popover className="dropdown-popover">\n        <ListBox className="dropdown-menu">\n          <ListBoxItem className="dropdown-item">Option</ListBoxItem>\n        </ListBox>\n      </Popover>\n    </ComboBox>\n  </div>\n</div>`}
      />

      <div className="grid g2" style={{gap:"var(--vsee-sp-6)",marginTop:"var(--vsee-sp-6)"}}>
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
          <div className="sub-title" style={{marginTop:"var(--vsee-sp-5)"}}>Radios</div>
          <RadioGroup defaultValue="phone" className="radio-list">
            <Radio value="phone" className="radio-item">
              <div className="radio-circle" /><span>Phone call</span>
            </Radio>
            <Radio value="video" className="radio-item">
              <div className="radio-circle" /><span>Video call</span>
            </Radio>
            <Radio value="person" className="radio-item" isDisabled>
              <div className="radio-circle" /><span>In-person</span>
            </Radio>
          </RadioGroup>
        </div>

        {/* Small & Disabled */}
        <div className="card">
          <div className="sub-title">Small Input</div>
          <div className="form-group">
            <SearchField className="field">
              <Label className="form-label">Patient Search</Label>
              <div className="input-icon-wrap">
                <Input className="input input-sm input-with-icon-right" placeholder="Search by name, ID, or phone..." />
                <Button className="input-icon-btn input-icon-btn-sm">
                  <Search size={14} />
                </Button>
              </div>
            </SearchField>
          </div>
          <div className="sub-title" style={{marginTop:"var(--vsee-sp-6)"}}>Disabled State</div>
          <div className="form-group">
            <TextField isDisabled className="field">
              <Label className="form-label">Disabled Field</Label>
              <Input className="input" defaultValue="Read-only value" placeholder="Read-only value" />
            </TextField>
          </div>
        </div>
      </div>

      <CodeBlock
        code={`/* Checkbox */\n<Checkbox isSelected={checked} onChange={setChecked} className="check-item">\n  <div className={\`check-box \${checked ? "checked" : ""}\`} />\n  Label text\n</Checkbox>\n\n/* Radio Group */\n<RadioGroup defaultValue="phone" className="radio-list">\n  <Radio value="phone" className="radio-item">\n    <div className="radio-circle" /><span>Phone call</span>\n  </Radio>\n  <Radio value="video" className="radio-item">\n    <div className="radio-circle" /><span>Video call</span>\n  </Radio>\n  <Radio value="person" className="radio-item" isDisabled>\n    <div className="radio-circle" /><span>In-person</span>\n  </Radio>\n</RadioGroup>\n\n/* Small Input with Search Button */\n<SearchField className="field">\n  <Label className="form-label">Patient Search</Label>\n  <div className="input-icon-wrap">\n    <Input className="input input-sm input-with-icon-right" placeholder="Search by name, ID, or phone..." />\n    <Button className="input-icon-btn input-icon-btn-sm">\n      <Search size={14} />\n    </Button>\n  </div>\n</SearchField>\n\n/* Disabled Input */\n<TextField isDisabled className="field">\n  <Label className="form-label">Disabled Field</Label>\n  <Input className="input" defaultValue="Read-only value" />\n</TextField>`}
      />

      <div style={{marginTop:"var(--vsee-sp-16)"}} />
      <SubSection title="Advanced Inputs" description="Specialized form controls for phone numbers, dates, and inputs with action icons.">
        <div className="grid g2" style={{gap:"var(--vsee-sp-6)"}}>
          {/* Phone Input */}
          <div className="card">
            <div className="sub-title">Phone Number</div>
            <PhoneInput />
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
        </div>
        <CodeBlock
          code={`/* Phone — with Country Code */\n<div className="phone-input-group">\n  <Select defaultSelectedKey="+1" className="phone-country-select">\n    <Button className="phone-country-btn">\n      <SelectValue /><ChevronDown size={14} />\n    </Button>\n    <Popover className="select-popover">\n      <ListBox className="select-listbox">\n        <ListBoxItem id="+1">US +1</ListBoxItem>\n      </ListBox>\n    </Popover>\n  </Select>\n  <TextField className="field" style={{flex: 1}}>\n    <Input className="input phone-input" placeholder="(555) 123-4567" />\n  </TextField>\n</div>\n\n/* Date Picker */\n<DatePicker className="field">\n  <Label className="form-label">Appointment Date</Label>\n  <Group className="date-input-group">\n    <DateInput className="input date-input">\n      {(segment) => <DateSegment segment={segment} />}\n    </DateInput>\n    <Button className="input-icon-btn"><Calendar size={16} /></Button>\n  </Group>\n  <Popover className="date-popover">\n    <Dialog><Calendar>...</Calendar></Dialog>\n  </Popover>\n</DatePicker>\n\n/* Time Picker */\n<TimeField className="field">\n  <Label className="form-label">Appointment Time</Label>\n  <Group className="date-input-group">\n    <DateInput className="input date-input">\n      {(segment) => <DateSegment segment={segment} />}\n    </DateInput>\n    <div className="input-icon-btn" style={{pointerEvents:"none"}}><Clock size={16} /></div>\n  </Group>\n</TimeField>`}
        />

        <div className="grid g2" style={{gap:"var(--vsee-sp-6)",marginTop:"var(--vsee-sp-6)"}}>
          {/* Input with Action Icon */}
          <div className="card">
            <div className="sub-title">Input with Action Icon</div>
            <InputWithIcon />
            <div className="sub-title" style={{marginTop:"var(--vsee-sp-6)"}}>Payment Input</div>
            <div className="form-group">
              <div className="form-label">Payment</div>
              <PaymentInput />
            </div>
          </div>

          {/* Unit & Number Inputs */}
          <div className="card">
            <div className="sub-title">Input with Unit</div>
            <UnitInputs />
          </div>
        </div>
        <CodeBlock
          code={`/* Input with Copy Action */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" readOnly />\n  <Button className="input-icon-btn"><Copy size={16} /></Button>\n</div>\n\n/* Input with External Link */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" />\n  <Button className="input-icon-btn"><ExternalLink size={16} /></Button>\n</div>\n\n/* Payment Input — with callbacks */\n<PaymentInput\n  cardPlaceholder="1234 5678 9012 3456"\n  expiryPlaceholder="MM / YY"\n  cvvPlaceholder="123"\n  onCardChange={(val) => console.log(val)}\n  onExpiryChange={(val) => console.log(val)}\n  onCvvChange={(val) => console.log(val)}\n/>\n\n/* Input with Static Unit */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" placeholder="0" />\n  <span className="input-unit">mg</span>\n</div>\n\n/* Input with Dropdown Unit */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" placeholder="0" />\n  <Select defaultSelectedKey="kg" className="input-unit-select">\n    <Button className="input-icon-btn input-unit-select-btn">\n      <SelectValue />\n      <ChevronDown size={10} />\n    </Button>\n    <Popover className="select-popover">\n      <ListBox className="select-listbox">\n        <ListBoxItem id="kg" className="select-option">kg</ListBoxItem>\n        <ListBoxItem id="lbs" className="select-option">lbs</ListBoxItem>\n      </ListBox>\n    </Popover>\n  </Select>\n</div>\n\n/* Number Stepper */\n<NumberField defaultValue={5} minValue={0} maxValue={10} className="field">\n  <Label className="form-label">Quantity</Label>\n  <Group className="input-icon-wrap">\n    <Input className="input input-with-icon-right stepper-input" />\n    <div className="input-icon-btn stepper-btns">\n      <Button slot="decrement" className="stepper-half">&minus;</Button>\n      <div className="stepper-divider" />\n      <Button slot="increment" className="stepper-half">+</Button>\n    </div>\n  </Group>\n</NumberField>`}
        />

        <div className="grid g2" style={{gap:"var(--vsee-sp-6)",marginTop:"var(--vsee-sp-6)"}}>
          {/* Login */}
          <div className="card">
            <div className="sub-title">Login Form</div>
            <Login />
          </div>

          {/* Inline Inputs */}
          <div className="card">
            <div className="sub-title">Inline Inputs</div>
            <p className="inline-input-text">
              Dispense
              <TextField className="field-inline" defaultValue="30">
                <Input className="input input-inline vertical-center" style={{width:"36px"}}/>
              </TextField>
              tablets, take
              <NumberField defaultValue={2} minValue={1} maxValue={10} className="field-inline">
                <Input className="input input-inline vertical-center"  style={{width:"36px"}}/>
              </NumberField>
              times per day for
              <TextField className="field-inline" defaultValue="7">
                              <Input className="input input-inline vertical-center"  style={{width:"36px"}}/>
              </TextField>
              days.
            </p>
            <div className="inline-input-row" style={{marginTop:"var(--vsee-sp-4)"}}>
              <span className="inline-input-label">Fluids Given</span>
              <TextField className="field-inline" defaultValue="250" style={{width:"100px"}}>
                <div className="input-icon-wrap input-icon-wrap-inline">
                  <Input className="input input-inline input-with-icon-right-inline" />
                  <Select defaultSelectedKey="cc" className="input-unit-select">
                    <Button className="input-icon-btn input-unit-select-btn input-unit-select-btn-inline input-icon-btn-inline">
                      <SelectValue />
                      <ChevronDown size={10} />
                    </Button>
                    <Popover className="select-popover">
                      <ListBox className="select-listbox">
                        <ListBoxItem id="cc" className="select-option">cc</ListBoxItem>
                        <ListBoxItem id="ml" className="select-option">ml</ListBoxItem>
                      </ListBox>
                    </Popover>
                  </Select>
                </div>
              </TextField>
            </div>
            <div className="inline-input-row" style={{marginTop:"var(--vsee-sp-4)"}}>
              <span className="inline-input-label">Dosage</span>
              <TextField className="field-inline" defaultValue="500" style={{width:"100px"}}>
                <div className="input-icon-wrap input-icon-wrap-inline">
                  <Input className="input input-inline input-with-icon-right-inline" />
                  <div className="input-icon-btn input-icon-btn-inline" style={{pointerEvents:"none"}}>
                    <span className="input-unit-label">mg</span>
                  </div>
                </div>
              </TextField>
            </div>
            <div className="inline-input-row" style={{marginTop:"var(--vsee-sp-4)"}}>
              <span className="inline-input-label">Quantity</span>
              <NumberField defaultValue={5} minValue={0} maxValue={10} className="field-inline" style={{width:"100px"}}>
                <Group className="input-icon-wrap input-icon-wrap-inline">
                  <Input className="input input-inline input-with-icon-right-inline stepper-input" />
                  <div className="input-icon-btn input-icon-btn-inline stepper-btns">
                    <Button slot="decrement" className="stepper-half">&minus;</Button>
                    <div className="stepper-divider" />
                    <Button slot="increment" className="stepper-half">+</Button>
                  </div>
                </Group>
              </NumberField>
            </div>
            <div className="inline-input-row" style={{marginTop:"var(--vsee-sp-4)"}}>
              <span className="inline-input-label">Date of Service</span>
              <DatePicker defaultValue={today(getLocalTimeZone())} className="field-inline">
                <Group className="date-input-group">
                  <DateInput className="input input-inline date-input">
                    {(segment) => <DateSegment segment={segment} className="date-segment" />}
                  </DateInput>
                  <Button className="input-icon-btn input-icon-btn-inline"><Calendar size={12} /></Button>
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
            <div className="inline-input-row" style={{marginTop:"var(--vsee-sp-4)"}}>
              <span className="inline-input-label">Facility</span>
              <Select defaultSelectedKey="mercy" className="field-inline">
                <Button className="input input-inline select-trigger" style={{width:"250px"}}>
                  <SelectValue />
                  <ChevronDown size={12} className="select-chevron" />
                </Button>
                <Popover className="select-popover">
                  <ListBox className="select-listbox">
                    <ListBoxItem id="mercy" className="select-option">Mercy General Hospital</ListBoxItem>
                    <ListBoxItem id="stlukes" className="select-option">St. Luke's Medical Center</ListBoxItem>
                    <ListBoxItem id="cedar" className="select-option">Cedar Valley Community Hospital</ListBoxItem>
                    <ListBoxItem id="riverside" className="select-option">Riverside Health System</ListBoxItem>
                  </ListBox>
                </Popover>
              </Select>
            </div>
          </div>
        </div>
        <CodeBlock
          code={`/* Login Form */\n<Form className="login-form">\n  <TextField className="field">\n    <Label className="form-label">Email</Label>\n    <Input className="input" placeholder="you@example.com" />\n  </TextField>\n  <TextField className="field">\n    <Label className="form-label">Password</Label>\n    <div className="input-icon-wrap">\n      <Input className="input input-with-icon-right" type="password" />\n      <Button className="input-icon-btn"><Eye size={16} /></Button>\n    </div>\n  </TextField>\n  <Checkbox className="check-item">Remember me</Checkbox>\n  <Button className="btn btn-primary btn-block">Sign In</Button>\n</Form>\n\n/* Inline Inputs */\n<p className="inline-input-text">\n  Dispense <Input className="input input-inline" /> tablets,\n  take <Input className="input input-inline" /> times per day\n  for <Input className="input input-inline" /> days.\n</p>`}
        />
      </SubSection>

      <SubSection title="Signature" description="A hand-signature capture area for consent forms, agreements, and patient intake workflows.">
        <div className="grid g2">
          <SignaturePadDemo label="Active" />
          <SignaturePadDemo label="Signed" preSigned />
        </div>
        <CodeBlock
          code={`<SignaturePad />\n\n{/* The component renders a <canvas> inside .signature-pad */}\n{/* Users draw with mouse or touch. On completion: */}\n<div className="signature-pad signed">\n  <canvas /> {/* contains the drawn signature */}\n</div>\n<div className="signature-footer">\n  <span className="signature-timestamp">Signed Apr 8, 2026 at 2:34 PM</span>\n  <button className="signature-clear">Clear</button>\n</div>`}
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

      <SubSection title="Toast Notifications" style={{ marginBottom: "var(--vsee-sp-4)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--vsee-sp-3)", maxWidth: 400 }}>
          <div className="notification notification-success">
            <div className="notification-icon"><CheckCircle size={18} /></div>
            <div className="notification-content">
              <div className="notification-title">Order Submitted</div>
              <div className="notification-message">CBC lab order has been sent to the lab successfully.</div>
            </div>
            <button className="notification-close"><X size={14} /></button>
          </div>
          <div className="notification notification-error">
            <div className="notification-icon"><XCircle size={18} /></div>
            <div className="notification-content">
              <div className="notification-title">Submission Failed</div>
              <div className="notification-message">Unable to submit order. Please check the connection and try again.</div>
            </div>
            <button className="notification-close"><X size={14} /></button>
          </div>
          <div className="notification notification-warning">
            <div className="notification-icon"><AlertTriangle size={18} /></div>
            <div className="notification-content">
              <div className="notification-title">Session Expiring</div>
              <div className="notification-message">Your session will expire in 5 minutes. Save your work.</div>
            </div>
            <button className="notification-close"><X size={14} /></button>
          </div>
          <div className="notification notification-info">
            <div className="notification-icon"><Info size={18} /></div>
            <div className="notification-content">
              <div className="notification-title">New Message</div>
              <div className="notification-message">Dr. Chen has sent a message regarding patient Jane Doe.</div>
            </div>
            <button className="notification-close"><X size={14} /></button>
          </div>
        </div>
        <CodeBlock
          code={`<div className="notification notification-success">\n  <div className="notification-icon"><CheckCircle size={18} /></div>\n  <div className="notification-content">\n    <div className="notification-title">Order Submitted</div>\n    <div className="notification-message">CBC lab order sent.</div>\n  </div>\n  <button className="notification-close"><X size={14} /></button>\n</div>\n\n/* Variants: notification-success | notification-error | notification-warning | notification-info */`}
        />
      </SubSection>

      <SubSection title="" description="Toast-style notifications that appear in the corner. Used for system feedback — order confirmations, errors, warnings, and informational messages.">
        <div style={{ display: "flex", gap: "var(--vsee-sp-3)", flexWrap: "wrap" }}>
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

      <SubSection title="Empty State" description="Placeholder content shown when a section has no data. Provides context and a call to action.">
        <div className="grid g2" style={{ gap: "var(--vsee-sp-6)" }}>
          <div className="empty-state">
            <div className="empty-state-icon"><Inbox size={40} /></div>
            <div className="empty-state-title">No Results Found</div>
            <div className="empty-state-desc">There are no lab results for this patient yet. Results will appear here once ordered labs have been processed.</div>
            <Button className="btn btn-primary" style={{ marginTop: "var(--vsee-sp-4)" }}>Order Lab Test</Button>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={40} /></div>
            <div className="empty-state-title">No Documents</div>
            <div className="empty-state-desc">This patient has no uploaded documents. Upload clinical documents, consent forms, or imaging reports.</div>
            <Button className="btn btn-secondary" style={{ marginTop: "var(--vsee-sp-4)" }}>Upload Document</Button>
          </div>
        </div>
        <CodeBlock
          code={`<div className="empty-state">\n  <div className="empty-state-icon"><Inbox size={40} /></div>\n  <div className="empty-state-title">No Results Found</div>\n  <div className="empty-state-desc">Description text here.</div>\n  <Button className="btn btn-primary">Action</Button>\n</div>`}
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
  const sidebarItems: Record<string, string> = {
    Overview: "High-level summary of the patient's status, recent encounters, and upcoming appointments.",
    Details: "Demographics, contact information, insurance details, and emergency contacts on file.",
    Activity: "Chronological log of visits, messages, lab orders, and prescription changes.",
  };
  const [activeSidebarItem, setActiveSidebarItem] = useState("Overview");

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
          code={`<div className="navbar">\n  <div className="navbar-logo">VSee</div>\n  <div className="navbar-links">\n    <div className="navbar-link active">Dashboard</div>\n    <div className="navbar-link">Patients</div>\n    <div className="navbar-link">Schedule</div>\n    <div className="navbar-link">Messages</div>\n  </div>\n  <div className="navbar-right">\n    <Button className="btn btn-ghost btn-sm">Help</Button>\n    <div className="avatar avatar-sm">PN</div>\n  </div>\n</div>`}
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
          code={`<Tabs>\n  <TabList className="tabs" aria-label="Clinic tabs">\n    <Tab id="patients" className="tab-item">Patients</Tab>\n    <Tab id="visits" className="tab-item">All Visits</Tab>\n    <Tab id="docs" className="tab-item">Documents</Tab>\n    <Tab id="labs" className="tab-item">Lab Results</Tab>\n  </TabList>\n  <TabPanel id="patients" className="tab-content">Content</TabPanel>\n  <TabPanel id="visits" className="tab-content">Content</TabPanel>\n  <TabPanel id="docs" className="tab-content">Content</TabPanel>\n  <TabPanel id="labs" className="tab-content">Content</TabPanel>\n</Tabs>`}
        />
      </SubSection>

      <SubSection title="Sidebar">
        <div className="sidebar-layout">
          <div className="sidebar-panel">
            <div className="sidebar-heading">Menu</div>
            {Object.keys(sidebarItems).map((item) => (
              <div key={item} className={`sidebar-menu-item ${activeSidebarItem === item ? "active" : ""}`} onClick={() => setActiveSidebarItem(item)}>{item}</div>
            ))}
          </div>
          <div className="sidebar-content">
            <div style={{fontSize:20,fontWeight:700,marginBottom:"var(--vsee-sp-4)"}}>{activeSidebarItem}</div>
            <p style={{color:"var(--vsee-text-secondary)"}}>{sidebarItems[activeSidebarItem]}</p>
          </div>
        </div>
        <CodeBlock
          code={`const items = {\n  Overview: "High-level summary…",\n  Details: "Demographics, contact info…",\n  Activity: "Chronological log of visits…",\n};\nconst [active, setActive] = useState("Overview");\n\n<div className="sidebar-layout">\n  <div className="sidebar-panel">\n    <div className="sidebar-heading">Menu</div>\n    {Object.keys(items).map((item) => (\n      <div\n        key={item}\n        className={\`sidebar-menu-item \${active === item ? "active" : ""}\`}\n        onClick={() => setActive(item)}\n      >\n        {item}\n      </div>\n    ))}\n  </div>\n  <div className="sidebar-content">\n    <div style={{fontSize:20,fontWeight:700}}>{active}</div>\n    <p>{items[active]}</p>\n  </div>\n</div>`}
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
          code={`<div className="pagination">\n  <button className="page-btn disabled">&larr;</button>\n  <button className="page-btn active">1</button>\n  <button className="page-btn">2</button>\n  <button className="page-btn">3</button>\n  <button className="page-btn">4</button>\n  <button className="page-btn">&rarr;</button>\n</div>`}
        />
      </SubSection>

      <SubSection title="Anchor Navigation" description="In-page navigation for long scrollable content. Used in encounter notes and multi-section forms. The sticky bar at the top of this page is a live example.">
        <div className="preview-box">
          <p>The anchor navigation bar fixed at the top of this page is a live demo of this component. It highlights the current section as you scroll and supports click-to-jump.</p>
          <div style={{ marginTop: "var(--vsee-sp-4)" }}>
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
// Render call is commented out above; exported so noUnusedLocals doesn't
// flag it, and so the function stays reachable for the Select Dropdown
// subsection to re-home later.
export function ComponentsDropdowns() {
  return (
    <Section id="dropdowns" label="Components" title="Dropdowns"
      description="Dropdown menus, select lists, and action menus. All dropdowns are capped at 1/3 screen height and scroll when content overflows.">

      <SubSection title="Select Dropdown" description="Standard select input with a scrollable list of options.">
        <div style={{ display: "flex", gap: "var(--vsee-sp-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
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

    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — OTHERS
   ═══════════════════════════════════════════ */
function ComponentsOthers() {
  const [sliderValue, setSliderValue] = useState(0.7);
  const sliderPct = Math.round(sliderValue * 100);
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
        <div className="grid g2" style={{gap:"var(--vsee-sp-4)"}}>
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

      <SubSection title="Slider" description="Continuous-value range control (volume, opacity, zoom). Track chrome is reset for a consistent look across Chromium/Firefox/Safari. The filled portion paints via ::-moz-range-progress on Firefox; on WebKit, set a linear-gradient on the input's background so the fill tracks the value.">
        <div className="card" style={{maxWidth:500}}>
          <div style={{display:"flex",alignItems:"center",gap:"var(--vsee-sp-3)"}}>
            <input
              type="range"
              className="slider"
              min={0}
              max={1}
              step={0.01}
              value={sliderValue}
              aria-label="Example slider"
              onChange={(e) => setSliderValue(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--vsee-brand) ${sliderPct}%, var(--vsee-grey-400) ${sliderPct}%)`,
              }}
            />
            <span style={{fontVariantNumeric:"tabular-nums",minWidth:40,textAlign:"right",fontSize:"var(--vsee-text-caption-size)",color:"var(--vsee-text-secondary)"}}>{sliderPct}%</span>
          </div>
          <div style={{marginTop:"var(--vsee-sp-6)"}}>
            <input
              type="range"
              className="slider"
              min={0}
              max={1}
              step={0.01}
              defaultValue={0.3}
              disabled
              aria-label="Disabled slider"
            />
          </div>
        </div>
        <CodeBlock
          code={`const [value, setValue] = useState(0.7);\nconst pct = Math.round(value * 100);\n\n<input\n  type="range"\n  className="slider"\n  min={0} max={1} step={0.01}\n  value={value}\n  onChange={(e) => setValue(Number(e.target.value))}\n  style={{\n    // WebKit has no ::-webkit-slider-progress pseudo — paint the fill\n    // via a gradient on the input's own background. Firefox ignores it\n    // (its ::-moz-range-track wins) and uses ::-moz-range-progress.\n    background: \`linear-gradient(to right, var(--vsee-brand) \${pct}%, var(--vsee-grey-400) \${pct}%)\`,\n  }}\n/>`}
        />
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

      {/* Sidebar + Content moved from PatternsLayouts — pending future
          re-home. Uncomment and re-add the sidebarPages state (Dashboard,
          Patients, Appointments, Messages, Lab Results, Settings) and the
          activePage useState to re-enable. */}
      {/* <SubSection title="Sidebar + Content">
        <div className="sidebar-layout">
          <div className="sidebar-panel">
            <div className="sidebar-heading">Menu</div>
            {Object.keys(sidebarPages).map((item) => (
              <div key={item} className={`sidebar-menu-item ${activePage === item ? "active" : ""}`} onClick={() => setActivePage(item)}>{item}</div>
            ))}
          </div>
          <div className="sidebar-content">
            <div style={{fontSize:20,fontWeight:700,marginBottom:"var(--vsee-sp-4)"}}>{page.title}</div>
            {page.content}
          </div>
        </div>
      </SubSection> */}
    </Section>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — OVERLAYS
   ═══════════════════════════════════════════ */
function ComponentsOverlays() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  return (
    <Section id="overlay" label="Components" title="Overlays"
      description="Modals, tooltips, and drawer patterns for focused interactions.">

      <SubSection title="Modal / Dialog" description="A centered dialog that captures focus for a single decision. Triggered by a button; closed by the × button, the Keep/Cancel actions, or clicking the backdrop.">
        <Button className="btn btn-primary" onPress={() => setModalOpen(true)}>
          Cancel Appointment
        </Button>

        {modalOpen && (
          <div
            onClick={() => setModalOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "var(--vsee-sp-6)",
              zIndex: 100,
              animation: "fadeIn 200ms ease",
            }}
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Cancel Appointment</h3>
                <Button className="modal-close" onPress={() => setModalOpen(false)}><X size={20} /></Button>
              </div>
              <div className="modal-content">
                <p style={{color:"var(--vsee-text-secondary)",marginBottom:"var(--vsee-sp-4)"}}>
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
                <Button className="btn btn-ghost" onPress={() => setModalOpen(false)}>Keep Appointment</Button>
                <Button className="btn btn-danger" onPress={() => setModalOpen(false)}>Cancel Appointment</Button>
              </div>
            </div>
          </div>
        )}
        <CodeBlock
          code={`const [open, setOpen] = useState(false);\n\n<Button className="btn btn-primary" onPress={() => setOpen(true)}>\n  Cancel Appointment\n</Button>\n\n{open && (\n  <div\n    onClick={() => setOpen(false)}\n    style={{\n      position: "fixed", inset: 0,\n      background: "rgba(0,0,0,0.4)",\n      display: "flex", alignItems: "center", justifyContent: "center",\n      padding: "var(--vsee-sp-6)", zIndex: 100,\n    }}\n  >\n    <div className="modal-box" onClick={(e) => e.stopPropagation()}>\n      <div className="modal-head">\n        <h3>Cancel Appointment</h3>\n        <Button className="modal-close" onPress={() => setOpen(false)}>\n          <X size={20} />\n        </Button>\n      </div>\n      <div className="modal-content">...</div>\n      <div className="modal-actions">\n        <Button className="btn btn-ghost" onPress={() => setOpen(false)}>\n          Keep Appointment\n        </Button>\n      </div>\n    </div>\n  </div>\n)}`}
        />
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

      <SubSection title="Dropdown Button" description="Action menus triggered by a button. Used for contextual actions on rows, cards, and toolbars.">
        <div style={{ display: "flex", gap: "var(--vsee-sp-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
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
          <div className="panel-header">Latest Vitals <span style={{fontSize:"var(--vsee-text-caption-size)",color:"var(--vsee-text-secondary)",fontWeight:400,marginLeft:"auto"}}>Feb 26, 2026</span></div>
          <div className="panel-body">
            <div className="vitals-grid">
              <div className="vital"><div className="vital-val" style={{color:"var(--vsee-brand)"}}>120/80</div><div className="vital-label">Blood Pressure</div></div>
              <div className="vital"><div className="vital-val">72</div><div className="vital-label">Heart Rate</div></div>
              <div className="vital"><div className="vital-val">98.6°</div><div className="vital-label">Temperature</div></div>
              <div className="vital"><div className="vital-val" style={{color:"var(--vsee-success)"}}>98%</div><div className="vital-label">SpO2</div></div>
              <div className="vital"><div className="vital-val">16</div><div className="vital-label">Resp Rate</div></div>
              <div className="vital"><div className="vital-val" style={{color:"var(--vsee-warning)"}}>28.5</div><div className="vital-label">BMI</div></div>
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
// Render call is commented out above; exported so noUnusedLocals doesn't
// flag it. The "layouts" anchor id + Section wrapper are ready to
// re-enable when Phase-2 Patterns ships.
export function PatternsLayouts() {
  return (
    <Section id="layouts" label="Patterns" title=""
      description="Common layout patterns used across the VSee Clinic application.">
      {/* Sidebar + Content and Modal / Dialog subsections have been moved to
          Components → Others and commented out there pending future split. */}
    </Section>
  );
}

/* ═══════════════════════════════════════════
   PATTERNS — WHITE-LABEL THEMING
   ═══════════════════════════════════════════ */
function PatternsTheming({ brandTheme, setBrandTheme }: { brandTheme: string; setBrandTheme: (t: string) => void }) {
  return (
    <Section id="theming" label="Engineering" title="White-Label Theming"
      description={`VSee supports white-label customization per tenant. Override CSS variables via [data-theme] for brand colors and [data-mode="dark"] for dark mode. Click a card below to switch the theme live, or toggle dark mode in the sidebar.`}>

      <div className="grid g3" style={{gap:"var(--vsee-sp-4)"}}>
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

      <div className="sub-title" style={{marginTop:"var(--vsee-sp-8)"}}>How to Switch Themes</div>
      <div className="sub-desc">Add a <code className="code-inline">data-theme</code> attribute to the <code className="code-inline">{"<html>"}</code> element. The attribute overrides all <code className="code-inline">--vsee-brand-*</code> CSS variables globally.</div>
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

      <div className="sub-title" style={{marginTop:"var(--vsee-sp-8)"}}>Dark Mode</div>
      <div className="sub-desc">Toggle dark mode by setting <code className="code-inline">data-mode="dark"</code> on the <code className="code-inline">{"<html>"}</code> element. Dark mode works independently of brand themes — combine both attributes for branded dark UIs.</div>
      <div className="code">
        <span className="c">{"/* 1. In HTML */"}</span>{"\n"}
        <span className="t">{"<html"}</span>{" "}<span className="p">data-mode</span>{"="}<span className="s">"dark"</span><span className="t">{">"}</span>{"                 "}<span className="c">{"/* Dark mode */"}</span>{"\n"}
        <span className="t">{"<html"}</span>{" "}<span className="p">data-mode</span>{"="}<span className="s">"dark"</span>{" "}<span className="p">data-theme</span>{"="}<span className="s">"blue"</span><span className="t">{">"}</span>{" "}<span className="c">{"/* Dark + Ocean Blue */"}</span>{"\n\n"}
        <span className="c">{"/* 2. In React */"}</span>{"\n"}
        <span className="k">{"const"}</span>{" [darkMode, setDarkMode] = "}<span className="p">{"useState"}</span>{"(false);\n\n"}
        <span className="p">{"useEffect"}</span>{"(() => {\n"}
        {"  "}<span className="k">{"if"}</span>{" (darkMode) {\n"}
        {"    document.documentElement."}<span className="p">setAttribute</span>{"("}<span className="s">"data-mode"</span>{", "}<span className="s">"dark"</span>{");\n"}
        {"  } "}<span className="k">{"else"}</span>{" {\n"}
        {"    document.documentElement."}<span className="p">removeAttribute</span>{"("}<span className="s">"data-mode"</span>{");\n"}
        {"  }\n"}
        {"}, [darkMode]);\n"}
      </div>

      <div className="sub-title" style={{marginTop:"var(--vsee-sp-8)"}}>Creating a Custom Theme</div>
      <div className="sub-desc">Define a new <code className="code-inline">[data-theme]</code> block with all 6 brand variables:</div>
      <div className="code">
        <span className="k">{"[data-theme=\"your-brand\"]"}</span>{" {\n"}
        {"  "}<span className="p">--vsee-brand</span>{": "}<span className="v">#______</span>{";        "}<span className="c">{"/* Main brand color */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-brand-semidark</span>{": "}<span className="v">#______</span>{"; "}<span className="c">{"/* Darker for pressed/active */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-brand-dark</span>{": "}<span className="v">#______</span>{";   "}<span className="c">{"/* Dark variant (gradients) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-brand-darker</span>{": "}<span className="v">#______</span>{"; "}<span className="c">{"/* Darkest variant (gradients) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-brand-light</span>{": "}<span className="v">#______</span>{";  "}<span className="c">{"/* Light tint background */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-brand-50</span>{": "}<span className="v">#______</span>{";     "}<span className="c">{"/* Very light tint background */"}</span>{"\n"}
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
          {"          "}<span className="t">{"<span"}</span>{" "}<span className="p">style</span>{"={{ color: "}<span className="s">"var(--vsee-danger)"</span>{", marginLeft: "}<span className="v">2</span>{" }}"}<span className="t">{">"}</span>{"*"}<span className="t">{"</span>"}</span>{"\n"}
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
        <div className="grid g2" style={{gap:"var(--vsee-sp-6)"}}>
          {/* Form card */}
          <div className="panel">
            <div className="panel-header">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <FileText size={18} style={{color:"var(--vsee-brand)"}} />
                Patient Intake Form
              </div>
            </div>
            <div className="panel-body">
              <p style={{fontSize:"var(--vsee-text-caption-size)",color:"var(--vsee-text-secondary)",marginBottom:"var(--vsee-sp-4)"}}>
                Rendered by <code className="code-inline">@formio/react</code> · React Aria custom components
              </p>
              {submitted ? (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"var(--vsee-sp-3)",padding:"var(--vsee-sp-8) 0",textAlign:"center"}}>
                  <CheckCircle2 size={48} style={{color:"var(--vsee-brand)"}} />
                  <p style={{fontSize:"var(--vsee-text-body-size)",fontWeight:600}}>Intake form submitted!</p>
                  <p style={{fontSize:"var(--vsee-text-caption-size)",color:"var(--vsee-text-secondary)"}}>
                    {firstName} {lastName} · {insurance || "No insurance"}
                  </p>
                  <Button className="btn btn-ghost btn-sm" onPress={resetForm}>Reset form</Button>
                </div>
              ) : (
                <Form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <div className="grid g2" style={{gap:"var(--vsee-sp-3)",marginBottom:"var(--vsee-sp-4)"}}>
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
                        <span style={{fontSize:"var(--vsee-text-caption-size)",lineHeight:1.4}}>I have read and agree to the HIPAA Privacy Notice <span className="req">*</span></span>
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
          <div style={{display:"flex",flexDirection:"column",gap:"var(--vsee-sp-4)"}}>
            <div className="panel">
              <div className="panel-header">What Form.io handles</div>
              <div className="panel-body">
                <ul className="resp-list">
                  {["Schema fetch & caching","Field-level validation rules (required, min/max, regex)","Conditional visibility logic","Multi-step wizard / page navigation","Submission to Form.io or custom endpoint","Offline drafts & resume"].map(item => (
                    <li key={item}><CheckCircle2 size={14} style={{color:"var(--vsee-brand)",flexShrink:0}} /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header">What React Aria handles</div>
              <div className="panel-body">
                <ul className="resp-list">
                  {["Visual styling & brand tokens","Keyboard navigation & focus rings","ARIA labels, roles, error associations","React Aria accessibility primitives","Consistent hover / focus / disabled states","Design system token inheritance"].map(item => (
                    <li key={item}><CheckCircle2 size={14} style={{color:"var(--vsee-brand)",flexShrink:0}} /> {item}</li>
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
      description="Copy the :root block into your global CSS. Tokens support light and dark mode via [data-mode] attributes. Available as CSS custom properties, Tokens Studio JSON, and Figma Variables.">
      <div className="code">
        <span className="c">{"/* index.css — VSee Clinic Design Tokens */"}</span>{"\n\n"}
        <span className="k">@import</span>{" "}<span className="s">"tailwindcss"</span>{";\n\n"}
        <span className="c">{"/* ── Tailwind v4 Theme ── */"}</span>{"\n"}
        <span className="k">@theme</span>{" {\n"}
        {"  "}<span className="c">{"/* Font */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-font-sans</span>{": "}<span className="v">"Figtree", system-ui, -apple-system, sans-serif</span>{";\n\n"}
        {"  "}<span className="c">{"/* Brand */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-brand</span>{": "}<span className="v">#0D875C</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-semidark</span>{": "}<span className="v">#096843</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-dark</span>{": "}<span className="v">#0A6B49</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-darker</span>{": "}<span className="v">#074D35</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-light</span>{": "}<span className="v">#E6F5EE</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-50</span>{": "}<span className="v">#F0FAF5</span>{";\n\n"}
        {"  "}<span className="c">{"/* Semantic (AA-compliant for white foreground) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-success</span>{": "}<span className="v">#367D17</span>{"; "}<span className="p">--vsee-success-light</span>{": "}<span className="v">#F1F9E1</span>{";\n"}
        {"  "}<span className="p">--vsee-info</span>{": "}<span className="v">#196CD2</span>{"; "}<span className="p">--vsee-info-light</span>{": "}<span className="v">#EBF7FE</span>{";\n"}
        {"  "}<span className="p">--vsee-warning</span>{": "}<span className="v">#FFCB5A</span>{"; "}<span className="p">--vsee-warning-light</span>{": "}<span className="v">#FEF3C7</span>{";\n"}
        {"  "}<span className="p">--vsee-danger</span>{": "}<span className="v">#D31212</span>{"; "}<span className="p">--vsee-danger-light</span>{": "}<span className="v">#FEE7E7</span>{";\n\n"}
        {"  "}<span className="c">{"/* Semantic dark text (AA on matching -light bg) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-success-dark</span>{": "}<span className="v">#265C10</span>{";\n"}
        {"  "}<span className="p">--vsee-info-dark</span>{": "}<span className="v">#075985</span>{";\n"}
        {"  "}<span className="p">--vsee-warning-dark</span>{": "}<span className="v">#92400E</span>{";\n"}
        {"  "}<span className="p">--vsee-danger-dark</span>{": "}<span className="v">#991B1B</span>{";\n"}
        {"  "}<span className="p">--vsee-warning-on-solid</span>{": "}<span className="v">#2D1806</span>{";\n\n"}
        {"  "}<span className="c">{"/* Semantic borders (alerts) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-success-border</span>{": "}<span className="v">#DAF1C1</span>{";\n"}
        {"  "}<span className="p">--vsee-info-border</span>{": "}<span className="v">#BAE6FD</span>{";\n"}
        {"  "}<span className="p">--vsee-warning-border</span>{": "}<span className="v">#FDE68A</span>{";\n"}
        {"  "}<span className="p">--vsee-danger-border</span>{": "}<span className="v">#FECACA</span>{";\n\n"}
        {"  "}<span className="c">{"/* Neutrals (AA-compliant) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-black</span>{": "}<span className="v">#111827</span>{";\n"}
        {"  "}<span className="p">--vsee-grey-900</span>{": "}<span className="v">#4B5563</span>{"; "}<span className="p">--vsee-grey-800</span>{": "}<span className="v">#6B7280</span>{"; "}<span className="p">--vsee-grey-700</span>{": "}<span className="v">#9CA3AF</span>{";\n"}
        {"  "}<span className="p">--vsee-grey-600</span>{": "}<span className="v">#B0B7C3</span>{"; "}<span className="p">--vsee-grey-500</span>{": "}<span className="v">#C9CED6</span>{"; "}<span className="p">--vsee-grey-400</span>{": "}<span className="v">#E8EAED</span>{";\n"}
        {"  "}<span className="p">--vsee-grey-300</span>{": "}<span className="v">#F1F2F4</span>{"; "}<span className="p">--vsee-grey-200</span>{": "}<span className="v">#F8F9FA</span>{"; "}<span className="p">--vsee-grey-100</span>{": "}<span className="v">#FCFCFD</span>{";\n"}
        {"  "}<span className="p">--vsee-white</span>{": "}<span className="v">#FFFFFF</span>{";\n\n"}
        {"  "}<span className="c">{"/* Text (≥ 4.5:1 on white) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-text-primary</span>{": "}<span className="v">#111827</span>{"; "}<span className="p">--vsee-text-secondary</span>{": "}<span className="v">#6B7280</span>{";\n\n"}
        {"  "}<span className="c">{"/* Borders */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-border</span>{": "}<span className="v">#E5E7EB</span>{"; "}<span className="p">--vsee-border-strong</span>{": "}<span className="v">#D1D5DB</span>{";\n\n"}
        {"  "}<span className="c">{"/* Typography scale */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-mono</span>{": "}<span className="v">'SF Mono', 'Fira Code', 'Consolas', monospace</span>{";\n"}
        {"  "}<span className="p">--vsee-text-overline-size</span>{": "}<span className="v">12px</span>{"; "}<span className="p">--vsee-text-caption-size</span>{": "}<span className="v">13px</span>{"; "}<span className="p">--vsee-text-body-size</span>{": "}<span className="v">14px</span>{";\n"}
        {"  "}<span className="p">--vsee-text-h5-size</span>{": "}<span className="v">16px</span>{"; "}<span className="p">--vsee-text-body-lg-size</span>{": "}<span className="v">16px</span>{"; "}<span className="p">--vsee-text-subtitle-size</span>{": "}<span className="v">18px</span>{";\n"}
        {"  "}<span className="p">--vsee-text-h4-size</span>{": "}<span className="v">20px</span>{"; "}<span className="p">--vsee-text-h3-size</span>{": "}<span className="v">24px</span>{"; "}<span className="p">--vsee-text-h2-size</span>{": "}<span className="v">36px</span>{";\n"}
        {"  "}<span className="p">--vsee-text-h1-size</span>{": "}<span className="v">48px</span>{"; "}<span className="p">--vsee-text-display-size</span>{": "}<span className="v">60px</span>{";\n\n"}
        {"  "}<span className="c">{"/* Spacing (4px base) */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-sp-1</span>{": "}<span className="v">4px</span>{"; "}<span className="p">--vsee-sp-2</span>{": "}<span className="v">8px</span>{"; "}<span className="p">--vsee-sp-3</span>{": "}<span className="v">12px</span>{"; "}<span className="p">--vsee-sp-4</span>{": "}<span className="v">16px</span>{";\n"}
        {"  "}<span className="p">--vsee-sp-5</span>{": "}<span className="v">20px</span>{"; "}<span className="p">--vsee-sp-6</span>{": "}<span className="v">24px</span>{"; "}<span className="p">--vsee-sp-8</span>{": "}<span className="v">32px</span>{"; "}<span className="p">--vsee-sp-10</span>{": "}<span className="v">40px</span>{";\n"}
        {"  "}<span className="p">--vsee-sp-12</span>{": "}<span className="v">48px</span>{"; "}<span className="p">--vsee-sp-16</span>{": "}<span className="v">64px</span>{"; "}<span className="p">--vsee-sp-20</span>{": "}<span className="v">80px</span>{"; "}<span className="p">--vsee-sp-24</span>{": "}<span className="v">96px</span>{"; "}<span className="p">--vsee-sp-32</span>{": "}<span className="v">128px</span>{";\n\n"}
        {"  "}<span className="c">{"/* Radius */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-r-xs</span>{": "}<span className="v">4px</span>{"; "}<span className="p">--vsee-r-sm</span>{": "}<span className="v">6px</span>{"; "}<span className="p">--vsee-r-md</span>{": "}<span className="v">8px</span>{"; "}<span className="p">--vsee-r-lg</span>{": "}<span className="v">12px</span>{";\n"}
        {"  "}<span className="p">--vsee-r-xl</span>{": "}<span className="v">16px</span>{"; "}<span className="p">--vsee-r-2xl</span>{": "}<span className="v">24px</span>{"; "}<span className="p">--vsee-r-full</span>{": "}<span className="v">9999px</span>{";\n\n"}
        {"  "}<span className="c">{"/* Shadows */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-shadow-xs</span>{": "}<span className="v">0 1px 2px rgba(0,0,0,0.05)</span>{";\n"}
        {"  "}<span className="p">--vsee-shadow-sm</span>{": "}<span className="v">0 1px 2px 0 rgb(0 0 0 / 0.05)</span>{";\n"}
        {"  "}<span className="p">--vsee-shadow-md</span>{": "}<span className="v">0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)</span>{";\n"}
        {"  "}<span className="p">--vsee-shadow-lg</span>{": "}<span className="v">0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)</span>{";\n"}
        {"  "}<span className="p">--vsee-shadow-xl</span>{": "}<span className="v">0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)</span>{";\n"}
        {"  "}<span className="p">--vsee-shadow-focus</span>{": "}<span className="v">0 0 0 3px rgba(13,135,92,0.15)</span>{";\n\n"}
        {"  "}<span className="c">{"/* Hover overlay */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-hover-overlay</span>{": "}<span className="v">linear-gradient(rgba(0,0,0,0.07), rgba(0,0,0,0.07))</span>{";\n\n"}
        {"  "}<span className="c">{"/* Transitions */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-ease</span>{": "}<span className="v">cubic-bezier(0.4, 0, 0.2, 1)</span>{";\n\n"}
        {"  "}<span className="c">{"/* Nav */"}</span>{"\n"}
        {"  "}<span className="p">--vsee-nav-width</span>{": "}<span className="v">240px</span>{";\n"}
        {"}\n\n"}
        <span className="c">{"/* Tokens that reference other tokens (not supported in @theme) */"}</span>{"\n"}
        <span className="k">:root</span>{" {\n"}
        {"  "}<span className="p">--vsee-link</span>{": "}<span className="v">var(--vsee-brand)</span>{";\n"}
        {"  "}<span className="p">--vsee-link-hover</span>{": "}<span className="v">var(--vsee-brand-semidark)</span>{";\n"}
        {"  "}<span className="p">--vsee-t-fast</span>{": "}<span className="v">150ms var(--vsee-ease)</span>{"; "}<span className="p">--vsee-t-base</span>{": "}<span className="v">200ms var(--vsee-ease)</span>{"; "}<span className="p">--vsee-t-slow</span>{": "}<span className="v">300ms var(--vsee-ease)</span>{";\n"}
        {"}\n\n"}
        <span className="c">{"/* ── Brand theme: Ocean Blue ── */"}</span>{"\n"}
        <span className="k">{"[data-theme=\"blue\"]"}</span>{" {\n"}
        {"  "}<span className="p">--vsee-brand</span>{": "}<span className="v">#0891B2</span>{"; "}<span className="p">--vsee-brand-semidark</span>{": "}<span className="v">#155E75</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-dark</span>{": "}<span className="v">#0E7490</span>{"; "}<span className="p">--vsee-brand-darker</span>{": "}<span className="v">#164E63</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-light</span>{": "}<span className="v">#E0F7FA</span>{"; "}<span className="p">--vsee-brand-50</span>{": "}<span className="v">#ECFEFF</span>{";\n"}
        {"}\n\n"}
        <span className="c">{"/* ── Brand theme: Royal Purple ── */"}</span>{"\n"}
        <span className="k">{"[data-theme=\"purple\"]"}</span>{" {\n"}
        {"  "}<span className="p">--vsee-brand</span>{": "}<span className="v">#7C3AED</span>{"; "}<span className="p">--vsee-brand-semidark</span>{": "}<span className="v">#5E28BF</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-dark</span>{": "}<span className="v">#6332C4</span>{"; "}<span className="p">--vsee-brand-darker</span>{": "}<span className="v">#47248C</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-light</span>{": "}<span className="v">#EDE9FE</span>{"; "}<span className="p">--vsee-brand-50</span>{": "}<span className="v">#F5F3FF</span>{";\n"}
        {"}\n\n"}
        <span className="c">{"/* ── Dark Mode ── */"}</span>{"\n"}
        <span className="k">{"[data-mode=\"dark\"]"}</span>{" {\n"}
        {"  "}<span className="p">--vsee-brand-light</span>{": "}<span className="v">#0F2D22</span>{"; "}<span className="p">--vsee-brand-50</span>{": "}<span className="v">#0A1F18</span>{";\n"}
        {"  "}<span className="p">--vsee-brand-dark</span>{": "}<span className="v">#34D399</span>{";\n\n"}
        {"  "}<span className="p">--vsee-success-light</span>{": "}<span className="v">#0F2D22</span>{"; "}<span className="p">--vsee-info-light</span>{": "}<span className="v">#0C1F2E</span>{";\n"}
        {"  "}<span className="p">--vsee-warning-light</span>{": "}<span className="v">#2D1806</span>{"; "}<span className="p">--vsee-danger-light</span>{": "}<span className="v">#2D1212</span>{";\n"}
        {"  "}<span className="p">--vsee-success-dark</span>{": "}<span className="v">#6EE7B7</span>{"; "}<span className="p">--vsee-info-dark</span>{": "}<span className="v">#7DD3FC</span>{";\n"}
        {"  "}<span className="p">--vsee-warning-dark</span>{": "}<span className="v">#FDE68A</span>{"; "}<span className="p">--vsee-danger-dark</span>{": "}<span className="v">#FCA5A5</span>{";\n"}
        {"  "}<span className="p">--vsee-warning-on-solid</span>{": "}<span className="v">#422006</span>{";\n"}
        {"  "}<span className="p">--vsee-success-border</span>{": "}<span className="v">#065F46</span>{"; "}<span className="p">--vsee-info-border</span>{": "}<span className="v">#075985</span>{";\n"}
        {"  "}<span className="p">--vsee-warning-border</span>{": "}<span className="v">#92400E</span>{"; "}<span className="p">--vsee-danger-border</span>{": "}<span className="v">#991B1B</span>{";\n\n"}
        {"  "}<span className="p">--vsee-black</span>{": "}<span className="v">#F9FAFB</span>{";\n"}
        {"  "}<span className="p">--vsee-grey-900</span>{": "}<span className="v">#F3F4F6</span>{"; "}<span className="p">--vsee-grey-800</span>{": "}<span className="v">#E5E7EB</span>{"; "}<span className="p">--vsee-grey-700</span>{": "}<span className="v">#D1D5DB</span>{";\n"}
        {"  "}<span className="p">--vsee-grey-600</span>{": "}<span className="v">#9CA3AF</span>{"; "}<span className="p">--vsee-grey-500</span>{": "}<span className="v">#6B7280</span>{"; "}<span className="p">--vsee-grey-400</span>{": "}<span className="v">#4B5563</span>{";\n"}
        {"  "}<span className="p">--vsee-grey-300</span>{": "}<span className="v">#1F2937</span>{"; "}<span className="p">--vsee-grey-200</span>{": "}<span className="v">#111827</span>{"; "}<span className="p">--vsee-grey-100</span>{": "}<span className="v">#0F172A</span>{";\n"}
        {"  "}<span className="p">--vsee-white</span>{": "}<span className="v">#0B1120</span>{";\n\n"}
        {"  "}<span className="p">--vsee-text-primary</span>{": "}<span className="v">#F9FAFB</span>{"; "}<span className="p">--vsee-text-secondary</span>{": "}<span className="v">#9CA3AF</span>{";\n"}
        {"  "}<span className="p">--vsee-border</span>{": "}<span className="v">#1F2937</span>{"; "}<span className="p">--vsee-border-strong</span>{": "}<span className="v">#374151</span>{";\n"}
        {"  "}<span className="p">--vsee-surface-elevated</span>{": "}<span className="v">#131B2E</span>{";\n\n"}
        {"  "}<span className="p">color-scheme</span>{": "}<span className="v">dark</span>{";\n"}
        {"}"}
      </div>
    </Section>
  );
}

export default App;
