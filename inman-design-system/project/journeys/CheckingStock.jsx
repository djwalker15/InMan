// Checking Stock journey screens.

const stockItems = [
  { name: "Ground Cinnamon", brand: "McCormick · 2.37 oz", glyph: "🥄", loc: "Cabinet 1 › Spice Rack", status: "low", statusLabel: "Low · 25%", expiry: "May 2027" },
  { name: "Vanilla Extract", brand: "Nielsen-Massey · 4 oz", glyph: "🍶", loc: "Cabinet 1 › Spice Rack", status: "ok", statusLabel: "Sealed", expiry: "Jan 2028" },
  { name: "Olive Oil", brand: "Frantoia · 750 ml", glyph: "🫒", loc: "Pantry › Center › Shelf 2", status: "ok", statusLabel: "75% full", expiry: "Mar 2026" },
  { name: "Whole Milk", brand: "Straus · 1 gal", glyph: "🥛", loc: "Fridge › Door", status: "exp", statusLabel: "Exp. tomorrow", expiry: "Apr 28, 2026" },
  { name: "Smoked Paprika", brand: "McCormick · 2.12 oz", glyph: "🌶", loc: "Cabinet 1 › Spice Rack", status: "ok", statusLabel: "Half full", expiry: "Aug 2027" },
  { name: "Yeast", brand: "Red Star · 4 oz", glyph: "🥖", loc: "Pantry › Top › Shelf 1", status: "out", statusLabel: "Out", expiry: "—" },
];

const StockRow = ({ item, expanded }) => (
  <div style={{ background: "var(--paper-50)", borderRadius: 12, boxShadow: "var(--shadow-ambient-sm)", overflow: "hidden" }}>
    <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.glyph}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-500)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.loc}</div>
      </div>
      <StatusPill kind={item.status}>{item.statusLabel}</StatusPill>
    </div>
    {expanded && (
      <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--paper-200)" }}>
        <div style={{ paddingTop: 12 }}>
          <KV label="Brand"  value={item.brand}/>
          <KV label="Location" value={item.loc}/>
          <KV label="Expiry" value={item.expiry}/>
          <KV label="Last seen" value="Today by Davontae"/>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <SecondaryButton>− Use some</SecondaryButton>
          <SecondaryButton>+ Restock</SecondaryButton>
          <PrimaryButton>Edit</PrimaryButton>
        </div>
      </div>
    )}
  </div>
);

/* ── 01 List ─────────────────────────────────────────────── */
const CS_List = () => (
  <PhoneFrame>
    <div style={{ padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div className="label-eyebrow" style={{ color: "var(--sage-700)" }}>WALKER HOME</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-900)" }}>Inventory</div>
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 9999, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconPlus size={20}/></div>
    </div>
    <div style={{ padding: "0 20px 8px" }}>
      <SearchBar value="" onChange={() => {}} placeholder="Search 247 items…"/>
    </div>
    <div style={{ padding: "0 20px 12px", display: "flex", gap: 6, overflowX: "auto" }}>
      <Chip selected>All · 247</Chip>
      <Chip>Low · 12</Chip>
      <Chip>Expiring · 3</Chip>
      <Chip>Out · 4</Chip>
    </div>
    <ScreenBody style={{ paddingTop: 0 }}>
      <div className="label-eyebrow">SORTED BY UPDATED</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stockItems.map((it, i) => <StockRow key={i} item={it}/>)}
      </div>
    </ScreenBody>
    <BottomNav active="inventory"/>
  </PhoneFrame>
);

