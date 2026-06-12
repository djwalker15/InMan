// ─────────────────────────────────────────────────────────────
// Spaces drill-down — interactive prototype.
// Replaces the always-expanded tree: drilling into a space scopes the
// view to that space and hides sibling branches. Breadcrumb + back to
// climb out. Per-card ⋯ menu keeps add / rename / change-type / delete
// reachable. Renders inside the 390×844 PhoneFrame.
// ─────────────────────────────────────────────────────────────

// One-time CSS for sheet animations + input focus affordance.
if (typeof document !== "undefined" && !document.getElementById("sp-drill-css")) {
  const s = document.createElement("style");
  s.id = "sp-drill-css";
  s.textContent = `
    @keyframes sp-sheet-up { from { transform: translateY(46px) } to { transform: translateY(0) } }
    @keyframes sp-body-in { from { transform: translateY(10px) } to { transform: translateY(0) } }
    .sp-scrim { background: rgba(28,28,24,0.40) }
    .sp-sheet { animation: sp-sheet-up .34s cubic-bezier(.32,.72,0,1) both }
    @media (prefers-reduced-motion: no-preference) {
      .sp-body { animation: sp-body-in .28s cubic-bezier(.32,.72,0,1) both }
    }
    .sp-field { transition: background .18s ease, box-shadow .18s ease }
    .sp-card { transition: transform .18s cubic-bezier(.32,.72,0,1), box-shadow .18s ease, background .18s ease }
    .sp-card:active { transform: scale(.985) }
    .sp-crumb { transition: color .15s ease, background .15s ease }
    .sp-actionrow { transition: background .15s ease }
  `;
  document.head.appendChild(s);
}

// Plural helper for child-type labels.
function spPlural(label, n) {
  if (n === 1) return label;
  if (/section$/i.test(label)) return label + "s";
  return label.replace(/y$/, "ie") + "s";
}

// ── Breadcrumb — Spaces › Premises › … › current. Tap any crumb to jump. ──
function Crumbs({ nodes, focusId, onJump }) {
  const path = focusId ? spPath(nodes, focusId) : [];
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollLeft = ref.current.scrollWidth; }, [focusId]);
  const crumb = (label, id, active, key) => (
    <button key={key} onClick={() => onJump(id)} className="sp-crumb" style={{
      border: "none", background: "transparent", cursor: "pointer", padding: "2px 4px", flexShrink: 0,
      fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: "16px",
      fontWeight: active ? 700 : 500, color: active ? "var(--ink-900)" : "var(--ink-600)",
    }}>{label}</button>
  );
  const sep = (key) => <span key={key} style={{ color: "var(--ink-400)", flexShrink: 0, fontSize: 12 }}>›</span>;
  const out = [crumb("Spaces", null, focusId === null, "root")];
  path.forEach((n, i) => {
    out.push(sep("s" + n.id));
    out.push(crumb(n.name, n.id, i === path.length - 1, n.id));
  });
  return (
    <div ref={ref} style={{
      display: "flex", alignItems: "center", gap: 2, overflowX: "auto", scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch", maskImage: "linear-gradient(90deg, transparent 0, #000 18px)",
    }}>
      <span style={{ width: 6, flexShrink: 0 }} />
      {out}
    </div>
  );
}

// ── Stock-health pills row (low / expiring) ──
function HealthPills({ h, size = "sm" }) {
  if (!h || (!h.low && !h.expiring)) return null;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {h.expiring > 0 && <StatusPill kind="expiring">{h.expiring} expiring</StatusPill>}
      {h.low > 0 && <StatusPill kind="low">{h.low} low</StatusPill>}
    </div>
  );
}

