// Glanceable redesign explorations — three directions optimized for
// at-a-glance reading in a dim/busy bar environment. Each direction takes
// the everyday "Checking Stock" list as the anchor screen, then carries
// the same visual logic into one Adding-Inventory and one Space-Setup
// screen so the cascade is visible.
//
// Density rule: every primary value (item name, status, qty) must be
// readable from arm's length on a phone, AND from ~1m on a tablet. We
// trade row count for legibility and use color as a primary signal.

const G_ITEMS = [
  { name: "Whole Milk",      brand: "Straus · 1 gal",       glyph: "🥛", loc: "Fridge › Door",            status: "out",      pct: 0,   statusLabel: "OUT",        bigLabel: "OUT",        sub: "Last seen 2 days ago",   expiry: "exp. tomorrow", days: 1 },
  { name: "Ground Cinnamon", brand: "McCormick · 2.37 oz",  glyph: "🥄", loc: "Spice Rack › Shelf 1",     status: "low",      pct: 25,  statusLabel: "LOW",        bigLabel: "25%",        sub: "Refilled 3 weeks ago",   expiry: "May 2027",      days: 380 },
  { name: "Yeast",           brand: "Red Star · 4 oz",       glyph: "🥖", loc: "Pantry › Top › Shelf 1",   status: "out",      pct: 0,   statusLabel: "OUT",        bigLabel: "OUT",        sub: "Restock before Friday",   expiry: "—",             days: null },
  { name: "Heavy Cream",     brand: "Straus · 1 qt",        glyph: "🥛", loc: "Fridge › Top",             status: "expiring", pct: 60,  statusLabel: "USE SOON",   bigLabel: "3 DAYS",     sub: "Open · 60% remaining",   expiry: "May 11",        days: 3 },
  { name: "Olive Oil",       brand: "Frantoia · 750 ml",    glyph: "🫒", loc: "Pantry › Center › Shelf 2",status: "ok",       pct: 75,  statusLabel: "OK",         bigLabel: "75%",        sub: "Sealed backup in Pantry",expiry: "Mar 2026",      days: 320 },
  { name: "Vanilla Extract", brand: "Nielsen-Massey · 4 oz",glyph: "🍶", loc: "Spice Rack › Shelf 1",     status: "ok",       pct: 90,  statusLabel: "SEALED",     bigLabel: "FULL",       sub: "Sealed · backup ready",  expiry: "Jan 2028",      days: 600 },
];

// Color tokens for each status — tuned for high-contrast bar viewing.
const STATUS_INK = {
  out:      { bar: "#BA1A1A", soft: "rgba(186,26,26,0.10)",  fg: "#7A0F0F", chip: "#BA1A1A", chipFg: "#FFF8F8" },
  low:      { bar: "#D97706", soft: "rgba(217,119,6,0.12)",  fg: "#7A4A05", chip: "#D97706", chipFg: "#FFF8EE" },
  expiring: { bar: "#D97706", soft: "rgba(217,119,6,0.12)",  fg: "#7A4A05", chip: "#D97706", chipFg: "#FFF8EE" },
  ok:       { bar: "#31694D", soft: "rgba(74,130,101,0.10)", fg: "#214635", chip: "#31694D", chipFg: "#F4FBF6" },
};

/* ════════════════════════════════════════════════════════════════════
   Direction A — Numbers First
   Big numeric (% or "OUT" or "3 DAYS") is the headline. Item name
   secondary. Status carried by left-edge color bar + giant number.
   Roughly 4 rows visible. Best for stock-check at a glance.
   ════════════════════════════════════════════════════════════════════ */
