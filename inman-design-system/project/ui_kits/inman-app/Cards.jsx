// Cards: decision, hero, tip, pantry item.

const IconPlinth = ({ children, tint = "stone", size = 48 }) => {
  const bg = tint === "sage" ? "rgba(74,130,101,0.10)" : "var(--paper-200)";
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999, background: bg,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{children}</div>
  );
};

const HomeGlyph = () => (
  <svg width="20" height="22" viewBox="0 0 16 18" fill="var(--sage-700)"><path d="M 0 18 L 0 6 L 8 0 L 16 6 L 16 18 L 10 18 L 10 11 L 6 11 L 6 18 L 0 18 L 0 18"/></svg>
);
const InviteGlyph = () => (
  <svg width="22" height="18" viewBox="0 0 20 16" fill="var(--ink-600)"><path d="M 2 16 C 1.45 16 0.979 15.804 0.587 15.413 C 0.196 15.021 0 14.55 0 14 L 0 2 C 0 1.45 0.196 0.979 0.587 0.587 C 0.979 0.196 1.45 0 2 0 L 18 0 C 18.55 0 19.021 0.196 19.413 0.587 C 19.804 0.979 20 1.45 20 2 L 20 14 C 20 14.55 19.804 15.021 19.413 15.413 C 19.021 15.804 18.55 16 18 16 L 2 16 L 2 16 M 10 9 L 18 4 L 18 2 L 10 7 L 2 2 L 2 4 L 10 9 L 10 9"/></svg>
);
const CheckGlyph = () => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="#fff"><path d="M2 10 L8 16 L20 4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// Decision card — the onboarding "Start a new Crew" / "I have an invite" pair.
const DecisionCard = ({ icon, iconTint, title, body, recommended, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", textAlign: "left", border: "none", cursor: "pointer",
    background: "#FFFFFF", borderRadius: 12, padding: 24,
    boxShadow: "var(--shadow-ambient-lg)",
    display: "flex", flexDirection: "column", gap: 16,
    transition: "transform 180ms ease-out",
  }}
  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.99)"}
  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
  >
    <IconPlinth tint={iconTint}>{icon}</IconPlinth>
    <div>
      <div className="headline-md" style={{ marginBottom: 8 }}>{title}</div>
      <div className="body-md" style={{ marginTop: 0 }}>{body}</div>
    </div>
    {recommended && (
      <div style={{
        alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8,
        background: "var(--paper-250)", borderRadius: 9999, padding: "6px 12px",
      }}>
        <span style={{
          fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)",
        }}>Recommended for first-time users</span>
      </div>
    )}
  </button>
);

// Hero card — sage gradient with "🎉" celebration.
const HeroCard = ({ title, body, badge }) => (
  <div style={{
    position: "relative", overflow: "hidden", borderRadius: 8,
    background: "var(--gradient-primary)",
    boxShadow: "0 4px 32px rgba(49,105,77,0.15)",
    padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center",
  }}>
    <div style={{
      position: "absolute", right: -5, top: -5, width: 104, height: 104,
      borderRadius: 9999, background: "rgba(153,211,178,0.2)",
    }}/>
    <div style={{ position: "relative", maxWidth: 200 }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
        color: "#fff", marginBottom: 5,
      }}>{title}</div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: 14, lineHeight: "20px",
        color: "var(--sage-100)", opacity: 0.95,
      }}>{body}</div>
    </div>
    {badge && (
      <div style={{
        position: "relative", width: 48, height: 48, borderRadius: 9999,
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{badge}</div>
    )}
  </div>
);

// Tip card — amber bordered (the one allowed border use).
const TipCard = ({ children }) => (
  <div style={{
    background: "var(--paper-100)", borderRadius: 12,
    border: "1px solid var(--warn)",
    padding: 20, display: "flex", gap: 16, alignItems: "flex-start",
  }}>
    <div style={{
      width: 22, height: 22, borderRadius: 9999, background: "var(--warn)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#fff",
    }}>!</div>
    <div style={{
      fontFamily: "var(--font-body)", fontSize: 14, lineHeight: "22px",
      color: "var(--ink-900)",
    }}>{children}</div>
  </div>
);

Object.assign(window, { DecisionCard, HeroCard, TipCard, IconPlinth, HomeGlyph, InviteGlyph, CheckGlyph });
