// Onboarding bits — progress indicator, hierarchy tree, checklist step.

// Step progress (used at the top of each onboarding screen).
const ProgressBar = ({ step, of = 5, label }) => {
  const pct = (step / of) * 100;
  return (
    <div style={{ padding: "16px 16px 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="label-section" style={{ textTransform: "none", letterSpacing: "0.4px" }}>{label ?? `Step ${step} of ${of}`}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-700)" }}>{step} of {of}</span>
      </div>
      <div style={{ height: 8, borderRadius: 9999, background: "var(--paper-300)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: 8, borderRadius: 9999, background: "var(--sage-700)", transition: "width 320ms cubic-bezier(0.32,0.72,0,1)" }}/>
      </div>
    </div>
  );
};

// Hierarchy tree node — Premises / Area / Sub-section / Container.
const HierarchyNode = ({ level, eyebrow, name, icon, indent = 0, lastChild = false, faint = false }) => {
  const fontSize = level >= 5 ? 14 : 16;
  const eyebrowSize = level >= 5 ? 9 : 10;
  const bg = level === 1 ? "var(--paper-250)" : level >= 5 ? (faint ? "rgba(255,255,255,0.8)" : "#fff") : "#fff";
  const border = level >= 5 ? `1px solid ${faint ? "var(--paper-300)" : "rgba(74,130,101,0.3)"}` : "none";
  const shadow = level === 1 ? "0 1px 2px rgba(0,0,0,0.05)" : "none";

  return (
    <div style={{ position: "relative", marginLeft: indent }}>
      {indent > 0 && (
        <div style={{
          position: "absolute", left: -16, top: -16, width: 16, height: 41,
          borderLeft: "1px solid var(--sage-300)",
          borderBottom: "1px solid var(--sage-300)",
          borderBottomLeftRadius: 8,
        }}/>
      )}
      <div style={{
        background: bg, borderRadius: 8, border, boxShadow: shadow,
        padding: level === 1 ? 16 : 8, display: "flex", alignItems: "center", gap: 12,
      }}>
        <IconPlinth size={level === 1 ? 32 : 28} tint="sage">{icon}</IconPlinth>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: eyebrowSize, letterSpacing: "0.9px",
            color: "var(--ink-700)", textTransform: "uppercase",
          }}>{eyebrow}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize, lineHeight: `${fontSize + 6}px`,
            color: "var(--ink-900)", marginTop: 2,
          }}>{name}</div>
        </div>
      </div>
    </div>
  );
};

// Checklist step (one row inside the dashboard onboarding card).
const ChecklistStep = ({ index, title, subtitle, complete, current, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", textAlign: "left", border: "none", background: "transparent",
    padding: "12px 8px", borderRadius: 8, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 14,
    transition: "background 160ms ease-out",
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = "var(--paper-100)"}
  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
  >
    <div style={{
      width: 28, height: 28, borderRadius: 9999, flexShrink: 0,
      background: complete ? "var(--sage-700)" : "transparent",
      border: complete ? "none" : `2px solid ${current ? "var(--sage-700)" : "var(--paper-300)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
      color: complete ? "#fff" : "var(--ink-600)",
    }}>{complete ? "✓" : index}</div>
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
        color: complete ? "var(--ink-600)" : "var(--ink-900)",
        textDecoration: complete ? "line-through" : "none",
      }}>{title}</div>
      {subtitle && <div className="body-sm" style={{ marginTop: 2 }}>{subtitle}</div>}
    </div>
    {!complete && <span style={{ color: "var(--sage-700)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>{current ? "Resume →" : "Start"}</span>}
  </button>
);

Object.assign(window, { ProgressBar, HierarchyNode, ChecklistStep });