const NumbersFirstRow = ({ item }) => {
  const c = STATUS_INK[item.status];
  return (
    <div style={{
      display: "flex", alignItems: "stretch", gap: 0,
      background: "var(--paper-50)", borderRadius: 14,
      boxShadow: "var(--shadow-ambient-sm)",
      overflow: "hidden", minHeight: 96,
    }}>
      <div style={{ width: 6, background: c.bar, flexShrink: 0 }}/>
      <div style={{
        width: 116, background: c.soft, color: c.fg,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "10px 6px", flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: item.bigLabel.length > 4 ? 22 : 30, lineHeight: 1,
          letterSpacing: "-0.5px",
          fontVariantNumeric: "tabular-nums",
        }}>{item.bigLabel}</div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10,
          letterSpacing: "0.8px", marginTop: 6, opacity: 0.75,
        }}>{item.statusLabel}</div>
      </div>
      <div style={{
        flex: 1, padding: "12px 14px",
        display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0,
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17,
          color: "var(--ink-900)", lineHeight: 1.2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{item.name}</div>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)",
          marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{item.loc}</div>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-700)",
          marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{item.sub}</div>
      </div>
    </div>
  );
};

const G_A_List = () => (
  <PhoneFrame>
    <div style={{ padding: "12px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", color: "var(--sage-700)" }}>HAYWIRE BAR</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, lineHeight: 1, color: "var(--ink-900)", marginTop: 4 }}>Inventory</div>
      </div>
      <button style={{
        height: 44, width: 44, borderRadius: 9999, border: "none",
        background: "var(--sage-700)", color: "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><IconPlus size={22} color="#fff"/></button>
    </div>
    {/* Status snapshot — three loud counters */}
    <div style={{ padding: "10px 20px 4px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {[
        { n: "4",  l: "OUT",      c: STATUS_INK.out },
        { n: "12", l: "LOW",      c: STATUS_INK.low },
        { n: "3",  l: "USE SOON", c: STATUS_INK.expiring },
      ].map((s, i) => (
        <button key={i} style={{
          background: s.c.soft, color: s.c.fg, border: "none", cursor: "pointer",
          borderRadius: 12, padding: "10px 8px", textAlign: "left",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.n}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10, letterSpacing: "0.8px", marginTop: 4 }}>{s.l}</div>
        </button>
      ))}
    </div>
    <div style={{ padding: "8px 20px" }}>
      <SearchBar value="" onChange={() => {}} placeholder="Search 247 items…"/>
    </div>
    <div style={{ padding: "0 20px 8px", display: "flex", gap: 6, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", color: "var(--ink-600)" }}>
      ATTENTION FIRST · 19
    </div>
    <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
      {G_ITEMS.slice(0, 4).map((it, i) => <NumbersFirstRow key={i} item={it}/>)}
    </div>
    <BottomNav active="inventory"/>
  </PhoneFrame>
);

/* ── A · Adding Inventory cascade — same numeric-loud language ── */
const G_A_Restock = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Restock"/>
    <ScreenBody>
      <div style={{
        background: STATUS_INK.low.soft, borderRadius: 16, padding: "16px 18px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{ width: 72, height: 72, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>🥄</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, lineHeight: 1, color: STATUS_INK.low.fg, fontVariantNumeric: "tabular-nums" }}>25%</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", color: STATUS_INK.low.fg, marginTop: 4 }}>LOW · GROUND CINNAMON</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-700)", marginTop: 3 }}>McCormick · 2.37 oz · exp. May 2027</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.8px", color: "var(--ink-600)", marginBottom: 10 }}>HOW MANY ARE YOU ADDING?</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "12px 0" }}>
          <button style={{ width: 56, height: 56, borderRadius: 9999, border: "2px solid var(--paper-300)", background: "var(--paper-50)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink-900)", cursor: "pointer" }}>−</button>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 72, lineHeight: 1, color: "var(--ink-900)", minWidth: 90, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>1</div>
          <button style={{ width: 56, height: 56, borderRadius: 9999, border: "none", background: "var(--sage-700)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, cursor: "pointer" }}>+</button>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", textAlign: "center" }}>jar · 2.37 oz</div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.8px", color: "var(--ink-600)", marginBottom: 10 }}>NEW EXPIRY</div>
        <div style={{
          background: "var(--paper-50)", borderRadius: 14, padding: "16px 18px",
          border: "2px solid var(--paper-300)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink-900)" }}>Apr 2028</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)", textAlign: "right" }}>tap to change<br/>≈ 2 yrs out</div>
        </div>
      </div>
    </ScreenBody>
    <CtaTray>
      <button style={{
        height: 60, borderRadius: 14, border: "none", cursor: "pointer",
        background: "var(--sage-700)", color: "#fff",
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20,
      }}>Confirm restock</button>
    </CtaTray>
  </PhoneFrame>
);

