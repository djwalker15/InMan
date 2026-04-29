// Adding Inventory journey screens.

/* ── 01 Search products (entry) ───────────────────────────── */
const AI_ProductSearch = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Add item" right={
      <button style={{ background: "transparent", border: "none", color: "var(--sage-700)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Scan</button>
    }/>
    <div style={{ padding: "0 20px 12px" }}>
      <SearchBar value="cinnamon" onChange={() => {}} placeholder="Search products…" autoFocus/>
    </div>
    <ScreenBody style={{ paddingTop: 0 }}>
      <Segmented options={[{ label: "All", value: "all" }, { label: "Catalog", value: "cat" }, { label: "My inventory", value: "mine" }]} value="all" onChange={() => {}}/>
      <div className="label-eyebrow">CATALOG MATCHES · 4</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { name: "Ground Cinnamon", brand: "McCormick", size: "2.37 oz", img: "🥄" },
          { name: "Cinnamon Sticks", brand: "Spice Islands", size: "1.5 oz", img: "🌿" },
          { name: "Saigon Cinnamon", brand: "Frontier Co-op", size: "1.74 oz", img: "🥄" },
          { name: "Vietnamese Cinnamon", brand: "Penzeys", size: "2 oz", img: "🥄" },
        ].map((p, i) => (
          <ProductRow key={i} {...p}/>
        ))}
      </div>
      <button style={{
        marginTop: 6, background: "transparent", border: "2px dashed var(--paper-300)",
        borderRadius: 12, padding: "16px 14px", textAlign: "left", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--sage-700)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><IconPlus size={18} color="#fff"/></div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)" }}>Can't find it? Create custom</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>Adds to your crew's catalog</div>
        </div>
      </button>
    </ScreenBody>
  </PhoneFrame>
);

const ProductRow = ({ name, brand, size, img, alreadyHave }) => (
  <div style={{
    background: "var(--paper-50)", borderRadius: 12, padding: 12,
    boxShadow: "var(--shadow-ambient-sm)",
    display: "flex", alignItems: "center", gap: 12,
  }}>
    <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{img}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>{brand} · {size}</div>
      {alreadyHave && <div style={{ marginTop: 4 }}><Chip variant="sage">In inventory · 2</Chip></div>}
    </div>
    <IconChevronRight size={20} color="var(--ink-400)"/>
  </div>
);

/* ── 02 Already in inventory match ─────────────────────────── */
const AI_ExistingMatch = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Already in inventory"/>
    <ScreenBody>
      <Alert kind="info" title="You already have this">
        Ground Cinnamon · McCormick · 2.37 oz is at 2 locations. You can restock an existing one or add a new one.
      </Alert>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { loc: "Kitchen › Back › Above › Cabinet 1 › Spice Rack › Shelf 1", qty: "1 jar · 65% full", expiry: "exp. May 2027" },
          { loc: "Pantry › Center › Shelf 3", qty: "1 jar · sealed", expiry: "exp. Jul 2027" },
        ].map((r, i) => (
          <div key={i} style={{ background: "var(--paper-50)", borderRadius: 12, padding: 14, boxShadow: "var(--shadow-ambient-sm)" }}>
            <PathCrumb parts={r.loc.split(" › ")}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)" }}>{r.qty}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>{r.expiry}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <SecondaryButton>Restock this</SecondaryButton>
              <PrimaryButton>+ Quantity</PrimaryButton>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
        <TextButton>Add as new instance instead</TextButton>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── 03 Create custom product ──────────────────────────────── */
const AI_CreateCustom = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Create product"/>
    <ScreenBody>
      <Alert kind="info" title="This adds to your crew's catalog">
        Custom products are private to your crew. You can edit them later.
      </Alert>
      <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, height: 140 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconCamera size={24}/></div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-700)" }}>Add photo</div>
      </div>
      <Field label="PRODUCT NAME *" value="Homemade chili oil" onChange={() => {}}/>
      <Field label="BRAND" value="" onChange={() => {}} placeholder="Optional"/>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="SIZE" value="500" onChange={() => {}}/></div>
        <div style={{ flex: 1 }}><Field label="UNIT" value="ml" onChange={() => {}}/></div>
      </div>
      <Field label="CATEGORY" value="Pantry › Condiments" onChange={() => {}}/>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton arrow>Continue to details</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── 04 Inventory details (the second of the two-step add) ─── */
