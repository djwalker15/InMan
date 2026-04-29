// InMan brand bits — wordmark, glyph, three nav variants.
// Mirrors /Components/components/{BrandIdentity,TypeSignUp,TypeClose,TypeSignedIn}.

const BrandIdentity = ({ size = "md" }) => {
  const dims = size === "lg" ? { icon: 28, text: 32, gap: 10 } : { icon: 20, text: 24, gap: 8 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: dims.gap }}>
      <img src="assets/brand-icon.svg" alt="" style={{ width: dims.icon, height: dims.icon }} />
      <span style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: dims.text, lineHeight: `${dims.text + 8}px`,
        letterSpacing: "-1.2px", color: "var(--sage-700)",
      }}>InMan</span>
    </div>
  );
};

// Hamburger/close/avatar — small inline glyphs.
const HamburgerGlyph = () => (
  <svg width="22" height="18" viewBox="0 0 32 26" fill="var(--sage-700)" aria-hidden>
    <path d="M 0 26 L 0 21.667 L 32 21.667 L 32 26 L 0 26 Z M 0 15.167 L 0 10.833 L 32 10.833 L 32 15.167 L 0 15.167 Z M 0 4.333 L 0 0 L 32 0 L 32 4.333 L 0 4.333 Z"/>
  </svg>
);

const CloseGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
    <path d="M2 2 L12 12 M12 2 L2 12"/>
  </svg>
);

const UserGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21 a8 8 0 0 1 16 0"/>
  </svg>
);

// Nav header — `variant` controls the right-side button: signup | close | signedin
const NavHeader = ({ variant = "signup", onAction }) => {
  const right = (() => {
    if (variant === "close") return (
      <button onClick={onAction} style={{
        width: 40, height: 40, borderRadius: 9999, background: "var(--ink-900)",
        border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }} aria-label="Close"><CloseGlyph/></button>
    );
    if (variant === "signedin") return (
      <button onClick={onAction} style={{
        width: 40, height: 40, borderRadius: 9999, background: "var(--sage-600)",
        border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }} aria-label="Account"><UserGlyph/></button>
    );
    return (
      <button onClick={onAction} style={{
        height: 36, padding: "0 16px", borderRadius: 9999,
        background: "var(--sage-700)", color: "#fff", border: "none",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer",
      }}>Sign up</button>
    );
  })();

  return (
    <div style={{
      height: 72, padding: "16px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "var(--surface)",
    }}>
      <button aria-label="Menu" style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
        <HamburgerGlyph/>
      </button>
      <BrandIdentity/>
      {right}
    </div>
  );
};

Object.assign(window, { BrandIdentity, NavHeader, HamburgerGlyph, CloseGlyph, UserGlyph });