/* ── A · Tree editor in numeric-loud language ── */
const G_A_TreeEditor = () => {
  const rows = [
    { eyebrow: "AREA",        name: "Kitchen",     count: 84,  depth: 0, glyph: "🏷" },
    { eyebrow: "ZONE",        name: "Back",        count: 52,  depth: 1, glyph: "📍" },
    { eyebrow: "SECTION",     name: "Above",       count: 28,  depth: 2, glyph: "📐", focused: true },
    { eyebrow: "SUB-SECTION", name: "Cabinet 1",   count: 14,  depth: 3, glyph: "🔩" },
    { eyebrow: "CONTAINER",   name: "Spice Rack",  count: 14,  depth: 4, glyph: "📦" },
    { eyebrow: "SHELF",       name: "Shelf 1",     count: 9,   depth: 5, glyph: "📏" },
    { eyebrow: "AREA",        name: "Pantry",      count: 67,  depth: 0, glyph: "🏷" },
    { eyebrow: "AREA",        name: "Bar",         count: 96,  depth: 0, glyph: "🏷" },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Spaces"/>
      <div style={{ padding: "0 20px 10px" }}>
        <SearchBar value="" onChange={() => {}} placeholder="Search 247 spaces…"/>
      </div>
      <ScreenBody style={{ paddingTop: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12,
              background: r.focused ? "rgba(74,130,101,0.10)" : "var(--paper-50)",
              border: r.focused ? "2px solid var(--sage-700)" : "1px solid transparent",
              marginLeft: r.depth * 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: r.focused ? "var(--sage-700)" : "var(--paper-200)",
                color: r.focused ? "#fff" : "var(--ink-900)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
              }}>{r.glyph}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 9, letterSpacing: "0.8px", color: "var(--ink-600)" }}>{r.eyebrow}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-900)", lineHeight: 1.2, marginTop: 1 }}>{r.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink-900)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{r.count}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 9, letterSpacing: "0.8px", color: "var(--ink-500)", marginTop: 3 }}>ITEMS</div>
              </div>
            </div>
          ))}
        </div>
      </ScreenBody>
      <CtaTray light>
        <button style={{
          height: 56, borderRadius: 14, border: "none", cursor: "pointer",
          background: "var(--sage-700)", color: "#fff",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18,
        }}>+ Add inside Cabinet 1</button>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ════════════════════════════════════════════════════════════════════
   Direction B — Status Tiles
   2-column grid. Each tile is a chunky card with status-tinted bg, big
   glyph, and a single status hero. Designed for tablet & cross-room
   recognition. Trades scanability of a list for instant pattern reading.
   ════════════════════════════════════════════════════════════════════ */
const StatusTile = ({ item }) => {
  const c = STATUS_INK[item.status];
  return (
    <div style={{
      background: c.soft, borderRadius: 18, padding: "14px 14px 16px",
      border: `2px solid ${c.bar}22`,
      display: "flex", flexDirection: "column", gap: 6,
      minHeight: 178, position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "rgba(255,255,255,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>{item.glyph}</div>
        <span style={{
          background: c.chip, color: c.chipFg,
          padding: "4px 10px", borderRadius: 9999,
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 10, letterSpacing: "0.8px",
        }}>{item.statusLabel}</span>
      </div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: item.bigLabel.length > 4 ? 28 : 40,
        lineHeight: 1, color: c.fg, marginTop: 4,
        fontVariantNumeric: "tabular-nums", letterSpacing: "-0.6px",
      }}>{item.bigLabel}</div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
        color: "var(--ink-900)", lineHeight: 1.2, marginTop: "auto",
      }}>{item.name}</div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-700)",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{item.loc}</div>
    </div>
  );
};

