// Space Setup journey — 5 phases: Explainer → Premises → Guided Branch → Tree Editor → Templates.

/* ── Phase 1 — Explainer ──────────────────────────────────────── */
const SS1_Explainer = () => {
  const levels = [
    { unit: "premises",    name: "My House",    sub: "Top of your hierarchy" },
    { unit: "area",        name: "Kitchen",     sub: "A room or functional space" },
    { unit: "zone",        name: "Back Wall",   sub: "A region within the room" },
    { unit: "section",     name: "Above",       sub: "A position within the zone" },
    { unit: "sub_section", name: "Cabinet 1",   sub: "Fixed — bolted, built-in" },
    { unit: "container",   name: "Spice Rack",  sub: "Portable — you can move it" },
    { unit: "shelf",       name: "Shelf 1",     sub: "The deepest level" },
  ];
  return (
    <PhoneFrame>
      <AppBar onClose={() => {}} title="How spaces work"/>
      <ScreenBody>
        <SectionTitle eyebrow="STEP 1 OF 6" title="Seven levels, all optional" body="Use as many or as few as your space needs. The deeper you go, the easier it is to find a thing later."/>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
          {levels.map((l, i) => {
            const meta = UNIT_META[l.unit];
            const isPortable = l.unit === "container";
            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 4px",
                position: "relative",
                marginLeft: i * 6,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: meta.iconBg, color: meta.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>{meta.glyph}</div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10,
                      letterSpacing: "0.6px", color: "var(--ink-600)", textTransform: "uppercase",
                    }}>{meta.eyebrow}</span>
                    {l.unit === "sub_section" && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--ink-700)", background: "var(--paper-250)", padding: "1px 6px", borderRadius: 999 }}>FIXED</span>}
                    {isPortable && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "#A05A05", background: "rgba(217,119,6,0.14)", padding: "1px 6px", borderRadius: 999 }}>PORTABLE</span>}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)", marginTop: 2 }}>{l.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 1 }}>{l.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ScreenBody>
      <CtaTray>
        <PrimaryButton arrow>Got it, let's build</PrimaryButton>
        <TextButton>Skip — I know how this works</TextButton>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ── Phase 2 — Create Premises ────────────────────────────────── */
const SS2_Premises = () => {
  const [name, setName] = React.useState("Walker Home");
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Set up spaces" helpAction={() => {}}/>
      <ScreenBody>
        <ProgressBar step={1} of={5} label="STEP 1 OF 5"/>
        <SectionTitle title="What's the name of your place?" body="This is the top of your hierarchy. Everything else lives inside it."/>
        <Field label="PLACE NAME" value={name} onChange={setName} placeholder="My House" hint="Try “My House”, “The Apartment”, “Haywire Bar”, or “Lake House”."/>
        <div style={{ marginTop: 4 }}>
          <div className="label-eyebrow" style={{ marginBottom: 8 }}>YOUR TREE</div>
          <Tree nodes={name ? [{ unit: "premises", name, focused: true }] : []}/>
          {!name && (
            <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 24, textAlign: "center", color: "var(--ink-500)", fontSize: 13 }}>
              Empty for now — your first node appears as you type.
            </div>
          )}
        </div>
      </ScreenBody>
      <CtaTray>
        <PrimaryButton arrow>Confirm name</PrimaryButton>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ── Phase 3 — Guided Branch (mid-flow snapshot) ─────────────── */
// One canonical snapshot showing the prompt + chip suggestions + live tree.
const SS3_Guided = () => {
  const nodes = [
    { unit: "premises", name: "Walker Home" },
    { unit: "area", name: "Kitchen", depth: 1 },
    { unit: "zone", name: "Back", depth: 2 },
    { unit: "section", name: "Above", depth: 3, focused: true },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Set up spaces" helpAction={() => {}} right={<span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>Step 3</span>}/>
      <ScreenBody>
        <ProgressBar step={2} of={5} label="STEP 2 OF 5"/>
        <div style={{
          background: "var(--paper-100)", borderRadius: 14, padding: 16,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>{UNIT_META.section.glyph}</span>
            <span className="label-eyebrow" style={{ color: "var(--sage-700)" }}>ADD A SECTION</span>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, lineHeight: "24px", color: "var(--ink-900)" }}>
            Within Back, are there positions like above the counter, below it, or the countertop itself?
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-700)" }}>
            Sections are positional — above, below, top, front, back. They describe <i>where</i> within a zone.
          </div>
        </div>
        <Field label="SECTION NAME" value="Above" onChange={() => {}} placeholder="Above"/>
        <div>
          <div className="label-eyebrow" style={{ marginBottom: 8 }}>QUICK SUGGESTIONS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Above", "Below", "Top", "Front", "Back"].map((s, i) => (
              <Chip key={s} selected={i === 0}>{s}</Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="label-eyebrow" style={{ marginBottom: 8 }}>LIVE TREE</div>
          <Tree nodes={nodes}/>
        </div>
      </ScreenBody>
      <CtaTray>
        <div style={{ display: "flex", gap: 8 }}>
          <SecondaryButton>+ Wider</SecondaryButton>
          <PrimaryButton arrow>Go deeper</PrimaryButton>
        </div>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ── Phase 3 (variant) — completed branch ─────────────────────── */
const SS3_Complete = () => {
  const nodes = [
    { unit: "premises", name: "Walker Home" },
    { unit: "area", name: "Kitchen", depth: 1 },
    { unit: "zone", name: "Back", depth: 2 },
    { unit: "section", name: "Above", depth: 3 },
    { unit: "sub_section", name: "Cabinet 1", depth: 4 },
    { unit: "container", name: "Spice Rack", depth: 5 },
    { unit: "shelf", name: "Shelf 1", depth: 6, focused: true },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Set up spaces" helpAction={() => {}}/>
      <ScreenBody>
        <ProgressBar step={3} of={5} label="STEP 3 OF 5"/>
        <Alert kind="success" title="Your first branch is built">
          You can see how the levels nest. Now keep going — add more zones, sections, or storage anywhere in the tree.
        </Alert>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span className="label-eyebrow">YOUR TREE — 7 SPACES</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage-700)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12 }}>Use a template</button>
          </div>
          <Tree nodes={nodes}/>
        </div>
      </ScreenBody>
      <CtaTray>
        <PrimaryButton arrow>Open tree editor</PrimaryButton>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ── Phase 4 — Tree Editor (full editor view) ─────────────────── */
