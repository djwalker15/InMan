// ─────────────────────────────────────────────────────────────
// DrillDownApp — the working prototype. Owns the live tree + navigation.
// Drilling into a space scopes to it and hides sibling branches;
// breadcrumb + back climb out. Mounts inside the 390×844 PhoneFrame.
// ─────────────────────────────────────────────────────────────

let SP_UID = 0;
const spUid = () => "n" + (++SP_UID) + Date.now().toString(36).slice(-3);
const WARM_HUES = [20, 26, 32, 38, 44, 30, 36];
const spHueFor = (name) => WARM_HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % WARM_HUES.length];

const SP_TWEAK_FALLBACK = { cardStyle: "photo", columns: 2, density: "cozy", preview: true, counts: true };
function useSpacesTweaksSafe() {
  return (window.useSpacesTweaks ? window.useSpacesTweaks() : (window.__spaceTweaks || SP_TWEAK_FALLBACK));
}

function DrillDownApp({ initialFocusId = "auto", initialSheet = null, initialMenu = null, seedNodes = null }) {
  const [nodes, setNodes] = React.useState(() => (seedNodes || SPACE_NODES).map((n) => ({ ...n, items: n.items ? n.items.slice() : undefined })));
  const roots = spRoots(nodes);
  const resolvedInitial = initialFocusId === "auto" ? (roots.length === 1 ? roots[0].id : null) : initialFocusId;
  const [focusId, setFocusId] = React.useState(resolvedInitial);
  // sheet: { type: 'menu'|'add'|'rename'|'reclassify'|'delete', targetId }
  const [sheet, setSheet] = React.useState(
    initialMenu ? { type: "menu", targetId: initialMenu } : initialSheet,
  );
  const [toast, setToast] = React.useState(null);
  const tweaks = useSpacesTweaksSafe();

  const showToast = (msg) => { setToast(msg); clearTimeout(showToast._t); showToast._t = setTimeout(() => setToast(null), 2200); };

  const scope = focusId ? spNode(nodes, focusId) : null;
  const children = focusId ? spChildren(nodes, focusId) : roots;
  const items = scope ? spItems(nodes, focusId) : [];
  const leafItems = scope && children.length === 0 && scope.items ? scope.items : [];

  // ── navigation ──
  const openNode = (n) => { setSheet(null); setFocusId(n.id); };
  const jump = (id) => { setSheet(null); setFocusId(id); };
  const back = () => {
    if (!scope) return;
    setFocusId(scope.parent || null);
  };

  // ── mutations ──
  const addChild = (parentId, type, name) => {
    const node = { id: spUid(), parent: parentId, type, name, hue: spHueFor(name) };
    setNodes((ns) => [...ns, node]);
    setSheet(null);
    showToast(`Added “${name}”`);
  };
  const rename = (id, name) => { setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, name } : n))); setSheet(null); showToast("Renamed"); };
  const reclassify = (id, type) => { setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, type } : n))); setSheet(null); showToast("Type changed"); };
  const del = (id) => {
    const gone = new Set([id, ...spDescendants(nodes, id)]);
    const parentOfDeleted = spNode(nodes, id).parent || null;
    setNodes((ns) => ns.filter((n) => !gone.has(n.id)));
    if (focusId && gone.has(focusId)) setFocusId(parentOfDeleted);
    setSheet(null);
    showToast("Deleted");
  };

  // Add target: current scope (or null = new premises at root).
  const openAddForScope = () => setSheet({ type: "add", targetId: focusId });
  const openMenu = (id) => setSheet({ type: "menu", targetId: id });

  const cols = tweaks.columns === 1 ? 1 : 2;
  const gap = tweaks.density === "compact" ? 11 : 14;
  const totalItems = nodes.reduce((a, n) => a + (n.items ? n.items.length : 0), 0);

  return (
    <PhoneFrame statusBg="var(--surface)">
      {/* ── top bar: back · breadcrumb · more · add ── */}
      <div style={{
        flexShrink: 0, height: 52, padding: "0 10px 0 4px", display: "flex", alignItems: "center", gap: 4,
        background: "var(--surface)",
      }}>
        {scope ? <HeadBtn label="Back" onClick={back}><IconBack size={22} /></HeadBtn>
               : <div style={{ width: 8 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Crumbs nodes={nodes} focusId={focusId} onJump={jump} />
        </div>
        {scope && (
          <HeadBtn label="Manage this space" onClick={() => openMenu(focusId)}><IconMore size={20} /></HeadBtn>
        )}
        <HeadBtn label="Add space" filled onClick={openAddForScope}><IconPlus size={20} color="#fff" /></HeadBtn>
      </div>

      {/* ── scrollable body ── */}
      <div className="sp-body" key={focusId || "root"} style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {scope ? (
          <ScopeHero nodes={nodes} scope={scope} />
        ) : (
          <div style={{ padding: "10px 24px 14px" }}>
            <div className="label-eyebrow" style={{ color: "var(--sage-700)", marginBottom: 8 }}>Your spaces</div>
            <div className="display-md" style={{ fontSize: 30, lineHeight: "36px", letterSpacing: "-0.6px" }}>Premises</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--ink-600)", marginTop: 8, lineHeight: 1.5 }}>
              Pick a home or bar to step inside. {roots.length} premises · {totalItems} items tracked.
            </div>
          </div>
        )}

        <div style={{ padding: "4px 24px 32px" }}>
          {children.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
              {children.map((c) => (
                <ChildCard key={c.id} nodes={nodes} node={c} tweaks={tweaks} onOpen={openNode} onMenu={openMenu} />
              ))}
            </div>
          ) : leafItems.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="label-eyebrow" style={{ color: "var(--ink-500)", margin: "4px 0 2px" }}>
                {leafItems.length} item{leafItems.length === 1 ? "" : "s"} stored here
              </div>
              {leafItems.map((it, i) => <SpItemRow key={i} item={it} />)}
            </div>
          ) : (
            <SpEmpty name={scope ? scope.name : "this space"} onAdd={openAddForScope} />
          )}
        </div>
      </div>

      {/* ── sheets ── */}
      <SpSheet open={!!sheet} onClose={() => setSheet(null)}>
        {sheet && sheet.type === "menu" && (
          <ActionMenu nodes={nodes} targetId={sheet.targetId} onClose={() => setSheet(null)}
            onPick={(action) => setSheet({ type: action, targetId: sheet.targetId })} />
        )}
        {sheet && sheet.type === "add" && (
          <AddSheet nodes={nodes} parentId={sheet.targetId} onAdd={addChild} onClose={() => setSheet(null)} />
        )}
        {sheet && sheet.type === "rename" && (
          <RenameSheet nodes={nodes} targetId={sheet.targetId} onRename={rename} onClose={() => setSheet(null)} />
        )}
        {sheet && sheet.type === "reclassify" && (
          <ReclassifySheet nodes={nodes} targetId={sheet.targetId} onReclassify={reclassify} onClose={() => setSheet(null)} />
        )}
        {sheet && sheet.type === "delete" && (
          <DeleteSheet nodes={nodes} targetId={sheet.targetId} onDelete={del} onClose={() => setSheet(null)} />
        )}
      </SpSheet>

      {/* ── toast ── */}
      {toast && (
        <div style={{
          position: "absolute", left: "50%", bottom: 30, transform: "translateX(-50%)", zIndex: 70,
          display: "flex", alignItems: "center", gap: 9, padding: "11px 18px", borderRadius: 9999,
          background: "var(--ink-900)", color: "var(--paper-50)", boxShadow: "var(--shadow-ambient-lg)",
          fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap",
        }}>
          <span style={{ color: "var(--sage-100)", display: "flex" }}><IconCheck size={17} color="var(--sage-100)" /></span>
          {toast}
        </div>
      )}
    </PhoneFrame>
  );
}

