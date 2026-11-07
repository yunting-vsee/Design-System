import { useState, useEffect, useRef, useCallback, useLayoutEffect, useId, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
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
  CheckboxGroup,
  Text,
  DropZone,
  FileTrigger,
} from "react-aria-components";
import type { DropZoneProps, FileDropItem } from "react-aria-components";
import { today, getLocalTimeZone, Time, CalendarDateTime } from "@internationalized/date";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Search,
  FileText,
  Palette,
  LayoutGrid,
  Layers,
  Settings,
  MoreHorizontal,
  MessageSquare,
  Phone,
  Mail,
  Video,
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
  FilePlus,
  Loader2,
  ChevronLeft,
  Eye,
  EyeOff,
  Clock,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  CreditCard,
  Lock,
  Stethoscope,
  Zap,
  Lightbulb,
} from "lucide-react";

// Component visual styles come from `@vsee/ui/styles.css`, loaded via `src/index.css`.

// Kitchen sink — its own page (hash route), not embedded in the docs. Lives under apps/docs/src/patterns/.
import { STANDALONE_HASH, isStandaloneHash } from "./patterns/registry";
import { StandaloneKitchenSink } from "./patterns/StandaloneKitchenSink";

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
];

// Hash route for the Steppers page (rendered by SteppersPage).
const STEPPERS_HASH = "#steppers";
/* ?frame = this page is shown inside a Pages "Mobile" view (see DeviceFrame): no top bar,
   brand + light/dark come from the outer page. public/page-toolbar.js does the same for the HTML pages. */
const IS_FRAME = new URLSearchParams(window.location.search).has("frame");

/** Current location.hash; re-renders on hashchange. */
function useLocationHash() {
  return useSyncExternalStore(
    onChange => { window.addEventListener("hashchange", onChange); return () => window.removeEventListener("hashchange", onChange); },
    () => window.location.hash,
    () => "",
  );
}

// Pages — separate pages listed at the bottom of the side menu. Each opens in the same tab and has a way back to the docs
// (kitchen sink + one-question are hash routes of this app; login / preferences are HTML mocks in apps/docs/public/).
const PAGES_GROUP = {
  group: "Pages",
  icon: <Layers size={14} />,
  items: [
    { label: "Kitchen Sink", href: STANDALONE_HASH, title: "Open the kitchen sink page" },
    { label: "Steppers", href: STEPPERS_HASH, title: "Open the Steppers page" },
    { label: "Login", href: `${import.meta.env.BASE_URL}login.html`, title: "Open the login prototype" },
    { label: "Preferences", href: `${import.meta.env.BASE_URL}preference.html`, title: "Open the preferences prototype" },
  ],
};

