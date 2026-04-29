// Expressive tweaks for User Journeys canvas. Three knobs that reshape the feel.
// Each tweak rewrites a batch of CSS variables on :root.

const MOODS = {
  sage: {
    label: "Sage Homestead",
    hint: "The canonical InMan look — moss + warm paper",
    vars: {
      "--sage-700": "#31694D",
      "--sage-600": "#4A8265",
      "--sage-500": "#708067",
      "--sage-300": "#C0C9C1",
      "--sage-100": "#B4F0CD",
      "--paper-50":  "#FDF9F2",
      "--paper-100": "#F7F3EC",
      "--paper-150": "#F2EEE6",
      "--paper-200": "#F1EDE7",
      "--paper-250": "#EBE8E1",
      "--paper-300": "#E6E2DB",
      "--ink-900": "#1C1C18",
      "--gradient-primary": "linear-gradient(135deg, #31694D 0%, #4A8265 100%)",
      "--gradient-primary-vertical": "linear-gradient(180deg, #31694D 0%, #4A8265 100%)",
      "--shadow-cta": "0 8px 16px -4px rgba(49, 105, 77, 0.20)",
      "--shadow-cta-strong": "0 8px 20px 0 rgba(74, 130, 101, 0.25)",
    },
  },
  terracotta: {
    label: "Terracotta Workshop",
    hint: "Warm clay + putty — feels like a working garage",
    vars: {
      "--sage-700": "#A04A28",
      "--sage-600": "#C2613A",
      "--sage-500": "#9C7060",
      "--sage-300": "#D8C4B8",
      "--sage-100": "#FAD5C3",
      "--paper-50":  "#FAF5EE",
      "--paper-100": "#F4ECE0",
      "--paper-150": "#EFE6D7",
      "--paper-200": "#EBE2D2",
      "--paper-250": "#E1D7C6",
      "--paper-300": "#D9CDB8",
      "--ink-900": "#221912",
      "--gradient-primary": "linear-gradient(135deg, #A04A28 0%, #C2613A 100%)",
      "--gradient-primary-vertical": "linear-gradient(180deg, #A04A28 0%, #C2613A 100%)",
      "--shadow-cta": "0 8px 16px -4px rgba(160, 74, 40, 0.22)",
      "--shadow-cta-strong": "0 8px 20px 0 rgba(194, 97, 58, 0.28)",
    },
  },
  ops: {
    label: "Indigo Operations",
    hint: "Cool slate + indigo — feels like back-of-house software",
    vars: {
      "--sage-700": "#2F4A8A",
      "--sage-600": "#4664A8",
      "--sage-500": "#6B7894",
      "--sage-300": "#BCC4D2",
      "--sage-100": "#C7D5F5",
      "--paper-50":  "#F8F8FA",
      "--paper-100": "#F1F2F5",
      "--paper-150": "#ECEDF1",
      "--paper-200": "#E7E9EF",
      "--paper-250": "#DEE1E8",
      "--paper-300": "#D2D6DF",
      "--ink-900": "#161A23",
      "--gradient-primary": "linear-gradient(135deg, #2F4A8A 0%, #4664A8 100%)",
      "--gradient-primary-vertical": "linear-gradient(180deg, #2F4A8A 0%, #4664A8 100%)",
      "--shadow-cta": "0 8px 16px -4px rgba(47, 74, 138, 0.22)",
      "--shadow-cta-strong": "0 8px 20px 0 rgba(70, 100, 168, 0.28)",
    },
  },
  studio: {
    label: "Charcoal Studio",
    hint: "Inverted — dark canvas, electric accent",
    vars: {
      "--sage-700": "#D9F26E",
      "--sage-600": "#B6D158",
      "--sage-500": "#8E9468",
      "--sage-300": "#3F4239",
      "--sage-100": "#5A5F4D",
      "--paper-50":  "#1F1F1C",
      "--paper-100": "#26261F",
      "--paper-150": "#2B2B23",
      "--paper-200": "#30302A",
      "--paper-250": "#3A3A33",
      "--paper-300": "#45453E",
      "--ink-900": "#F4F2EA",
      "--ink-700": "#C7C4B7",
      "--ink-600": "#A09D90",
      "--ink-500": "#7C7A6E",
      "--ink-400": "#56544A",
      "--surface": "#26261F",
      "--gradient-primary": "linear-gradient(135deg, #D9F26E 0%, #B6D158 100%)",
      "--gradient-primary-vertical": "linear-gradient(180deg, #D9F26E 0%, #B6D158 100%)",
      "--shadow-cta": "0 8px 16px -4px rgba(217, 242, 110, 0.18)",
      "--shadow-cta-strong": "0 8px 20px 0 rgba(217, 242, 110, 0.28)",
      "--shadow-ambient-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
      "--shadow-ambient-md": "0 4px 32px 0 rgba(0, 0, 0, 0.35), 0 8px 24px -4px rgba(0, 0, 0, 0.5)",
      "--shadow-ambient-lg": "0 8px 48px 0 rgba(0, 0, 0, 0.45), 0 4px 32px 0 rgba(0, 0, 0, 0.35)",
    },
  },
};

