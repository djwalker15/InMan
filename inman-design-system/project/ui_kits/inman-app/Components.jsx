// Round-it-out components: toggles, chips, list rows, modal, sheet, toast,
// empty state, inline alerts, search, stepper, segmented control.
// Loaded after Buttons.jsx + Cards.jsx + Icons.jsx.

const { useState } = React;

/* ── Toggle / Switch ─────────────────────────────────────────────── */
const Toggle = ({ on, onChange, label, hint }) => {
  const [internal, setInternal] = useState(!!on);
  const isOn = on === undefined ? internal : on;
  const flip = () => { if (on === undefined) setInternal(!internal); onChange?.(!isOn); };
  const track = isOn ? "var(--sage-700)" : "var(--paper-300)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0" }}>
      <button onClick={flip} role="switch" aria-checked={isOn} style={{
        width: 48, height: 28, padding: 2, border: "none", cursor: "pointer",
        background: track, borderRadius: 9999, position: "relative",
        transition: "background 200ms ease-out",
      }}>
        <span style={{
          position: "absolute", top: 2, left: isOn ? 22 : 2, width: 24, height: 24,
          background: "#fff", borderRadius: 9999,
          boxShadow: "0 1px 3px rgba(28,28,24,0.18)",
          transition: "left 220ms cubic-bezier(0.32,0.72,0,1)",
        }}/>
      </button>
      {label && (
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--ink-900)" }}>{label}</div>
          {hint && <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 2 }}>{hint}</div>}
        </div>
      )}
    </div>
  );
};

/* ── Chip / Tag / Filter Pill ────────────────────────────────────── */
const Chip = ({ children, variant = "default", icon, onRemove, onClick, selected = false }) => {
  const styles = {
    default:  { bg: "var(--paper-250)",  fg: "var(--ink-900)" },
    sage:     { bg: "rgba(74,130,101,0.12)", fg: "var(--sage-700)" },
    warn:     { bg: "rgba(217,119,6,0.12)",   fg: "#A05A05" },
    error:    { bg: "rgba(186,26,26,0.10)",   fg: "var(--error)" },
    selected: { bg: "var(--sage-700)",   fg: "#fff" },
  };
  const s = selected ? styles.selected : (styles[variant] || styles.default);
  const Tag = onClick ? "button" : "span";
  return (
    <Tag onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "6px 12px", borderRadius: 9999, border: "none", cursor: onClick ? "pointer" : "default",
      background: s.bg, color: s.fg,
      fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, lineHeight: "16px",
      transition: "background 160ms ease-out",
    }}>
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ display: "inline-flex", marginLeft: 2, cursor: "pointer", opacity: 0.7 }}>
          <IconClose size={12}/>
        </span>
      )}
    </Tag>
  );
};

/* ── List Row ────────────────────────────────────────────────────── */
const ListRow = ({ icon, title, subtitle, meta, onClick, trailing }) => (
  <button onClick={onClick} style={{
    width: "100%", textAlign: "left", border: "none", cursor: onClick ? "pointer" : "default",
    background: "var(--paper-50)", borderRadius: 12, padding: 16,
    display: "flex", alignItems: "center", gap: 14,
    transition: "background 180ms ease-out",
    boxShadow: "0 1px 2px rgba(28,28,24,0.04)",
  }}
  onMouseEnter={(e) => onClick && (e.currentTarget.style.background = "#fff")}
  onMouseLeave={(e) => onClick && (e.currentTarget.style.background = "var(--paper-50)")}
  >
    {icon && (
      <div style={{
        width: 44, height: 44, borderRadius: 9999, flexShrink: 0,
        background: "rgba(74,130,101,0.10)", color: "var(--sage-700)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15,
        color: "var(--ink-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{title}</div>
      {subtitle && <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 2 }}>{subtitle}</div>}
    </div>
    {meta && <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)" }}>{meta}</div>}
    {trailing !== undefined ? trailing : (onClick && <span style={{ color: "var(--ink-400)" }}><IconChevronRight size={20}/></span>)}
  </button>
);

/* ── Inline Alert ────────────────────────────────────────────────── */
const Alert = ({ kind = "info", title, children }) => {
  const map = {
    success: { bg: "rgba(74,130,101,0.10)", border: "var(--sage-600)",  fg: "var(--sage-700)", icon: <IconCheck size={18}/> },
    error:   { bg: "var(--error-bg)",        border: "var(--error)",     fg: "var(--error)",     icon: <IconAlert size={18}/> },
    info:    { bg: "rgba(37,99,235,0.08)",   border: "var(--info)",      fg: "var(--info)",      icon: <IconInfo size={18}/> },
    warn:    { bg: "var(--warn-bg)",          border: "var(--warn)",      fg: "var(--warn)",      icon: <IconAlert size={18}/> },
  };
  const c = map[kind] || map.info;
  return (
    <div style={{
      background: c.bg, borderRadius: 12, border: `1px solid ${c.border}`,
      padding: 16, display: "flex", gap: 14, alignItems: "flex-start",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 9999, background: c.border, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{c.icon}</div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)", marginBottom: 4 }}>{title}</div>}
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: "20px", color: "var(--ink-900)" }}>{children}</div>
      </div>
    </div>
  );
};

/* ── Toast / Snackbar ────────────────────────────────────────────── */
const Toast = ({ kind = "info", children, action, onAction }) => {
  const c = kind === "success" ? { bg: "var(--sage-700)", fg: "#fff", icon: <IconCheck size={18}/> }
          : kind === "error"   ? { bg: "var(--ink-900)",  fg: "#fff", icon: <IconAlert size={18}/> }
          :                       { bg: "var(--ink-900)",  fg: "#fff", icon: null };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 12,
      background: c.bg, color: c.fg, borderRadius: 12,
      padding: "12px 16px",
      boxShadow: "0 8px 32px rgba(28,28,24,0.18)",
      fontFamily: "var(--font-body)", fontSize: 14,
    }}>
      {c.icon && <span style={{ display: "inline-flex" }}>{c.icon}</span>}
      <span>{children}</span>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--sage-100)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
          marginLeft: 8,
        }}>{action}</button>
      )}
    </div>
  );
};