/* ── 02 Inline expansion ──────────────────────────────────── */
const CS_Expanded = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Inventory"/>
    <div style={{ padding: "0 20px 12px" }}>
      <SearchBar value="cinnamon" onChange={() => {}}/>
    </div>
    <ScreenBody style={{ paddingTop: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <StockRow item={stockItems[0]} expanded/>
        <StockRow item={stockItems[1]}/>
        <StockRow item={stockItems[4]}/>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── 03 Filter sheet ──────────────────────────────────────── */
const CS_Filters = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Inventory"/>
    <div style={{ padding: "0 20px 12px", flex: 1, opacity: 0.5, filter: "blur(2px)" }}>
      <SearchBar value="" onChange={() => {}}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {stockItems.slice(0, 3).map((it, i) => <StockRow key={i} item={it}/>)}
      </div>
    </div>
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      background: "var(--paper-50)", borderTopLeftRadius: 24, borderTopRightRadius: 24,
      padding: "12px 24px 32px",
      boxShadow: "0 -8px 32px rgba(28,28,24,0.18)",
      display: "flex", flexDirection: "column", gap: 18,
    }}>
      <div style={{ width: 40, height: 4, borderRadius: 9999, background: "var(--paper-300)", margin: "8px auto 4px" }}/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="headline-md">Filter</div>
        <button style={{ background: "transparent", border: "none", color: "var(--sage-700)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>Reset</button>
      </div>
      <div>
        <div className="label-eyebrow" style={{ marginBottom: 8 }}>STATUS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Chip selected>Low</Chip>
          <Chip>Out</Chip>
          <Chip selected>Expiring soon</Chip>
          <Chip>Sealed</Chip>
        </div>
      </div>
      <div>
        <div className="label-eyebrow" style={{ marginBottom: 8 }}>LOCATION</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Chip selected>Kitchen</Chip>
          <Chip>Pantry</Chip>
          <Chip>Fridge</Chip>
          <Chip>Garage</Chip>
        </div>
      </div>
      <div>
        <div className="label-eyebrow" style={{ marginBottom: 8 }}>ADDED BY</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Chip>Anyone</Chip>
          <Chip selected>Me</Chip>
          <Chip>Davontae</Chip>
          <Chip>Kiosk</Chip>
        </div>
      </div>
      <PrimaryButton arrow>Show 18 results</PrimaryButton>
    </div>
  </PhoneFrame>
);

/* ── 04 Browse by space ──────────────────────────────────── */
const CS_BySpace = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Browse spaces"/>
    <ScreenBody>
      <Segmented options={[{ label: "List", value: "list" }, { label: "Spaces", value: "spaces" }]} value="spaces"/>
      <Tree nodes={[
        { unit: "premises", name: "Walker Home" },
        { unit: "area", name: "Kitchen", depth: 1, focused: true },
      ]}/>
      <div className="label-eyebrow">INSIDE KITCHEN · 38 ITEMS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { name: "Back › Above", count: 14, glyph: "📍" },
          { name: "Back › Below", count: 8, glyph: "📍" },
          { name: "Back › Counter", count: 6, glyph: "📍" },
          { name: "Center › Island", count: 4, glyph: "📍" },
          { name: "Side › Drawer 1", count: 6, glyph: "📍" },
        ].map((g, i) => (
          <div key={i} style={{ background: "var(--paper-50)", borderRadius: 12, padding: 14, boxShadow: "var(--shadow-ambient-sm)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{g.glyph}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)" }}>{g.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>{g.count} items</div>
            </div>
            <IconChevronRight size={18} color="var(--ink-400)"/>
          </div>
        ))}
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── 05 Alerts summary ───────────────────────────────────── */
const CS_Alerts = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Alerts" right={<Chip variant="error">3</Chip>}/>
    <ScreenBody>
      <Alert kind="error" title="1 expires tomorrow">
        Whole Milk · Straus · expires Apr 28
      </Alert>
      <div className="label-eyebrow">EXPIRING THIS WEEK · 3</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[stockItems[3]].map((it, i) => <StockRow key={i} item={it}/>)}
        <StockRow item={{ ...stockItems[2], status: "exp", statusLabel: "Exp. in 3 days" }}/>
      </div>
      <div className="label-eyebrow" style={{ marginTop: 8 }}>LOW STOCK · 12</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[stockItems[0], stockItems[5]].map((it, i) => <StockRow key={i} item={it}/>)}
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── 06 Empty / no results ───────────────────────────────── */
const CS_Empty = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Inventory"/>
    <div style={{ padding: "0 20px 12px" }}>
      <SearchBar value="quinoa" onChange={() => {}}/>
    </div>
    <ScreenBody>
      <EmptyState
        icon={<IconBox size={32}/>}
        title="No matches for &ldquo;quinoa&rdquo;"
        body="Try a different word, or add it to your inventory."
        action={<PrimaryButton>+ Add quinoa</PrimaryButton>}
      />
      <div className="label-eyebrow">DID YOU MEAN</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Chip>Couscous</Chip>
        <Chip>Rice</Chip>
        <Chip>Farro</Chip>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

Object.assign(window, { CS_List, CS_Expanded, CS_Filters, CS_BySpace, CS_Alerts, CS_Empty, StockRow });