const AI_Details = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Add to inventory" right={<span className="label-eyebrow" style={{ color: "var(--sage-700)" }}>STEP 2 OF 2</span>}/>
    <ScreenBody>
      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "0 0 4px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🥄</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)" }}>Ground Cinnamon</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>McCormick · 2.37 oz</div>
        </div>
      </div>
      <div className="label-eyebrow">WHERE</div>
      <button style={{
        width: "100%", textAlign: "left", border: "2px solid var(--paper-300)",
        borderRadius: 12, padding: 14, background: "var(--paper-50)", cursor: "pointer",
      }}>
        <PathCrumb parts={["Walker Home", "Kitchen", "Back", "Above", "Cabinet 1", "Spice Rack", "Shelf 1"]}/>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)", marginTop: 6 }}>Shelf 1</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--sage-700)", marginTop: 2 }}>Tap to change location</div>
      </button>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="QUANTITY" value="1" onChange={() => {}}/></div>
        <div style={{ flex: 1 }}><Field label="EXPIRY" value="May 2027" onChange={() => {}}/></div>
      </div>
      <div className="label-eyebrow">FILL LEVEL</div>
      <div style={{ display: "flex", gap: 6 }}>
        {["Sealed", "Full", "¾", "½", "¼", "Empty"].map((l, i) => (
          <Chip key={i} selected={i === 0}>{l}</Chip>
        ))}
      </div>
      <Field label="NOTES" value="" onChange={() => {}} placeholder="Optional — for the crew" multiline/>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton arrow>Add to inventory</PrimaryButton>
      <TextButton>Add &amp; add another</TextButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── 05 Stay-in-flow (toast + reset) ─────────────────────── */
const AI_StayInFlow = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Add another"/>
    <ScreenBody>
      <Alert kind="success" title="Added — Ground Cinnamon">
        Saved to Cabinet 1 › Spice Rack › Shelf 1. <b>3 items</b> added in this session.
      </Alert>
      <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 16 }}>
        <div className="label-eyebrow" style={{ marginBottom: 8 }}>STAYING IN</div>
        <PathCrumb parts={["Kitchen", "Back", "Above", "Cabinet 1", "Spice Rack", "Shelf 1"]}/>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-700)", marginTop: 8 }}>
          Next item will land here too. Tap to change location.
        </div>
      </div>
      <SearchBar value="" onChange={() => {}} placeholder="Search next product…"/>
      <div className="label-eyebrow">RECENTLY ADDED IN THIS SPOT</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ProductRow name="Smoked Paprika" brand="McCormick" size="2.12 oz" img="🌶"/>
        <ProductRow name="Cumin Seeds" brand="Spice Islands" size="1.6 oz" img="🌿"/>
      </div>
    </ScreenBody>
    <CtaTray light>
      <SecondaryButton>Done — I'm finished</SecondaryButton>
    </CtaTray>
    {/* Floating toast */}
    <div style={{
      position: "absolute", left: 16, right: 16, bottom: 100,
      background: "var(--ink-900)", color: "#fff", borderRadius: 12,
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    }}>
      <IconCheck size={18} color="#fff"/>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 13, flex: 1 }}>3 items added in 2 minutes</span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--sage-300, #A8C9B5)" }}>UNDO</span>
    </div>
  </PhoneFrame>
);

