// Phone frame + scaffolding shared by every journey screen.
// All journey screens render at 390x844 inside a DCArtboard.

const PhoneFrame = ({ children, statusBg = "var(--surface)", noStatus = false }) => (
  <div style={{
    position: "relative", width: 390, height: 844,
    background: "var(--surface)",
    overflow: "hidden",
    fontFamily: "var(--font-body)",
    borderRadius: 0,
  }}>
    {!noStatus && (
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 44, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", pointerEvents: "none",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
        color: "var(--ink-900)", background: statusBg,
      }}>
        <span>9:41</span>
        <span style={{display:'flex',gap:6,alignItems:'center'}}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="0.5"/><rect x="4" y="4" width="3" height="6" rx="0.5"/><rect x="8" y="2" width="3" height="8" rx="0.5"/><rect x="12" y="0" width="3" height="10" rx="0.5"/></svg>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="18" height="9" rx="2"/><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor"/><rect x="20" y="3.5" width="1.5" height="3" rx="0.5" fill="currentColor"/></svg>
        </span>
      </div>
    )}
    <div style={{ position: "absolute", inset: 0, paddingTop: noStatus ? 0 : 44, display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  </div>
);

// Top app-bar — back button + title + optional right action.
const AppBar = ({ onBack, title, right, onClose, helpAction, transparent = false }) => (
  <div style={{
    height: 56, padding: "0 8px",
    display: "flex", alignItems: "center", gap: 4,
    background: transparent ? "transparent" : "var(--surface)",
    flexShrink: 0,
  }}>
    {onBack && (
      <button onClick={onBack} aria-label="Back" style={{
        width: 40, height: 40, borderRadius: 9999, border: "none", cursor: "pointer",
        background: "transparent", color: "var(--ink-900)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><IconBack size={22}/></button>
    )}
    {onClose && (
      <button onClick={onClose} aria-label="Close" style={{
        width: 40, height: 40, borderRadius: 9999, border: "none", cursor: "pointer",
        background: "transparent", color: "var(--ink-900)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><IconClose size={20}/></button>
    )}
    <div style={{
      flex: 1, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17,
      color: "var(--ink-900)", textAlign: onBack || onClose ? "left" : "center",
      paddingLeft: onBack || onClose ? 4 : 16,
    }}>{title}</div>
    {helpAction && (
      <button onClick={helpAction} aria-label="Help" style={{
        width: 36, height: 36, borderRadius: 9999, border: "none", cursor: "pointer",
        background: "rgba(74,130,101,0.10)", color: "var(--sage-700)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
        marginRight: 8,
      }}>?</button>
    )}
    {right && <div style={{ marginRight: 12 }}>{right}</div>}
  </div>
);

// Standard screen body — scrollable column.
const ScreenBody = ({ children, padded = true, style }) => (
  <div style={{
    flex: 1, overflow: "auto",
    padding: padded ? "8px 24px 32px" : 0,
    display: "flex", flexDirection: "column", gap: 20,
    ...style,
  }}>
    {children}
  </div>
);

// Sticky CTA tray — pinned to bottom of phone, with safe-area.
const CtaTray = ({ children, light = false }) => (
  <div style={{
    flexShrink: 0,
    padding: "16px 24px 32px",
    background: light ? "transparent" : "rgba(253,249,242,0.92)",
    backdropFilter: light ? "none" : "blur(12px)",
    WebkitBackdropFilter: light ? "none" : "blur(12px)",
    borderTop: light ? "none" : "1px solid var(--paper-300)",
    display: "flex", flexDirection: "column", gap: 8,
  }}>{children}</div>
);

// Section heading inside a screen body.
const SectionTitle = ({ eyebrow, title, body, align = "left" }) => (
  <div style={{ textAlign: align }}>
    {eyebrow && <div className="label-eyebrow" style={{ marginBottom: 8, color: "var(--sage-700)" }}>{eyebrow}</div>}
    <div className="display-md" style={{ fontSize: 28, lineHeight: "34px", marginBottom: body ? 10 : 0 }}>{title}</div>
    {body && <div style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: "23px", color: "var(--ink-700)" }}>{body}</div>}
  </div>
);

// A small key-value detail row.
const KV = ({ label, value, mono = false }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid var(--paper-300)" }}>
    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)" }}>{label}</span>
    <span style={{
      fontFamily: mono ? "var(--font-numeric)" : "var(--font-display)",
      fontFeatureSettings: mono ? '"tnum" 1' : "normal",
      fontWeight: 600, fontSize: 14, color: "var(--ink-900)",
      textAlign: "right", maxWidth: "65%",
    }}>{value}</span>
  </div>
);

// Status pill — small filled pill for stock/expiry status.
const StatusPill = ({ kind, children }) => {
  const map = {
    low:        { bg: "rgba(217,119,6,0.14)", fg: "#A05A05", dot: "#D97706" },
    out:        { bg: "rgba(186,26,26,0.10)", fg: "var(--error)", dot: "var(--error)" },
    expiring:   { bg: "rgba(217,119,6,0.14)", fg: "#A05A05", dot: "#D97706" },
    expired:    { bg: "rgba(186,26,26,0.10)", fg: "var(--error)", dot: "var(--error)" },
    displaced:  { bg: "rgba(37,99,235,0.10)", fg: "var(--info)", dot: "var(--info)" },
    ok:         { bg: "rgba(74,130,101,0.12)", fg: "var(--sage-700)", dot: "var(--sage-700)" },
    neutral:    { bg: "var(--paper-250)", fg: "var(--ink-700)", dot: "var(--ink-600)" },
  };
  const c = map[kind] || map.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 9999,
      background: c.bg, color: c.fg,
      fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11, lineHeight: "16px",
      letterSpacing: "0.2px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: c.dot }}/>
      {children}
    </span>
  );
};

// A breadcrumb of locations rendered as a path string.
const PathCrumb = ({ parts, color = "var(--ink-600)" }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 4, flexWrap: "wrap",
    fontFamily: "var(--font-body)", fontSize: 12, color, lineHeight: "16px",
  }}>
    {parts.map((p, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ color: "var(--ink-400)" }}>›</span>}
        <span style={{ fontWeight: i === parts.length - 1 ? 600 : 400, color: i === parts.length - 1 ? "var(--ink-900)" : color }}>{p}</span>
      </React.Fragment>
    ))}
  </div>
);

