// ─────────────────────────────────────────────────────────────
// Tweaks for the Spaces drill-down prototype.
// Reshapes how the child-space cards read: photo vs spatial, columns,
// density, and what supporting detail each card carries.
// Exposes window.useSpacesTweaks() so every mounted DrillDownApp re-renders
// when a knob changes.
// ─────────────────────────────────────────────────────────────

const SP_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardStyle": "photo",
  "columns": 2,
  "density": "cozy",
  "preview": true,
  "counts": true
}/*EDITMODE-END*/;

// Shared store + subscription so DrillDownApp instances stay in sync.
window.__spaceTweaks = { ...SP_TWEAK_DEFAULTS };
const spTweakSubs = new Set();
window.useSpacesTweaks = function useSpacesTweaks() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { spTweakSubs.add(force); return () => { spTweakSubs.delete(force); }; }, []);
  return window.__spaceTweaks;
};

function SpacesTweaks() {
  const [t, setTweak] = useTweaks(SP_TWEAK_DEFAULTS);

  React.useEffect(() => {
    window.__spaceTweaks = { ...t };
    spTweakSubs.forEach((f) => f());
  }, [t.cardStyle, t.columns, t.density, t.preview, t.counts]);

  return (
    <TweaksPanel title="Tweaks · card drill-down">
      <TweakSection label="Card style">
        <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: -4, marginBottom: 8, lineHeight: 1.5 }}>
          Photo cards lean into the spatial vision; Spatial cards are a cleaner, denser glyph layout.
        </div>
        <TweakRadio
          value={t.cardStyle}
          onChange={(v) => setTweak("cardStyle", v)}
          options={[{ value: "photo", label: "Photo" }, { value: "spatial", label: "Spatial" }]}
        />
      </TweakSection>

      <TweakSection label="Grid">
        <TweakRadio
          label="Columns"
          value={t.columns}
          onChange={(v) => setTweak("columns", v)}
          options={[{ value: 2, label: "2 up" }, { value: 1, label: "1 up" }]}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          onChange={(v) => setTweak("density", v)}
          options={[{ value: "cozy", label: "Cozy" }, { value: "compact", label: "Compact" }]}
        />
      </TweakSection>

      <TweakSection label="Card detail">
        <TweakToggle label="“What's stored” preview" value={t.preview} onChange={(v) => setTweak("preview", v)} />
        <TweakToggle label="Item counts" value={t.counts} onChange={(v) => setTweak("counts", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

const spTweaksRoot = document.createElement("div");
spTweaksRoot.id = "__spaces-tweaks-root";
document.body.appendChild(spTweaksRoot);
ReactDOM.createRoot(spTweaksRoot).render(<SpacesTweaks />);