/* ── 06 Restock sub-flow ─────────────────────────────────── */
const AI_Restock = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Restock"/>
    <ScreenBody>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🥄</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)" }}>Ground Cinnamon</div>
          <PathCrumb parts={["Cabinet 1", "Spice Rack", "Shelf 1"]}/>
        </div>
      </div>
      <Alert kind="warn" title="Currently 25% full · expires May 2027">
        Adding fresh stock. The old jar's expiry stays attached to its remaining contents.
      </Alert>
      <div className="label-eyebrow">HOW MUCH ARE YOU ADDING?</div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="ADDITIONAL QTY" value="1" onChange={() => {}}/></div>
        <div style={{ flex: 1 }}><Field label="NEW EXPIRY" value="Apr 2028" onChange={() => {}}/></div>
      </div>
      <div className="label-eyebrow">WHAT TO DO WITH THE EXISTING</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <RadioCard title="Combine — same jar" body="Treat as one. Use the newer expiry. Best when refilling a single container." selected/>
        <RadioCard title="Keep as separate batch" body="Two jars side-by-side. Track each expiry independently." />
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton arrow>Confirm restock</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── 07 Barcode scan ─────────────────────────────────────── */
const AI_Scan = () => (
  <div style={{ width: 390, height: 844, position: "relative", overflow: "hidden", background: "#0a0a0a" }}>
    {/* Camera viewport */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)" }}/>
    {/* Top bar */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "44px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button style={{ width: 36, height: 36, borderRadius: 9999, background: "rgba(0,0,0,0.5)", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}><IconBack size={20} color="#fff"/></button>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#fff" }}>Scan barcode</div>
      <button style={{ width: 36, height: 36, borderRadius: 9999, background: "rgba(0,0,0,0.5)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>⚡</button>
    </div>
    {/* Reticle */}
    <div style={{ position: "absolute", top: "38%", left: "10%", right: "10%", height: 200, border: "2px solid rgba(255,255,255,0.6)", borderRadius: 16 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "var(--sage-300, #A8C9B5)", boxShadow: "0 0 8px rgba(168,201,181,0.8)" }}/>
    </div>
    {/* Caption */}
    <div style={{ position: "absolute", bottom: 200, left: 0, right: 0, textAlign: "center", color: "#fff" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Hold steady</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, opacity: 0.8, marginTop: 4 }}>Detecting barcode…</div>
    </div>
    {/* Bottom sheet preview after detection */}
    <div style={{
      position: "absolute", left: 16, right: 16, bottom: 32,
      background: "var(--paper-50)", borderRadius: 16, padding: 14,
      display: "flex", alignItems: "center", gap: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🥄</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)" }}>Ground Cinnamon</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>McCormick · 2.37 oz</div>
      </div>
      <PrimaryButton>Add</PrimaryButton>
    </div>
  </div>
);

/* ── 08 Bulk import: column mapping ───────────────────────── */
const AI_BulkMapping = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Bulk import" right={<span className="label-eyebrow" style={{ color: "var(--sage-700)" }}>2 / 4</span>}/>
    <ScreenBody>
      <SectionTitle title="Map your columns" body="We detected 47 rows in inventory.csv. Confirm what each column means."/>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { col: "name", sample: "Ground Cinnamon, Vanilla Extract…", mapped: "Product name", confident: true },
          { col: "brand", sample: "McCormick, Penzeys…", mapped: "Brand", confident: true },
          { col: "qty", sample: "1, 2, 3…", mapped: "Quantity", confident: true },
          { col: "loc", sample: "Cabinet 1, Pantry…", mapped: "Location (will resolve)", confident: false },
          { col: "exp", sample: "5/27, 7/2027…", mapped: "Expiry date", confident: true },
          { col: "notes", sample: "—", mapped: "Skip", confident: false, skipped: true },
        ].map((c, i) => (
          <div key={i} style={{ background: "var(--paper-50)", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, opacity: c.skipped ? 0.55 : 1 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, fontSize: 13, color: "var(--ink-900)" }}>{c.col}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-500)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.sample}</div>
            </div>
            <IconChevronRight size={16} color="var(--ink-400)"/>
            <div style={{ flex: 1.2, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: c.skipped ? "var(--ink-500)" : "var(--ink-900)" }}>{c.mapped}</div>
              {!c.confident && !c.skipped && <Chip variant="warn">Review</Chip>}
            </div>
          </div>
        ))}
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton arrow>Preview &amp; import</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── 09 Quick add (PIN/kiosk mode) ────────────────────────── */
const AI_Quick = () => (
  <PhoneFrame>
    <div style={{ height: 56, padding: "0 20px", background: "var(--sage-700)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>Quick add</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, opacity: 0.85 }}>Walker Home · Kiosk</div>
      </div>
      <button style={{ background: "rgba(255,255,255,0.16)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 9999, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12 }}>EXIT</button>
    </div>
    <ScreenBody>
      <SectionTitle title="What did you just put away?" body="Anyone can use this. No login needed."/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { glyph: "🥛", label: "Milk" },
          { glyph: "🥚", label: "Eggs" },
          { glyph: "🍞", label: "Bread" },
          { glyph: "🧀", label: "Cheese" },
          { glyph: "🍅", label: "Tomatoes" },
          { glyph: "📷", label: "Scan" },
        ].map((q, i) => (
          <button key={i} style={{
            border: "none", background: "var(--paper-100)", borderRadius: 14, padding: "20px 12px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer",
            boxShadow: "var(--shadow-ambient-sm)",
          }}>
            <div style={{ fontSize: 32 }}>{q.glyph}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)" }}>{q.label}</div>
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <TextButton>Search instead</TextButton>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

Object.assign(window, { AI_ProductSearch, AI_ExistingMatch, AI_CreateCustom, AI_Details, AI_StayInFlow, AI_Restock, AI_Scan, AI_BulkMapping, AI_Quick, ProductRow });