// Tree node — for the live tree visualisation that grows during space setup.
// Each unit type has its own glyph + tint.
const UNIT_META = {
  premises:    { eyebrow: "PREMISES",    glyph: "🏠", tint: "var(--sage-700)", iconBg: "rgba(74,130,101,0.14)", color: "#fff" },
  area:        { eyebrow: "AREA",        glyph: "🏷",  tint: "var(--sage-700)", iconBg: "rgba(74,130,101,0.10)", color: "var(--sage-700)" },
  zone:        { eyebrow: "ZONE",        glyph: "📍", tint: "var(--sage-700)", iconBg: "rgba(74,130,101,0.10)", color: "var(--sage-700)" },
  section:     { eyebrow: "SECTION",     glyph: "📐", tint: "var(--sage-700)", iconBg: "rgba(74,130,101,0.10)", color: "var(--sage-700)" },
  sub_section: { eyebrow: "SUB-SECTION", glyph: "🔩", tint: "var(--ink-700)",  iconBg: "var(--paper-250)",       color: "var(--ink-700)" },
  container:   { eyebrow: "CONTAINER",   glyph: "📦", tint: "#A05A05",         iconBg: "rgba(217,119,6,0.12)",   color: "#A05A05" },
  shelf:       { eyebrow: "SHELF",       glyph: "📏", tint: "var(--ink-700)",  iconBg: "var(--paper-250)",       color: "var(--ink-700)" },
};

const TreeRow = ({ unit, name, depth = 0, focused = false, faint = false, addable = false, onAdd, last = false, totalDepth = 1 }) => {
  const meta = UNIT_META[unit] || UNIT_META.area;
  const indent = depth * 18;
  return (
    <div style={{ position: "relative", paddingLeft: indent }}>
      {depth > 0 && (
        <>
          {/* vertical line ancestor */}
          <div style={{
            position: "absolute", left: indent - 9, top: 0, bottom: last ? "50%" : 0,
            width: 1, background: "var(--paper-300)",
          }}/>
          {/* horizontal connector */}
          <div style={{
            position: "absolute", left: indent - 9, top: 18, width: 9, height: 1,
            background: "var(--paper-300)",
          }}/>
        </>
      )}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "6px 10px",
        background: focused ? "rgba(74,130,101,0.08)" : "transparent",
        border: focused ? "1px solid var(--sage-700)" : "1px solid transparent",
        borderRadius: 10,
        opacity: faint ? 0.5 : 1,
        marginBottom: 4,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: meta.iconBg, color: meta.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>{meta.glyph}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 9,
            letterSpacing: "0.6px", color: "var(--ink-600)", textTransform: "uppercase",
          }}>{meta.eyebrow}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14,
            color: "var(--ink-900)", marginTop: 1, whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>{name}</div>
        </div>
        {addable && (
          <button onClick={onAdd} aria-label="Add child" style={{
            width: 26, height: 26, borderRadius: 9999, border: "none", cursor: "pointer",
            background: "var(--sage-700)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><IconPlus size={14} color="#fff"/></button>
        )}
      </div>
    </div>
  );
};

// A complete tree given an array of {unit, name, depth, focused, faint}.
const Tree = ({ nodes, addAt, onAdd }) => (
  <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 14, boxShadow: "var(--shadow-ambient-sm)" }}>
    {nodes.map((n, i) => (
      <TreeRow key={i} {...n} addable={addAt === i} onAdd={onAdd} last={i === nodes.length - 1}/>
    ))}
  </div>
);

Object.assign(window, {
  PhoneFrame, AppBar, ScreenBody, CtaTray, SectionTitle, KV, StatusPill, PathCrumb, TreeRow, Tree, UNIT_META,
});