function App() {
  const [activeSection, setActiveSection] = useState("colors");
  const [navOpen, setNavOpen] = useState(false);
  const [brandTheme, setBrandTheme] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const toast = useCopyToast();
  // Standalone kitchen-sink mode is hash-driven. We track the flag in
  // state + listen on `hashchange` so deep-linking, refreshing, and the
  // global Cmd/Ctrl+Shift+K shortcut all flow through the same toggle.
  const [standalone, setStandalone] = useState<boolean>(() => isStandaloneHash());
  const hash = useLocationHash();

  useEffect(() => {
    const sync = () => setStandalone(isStandaloneHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Global keyboard shortcut: Cmd/Ctrl+Shift+K toggles full-screen kitchen
  // sink. Adopted from the va-main convention of grouping debug-style
  // affordances behind Shift-modified shortcuts; K = "Kitchen sink".
  // Doesn't conflict with browser bindings (Cmd+Shift+K is Firefox web
  // console, but the docs site is for designers running Chrome/Edge — and
  // we still leave Cmd+Shift+I / Cmd+Opt+I for devtools).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && (e.key === "K" || e.key === "k")) {
        e.preventDefault();
        const next = !isStandaloneHash();
        if (next) {
          window.location.hash = STANDALONE_HASH;
        } else {
          // Use history.replaceState so the back-button doesn't trap users
          // in the standalone toggle.
          history.replaceState(null, "", window.location.pathname + window.location.search);
          setStandalone(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const exitStandalone = useCallback(() => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setStandalone(false);
  }, []);

  /* Inside a Pages "Mobile" view: follow the outer page's brand + light/dark */
  useEffect(() => {
    if (!IS_FRAME) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "vsee-preview") return;
      setBrandTheme(e.data.theme === "green" ? "" : e.data.theme);
      setDarkMode(e.data.mode === "dark");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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

  // Hash-based standalone mode — replaces the docs chrome entirely.
  // Brand + dark mode state lifts up to App so toggling them inside the
  // standalone toolbar persists when the user clicks "Back to docs".
  // Steppers — its own page. "Back to docs" clears the hash.
  if (hash === STEPPERS_HASH) {
    return (
      <SteppersPage
        brandTheme={brandTheme} setBrandTheme={setBrandTheme}
        darkMode={darkMode} setDarkMode={setDarkMode}
        onExit={() => {
          history.replaceState(null, "", window.location.pathname + window.location.search);
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        }} />
    );
  }

  if (standalone) {
    return (
      <StandaloneKitchenSink
        brandTheme={brandTheme}
        setBrandTheme={setBrandTheme}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onExit={exitStandalone}
      />
    );
  }

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
          <div className="ds-nav-group">
            <div className="ds-nav-group-title">
              {PAGES_GROUP.icon}
              {PAGES_GROUP.group}
            </div>
            {PAGES_GROUP.items.map(item => (
              <a key={item.label} href={item.href} title={item.title} className="ds-nav-link">
                {item.label}
              </a>
            ))}
          </div>
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
          {/* Pages (Kitchen Sink, Login, Preferences) moved to the side menu */}
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
        {/* Kitchen sink is its own page (#kitchen-sink-fullscreen), opened from the top bar */}

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
      description="Figtree is our system font — clean, legible, and optimized for UI. The type scale uses a harmonious progression from 12px to 60px, plus a 10px micro size for tiny status readouts such as upload progress.">

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
          { cls: "text-micro", size: "10px", text: "60% · tiny status readouts only, never body copy" },
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
      <div className="grid g2" style={{gap:"var(--vsee-sp-10)"}}>{/* .g2: two columns; one column (Shadows under Spacing Scale) at ≤1024px */}
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

/* Color Swatches: pick one color from a row of circles (e.g. the brand theme).
   Each circle is a button named for its color, aria-pressed on the chosen one; the row is a named group.
   Reuses the docs sidebar's circle styles (.ds-theme-options / .ds-theme-dot), with the color passed in. */
type ColorSwatch = { id: string; label: string; color: string };
function ColorSwatches({ options, value, onChange, ariaLabel }: {
  options: ColorSwatch[];
  /** id of the chosen color */
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the group (e.g. "Brand") */
  ariaLabel: string;
}) {
  return (
    <div className="ds-theme-options" role="group" aria-label={ariaLabel}>
      {options.map(o => (
        <button key={o.id} type="button" className={`ds-theme-dot${value === o.id ? " active" : ""}`} style={{ background: o.color }}
          aria-pressed={value === o.id} aria-label={o.label} title={o.label} onClick={() => onChange(o.id)} />
      ))}
    </div>
  );
}

/* Brand colors — same values as the sidebar's .ds-theme-green / -blue / -purple circles */
const BRAND_SWATCHES: ColorSwatch[] = [
  { id: "green", label: "Green (default)", color: "#0D875C" },
  { id: "blue", label: "Blue", color: "#0891B2" },
  { id: "purple", label: "Purple", color: "#7C3AED" },
];

function ColorSwatchesDemo() {
  const [color, setColor] = useState("green");
  return (
    <div className="preview" style={{ alignItems: "center", gap: "var(--vsee-sp-4)" }}>
      <ColorSwatches ariaLabel="Brand" options={BRAND_SWATCHES} value={color} onChange={setColor} />
      <span className="text-caption" style={{ color: "var(--vsee-text-secondary)" }}>
        Selected: {BRAND_SWATCHES.find(o => o.id === color)?.label}
      </span>
    </div>
  );
}

/* Switch Button (.btn-group): pick one of a few options; a brand pill slides under the chosen one.
   Uncontrolled with defaultActive, or controlled with value + onChange. */
function SwitchButton({ labels, defaultActive, value, onChange, ariaLabel, icons, iconOnly, className = "" }: {
  labels: string[];
  /** Optional icon shown before each label, keyed by label */
  icons?: Record<string, ReactNode>;
  /** Show only the icons; each label becomes the button's accessible name and tooltip */
  iconOnly?: boolean;
  defaultActive?: string;
  value?: string;
  onChange?: (label: string) => void;
  /** Accessible name of the group (e.g. "Mode") */
  ariaLabel?: string;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultActive ?? labels[0]);
  const active = value ?? inner;
  const setActive = (label: string) => { setInner(label); onChange?.(label); };
  const groupRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const place = () => {
      const group = groupRef.current;
      const btn = btnRefs.current[active];
      const first = btnRefs.current[labels[0]];
      if (!group || !btn || !first) return;
      group.style.setProperty("--slider-x", `${btn.offsetLeft - first.offsetLeft}px`);
      group.style.setProperty("--slider-w", `${btn.offsetWidth}px`);
    };
    place();
    document.fonts?.ready.then(place);   /* button widths change once the web font loads */
  }, [active, labels]);

  return (
    <div className={`btn-group ${className}`} ref={groupRef} role="group" aria-label={ariaLabel}>
      {labels.map(label => (
        <Button
          key={label}
          ref={(el: HTMLButtonElement | null) => { btnRefs.current[label] = el; }}
          className={`btn ${active === label ? "active-group" : ""}`}
          aria-pressed={active === label}
          aria-label={iconOnly ? label : undefined}
          onPress={() => setActive(label)}
        >
          {iconOnly ? <span title={label} style={{ display: "contents" }}>{icons?.[label]}</span> : <>{icons?.[label]}{label}</>}
        </Button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — BUTTONS
   ═══════════════════════════════════════════ */
/* Choice cards — large radio buttons with an optional icon, title and
   description. Used by the Steppers page (step-by-step forms). */
function ChoiceCardsDemo() {
  const [room, setRoom] = useState("urgent");
  const [roomMobile, setRoomMobile] = useState("urgent");
  const [mode, setMode] = useState("video");
  const [type, setType] = useState("schedule");
  const rooms = [
    { id: "primary", name: "Primary Care", hint: "Check-ups, follow-ups, and ongoing conditions.", meta: "Next open today", icon: Stethoscope },
    { id: "urgent", name: "Urgent Care", hint: "Something new that can't wait.", meta: "4 min wait", icon: Zap },
    { id: "behavioral", name: "Behavioral Health", hint: "Support for stress, mood, and sleep.", meta: "Next open Thursday", icon: Lightbulb },
  ];
  return (
    <SubSection title="Choice Cards" description="Large radio buttons for answering a question with one tap. Each card can carry an icon, a title, a description, and a status line. Selected cards get a brand border and tint. Built on React Aria RadioGroup + Radio, so arrow keys move between options.">
      <div className="text-h5 mb-[var(--vsee-sp-3)]">Default</div>
      <RadioGroup aria-label="Room" value={room} onChange={setRoom}>
        <div className="choice-grid">
          {rooms.map(r => (
            <Radio key={r.id} value={r.id} className="choice-card">
              <span className="choice-card-icon"><r.icon size={20} /></span>
              <span className="choice-card-title">{r.name}</span>
              <span className="choice-card-hint">{r.hint}</span>
              <span className="choice-card-meta">{r.meta}</span>
            </Radio>
          ))}
        </div>
      </RadioGroup>

      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Compact with Icon</div>
      <RadioGroup aria-label="Room (compact)" value={roomMobile} onChange={setRoomMobile}>
        <div className="choice-grid">
          {rooms.map(r => (
            <Radio key={r.id} value={r.id} className="choice-card choice-card-compact">
              <span className="choice-card-icon"><r.icon size={18} /></span>
              <span className="choice-card-body">
                <span className="choice-card-title">{r.name}</span>
                <span className="choice-card-hint">{r.meta}</span>
              </span>
            </Radio>
          ))}
        </div>
      </RadioGroup>

      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Text Only</div>
      <RadioGroup aria-label="How would you like to be seen?" value={mode} onChange={setMode}>
        <div className="choice-grid">
          <Radio value="video" className="choice-card choice-card-compact">
            <span className="choice-card-body">
              <span className="choice-card-title">Online</span>
              <span className="choice-card-hint">Join by video or send a secure message from your phone, tablet, or computer. A provider usually replies within the hour, and you can share photos of your symptoms during the visit so they can take a closer look.</span>
            </span>
          </Radio>
          <Radio value="inperson" className="choice-card choice-card-compact">
            <span className="choice-card-body">
              <span className="choice-card-title">In person</span>
              <span className="choice-card-hint">Come to Riverbend Health.</span>
            </span>
          </Radio>
        </div>
      </RadioGroup>

      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>States</div>
      <RadioGroup aria-label="What kind of visit?" value={type} onChange={setType}>
        <div className="choice-grid">
          <Radio value="walkIn" className="choice-card">
            <span className="choice-card-icon"><Clock size={20} /></span>
            <span className="choice-card-title">Default</span>
            <span className="choice-card-hint">Join the queue and be seen next.</span>
            <span className="choice-card-meta">4 min wait</span>
          </Radio>
          <Radio value="schedule" className="choice-card">
            <span className="choice-card-icon"><Calendar size={20} /></span>
            <span className="choice-card-title">Selected</span>
            <span className="choice-card-hint">Pick a time that works for you.</span>
            <span className="choice-card-meta">Next open today</span>
          </Radio>
          <Radio value="econsult" isDisabled className="choice-card">
            <span className="choice-card-icon"><MessageSquare size={20} /></span>
            <span className="choice-card-title">Disabled</span>
            <span className="choice-card-hint">Not offered in this room.</span>
            <span className="choice-card-meta">Unavailable</span>
          </Radio>
        </div>
      </RadioGroup>

      <CodeBlock
        code={`<RadioGroup value={room} onChange={setRoom}>\n  <Label className="question-title">Which room?</Label>\n  <div className="choice-grid">        {/* or .choice-list · .choice-cols-2 · .choice-cols-1 · .choice-row */}\n    <Radio value="urgent" className="choice-card">\n      <span className="choice-card-icon"><Zap size={20} /></span>   {/* optional */}\n      <span className="choice-card-title">Urgent Care</span>\n      <span className="choice-card-hint">Something new that can't wait.</span>\n      <span className="choice-card-meta">4 min wait</span>            {/* optional */}\n    </Radio>\n  </div>\n</RadioGroup>\n\n{/* Compact: icon (optional) left, text right. Works in any layout:\n   .choice-grid / .choice-cols-2 = side by side, .choice-list = stacked rows */}\n<div className="choice-grid">\n  <Radio value="urgent" className="choice-card choice-card-compact">\n    <span className="choice-card-icon"><Zap size={18} /></span>   {/* omit for text only */}\n    <span className="choice-card-body">\n      <span className="choice-card-title">Urgent Care</span>\n      <span className="choice-card-hint">4 min wait</span>\n    </span>\n  </Radio>\n</div>\n\n{/* Disabled */}\n<Radio value="econsult" isDisabled className="choice-card">...</Radio>`}
      />
    </SubSection>
  );
}

/* Choice buttons — radio buttons that look like normal buttons (size, shape,
   text from .btn + .btn-sm / .btn-lg) with Choice Card colours and states
   (.btn-choice). Label only, no description. */
const CONTACT_OPTIONS = [["phone", "Phone call"], ["text", "Text message"], ["email", "Email"], ["video", "Video visit"]];
const CONTACT_ICONS: Record<string, typeof Phone> = { phone: Phone, text: MessageSquare, email: Mail, video: Video };
function ChoiceButtonsDemo() {
  const [contact, setContact] = useState("text");
  const [contactIcon, setContactIcon] = useState("text");
  const [contactIconOnly, setContactIconOnly] = useState("text");
  return (
    <SubSection title="Choice Buttons" description="Radio buttons that look like normal buttons — same sizes, shape and text — with Choice Card colours and states. A label with an optional icon, no description. Pick exactly one; arrow keys move between options.">
      <div className="text-h5 mb-[var(--vsee-sp-3)]">Default</div>
      <RadioGroup aria-label="How should we contact you?" value={contact} onChange={setContact}>
        <div className="choice-inline">
          {CONTACT_OPTIONS.map(([v, l]) => <Radio key={v} value={v} isDisabled={v === "video"} className="btn btn-choice">{l}</Radio>)}
        </div>
      </RadioGroup>

      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>With Icon</div>
      <RadioGroup aria-label="How should we contact you? (with icons)" value={contactIcon} onChange={setContactIcon}>
        <div className="choice-inline">
          {CONTACT_OPTIONS.map(([v, l]) => { const Icon = CONTACT_ICONS[v]; return <Radio key={v} value={v} isDisabled={v === "video"} className="btn btn-choice"><Icon size={16} aria-hidden="true" /> {l}</Radio>; })}
        </div>
      </RadioGroup>

      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Icon Only</div>
      <RadioGroup aria-label="How should we contact you? (icon only)" value={contactIconOnly} onChange={setContactIconOnly}>
        <div className="choice-inline">
          {CONTACT_OPTIONS.map(([v, l]) => { const Icon = CONTACT_ICONS[v]; return <Radio key={v} value={v} aria-label={l} className="btn btn-choice btn-icon"><span title={l} style={{ display: "contents" }}><Icon size={16} aria-hidden="true" /></span></Radio>; })}
        </div>
      </RadioGroup>

      <CodeBlock
        code={`<RadioGroup value={contact} onChange={setContact}>\n  <Label className="question-title">How should we contact you?</Label>\n  <div className="choice-inline">          {/* wraps when needed */}\n    <Radio value="phone" className="btn btn-choice">Phone call</Radio>\n    <Radio value="text" className="btn btn-choice">Text message</Radio>\n    <Radio value="video" isDisabled className="btn btn-choice">Video visit</Radio>\n  </div>\n</RadioGroup>\n\n{/* With icon: put a 16px Lucide icon before the label (14px with btn-sm, 18px with btn-lg) */}\n<Radio value="phone" className="btn btn-choice"><Phone size={16} /> Phone call</Radio>\n\n{/* Icon only: add .btn-icon (38px square) and name it with aria-label */}\n<Radio value="phone" aria-label="Phone call" className="btn btn-choice btn-icon"><Phone size={16} /></Radio>\n\n{/* Sizes: same as normal buttons */}\n<Radio value="phone" className="btn btn-choice btn-sm">Phone call</Radio>   {/* 30px */}\n<Radio value="phone" className="btn btn-choice">Phone call</Radio>          {/* 38px */}\n<Radio value="phone" className="btn btn-choice btn-lg">Phone call</Radio>   {/* 48px */}\n\n/* .btn-choice: white, 1px grey border · hover: darker border\n   [data-selected]: brand border + brand-50 tint · [data-disabled]: 50% opacity */`}
      />
    </SubSection>
  );
}

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

      <SubSection title="With Icons" description="React Aria buttons support any child content — place icons before or after text, or use icon-only buttons.">
        <div className="preview">
          <Button className="btn btn-primary"><Plus size={16} /> New Patient</Button>
          <Button className="btn btn-secondary"><Download size={16} /> Export</Button>
          <Button className="btn btn-ghost"><Share2 size={16} /> Share</Button>
          <Button className="btn btn-danger"><Trash2 size={16} /> Delete</Button>
        </div>
        <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Icon on Right</div>
        <div className="preview">
          <Button className="btn btn-primary">Send <Send size={16} /></Button>
          <Button className="btn btn-secondary">Upload <Upload size={16} /></Button>
          <Button className="btn btn-ghost">Schedule <Calendar size={16} /></Button>
        </div>
        <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Icon Only</div>
        <div className="preview">
          <Button className="btn btn-primary btn-icon"><Plus size={18} /></Button>
          <Button className="btn btn-secondary btn-icon"><Pencil size={18} /></Button>
          <Button className="btn btn-ghost btn-icon"><Heart size={18} /></Button>
          <Button className="btn btn-danger btn-icon"><Trash2 size={18} /></Button>
          <Button className="btn btn-info btn-icon"><Info size={18} /></Button>
        </div>
        <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Sizes with Icons</div>
        <div className="preview">
          <Button className="btn btn-primary btn-lg"><Plus size={16} /> Large</Button>
          <Button className="btn btn-primary"><Plus size={16} /> Default</Button>
          <Button className="btn btn-primary btn-sm"><Plus size={14} /> Small</Button>
        </div>
        <CodeBlock
          code={`/* Icon left */\n<Button className="btn btn-primary"><Plus size={16} /> New Patient</Button>\n\n/* Icon right */\n<Button className="btn btn-primary">Send <Send size={16} /></Button>\n\n/* Icon only */\n<Button className="btn btn-primary btn-icon"><Plus size={18} /></Button>`}
        />
      </SubSection>

      <ChoiceButtonsDemo />

      <ChoiceCardsDemo />

      <SubSection title="Selection Buttons" description="Pick several options from a set, e.g. categories or filters (Choice Buttons pick just one). Selected ones show a check and turn blue. Optional count, and an icon before the label, after it, or both. Keyboard: arrow keys move, Space toggles.">
        <SelectionButtonsDemo />
        <CodeBlock
          code={`const [selected, setSelected] = useState(new Set(["Cardiac", "GI"]));\n\n<SelectionButtons\n  ariaLabel="Categories"\n  items={[{ id: "Cardiac", label: "Cardiac" }, { id: "GI", label: "GI" }, { id: "Other", label: "Other" }]}\n  selectedKeys={selected}\n  onSelectionChange={setSelected}\n  shape="rect"        {/* "rect" (4px corners) | "round" (pill) */}\n  variant="solid"     {/* "solid" | "soft" (light blue + border) */}\n  showCheck           {/* default; showCheck={false}: no check, the colour alone shows selection */}\n/>\n\n/* Item with a count (optional) */\n{ id: "rx", label: "Prescriptions", count: 5 }\n\n/* Renders a multi-select group (React Aria, selectionMode="multiple") — each option: */\n<div className="sel-btn-group">\n  <div className="sel-btn">     {/* + sel-btn-round, sel-btn-soft; aria-selected */}\n    <span className="sel-btn-label"><Check size={14} /> Cardiac</span>  {/* check only when selected */}\n    <span className="sel-btn-count">5</span>\n  </div>\n</div>`}
        />
      </SubSection>

      <SubSection title="Switch Button">
        {/* 24px between the round and square switches */}
        <div className="preview" style={{ gap: "var(--vsee-sp-6)" }}>
          <SwitchButton ariaLabel="Range" labels={["Today", "Week", "Month"]} defaultActive="Week" />
          <SwitchButton ariaLabel="Range" labels={["Day", "Week", "Month", "Year"]} defaultActive="Month" className="btn-group-square" />
        </div>
        <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>With Icons</div>
        <div className="preview" style={{ gap: "var(--vsee-sp-6)" }}>
          <SwitchButton ariaLabel="View" labels={["Desktop", "Mobile"]}
            icons={{ Desktop: <Monitor size={16} aria-hidden="true" />, Mobile: <Smartphone size={16} aria-hidden="true" /> }} />
          <SwitchButton ariaLabel="View" labels={["Desktop", "Mobile"]} className="btn-group-square"
            icons={{ Desktop: <Monitor size={16} aria-hidden="true" />, Mobile: <Smartphone size={16} aria-hidden="true" /> }} />
        </div>
        <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Icon Only</div>
        <div className="preview" style={{ gap: "var(--vsee-sp-6)" }}>
          <SwitchButton ariaLabel="Mode" iconOnly labels={["Light", "Dark"]}
            icons={{ Light: <Sun size={16} aria-hidden="true" />, Dark: <Moon size={16} aria-hidden="true" /> }} />
          <SwitchButton ariaLabel="Mode" iconOnly labels={["Light", "Dark"]} className="btn-group-square"
            icons={{ Light: <Sun size={16} aria-hidden="true" />, Dark: <Moon size={16} aria-hidden="true" /> }} />
        </div>
        <CodeBlock
          code={`const [active, setActive] = useState("Week");\n\n<div className="btn-group" role="group" aria-label="Range">\n  {["Today", "Week", "Month"].map(label => (\n    <Button\n      key={label}\n      className={\`btn \${active === label ? "active-group" : ""}\`}\n      aria-pressed={active === label}\n      onPress={() => setActive(label)}\n    >{label}</Button>\n  ))}\n</div>\n\n{/* Square variant */}\n<div className="btn-group btn-group-square">...</div>\n\n/* Component: SwitchButton (renders the markup above) */\n<SwitchButton ariaLabel="Range" labels={["Today", "Week", "Month"]} defaultActive="Week" />\n\n/* With icons — an icon before each label */\n<SwitchButton ariaLabel="View" labels={["Desktop", "Mobile"]}\n  icons={{ Desktop: <Monitor size={16} aria-hidden="true" />, Mobile: <Smartphone size={16} aria-hidden="true" /> }} />\n\n/* Icon only — no text; each label becomes the button's accessible name + tooltip */\n<SwitchButton ariaLabel="Mode" iconOnly labels={["Light", "Dark"]}\n  icons={{ Light: <Sun size={16} aria-hidden="true" />, Dark: <Moon size={16} aria-hidden="true" /> }} />\n\n/* Controlled: value + onChange */\n<SwitchButton ariaLabel="Mode" iconOnly labels={["Light", "Dark"]} value={dark ? "Dark" : "Light"} onChange={l => setDark(l === "Dark")} icons={…} />`}
        />
      </SubSection>

      <SubSection title="Toggles">
        <Toggle />
        <CodeBlock
          code={`/* Default toggle */\n<Switch isSelected={on} onChange={setOn} className="toggle-wrap">\n  <div className={\`toggle-track \${on ? "on" : ""}\`}>\n    <div className="toggle-thumb" />\n  </div>\n  <span className="toggle-label">Notifications</span>\n</Switch>\n\n/* Labeled toggle (On/Off) */\n<Switch isSelected={on} onChange={setOn} className="toggle-wrap">\n  <div className={\`toggle-track-labeled \${on ? "on" : ""}\`}>\n    <span className="toggle-text toggle-text-on">On</span>\n    <span className="toggle-text toggle-text-off">Off</span>\n    <div className="toggle-thumb-labeled" />\n  </div>\n  <span className="toggle-label">Auto-save</span>\n</Switch>\n\n/* Disabled toggle */\n<Switch isSelected={false} isDisabled className="toggle-wrap">\n  <div className="toggle-track">\n    <div className="toggle-thumb" />\n  </div>\n  <span className="toggle-label">Unavailable</span>\n</Switch>`}
        />
      </SubSection>

      <SubSection title="Color Swatches" description="Pick one color from a row of circles — e.g. the brand theme on the Pages' top bars. Each circle is a button named for its color; the chosen one gets a ring.">
        <ColorSwatchesDemo />
        <CodeBlock
          code={`const [color, setColor] = useState("green");

<ColorSwatches
  ariaLabel="Brand"                 {/* names the group for screen readers */}
  options={[
    { id: "green",  label: "Green (default)", color: "#0D875C" },
    { id: "blue",   label: "Blue",            color: "#0891B2" },
    { id: "purple", label: "Purple",          color: "#7C3AED" },
  ]}
  value={color}
  onChange={setColor}
/>

/* Renders */
<div className="ds-theme-options" role="group" aria-label="Brand">
  <button className="ds-theme-dot active" style={{ background: "#0D875C" }}
    aria-pressed="true" aria-label="Green (default)" title="Green (default)" />
  <button className="ds-theme-dot" style={{ background: "#0891B2" }}
    aria-pressed="false" aria-label="Blue" title="Blue" />
  …
</div>`}
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
/* ═══════════════════════════════════════════
   FILE UPLOAD — from the Patient Portal "Reason for your visit" step
   Drop files on the dashed zone or press "Choose files". Files are checked
   for type, empty files, size and the max file count; rejected ones are
   listed under the button. Accepted files appear in a list where each row
   shows its upload state: uploading (progress + Cancel), uploaded (Remove),
   failed (message + Retry + Remove) or blocked (message + Remove).
   ═══════════════════════════════════════════ */

type DropEvent = Parameters<NonNullable<DropZoneProps["onDrop"]>>[0];

/** No status = uploaded. "failed" can be retried; "blocked" (e.g. security scan) can only be removed. */
type UploadStatus = "uploading" | "uploaded" | "failed" | "blocked";
type UploadedFile = {
  id: string; name: string; size: string; file?: File;
  status?: UploadStatus;
  /** 0–100 while uploading. */
  progress?: number;
  /** Overrides the default message for "failed" / "blocked". */
  error?: string;
};

const UPLOAD_FAILED_MSG = "Upload failed. Check your connection and try again.";
const UPLOAD_BLOCKED_MSG = "This file didn't pass our security check and can't be uploaded.";

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function FileUpload({
  label = "Photos or documents",
  title = "Drag & drop files here",
  hint = "JPG, PNG, or PDF up to 20 MB each.",
  note,
  files,
  onChange,
  acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"],
  maxSizeMB = 20,
  maxFiles,
  onRetry,
  isDisabled,
  initialErrors = [],
}: {
  label?: string; title?: string; hint?: string; note?: string;
  files: UploadedFile[]; onChange: (files: UploadedFile[]) => void;
  acceptedFileTypes?: string[]; maxSizeMB?: number;
  /** Most files the field holds; extra files are turned away with a message. */
  maxFiles?: number;
  /** Shows a Retry button on failed uploads. */
  onRetry?: (id: string) => void;
  isDisabled?: boolean;
  /** Demo only: start with these error messages showing. */
  initialErrors?: string[];
}) {
  const labelId = useId();
  const noteId = useId();
  const [errors, setErrors] = useState<string[]>(initialErrors);

  const add = (incoming: File[]) => {
    const ok: UploadedFile[] = [];
    const bad: string[] = [];
    for (const f of incoming) {
      // The picker filters by type, but drag & drop and "All files" in the dialog don't.
      if (acceptedFileTypes.length && !acceptedFileTypes.includes(f.type)) bad.push(`${f.name} isn't a supported file type.`);
      else if (f.size === 0) bad.push(`${f.name} is empty.`);
      else if (f.size > maxSizeMB * 1024 * 1024) bad.push(`${f.name} is larger than ${maxSizeMB} MB.`);
      else ok.push({ id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(36).slice(2, 7)}`, name: f.name, size: formatSize(f.size), file: f });
    }
    if (maxFiles !== undefined && files.length + ok.length > maxFiles) {
      const room = Math.max(0, maxFiles - files.length);
      const left = ok.length - room;
      ok.splice(room);
      bad.push(`You can add up to ${maxFiles} files. ${left} ${left === 1 ? "file wasn't" : "files weren't"} added.`);
    }
    setErrors(bad);
    if (ok.length) onChange([...files, ...ok]);
  };

  const onDrop = async (e: DropEvent) => {
    const items = e.items.filter((i): i is FileDropItem => i.kind === "file");
    add(await Promise.all(items.map(i => i.getFile())));
  };

  return (
    <div className="form-group" role="group" aria-labelledby={labelId} aria-describedby={note ? noteId : undefined}>
      <div className="upload-head">
        <div id={labelId} className="form-label">{label}</div>
        {note && <div id={noteId} className="upload-note">{note}</div>}
      </div>
      <DropZone className="upload-zone" isDisabled={isDisabled} onDrop={onDrop}
        getDropOperation={() => (isDisabled ? "cancel" : "copy")}
        aria-label={`${label}: drop files here`}>
        <div className="upload-zone-main">
          <FilePlus size={32} className="upload-zone-icon" aria-hidden="true" />
          <span className="upload-zone-text">
            <span className="upload-zone-title">{title}</span>
            <span className="upload-zone-hint">{hint}</span>
          </span>
          <span className="upload-zone-action">
            <FileTrigger allowsMultiple acceptedFileTypes={acceptedFileTypes} onSelect={list => list && add(Array.from(list))}>
              <Button className="btn btn-secondary" isDisabled={isDisabled}>Choose files</Button>
            </FileTrigger>
          </span>
        </div>
        {/* Files turned away before upload (type, empty, size, count) — design-system danger alert as a bar */}
        <div role="alert" className="upload-zone-alert-slot">
          {errors.map(m => (
            <div key={m} className="alert alert-danger upload-zone-alert">
              <AlertCircle size={16} className="alert-icon" aria-hidden="true" />
              <span className="upload-zone-alert-text">{m}</span>
              <Button className="notification-close" aria-label={`Dismiss: ${m}`} onPress={() => setErrors(es => es.filter(e => e !== m))}><X size={14} /></Button>
            </div>
          ))}
        </div>
        {files.length > 0 && (
          <ul className="file-list" aria-label="Attached files">
            {files.map(f => {
              const status = f.status ?? "uploaded";
              const remove = () => onChange(files.filter(x => x.id !== f.id));
              const Icon = status === "uploading" ? Loader2 : status === "failed" || status === "blocked" ? AlertCircle : FileText;
              return (
                <li key={f.id} className="file-row" data-status={status}>
                  <span className="file-row-lead">
                    <Icon size={16} className="file-row-icon" aria-hidden="true" />
                    {status === "uploading" && <span className="file-row-percent" aria-hidden="true">{Math.round(f.progress ?? 0)}%</span>}
                  </span>
                  <span className="file-row-main">
                    <span className="file-row-top">
                      <span className="file-row-name" title={f.name}>{f.name}</span>
                      <span className="file-row-size">{f.size}</span>
                    </span>
                    {status === "uploading" && (
                      <span className="file-row-progress-line">
                        <span className="progress-track file-row-progress" role="progressbar" aria-label={`Uploading ${f.name}`}
                          aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(f.progress ?? 0)}>
                          <span className="progress-bar progress-bar-brand" style={{ width: `${f.progress ?? 0}%` }} />
                        </span>
                      </span>
                    )}
                    {(status === "failed" || status === "blocked") && (
                      <span className="file-row-error" role="alert">
                        {f.error ?? (status === "failed" ? UPLOAD_FAILED_MSG : UPLOAD_BLOCKED_MSG)}
                      </span>
                    )}
                  </span>
                  <span className="file-row-actions">
                    {status === "failed" && onRetry && (
                      <Button className="btn btn-secondary btn-sm" aria-label={`Retry ${f.name}`} isDisabled={isDisabled}
                        onPress={() => onRetry(f.id)}>Retry</Button>
                    )}
                    <Button className="btn btn-ghost btn-sm" aria-label={`${status === "uploading" ? "Cancel" : "Remove"} ${f.name}`} isDisabled={isDisabled}
                      onPress={remove}>{status === "uploading" ? "Cancel" : "Remove"}</Button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </DropZone>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SELECTION LIST — from the Patient Portal "Update your health history" editor
   One bordered box: an optional search field on top, every option shown
   directly in the scrollable middle (tap rows to check as many as apply),
   and the picked items summarised at the bottom as removable tags.
   ═══════════════════════════════════════════ */

function SelectionList({
  label,
  hint,
  options,
  value,
  onChange,
  searchPlaceholder,
  showSelectedTags = true,
  emptyText = "No match.",
  maxHeight = 260,
  isDisabled,
  hideLabel,
}: {
  label: string;
  /** Keep the label for screen readers only (when a heading above already names the list). */
  hideLabel?: boolean;
  hint?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Shows a search field at the top of the box when set. */
  searchPlaceholder?: string;
  /** Show the "N selected" removable tags at the bottom of the box. */
  showSelectedTags?: boolean;
  /** Shown when the search matches nothing. */
  emptyText?: string;
  maxHeight?: number;
  isDisabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = q ? options.filter(o => o.toLowerCase().includes(q)) : options;

  return (
    <CheckboxGroup className="form-group" value={value} onChange={onChange} isDisabled={isDisabled}>
      <Label className={hideLabel ? "sr-only" : "form-label"}>{label}</Label>
      {hint && <Text slot="description" className="form-hint option-list-hint">{hint}</Text>}
      {/* One bordered box: search on top, options in the middle, selected items at the bottom */}
      <div className="option-box">
        {searchPlaceholder && (
          <label className="option-box-search">
            <Search size={16} aria-hidden="true" />
            <input className="option-box-input" type="search" placeholder={searchPlaceholder} aria-label={searchPlaceholder}
              value={query} onChange={e => setQuery(e.target.value)} disabled={isDisabled} />
          </label>
        )}
        <div className="option-list" style={{ maxHeight }}>
          {matches.map(o => (
            <Checkbox key={o} value={o} className="option-list-item">
              {({ isSelected }) => (
                <>
                  <span className={`check-box${isSelected ? " checked" : ""}`}>
                    {isSelected && <svg className="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                  </span>
                  {o}
                </>
              )}
            </Checkbox>
          ))}
          {matches.length === 0 && <div className="option-list-empty">{emptyText}</div>}
        </div>
        {showSelectedTags && value.length > 0 && (
          <TagGroup selectionMode="none" className="option-box-selected" aria-label={`${label}: selected`}
            disabledKeys={isDisabled ? value : undefined}
            onRemove={keys => onChange(value.filter(v => !keys.has(v)))}>
            <TagList className="tag-list">
              {value.map(v => (
                <Tag key={v} id={v} className="chip" textValue={v}>
                  {v}
                  <Button slot="remove" className="tag-remove" aria-label={`Remove ${v}`}><X size={12} /></Button>
                </Tag>
              ))}
            </TagList>
          </TagGroup>
        )}
      </div>
    </CheckboxGroup>
  );
}

/* ═══════════════════════════════════════════
   ONE QUESTION PER PAGE — "See a provider" flow
   Follows Patient Portal v2 (Patient Portal v2.dc.html): Room → Visit type →
   Provider (and time) → Reason → Health history → Confirm. Join Queue skips
   the provider step, so that flow has 5 steps instead of 6.
   Desktop page indicator = labelled step bars; mobile = "Step X of N" + pips.
   ═══════════════════════════════════════════ */

/* ── Data (from the design) ─────────────────── */
const CLINIC = "Riverbend Health";
const HOME_STATE = "Oregon";
const PATIENT = "Maya Chen (you)";

type Mode = "video" | "inperson";
type Flow = "walkIn" | "schedule" | "econsult";
type StepId = "room" | "type" | "provider" | "reason" | "history" | "confirm";

const ICON_PATHS: Record<string, string> = {
  primary: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21l8.84-8.61a5.5 5.5 0 0 0 0-7.78Z",
  urgent: "M13 2 3 14h9l-1 8 10-12h-9l1-8Z",
  behavioral: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z",
  womens: "M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 12v10M9 19h6",
};
const RoomIcon = ({ id, size }: { id: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON_PATHS[id]} /></svg>
);

const ROOMS = [
  { id: "primary", name: "Primary Care", hint: "Your own provider for check-ups, follow-ups, and ongoing conditions.", wait: "Next open today", providers: ["DR", "SO"], walkIn: true, schedule: true, econsult: true },
  { id: "urgent", name: "Urgent Care", hint: "Something new that can't wait. Open until 11pm.", wait: "4 min wait", providers: ["JL", "DR", "SO"], walkIn: true, schedule: true, econsult: true },
  { id: "behavioral", name: "Behavioral Health", hint: "Therapy and medication support for stress, mood, and sleep.", wait: "Next open Thursday", providers: ["NW"], walkIn: false, schedule: true, econsult: true },
  { id: "womens", name: "Women's Health", hint: "Annual exams, contraception, and pregnancy care.", wait: "Next open Friday", providers: ["HM"], walkIn: false, schedule: true, econsult: true },
];
const CARE_TEAM = [
  { initials: "DR", name: "Dr. Dana Reyes", role: "Family medicine" },
  { initials: "SO", name: "Dr. Samuel Okafor", role: "Internal medicine" },
  { initials: "JL", name: "Jamie Liu, NP", role: "Urgent care · 8 yrs" },
  { initials: "NW", name: "Nadia Weiss, LCSW", role: "Behavioral health" },
  { initials: "HM", name: "Dr. Hana Moore", role: "Women's health" },
];
const VISIT_TYPES = [
  { id: "urgent", label: "Something new or urgent", hint: "Cold, rash, infection, minor injury" },
  { id: "followup", label: "Follow-up with my provider", hint: "Check in on an existing issue" },
  { id: "refill", label: "Medication or refill question", hint: "Usually resolved without a visit" },
  { id: "annual", label: "Annual physical", hint: "45 minutes, in person" },
];
const SLOT_POOL = [["9:00 AM", "11:00 AM", "3:00 PM"], ["8:30 AM", "1:00 PM"], ["10:00 AM", "2:15 PM", "4:00 PM"], ["11:30 AM"], ["8:00 AM", "9:30 AM", "11:15 AM", "1:45 PM", "4:30 PM"]];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const HISTORY_GROUPS = [
  { key: "conditions", label: "Past and current medical conditions", hint: "Search or pick anything that applies.", searchPlaceholder: "Search conditions, e.g. diabetes", otherLabel: "Other conditions", otherPlaceholder: "e.g. hypothyroidism", noneLabel: "None", addLabel: "I have conditions",
    options: ["Arthritis", "Diabetes", "High blood pressure", "Irritable bowel", "Osteoporosis", "Cancer", "Depression/anxiety", "Heart problems", "High cholesterol", "Lung problems", "Thyroid problems"] },
  { key: "allergies", label: "Drug allergies", hint: "Search or pick the medicines you react to.", searchPlaceholder: "Search medicines, e.g. penicillin", otherLabel: "Other drug allergies", otherPlaceholder: "e.g. contrast dye — hives", noneLabel: "No known drug allergies", addLabel: "I have drug allergies",
    options: ["Penicillin", "Amoxicillin", "Cephalexin (Keflex)", "Sulfa drugs (Bactrim)", "Azithromycin (Z-Pak)", "Ciprofloxacin", "Levofloxacin", "Clindamycin", "Doxycycline", "Vancomycin", "Nitrofurantoin (Macrobid)", "Metronidazole (Flagyl)", "Aspirin", "Ibuprofen (Advil, Motrin)", "Naproxen (Aleve)", "Celecoxib (Celebrex)", "Acetaminophen (Tylenol)", "Codeine", "Morphine", "Oxycodone", "Hydrocodone", "Tramadol", "Lidocaine", "Local anesthetics", "General anesthesia", "Contrast dye (iodinated)", "Latex", "Adhesive tape", "Statins", "ACE inhibitors (lisinopril)", "Metformin", "Prednisone", "Phenytoin", "Carbamazepine", "Lamotrigine", "Lithium", "Allopurinol", "Heparin", "Warfarin", "Insulin", "Influenza vaccine", "Egg-based vaccines", "Sulfites"] },
  { key: "medications", label: "Current medications", hint: "Search or pick anything you take regularly, prescription or not.", searchPlaceholder: "Search medicines, e.g. lisinopril", otherLabel: "Other medications", otherPlaceholder: "e.g. metformin 500mg twice daily", noneLabel: "None", addLabel: "I take medications",
    options: ["Lisinopril", "Losartan", "Amlodipine", "Metoprolol", "Carvedilol", "Hydrochlorothiazide", "Atorvastatin (Lipitor)", "Rosuvastatin (Crestor)", "Simvastatin", "Ezetimibe", "Metformin", "Insulin (any type)", "Semaglutide (Ozempic, Wegovy)", "Empagliflozin (Jardiance)", "Glipizide", "Levothyroxine (Synthroid)", "Methimazole", "Omeprazole (Prilosec)", "Pantoprazole (Protonix)", "Famotidine (Pepcid)", "Albuterol inhaler", "Fluticasone inhaler (Flovent)", "Montelukast (Singulair)", "Cetirizine (Zyrtec)", "Loratadine (Claritin)", "Fexofenadine (Allegra)", "Sertraline (Zoloft)", "Escitalopram (Lexapro)", "Fluoxetine (Prozac)", "Bupropion (Wellbutrin)", "Duloxetine (Cymbalta)", "Trazodone", "Alprazolam (Xanax)", "Lorazepam (Ativan)", "Aripiprazole (Abilify)", "Quetiapine (Seroquel)", "Lamotrigine", "Lithium", "Adderall or amphetamine salts", "Methylphenidate (Ritalin, Concerta)", "Gabapentin", "Pregabalin (Lyrica)", "Sumatriptan (Imitrex)", "Topiramate", "Ibuprofen (Advil, Motrin)", "Naproxen (Aleve)", "Acetaminophen (Tylenol)", "Meloxicam", "Prednisone", "Aspirin (low dose)", "Clopidogrel (Plavix)", "Apixaban (Eliquis)", "Warfarin", "Allopurinol", "Tamsulosin (Flomax)", "Finasteride", "Sildenafil (Viagra)", "Birth control pill", "Estradiol", "Alendronate (Fosamax)", "Vitamin D", "Multivitamin", "Iron supplement", "Fish oil", "Magnesium", "Probiotic"] },
  { key: "surgeries", label: "Past surgical history", hint: "Search or pick any surgery or procedure you have had.", searchPlaceholder: "Search procedures, e.g. appendectomy", otherLabel: "Other surgeries or procedures", otherPlaceholder: "e.g. rotator cuff repair, 2019", noneLabel: "No past surgeries", addLabel: "I have had surgery",
    options: ["Appendectomy", "Gallbladder removal (cholecystectomy)", "Hernia repair", "Tonsillectomy", "Adenoidectomy", "Wisdom teeth extraction", "Cesarean section", "Hysterectomy", "Tubal ligation", "Vasectomy", "Knee arthroscopy", "Knee replacement", "Hip replacement", "Shoulder surgery", "Spine or back surgery", "Carpal tunnel release", "ACL repair", "Cardiac bypass (CABG)", "Coronary stent or angioplasty", "Pacemaker or defibrillator", "Heart valve surgery", "Cataract surgery", "LASIK or refractive surgery", "Sinus surgery", "Thyroid surgery", "Bariatric or weight loss surgery", "Colon resection", "Colonoscopy with polyp removal", "Breast surgery or lumpectomy", "Mastectomy", "Prostate surgery", "Kidney stone removal", "Skin cancer excision", "Cosmetic or plastic surgery", "Amputation", "Organ transplant"] },
  { key: "social", label: "Social history", hint: "Pick whatever describes you now. This helps your provider give better advice.", searchPlaceholder: "Search, e.g. smoking", otherLabel: "Anything else about your daily life", otherPlaceholder: "e.g. night shift work, caring for a parent", noneLabel: "Nothing to report", addLabel: "I have things to share",
    options: ["Never smoked", "Former smoker", "Current smoker", "Vape or e-cigarettes", "Chewing tobacco", "Trying to quit tobacco", "No alcohol", "Alcohol occasionally", "Alcohol weekly", "Alcohol daily", "Cannabis use", "Recreational drug use", "In recovery", "Exercise rarely", "Exercise 1–2 times a week", "Exercise 3 or more times a week", "Mostly sitting during the day", "Physically demanding work", "Sleep under 6 hours most nights", "Trouble sleeping", "High stress at home or work", "Feeling isolated or lonely", "Live alone", "Live with family or partner", "Caregiver for someone else", "Employed full time", "Employed part time", "Student", "Retired", "Not currently working", "Military service history", "Trouble affording food", "Trouble affording medications", "Unstable housing", "No reliable transportation", "Vegetarian or vegan diet", "Pregnant or trying to conceive"] },
  { key: "vaccinations", label: "Vaccination history", hint: "Pick the vaccines you have received.", searchPlaceholder: "Search vaccines, e.g. tetanus", otherLabel: "Other vaccines", otherPlaceholder: "e.g. yellow fever, 2023", noneLabel: "No vaccinations on record", addLabel: "I have had vaccinations",
    options: ["COVID-19, primary series", "COVID-19, most recent booster", "Influenza (this season)", "Tdap or tetanus booster", "Shingles (Shingrix)", "Pneumococcal (Prevnar or Pneumovax)", "RSV vaccine", "Hepatitis A", "Hepatitis B", "HPV (Gardasil)", "MMR (measles, mumps, rubella)", "Varicella (chickenpox)", "Polio (IPV)", "Meningococcal (MenACWY)", "Meningococcal B", "Haemophilus influenzae type b (Hib)", "Rotavirus", "Typhoid", "Yellow fever", "Japanese encephalitis", "Rabies", "Tuberculosis (BCG)", "Anthrax or smallpox (military or occupational)"] },
];

type History = { picked: Record<string, string[]>; none: Record<string, boolean>; other: Record<string, string> };
const INITIAL_HISTORY: History = {
  none: { conditions: false, allergies: true, medications: false, surgeries: false, social: false, vaccinations: false },
  picked: {
    conditions: ["High blood pressure", "Thyroid problems"],
    allergies: [],
    medications: ["Lisinopril", "Levothyroxine (Synthroid)", "Iron supplement", "Vitamin D"],
    surgeries: ["Appendectomy", "Wisdom teeth extraction", "Cesarean section"],
    social: ["Never smoked", "Alcohol occasionally", "Exercise 1–2 times a week", "Live with family or partner", "Employed full time"],
    vaccinations: ["COVID-19, primary series", "COVID-19, most recent booster", "Influenza (this season)", "Tdap or tetanus booster", "HPV (Gardasil)"],
  },
  other: { conditions: "Iron deficiency anemia, diagnosed 2024", medications: "Ferrous sulfate 325mg every other day" },
};

/* ── Helpers ────────────────────────────────── */
const startOfToday = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const openTimes = (d: Date) => {
  const dow = d.getDay();
  if (dow === 0 || dow === 6 || d < startOfToday()) return [];
  return SLOT_POOL[(d.getDate() + dow) % SLOT_POOL.length];
};
/** Month grid starting on Sunday, trimmed after the last week of the month. */
function monthDays(offset: number) {
  const t = startOfToday();
  const y = new Date(t.getFullYear(), t.getMonth() + offset, 1).getFullYear();
  const m = new Date(t.getFullYear(), t.getMonth() + offset, 1).getMonth();
  const first = new Date(y, m, 1);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(y, m, 1 - first.getDay() + i);
    if (i > 0 && i % 7 === 0 && d.getMonth() !== m && d > first) break;
    days.push(d);
  }
  return { label: `${MONTHS[m]} ${y}`, month: m, year: y, days };
}
const slotLabel =(d: Date, t: string) => `${t} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;

/** Calendar + time slots. Days with no open times (weekends, past days) are
    disabled; picking a day shows its open times beside it (below when stacked). */
/** True while the media query matches; re-renders when it changes. */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    onChange => { const m = window.matchMedia(query); m.addEventListener("change", onChange); return () => m.removeEventListener("change", onChange); },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function SlotPicker({ date, slot, onDateChange, onSlotChange, stacked: stackedProp, timesFor = openTimes, onConfirm, onCancel }: {
  date: Date | null; slot: string | null;
  onDateChange: (d: Date) => void; onSlotChange: (t: string) => void;
  /** Force the stacked (mobile) layout on or off. Leave it out to stack automatically on screens 640px wide or less. */
  stacked?: boolean; timesFor?: (d: Date) => string[];
  /** Shows a Confirm button in the summary row (enabled once a day and time are picked). */
  onConfirm?: (date: Date, slot: string) => void;
  /** Shows a Cancel button in the summary row; the page decides what it does. */
  onCancel?: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const narrowScreen = useMediaQuery("(max-width: 640px)");
  const stacked = stackedProp ?? narrowScreen;
  const cal = monthDays(offset);
  const times = date ? timesFor(date) : [];
  // Month / year dropdowns move the view by changing the month offset from today
  const today = startOfToday();
  const goTo = (year: number, month: number) => setOffset((year - today.getFullYear()) * 12 + month - today.getMonth());
  const years = [0, 1, 2].map(n => today.getFullYear() + n);
  if (!years.includes(cal.year)) years.push(cal.year); // the ‹ › arrows can step outside the list
  years.sort((a, b) => a - b);
  return (
    <div>
      <div className={`slot-picker${stacked ? " slot-picker-stacked" : ""}`}>
        <div className="slot-cal">
          <div className="slot-cal-head">
            <Button className="calendar-nav-btn" aria-label="Previous month" onPress={() => setOffset(o => o - 1)}><ChevronLeft size={16} /></Button>
            <div className="slot-cal-month" style={{ display: "flex", alignItems: "center", gap: "var(--vsee-sp-4)" }}>
              <Select aria-label="Month" selectedKey={cal.month} onSelectionChange={k => goTo(cal.year, Number(k))}>
                <Button className="btn btn-link">
                  <SelectValue />
                  {!stacked && <ChevronDown size={14} aria-hidden="true" />}{/* no chevron when stacked, to save room */}
                </Button>
                <Popover className="select-popover">
                  <ListBox className="select-listbox">
                    {MONTHS.map((name, i) => <ListBoxItem key={name} id={i} className="select-option">{name}</ListBoxItem>)}
                  </ListBox>
                </Popover>
              </Select>
              <Select aria-label="Year" selectedKey={cal.year} onSelectionChange={k => goTo(Number(k), cal.month)}>
                <Button className="btn btn-link"><SelectValue />{!stacked && <ChevronDown size={14} aria-hidden="true" />}</Button>
                <Popover className="select-popover">
                  <ListBox className="select-listbox">
                    {years.map(y => <ListBoxItem key={y} id={y} className="select-option">{String(y)}</ListBoxItem>)}
                  </ListBox>
                </Popover>
              </Select>
            </div>
            <Button className="calendar-nav-btn" aria-label="Next month" onPress={() => setOffset(o => o + 1)}><ChevronRight size={16} /></Button>
          </div>
          <div className="slot-cal-grid slot-cal-weekdays" aria-hidden="true">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(w => <div key={w} className="slot-cal-weekday">{w}</div>)}
          </div>
          <div className="slot-cal-grid">
            {cal.days.map(d => {
              const open = timesFor(d).length > 0;
              const selected = !!date && sameDay(date, d);
              return (
                <button key={d.toISOString()} type="button" className="slot-cal-day" disabled={!open}
                  data-open={open || undefined} data-outside={d.getMonth() !== cal.month || undefined} data-selected={selected || undefined}
                  aria-pressed={selected} aria-label={d.toDateString() + (open ? "" : ", no open times")}
                  onClick={() => onDateChange(d)}>
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          {date && times.length > 0 && (
            /* Time slots are Choice Buttons (radio group of .btn.btn-choice) laid out in the .slot-times grid */
            <RadioGroup aria-label="Open times" value={slot ?? ""} onChange={onSlotChange}>
              <div className="slot-times">
                {times.map(t => <Radio key={t} value={t} className="btn btn-choice">{t}</Radio>)}
              </div>
            </RadioGroup>
          )}
          {date && times.length === 0 && <div className="text-caption" style={{ color: "var(--vsee-text-secondary)" }}>No open times on this day. Try another date.</div>}
        </div>
      </div>
      {/* Summary row — part of the component, not the surrounding panel.
          Desktop: optional Cancel bottom left; summary text + optional Confirm bottom right.
          Stacked (mobile): summary text, then a row with an X-icon Cancel far left and Confirm on the right. */}
      {(() => {
        const summaryText = (
          <div className="text-caption" aria-live="polite" style={{ textAlign: "right", color: "var(--vsee-text-secondary)" }}>
            {!date ? "Pick a day to see open time slots."
              : !slot ? "Pick a time slot."
              : <>Schedule at <span style={{ color: "var(--vsee-brand-dark)", fontWeight: 600 }}>{slotLabel(date, slot)}</span></>}
          </div>
        );
        const cancelBtn = onCancel && <Button className="btn btn-secondary" onPress={onCancel}>Cancel</Button>;
        // Stacked (mobile): large 48px Confirm, matching the 48px X-icon Cancel beside it
        const confirmBtn = onConfirm && <Button className={`btn btn-primary${stacked ? " btn-lg" : ""}`} isDisabled={!date || !slot} onPress={() => date && slot && onConfirm(date, slot)}>Confirm</Button>;
        return stacked ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--vsee-sp-3)", marginTop: "var(--vsee-sp-4)" }}>
            {summaryText}
            {(onCancel || onConfirm) && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", alignSelf: "stretch", gap: "var(--vsee-sp-3)" }}>
                {onCancel && <Button className="btn btn-ghost flow-cancel-icon" aria-label="Cancel" onPress={onCancel}><X size={20} /></Button>}
                {onConfirm && <span style={{ marginLeft: "auto" }}>{confirmBtn}</span>}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--vsee-sp-3)", marginTop: "var(--vsee-sp-4)" }}>
            {cancelBtn}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: "var(--vsee-sp-3)", marginLeft: "auto" }}>
              {summaryText}
              {confirmBtn}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

type Choice = { id: string; name: string; hint?: string; meta?: string; icon?: ReactNode; disabled?: boolean };

/** One question answered by picking a card (React Aria radio group). */
function ChoiceQuestion({ label, hint, options, value, onChange, layout, compact, small }: {
  label: string; hint?: string; options: Choice[]; value: string | null; onChange: (v: string) => void;
  layout: string; compact?: boolean; small?: boolean;
}) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <Label className="question-title">{label}</Label>
      {hint && <div className="question-hint">{hint}</div>}
      <div className={layout}>
        {options.map(o => (
          <Radio key={o.id} value={o.id} isDisabled={o.disabled}
            className={`choice-card${compact ? " choice-card-compact" : ""}${small ? " choice-card-sm" : ""}`}>
            {o.icon && <span className="choice-card-icon">{o.icon}</span>}
            {compact ? (
              <span className="choice-card-body">
                <span className="choice-card-title">{o.name}</span>
                {(o.meta || o.hint) && <span className="choice-card-hint">{o.meta || o.hint}</span>}
              </span>
            ) : (
              <>
                <span className="choice-card-title">{o.name}</span>
                {o.hint && <span className="choice-card-hint">{o.hint}</span>}
                {o.meta && <span className="choice-card-meta">{o.meta}</span>}
              </>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}

/* ── The flow ───────────────────────────────── */
/* fill: stretch to the parent's height and keep the Cancel / Back / Continue row at the bottom
   when the step is shorter than the screen (used by the phone frame in the Mobile view). */
function OneQuestionFlow({ layout, fill }: { layout: "desktop" | "mobile"; fill?: boolean }) {
  const mobile = layout === "mobile";

  const [stepId, setStepId] = useState<StepId>("room");
  const [roomId, setRoomId] = useState("primary");
  const [mode, setMode] = useState<Mode | null>(null);
  const [type, setType] = useState<Flow | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [complaint, setComplaint] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [history, setHistory] = useState<History>(INITIAL_HISTORY);
  const [histSaved, setHistSaved] = useState<History | null>(null); // snapshot while editing
  const [reminder, setReminder] = useState(true);
  const [notice, setNotice] = useState<{ text: string; warn: boolean } | null>(null);
  const [result, setResult] = useState<{ title: string; line: string } | null>(null);

  /* Derived state — mirrors the design's rules */
  const room = ROOMS.find(r => r.id === roomId)!;
  const team = room.providers.map(i => CARE_TEAM.find(p => p.initials === i)!);
  const provider = team.find(p => p.initials === providerId) ?? team[0];
  const inPersonOnly = mode === "inperson";
  const flow: Flow | null = type ?? (inPersonOnly ? "schedule" : null);
  const steps: StepId[] = flow === "walkIn" ? ["room", "type", "reason", "history", "confirm"] : ["room", "type", "provider", "reason", "history", "confirm"];
  const labels = flow === "walkIn"
    ? ["Room", "Visit type", "Reason", "Health history", "Confirm"]
    : ["Room", "Visit type", flow === "econsult" ? "Provider" : "Provider and time", "Reason", "Health history", "Confirm"];
  const idx = steps.indexOf(stepId);
  const modeLabel = mode === "inperson" ? "In person" : "Online";
  const editingHistory = histSaved !== null;
  const hasHistoryRecord = HISTORY_GROUPS.some(g => (history.picked[g.key] || []).length > 0 || history.none[g.key]);
  const historyCount = ["conditions", "allergies", "medications"].reduce((n, k) =>
    n + (history.none[k] ? 0 : (history.picked[k] || []).length + (history.other[k]?.trim() ? 1 : 0)), 0);
  const historySummary = historyCount ? `${historyCount} item${historyCount === 1 ? "" : "s"} noted` : "Nothing noted";
  const scheduled = date && slot ? slotLabel(date, slot) : null;

  const warn = (text: string) => setNotice({ text, warn: true });
  const goTo = (s: StepId) => { setNotice(null); setStepId(s); };
  const reset = () => {
    setStepId("room"); setRoomId("primary"); setMode(null); setType(null); setProviderId(null); setDate(null); setSlot(null);
    setReason(null); setComplaint(""); setFiles([]); setHistory(INITIAL_HISTORY); setHistSaved(null); setReminder(true); setNotice(null); setResult(null);
  };

  /* Why Continue can't proceed yet (null = it can) */
  const blocker = (): string | null => {
    if (stepId === "type") {
      if (!mode) return "Pick how you'd like to be seen first.";
      if (!flow) return "Pick how you'd like to start.";
    }
    if (stepId === "provider" && flow === "schedule") {
      if (!date) return "Pick a date to continue.";
      if (!slot) return "Pick a time to continue.";
    }
    return null;
  };
  const next = () => {
    const why = blocker();
    if (why) return warn(why);
    if (stepId === "confirm") return confirm();
    goTo(steps[idx + 1]);
  };
  const back = () => (idx === 0 ? reset() : goTo(steps[idx - 1]));
  const confirm = () => {
    setNotice(null);
    if (flow === "walkIn") {
      const m = /(\d+)\s*min/.exec(room.wait);
      return setResult({ title: "You're next in line", line: `${provider.name} is finishing another visit.${m ? ` About ${m[1]} minutes.` : ""}` });
    }
    if (flow === "econsult") return setResult({ title: "Request sent", line: `Asynchronous request sent to ${provider.name}. You'll get a reply within one business day.` });
    setResult({ title: "Booked", line: `${provider.name} in ${room.name} · ${scheduled}.${reminder ? " We texted you a reminder." : ""}` });
  };

  /* Health history editing */
  const setGroup = (key: string, patch: Partial<{ picked: string[]; none: boolean; other: string }>) =>
    setHistory(h => ({
      picked: patch.picked !== undefined ? { ...h.picked, [key]: patch.picked } : h.picked,
      none: patch.none !== undefined ? { ...h.none, [key]: patch.none } : h.none,
      other: patch.other !== undefined ? { ...h.other, [key]: patch.other } : h.other,
    }));

  /* ── Pieces ── */
  const pageIndicator = <StepProgress steps={labels} current={idx} variant={mobile ? "pips" : "bars"} title="See a provider" />;

  const footerNote = (text: ReactNode) => (
    <div className="panel-footer" style={{ justifyContent: "flex-end" }}>
      <span className="text-caption" style={{ textAlign: "right", color: "var(--vsee-text-secondary)" }}>{text}</span>
    </div>
  );

  const primaryLabel = stepId === "confirm" ? "Confirm" : stepId === "history" && !mobile ? "Review" : "Continue";
  const blocked = blocker() !== null;
  const actions = mobile ? (
    <div className="flow-actions flow-actions-mobile">
      <Button className="btn btn-ghost flow-cancel-icon" aria-label="Cancel" onPress={reset}><X size={20} /></Button>
      <div className="flow-actions-group">
        {idx > 0 && <Button className="btn btn-secondary" onPress={back}>Back</Button>}
        <Button className="btn btn-primary" data-blocked={blocked || undefined} onPress={next}>{primaryLabel}</Button>
      </div>
    </div>
  ) : (
    <div className="flow-actions">
      <Button className="btn btn-ghost" onPress={reset}>Cancel</Button>
      <div className="flow-actions-group">
        <Button className="btn btn-secondary" onPress={back}>Back</Button>
        <Button className="btn btn-primary" data-blocked={blocked || undefined} onPress={next}>{primaryLabel}</Button>
      </div>
    </div>
  );

  /* ── Steps ── */
  const roomStep = (
    <div className="panel">
      <div className="panel-header">Pick a room</div>
      <div className="panel-body">
        <ChoiceQuestion label="Which room?" hint={`Choose the kind of care you need at ${CLINIC}.`}
          layout={mobile ? "choice-list" : "choice-grid"} compact={mobile} value={roomId}
          onChange={v => { setRoomId(v); setMode(null); setType(null); setProviderId(null); setDate(null); setSlot(null); }}
          options={ROOMS.map(r => ({ id: r.id, name: r.name, hint: r.hint, meta: r.wait, icon: <RoomIcon id={r.id} size={mobile ? 18 : 20} /> }))} />
      </div>
      {footerNote(`${room.name} selected`)}
    </div>
  );

  const typeSummary = !mode ? "Pick how you'd like to be seen."
    : !flow ? `${room.name} · ${modeLabel} — now pick how to start.`
    : `${room.name} · ${type === "econsult" ? "Message" : modeLabel} · ${flow === "walkIn" ? "Join Queue" : flow === "schedule" ? "Schedule" : "Asynchronous"}`;
  const typeOptions: Choice[] = [
    { id: "walkIn", name: "Join Queue", hint: "Join the queue and be seen next.", ok: room.walkIn, hide: false },
    { id: "schedule", name: "Schedule", hint: "Pick a time that works for you.", ok: room.schedule, hide: false },
    { id: "econsult", name: "Asynchronous", hint: "Send a message and photos instead.", ok: room.econsult, hide: mode === "inperson" },
  ].filter(t => !t.hide).map(t => ({ id: t.id, name: t.name, hint: t.ok ? t.hint : "Not offered in this room.", disabled: !t.ok }));
  const typeStep = (
    <div className="panel">
      <div className="panel-header">Start a visit</div>
      <div className="panel-body">
        <ChoiceQuestion label="How would you like to be seen?" layout={mobile ? "choice-cols-1" : "choice-cols-2"} value={mode}
          onChange={v => { setMode(v as Mode); setType(null); setNotice(null); }}
          options={[
            { id: "video", name: "Online", hint: "Join by video or send a message from your phone or computer." },
            { id: "inperson", name: "In person", hint: `Come to ${CLINIC}.` },
          ]} />
        {mode && !inPersonOnly && (
          <div className="question-section">
            <ChoiceQuestion label="What kind of visit?" layout={mobile ? "choice-cols-1" : "choice-row"} value={type}
              onChange={v => { setType(v as Flow); setNotice(null); }} options={typeOptions} />
          </div>
        )}
      </div>
      {footerNote(typeSummary)}
    </div>
  );

  const providerStep = flow === "schedule" ? (
    <div className="panel">
      <div className="panel-header">Pick a provider and time</div>
      <div className="panel-body">
        <div className="form-group" style={{ maxWidth: 520 }}>
          <Select className="field" selectedKey={providerId ?? "any"} onSelectionChange={k => setProviderId(k === "any" ? null : String(k))}>
            <Label className="form-label">Provider</Label>
            <Button className="input select-trigger">
              <SelectValue />
              <ChevronDown size={16} className="select-chevron" />
            </Button>
            <Popover className="select-popover">
              <ListBox className="select-listbox">
                <ListBoxItem id="any" className="select-option">Any Provider</ListBoxItem>
                {team.map(p => <ListBoxItem key={p.initials} id={p.initials} className="select-option">{`${p.name} · ${p.role}`}</ListBoxItem>)}
              </ListBox>
            </Popover>
          </Select>
        </div>
        <div className="slot-picker-title">Choose the time for the visit</div>
        <SlotPicker stacked={mobile} date={date} slot={slot}
          onDateChange={d => { setDate(d); setSlot(null); setNotice(null); }}
          onSlotChange={t => { setSlot(t); setNotice(null); }} />
      </div>
    </div>
  ) : (
    <div className="panel">
      <div className="panel-header">Pick a provider</div>
      <div className="panel-body">
        <ChoiceQuestion label="Who should get your request?" layout="choice-list" compact value={provider.initials}
          onChange={setProviderId}
          options={team.map(p => ({ id: p.initials, name: p.name, hint: `${p.role} · ${room.wait}`, icon: <span className="avatar avatar-sm">{p.initials}</span> }))} />
      </div>
    </div>
  );

  const reasonStep = (
    <div className="panel">
      <div className="panel-header">Reason for your visit</div>
      <div className="panel-body">
        <ChoiceQuestion label="What brings you in?" hint="Pick the closest match. Your provider will confirm during the visit."
          layout={mobile ? "choice-cols-1" : "choice-cols-2"} small value={reason} onChange={setReason}
          options={VISIT_TYPES.map(v => ({ id: v.id, name: v.label, hint: v.hint }))} />
        <div className="form-group form-section-divided">
          <TextField value={complaint} onChange={setComplaint} className="field">
            <Label className="form-label">Chief Complaint</Label>
            <TextArea className="input textarea" placeholder="Tell your provider what's going on — e.g. sore throat for three days, mild fever last night." />
          </TextField>
          <div className="form-hint">Optional, but it helps them prepare.</div>
        </div>
        <div className="form-section-divided">
          <FileUpload files={files} onChange={setFiles} note="Only your care team at this clinic can see these." />
        </div>
      </div>
    </div>
  );

  const historySummaryView = (
    <>
      {HISTORY_GROUPS.map(g => {
        const parts = [...(history.picked[g.key] || []), ...(history.other[g.key]?.trim() ? [history.other[g.key].trim()] : [])];
        const empty = history.none[g.key] || parts.length === 0;
        return (
          <div key={g.key} className="history-summary-group">
            <div style={{ fontWeight: 600, marginBottom: "var(--vsee-sp-3)" }}>{g.label}</div>
            {empty
              ? <div style={{ color: "var(--vsee-text-secondary)" }}>{g.noneLabel}</div>
              : <div className="tag-list">{parts.map(p => <span key={p} className="chip">{p}</span>)}</div>}
          </div>
        );
      })}
      <div className="history-summary-group">
        <Button className="btn btn-link" style={{ fontSize: "var(--vsee-text-caption-size)", fontWeight: 600 }} onPress={() => setHistSaved(history)}>Update health history</Button>
      </div>
    </>
  );
  const historyEditView = (
    <>
      <div className="panel-body">
        <div className="text-body" style={{ color: "var(--vsee-text-secondary)", marginBottom: "var(--vsee-sp-6)" }}>This carries over to your next visit, so you only fill it in once.</div>
        {HISTORY_GROUPS.map(g => {
          const none = !!history.none[g.key];
          const picked = history.picked[g.key] || [];
          return (
            <div key={g.key} className="history-group" role="group" aria-labelledby={`hg-${layout}-${g.key}`}>
              <div id={`hg-${layout}-${g.key}`} className="question-title">{g.label}</div>
              <div className="question-hint">{g.hint}</div>
              {/* Small Choice Buttons (Buttons → Choice Buttons, .btn-sm) */}
              <RadioGroup aria-labelledby={`hg-${layout}-${g.key}`} value={none ? "none" : "add"} className="history-toggle"
                onChange={v => setGroup(g.key, v === "none" ? { none: true, picked: [], other: "" } : { none: false })}>
                <div className="choice-inline">
                  <Radio value="none" className="btn btn-choice btn-sm">{g.noneLabel}</Radio>
                  <Radio value="add" className="btn btn-choice btn-sm">{g.addLabel}</Radio>
                </div>
              </RadioGroup>
              {!none && (
                <>
                  {/* Design-system Selection List (CheckboxGroup + .option-list) */}
                  <SelectionList label={g.label} hideLabel options={g.options} value={picked}
                    onChange={v => setGroup(g.key, { picked: v })}
                    searchPlaceholder={g.searchPlaceholder} emptyText={`No match. Add it under ${g.otherLabel} below.`} />
                  <TextField className="field" style={{ marginTop: "var(--vsee-sp-4)" }} value={history.other[g.key] || ""} onChange={v => setGroup(g.key, { other: v })}>
                    <Label className="form-label">{g.otherLabel}</Label>
                    <Input className="input" placeholder={g.otherPlaceholder} />
                  </TextField>
                </>
              )}
            </div>
          );
        })}
      </div>
      {hasHistoryRecord && (
        <div className="panel-footer" style={{ justifyContent: "flex-end", flexDirection: mobile ? "column-reverse" : "row" }}>
          {editingHistory && (
            <Button className="btn btn-ghost" style={{ width: mobile ? "100%" : "auto", minHeight: 44 }}
              onPress={() => { setHistory(histSaved!); setHistSaved(null); }}>Discard changes</Button>
          )}
          <Button className="btn btn-secondary" style={{ width: mobile ? "100%" : "auto", minHeight: 44 }}
            onPress={() => { setHistSaved(null); setNotice({ text: "Health history saved.", warn: false }); }}>Save changes</Button>
        </div>
      )}
    </>
  );
  const historyStep = (
    <div className="panel">
      <div className="panel-header">Your health history</div>
      {editingHistory || !hasHistoryRecord ? historyEditView : historySummaryView}
    </div>
  );

  const confirmStep = (
    <div className="panel">
      <div className="panel-header">{flow === "walkIn" ? "Confirm joining the queue" : flow === "econsult" ? "Confirm your asynchronous request" : "Confirm your visit"}</div>
      <div className="panel-body">
        {([
          ["Patient", PATIENT],
          ["Room", room.name],
          ["Reason", (VISIT_TYPES.find(v => v.id === reason) ?? VISIT_TYPES[0]).label],
          flow !== "walkIn" ? ["Provider", providerId ? `${provider.name} · ${provider.role}` : "Any Provider"] : null,
          ["Your state", HOME_STATE],
          ["Health history", historySummary],
          flow === "schedule" ? ["When", scheduled ?? "Pick a day and time"] : null,
          ["Visit type", flow === "econsult" ? "Asynchronous · Message" : `${flow === "walkIn" ? "Join Queue" : "Scheduled"} · ${modeLabel}`],
        ].filter(Boolean) as [string, string][]).map(([k, v]) => (
          <div key={k} className="drawer-field"><span className="drawer-label">{k}</span><span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span></div>
        ))}
        {flow === "schedule" && (
          <>
            <div className="divider" />
            <Checkbox className="check-item" isSelected={reminder} onChange={setReminder}>
              <span className={`check-box${reminder ? " checked" : ""}`}>
                {reminder && <svg className="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
              </span>
              Text me a reminder an hour before
            </Checkbox>
          </>
        )}
      </div>
    </div>
  );

  if (result) {
    return (
      <div className="panel">
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--vsee-sp-3)", padding: "var(--vsee-sp-8) var(--vsee-sp-6)", textAlign: "center" }}>
          <CheckCircle2 size={40} style={{ color: "var(--vsee-brand)" }} />
          <div className="text-h5">{result.title}</div>
          <div className="text-caption" style={{ color: "var(--vsee-text-secondary)", maxWidth: 420 }}>{result.line}</div>
          <Button className="btn btn-ghost btn-sm" onPress={reset}>Start over</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={fill ? { flex: 1, display: "flex", flexDirection: "column" } : undefined}>
      {pageIndicator}
      {{ room: roomStep, type: typeStep, provider: providerStep, reason: reasonStep, history: historyStep, confirm: confirmStep }[stepId]}
      {notice && (
        <div className={`alert ${notice.warn ? "alert-warning" : "alert-success"}`} role={notice.warn ? "alert" : "status"} style={{ marginTop: "var(--vsee-sp-4)" }}>
          {notice.text}
        </div>
      )}
      {fill ? <div style={{ marginTop: "auto" }}>{actions}</div> : actions}
    </div>
  );
}

/* Step progress — shows where the user is in a multi-step flow.
   "bars": one labelled bar per step (desktop). "pips": flow title, "Step X of N"
   and a row of pips (mobile). Steps up to and including the current one are filled. */
function StepProgress({ steps, current, variant = "bars", title }: {
  steps: string[];
  /** 0-based index of the current step */
  current: number;
  variant?: "bars" | "pips";
  /** Flow name, always shown above the bars / pips (with "Step X of N") and used as the accessible name */
  title: string;
}) {
  if (variant === "pips") {
    return (
      <div className="step-pips-wrap">
        <div className="step-pips-head">
          <span className="step-pips-title">{title}</span>
          <span className="step-pips-count">Step {current + 1} of {steps.length}</span>
        </div>
        <div className="step-pips" role="progressbar" aria-label={title} aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={current + 1}
          aria-valuetext={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}>
          {steps.map((s, i) => <span key={s} className="step-pip" data-done={i <= current || undefined} />)}
        </div>
      </div>
    );
  }
  return (
    <>
    <div className="step-pips-head" style={{ justifyContent: "flex-start" }}>{/* pips title row, count right after the title */}
      <span className="step-pips-title">{title}</span>
      <span className="step-pips-count">Step {current + 1} of {steps.length}</span>
    </div>
    <ol className="step-progress" aria-label={title} style={{ listStyle: "none", padding: 0 }}>
      {steps.map((s, i) => (
        <li key={s} className="step-progress-item" aria-current={i === current ? "step" : undefined}>
          <div className="progress-track"><div className="progress-bar progress-bar-brand" style={{ width: i <= current ? "100%" : "0%" }} /></div>
          <span className="step-progress-label">{s}</span>
        </li>
      ))}
    </ol>
    </>
  );
}

/* Step progress demo: both variants, with Back / Next to move through the steps. */
const DEMO_STEPS = ["Room", "Visit type", "Provider and time", "Reason", "Health history", "Confirm"];
function StepProgressDemo() {
  const [step, setStep] = useState(1);
  const nav = (
    <div style={{ display: "flex", gap: "var(--vsee-sp-2)", marginTop: "var(--vsee-sp-4)" }}>
      <Button className="btn btn-secondary btn-sm" isDisabled={step === 0} onPress={() => setStep(s => Math.max(0, s - 1))}>Back</Button>
      <Button className="btn btn-primary btn-sm" isDisabled={step === DEMO_STEPS.length - 1} onPress={() => setStep(s => Math.min(DEMO_STEPS.length - 1, s + 1))}>Next</Button>
    </div>
  );
  return (
    <>
      <div className="text-h5 mb-[var(--vsee-sp-3)]">Bars</div>
      <div className="card">
        <StepProgress steps={DEMO_STEPS} current={step} title="See a provider" />
        {nav}
      </div>
      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Pips</div>
      <div className="card" style={{ maxWidth: 375 }}>
        <StepProgress steps={DEMO_STEPS} current={step} variant="pips" title="See a provider" />
        {nav}
      </div>
    </>
  );
}

/* Calendar + time slots. One example: it switches to the stacked (mobile)
   layout by itself on screens 640px wide or less. The "Schedule at …"
   summary is part of SlotPicker itself. */
function SlotPickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  return (
    <div className="panel" style={{ marginBottom: "var(--vsee-sp-4)" }}>
      <div className="panel-body">
        <SlotPicker date={date} slot={slot} onDateChange={d => { setDate(d); setSlot(null); }} onSlotChange={setSlot}
          onCancel={() => { setDate(null); setSlot(null); }} onConfirm={() => {}} />
      </div>
    </div>
  );
}

/* Demo-only stand-in for a real upload: files added (or retried) here count up
   to 100% and then show as uploaded. A real app sets status/progress itself. */
function useSimulatedUploads(initial: UploadedFile[] = []) {
  const [files, setFiles] = useState<UploadedFile[]>(initial);
  const active = useRef(new Set<string>());
  useEffect(() => {
    const t = setInterval(() => {
      setFiles(fs => {
        let changed = false;
        const next = fs.map(f => {
          if (f.status !== "uploading" || !active.current.has(f.id)) return f;
          changed = true;
          const p = Math.min(100, (f.progress ?? 0) + 8 + Math.random() * 10);
          // Keep the updater pure (React may run it twice): no ref changes here.
          if (p >= 100) return { ...f, status: "uploaded" as const, progress: undefined };
          return { ...f, progress: p };
        });
        return changed ? next : fs;
      });
    }, 250);
    return () => clearInterval(t);
  }, []);
  const onChange = (next: UploadedFile[]) => {
    const known = new Set(files.map(f => f.id));
    setFiles(next.map(f => {
      if (known.has(f.id)) return f;
      active.current.add(f.id);
      return { ...f, status: "uploading" as const, progress: 0 };
    }));
  };
  const retry = (id: string) => {
    active.current.add(id);
    setFiles(fs => fs.map(f => (f.id === id ? { ...f, status: "uploading" as const, progress: 0, error: undefined } : f)));
  };
  return { files, onChange, retry };
}

/* File upload: live default, every upload state + field errors, disabled. */
function FileUploadDemo() {
  const live = useSimulatedUploads();
  const states = useSimulatedUploads([
    { id: "s1", name: "rash-left-forearm.jpg", size: "2.4 MB" },
    { id: "s2", name: "lab-results-march.pdf", size: "1.1 MB", status: "uploading", progress: 60 },
    { id: "s3", name: "insurance-card-back.jpg", size: "3.2 MB", status: "failed" },
    { id: "s4", name: "old-scan.pdf", size: "640 KB", status: "blocked" },
  ]);
  return (
    <>
      <FileUpload label="Default" files={live.files} onChange={live.onChange} onRetry={live.retry} maxFiles={5}
        hint="JPG, PNG, or PDF up to 20 MB each. Up to 5 files."
        note="Only your care team at this clinic can see these." />
      <div style={{ marginTop: "var(--vsee-sp-6)" }} />
      <FileUpload label="Upload States and Errors" files={states.files} onChange={states.onChange} onRetry={states.retry} maxFiles={5}
        hint="JPG, PNG, or PDF up to 20 MB each. Up to 5 files."
        initialErrors={["scan.heic isn't a supported file type.", "You can add up to 5 files. 1 file wasn't added."]}
        note="Only your care team at this clinic can see these." />
      <div style={{ marginTop: "var(--vsee-sp-6)" }} />
      <FileUpload label="Disabled" isDisabled files={[]} onChange={() => {}} />
    </>
  );
}

const SL_CONDITIONS = ["Asthma", "Anxiety", "Depression", "Diabetes (type 1)", "Diabetes (type 2)", "Eczema", "GERD / acid reflux", "Heart disease", "High blood pressure", "High cholesterol", "Migraine", "Sleep apnea", "Thyroid disease"];

function SelectionListDemo() {
  const [conditions, setConditions] = useState<string[]>(["Asthma", "High blood pressure"]);
  return (
    <div className="grid g2" style={{ gap: "var(--vsee-sp-6)", alignItems: "start" }}>
      <div>
        <SelectionList label="Default"
          options={SL_CONDITIONS} value={conditions} onChange={setConditions}
          searchPlaceholder="Search conditions, e.g. diabetes" emptyText="No match. Add it under Other conditions." />
      </div>
      <div>
        <SelectionList label="Disabled" options={["Albuterol inhaler", "Lisinopril", "Metformin"]}
          value={["Lisinopril"]} onChange={() => {}} isDisabled />
      </div>
    </div>
  );
}

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
  /* Tag Input: type text, Enter adds a tag */
  const [allergyTags, setAllergyTags] = useState<RemovableTagItem[]>([{ id: "a1", name: "Penicillin" }, { id: "a2", name: "Peanuts" }]);
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
          {/* MultiSelect — disabled: greyed field, no typing, tags can't be removed, + disabled */}
          <div className="multiselect-wrapper" style={{ marginTop: "var(--vsee-sp-4)" }}>
            <Label className="form-label" id="ms-disabled-label">Filter by Specialty (disabled)</Label>
            <div className="multiselect-container" data-disabled>
              <TagGroup aria-labelledby="ms-disabled-label" disabledKeys={["Cardiology", "Neurology"]} onRemove={() => {}}>
                <TagList className="multiselect-tags">
                  {["Cardiology", "Neurology"].map(s => (
                    <Tag key={s} id={s} className="chip" textValue={s}>
                      {s}
                      <Button slot="remove" className="tag-remove"><X size={12} /></Button>
                    </Tag>
                  ))}
                </TagList>
              </TagGroup>
              {/* Disabled: no input at all (nothing to type, and no empty space when the field wraps) */}
              <Button className="input-icon-btn" isDisabled aria-label="Show options" style={{ marginLeft: "auto" }}><Plus size={16} /></Button>
            </div>
          </div>
          <div className="sub-title" style={{marginTop:"var(--vsee-sp-6)"}}>Tag Input</div>
          <div className="multiselect-wrapper">
            <TagInputField label="Allergies" tags={allergyTags} onChange={setAllergyTags} />
          </div>
          <div className="multiselect-wrapper" style={{ marginTop: "var(--vsee-sp-4)" }}>
            <TagInputField label="Allergies (disabled)" isDisabled tags={[{ id: "p", name: "Penicillin" }, { id: "n", name: "Peanuts" }]} onChange={() => {}} />
          </div>
        </div>
      </div>
      <CodeBlock
        code={`/* Text Input */\n<TextField className="field">\n  <Label className="form-label">Email address</Label>\n  <Input className="input" placeholder="you@example.com" />\n</TextField>\n\n/* Input with error */\n<TextField isInvalid className="field">\n  <Label className="form-label">Full Name <span className="req">*</span></Label>\n  <Input className="input error" />\n  <div className="form-error-text">Full name is required</div>\n</TextField>\n\n/* Select */\n<Select className="field">\n  <Label className="form-label">Specialty</Label>\n  <Button className="input select-trigger">\n    <SelectValue />\n    <ChevronDown size={16} />\n  </Button>\n  <Popover className="select-popover">\n    <ListBox className="select-listbox">\n      <ListBoxItem className="select-option">Option</ListBoxItem>\n    </ListBox>\n  </Popover>\n</Select>\n\n/* MultiSelect */\n<div className="multiselect-wrapper">\n  <Label className="form-label">Filter by Specialty</Label>\n  <div className="multiselect-container">\n    <TagGroup onRemove={handleRemove}>\n      <TagList className="multiselect-tags">\n        <Tag className="chip" textValue="Cardiology">\n          Cardiology\n          <Button slot="remove" className="tag-remove"><X size={12} /></Button>\n        </Tag>\n      </TagList>\n    </TagGroup>\n    <ComboBox menuTrigger="focus" allowsCustomValue>\n      <Input className="multiselect-input" placeholder="Add more..." />\n      <Popover className="dropdown-popover">\n        <ListBox className="dropdown-menu">\n          <ListBoxItem className="dropdown-item">Option</ListBoxItem>\n        </ListBox>\n      </Popover>\n    </ComboBox>\n  </div>\n</div>\n\n/* MultiSelect — disabled: add data-disabled to the container, leave out the ComboBox (no input), disable +, list every tag in disabledKeys */\n<div className="multiselect-container" data-disabled>\n  <TagGroup disabledKeys={["Cardiology"]}>…</TagGroup>\n  <Button className="input-icon-btn" isDisabled style={{ marginLeft: "auto" }}><Plus size={16} /></Button>\n</div>\n\n/* Tag Input — type text, press Enter to add a tag; × removes */\nconst [tags, setTags] = useState([{ id: "a1", name: "Penicillin" }]);\n<TagInputField label="Allergies" tags={tags} onChange={setTags} />\n<TagInputField label="Allergies (disabled)" isDisabled tags={tags} onChange={setTags} />  {/* greyed, no input, no × */}\n\n/* Renders */\n<span id="lbl" className="form-label">Allergies</span>\n<div className="multiselect-container">\n  <TagGroup aria-labelledby="lbl" selectionMode="none" onRemove={handleRemove}>\n    <TagList className="tag-list">\n      <Tag id="a1" className="chip" textValue="Penicillin">Penicillin <Button slot="remove" className="tag-remove" aria-label="Remove Penicillin"><X size={12} /></Button></Tag>\n    </TagList>\n  </TagGroup>\n  <TextField aria-label="Add to Allergies">\n    <Input className="multiselect-input" placeholder="Type and press Enter to add" />   {/* Enter adds the text as a tag */}\n  </TextField>\n</div>`}
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
            <div className="text-h5 mb-[var(--vsee-sp-3)]">Phone Number</div>
            <PhoneInput />
          </div>

          {/* Date Picker */}
          <div className="card">
            <div className="text-h5 mb-[var(--vsee-sp-3)]">Date Picker</div>
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
            <div className="text-h5 mb-[var(--vsee-sp-3)]">Input with Action Icon</div>
            <InputWithIcon />
            <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{marginTop:"var(--vsee-sp-6)"}}>Payment Input</div>
            <div className="form-group">
              <div className="form-label">Payment</div>
              <PaymentInput />
            </div>
          </div>

          {/* Unit & Number Inputs */}
          <div className="card">
            <div className="text-h5 mb-[var(--vsee-sp-3)]">Input with Unit</div>
            <UnitInputs />
          </div>
        </div>
        <CodeBlock
          code={`/* Input with Copy Action */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" readOnly />\n  <Button className="input-icon-btn"><Copy size={16} /></Button>\n</div>\n\n/* Input with External Link */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" />\n  <Button className="input-icon-btn"><ExternalLink size={16} /></Button>\n</div>\n\n/* Payment Input — with callbacks */\n<PaymentInput\n  cardPlaceholder="1234 5678 9012 3456"\n  expiryPlaceholder="MM / YY"\n  cvvPlaceholder="123"\n  onCardChange={(val) => console.log(val)}\n  onExpiryChange={(val) => console.log(val)}\n  onCvvChange={(val) => console.log(val)}\n/>\n\n/* Input with Static Unit */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" placeholder="0" />\n  <span className="input-unit">mg</span>\n</div>\n\n/* Input with Dropdown Unit */\n<div className="input-icon-wrap">\n  <Input className="input input-with-icon-right" placeholder="0" />\n  <Select defaultSelectedKey="kg" className="input-unit-select">\n    <Button className="input-icon-btn input-unit-select-btn">\n      <SelectValue />\n      <ChevronDown size={10} />\n    </Button>\n    <Popover className="select-popover">\n      <ListBox className="select-listbox">\n        <ListBoxItem id="kg" className="select-option">kg</ListBoxItem>\n        <ListBoxItem id="lbs" className="select-option">lbs</ListBoxItem>\n      </ListBox>\n    </Popover>\n  </Select>\n</div>\n\n/* Number Stepper */\n<NumberField defaultValue={5} minValue={0} maxValue={10} className="field">\n  <Label className="form-label">Quantity</Label>\n  <Group className="input-icon-wrap">\n    <Input className="input input-with-icon-right stepper-input" />\n    <div className="input-icon-btn stepper-btns">\n      <Button slot="decrement" className="stepper-half">&minus;</Button>\n      <div className="stepper-divider" />\n      <Button slot="increment" className="stepper-half">+</Button>\n    </div>\n  </Group>\n</NumberField>`}
        />

        <div className="grid g2" style={{gap:"var(--vsee-sp-6)",marginTop:"var(--vsee-sp-6)"}}>
          {/* Login */}
          <div className="card">
            <div className="text-h5 mb-[var(--vsee-sp-3)]">Login Form</div>
            <Login />
          </div>

          {/* Inline Inputs */}
          <div className="card">
            <div className="text-h5 mb-[var(--vsee-sp-3)]">Inline Inputs</div>
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

      {/* The step-by-step flow lives on its own page now: Steppers (#steppers, under Pages in the side menu) */}
    </Section>
  );
}

/* ═══════════════════════════════════════════
   STEPPERS — standalone page (hash route #steppers)
   The working "See a provider" flow on its own page. Desktop layout by default,
   mobile layout on screens 640px wide or less.
   ═══════════════════════════════════════════ */
function SteppersPage({ onExit, brandTheme, setBrandTheme, darkMode, setDarkMode }: {
  onExit: () => void;
  brandTheme: string; setBrandTheme: (t: string) => void;
  darkMode: boolean; setDarkMode: (d: boolean) => void;
}) {
  const narrow = useMediaQuery("(max-width: 640px)");
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  /* Inside the Mobile view frame: just the flow, as a phone shows it */
  if (IS_FRAME) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--vsee-white)", padding: "var(--vsee-sp-4)", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <OneQuestionFlow layout={narrow ? "mobile" : "desktop"} fill />
      </div>
    );
  }
  return (
    <div style={{ minHeight: "100vh", background: "var(--vsee-white)" }}>
      {/* Top bar — same layout as the login prototype's toolbar: page name left, Brand + Mode right */}
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--vsee-sp-3)", padding: "var(--vsee-sp-3) var(--vsee-sp-6)", background: "var(--vsee-white)", borderBottom: "1px solid var(--vsee-border)", fontSize: "var(--vsee-text-caption-size)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--vsee-sp-4)" }}>
          <Button className="btn btn-link" onPress={onExit} aria-label="Back to docs"><ChevronLeft size={16} aria-hidden="true" /></Button>
          {/* Page dropdown in place of the page title — jump to another of the Pages (side-menu list, minus Kitchen Sink) */}
          <Select selectedKey="Steppers" onSelectionChange={k => { const p = PAGES_GROUP.items.find(i => i.label === k); if (p && k !== "Steppers") window.location.href = p.href; }}
            style={{ display: "flex", alignItems: "center", gap: "var(--vsee-sp-2)" }}>
            <Label className="sr-only">Page</Label>
            <Button className="input input-sm select-trigger" style={{ width: 160 }}>
              <SelectValue />
              <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
            </Button>
            <Popover className="select-popover">
              <ListBox className="select-listbox">
                {PAGES_GROUP.items.filter(p => p.label !== "Kitchen Sink").map(p => <ListBoxItem key={p.label} id={p.label} className="select-option">{p.label}</ListBoxItem>)}
              </ListBox>
            </Popover>
          </Select>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--vsee-sp-2) var(--vsee-sp-4)" }}>
          {/* Brand — Color Swatches component */}
          <ColorSwatches ariaLabel="Brand" options={BRAND_SWATCHES} value={brandTheme || "green"}
            onChange={id => setBrandTheme(id === "green" ? "" : id)} />
          <span style={{ display: "flex", alignItems: "center", gap: "var(--vsee-sp-2)", color: "var(--vsee-text-secondary)" }}>
            <SwitchButton ariaLabel="Mode" iconOnly labels={["Light", "Dark"]} icons={{ Light: <Sun size={16} aria-hidden="true" />, Dark: <Moon size={16} aria-hidden="true" /> }} value={darkMode ? "Dark" : "Light"} onChange={l => setDarkMode(l === "Dark")} />
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "var(--vsee-sp-2)", color: "var(--vsee-text-secondary)" }}>
            <SwitchButton ariaLabel="View" labels={["Desktop", "Mobile"]} icons={{ Desktop: <Monitor size={16} aria-hidden="true" />, Mobile: <Smartphone size={16} aria-hidden="true" /> }} value={view === "mobile" ? "Mobile" : "Desktop"} onChange={l => setView(l === "Mobile" ? "mobile" : "desktop")} />
          </span>
        </div>
      </header>
      {view === "mobile" ? (
        <DeviceFrame src={`${window.location.pathname}?frame${STEPPERS_HASH}`} theme={brandTheme} dark={darkMode} />
      ) : (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: narrow ? "var(--vsee-sp-4)" : "var(--vsee-sp-8)" }}>
        <p className="text-body" style={{ color: "var(--vsee-text-secondary)", margin: "0 0 var(--vsee-sp-6)" }}>
          The Patient Portal “See a provider” flow: one step per page, with a page indicator so patients always know where they are. Desktop shows a labelled bar for each step; mobile (screens 640px or narrower) shows the flow name, “Step X of N”, and a row of pips, with full-width 48px buttons. Join Queue skips the provider step (5 steps instead of 6). When a step isn't answered yet, Continue is dimmed and pressing it explains what's missing.
        </p>
        <div className="card" style={{ marginBottom: "var(--vsee-sp-6)" }}>
          <OneQuestionFlow layout={narrow ? "mobile" : "desktop"} />
        </div>
        <CodeBlock
          code={`{/* Page indicator — desktop: one labelled bar per step */}\n<ol className="step-progress">\n  <li className="step-progress-item" aria-current="step">\n    <div className="progress-track"><div className="progress-bar progress-bar-brand" style={{width:"100%"}} /></div>\n    <span className="step-progress-label">Room</span>\n  </li>\n  {/* …one <li> per step; width 0% for steps not reached */}\n</ol>\n\n{/* Page indicator — mobile */}\n<div className="step-pips-wrap">\n  <div className="step-pips-head">\n    <span className="step-pips-title">See a provider</span>\n    <span className="step-pips-count">Step 1 of 6</span>\n  </div>\n  <div className="step-pips" role="progressbar" aria-valuenow={1} aria-valuemax={6}>\n    <span className="step-pip" data-done />\n    <span className="step-pip" />  {/* …one per step */}\n  </div>\n</div>\n\n{/* The one question */}\n<div className="panel">\n  <div className="panel-header">Pick a room</div>\n  <div className="panel-body">\n    <RadioGroup value={room} onChange={setRoom}>\n      <Label className="question-title">Which room?</Label>\n      <div className="question-hint">Choose the kind of care you need.</div>\n      <div className="choice-grid">  {/* mobile: .choice-list + .choice-card-compact */}\n        <Radio value="urgent" className="choice-card">\n          <span className="choice-card-icon"><Activity size={20} /></span>\n          <span className="choice-card-title">Urgent Care</span>\n          <span className="choice-card-hint">Something new that can't wait.</span>\n          <span className="choice-card-meta">4 min wait</span>\n        </Radio>\n      </div>\n    </RadioGroup>\n  </div>\n  <div className="panel-footer">Urgent Care selected</div>\n</div>\n\n{/* Actions — desktop */}\n<div className="flow-actions">\n  <Button className="btn btn-ghost">Cancel</Button>\n  <div className="flow-actions-group">\n    <Button className="btn btn-secondary">Back</Button>\n    <Button className="btn btn-primary">Continue</Button>\n  </div>\n</div>\n\n{/* Actions — mobile (icon Cancel, stretched buttons) */}\n<div className="flow-actions flow-actions-mobile">\n  <Button className="btn btn-ghost flow-cancel-icon" aria-label="Cancel"><X size={20} /></Button>\n  <div className="flow-actions-group">\n    <Button className="btn btn-secondary">Back</Button>\n    <Button className="btn btn-primary">Continue</Button>\n  </div>\n</div>`}
        />
      </div>
      )}
    </div>
  );
}

/* Pages "Mobile" view: the page itself on a 390 × 844 phone screen (zoomed out to fit), so its
   real phone layout (media queries) shows. Brand + light/dark are passed in.
   public/page-toolbar.js builds the same frame for the HTML pages. */
function DeviceFrame({ src, theme, dark }: { src: string; theme: string; dark: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const send = useCallback(() => {
    ref.current?.contentWindow?.postMessage({ type: "vsee-preview", theme: theme || "green", mode: dark ? "dark" : "light" }, window.location.origin);
  }, [theme, dark]);
  useEffect(() => { send(); }, [send]);
  /* Phone screen = 390 × 844 (iPhone 14/15). The page inside always renders at that real size;
     the whole phone is zoomed out (scaled) to fit the window, never zoomed in. */
  const PHONE_W = 390, PHONE_H = 844, BEZEL_PAD = 12;
  const OUTER_W = PHONE_W + BEZEL_PAD * 2, OUTER_H = PHONE_H + BEZEL_PAD * 2;
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => {
      const box = boxRef.current;
      if (!box?.parentElement) return;
      const availH = window.innerHeight - box.getBoundingClientRect().top - 24;   /* 24 = bottom padding */
      const availW = box.parentElement.clientWidth - 48;                          /* 48 = side padding */
      setScale(Math.max(0.3, Math.min(1, availH / OUTER_H, availW / OUTER_W)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [OUTER_H, OUTER_W]);
  /* Phone look: dark bezel (fixed near-black — device hardware, stays dark in dark mode too),
     rounded screen, status bar with the camera pill; the page starts below the status bar. */
  const BEZEL = "#0B0B0F";
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "var(--vsee-sp-6)" }}>
      <div ref={boxRef} style={{ width: OUTER_W * scale, height: OUTER_H * scale }}>{/* reserves the zoomed-out size */}
      <div style={{ width: OUTER_W, height: OUTER_H, padding: BEZEL_PAD, boxSizing: "border-box", borderRadius: 48, background: BEZEL, boxShadow: "var(--vsee-shadow-lg)", transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <div style={{ width: PHONE_W, height: PHONE_H, borderRadius: 36, overflow: "hidden", background: "var(--vsee-white)", display: "flex", flexDirection: "column" }}>
          <div aria-hidden="true" style={{ position: "relative", flexShrink: 0, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", fontSize: 15, fontWeight: 600, color: "var(--vsee-text-primary)" }}>
            <span>9:41</span>
            <span style={{ position: "absolute", left: "50%", top: 10, transform: "translateX(-50%)", width: 96, height: 26, borderRadius: 13, background: BEZEL }} />
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
              <svg width="16" height="12" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M2 6.5a15 15 0 0 1 20 0" /><path d="M6 10.5a9 9 0 0 1 12 0" /><path d="M10 14.5a3 3 0 0 1 4 0" /></svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" /><rect x="22.5" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4" /></svg>
            </span>
          </div>
          <iframe ref={ref} src={src} title="Mobile view (390 × 844)" onLoad={send}
            style={{ flex: 1, width: "100%", border: 0, display: "block", background: "var(--vsee-white)" }} />
        </div>
      </div>
      </div>
    </div>
  );
}

/* Tag Input — removable tags in a field you can type into (same field look as MultiSelect: .multiselect-container + .multiselect-input).
   React Aria TagGroup for the tags (× removes; arrow keys move between them) + a TextField: type a name, press Enter to add.
   isDisabled: the whole field is greyed, with no input — tags can't be removed or added. */
type RemovableTagItem = { id: string; name: string };
function TagInputField({ label, tags, onChange, disabledKeys, isDisabled = false, placeholder = "Type and press Enter to add" }: {
  label: string;
  tags: RemovableTagItem[];
  onChange: (tags: RemovableTagItem[]) => void;
  /** Tags that can't be removed (shown greyed, no ×) */
  disabledKeys?: string[];
  /** Disable the whole field: greyed, no typing, no × on the tags */
  isDisabled?: boolean;
  placeholder?: string;
}) {
  const labelId = useId();
  const [text, setText] = useState("");
  const add = () => {
    const name = text.trim();
    if (name && !tags.some(t => t.name.toLowerCase() === name.toLowerCase())) onChange([...tags, { id: `${name}-${Date.now()}`, name }]);
    setText("");
  };
  return (
    <div>
      <span id={labelId} className="form-label">{label}</span>
      <div className="multiselect-container" data-disabled={isDisabled || undefined}>
        <TagGroup aria-labelledby={labelId} selectionMode="none" disabledKeys={isDisabled ? tags.map(t => t.id) : disabledKeys}
          onRemove={keys => onChange(tags.filter(t => !keys.has(t.id)))}>
          <TagList className="tag-list">
            {tags.map(t => (
              <Tag key={t.id} id={t.id} className="chip" textValue={t.name}>
                {t.name}
                <Button slot="remove" className="tag-remove" aria-label={`Remove ${t.name}`}><X size={12} aria-hidden="true" /></Button>
              </Tag>
            ))}
          </TagList>
        </TagGroup>
        {/* Disabled: no input at all (nothing to type, and no empty space when the field wraps) */}
        {!isDisabled && (
          <TextField aria-label={`Add to ${label}`} value={text} onChange={setText} style={{ flex: 1, minWidth: 160, display: "flex" }}>
            <Input className="multiselect-input" placeholder={placeholder}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
          </TextField>
        )}
      </div>
    </div>
  );
}

/* Selection Buttons — pick several from a set (e.g. categories), from the Figma selection components (67:1181 / 252:243) and ASPR "SelectionButton".
   Built on React Aria's multi-select group (selectionMode="multiple"): click / Space toggles, arrow keys move, each one is read as selected or not.
   Selected ones show a check. Optional count. */
type SelectionButtonItem = { id: string; label: string; count?: number };
function SelectionButtons({ items, selectedKeys, onSelectionChange, ariaLabel, shape = "rect", variant = "solid", showCheck = true }: {
  items: SelectionButtonItem[];
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  /** Accessible name of the group, e.g. "Specialties" */
  ariaLabel: string;
  /** "rect": 4px corners (default) · "round": pill */
  shape?: "rect" | "round";
  /** "solid": grey → filled blue (default) · "soft": grey → light blue with a blue border */
  variant?: "solid" | "soft";
  /** Show the check icon on selected ones (default true). false: the colour alone shows what is selected */
  showCheck?: boolean;
}) {
  const cls = `sel-btn${shape === "round" ? " sel-btn-round" : ""}${variant === "soft" ? " sel-btn-soft" : ""}`;
  return (
    <TagGroup aria-label={ariaLabel} selectionMode="multiple" selectedKeys={selectedKeys}
      onSelectionChange={keys => onSelectionChange(new Set(keys === "all" ? items.map(i => i.id) : [...keys].map(String)))}>
      <TagList className="sel-btn-group">
        {items.map(item => (
          <Tag key={item.id} id={item.id} className={cls} textValue={item.label}>
            {({ isSelected }) => (
              <>
                <span className="sel-btn-label">
                  {isSelected && showCheck && <Check size={14} aria-hidden="true" />}
                  {item.label}
                </span>
                {item.count !== undefined && <span className="sel-btn-count">{item.count}</span>}
              </>
            )}
          </Tag>
        ))}
      </TagList>
    </TagGroup>
  );
}

const SEL_BTN_CATEGORIES: SelectionButtonItem[] = ["Cardiac", "GI", "Vascular Access", "Orthopedic", "Wound care", "HEENT", "GU / OB", "Environmental", "Other"].map(l => ({ id: l, label: l }));
/* Rectangle demo: same categories, one with a count */
const SEL_BTN_CATEGORIES_COUNT: SelectionButtonItem[] = SEL_BTN_CATEGORIES.map(i => i.id === "Cardiac" ? { ...i, count: 3 } : i);
/* Round demo: same categories, one with a count */
const SEL_BTN_CATEGORIES_ROUND: SelectionButtonItem[] = SEL_BTN_CATEGORIES.map(i => i.id === "GI" ? { ...i, count: 4 } : i);
/* No-check demo */
const SEL_BTN_TIMES: SelectionButtonItem[] = ["Morning", "Afternoon", "Evening"].map(l => ({ id: l, label: l }));
const SEL_BTN_DAYS: SelectionButtonItem[] = ["Mon", "Tue", "Wed", "Thu", "Fri"].map(l => ({ id: l, label: l }));
function SelectionButtonsDemo() {
  const [rect, setRect] = useState(new Set(["Cardiac", "GI", "Vascular Access", "Orthopedic", "HEENT"]));
  const [round, setRound] = useState(new Set(["Cardiac", "GI"]));
  const [times, setTimes] = useState(new Set(["Morning"]));
  const [days, setDays] = useState(new Set(["Tue", "Thu"]));
  return (
    <>
      <div className="text-h5 mb-[var(--vsee-sp-3)]">Rectangle</div>
      <div className="preview">
        <SelectionButtons ariaLabel="Categories" items={SEL_BTN_CATEGORIES_COUNT} selectedKeys={rect} onSelectionChange={setRect} />
      </div>
      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Round, soft selected</div>
      <div className="preview">
        <SelectionButtons ariaLabel="Categories" shape="round" variant="soft" items={SEL_BTN_CATEGORIES_ROUND} selectedKeys={round} onSelectionChange={setRound} />
      </div>
      <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>Selected without check icon</div>
      {/* Two separate groups in one row: light + rectangle, and default colour + round */}
      <div className="preview" style={{ gap: "var(--vsee-sp-8)" }}>
        <SelectionButtons ariaLabel="Preferred time" variant="soft" showCheck={false} items={SEL_BTN_TIMES} selectedKeys={times} onSelectionChange={setTimes} />
        <SelectionButtons ariaLabel="Days" shape="round" showCheck={false} items={SEL_BTN_DAYS} selectedKeys={days} onSelectionChange={setDays} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS — BADGES, TAGS & STATUS
   ═══════════════════════════════════════════ */
function ComponentsBadges() {
  /* Removable Tags — White example */
  const WHITE_TAGS_START = [
    { id: "w1", name: "Lab results" },
    { id: "w2", name: "Cardiology" },
    { id: "w3", name: "Follow-up" },
    { id: "w4", name: "Prescriptions" },
  ];
  const [whiteTags, setWhiteTags] = useState<RemovableTagItem[]>(WHITE_TAGS_START);
  /* White field works like MultiSelect: type to filter, pick from the list to add */
  const WHITE_OPTIONS = ["Lab results", "Cardiology", "Follow-up", "Prescriptions", "Imaging", "Referrals", "Vaccinations", "Visit notes"];
  const [whiteQuery, setWhiteQuery] = useState("");
  const whiteInputRef = useRef<HTMLInputElement>(null);
  const whiteLabelId = useId();
  const whiteOptions = WHITE_OPTIONS.filter(o => !whiteTags.some(t => t.name === o) && o.toLowerCase().includes(whiteQuery.toLowerCase()));
  /* Removable Tags — standalone: the same tags in a plain row (.tag-list), not in an input field */
  const OUTSIDE_TAGS_START = [
    { id: "o1", name: "Hypertension", white: false, iconLeft: <Heart size={14} aria-hidden="true" /> },
    { id: "o2", name: "Asthma", white: false, removable: false },   /* no × */
    { id: "o3", name: "Lab results", white: true, iconRight: <FileText size={14} aria-hidden="true" />, removable: false },   /* no × */
    { id: "o4", name: "Cardiology", white: true },
    { id: "o5", name: "Seasonal allergies", white: false },
    { id: "o6", name: "Iron deficiency", white: false, iconRight: <AlertTriangle size={14} aria-hidden="true" /> },
    { id: "o7", name: "Childhood asthma", white: false, iconLeft: <Calendar size={14} aria-hidden="true" />, iconRight: <AlertTriangle size={14} aria-hidden="true" /> },
  ];
  const [outsideTags, setOutsideTags] = useState<{ id: string; name: string; white: boolean; iconLeft?: ReactNode; iconRight?: ReactNode; removable?: boolean }[]>(OUTSIDE_TAGS_START);
  const [pastTags, setPastTags] = useState<RemovableTagItem[]>([
    { id: "d1", name: "Seasonal allergies" },
    { id: "d2", name: "Iron deficiency" },
  ]);
  const [tags, setTags] = useState<RemovableTagItem[]>([
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

      <SubSection title="Outline Tags" description="Small status labels: a 1px border and bold text in the same colour. For showing a state, not for clicking.">
        <div className="preview">
          <span className="tag-outline tag-outline-success">Active</span>
          <span className="tag-outline tag-outline-danger">Overdue</span>
          <span className="tag-outline tag-outline-neutral">Inactive</span>
          <span className="tag-outline tag-outline-info">Scheduled</span>
          <span className="tag-outline tag-outline-warning">Pending</span>
        </div>
        <CodeBlock
          code={`<span className="tag-outline tag-outline-success">Active</span>   {/* --vsee-success */}
<span className="tag-outline tag-outline-danger">Overdue</span>   {/* --vsee-danger */}
<span className="tag-outline tag-outline-neutral">Inactive</span> {/* text --vsee-text-secondary, border --vsee-grey-700 */}
<span className="tag-outline tag-outline-info">Scheduled</span>   {/* --vsee-info */}
<span className="tag-outline tag-outline-warning">Pending</span>  {/* --vsee-warning-dark */}`}
        />
      </SubSection>

      <SubSection title="Removable Tags" description="Tags with × to remove. In a field (type a name and press Enter to add) or standalone in a plain row.">
        <TagInputField label="Active Diagnoses" tags={tags} onChange={setTags} />
        {/* Disabled tags: greyed, no × (can't be removed); you can still add new ones */}
        <div style={{ marginTop: "var(--vsee-sp-6)" }}>
          <TagInputField label="Past Diagnoses" tags={pastTags} onChange={setPastTags} disabledKeys={["d1", "d2"]} />
        </div>
        {/* White: white tags in a MultiSelect field — type to filter, pick from the list to add; × removes */}
        <div style={{ marginTop: "var(--vsee-sp-6)" }}>
          <span id={whiteLabelId} className="form-label">White</span>
          <div className="multiselect-container">
            <TagGroup aria-labelledby={whiteLabelId} selectionMode="none" onRemove={keys => setWhiteTags(prev => prev.filter(t => !keys.has(t.id)))}>
              <TagList className="tag-list">
                {whiteTags.map(t => (
                  <Tag key={t.id} id={t.id} className="chip chip-white" textValue={t.name}>
                    {t.name}
                    <Button slot="remove" className="tag-remove" aria-label={`Remove ${t.name}`}><X size={14} aria-hidden="true" /></Button>
                  </Tag>
                ))}
              </TagList>
            </TagGroup>
            <ComboBox aria-label="Add to White" inputValue={whiteQuery} onInputChange={setWhiteQuery} selectedKey={null}
              onSelectionChange={key => {
                if (key && key !== "__empty" && !whiteTags.some(t => t.name === String(key))) setWhiteTags(prev => [...prev, { id: String(key), name: String(key) }]);
                setWhiteQuery("");
              }}
              menuTrigger="focus" allowsCustomValue>
              <Input ref={whiteInputRef} className="multiselect-input" placeholder={whiteTags.length ? "Add more..." : "Search..."} />
              <Popover className="dropdown-popover">
                <ListBox className="dropdown-menu">
                  {whiteOptions.map(o => <ListBoxItem key={o} id={o} className="dropdown-item">{o}</ListBoxItem>)}
                  {whiteOptions.length === 0 && (
                    <ListBoxItem id="__empty" className="dropdown-item" style={{ color: "var(--vsee-text-secondary)", fontStyle: "italic" }}>No matches found</ListBoxItem>
                  )}
                </ListBox>
              </Popover>
            </ComboBox>
            <Button className="input-icon-btn" aria-label="Show options" onPress={() => whiteInputRef.current?.focus()}><Plus size={16} /></Button>
          </div>
        </div>
        {whiteTags.length < WHITE_TAGS_START.length && <Button className="btn btn-link" style={{ marginTop: "var(--vsee-sp-2)" }} onPress={() => setWhiteTags(WHITE_TAGS_START)}>Reset white tags</Button>}
        {/* Standalone: same tags in a plain row (.tag-list), not in a field */}
        <TagGroup selectionMode="none" disabledKeys={["o5", "o6", "o7"]} onRemove={keys => setOutsideTags(prev => prev.filter(t => t.removable === false || !keys.has(t.id)))} style={{ marginTop: "var(--vsee-sp-6)" }}>
          <Label className="form-label">Standalone</Label>
          <TagList className="tag-list">
            {outsideTags.map(t => (
              <Tag key={t.id} id={t.id} className={t.white ? "chip chip-white" : "chip"} textValue={t.name}>
                {t.iconLeft}{t.name}{t.iconRight}
                {t.removable !== false && <Button slot="remove" className="tag-remove" aria-label={`Remove ${t.name}`}><X size={t.white ? 14 : 12} aria-hidden="true" /></Button>}
              </Tag>
            ))}
          </TagList>
        </TagGroup>
        {outsideTags.length < OUTSIDE_TAGS_START.length && <Button className="btn btn-link" style={{ marginTop: "var(--vsee-sp-2)" }} onPress={() => setOutsideTags(OUTSIDE_TAGS_START)}>Reset</Button>}
        <CodeBlock
          code={`/* In a field you can type into — same field look as MultiSelect */\nconst [tags, setTags] = useState([{ id: "1", name: "Hypertension" }]);\n\n<TagInputField label="Active Diagnoses" tags={tags} onChange={setTags} />\n<TagInputField label="Past Diagnoses" tags={past} onChange={setPast} disabledKeys={["d1"]} />  {/* disabled: greyed, no × */}\n\n/* White: white tags (.chip-white) in a MultiSelect field — type to filter, pick from the list to add */\n<span id="white" className="form-label">White</span>\n<div className="multiselect-container">\n  <TagGroup aria-labelledby="white" selectionMode="none" onRemove={handleRemove}>\n    <TagList className="tag-list">\n      <Tag id="w1" className="chip chip-white" textValue="Lab results">\n        Lab results\n        <Button slot="remove" className="tag-remove" aria-label="Remove Lab results"><X size={14} /></Button>\n      </Tag>\n    </TagList>\n  </TagGroup>\n  <ComboBox aria-label="Add to White" menuTrigger="focus" allowsCustomValue onSelectionChange={addTag}>\n    <Input className="multiselect-input" placeholder="Add more..." />\n    <Popover className="dropdown-popover">\n      <ListBox className="dropdown-menu">\n        <ListBoxItem id="Imaging" className="dropdown-item">Imaging</ListBoxItem>\n      </ListBox>\n    </Popover>\n  </ComboBox>\n  <Button className="input-icon-btn" aria-label="Show options"><Plus size={16} /></Button>\n</div>\n\n/* Renders */\n<span id="lbl" className="form-label">Active Diagnoses</span>\n<div className="multiselect-container">                 {/* bordered field, focus ring */}\n  <TagGroup aria-labelledby="lbl" selectionMode="none" onRemove={handleRemove}>\n    <TagList className="tag-list">\n      <Tag id="1" className="chip" textValue="Hypertension">     {/* + chip-white */}\n        Hypertension\n        <Button slot="remove" className="tag-remove" aria-label="Remove Hypertension"><X size={12} /></Button>\n      </Tag>\n    </TagList>\n  </TagGroup>\n  <TextField aria-label="Add to Active Diagnoses">               {/* type, Enter adds a tag */}\n    <Input className="multiselect-input" placeholder="Type and press Enter to add" />\n  </TextField>\n</div>\n\n/* Standalone: same tags in a plain row (.tag-list), not in a field */\n<TagGroup selectionMode="none" onRemove={handleRemove}>\n  <Label className="form-label">Standalone</Label>\n  <TagList className="tag-list">\n    <Tag id="1" className="chip" textValue="Hypertension">Hypertension <Button slot="remove" className="tag-remove"><X size={12} /></Button></Tag>\n    <Tag id="2" className="chip chip-white" textValue="Lab results">Lab results <Button slot="remove" className="tag-remove"><X size={14} /></Button></Tag>\n  </TagList>\n</TagGroup>`}
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
  const sidebarCounts: Record<string, number> = { Activity: 5 };   /* optional count per sidebar tab */
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
              <Tab id="patients" className="tab-item">Patients<span className="tab-count">12</span></Tab>
              <Tab id="visits" className="tab-item">All Visits</Tab>
              <Tab id="docs" className="tab-item">Documents<span className="tab-count">3</span></Tab>
              <Tab id="labs" className="tab-item">Lab Results<span className="tab-count">99+</span></Tab>
            </TabList>
            <TabPanel id="patients" className="tab-content">Tab content area</TabPanel>
            <TabPanel id="visits" className="tab-content">All visits content</TabPanel>
            <TabPanel id="docs" className="tab-content">Documents content</TabPanel>
            <TabPanel id="labs" className="tab-content">Lab results content</TabPanel>
          </Tabs>
        </div>
        <CodeBlock
          code={`<Tabs>\n  <TabList className="tabs" aria-label="Clinic tabs">\n    <Tab id="patients" className="tab-item">Patients<span className="tab-count">12</span></Tab>  {/* optional count */}\n    <Tab id="visits" className="tab-item">All Visits</Tab>\n    <Tab id="docs" className="tab-item">Documents<span className="tab-count">3</span></Tab>\n    <Tab id="labs" className="tab-item">Lab Results<span className="tab-count">99+</span></Tab>\n  </TabList>\n  <TabPanel id="patients" className="tab-content">Content</TabPanel>\n  <TabPanel id="visits" className="tab-content">Content</TabPanel>\n  <TabPanel id="docs" className="tab-content">Content</TabPanel>\n  <TabPanel id="labs" className="tab-content">Content</TabPanel>\n</Tabs>`}
        />
      </SubSection>

      <SubSection title="Sidebar">
        <div className="sidebar-layout">
          <div className="sidebar-panel">
            <div className="sidebar-heading">Menu</div>
            {Object.keys(sidebarItems).map((item) => (
              <div key={item} className={`sidebar-menu-item ${activeSidebarItem === item ? "active" : ""}`} onClick={() => setActiveSidebarItem(item)}>
                {item}
                {sidebarCounts[item] > 0 && <span className="tab-count">{sidebarCounts[item]}</span>}
              </div>
            ))}
          </div>
          <div className="sidebar-content">
            <div style={{fontSize:20,fontWeight:700,marginBottom:"var(--vsee-sp-4)"}}>{activeSidebarItem}</div>
            <p style={{color:"var(--vsee-text-secondary)"}}>{sidebarItems[activeSidebarItem]}</p>
          </div>
        </div>
        <CodeBlock
          code={`const items = {\n  Overview: "High-level summary…",\n  Details: "Demographics, contact info…",\n  Activity: "Chronological log of visits…",\n};\nconst counts = { Activity: 5 };\nconst [active, setActive] = useState("Overview");\n\n<div className="sidebar-layout">\n  <div className="sidebar-panel">\n    <div className="sidebar-heading">Menu</div>\n    {Object.keys(items).map((item) => (\n      <div\n        key={item}\n        className={\`sidebar-menu-item \${active === item ? "active" : ""}\`}\n        onClick={() => setActive(item)}\n      >\n        {item}\n        {counts[item] > 0 && <span className="tab-count">{counts[item]}</span>}  {/* optional count, right end */}\n      </div>\n    ))}\n  </div>\n  <div className="sidebar-content">\n    <div style={{fontSize:20,fontWeight:700}}>{active}</div>\n    <p>{items[active]}</p>\n  </div>\n</div>`}
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
        <div className="text-h5 mb-[var(--vsee-sp-3)]">Default</div>
        <div className="card">
          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <div className="pagination-nav">
              <button className="page-btn disabled" aria-label="Previous page"><ChevronLeft size={16} /></button>
              <span className="pagination-divider" aria-hidden="true" />
              <button className="page-btn" aria-label="Next page"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        <div className="text-h5 mb-[var(--vsee-sp-3)]" style={{ marginTop: "var(--vsee-sp-6)" }}>With Labels</div>
        <div className="card">
          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <div className="pagination-nav">
              <button className="page-btn page-btn-label disabled"><ChevronLeft size={16} aria-hidden="true" />Prev</button>
              <span className="pagination-divider" aria-hidden="true" />
              <button className="page-btn page-btn-label">Next<ChevronRight size={16} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
        <CodeBlock
          code={`<div className="pagination">\n  <button className="page-btn active">1</button>\n  <button className="page-btn">2</button>\n  <button className="page-btn">3</button>\n  <button className="page-btn">4</button>\n  <div className="pagination-nav">                  {/* prev + next grouped on the right */}\n    <button className="page-btn disabled" aria-label="Previous page"><ChevronLeft size={16} /></button>\n    <span className="pagination-divider" aria-hidden="true" />   {/* thin line between them */}\n    <button className="page-btn" aria-label="Next page"><ChevronRight size={16} /></button>\n  </div>\n</div>\n\n{/* With labels: add .page-btn-label (4px icon gap, 8px side padding) */}\n<div className="pagination-nav">\n  <button className="page-btn page-btn-label disabled"><ChevronLeft size={16} />Prev</button>\n  <span className="pagination-divider" aria-hidden="true" />\n  <button className="page-btn page-btn-label">Next<ChevronRight size={16} /></button>\n</div>`}
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

      <SubSection title="Step Progress" description="Shows where the user is in a multi-step flow, such as the Steppers page. Bars: one labelled bar per step, for desktop. Pips: the flow name, “Step X of N” and a row of pips, for mobile. Steps up to and including the current one are filled.">
        <StepProgressDemo />
        <CodeBlock
          code={`<StepProgress\n  steps={["Room", "Visit type", "Provider and time", "Reason", "Health history", "Confirm"]}\n  current={1}                 {/* 0-based */}\n  variant="bars"              {/* "bars" (desktop) | "pips" (mobile) */}\n  title="See a provider"      {/* required: shown above the bars / pips; accessible name */}\n/>\n\n/* Renders — bars */\n<div className="step-pips-head" style={{ justifyContent: "flex-start" }}>   {/* count right after the title */}\n  <span className="step-pips-title">See a provider</span>\n  <span className="step-pips-count">Step 2 of 6</span>\n</div>\n<ol className="step-progress" aria-label="See a provider">\n  <li className="step-progress-item">\n    <div className="progress-track"><div className="progress-bar progress-bar-brand" style={{ width: "100%" }} /></div>\n    <span className="step-progress-label">Room</span>\n  </li>\n  <li className="step-progress-item" aria-current="step">…Visit type…</li>\n  {/* later steps: width 0% */}\n</ol>\n\n/* Renders — pips */\n<div className="step-pips-wrap">\n  <div className="step-pips-head">\n    <span className="step-pips-title">See a provider</span>\n    <span className="step-pips-count">Step 2 of 6</span>\n  </div>\n  <div className="step-pips" role="progressbar" aria-valuenow={2} aria-valuemax={6}>\n    <span className="step-pip" data-done />  {/* one per step */}\n  </div>\n</div>`}
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

      <SubSection title="File Upload" description="Drop files on the box or press “Choose files”. Files with the wrong type, no content, too large a size, or over the file limit are turned away, each with its own dismissible red bar. Every added file shows its state: uploading, uploaded, failed (with Retry) or blocked. Uploads in this demo are simulated.">
        <FileUploadDemo />
        <CodeBlock
          code={`const [files, setFiles] = useState<UploadedFile[]>([]);\n\n<FileUpload\n  label="Photos or documents"\n  title="Drag & drop files here"\n  hint="JPG, PNG, or PDF up to 20 MB each."\n  note="Only your care team at this clinic can see these."\n  acceptedFileTypes={["image/jpeg", "image/png", "application/pdf"]}\n  maxSizeMB={20}\n  maxFiles={5}\n  files={files}\n  onChange={setFiles}       {/* each item: { id, name, size, file, status?, progress?, error? } */}\n  onRetry={id => startUpload(id)}   {/* shows Retry on failed rows */}\n/>\n\n/* status: "uploading" (progress 0–100) | "uploaded" (default) | "failed" | "blocked"\n   Field errors (shown in the red bar):\n     "x.heic isn't a supported file type."   "x.pdf is empty."\n     "x.pdf is larger than 20 MB."           "You can add up to 5 files. 1 file wasn't added."\n   Row errors (default text, override with error):\n     failed  → "Upload failed. Check your connection and try again."\n     blocked → "This file didn't pass our security check and can't be uploaded." */\n\n/* Renders (React Aria DropZone + FileTrigger) */\n<div className="form-group">\n  <div className="upload-head">                       {/* label left, note top right */}\n    <div className="form-label">Photos or documents</div>\n    <div className="upload-note">Only your care team at this clinic can see these.</div>\n  </div>\n  <DropZone className="upload-zone">          {/* whole box accepts drops; [data-drop-target] while dragging */}\n    <div className="upload-zone-main">\n      <FilePlus size={32} className="upload-zone-icon" />\n      <span className="upload-zone-text">\n        <span className="upload-zone-title">Drag & drop files here</span>\n        <span className="upload-zone-hint">JPG, PNG, or PDF up to 20 MB each.</span>\n      </span>\n      <span className="upload-zone-action">\n        <FileTrigger allowsMultiple acceptedFileTypes={[…]}>\n          <Button className="btn btn-secondary">Choose files</Button>\n        </FileTrigger>\n      </span>\n    </div>\n    <div role="alert" className="upload-zone-alert-slot">   {/* one bar per turned-away file */}\n      <div className="alert alert-danger upload-zone-alert">\n        <AlertCircle size={16} className="alert-icon" />\n        <span className="upload-zone-alert-text">scan.heic isn't a supported file type.</span>\n        <Button className="notification-close" aria-label="Dismiss"><X size={14} /></Button>\n      </div>\n    </div>\n    <ul className="file-list">                   {/* inside the same box, under the prompt */}\n      <li className="file-row" data-status="failed">   {/* uploading | uploaded | failed | blocked */}\n        <span className="file-row-lead">\n          <AlertCircle size={16} className="file-row-icon" />   {/* AlertCircle for failed + blocked (centred on the row); Loader2 / FileText otherwise */}\n          {/* uploading: <span className="file-row-percent">60%</span>  ← 10px, in line with the progress bar */}\n        </span>\n        <span className="file-row-main">\n          <span className="file-row-top">\n            <span className="file-row-name">insurance-card-back.jpg</span>\n            <span className="file-row-size">3.2 MB</span>      {/* right after the name */}\n          </span>\n          {/* uploading: <span className="file-row-progress-line">\n                <span className="progress-track file-row-progress" role="progressbar">…</span>\n              </span> */}\n          <span className="file-row-error" role="alert">Upload failed. Check your connection and try again.</span>\n        </span>\n        <span className="file-row-actions">\n          <Button className="btn btn-secondary btn-sm">Retry</Button>\n          <Button className="btn btn-ghost btn-sm">Remove</Button>   {/* "Cancel" while uploading */}\n        </span>\n      </li>\n    </ul>\n  </DropZone>\n</div>`}
        />
      </SubSection>

      <SubSection title="Selection List" description="Shows every option directly in one bordered box. Patients tap a row to check it and can check as many as apply. An optional search field at the top of the box filters long lists, and the picked items appear at the bottom of the box as removable tags, so selections hidden by the search or the scroll stay visible. Use it instead of a dropdown when patients should see the choices at a glance.">
        <SelectionListDemo />
        <CodeBlock
          code={`const [value, setValue] = useState<string[]>(["Asthma"]);\n\n<SelectionList\n  label="Past and current medical conditions"\n  options={["Asthma", "Diabetes (type 2)", "High blood pressure", …]}\n  value={value}\n  onChange={setValue}\n  searchPlaceholder="Search conditions, e.g. diabetes"   {/* optional */}\n  showSelectedTags                                        {/* default true */}\n  emptyText="No match."\n/>\n\n/* Renders (React Aria CheckboxGroup) */\n<CheckboxGroup className="form-group">\n  <Label className="form-label">Past and current medical conditions</Label>\n  {/* optional hint="…" renders <Text slot="description" className="form-hint option-list-hint"> here */}\n  <div className="option-box">                          {/* one bordered box */}\n    <label className="option-box-search">               {/* top: search (optional) */}\n      <Search size={16} />\n      <input className="option-box-input" type="search" placeholder="Search conditions, e.g. diabetes" />\n    </label>\n    <div className="option-list">                       {/* middle: max-height 260px, scrolls */}\n      <Checkbox value="Asthma" className="option-list-item">   {/* [data-selected] = green row */}\n        <span className="check-box checked">✓</span> Asthma\n      </Checkbox>\n      …\n      <div className="option-list-empty">No match.</div>\n    </div>\n    <TagGroup className="option-box-selected" aria-label="…: selected">   {/* bottom: removable tags */}\n      <TagList className="tag-list">\n        <Tag className="chip">Asthma <Button slot="remove" className="tag-remove">×</Button></Tag>\n      </TagList>\n    </TagGroup>\n  </div>\n</CheckboxGroup>`}
        />
      </SubSection>

      <SubSection title="Calendar + Time Slots" description="Pick a day, then one of its open times. Days with no open times (weekends and past days) are greyed out and can't be picked. The times sit beside the calendar, and stack below it when the screen is 640px wide or less.">
        <SlotPickerDemo />
        <CodeBlock
          code={`const [date, setDate] = useState<Date | null>(null);\nconst [slot, setSlot] = useState<string | null>(null);\n\n<SlotPicker\n  date={date}\n  slot={slot}\n  onDateChange={d => { setDate(d); setSlot(null); }}\n  onSlotChange={setSlot}\n  timesFor={d => openTimesFromApi(d)}  {/* string[]; [] = day unavailable */}\n  stacked={false}                       {/* optional: leave out to stack automatically at ≤640px; true/false forces it */}\n  onCancel={() => closeDialog()}        {/* optional: shows Cancel; the page decides what it does */}\n  onConfirm={(d, t) => book(d, t)}      {/* optional: shows Confirm, enabled once a day + time are picked */}\n/>\n\n/* Renders */\n<div>\n  <div className="slot-picker">            {/* + slot-picker-stacked when stacked */}\n    <div className="slot-cal">\n      <div className="slot-cal-head">\n        ‹                                              {/* .calendar-nav-btn, keeps 32px */}\n        <div className="slot-cal-month">\n          <Select aria-label="Month">                {/* list: January–December */}\n            <Button className="btn btn-link">November ▾</Button>   {/* stacked: no ▾ */}\n            <Popover className="select-popover">…</Popover>\n          </Select>\n          <Select aria-label="Year">                 {/* list: this year + next 2 */}\n            <Button className="btn btn-link">2026 ▾</Button>\n            <Popover className="select-popover">…</Popover>\n          </Select>\n        </div>\n        ›\n      </div>\n      <div className="slot-cal-grid slot-cal-weekdays">…SUN–SAT…</div>\n      <div className="slot-cal-grid">\n        <button className="slot-cal-day" data-open data-selected>2</button>\n        <button className="slot-cal-day" disabled>7</button>   {/* no open times */}\n      </div>\n    </div>\n    <div className="slot-times">         {/* inside <RadioGroup aria-label="Open times"> */}\n      <Radio value="11:30 AM" className="btn btn-choice">11:30 AM</Radio>   {/* Choice Button */}\n    </div>\n  </div>\n  {/* built-in summary row: "Pick a day to see open time slots." → "Pick a time slot." → "Schedule at …"\n      stacked (mobile): summary on top, then X-icon Cancel (btn btn-ghost flow-cancel-icon) far left + Confirm (btn btn-primary btn-lg, 48px) right */}\n  <div>\n    <Button className="btn btn-secondary">Cancel</Button>    {/* bottom left, only with onCancel */}\n    <div>                                                     {/* bottom right */}\n      <div className="text-caption">Schedule at <span>11:30 AM Nov 2, 2026</span></div>\n      <Button className="btn btn-primary">Confirm</Button>   {/* only with onConfirm */}\n    </div>\n  </div>\n</div>`}
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
        </div>
        <CodeBlock
          code={`<div className="empty-state">\n  <div className="empty-state-icon"><Inbox size={40} /></div>\n  <div className="empty-state-title">No Results Found</div>\n  <div className="empty-state-desc">Description text here.</div>\n  <Button className="btn btn-primary">Action</Button>\n</div>`}
        />
      </SubSection>
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
        {"  "}<span className="p">--vsee-text-micro-size</span>{": "}<span className="v">10px</span>{";\n"}
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