const G_B_List = () => (
  <PhoneFrame>
    <div style={{ padding: "12px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", color: "var(--sage-700)" }}>HAYWIRE BAR · 247</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, lineHeight: 1.1, color: "var(--ink-900)", marginTop: 2 }}>Needs you</div>
      </div>
      <button style={{ height: 44, padding: "0 16px", borderRadius: 9999, border: "none", background: "var(--sage-700)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
        <IconPlus size={18} color="#fff"/> Add
      </button>
    </div>
    <div style={{ padding: "10px 20px 6px", display: "flex", gap: 6, overflowX: "auto" }}>
      <Chip selected>All · 19</Chip>
      <Chip>Out · 4</Chip>
      <Chip>Low · 12</Chip>
      <Chip>Soon · 3</Chip>
    </div>
    <ScreenBody style={{ paddingTop: 4 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {G_ITEMS.map((it, i) => <StatusTile key={i} item={it}/>)}
      </div>
    </ScreenBody>
    <BottomNav active="inventory"/>
  </PhoneFrame>
);

const G_B_AddSearch = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Add item" right={<button style={{ background: "var(--sage-700)", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 9999, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12 }}>SCAN</button>}/>
    <div style={{ padding: "0 20px 12px" }}>
      <SearchBar value="cinnamon" onChange={() => {}} placeholder="Search products…"/>
    </div>
    <ScreenBody style={{ paddingTop: 0 }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.8px", color: "var(--ink-600)" }}>4 MATCHES</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { name: "Ground Cinnamon", brand: "McCormick", size: "2.37 oz", img: "🥄", chip: "IN STOCK · 2", chipColor: STATUS_INK.ok },
          { name: "Saigon Cinnamon", brand: "Frontier",  size: "1.74 oz", img: "🥄" },
          { name: "Vietnamese",      brand: "Penzeys",   size: "2 oz",    img: "🥄" },
          { name: "Cinnamon Sticks", brand: "Spice Is.", size: "1.5 oz",  img: "🌿" },
        ].map((p, i) => (
          <button key={i} style={{
            background: "var(--paper-50)", borderRadius: 16, padding: "14px 12px",
            border: "1px solid var(--paper-300)", textAlign: "left", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 8, minHeight: 168,
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{p.img}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)", lineHeight: 1.2 }}>{p.name}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)" }}>{p.brand} · {p.size}</div>
            {p.chip && (
              <span style={{ marginTop: "auto", alignSelf: "flex-start", background: p.chipColor.chip, color: p.chipColor.chipFg, padding: "3px 8px", borderRadius: 9999, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 9, letterSpacing: "0.8px" }}>{p.chip}</span>
            )}
          </button>
        ))}
        <button style={{
          gridColumn: "1 / -1", borderRadius: 16, padding: "16px 14px",
          border: "2px dashed var(--paper-300)", background: "transparent",
          display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--sage-700)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><IconPlus size={20} color="#fff"/></div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)" }}>Create custom</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>Add to your crew's catalog</div>
          </div>
        </button>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

const G_B_Spaces = () => {
  const tiles = [
    { name: "Kitchen",  count: 84, glyph: "🍳", soft: "rgba(74,130,101,0.10)", fg: "#214635" },
    { name: "Bar",      count: 96, glyph: "🍸", soft: "rgba(74,130,101,0.10)", fg: "#214635" },
    { name: "Pantry",   count: 67, glyph: "🥫", soft: "rgba(217,119,6,0.10)",  fg: "#7A4A05" },
    { name: "Fridge",   count: 38, glyph: "🥶", soft: "rgba(37,99,235,0.08)",  fg: "#1E3F94" },
    { name: "Storage",  count: 22, glyph: "📦", soft: "var(--paper-200)",      fg: "var(--ink-900)" },
    { name: "Bathroom", count: 12, glyph: "🧼", soft: "var(--paper-200)",      fg: "var(--ink-900)" },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Spaces"/>
      <div style={{ padding: "0 20px 10px" }}>
        <SearchBar value="" onChange={() => {}} placeholder="Search spaces…"/>
      </div>
      <ScreenBody style={{ paddingTop: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.8px", color: "var(--ink-600)" }}>HAYWIRE BAR · 6 AREAS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {tiles.map((t, i) => (
            <button key={i} style={{
              background: t.soft, color: t.fg, borderRadius: 18, padding: 14,
              border: "none", textAlign: "left", cursor: "pointer", minHeight: 138,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div style={{ fontSize: 36 }}>{t.glyph}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: t.fg, lineHeight: 1 }}>{t.name}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, marginTop: 6, opacity: 0.75 }}>
                  <span style={{ fontSize: 18, fontVariantNumeric: "tabular-nums" }}>{t.count}</span> ITEMS
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScreenBody>
      <CtaTray light>
        <button style={{
          height: 56, borderRadius: 14, border: "none", cursor: "pointer",
          background: "var(--sage-700)", color: "#fff",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18,
        }}>+ New area</button>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ════════════════════════════════════════════════════════════════════
   Direction C — Traffic-Light List
   Familiar single-row list, but every row is hero-sized: 84px tall, name
   in 18px, fill-bar is the dominant visual. Status carried by a colored
   LED + the bar fill. Closest to the original; lowest learning curve.
   ════════════════════════════════════════════════════════════════════ */
const TrafficRow = ({ item }) => {
  const c = STATUS_INK[item.status];
  return (
    <div style={{
      background: "var(--paper-50)", borderRadius: 14, padding: "14px 16px",
      boxShadow: "var(--shadow-ambient-sm)",
      display: "flex", alignItems: "center", gap: 14, minHeight: 88,
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 9999, background: c.bar,
        boxShadow: `0 0 12px ${c.bar}66`, flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10,
        }}>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
            color: "var(--ink-900)", lineHeight: 1.1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{item.name}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18,
            color: c.fg, fontVariantNumeric: "tabular-nums", flexShrink: 0,
          }}>{item.bigLabel}</div>
        </div>
        <div style={{
          height: 6, borderRadius: 9999, background: "var(--paper-250)",
          marginTop: 8, overflow: "hidden",
        }}>
          <div style={{ width: `${item.pct}%`, height: "100%", background: c.bar, borderRadius: 9999 }}/>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 6, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)",
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{item.loc}</span>
          <span style={{ flexShrink: 0, marginLeft: 10 }}>{item.expiry}</span>
        </div>
      </div>
    </div>
  );
};

