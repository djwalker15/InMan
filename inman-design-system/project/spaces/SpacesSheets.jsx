// ─────────────────────────────────────────────────────────────
// Drill-down app shell: header (back + breadcrumb + add), scope body,
// and the edit sheets (action menu, add, rename, change-type, delete).
// All edits mutate a live in-memory tree, so the prototype actually works.
// ─────────────────────────────────────────────────────────────

function primaryBtnStyle(full = true) {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: full ? "100%" : "auto", padding: full ? "0 20px" : "0 22px", height: 52,
    borderRadius: 12, border: "none", cursor: "pointer",
    background: "var(--gradient-primary)", color: "#fff",
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.1px",
    boxShadow: "var(--shadow-cta)", transition: "transform .12s ease, filter .15s ease",
  };
}
function ghostBtnStyle() {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%", height: 52, borderRadius: 12, border: "none", cursor: "pointer",
    background: "var(--paper-150)", color: "var(--ink-700)",
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
  };
}

// Header round-button (back / add / more).
function HeadBtn({ label, onClick, children, filled }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      width: 40, height: 40, borderRadius: 9999, border: "none", cursor: "pointer", flexShrink: 0,
      background: filled ? "var(--gradient-primary)" : "transparent",
      color: filled ? "#fff" : "var(--ink-900)",
      boxShadow: filled ? "var(--shadow-cta)" : "none",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{children}</button>
  );
}

// Text field with the design system's "no-box + sage bottom-bar on focus".
function SpField({ label, value, onChange, placeholder, autoFocus }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "block" }}>
      {label && <div className="label-eyebrow" style={{ marginBottom: 8, color: "var(--ink-500)" }}>{label}</div>}
      <input
        type="text" value={value} placeholder={placeholder} autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        className="sp-field"
        style={{
          width: "100%", boxSizing: "border-box", padding: "16px 16px", borderRadius: 12, border: "none", outline: "none",
          fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink-900)",
          background: focus ? "var(--paper-250)" : "var(--paper-100)",
          boxShadow: focus ? "inset 0 -2px 0 0 var(--sage-700)" : "inset 0 -2px 0 0 transparent",
        }}
      />
    </label>
  );
}

// Segmented type picker — one chip per allowed child type, with its glyph.
function SpTypePicker({ types, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {types.map((t) => {
        const m = SP_UNIT[t]; const active = value === t;
        return (
          <button key={t} onClick={() => onChange(t)} style={{
            display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 13px", borderRadius: 9999,
            border: "none", cursor: "pointer",
            background: active ? "var(--sage-700)" : "var(--paper-150)",
            color: active ? "#fff" : "var(--ink-700)",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
          }}>
            <span style={{ fontSize: 14 }}>{m.glyph}</span>{m.label}
          </button>
        );
      })}
    </div>
  );
}

// Bottom-sheet shell — scrim (blur) + slide-up panel, scoped to the phone frame.
function SpSheet({ open, onClose, children, maxHeight = "82%" }) {
  if (!open) return null;
  return (
    <div className="sp-scrim" onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 60, background: "rgba(28,28,24,0.40)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <div className="sp-sheet" onClick={(e) => e.stopPropagation()} style={{
        background: "var(--paper-50)", borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: "var(--shadow-ambient-lg)", padding: "12px 24px 28px", maxHeight,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 9999, background: "var(--paper-300)", margin: "0 auto 16px", flexShrink: 0 }} />
        <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>{children}</div>
      </div>
    </div>
  );
}