const FORMS = {
  soft: {
    label: "Soft",
    hint: "Pillowy radii, ambient glow — domestic and friendly",
    radius: { sm: 12, md: 16, lg: 22, pill: 9999 },
    shadows: {
      "--shadow-ambient-sm": "0 2px 6px 0 rgba(28, 28, 24, 0.06)",
      "--shadow-ambient-md": "0 6px 36px 0 rgba(28, 28, 24, 0.06), 0 12px 28px -4px rgba(28, 28, 24, 0.08)",
      "--shadow-ambient-lg": "0 12px 60px 0 rgba(28, 28, 24, 0.10), 0 8px 40px 0 rgba(28, 28, 24, 0.06)",
    },
  },
  crisp: {
    label: "Crisp",
    hint: "Tight 8px radii, restrained shadows — operational and precise",
    radius: { sm: 6, md: 8, lg: 10, pill: 9999 },
    shadows: {
      "--shadow-ambient-sm": "0 1px 2px 0 rgba(28, 28, 24, 0.06)",
      "--shadow-ambient-md": "0 2px 8px 0 rgba(28, 28, 24, 0.06)",
      "--shadow-ambient-lg": "0 4px 16px 0 rgba(28, 28, 24, 0.08)",
    },
  },
  sharp: {
    label: "Sharp",
    hint: "Square corners, hard 1px borders — editorial / brutalist",
    radius: { sm: 0, md: 0, lg: 2, pill: 0 },
    shadows: {
      "--shadow-ambient-sm": "0 0 0 1px rgba(28, 28, 24, 0.10)",
      "--shadow-ambient-md": "0 0 0 1px rgba(28, 28, 24, 0.14)",
      "--shadow-ambient-lg": "0 0 0 1.5px rgba(28, 28, 24, 0.18)",
    },
  },
};

const VOICES = {
  geometric: {
    label: "Calm Geometric",
    hint: "Plus Jakarta Sans + Be Vietnam Pro — the default",
    googleFonts: ["Plus Jakarta Sans:400,500,600,700", "Be Vietnam Pro:400,500,600,700"],
    display: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    body: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif',
    tracking: "-0.01em",
  },
  editorial: {
    label: "Editorial Serif",
    hint: "Fraunces display + Inter body — magazine-ish, more emotional",
    googleFonts: ["Fraunces:400,500,600,700", "Inter:400,500,600,700"],
    display: '"Fraunces", Georgia, serif',
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    tracking: "-0.02em",
  },
  industrial: {
    label: "Industrial Mono",
    hint: "JetBrains Mono headings — feels like a control system",
    googleFonts: ["JetBrains Mono:400,500,600,700", "IBM Plex Sans:400,500,600,700"],
    display: '"JetBrains Mono", ui-monospace, monospace',
    body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
    tracking: "0em",
  },
  hand: {
    label: "Friendly Display",
    hint: "DM Sans + display weight — approachable and human",
    googleFonts: ["DM Sans:400,500,700,900", "DM Sans:400,500,700"],
    display: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    body: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    tracking: "-0.015em",
  },
};

