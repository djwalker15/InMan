// Buttons & input fields. Mirrors /Components/Button + /Components/Inputs.

const ArrowGlyph = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} aria-hidden>
    <path d="M 12.175 9 L 0 9 L 0 7 L 12.175 7 L 6.575 1.4 L 8 0 L 16 8 L 8 16 L 6.575 14.6 L 12.175 9 L 12.175 9"/>
  </svg>
);

// Primary CTA — sage gradient, white text, optional arrow, sage-tinted shadow.
const PrimaryButton = ({ children, onClick, arrow = false, height = 56 }) => (
  <button onClick={onClick} style={{
    width: "100%", height, borderRadius: 12, border: "none", cursor: "pointer",
    background: "var(--gradient-primary)",
    boxShadow: "var(--shadow-cta)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#fff",
    transition: "transform 180ms ease-out",
  }}
  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
  >
    {children}
    {arrow && <ArrowGlyph size={16} color="#fff"/>}
  </button>
);

// Secondary — paper-250, sage text.
const SecondaryButton = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", height: 56, borderRadius: 12, border: "none", cursor: "pointer",
    background: "var(--surface-container-highest)",
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
    color: "var(--sage-700)",
  }}>{children}</button>
);

// Tertiary — pure text, ink-500.
const TextButton = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: "none", border: "none", cursor: "pointer", padding: "12px 0",
    fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-500)",
    width: "100%", textAlign: "center",
  }}>{children}</button>
);

// Labeled input with paper-100 fill and active 2px sage bottom-bar.
const Field = ({ label, value, onChange, placeholder, hint, type = "text" }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <div className="label-section" style={{ marginBottom: 8 }}>{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: "100%", height: 56, borderRadius: 12, padding: "18px 16px",
          background: focused ? "var(--surface-container-highest)" : "var(--surface-container-low)",
          borderTop: "none", borderLeft: "none", borderRight: "none",
          borderBottom: focused ? "2px solid var(--sage-700)" : "2px solid transparent",
          fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink-900)",
          outline: "none",
          transition: "background 180ms ease-out, border-color 180ms ease-out",
        }}
      />
      {hint && <div style={{ marginTop: 6, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-500)" }}>{hint}</div>}
    </div>
  );
};

Object.assign(window, { PrimaryButton, SecondaryButton, TextButton, Field, ArrowGlyph });
