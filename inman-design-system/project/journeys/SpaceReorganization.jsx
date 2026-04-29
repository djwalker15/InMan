// Space Reorganization journey screens — entry mode, rename, move w/ preview, merge, split, delete.

/* ── RG_Mode ── Reorganize mode entry: tree of spaces in edit mode */
const RG_Mode = () => (
  <PhoneFrame>
    <AppBar
      title="Reorganize spaces"
      onBack={() => {}}
      right={<button style={{ padding: "6px 12px", borderRadius: 9999, background: "var(--sage-700)", color: "#fff", border: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Done</button>}
    />
    <ScreenBody>
      <div style={{ background: "rgba(74,130,101,0.08)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <IconInfo size={16} color="var(--sage-700)"/>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-700)" }}>Drag to reorder · long-press for options</div>
      </div>

      <Tree
        nodes={[
          { unit: "premises", name: "Walker House", focused: false },
          { unit: "area", name: "Kitchen", depth: 1 },
          { unit: "zone", name: "Pantry", depth: 2 },
          { unit: "sub_section", name: "Cabinet 1", depth: 3, focused: true },
          { unit: "shelf", name: "Top shelf", depth: 4 },
          { unit: "shelf", name: "Middle shelf", depth: 4 },
          { unit: "shelf", name: "Bottom shelf", depth: 4 },
          { unit: "sub_section", name: "Cabinet 2", depth: 3 },
          { unit: "zone", name: "Fridge", depth: 2 },
        ]}
      />

      <div style={{ marginTop: 14, padding: 12, background: "var(--paper-100)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-700)" }}>1 selected · Cabinet 1</span>
        <button style={{ background: "transparent", border: "none", color: "var(--sage-700)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Clear</button>
      </div>
    </ScreenBody>
    <CtaTray light>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "0 4px" }}>
        {[
          { label: "Move",   icon: <IconChevronRight size={18}/> },
          { label: "Merge",  icon: <IconShare size={18}/> },
          { label: "Split",  icon: <IconBox size={18}/> },
          { label: "Rename", icon: <IconEdit size={18}/> },
          { label: "Reclass", icon: <IconFilter size={18}/> },
          { label: "Delete", icon: <IconDelete size={18}/>, danger: true },
        ].map((a) => (
          <button key={a.label} style={{
            padding: "10px 4px", borderRadius: 12, border: "1px solid var(--paper-300)",
            background: "var(--surface)", color: a.danger ? "var(--error)" : "var(--ink-900)",
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
          }}>
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </CtaTray>
  </PhoneFrame>
);

/* ── RG_Rename ── Inline rename with current path. ────────────── */
const RG_Rename = () => (
  <PhoneFrame>
    <AppBar title="Rename" onBack={() => {}}/>
    <ScreenBody>
      <SectionTitle eyebrow="Renaming"
        title="Cabinet 1"
        body="The new name applies everywhere this space appears — items, history, and reports."/>
      <div style={{ marginTop: 18 }}>
        <PathCrumb parts={["Walker House", "Kitchen", "Pantry", "Cabinet 1"]} color="var(--ink-500)"/>
      </div>
      <div style={{ marginTop: 18 }}>
        <Field label="New name" placeholder="Cabinet 1" value="Spice Cabinet"/>
      </div>
      <div style={{ marginTop: 14, padding: 12, background: "var(--paper-100)", borderRadius: 12, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", lineHeight: 1.6 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--ink-900)", marginBottom: 4 }}>What changes</div>
        Path becomes <span style={{ color: "var(--sage-700)", fontWeight: 600 }}>Walker House → Kitchen → Pantry → Spice Cabinet</span>.<br/>
        14 items, 23 historical Flows, and 2 active alerts will reflect the new name.
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton>Save name</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── RG_MovePreview ── Move with a preview panel. ────────────── */
const RG_MovePreview = () => (
  <PhoneFrame>
    <AppBar title="Move space" onBack={() => {}}/>
    <ScreenBody>
      <SectionTitle eyebrow="Moving"
        title="Spice Cabinet & 14 items"
        body="Pick a new parent. The whole subtree comes with it."/>

      <div style={{ marginTop: 16, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 6 }}>Current location</div>
      <div style={{ background: "var(--paper-100)", borderRadius: 12, padding: 12, marginBottom: 14 }}>
        <PathCrumb parts={["Walker House", "Kitchen", "Pantry"]}/>
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 6 }}>New parent</div>
      <div style={{ background: "rgba(74,130,101,0.08)", border: "1.5px solid var(--sage-700)", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <PathCrumb parts={["Walker House", "Kitchen", "Counter"]} color="var(--sage-700)"/>
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 6 }}>Preview · After move</div>
      <Tree
        nodes={[
          { unit: "premises", name: "Walker House" },
          { unit: "area", name: "Kitchen", depth: 1 },
          { unit: "zone", name: "Counter", depth: 2 },
          { unit: "sub_section", name: "Spice Cabinet", depth: 3, focused: true },
          { unit: "shelf", name: "Top shelf", depth: 4 },
          { unit: "shelf", name: "Middle shelf", depth: 4 },
          { unit: "shelf", name: "Bottom shelf", depth: 4 },
        ]}
      />

      <div style={{ marginTop: 14, padding: 10, background: "rgba(217,119,6,0.10)", borderRadius: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <IconAlert size={16} color="#A05A05"/>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#7A4504" }}>14 items will keep their home location — they'll be marked displaced until put back.</div>
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton>Move 4 spaces</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── RG_Merge ── Merge two spaces. ────────────────────────────── */
const RG_Merge = () => (
  <PhoneFrame>
    <AppBar title="Merge spaces" onBack={() => {}}/>
    <ScreenBody>
      <SectionTitle eyebrow="Merging two spaces"
        title="Combine items into one location"
        body="Items move to the destination. The source space is soft-deleted but its history stays linked."/>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 14 }}>
          <div className="label-eyebrow" style={{ marginBottom: 6 }}>Source · will be deleted</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(74,130,101,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sage-700)" }}><IconBox size={18}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)" }}>Old Spice Rack</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>Container · 8 items</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9999, background: "var(--sage-700)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconChevronDown size={18}/>
          </div>
        </div>

        <div style={{ background: "rgba(74,130,101,0.06)", border: "1.5px solid var(--sage-700)", borderRadius: 14, padding: 14 }}>
          <div className="label-eyebrow" style={{ marginBottom: 6, color: "var(--sage-700)" }}>Destination</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--sage-700)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><IconBox size={18}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)" }}>Spice Cabinet</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>Sub-section · 14 items → 22 after merge</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--paper-100)", borderRadius: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>Update home locations</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)" }}>Items currently homed in source get rehomed to destination</div>
          </div>
          <Toggle on={true}/>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 12, background: "rgba(217,119,6,0.10)", borderRadius: 12, fontFamily: "var(--font-body)", fontSize: 12, color: "#7A4504", lineHeight: 1.5 }}>
        2 items in <strong>Old Spice Rack</strong> share names with items already in <strong>Spice Cabinet</strong>. They'll keep separate records — review on the next step.
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton>Continue · review duplicates</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── RG_Split ── Split one space into two. ────────────────────── */
const RG_Split = () => (
  <PhoneFrame>
    <AppBar title="Split space" onBack={() => {}}/>
    <ScreenBody>
      <SectionTitle eyebrow="Splitting"
        title="Spice Cabinet (14 items)"
        body="Keep the original. Create a sibling. Drag items between them."/>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 12 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-900)" }}>Spice Cabinet</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--ink-500)", marginBottom: 8 }}>10 items</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Cumin", "Paprika", "Coriander", "Star anise", "Black pepper"].map((n) => (
              <div key={n} style={{ background: "var(--surface)", border: "1px solid var(--paper-300)", borderRadius: 8, padding: "6px 10px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-700)" }}>{n}</div>
            ))}
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-500)", textAlign: "center", padding: "4px 0" }}>+ 5 more</div>
          </div>
        </div>

        <div style={{ background: "rgba(74,130,101,0.06)", border: "1.5px dashed var(--sage-700)", borderRadius: 14, padding: 12 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--sage-700)" }}>Baking Cabinet</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--sage-700)", marginBottom: 8 }}>4 items · new</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Cinnamon", "Vanilla extract", "Nutmeg", "Cardamom"].map((n) => (
              <div key={n} style={{ background: "var(--surface)", border: "1px solid var(--sage-700)", borderRadius: 8, padding: "6px 10px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-900)" }}>{n}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Field label="Name for the new space" placeholder="Sibling name" value="Baking Cabinet"/>
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton>Split into two</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── RG_Delete ── Delete with orphan-handling choices. ────────── */
const RG_Delete = () => (
  <PhoneFrame>
    <AppBar title="Delete space" onBack={() => {}}/>
    <ScreenBody>
      <div style={{ background: "rgba(186,26,26,0.06)", border: "1.5px solid rgba(186,26,26,0.24)", borderRadius: 14, padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <IconDelete size={20} color="var(--error)"/>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--error)" }}>Delete "Old Spice Rack"</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-700)", marginTop: 2 }}>Container · 8 items inside</div>
          </div>
        </div>
      </div>

      <div className="label-eyebrow" style={{ marginBottom: 8, marginLeft: 4 }}>What happens to the 8 items?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { id: "parent", title: "Move to parent", sub: "Items go up one level — Pantry", on: true },
          { id: "specific", title: "Move to a specific space", sub: "Pick one destination for all 8" },
          { id: "perItem", title: "Decide per item", sub: "Review each one individually" },
          { id: "delete", title: "Soft-delete the items too", sub: "Keep flow history, mark as deleted", danger: true },
        ].map((opt) => (
          <div key={opt.id} style={{
            padding: 14, borderRadius: 12,
            border: opt.on ? "1.5px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
            background: opt.on ? "rgba(74,130,101,0.06)" : "var(--surface)",
            display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 9999, marginTop: 1,
              border: opt.on ? "6px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
              background: opt.on ? "var(--sage-700)" : "transparent",
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: opt.danger ? "var(--error)" : "var(--ink-900)" }}>{opt.title}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>{opt.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton style={{ background: "var(--error)" }}>Delete space</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

Object.assign(window, { RG_Mode, RG_Rename, RG_MovePreview, RG_Merge, RG_Split, RG_Delete });