function SheetTitle({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {eyebrow && <div className="label-eyebrow" style={{ color: "var(--sage-700)", marginBottom: 6 }}>{eyebrow}</div>}
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.4px", color: "var(--ink-900)" }}>{title}</div>
      {sub && <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-600)", marginTop: 6, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

// ── Action menu (the ⋯ sheet) ──
function ActionMenu({ nodes, targetId, onPick, onClose }) {
  const node = spNode(nodes, targetId);
  if (!node) return null;
  const meta = SP_UNIT[node.type];
  const isPremises = node.type === "premises";
  const canAddChild = (SP_ALLOWED_CHILDREN[node.type] || []).length > 0;
  const canReclass = spReclassify(nodes, targetId).length > 0;
  const Row = ({ icon, label, danger, onClick }) => (
    <button onClick={onClick} className="sp-actionrow" style={{
      display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "15px 12px", borderRadius: 12,
      border: "none", cursor: "pointer", background: "transparent", textAlign: "left",
      color: danger ? "var(--error)" : "var(--ink-900)",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = danger ? "var(--error-bg)" : "var(--paper-150)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      <span style={{ width: 22, display: "flex", justifyContent: "center", color: danger ? "var(--error)" : "var(--ink-600)" }}>{icon}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500 }}>{label}</span>
    </button>
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: meta.plinth, color: meta.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{meta.glyph}</div>
        <div>
          <div className="label-eyebrow" style={{ color: "var(--ink-500)", fontSize: 9 }}>{meta.label}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-900)" }}>{node.name}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {canAddChild && <Row icon={<IconPlus size={20} />} label="Add a space inside" onClick={() => onPick("add")} />}
        <Row icon={<IconEdit size={20} />} label="Rename" onClick={() => onPick("rename")} />
        {canReclass && <Row icon={<IconBatches size={20} />} label="Change type" onClick={() => onPick("reclassify")} />}
        {!isPremises && <Row icon={<IconDelete size={20} />} label="Delete" danger onClick={() => onPick("delete")} />}
      </div>
    </div>
  );
}

// ── Add sheet ──
function AddSheet({ nodes, parentId, onAdd, onClose }) {
  const parent = parentId ? spNode(nodes, parentId) : null;
  const allowed = parent ? (SP_ALLOWED_CHILDREN[parent.type] || []) : ["premises"];
  const [type, setType] = React.useState(parent ? (SP_SMART_CHILD[parent.type] || allowed[0]) : "premises");
  const [name, setName] = React.useState("");
  const valid = name.trim().length >= 1;
  return (
    <div>
      <SheetTitle eyebrow="Add space" title={parent ? `Add inside ${parent.name}` : "Add a premises"}
        sub={parent ? "Pick what kind of space this is, then name it. You can change either later." : "A premises is the top of a hierarchy — a home or a bar."} />
      {parent && allowed.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div className="label-eyebrow" style={{ marginBottom: 10, color: "var(--ink-500)" }}>Type</div>
          <SpTypePicker types={allowed} value={type} onChange={setType} />
        </div>
      )}
      <SpField label="Name" value={name} onChange={setName}
        placeholder={parent ? "e.g. Top Shelf, Spice Rack" : "e.g. Walker Home, Haywire Bar"} autoFocus />
      <div style={{ marginTop: 22 }}>
        <button disabled={!valid} onClick={() => onAdd(parentId, type, name.trim())}
          style={{ ...primaryBtnStyle(true), opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "default" }}>
          <IconPlus size={18} color="#fff" /> Add {parent ? SP_UNIT[type].label.toLowerCase() : "premises"}
        </button>
      </div>
    </div>
  );
}

// ── Rename sheet ──
function RenameSheet({ nodes, targetId, onRename, onClose }) {
  const node = spNode(nodes, targetId);
  const [name, setName] = React.useState(node ? node.name : "");
  if (!node) return null;
  const valid = name.trim().length >= 1 && name.trim() !== node.name;
  return (
    <div>
      <SheetTitle eyebrow={`Rename ${SP_UNIT[node.type].label}`} title={node.name} sub="You can rename this later, too." />
      <SpField label="New name" value={name} onChange={setName} autoFocus />
      <div style={{ marginTop: 22 }}>
        <button disabled={!valid} onClick={() => onRename(targetId, name.trim())}
          style={{ ...primaryBtnStyle(true), opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "default" }}>Save</button>
      </div>
    </div>
  );
}

// ── Change-type (reclassify) sheet ──
function ReclassifySheet({ nodes, targetId, onReclassify, onClose }) {
  const node = spNode(nodes, targetId);
  const suggestions = spReclassify(nodes, targetId);
  const [type, setType] = React.useState(suggestions[0] || null);
  if (!node) return null;
  return (
    <div>
      <SheetTitle eyebrow="Change type" title={node.name}
        sub={`Currently a ${SP_UNIT[node.type].label}. Only types that still fit this position — and keep its contents valid — are offered.`} />
      <div className="label-eyebrow" style={{ marginBottom: 10, color: "var(--ink-500)" }}>New type</div>
      {suggestions.length > 0
        ? <SpTypePicker types={suggestions} value={type} onChange={setType} />
        : <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-600)" }}>No alternative types are valid here.</div>}
      <div style={{ marginTop: 22 }}>
        <button disabled={!type} onClick={() => onReclassify(targetId, type)}
          style={{ ...primaryBtnStyle(true), opacity: type ? 1 : 0.5, cursor: type ? "pointer" : "default" }}>Save change</button>
      </div>
    </div>
  );
}

// ── Delete sheet ──
function DeleteSheet({ nodes, targetId, onDelete, onClose }) {
  const node = spNode(nodes, targetId);
  if (!node) return null;
  const desc = spDescendants(nodes, targetId);
  const items = spItems(nodes, targetId).length;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: "var(--error-bg)", color: "var(--error)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconDelete size={22} /></div>
        <SheetTitle title={`Delete ${node.name}?`} />
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink-700)", lineHeight: 1.55, marginBottom: 8 }}>
        {desc.length > 0
          ? <>This also removes its <strong style={{ color: "var(--ink-900)" }}>{desc.length}</strong> nested space{desc.length === 1 ? "" : "s"}.</>
          : <>This space has no nested spaces.</>}
        {items > 0 && <> The <strong style={{ color: "var(--ink-900)" }}>{items}</strong> item{items === 1 ? "" : "s"} stored here will become unsorted.</>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
        <button onClick={() => onDelete(targetId)} style={{
          ...primaryBtnStyle(true), background: "var(--error)", boxShadow: "0 8px 16px -4px rgba(186,26,26,0.22)",
        }}><IconDelete size={18} color="#fff" /> Delete space</button>
        <button onClick={onClose} style={ghostBtnStyle()}>Keep it</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  primaryBtnStyle, ghostBtnStyle, HeadBtn, SpField, SpTypePicker, SpSheet, SheetTitle,
  ActionMenu, AddSheet, RenameSheet, ReclassifySheet, DeleteSheet,
});