// Inject Google Fonts on demand.
const loadedFontUrls = new Set();
function ensureGoogleFonts(families) {
  const url = "https://fonts.googleapis.com/css2?" + families.map(f => "family=" + f.replace(/ /g, "+").replace(":", ":wght@").replace(/,/g, ";")).join("&") + "&display=swap";
  if (loadedFontUrls.has(url)) return;
  loadedFontUrls.add(url);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

function applyTweaks({ mood, form, voice, density }) {
  const root = document.documentElement;

  // Reset any prior overrides we might have set on ink-* if leaving studio.
  ["--ink-700", "--ink-600", "--ink-500", "--ink-400", "--surface"].forEach(k => root.style.removeProperty(k));

  const m = MOODS[mood] || MOODS.sage;
  Object.entries(m.vars).forEach(([k, v]) => root.style.setProperty(k, v));

  const f = FORMS[form] || FORMS.soft;
  root.style.setProperty("--rk-radius-sm", f.radius.sm + "px");
  root.style.setProperty("--rk-radius-md", f.radius.md + "px");
  root.style.setProperty("--rk-radius-lg", f.radius.lg + "px");
  root.style.setProperty("--rk-radius-pill", f.radius.pill + "px");
  Object.entries(f.shadows).forEach(([k, v]) => root.style.setProperty(k, v));

  const v = VOICES[voice] || VOICES.geometric;
  ensureGoogleFonts(v.googleFonts);
  root.style.setProperty("--font-display", v.display);
  root.style.setProperty("--font-body", v.body);
  root.style.setProperty("--rk-tracking", v.tracking);

  // Density: scales up paddings and base type via a multiplier.
  const d = density === "airy" ? 1.12 : density === "compact" ? 0.92 : 1.0;
  root.style.setProperty("--rk-density", d);
}

// Inject the global radius/tracking overrides — applied via CSS once.
function injectGlobalOverrides() {
  if (document.getElementById("__tweak-globals")) return;
  const style = document.createElement("style");
  style.id = "__tweak-globals";
  style.textContent = `
    /* Apply the form-language radius scale to every element with a non-pill border-radius. */
    [style*="border-radius: 8px"],
    [style*="border-radius:8px"]   { border-radius: var(--rk-radius-sm, 8px) !important; }
    [style*="border-radius: 10px"],
    [style*="border-radius:10px"]  { border-radius: var(--rk-radius-sm, 10px) !important; }
    [style*="border-radius: 12px"],
    [style*="border-radius:12px"]  { border-radius: var(--rk-radius-md, 12px) !important; }
    [style*="border-radius: 14px"],
    [style*="border-radius:14px"]  { border-radius: var(--rk-radius-md, 14px) !important; }
    [style*="border-radius: 16px"],
    [style*="border-radius:16px"]  { border-radius: var(--rk-radius-lg, 16px) !important; }
    [style*="border-radius: 20px"],
    [style*="border-radius:20px"]  { border-radius: var(--rk-radius-lg, 20px) !important; }
    [style*="border-radius: 22px"],
    [style*="border-radius:22px"]  { border-radius: var(--rk-radius-lg, 22px) !important; }

    /* Tracking on all display-family text. */
    .display-lg, .display-md, .headline-lg, .headline-md, .headline-sm, .title-md, .label-section {
      letter-spacing: var(--rk-tracking, -0.01em) !important;
    }

    /* Density: scale phone-frame internal padding & gaps using a CSS variable. */
    .__density-airy   [data-screen-padding] { padding-top: 24px !important; padding-bottom: 24px !important; }
    .__density-compact [data-screen-padding] { padding-top: 12px !important; padding-bottom: 12px !important; }
  `;
  document.head.appendChild(style);
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mood": "sage",
  "form": "soft",
  "voice": "geometric",
  "density": "regular"
}/*EDITMODE-END*/;

function JourneyTweaks() {
  injectGlobalOverrides();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    applyTweaks(tweaks);
    document.documentElement.classList.remove("__density-airy", "__density-compact", "__density-regular");
    document.documentElement.classList.add("__density-" + tweaks.density);
  }, [tweaks.mood, tweaks.form, tweaks.voice, tweaks.density]);

  return (
    <TweaksPanel title="Tweaks · feel reshaping">
      <TweakSection label="Brand mood">
        <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: -4, marginBottom: 8, lineHeight: 1.5 }}>Swaps the whole palette + accent. Watch buttons, badges, and tints all shift together.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(MOODS).map(([id, m]) => {
            const active = tweaks.mood === id;
            return (
              <button key={id} onClick={() => setTweak("mood", id)} style={{
                padding: 10, borderRadius: 10, cursor: "pointer", textAlign: "left",
                border: active ? "1.5px solid " + m.vars["--sage-700"] : "1px solid var(--paper-300)",
                background: active ? "rgba(0,0,0,0.02)" : "var(--surface)",
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 6, background: m.vars["--sage-700"] }}/>
                  <div style={{ width: 18, height: 18, borderRadius: 6, background: m.vars["--sage-600"] }}/>
                  <div style={{ width: 18, height: 18, borderRadius: 6, background: m.vars["--paper-150"], border: "1px solid rgba(0,0,0,0.06)" }}/>
                  <div style={{ width: 18, height: 18, borderRadius: 6, background: m.vars["--paper-300"], border: "1px solid rgba(0,0,0,0.06)" }}/>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-900)" }}>{m.label}</div>
                <div style={{ fontSize: 10, color: "var(--ink-600)", lineHeight: 1.4 }}>{m.hint}</div>
              </button>
            );
          })}
        </div>
      </TweakSection>

      <TweakSection label="Form language">
        <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: -4, marginBottom: 8, lineHeight: 1.5 }}>Corner radii + shadow depth as a unit.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {Object.entries(FORMS).map(([id, f]) => {
            const active = tweaks.form === id;
            const sample = id === "soft" ? 18 : id === "crisp" ? 8 : 0;
            return (
              <button key={id} onClick={() => setTweak("form", id)} style={{
                padding: 10, cursor: "pointer", textAlign: "center",
                border: active ? "1.5px solid var(--sage-700)" : "1px solid var(--paper-300)",
                borderRadius: 10,
                background: active ? "rgba(0,0,0,0.02)" : "var(--surface)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: 38, height: 26, background: "var(--sage-700)",
                  borderRadius: sample,
                  boxShadow: id === "soft" ? "0 4px 12px rgba(0,0,0,0.12)"
                          : id === "crisp" ? "0 1px 2px rgba(0,0,0,0.10)"
                          : "0 0 0 1.5px rgba(0,0,0,0.20)",
                }}/>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-900)" }}>{f.label}</div>
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 8, lineHeight: 1.5 }}>{(FORMS[tweaks.form] || FORMS.soft).hint}</div>
      </TweakSection>

      <TweakSection label="Type voice">
        <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: -4, marginBottom: 8, lineHeight: 1.5 }}>Display + body family swap.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(VOICES).map(([id, v]) => {
            const active = tweaks.voice === id;
            return (
              <button key={id} onClick={() => setTweak("voice", id)} style={{
                padding: "10px 12px", cursor: "pointer", textAlign: "left",
                border: active ? "1.5px solid var(--sage-700)" : "1px solid var(--paper-300)",
                borderRadius: 10,
                background: active ? "rgba(0,0,0,0.02)" : "var(--surface)",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: v.display, color: "var(--ink-900)" }}>{v.label}</div>
                  <div style={{ fontSize: 10, color: "var(--ink-600)", marginTop: 2 }}>{v.hint}</div>
                </div>
                <div style={{ fontSize: 22, fontFamily: v.display, fontWeight: 700, color: "var(--sage-700)", letterSpacing: v.tracking }}>Aa</div>
              </button>
            );
          })}
        </div>
      </TweakSection>

      <TweakRadio
        label="Density"
        value={tweaks.density}
        onChange={(v) => setTweak("density", v)}
        options={[
          { value: "compact", label: "Compact" },
          { value: "regular", label: "Regular" },
          { value: "airy",    label: "Airy" },
        ]}
      />
    </TweaksPanel>
  );
}

// Mount the tweaks panel into its own root.
const tweaksRoot = document.createElement("div");
tweaksRoot.id = "__journey-tweaks-root";
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(<JourneyTweaks/>);