const SS4_TreeEditor = () => {
  const nodes = [
    { unit: "premises",    name: "Walker Home" },
    { unit: "area",        name: "Kitchen",     depth: 1 },
    { unit: "zone",        name: "Back",        depth: 2 },
    { unit: "section",     name: "Above",       depth: 3 },
    { unit: "sub_section", name: "Cabinet 1",   depth: 4, focused: true },
    { unit: "container",   name: "Spice Rack",  depth: 5 },
    { unit: "shelf",       name: "Shelf 1",     depth: 6 },
    { unit: "sub_section", name: "Cabinet 2",   depth: 4 },
    { unit: "section",     name: "Below",       depth: 3 },
    { unit: "zone",        name: "Center",      depth: 2 },
    { unit: "area",        name: "Pantry",      depth: 1 },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Spaces" helpAction={() => {}} right={
        <button style={{ height: 32, padding: "0 12px", borderRadius: 999, background: "var(--paper-250)", border: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--ink-900)" }}>Template</button>
      }/>
      <div style={{ padding: "0 24px 12px" }}>
        <SearchBar value="" onChange={() => {}} placeholder="Search spaces…"/>
      </div>
      <ScreenBody style={{ paddingTop: 0 }}>
        <Tree nodes={nodes} addAt={4}/>
        <div style={{
          background: "rgba(74,130,101,0.06)", border: "1px dashed var(--sage-700)",
          borderRadius: 12, padding: 14,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--sage-700)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><IconPlus size={18} color="#fff"/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-900)" }}>Add inside Cabinet 1</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>Suggested: <b>shelf</b> — also valid: container</div>
          </div>
        </div>
      </ScreenBody>
      <CtaTray light>
        <PrimaryButton arrow>I'm done — next step</PrimaryButton>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ── Phase 4b — Add Child sheet (smart defaults) ──────────────── */
const SS4_AddChildSheet = () => {
  const nodes = [
    { unit: "premises",    name: "Walker Home" },
    { unit: "area",        name: "Kitchen",     depth: 1 },
    { unit: "zone",        name: "Back",        depth: 2 },
    { unit: "section",     name: "Above",       depth: 3 },
    { unit: "sub_section", name: "Cabinet 1",   depth: 4, focused: true },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Spaces" helpAction={() => {}}/>
      <div style={{ padding: "0 24px 12px", flex: 1, overflow: "hidden", filter: "blur(2px)", opacity: 0.5 }}>
        <Tree nodes={nodes}/>
      </div>
      {/* Bottom sheet */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "var(--paper-50)", borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: "12px 24px 32px", boxShadow: "0 -8px 32px rgba(28,28,24,0.12)",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 9999, background: "var(--paper-300)", margin: "8px auto 4px" }}/>
        <div>
          <div className="label-eyebrow" style={{ marginBottom: 4 }}>ADD INSIDE</div>
          <div className="headline-md">Cabinet 1</div>
          <PathCrumb parts={["Walker Home", "Kitchen", "Back", "Above", "Cabinet 1"]}/>
        </div>
        <div>
          <div className="label-eyebrow" style={{ marginBottom: 8 }}>WHAT TYPE?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <UnitOption unit="shelf" name="Shelf" sub="Suggested — leaf level, a single shelf" selected/>
            <UnitOption unit="container" name="Container" sub="Portable — bin, rack, organizer"/>
          </div>
        </div>
        <Field label="NAME" value="" onChange={() => {}} placeholder="Shelf 1"/>
        <PrimaryButton arrow>Add space</PrimaryButton>
      </div>
    </PhoneFrame>
  );
};

const UnitOption = ({ unit, name, sub, selected }) => {
  const meta = UNIT_META[unit];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: 12, borderRadius: 12,
      background: selected ? "rgba(74,130,101,0.08)" : "var(--paper-100)",
      border: selected ? "2px solid var(--sage-700)" : "2px solid transparent",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: meta.iconBg, color: meta.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>{meta.glyph}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)" }}>{name}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 9999,
        border: selected ? "none" : "2px solid var(--paper-300)",
        background: selected ? "var(--sage-700)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{selected && <IconCheck size={14} color="#fff"/>}</div>
    </div>
  );
};