const G_C_List = () => (
  <PhoneFrame>
    <div style={{ padding: "12px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", color: "var(--sage-700)" }}>HAYWIRE BAR</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, lineHeight: 1.1, color: "var(--ink-900)", marginTop: 2 }}>Inventory · 247</div>
      </div>
      <button style={{ height: 44, width: 44, borderRadius: 9999, border: "none", background: "var(--sage-700)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><IconPlus size={22} color="#fff"/></button>
    </div>
    <div style={{ padding: "8px 20px" }}>
      <SearchBar value="" onChange={() => {}} placeholder="Search…"/>
    </div>
    <div style={{ padding: "0 20px 8px", display: "flex", gap: 6, overflowX: "auto" }}>
      <Chip selected>All · 247</Chip>
      <Chip>Out · 4</Chip>
      <Chip>Low · 12</Chip>
      <Chip>Soon · 3</Chip>
    </div>
    <ScreenBody style={{ paddingTop: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {G_ITEMS.slice(0, 5).map((it, i) => <TrafficRow key={i} item={it}/>)}
      </div>
    </ScreenBody>
    <BottomNav active="inventory"/>
  </PhoneFrame>
);

const G_C_Details = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Add to inventory" right={<span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: "var(--sage-700)", letterSpacing: "0.8px" }}>2 / 2</span>}/>
    <ScreenBody>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🥄</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink-900)", lineHeight: 1.1 }}>Ground Cinnamon</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 4 }}>McCormick · 2.37 oz</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.8px", color: "var(--ink-600)", marginBottom: 8 }}>WHERE</div>
        <button style={{ width: "100%", border: "2px solid var(--sage-700)", borderRadius: 14, background: "rgba(74,130,101,0.06)", padding: "14px 16px", textAlign: "left", cursor: "pointer" }}>
          <PathCrumb parts={["Bar", "Back", "Above", "Spice Rack", "Shelf 1"]}/>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink-900)", marginTop: 6 }}>Shelf 1</div>
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "var(--paper-50)", border: "2px solid var(--paper-300)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10, letterSpacing: "0.8px", color: "var(--ink-600)" }}>QTY</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink-900)", marginTop: 2 }}>1</div>
        </div>
        <div style={{ flex: 2, background: "var(--paper-50)", border: "2px solid var(--paper-300)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10, letterSpacing: "0.8px", color: "var(--ink-600)" }}>EXPIRY</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink-900)", marginTop: 2 }}>May 2027</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.8px", color: "var(--ink-600)", marginBottom: 8 }}>FILL LEVEL</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Sealed", "Full", "¾", "½", "¼", "Empty"].map((l, i) => (
            <button key={i} style={{
              flex: 1, padding: "12px 4px", borderRadius: 10,
              background: i === 0 ? "var(--sage-700)" : "var(--paper-100)",
              color: i === 0 ? "#fff" : "var(--ink-900)",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
            }}>{l}</button>
          ))}
        </div>
      </div>
    </ScreenBody>
    <CtaTray>
      <button style={{
        height: 60, borderRadius: 14, border: "none", cursor: "pointer",
        background: "var(--sage-700)", color: "#fff",
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20,
      }}>Add to inventory</button>
    </CtaTray>
  </PhoneFrame>
);

