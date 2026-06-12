// ─────────────────────────────────────────────────────────────
// Aspirational concept — "visual space" navigation.
// The long-term vision from the brief: a photo/video rendering of the
// real space, where you tap a sub-space directly in the image to drill in.
// The hero is a user-fillable <image-slot> — drop a real kitchen photo and
// the hotspots sit over it. Shown as a vision, not a shipped screen.
// ─────────────────────────────────────────────────────────────

function ConceptApp({ slotId = "concept-kitchen" }) {
  const [view, setView] = React.useState("photo");
  const [ping, setPing] = React.useState(null);

  const drill = (label) => { setPing(label); clearTimeout(drill._t); drill._t = setTimeout(() => setPing(null), 1500); };

  // Hotspots over the kitchen photo — name + live item count + a pulse dot.
  const spots = [
    { label: "Pantry Wall",    items: 17, top: "23%", left: "34%" },
    { label: "Upper Cabinets", items: 8,  top: "18%", left: "67%" },
    { label: "Fridge",         items: 16, top: "60%", left: "35%" },
    { label: "Lower Cabinets", items: 4,  top: "77%", left: "65%" },
  ];

  return (
    <PhoneFrame statusBg="var(--surface)">
      {/* top bar */}
      <div style={{ flexShrink: 0, height: 52, padding: "0 10px 0 4px", display: "flex", alignItems: "center", gap: 4, background: "var(--surface)" }}>
        <HeadBtn label="Back"><IconBack size={22} /></HeadBtn>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--ink-600)", fontWeight: 500 }}>Walker Home</span>
          <span style={{ color: "var(--ink-400)", fontSize: 12 }}>›</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--ink-900)", fontWeight: 700 }}>Kitchen</span>
        </div>
        <HeadBtn label="Add space" filled><IconPlus size={20} color="#fff" /></HeadBtn>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "8px 20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* concept tag + view toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 9999,
            background: "rgba(217,119,6,0.12)", color: "#A05A05",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10.5, letterSpacing: "0.4px", textTransform: "uppercase",
          }}><IconInfo size={13} color="#A05A05" /> Concept</span>
          <div style={{ display: "flex", padding: 3, background: "var(--paper-200)", borderRadius: 9999, gap: 2 }}>
            {["photo", "cards"].map((v) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 14px", borderRadius: 9999, border: "none", cursor: "pointer",
                background: view === v ? "var(--paper-50)" : "transparent",
                color: view === v ? "var(--ink-900)" : "var(--ink-600)",
                boxShadow: view === v ? "var(--shadow-ambient-sm)" : "none",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5, textTransform: "capitalize",
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* the visual space */}
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-ambient-md)" }}>
          <div style={{ position: "absolute", inset: 0, background: spPhoto(36), zIndex: 0 }} />
          <image-slot
            id={slotId} fit="cover" shape="rounded" radius="18"
            placeholder="Drop a photo of your kitchen"
            style={{ position: "relative", zIndex: 1, display: "block", width: "100%", height: "380px" }}
          ></image-slot>

          {/* hotspots */}
          {view === "photo" && spots.map((s) => (
            <button key={s.label} onClick={() => drill(s.label)} style={{
              position: "absolute", top: s.top, left: s.left, transform: "translate(-50%,-50%)", zIndex: 3,
              border: "none", cursor: "pointer", padding: 0, background: "transparent",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: 9999, background: "var(--sage-600)",
                boxShadow: "0 0 0 5px rgba(74,130,101,0.30), 0 2px 8px rgba(0,0,0,0.3)",
                display: "block",
              }} />
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 11px", borderRadius: 9999,
                background: "rgba(253,249,242,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                boxShadow: "var(--shadow-ambient-md)", whiteSpace: "nowrap",
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5, color: "var(--ink-900)" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)" }}>{s.items} items</span>
                <IconChevronRight size={12} color="var(--sage-700)" />
              </span>
            </button>
          ))}

          {ping && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 4, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(28,28,24,0.32)", backdropFilter: "blur(2px)",
            }}>
              <span style={{
                padding: "10px 18px", borderRadius: 9999, background: "var(--paper-50)",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)",
                boxShadow: "var(--shadow-ambient-lg)",
              }}>Stepping into {ping}…</span>
            </div>
          )}
        </div>

        {/* explainer */}
        <div style={{ background: "var(--paper-100)", borderRadius: 16, padding: 18 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)", marginBottom: 6 }}>
            Navigate by tapping the space itself
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-700)" }}>
            A photo — or short video — of the real room becomes the map. Tap a shelf, a cabinet, the fridge, and InMan drills
            straight into what lives there. Best for comprehension and spatial orientation; the card drill-down ships first,
            this is the direction it grows toward.
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { ConceptApp });