/* ── Phase 5 — Templates ──────────────────────────────────────── */
const SS5_Templates = () => {
  const templates = [
    { name: "Standard Kitchen", count: 24, by: "InMan", tag: "Most popular", icon: "🍳" },
    { name: "Bar Setup", count: 18, by: "InMan", icon: "🍸" },
    { name: "Walk-in Pantry", count: 12, by: "InMan", icon: "🥫" },
    { name: "Coffee Bar", count: 8, by: "InMan", icon: "☕" },
    { name: "Walker Garage", count: 16, by: "Davontae", icon: "🔧" },
  ];
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="Choose a template"/>
      <ScreenBody>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-700)", lineHeight: "20px" }}>
          Start from a pre-built hierarchy. You can add, remove, and rename anything afterward.
        </div>
        <Segmented options={[{ label: "By InMan", value: "system" }, { label: "Saved", value: "custom" }]} value="system" onChange={() => {}}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {templates.map((t, i) => (
            <button key={i} style={{
              width: "100%", textAlign: "left", border: "none", cursor: "pointer",
              background: "var(--paper-50)", borderRadius: 14, padding: 14,
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "var(--shadow-ambient-sm)",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: "var(--paper-200)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, flexShrink: 0,
              }}>{t.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)" }}>{t.name}</span>
                  {t.tag && <Chip variant="sage">{t.tag}</Chip>}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 4 }}>
                  {t.count} spaces · by {t.by}
                </div>
              </div>
              <IconChevronRight size={20} color="var(--ink-400)"/>
            </button>
          ))}
        </div>
      </ScreenBody>
    </PhoneFrame>
  );
};

/* ── Phase 5b — Template merge/replace prompt ────────────────── */
const SS5_MergeReplace = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Standard Kitchen"/>
    <ScreenBody>
      <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 16 }}>
        <div className="label-eyebrow" style={{ marginBottom: 6 }}>PREVIEW · 24 SPACES</div>
        <Tree nodes={[
          { unit: "area", name: "Kitchen" },
          { unit: "zone", name: "Back wall", depth: 1 },
          { unit: "section", name: "Above", depth: 2 },
          { unit: "sub_section", name: "Cabinet 1", depth: 3, faint: true },
          { unit: "sub_section", name: "Cabinet 2", depth: 3, faint: true },
          { unit: "section", name: "Below", depth: 2, faint: true },
        ]}/>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 8, textAlign: "center" }}>+ 18 more spaces</div>
      </div>
      <Alert kind="warn" title="You already have spaces">
        Walker Home has 7 spaces under Kitchen. Pick how to handle them.
      </Alert>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <RadioCard
          title="Merge into existing"
          body="Add the template's spaces alongside what you already have. Conflicting names get a number appended."
          recommended
          selected
        />
        <RadioCard
          title="Replace existing spaces"
          body="Remove your 7 existing spaces under Kitchen. Inventory currently in those spaces will become unsorted."
          danger
        />
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton arrow>Apply template</PrimaryButton>
      <TextButton>Cancel</TextButton>
    </CtaTray>
  </PhoneFrame>
);

const RadioCard = ({ title, body, recommended, selected, danger }) => (
  <div style={{
    padding: 14, borderRadius: 12,
    background: selected ? "rgba(74,130,101,0.08)" : "var(--paper-50)",
    border: selected ? "2px solid var(--sage-700)" : `2px solid ${danger ? "rgba(186,26,26,0.18)" : "var(--paper-300)"}`,
    display: "flex", gap: 12, alignItems: "flex-start",
  }}>
    <div style={{
      width: 22, height: 22, borderRadius: 9999, marginTop: 2,
      border: selected ? "none" : "2px solid var(--paper-300)",
      background: selected ? "var(--sage-700)" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{selected && <div style={{ width: 8, height: 8, borderRadius: 9999, background: "#fff" }}/>}</div>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)" }}>{title}</span>
        {recommended && <Chip variant="sage">Recommended</Chip>}
        {danger && <Chip variant="error">Destructive</Chip>}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 4, lineHeight: "18px" }}>{body}</div>
    </div>
  </div>
);

Object.assign(window, {
  SS1_Explainer, SS2_Premises, SS3_Guided, SS3_Complete,
  SS4_TreeEditor, SS4_AddChildSheet, SS5_Templates, SS5_MergeReplace,
  UnitOption, RadioCard,
});