// ── A single child-space card ──
function ChildCard({ nodes, node, tweaks, onOpen, onMenu }) {
  const meta = SP_UNIT[node.type];
  const kids = spChildren(nodes, node.id);
  const items = spItems(nodes, node.id);
  const health = spHealth(nodes, node.id);
  const isLeaf = kids.length === 0;
  const compact = tweaks.density === "compact";
  const twoCol = tweaks.columns === 2;
  const photo = tweaks.cardStyle === "photo";

  // Meta line: "4 zones · 128 items" (or "12 items" for leaves).
  const childLabel = kids.length ? spPlural(SP_UNIT[kids[0].type].label.toLowerCase(), kids.length) : null;
  const metaParts = [];
  if (kids.length) metaParts.push(`${kids.length} ${childLabel}`);
  if (tweaks.counts && (items.length || isLeaf)) metaParts.push(`${items.length} item${items.length === 1 ? "" : "s"}`);

  const previewItems = items.slice(0, 3).map((i) => i.name);
  const moreCount = items.length - previewItems.length;

  const glyphPlinth = (sz) => (
    <div style={{
      width: sz, height: sz, borderRadius: sz >= 40 ? 12 : 10, flexShrink: 0,
      background: meta.plinth, color: meta.tint,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz >= 40 ? 20 : 16,
    }}>{meta.glyph}</div>
  );

  const dots = (
    <button onClick={(e) => { e.stopPropagation(); onMenu(node.id); }} aria-label={`Actions for ${node.name}`} style={{
      width: 30, height: 30, borderRadius: 9999, border: "none", cursor: "pointer", flexShrink: 0,
      background: "transparent", color: "var(--ink-600)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}><IconMore size={18} /></button>
  );

  return (
    <div role="button" tabIndex={0} onClick={() => onOpen(node)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(node); } }}
      className="sp-card" style={{
      textAlign: "left", cursor: "pointer", width: "100%",
      background: "var(--paper-50)", borderRadius: 16, overflow: "hidden",
      boxShadow: "var(--shadow-ambient-sm)", display: "flex", flexDirection: "column",
    }}>
      {photo && (
        <div style={{
          position: "relative", height: twoCol ? 92 : 116, background: spPhoto(node.hue),
          backgroundSize: "cover", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 9, letterSpacing: "0.6px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.92)", padding: "3px 7px",
              background: "rgba(28,28,24,0.28)", borderRadius: 9999, backdropFilter: "blur(2px)",
            }}>{meta.label}</span>
            <span style={{ fontSize: 17, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}>{meta.glyph}</span>
          </div>
          {(health.low > 0 || health.expiring > 0) && (
            <div style={{ display: "flex", gap: 5 }}>
              {health.expiring > 0 && <span style={pillOnPhoto("#F4B650")}>{health.expiring} expiring</span>}
              {health.low > 0 && <span style={pillOnPhoto("#F0A8A8")}>{health.low} low</span>}
            </div>
          )}
        </div>
      )}
      <div style={{ padding: compact ? "10px 12px 12px" : "13px 14px 15px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
          {!photo && glyphPlinth(twoCol ? 36 : 40)}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!photo && <div className="label-eyebrow" style={{ fontSize: 9, color: "var(--ink-500)", marginBottom: 2 }}>{meta.label}</div>}
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: twoCol ? 15 : 17, lineHeight: 1.18,
              color: "var(--ink-900)", letterSpacing: "-0.2px",
            }}>{node.name}</div>
          </div>
          <div style={{ marginTop: -4, marginRight: -6 }}>{dots}</div>
        </div>

        {metaParts.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", flexWrap: "wrap" }}>
            {kids.length > 0 && <IconChevronRight size={12} color="var(--sage-700)" />}
            <span style={{ fontWeight: 500 }}>{metaParts.join(" · ")}</span>
          </div>
        )}

        {tweaks.preview && previewItems.length > 0 && (
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 11.5, lineHeight: 1.4, color: "var(--ink-500)",
            overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {previewItems.join(", ")}{moreCount > 0 ? ` +${moreCount}` : ""}
          </div>
        )}

        {!photo && <HealthPills h={health} />}
      </div>
    </div>
  );
}

function pillOnPhoto(fg) {
  return {
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.2px",
    color: fg, padding: "3px 7px", background: "rgba(28,28,24,0.42)", borderRadius: 9999,
    backdropFilter: "blur(2px)",
  };
}

// ── Item row for the leaf view ──
function SpItemRow({ item }) {
  const map = { low: "low", out: "out", expiring: "expiring", expired: "expired", ok: null };
  const kind = map[item.status];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
      background: "var(--paper-50)", borderRadius: 12, boxShadow: "var(--shadow-ambient-sm)",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: "var(--paper-200)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-600)",
      }}><IconBottle size={18} /></div>
      <span style={{ flex: 1, fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500, color: "var(--ink-900)" }}>{item.name}</span>
      {kind && <StatusPill kind={kind}>{kind === "expiring" ? "Expiring" : kind === "low" ? "Low" : kind}</StatusPill>}
    </div>
  );
}

// ── Empty state for a leaf with no items/children ──
function SpEmpty({ name, onAdd }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12,
      padding: "44px 28px", background: "var(--paper-100)", borderRadius: 16,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 9999, background: "rgba(74,130,101,0.10)", color: "var(--sage-700)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><IconBox size={26} /></div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-900)" }}>Nothing here yet</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink-600)", marginTop: 4, lineHeight: 1.5 }}>
          Add a space inside <strong style={{ color: "var(--ink-900)" }}>{name}</strong>, or start stocking items here.
        </div>
      </div>
      <button onClick={onAdd} style={primaryBtnStyle(false)}>
        <IconPlus size={18} color="#fff" /> Add a space inside
      </button>
    </div>
  );
}

Object.assign(window, { Crumbs, HealthPills, ChildCard, SpItemRow, SpEmpty, spPlural, pillOnPhoto });