const G_C_Spaces = () => {
  const rows = [
    { name: "Bar",      count: 96, attn: 8, glyph: "🍸" },
    { name: "Kitchen",  count: 84, attn: 5, glyph: "🍳" },
    { name: "Pantry",   count: 67, attn: 4, glyph: "🥫" },
    { name: "Fridge",   count: 38, attn: 2, glyph: "🥶" },
    { name: "Storage",  count: 22, attn: 0, glyph: "📦" },
    { name: "Bathroom", count: 12, attn: 0, glyph: "🧼" },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Spaces"/>
      <div style={{ padding: "0 20px 10px" }}>
        <SearchBar value="" onChange={() => {}} placeholder="Search…"/>
      </div>
      <ScreenBody style={{ paddingTop: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((r, i) => (
            <button key={i} style={{
              background: "var(--paper-50)", borderRadius: 14, padding: "14px 16px",
              border: "1px solid var(--paper-300)", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 14, minHeight: 76,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{r.glyph}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink-900)", lineHeight: 1.1 }}>{r.name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                  {r.count} items
                  {r.attn > 0 && <span style={{ color: STATUS_INK.low.fg, fontWeight: 700, marginLeft: 8 }}>· {r.attn} need attention</span>}
                </div>
              </div>
              {r.attn > 0 && (
                <span style={{
                  width: 32, height: 32, borderRadius: 9999,
                  background: STATUS_INK.low.chip, color: STATUS_INK.low.chipFg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14,
                  fontVariantNumeric: "tabular-nums",
                }}>{r.attn}</span>
              )}
              <IconChevronRight size={20} color="var(--ink-400)"/>
            </button>
          ))}
        </div>
      </ScreenBody>
    </PhoneFrame>
  );
};

Object.assign(window, {
  G_A_List, G_A_Restock, G_A_TreeEditor,
  G_B_List, G_B_AddSearch, G_B_Spaces,
  G_C_List, G_C_Details, G_C_Spaces,
});