/* ── Search Bar ──────────────────────────────────────────────────── */
const SearchBar = ({ value, onChange, placeholder = "Search items…", onClear }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 16px", height: 48, borderRadius: 12,
      background: focused ? "var(--paper-250)" : "var(--paper-100)",
      borderBottom: focused ? "2px solid var(--sage-700)" : "2px solid transparent",
      transition: "background 180ms ease-out, border-color 180ms ease-out",
    }}>
      <span style={{ color: "var(--ink-500)" }}><IconSearch size={18}/></span>
      <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, border: "none", outline: "none", background: "transparent",
          fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink-900)" }}/>
      {value && (
        <button onClick={onClear} aria-label="Clear" style={{
          width: 22, height: 22, borderRadius: 9999, border: "none", cursor: "pointer",
          background: "var(--paper-300)", color: "var(--ink-700)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><IconClose size={12}/></button>
      )}
    </div>
  );
};

/* ── Segmented Control ───────────────────────────────────────────── */
const Segmented = ({ options, value, onChange }) => (
  <div style={{
    display: "inline-flex", padding: 4, borderRadius: 9999,
    background: "var(--paper-200)", gap: 2,
  }}>
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <button key={opt.value} onClick={() => onChange?.(opt.value)} style={{
          padding: "8px 16px", borderRadius: 9999, border: "none", cursor: "pointer",
          background: active ? "#fff" : "transparent",
          color: active ? "var(--ink-900)" : "var(--ink-600)",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
          boxShadow: active ? "0 1px 2px rgba(28,28,24,0.08)" : "none",
          transition: "background 180ms ease-out, color 180ms ease-out",
        }}>{opt.label}</button>
      );
    })}
  </div>
);

/* ── Stepper (numeric +/-) ───────────────────────────────────────── */
const Stepper = ({ value = 1, onChange, min = 0, max = 99 }) => {
  const [internal, setInternal] = useState(value);
  const v = onChange ? value : internal;
  const set = (next) => {
    next = Math.max(min, Math.min(max, next));
    if (onChange) onChange(next); else setInternal(next);
  };
  const btn = {
    width: 36, height: 36, borderRadius: 9999, border: "none", cursor: "pointer",
    background: "var(--paper-200)", color: "var(--ink-900)",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <button onClick={() => set(v - 1)} aria-label="Decrease" style={btn}>
        <svg width="14" height="2" viewBox="0 0 14 2"><rect width="14" height="2" rx="1" fill="currentColor"/></svg>
      </button>
      <span style={{
        minWidth: 32, textAlign: "center",
        fontFamily: "var(--font-numeric)", fontWeight: 700, fontSize: 17, color: "var(--ink-900)",
        fontFeatureSettings: '"tnum" 1',
      }}>{v}</span>
      <button onClick={() => set(v + 1)} aria-label="Increase" style={btn}><IconPlus size={16}/></button>
    </div>
  );
};

/* ── Empty State ─────────────────────────────────────────────────── */
const EmptyState = ({ icon, title, body, action }) => (
  <div style={{
    padding: "40px 24px", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: 9999,
      background: "var(--paper-200)", color: "var(--sage-700)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{icon || <IconBox size={32}/>}</div>
    <div>
      <div className="headline-md" style={{ marginBottom: 6 }}>{title}</div>
      {body && <div className="body-md" style={{ maxWidth: 280, margin: "0 auto" }}>{body}</div>}
    </div>
    {action}
  </div>
);

/* ── Modal ───────────────────────────────────────────────────────── */
const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(28,28,24,0.4)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 360, background: "var(--paper-50)", borderRadius: 16,
        boxShadow: "0 24px 64px rgba(28,28,24,0.18)",
        padding: 24, display: "flex", flexDirection: "column", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div className="headline-md" style={{ flex: 1 }}>{title}</div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: 9999, border: "none", cursor: "pointer",
            background: "var(--paper-200)", color: "var(--ink-900)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><IconClose size={14}/></button>
        </div>
        <div className="body-md">{children}</div>
        {footer && <div style={{ display: "flex", gap: 8, marginTop: 8 }}>{footer}</div>}
      </div>
    </div>
  );
};

/* ── Bottom Sheet ────────────────────────────────────────────────── */
const Sheet = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: "rgba(28,28,24,0.35)",
      display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", background: "var(--paper-50)",
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: "12px 24px 32px",
        boxShadow: "0 -8px 32px rgba(28,28,24,0.12)",
        animation: "sheet-up 320ms cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 9999, background: "var(--paper-300)", margin: "8px auto 16px" }}/>
        {title && <div className="headline-md" style={{ marginBottom: 12 }}>{title}</div>}
        <div>{children}</div>
      </div>
      <style>{`@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

Object.assign(window, { Toggle, Chip, ListRow, Alert, Toast, SearchBar, Segmented, Stepper, EmptyState, Modal, Sheet });