// ── Scope hero — a photo banner of the space you're inside ──
function ScopeHero({ nodes, scope }) {
  const meta = SP_UNIT[scope.type];
  const kids = spChildren(nodes, scope.id);
  const items = spItems(nodes, scope.id);
  const health = spHealth(nodes, scope.id);
  const childLabel = kids.length ? spPlural(SP_UNIT[kids[0].type].label.toLowerCase(), kids.length) : null;
  const metaParts = [];
  if (kids.length) metaParts.push(`${kids.length} ${childLabel}`);
  if (items.length) metaParts.push(`${items.length} item${items.length === 1 ? "" : "s"}`);
  return (
    <div style={{ padding: "8px 24px 14px" }}>
      <div style={{
        position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 132,
        background: spPhoto(scope.hue), backgroundSize: "cover",
        display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 18,
        boxShadow: "var(--shadow-ambient-md)",
      }}>
        <div style={{ position: "absolute", top: 14, left: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 19, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>{meta.glyph}</span>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.7px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.95)",
          }}>{meta.label}</span>
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 27, lineHeight: 1.1, letterSpacing: "-0.6px",
          color: "#fff", textShadow: "0 1px 12px rgba(0,0,0,0.3)",
        }}>{scope.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {metaParts.length > 0 && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.94)" }}>
              {metaParts.join(" · ")}
            </span>
          )}
          {health.expiring > 0 && <span style={pillOnPhoto("#F4B650")}>{health.expiring} expiring</span>}
          {health.low > 0 && <span style={pillOnPhoto("#F0A8A8")}>{health.low} low</span>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DrillDownApp, ScopeHero, spUid, spHueFor });
