/* @ds-bundle: {"format":3,"namespace":"InManDesignSystem_019dd0","components":[],"sourceHashes":{"journeys/AddingInventory.jsx":"b6c55f6df889","journeys/CheckingStock.jsx":"9b27a0400a8a","journeys/CrewManagement.jsx":"7a4fae5eafa8","journeys/JourneyShell.jsx":"d4a2fa568e44","journeys/Onboarding.jsx":"553e335cc6a6","journeys/SpaceReorganization.jsx":"be9845c3ad85","journeys/SpaceSetup.jsx":"3ef48b590d2f","journeys/design-canvas.jsx":"5d0e39003628","journeys/journey-tweaks.jsx":"cd925b35cc5e","tweaks-panel.jsx":"57fac7f3caf9","ui_kits/inman-app/Brand.jsx":"2d02b3e1ed88","ui_kits/inman-app/Buttons.jsx":"cba00ff2bf21","ui_kits/inman-app/Cards.jsx":"c7953c75507c","ui_kits/inman-app/Components.jsx":"b2af2044077b","ui_kits/inman-app/Dashboard.jsx":"f6b4ad372bb3","ui_kits/inman-app/Icons.jsx":"268cf59d6082","ui_kits/inman-app/Onboarding.jsx":"8558172fba66","ui_kits/inman-app/Screens.jsx":"dae92def6e3d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.InManDesignSystem_019dd0 = window.InManDesignSystem_019dd0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// journeys/AddingInventory.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Adding Inventory journey screens.

/* ── 01 Search products (entry) ───────────────────────────── */
const AI_ProductSearch = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Add item",
  right: /*#__PURE__*/React.createElement("button", {
    style: {
      background: "transparent",
      border: "none",
      color: "var(--sage-700)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Scan")
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 20px 12px"
  }
}, /*#__PURE__*/React.createElement(SearchBar, {
  value: "cinnamon",
  onChange: () => {},
  placeholder: "Search products\u2026",
  autoFocus: true
})), /*#__PURE__*/React.createElement(ScreenBody, {
  style: {
    paddingTop: 0
  }
}, /*#__PURE__*/React.createElement(Segmented, {
  options: [{
    label: "All",
    value: "all"
  }, {
    label: "Catalog",
    value: "cat"
  }, {
    label: "My inventory",
    value: "mine"
  }],
  value: "all",
  onChange: () => {}
}), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "CATALOG MATCHES \xB7 4"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, [{
  name: "Ground Cinnamon",
  brand: "McCormick",
  size: "2.37 oz",
  img: "🥄"
}, {
  name: "Cinnamon Sticks",
  brand: "Spice Islands",
  size: "1.5 oz",
  img: "🌿"
}, {
  name: "Saigon Cinnamon",
  brand: "Frontier Co-op",
  size: "1.74 oz",
  img: "🥄"
}, {
  name: "Vietnamese Cinnamon",
  brand: "Penzeys",
  size: "2 oz",
  img: "🥄"
}].map((p, i) => /*#__PURE__*/React.createElement(ProductRow, _extends({
  key: i
}, p)))), /*#__PURE__*/React.createElement("button", {
  style: {
    marginTop: 6,
    background: "transparent",
    border: "2px dashed var(--paper-300)",
    borderRadius: 12,
    padding: "16px 14px",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "var(--sage-700)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement(IconPlus, {
  size: 18,
  color: "#fff"
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, "Can't find it? Create custom"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, "Adds to your crew's catalog")))));
const ProductRow = ({
  name,
  brand,
  size,
  img,
  alreadyHave
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-50)",
    borderRadius: 12,
    padding: 12,
    boxShadow: "var(--shadow-ambient-sm)",
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 48,
    height: 48,
    borderRadius: 10,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0
  }
}, img), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ink-900)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}, name), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, brand, " \xB7 ", size), alreadyHave && /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement(Chip, {
  variant: "sage"
}, "In inventory \xB7 2"))), /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 20,
  color: "var(--ink-400)"
}));

/* ── 02 Already in inventory match ─────────────────────────── */
const AI_ExistingMatch = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Already in inventory"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(Alert, {
  kind: "info",
  title: "You already have this"
}, "Ground Cinnamon \xB7 McCormick \xB7 2.37 oz is at 2 locations. You can restock an existing one or add a new one."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, [{
  loc: "Kitchen › Back › Above › Cabinet 1 › Spice Rack › Shelf 1",
  qty: "1 jar · 65% full",
  expiry: "exp. May 2027"
}, {
  loc: "Pantry › Center › Shelf 3",
  qty: "1 jar · sealed",
  expiry: "exp. Jul 2027"
}].map((r, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    background: "var(--paper-50)",
    borderRadius: 12,
    padding: 14,
    boxShadow: "var(--shadow-ambient-sm)"
  }
}, /*#__PURE__*/React.createElement(PathCrumb, {
  parts: r.loc.split(" › ")
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, r.qty), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, r.expiry)), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8,
    marginTop: 12
  }
}, /*#__PURE__*/React.createElement(SecondaryButton, null, "Restock this"), /*#__PURE__*/React.createElement(PrimaryButton, null, "+ Quantity"))))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 4
  }
}, /*#__PURE__*/React.createElement(TextButton, null, "Add as new instance instead"))));

/* ── 03 Create custom product ──────────────────────────────── */
const AI_CreateCustom = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Create product"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(Alert, {
  kind: "info",
  title: "This adds to your crew's catalog"
}, "Custom products are private to your crew. You can edit them later."), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 8,
    height: 140
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 56,
    height: 56,
    borderRadius: 12,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement(IconCamera, {
  size: 24
})), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    color: "var(--ink-700)"
  }
}, "Add photo")), /*#__PURE__*/React.createElement(Field, {
  label: "PRODUCT NAME *",
  value: "Homemade chili oil",
  onChange: () => {}
}), /*#__PURE__*/React.createElement(Field, {
  label: "BRAND",
  value: "",
  onChange: () => {},
  placeholder: "Optional"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "SIZE",
  value: "500",
  onChange: () => {}
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "UNIT",
  value: "ml",
  onChange: () => {}
}))), /*#__PURE__*/React.createElement(Field, {
  label: "CATEGORY",
  value: "Pantry \u203A Condiments",
  onChange: () => {}
})), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Continue to details")));

/* ── 04 Inventory details (the second of the two-step add) ─── */
const AI_Details = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Add to inventory",
  right: /*#__PURE__*/React.createElement("span", {
    className: "label-eyebrow",
    style: {
      color: "var(--sage-700)"
    }
  }, "STEP 2 OF 2")
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "0 0 4px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 56,
    height: 56,
    borderRadius: 12,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26
  }
}, "\uD83E\uDD44"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 16,
    color: "var(--ink-900)"
  }
}, "Ground Cinnamon"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, "McCormick \xB7 2.37 oz"))), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "WHERE"), /*#__PURE__*/React.createElement("button", {
  style: {
    width: "100%",
    textAlign: "left",
    border: "2px solid var(--paper-300)",
    borderRadius: 12,
    padding: 14,
    background: "var(--paper-50)",
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement(PathCrumb, {
  parts: ["Walker Home", "Kitchen", "Back", "Above", "Cabinet 1", "Spice Rack", "Shelf 1"]
}), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink-900)",
    marginTop: 6
  }
}, "Shelf 1"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--sage-700)",
    marginTop: 2
  }
}, "Tap to change location")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "QUANTITY",
  value: "1",
  onChange: () => {}
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "EXPIRY",
  value: "May 2027",
  onChange: () => {}
}))), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "FILL LEVEL"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 6
  }
}, ["Sealed", "Full", "¾", "½", "¼", "Empty"].map((l, i) => /*#__PURE__*/React.createElement(Chip, {
  key: i,
  selected: i === 0
}, l))), /*#__PURE__*/React.createElement(Field, {
  label: "NOTES",
  value: "",
  onChange: () => {},
  placeholder: "Optional \u2014 for the crew",
  multiline: true
})), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Add to inventory"), /*#__PURE__*/React.createElement(TextButton, null, "Add & add another")));

/* ── 05 Stay-in-flow (toast + reset) ─────────────────────── */
const AI_StayInFlow = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Add another"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(Alert, {
  kind: "success",
  title: "Added \u2014 Ground Cinnamon"
}, "Saved to Cabinet 1 \u203A Spice Rack \u203A Shelf 1. ", /*#__PURE__*/React.createElement("b", null, "3 items"), " added in this session."), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 8
  }
}, "STAYING IN"), /*#__PURE__*/React.createElement(PathCrumb, {
  parts: ["Kitchen", "Back", "Above", "Cabinet 1", "Spice Rack", "Shelf 1"]
}), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-700)",
    marginTop: 8
  }
}, "Next item will land here too. Tap to change location.")), /*#__PURE__*/React.createElement(SearchBar, {
  value: "",
  onChange: () => {},
  placeholder: "Search next product\u2026"
}), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "RECENTLY ADDED IN THIS SPOT"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, /*#__PURE__*/React.createElement(ProductRow, {
  name: "Smoked Paprika",
  brand: "McCormick",
  size: "2.12 oz",
  img: "\uD83C\uDF36"
}), /*#__PURE__*/React.createElement(ProductRow, {
  name: "Cumin Seeds",
  brand: "Spice Islands",
  size: "1.6 oz",
  img: "\uD83C\uDF3F"
}))), /*#__PURE__*/React.createElement(CtaTray, {
  light: true
}, /*#__PURE__*/React.createElement(SecondaryButton, null, "Done \u2014 I'm finished")), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 100,
    background: "var(--ink-900)",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)"
  }
}, /*#__PURE__*/React.createElement(IconCheck, {
  size: 18,
  color: "#fff"
}), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    flex: 1
  }
}, "3 items added in 2 minutes"), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 12,
    color: "var(--sage-300, #A8C9B5)"
  }
}, "UNDO")));

/* ── 06 Restock sub-flow ─────────────────────────────────── */
const AI_Restock = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Restock"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 12,
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 56,
    height: 56,
    borderRadius: 12,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26
  }
}, "\uD83E\uDD44"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 16,
    color: "var(--ink-900)"
  }
}, "Ground Cinnamon"), /*#__PURE__*/React.createElement(PathCrumb, {
  parts: ["Cabinet 1", "Spice Rack", "Shelf 1"]
}))), /*#__PURE__*/React.createElement(Alert, {
  kind: "warn",
  title: "Currently 25% full \xB7 expires May 2027"
}, "Adding fresh stock. The old jar's expiry stays attached to its remaining contents."), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "HOW MUCH ARE YOU ADDING?"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "ADDITIONAL QTY",
  value: "1",
  onChange: () => {}
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "NEW EXPIRY",
  value: "Apr 2028",
  onChange: () => {}
}))), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "WHAT TO DO WITH THE EXISTING"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  }
}, /*#__PURE__*/React.createElement(RadioCard, {
  title: "Combine \u2014 same jar",
  body: "Treat as one. Use the newer expiry. Best when refilling a single container.",
  selected: true
}), /*#__PURE__*/React.createElement(RadioCard, {
  title: "Keep as separate batch",
  body: "Two jars side-by-side. Track each expiry independently."
}))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Confirm restock")));

/* ── 07 Barcode scan ─────────────────────────────────────── */
const AI_Scan = () => /*#__PURE__*/React.createElement("div", {
  style: {
    width: 390,
    height: 844,
    position: "relative",
    overflow: "hidden",
    background: "#0a0a0a"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: "44px 20px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("button", {
  style: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.5)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement(IconBack, {
  size: 20,
  color: "#fff"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "#fff"
  }
}, "Scan barcode"), /*#__PURE__*/React.createElement("button", {
  style: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.5)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff"
  }
}, "\u26A1")), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: "38%",
    left: "10%",
    right: "10%",
    height: 200,
    border: "2px solid rgba(255,255,255,0.6)",
    borderRadius: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 2,
    background: "var(--sage-300, #A8C9B5)",
    boxShadow: "0 0 8px rgba(168,201,181,0.8)"
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#fff"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 16
  }
}, "Hold steady"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    opacity: 0.8,
    marginTop: 4
  }
}, "Detecting barcode\u2026")), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 32,
    background: "var(--paper-50)",
    borderRadius: 16,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 12px 32px rgba(0,0,0,0.4)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 48,
    height: 48,
    borderRadius: 10,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22
  }
}, "\uD83E\uDD44"), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, "Ground Cinnamon"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, "McCormick \xB7 2.37 oz")), /*#__PURE__*/React.createElement(PrimaryButton, null, "Add")));

/* ── 08 Bulk import: column mapping ───────────────────────── */
const AI_BulkMapping = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Bulk import",
  right: /*#__PURE__*/React.createElement("span", {
    className: "label-eyebrow",
    style: {
      color: "var(--sage-700)"
    }
  }, "2 / 4")
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
  title: "Map your columns",
  body: "We detected 47 rows in inventory.csv. Confirm what each column means."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, [{
  col: "name",
  sample: "Ground Cinnamon, Vanilla Extract…",
  mapped: "Product name",
  confident: true
}, {
  col: "brand",
  sample: "McCormick, Penzeys…",
  mapped: "Brand",
  confident: true
}, {
  col: "qty",
  sample: "1, 2, 3…",
  mapped: "Quantity",
  confident: true
}, {
  col: "loc",
  sample: "Cabinet 1, Pantry…",
  mapped: "Location (will resolve)",
  confident: false
}, {
  col: "exp",
  sample: "5/27, 7/2027…",
  mapped: "Expiry date",
  confident: true
}, {
  col: "notes",
  sample: "—",
  mapped: "Skip",
  confident: false,
  skipped: true
}].map((c, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    background: "var(--paper-50)",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    opacity: c.skipped ? 0.55 : 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-mono, monospace)",
    fontWeight: 700,
    fontSize: 13,
    color: "var(--ink-900)"
  }
}, c.col), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    color: "var(--ink-500)",
    marginTop: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}, c.sample)), /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 16,
  color: "var(--ink-400)"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1.2,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    color: c.skipped ? "var(--ink-500)" : "var(--ink-900)"
  }
}, c.mapped), !c.confident && !c.skipped && /*#__PURE__*/React.createElement(Chip, {
  variant: "warn"
}, "Review")))))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Preview & import")));

/* ── 09 Quick add (PIN/kiosk mode) ────────────────────────── */
const AI_Quick = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
  style: {
    height: 56,
    padding: "0 20px",
    background: "var(--sage-700)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14
  }
}, "Quick add"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    opacity: 0.85
  }
}, "Walker Home \xB7 Kiosk")), /*#__PURE__*/React.createElement("button", {
  style: {
    background: "rgba(255,255,255,0.16)",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 9999,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 12
  }
}, "EXIT")), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
  title: "What did you just put away?",
  body: "Anyone can use this. No login needed."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10
  }
}, [{
  glyph: "🥛",
  label: "Milk"
}, {
  glyph: "🥚",
  label: "Eggs"
}, {
  glyph: "🍞",
  label: "Bread"
}, {
  glyph: "🧀",
  label: "Cheese"
}, {
  glyph: "🍅",
  label: "Tomatoes"
}, {
  glyph: "📷",
  label: "Scan"
}].map((q, i) => /*#__PURE__*/React.createElement("button", {
  key: i,
  style: {
    border: "none",
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    boxShadow: "var(--shadow-ambient-sm)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 32
  }
}, q.glyph), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, q.label)))), /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: "center",
    paddingTop: 8
  }
}, /*#__PURE__*/React.createElement(TextButton, null, "Search instead"))));
Object.assign(window, {
  AI_ProductSearch,
  AI_ExistingMatch,
  AI_CreateCustom,
  AI_Details,
  AI_StayInFlow,
  AI_Restock,
  AI_Scan,
  AI_BulkMapping,
  AI_Quick,
  ProductRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/AddingInventory.jsx", error: String((e && e.message) || e) }); }

// journeys/CheckingStock.jsx
try { (() => {
// Checking Stock journey screens.

const stockItems = [{
  name: "Ground Cinnamon",
  brand: "McCormick · 2.37 oz",
  glyph: "🥄",
  loc: "Cabinet 1 › Spice Rack",
  status: "low",
  statusLabel: "Low · 25%",
  expiry: "May 2027"
}, {
  name: "Vanilla Extract",
  brand: "Nielsen-Massey · 4 oz",
  glyph: "🍶",
  loc: "Cabinet 1 › Spice Rack",
  status: "ok",
  statusLabel: "Sealed",
  expiry: "Jan 2028"
}, {
  name: "Olive Oil",
  brand: "Frantoia · 750 ml",
  glyph: "🫒",
  loc: "Pantry › Center › Shelf 2",
  status: "ok",
  statusLabel: "75% full",
  expiry: "Mar 2026"
}, {
  name: "Whole Milk",
  brand: "Straus · 1 gal",
  glyph: "🥛",
  loc: "Fridge › Door",
  status: "exp",
  statusLabel: "Exp. tomorrow",
  expiry: "Apr 28, 2026"
}, {
  name: "Smoked Paprika",
  brand: "McCormick · 2.12 oz",
  glyph: "🌶",
  loc: "Cabinet 1 › Spice Rack",
  status: "ok",
  statusLabel: "Half full",
  expiry: "Aug 2027"
}, {
  name: "Yeast",
  brand: "Red Star · 4 oz",
  glyph: "🥖",
  loc: "Pantry › Top › Shelf 1",
  status: "out",
  statusLabel: "Out",
  expiry: "—"
}];
const StockRow = ({
  item,
  expanded
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-50)",
    borderRadius: 12,
    boxShadow: "var(--shadow-ambient-sm)",
    overflow: "hidden"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0
  }
}, item.glyph), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ink-900)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}, item.name), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    color: "var(--ink-500)",
    marginTop: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}, item.loc)), /*#__PURE__*/React.createElement(StatusPill, {
  kind: item.status
}, item.statusLabel)), expanded && /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 14px 14px",
    borderTop: "1px solid var(--paper-200)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    paddingTop: 12
  }
}, /*#__PURE__*/React.createElement(KV, {
  label: "Brand",
  value: item.brand
}), /*#__PURE__*/React.createElement(KV, {
  label: "Location",
  value: item.loc
}), /*#__PURE__*/React.createElement(KV, {
  label: "Expiry",
  value: item.expiry
}), /*#__PURE__*/React.createElement(KV, {
  label: "Last seen",
  value: "Today by Davontae"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8,
    marginTop: 12
  }
}, /*#__PURE__*/React.createElement(SecondaryButton, null, "\u2212 Use some"), /*#__PURE__*/React.createElement(SecondaryButton, null, "+ Restock"), /*#__PURE__*/React.createElement(PrimaryButton, null, "Edit"))));

/* ── 01 List ─────────────────────────────────────────────── */
const CS_List = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 20px 8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    color: "var(--sage-700)"
  }
}, "WALKER HOME"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 22,
    color: "var(--ink-900)"
  }
}, "Inventory")), /*#__PURE__*/React.createElement("div", {
  style: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement(IconPlus, {
  size: 20
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 20px 8px"
  }
}, /*#__PURE__*/React.createElement(SearchBar, {
  value: "",
  onChange: () => {},
  placeholder: "Search 247 items\u2026"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 20px 12px",
    display: "flex",
    gap: 6,
    overflowX: "auto"
  }
}, /*#__PURE__*/React.createElement(Chip, {
  selected: true
}, "All \xB7 247"), /*#__PURE__*/React.createElement(Chip, null, "Low \xB7 12"), /*#__PURE__*/React.createElement(Chip, null, "Expiring \xB7 3"), /*#__PURE__*/React.createElement(Chip, null, "Out \xB7 4")), /*#__PURE__*/React.createElement(ScreenBody, {
  style: {
    paddingTop: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "SORTED BY UPDATED"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, stockItems.map((it, i) => /*#__PURE__*/React.createElement(StockRow, {
  key: i,
  item: it
})))), /*#__PURE__*/React.createElement(BottomNav, {
  active: "inventory"
}));

/* ── 02 Inline expansion ──────────────────────────────────── */
const CS_Expanded = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Inventory"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 20px 12px"
  }
}, /*#__PURE__*/React.createElement(SearchBar, {
  value: "cinnamon",
  onChange: () => {}
})), /*#__PURE__*/React.createElement(ScreenBody, {
  style: {
    paddingTop: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, /*#__PURE__*/React.createElement(StockRow, {
  item: stockItems[0],
  expanded: true
}), /*#__PURE__*/React.createElement(StockRow, {
  item: stockItems[1]
}), /*#__PURE__*/React.createElement(StockRow, {
  item: stockItems[4]
}))));

/* ── 03 Filter sheet ──────────────────────────────────────── */
const CS_Filters = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Inventory"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 20px 12px",
    flex: 1,
    opacity: 0.5,
    filter: "blur(2px)"
  }
}, /*#__PURE__*/React.createElement(SearchBar, {
  value: "",
  onChange: () => {}
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 12
  }
}, stockItems.slice(0, 3).map((it, i) => /*#__PURE__*/React.createElement(StockRow, {
  key: i,
  item: it
})))), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    background: "var(--paper-50)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: "12px 24px 32px",
    boxShadow: "0 -8px 32px rgba(28,28,24,0.18)",
    display: "flex",
    flexDirection: "column",
    gap: 18
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 40,
    height: 4,
    borderRadius: 9999,
    background: "var(--paper-300)",
    margin: "8px auto 4px"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline"
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "headline-md"
}, "Filter"), /*#__PURE__*/React.createElement("button", {
  style: {
    background: "transparent",
    border: "none",
    color: "var(--sage-700)",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13
  }
}, "Reset")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 8
  }
}, "STATUS"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6
  }
}, /*#__PURE__*/React.createElement(Chip, {
  selected: true
}, "Low"), /*#__PURE__*/React.createElement(Chip, null, "Out"), /*#__PURE__*/React.createElement(Chip, {
  selected: true
}, "Expiring soon"), /*#__PURE__*/React.createElement(Chip, null, "Sealed"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 8
  }
}, "LOCATION"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6
  }
}, /*#__PURE__*/React.createElement(Chip, {
  selected: true
}, "Kitchen"), /*#__PURE__*/React.createElement(Chip, null, "Pantry"), /*#__PURE__*/React.createElement(Chip, null, "Fridge"), /*#__PURE__*/React.createElement(Chip, null, "Garage"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 8
  }
}, "ADDED BY"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6
  }
}, /*#__PURE__*/React.createElement(Chip, null, "Anyone"), /*#__PURE__*/React.createElement(Chip, {
  selected: true
}, "Me"), /*#__PURE__*/React.createElement(Chip, null, "Davontae"), /*#__PURE__*/React.createElement(Chip, null, "Kiosk"))), /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Show 18 results")));

/* ── 04 Browse by space ──────────────────────────────────── */
const CS_BySpace = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Browse spaces"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(Segmented, {
  options: [{
    label: "List",
    value: "list"
  }, {
    label: "Spaces",
    value: "spaces"
  }],
  value: "spaces"
}), /*#__PURE__*/React.createElement(Tree, {
  nodes: [{
    unit: "premises",
    name: "Walker Home"
  }, {
    unit: "area",
    name: "Kitchen",
    depth: 1,
    focused: true
  }]
}), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "INSIDE KITCHEN \xB7 38 ITEMS"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, [{
  name: "Back › Above",
  count: 14,
  glyph: "📍"
}, {
  name: "Back › Below",
  count: 8,
  glyph: "📍"
}, {
  name: "Back › Counter",
  count: 6,
  glyph: "📍"
}, {
  name: "Center › Island",
  count: 4,
  glyph: "📍"
}, {
  name: "Side › Drawer 1",
  count: 6,
  glyph: "📍"
}].map((g, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    background: "var(--paper-50)",
    borderRadius: 12,
    padding: 14,
    boxShadow: "var(--shadow-ambient-sm)",
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16
  }
}, g.glyph), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, g.name), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, g.count, " items")), /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 18,
  color: "var(--ink-400)"
}))))));

/* ── 05 Alerts summary ───────────────────────────────────── */
const CS_Alerts = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Alerts",
  right: /*#__PURE__*/React.createElement(Chip, {
    variant: "error"
  }, "3")
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(Alert, {
  kind: "error",
  title: "1 expires tomorrow"
}, "Whole Milk \xB7 Straus \xB7 expires Apr 28"), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "EXPIRING THIS WEEK \xB7 3"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, [stockItems[3]].map((it, i) => /*#__PURE__*/React.createElement(StockRow, {
  key: i,
  item: it
})), /*#__PURE__*/React.createElement(StockRow, {
  item: {
    ...stockItems[2],
    status: "exp",
    statusLabel: "Exp. in 3 days"
  }
})), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginTop: 8
  }
}, "LOW STOCK \xB7 12"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, [stockItems[0], stockItems[5]].map((it, i) => /*#__PURE__*/React.createElement(StockRow, {
  key: i,
  item: it
})))));

/* ── 06 Empty / no results ───────────────────────────────── */
const CS_Empty = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Inventory"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 20px 12px"
  }
}, /*#__PURE__*/React.createElement(SearchBar, {
  value: "quinoa",
  onChange: () => {}
})), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(EmptyState, {
  icon: /*#__PURE__*/React.createElement(IconBox, {
    size: 32
  }),
  title: "No matches for \u201Cquinoa\u201D",
  body: "Try a different word, or add it to your inventory.",
  action: /*#__PURE__*/React.createElement(PrimaryButton, null, "+ Add quinoa")
}), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "DID YOU MEAN"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6
  }
}, /*#__PURE__*/React.createElement(Chip, null, "Couscous"), /*#__PURE__*/React.createElement(Chip, null, "Rice"), /*#__PURE__*/React.createElement(Chip, null, "Farro"))));
Object.assign(window, {
  CS_List,
  CS_Expanded,
  CS_Filters,
  CS_BySpace,
  CS_Alerts,
  CS_Empty,
  StockRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/CheckingStock.jsx", error: String((e && e.message) || e) }); }

// journeys/CrewManagement.jsx
try { (() => {
// Crew Management journey screens — switcher, settings, members, invite, permissions, transfer, deletion countdown.

const Avatar = ({
  name,
  color = "var(--sage-700)",
  size = 36
}) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: color,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: size * 0.38,
      flexShrink: 0
    }
  }, initials);
};
const RolePill = ({
  role
}) => {
  const map = {
    Owner: {
      bg: "var(--sage-700)",
      fg: "#fff"
    },
    Admin: {
      bg: "rgba(74,130,101,0.16)",
      fg: "var(--sage-700)"
    },
    Member: {
      bg: "var(--paper-300)",
      fg: "var(--ink-700)"
    },
    Viewer: {
      bg: "var(--paper-200)",
      fg: "var(--ink-600)"
    }
  };
  const s = map[role] || map.Member;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "3px 9px",
      borderRadius: 9999,
      background: s.bg,
      color: s.fg,
      fontFamily: "var(--font-body)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 0.4,
      textTransform: "uppercase"
    }
  }, role);
};

/* ── CM_Switcher ── Long-press the crew name in the header. ────── */
const CM_Switcher = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Crews",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, [{
  name: "Walker Family",
  members: 4,
  role: "Owner",
  active: true,
  tint: "var(--sage-700)"
}, {
  name: "The Lake House",
  members: 6,
  role: "Admin",
  active: false,
  tint: "#7C5BB1"
}, {
  name: "Sycamore Bar",
  members: 11,
  role: "Member",
  active: false,
  tint: "#B65D2C"
}].map(c => /*#__PURE__*/React.createElement("div", {
  key: c.name,
  style: {
    background: c.active ? "var(--paper-100)" : "transparent",
    border: c.active ? "1.5px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
    borderRadius: 14,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: c.tint,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 16
  }
}, c.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 8
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    color: "var(--ink-900)"
  }
}, c.name), c.active && /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 10,
    color: "var(--sage-700)",
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  }
}, "Active")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, c.members, " members \xB7 ", c.role)), c.active && /*#__PURE__*/React.createElement(IconCheck, {
  size: 18,
  color: "var(--sage-700)"
}))), /*#__PURE__*/React.createElement("button", {
  style: {
    marginTop: 8,
    background: "transparent",
    border: "1.5px dashed var(--paper-300)",
    borderRadius: 14,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "var(--sage-700)",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement(IconPlus, {
  size: 18
}), " Create or join another Crew"))));

/* ── CM_Settings ── Crew settings landing. ─────────────────────── */
const CM_Settings = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Walker Family",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "linear-gradient(135deg, var(--sage-700) 0%, var(--sage-600) 100%)",
    borderRadius: 16,
    padding: 18,
    color: "#fff",
    marginBottom: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    color: "rgba(255,255,255,0.7)"
  }
}, "Crew \xB7 Owner"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 20,
    marginTop: 4
  }
}, "Walker Family"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    opacity: 0.85,
    marginTop: 4
  }
}, "Created Mar 14, 2026 \xB7 4 members \xB7 247 items")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)",
    margin: "8px 4px"
  }
}, "Manage"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16
  }
}, [{
  label: "Members",
  sub: "4 active · 1 pending invite",
  icon: /*#__PURE__*/React.createElement(IconShare, null),
  badge: "1"
}, {
  label: "Invites",
  sub: "Send and revoke invitations",
  icon: /*#__PURE__*/React.createElement(IconShare, null)
}, {
  label: "Permissions",
  sub: "Per-feature overrides",
  icon: /*#__PURE__*/React.createElement(IconCheck, null)
}, {
  label: "Crew preferences",
  sub: "Currency, units, expiry tiers",
  icon: /*#__PURE__*/React.createElement(IconInfo, null)
}].map((row, i, arr) => /*#__PURE__*/React.createElement("button", {
  key: row.label,
  style: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderBottom: i < arr.length - 1 ? "1px solid var(--paper-300)" : "none",
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(74,130,101,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--sage-700)"
  }
}, row.icon), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, row.label), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, row.sub)), row.badge && /*#__PURE__*/React.createElement("span", {
  style: {
    background: "var(--error)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 9999,
    padding: "2px 7px"
  }
}, row.badge), /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 18,
  color: "var(--ink-400)"
})))), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)",
    margin: "8px 4px"
  }
}, "Owner zone"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14
  }
}, /*#__PURE__*/React.createElement("button", {
  style: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    padding: "14px 16px",
    borderBottom: "1px solid var(--paper-300)",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ink-900)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, "Transfer ownership ", /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 18,
  color: "var(--ink-400)"
})), /*#__PURE__*/React.createElement("button", {
  style: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    padding: "14px 16px",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--error)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, "Delete crew ", /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 18,
  color: "var(--ink-400)"
})))));

/* ── CM_Members ── List of crew members + pending invites. ────── */
const CM_Members = () => {
  const data = [{
    name: "Jamal Walker",
    role: "Owner",
    you: true,
    color: "var(--sage-700)",
    sub: "joined Mar 14"
  }, {
    name: "Naomi Walker",
    role: "Admin",
    color: "#B65D2C",
    sub: "joined Mar 16"
  }, {
    name: "Mia Walker",
    role: "Member",
    color: "#7C5BB1",
    sub: "joined Mar 22 · last seen 2h ago"
  }, {
    name: "Ben Walker",
    role: "Viewer",
    color: "#3F6F8A",
    sub: "joined Apr 02 · child mode"
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    title: "Members",
    onBack: () => {},
    right: /*#__PURE__*/React.createElement("button", {
      "aria-label": "Invite",
      style: {
        width: 36,
        height: 36,
        borderRadius: 9999,
        background: "var(--sage-700)",
        color: "#fff",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement(IconPlus, {
      size: 18
    }))
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper-100)",
      borderRadius: 14,
      padding: 4
    }
  }, data.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: m.name,
    style: {
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderBottom: i < data.length - 1 ? "1px solid var(--paper-300)" : "none"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: m.name,
    color: m.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 14,
      color: "var(--ink-900)"
    }
  }, m.name), m.you && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 10,
      color: "var(--sage-700)",
      fontWeight: 700,
      letterSpacing: 0.4
    }
  }, "\xB7 You")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "var(--ink-600)",
      marginTop: 1
    }
  }, m.sub)), /*#__PURE__*/React.createElement(RolePill, {
    role: m.role
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: "var(--ink-500)",
      margin: "20px 4px 8px"
    }
  }, "Pending invites \xB7 1"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper-100)",
      borderRadius: 14,
      padding: 14,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9999,
      background: "rgba(217,119,6,0.14)",
      color: "#A05A05",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(IconClock, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 14,
      color: "var(--ink-900)"
    }
  }, "aunt.dee@email.com"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "var(--ink-600)"
    }
  }, "Member \xB7 sent 3 days ago \xB7 expires in 4 days")), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "transparent",
      border: "none",
      color: "var(--ink-600)",
      padding: 6,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(IconMore, {
    size: 18
  })))));
};

/* ── CM_Invite ── Send an invite — sheet. ──────────────────────── */
const CM_Invite = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    background: "rgba(28,28,24,0.55)",
    backdropFilter: "blur(4px)"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    background: "var(--surface)",
    borderRadius: "24px 24px 0 0",
    padding: "12px 20px 24px",
    boxShadow: "0 -8px 32px rgba(0,0,0,0.18)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 36,
    height: 4,
    borderRadius: 9999,
    background: "var(--paper-300)",
    margin: "0 auto 12px"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 22,
    color: "var(--ink-900)",
    letterSpacing: "-0.01em"
  }
}, "Invite to Walker Family"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)",
    marginTop: 4,
    marginBottom: 18
  }
}, "They'll be able to view and edit inventory based on the role you give them."), /*#__PURE__*/React.createElement(Field, {
  label: "Email or phone",
  placeholder: "aunt.dee@email.com",
  value: "aunt.dee@email.com"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-700)",
    marginBottom: 8
  }
}, "Role"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8
  }
}, [{
  id: "admin",
  label: "Admin",
  sub: "Can manage members + spaces"
}, {
  id: "member",
  label: "Member",
  sub: "Can edit inventory",
  on: true
}, {
  id: "viewer",
  label: "Viewer",
  sub: "Can browse only"
}, {
  id: "child",
  label: "Child",
  sub: "Limited + kiosk PIN"
}].map(r => /*#__PURE__*/React.createElement("div", {
  key: r.id,
  style: {
    padding: 12,
    borderRadius: 12,
    border: r.on ? "1.5px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
    background: r.on ? "rgba(74,130,101,0.06)" : "var(--surface)",
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: r.on ? "var(--sage-700)" : "var(--ink-900)"
  }
}, r.label), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, r.sub))))), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14,
    padding: 12,
    background: "rgba(74,130,101,0.06)",
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink-900)"
  }
}, "Expires in 7 days"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    color: "var(--ink-600)"
  }
}, "You can change this in advanced options")), /*#__PURE__*/React.createElement(Toggle, {
  on: true
})), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 18,
    display: "flex",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(SecondaryButton, {
  style: {
    flex: 1
  }
}, "Cancel"), /*#__PURE__*/React.createElement(PrimaryButton, {
  style: {
    flex: 1.4
  }
}, "Send invite"))));

/* ── CM_Permissions ── Per-feature override matrix for one member. */
const CM_Permissions = () => {
  const features = [{
    id: "inventory",
    label: "Edit inventory",
    role: "Allowed",
    state: "default"
  }, {
    id: "spaces",
    label: "Manage spaces",
    role: "Allowed",
    state: "default"
  }, {
    id: "waste",
    label: "Log waste",
    role: "Allowed",
    state: "default"
  }, {
    id: "delete_inv",
    label: "Delete inventory items",
    role: "Denied",
    state: "override-deny"
  }, {
    id: "shopping",
    label: "Edit shopping lists",
    role: "Allowed",
    state: "default"
  }, {
    id: "recipes",
    label: "Edit recipes",
    role: "Denied",
    state: "default"
  }, {
    id: "exports",
    label: "Export data",
    role: "Allowed",
    state: "override-allow"
  }, {
    id: "kiosk",
    label: "Use kiosk",
    role: "Allowed",
    state: "default"
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    title: "Permissions",
    onBack: () => {}
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper-100)",
      borderRadius: 14,
      padding: 14,
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Mia Walker",
    color: "#7C5BB1"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 14
    }
  }, "Mia Walker"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "var(--ink-600)"
    }
  }, "Member \xB7 joined Mar 22")), /*#__PURE__*/React.createElement(RolePill, {
    role: "Member"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,130,101,0.08)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 16,
      display: "flex",
      alignItems: "flex-start",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconInfo, {
    size: 16,
    color: "var(--sage-700)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "var(--ink-700)",
      lineHeight: 1.5
    }
  }, "Permissions start from the role's defaults. Toggle a row to override for this member only.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper-100)",
      borderRadius: 14,
      overflow: "hidden"
    }
  }, features.map((f, i) => {
    const allow = f.state !== "override-deny" && (f.state === "override-allow" || f.role === "Allowed");
    const overridden = f.state.startsWith("override");
    return /*#__PURE__*/React.createElement("div", {
      key: f.id,
      style: {
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: i < features.length - 1 ? "1px solid var(--paper-300)" : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--ink-900)"
      }
    }, f.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: 11,
        color: overridden ? "var(--sage-700)" : "var(--ink-500)",
        marginTop: 1,
        fontWeight: overridden ? 600 : 400
      }
    }, overridden ? `Overridden — was ${f.role === "Allowed" ? "Allowed" : "Denied"}` : `Default · ${f.role}`)), /*#__PURE__*/React.createElement(Toggle, {
      on: allow
    }));
  }))));
};

/* ── CM_Transfer ── Transfer ownership confirmation. ─────────── */
const CM_Transfer = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Transfer ownership",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(217,119,6,0.10)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    display: "flex",
    gap: 12
  }
}, /*#__PURE__*/React.createElement(IconAlert, {
  size: 22,
  color: "#A05A05"
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "#7A4504"
  }
}, "This is irreversible"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "#7A4504",
    marginTop: 4,
    lineHeight: 1.5
  }
}, "Once you transfer ownership, you'll keep your Admin role but can no longer delete the crew or remove other Admins."))), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)",
    margin: "8px 4px"
  }
}, "Choose new owner \xB7 Admins only"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14
  }
}, [{
  name: "Naomi Walker",
  color: "#B65D2C",
  sub: "Admin · joined Mar 16",
  on: true
}, {
  name: "Marcus Walker",
  color: "#3F6F8A",
  sub: "Admin · joined Apr 12",
  on: false
}].map((p, i, arr) => /*#__PURE__*/React.createElement("div", {
  key: p.name,
  style: {
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderBottom: i < arr.length - 1 ? "1px solid var(--paper-300)" : "none"
  }
}, /*#__PURE__*/React.createElement(Avatar, {
  name: p.name,
  color: p.color
}), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14
  }
}, p.name), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, p.sub)), /*#__PURE__*/React.createElement("div", {
  style: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    border: p.on ? "6px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
    background: p.on ? "var(--sage-700)" : "transparent"
  }
})))), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 16
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "Type \"TRANSFER\" to confirm",
  placeholder: "TRANSFER",
  value: ""
}))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  style: {
    background: "var(--paper-300)",
    color: "var(--ink-500)"
  },
  disabled: true
}, "Confirm transfer")));

/* ── CM_DeleteBanner ── 48-hour countdown after delete request. */
const CM_DeleteBanner = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Walker Family",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "linear-gradient(180deg, rgba(186,26,26,0.08) 0%, rgba(186,26,26,0.02) 100%)",
    border: "1.5px solid rgba(186,26,26,0.30)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 12
  }
}, /*#__PURE__*/React.createElement(IconAlert, {
  size: 22,
  color: "var(--error)"
}), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 16,
    color: "var(--error)"
  }
}, "Crew deletion in progress")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-700)",
    lineHeight: 1.55
  }
}, "You requested to delete this crew on ", /*#__PURE__*/React.createElement("strong", null, "Apr 25 at 2:14 PM"), ". All members have been notified. The crew will be permanently deleted in:"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8,
    marginTop: 14
  }
}, [{
  v: "32",
  l: "hours"
}, {
  v: "47",
  l: "minutes"
}, {
  v: "06",
  l: "seconds"
}].map(t => /*#__PURE__*/React.createElement("div", {
  key: t.l,
  style: {
    flex: 1,
    background: "var(--surface)",
    border: "1px solid var(--paper-300)",
    borderRadius: 12,
    padding: "10px 4px",
    textAlign: "center"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 26,
    color: "var(--ink-900)",
    letterSpacing: "-0.02em",
    fontVariantNumeric: "tabular-nums"
  }
}, t.v), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)"
  }
}, t.l)))), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14,
    display: "flex",
    gap: 8
  }
}, /*#__PURE__*/React.createElement("button", {
  style: {
    flex: 1,
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: "var(--surface)",
    color: "var(--error)",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "inset 0 0 0 1.5px var(--error)"
  }
}, "Cancel deletion"))), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)",
    margin: "8px 4px"
  }
}, "What will be deleted"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 14,
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-700)",
    lineHeight: 1.7
  }
}, /*#__PURE__*/React.createElement("div", null, "\xB7 247 inventory items across 53 spaces"), /*#__PURE__*/React.createElement("div", null, "\xB7 12 recipes and all batch history"), /*#__PURE__*/React.createElement("div", null, "\xB7 4 member accounts will be removed from this crew"), /*#__PURE__*/React.createElement("div", null, "\xB7 Flow ledger will be archived but inaccessible"))));
Object.assign(window, {
  CM_Switcher,
  CM_Settings,
  CM_Members,
  CM_Invite,
  CM_Permissions,
  CM_Transfer,
  CM_DeleteBanner
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/CrewManagement.jsx", error: String((e && e.message) || e) }); }

// journeys/JourneyShell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Phone frame + scaffolding shared by every journey screen.
// All journey screens render at 390x844 inside a DCArtboard.

const PhoneFrame = ({
  children,
  statusBg = "var(--surface)",
  noStatus = false
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    width: 390,
    height: 844,
    background: "var(--surface)",
    overflow: "hidden",
    fontFamily: "var(--font-body)",
    borderRadius: 0
  }
}, !noStatus && /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    pointerEvents: "none",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    color: "var(--ink-900)",
    background: statusBg
  }
}, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
  style: {
    display: 'flex',
    gap: 6,
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "10",
  viewBox: "0 0 16 10",
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("rect", {
  x: "0",
  y: "6",
  width: "3",
  height: "4",
  rx: "0.5"
}), /*#__PURE__*/React.createElement("rect", {
  x: "4",
  y: "4",
  width: "3",
  height: "6",
  rx: "0.5"
}), /*#__PURE__*/React.createElement("rect", {
  x: "8",
  y: "2",
  width: "3",
  height: "8",
  rx: "0.5"
}), /*#__PURE__*/React.createElement("rect", {
  x: "12",
  y: "0",
  width: "3",
  height: "10",
  rx: "0.5"
})), /*#__PURE__*/React.createElement("svg", {
  width: "22",
  height: "10",
  viewBox: "0 0 22 10",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1"
}, /*#__PURE__*/React.createElement("rect", {
  x: "0.5",
  y: "0.5",
  width: "18",
  height: "9",
  rx: "2"
}), /*#__PURE__*/React.createElement("rect", {
  x: "2",
  y: "2",
  width: "14",
  height: "6",
  rx: "1",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("rect", {
  x: "20",
  y: "3.5",
  width: "1.5",
  height: "3",
  rx: "0.5",
  fill: "currentColor"
})))), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    paddingTop: noStatus ? 0 : 44,
    display: "flex",
    flexDirection: "column"
  }
}, children));

// Top app-bar — back button + title + optional right action.
const AppBar = ({
  onBack,
  title,
  right,
  onClose,
  helpAction,
  transparent = false
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    height: 56,
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: transparent ? "transparent" : "var(--surface)",
    flexShrink: 0
  }
}, onBack && /*#__PURE__*/React.createElement("button", {
  onClick: onBack,
  "aria-label": "Back",
  style: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer",
    background: "transparent",
    color: "var(--ink-900)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement(IconBack, {
  size: 22
})), onClose && /*#__PURE__*/React.createElement("button", {
  onClick: onClose,
  "aria-label": "Close",
  style: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer",
    background: "transparent",
    color: "var(--ink-900)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement(IconClose, {
  size: 20
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 17,
    color: "var(--ink-900)",
    textAlign: onBack || onClose ? "left" : "center",
    paddingLeft: onBack || onClose ? 4 : 16
  }
}, title), helpAction && /*#__PURE__*/React.createElement("button", {
  onClick: helpAction,
  "aria-label": "Help",
  style: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer",
    background: "rgba(74,130,101,0.10)",
    color: "var(--sage-700)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    marginRight: 8
  }
}, "?"), right && /*#__PURE__*/React.createElement("div", {
  style: {
    marginRight: 12
  }
}, right));

// Standard screen body — scrollable column.
const ScreenBody = ({
  children,
  padded = true,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    overflow: "auto",
    padding: padded ? "8px 24px 32px" : 0,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    ...style
  }
}, children);

// Sticky CTA tray — pinned to bottom of phone, with safe-area.
const CtaTray = ({
  children,
  light = false
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    flexShrink: 0,
    padding: "16px 24px 32px",
    background: light ? "transparent" : "rgba(253,249,242,0.92)",
    backdropFilter: light ? "none" : "blur(12px)",
    WebkitBackdropFilter: light ? "none" : "blur(12px)",
    borderTop: light ? "none" : "1px solid var(--paper-300)",
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, children);

// Section heading inside a screen body.
const SectionTitle = ({
  eyebrow,
  title,
  body,
  align = "left"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: align
  }
}, eyebrow && /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 8,
    color: "var(--sage-700)"
  }
}, eyebrow), /*#__PURE__*/React.createElement("div", {
  className: "display-md",
  style: {
    fontSize: 28,
    lineHeight: "34px",
    marginBottom: body ? 10 : 0
  }
}, title), body && /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 15,
    lineHeight: "23px",
    color: "var(--ink-700)"
  }
}, body));

// A small key-value detail row.
const KV = ({
  label,
  value,
  mono = false
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "10px 0",
    borderBottom: "1px solid var(--paper-300)"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)"
  }
}, label), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: mono ? "var(--font-numeric)" : "var(--font-display)",
    fontFeatureSettings: mono ? '"tnum" 1' : "normal",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ink-900)",
    textAlign: "right",
    maxWidth: "65%"
  }
}, value));

// Status pill — small filled pill for stock/expiry status.
const StatusPill = ({
  kind,
  children
}) => {
  const map = {
    low: {
      bg: "rgba(217,119,6,0.14)",
      fg: "#A05A05",
      dot: "#D97706"
    },
    out: {
      bg: "rgba(186,26,26,0.10)",
      fg: "var(--error)",
      dot: "var(--error)"
    },
    expiring: {
      bg: "rgba(217,119,6,0.14)",
      fg: "#A05A05",
      dot: "#D97706"
    },
    expired: {
      bg: "rgba(186,26,26,0.10)",
      fg: "var(--error)",
      dot: "var(--error)"
    },
    displaced: {
      bg: "rgba(37,99,235,0.10)",
      fg: "var(--info)",
      dot: "var(--info)"
    },
    ok: {
      bg: "rgba(74,130,101,0.12)",
      fg: "var(--sage-700)",
      dot: "var(--sage-700)"
    },
    neutral: {
      bg: "var(--paper-250)",
      fg: "var(--ink-700)",
      dot: "var(--ink-600)"
    }
  };
  const c = map[kind] || map.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 10px",
      borderRadius: 9999,
      background: c.bg,
      color: c.fg,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 11,
      lineHeight: "16px",
      letterSpacing: "0.2px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 9999,
      background: c.dot
    }
  }), children);
};

// A breadcrumb of locations rendered as a path string.
const PathCrumb = ({
  parts,
  color = "var(--ink-600)"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color,
    lineHeight: "16px"
  }
}, parts.map((p, i) => /*#__PURE__*/React.createElement(React.Fragment, {
  key: i
}, i > 0 && /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--ink-400)"
  }
}, "\u203A"), /*#__PURE__*/React.createElement("span", {
  style: {
    fontWeight: i === parts.length - 1 ? 600 : 400,
    color: i === parts.length - 1 ? "var(--ink-900)" : color
  }
}, p))));

// Tree node — for the live tree visualisation that grows during space setup.
// Each unit type has its own glyph + tint.
const UNIT_META = {
  premises: {
    eyebrow: "PREMISES",
    glyph: "🏠",
    tint: "var(--sage-700)",
    iconBg: "rgba(74,130,101,0.14)",
    color: "#fff"
  },
  area: {
    eyebrow: "AREA",
    glyph: "🏷",
    tint: "var(--sage-700)",
    iconBg: "rgba(74,130,101,0.10)",
    color: "var(--sage-700)"
  },
  zone: {
    eyebrow: "ZONE",
    glyph: "📍",
    tint: "var(--sage-700)",
    iconBg: "rgba(74,130,101,0.10)",
    color: "var(--sage-700)"
  },
  section: {
    eyebrow: "SECTION",
    glyph: "📐",
    tint: "var(--sage-700)",
    iconBg: "rgba(74,130,101,0.10)",
    color: "var(--sage-700)"
  },
  sub_section: {
    eyebrow: "SUB-SECTION",
    glyph: "🔩",
    tint: "var(--ink-700)",
    iconBg: "var(--paper-250)",
    color: "var(--ink-700)"
  },
  container: {
    eyebrow: "CONTAINER",
    glyph: "📦",
    tint: "#A05A05",
    iconBg: "rgba(217,119,6,0.12)",
    color: "#A05A05"
  },
  shelf: {
    eyebrow: "SHELF",
    glyph: "📏",
    tint: "var(--ink-700)",
    iconBg: "var(--paper-250)",
    color: "var(--ink-700)"
  }
};
const TreeRow = ({
  unit,
  name,
  depth = 0,
  focused = false,
  faint = false,
  addable = false,
  onAdd,
  last = false,
  totalDepth = 1
}) => {
  const meta = UNIT_META[unit] || UNIT_META.area;
  const indent = depth * 18;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingLeft: indent
    }
  }, depth > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: indent - 9,
      top: 0,
      bottom: last ? "50%" : 0,
      width: 1,
      background: "var(--paper-300)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: indent - 9,
      top: 18,
      width: 9,
      height: 1,
      background: "var(--paper-300)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 10px",
      background: focused ? "rgba(74,130,101,0.08)" : "transparent",
      border: focused ? "1px solid var(--sage-700)" : "1px solid transparent",
      borderRadius: 10,
      opacity: faint ? 0.5 : 1,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: meta.iconBg,
      color: meta.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      flexShrink: 0
    }
  }, meta.glyph), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 9,
      letterSpacing: "0.6px",
      color: "var(--ink-600)",
      textTransform: "uppercase"
    }
  }, meta.eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 14,
      color: "var(--ink-900)",
      marginTop: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, name)), addable && /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    "aria-label": "Add child",
    style: {
      width: 26,
      height: 26,
      borderRadius: 9999,
      border: "none",
      cursor: "pointer",
      background: "var(--sage-700)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(IconPlus, {
    size: 14,
    color: "#fff"
  }))));
};

// A complete tree given an array of {unit, name, depth, focused, faint}.
const Tree = ({
  nodes,
  addAt,
  onAdd
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 14,
    boxShadow: "var(--shadow-ambient-sm)"
  }
}, nodes.map((n, i) => /*#__PURE__*/React.createElement(TreeRow, _extends({
  key: i
}, n, {
  addable: addAt === i,
  onAdd: onAdd,
  last: i === nodes.length - 1
}))));
Object.assign(window, {
  PhoneFrame,
  AppBar,
  ScreenBody,
  CtaTray,
  SectionTitle,
  KV,
  StatusPill,
  PathCrumb,
  TreeRow,
  Tree,
  UNIT_META
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/JourneyShell.jsx", error: String((e && e.message) || e) }); }

// journeys/Onboarding.jsx
try { (() => {
// Onboarding journey screens.

/* ── 01 Landing page (mobile) ─────────────────────────────────── */
const OB_Landing = () => /*#__PURE__*/React.createElement("div", {
  style: {
    width: 390,
    height: 844,
    position: "relative",
    overflow: "hidden",
    background: "var(--surface)",
    display: "flex",
    flexDirection: "column"
  }
}, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement(BrandIdentity, null), /*#__PURE__*/React.createElement("button", {
  style: {
    background: "transparent",
    border: "none",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    color: "var(--ink-700)",
    cursor: "pointer"
  }
}, "Sign in")), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 20
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    color: "var(--sage-700)"
  }
}, "INVENTORY MANAGEMENT"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontSize: 44,
    fontWeight: 700,
    lineHeight: "48px",
    color: "var(--ink-900)",
    letterSpacing: "-0.02em"
  }
}, "Know what's there.", /*#__PURE__*/React.createElement("br", null), "Find it fast."), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 16,
    lineHeight: "24px",
    color: "var(--ink-700)"
  }
}, "InMan is shared inventory for kitchens, bars, garages, and any home that runs like a small operation. Built for crews of any size."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Get started \u2014 free"), /*#__PURE__*/React.createElement(SecondaryButton, null, "I have an invite link")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 24,
    padding: 20,
    background: "var(--paper-100)",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    gap: 14
  }
}, [{
  glyph: "🏠",
  title: "Hierarchical spaces",
  body: "From House to Shelf — exactly as detailed as you need."
}, {
  glyph: "📋",
  title: "Real-time across the crew",
  body: "Everyone on the same page, in seconds."
}, {
  glyph: "📷",
  title: "Quick add by scan or search",
  body: "Add an item in 4 seconds flat."
}].map((f, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "var(--paper-50)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0
  }
}, f.glyph), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, f.title), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, f.body)))))));

/* ── 02 Sign up (Clerk-powered) ─────────────────────────────── */
const OB_SignUp = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: ""
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(BrandIdentity, null), /*#__PURE__*/React.createElement(SectionTitle, {
  title: "Create your account",
  body: "One account works across all your crews."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(SecondaryButton, null, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 16,
    marginRight: 6
  }
}, "G"), " Continue with Google"), /*#__PURE__*/React.createElement(SecondaryButton, null, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 16,
    marginRight: 6
  }
}, "\uD83C\uDF4E"), " Continue with Apple")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "var(--ink-500)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    height: 1,
    background: "var(--paper-300)"
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12
  }
}, "or use email"), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    height: 1,
    background: "var(--paper-300)"
  }
})), /*#__PURE__*/React.createElement(Field, {
  label: "EMAIL",
  value: "",
  onChange: () => {},
  placeholder: "you@example.com"
}), /*#__PURE__*/React.createElement(Field, {
  label: "PASSWORD",
  value: "",
  onChange: () => {},
  placeholder: "At least 8 characters"
}), /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Create account"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-500)",
    textAlign: "center",
    lineHeight: "18px"
  }
}, "By signing up you agree to InMan's Terms and Privacy Policy.")));

/* ── 03 Crew decision ────────────────────────────────────────── */
const OB_CrewDecision = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Welcome"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(ProgressBar, {
  step: 1,
  of: 5,
  label: "STEP 1 OF 5"
}), /*#__PURE__*/React.createElement(SectionTitle, {
  title: "What brings you to InMan?",
  body: "A crew is a shared workspace. You can be in many crews at once."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(DecisionCard, {
  glyph: "\uD83C\uDFD7",
  title: "Start a new crew",
  body: "You're setting up inventory for a new place.",
  selected: true
}), /*#__PURE__*/React.createElement(DecisionCard, {
  glyph: "\uD83E\uDD1D",
  title: "Join with an invite",
  body: "Someone shared an invite code or link with you."
}), /*#__PURE__*/React.createElement(DecisionCard, {
  glyph: "\uD83D\uDCCD",
  title: "Just exploring",
  body: "Browse a sample crew. You can start your own anytime."
}))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Continue")));
const DecisionCard = ({
  glyph,
  title,
  body,
  selected
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: 16,
    borderRadius: 14,
    background: selected ? "rgba(74,130,101,0.08)" : "var(--paper-50)",
    border: selected ? "2px solid var(--sage-700)" : "2px solid var(--paper-300)",
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "var(--paper-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0
  }
}, glyph), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    color: "var(--ink-900)"
  }
}, title), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)",
    marginTop: 4,
    lineHeight: "18px"
  }
}, body)), /*#__PURE__*/React.createElement("div", {
  style: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    marginTop: 4,
    border: selected ? "none" : "2px solid var(--paper-300)",
    background: selected ? "var(--sage-700)" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  }
}, selected && /*#__PURE__*/React.createElement(IconCheck, {
  size: 14,
  color: "#fff"
})));

/* ── 04 Name your crew + PIN ────────────────────────────────── */
const OB_CrewName = () => {
  const [name] = React.useState("Walker Home");
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => {},
    title: "New crew"
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(ProgressBar, {
    step: 2,
    of: 5,
    label: "STEP 2 OF 5"
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    title: "Name your crew",
    body: "A crew is the team that shares an inventory. Use the place's name."
  }), /*#__PURE__*/React.createElement(Field, {
    label: "CREW NAME",
    value: name,
    onChange: () => {},
    placeholder: "My House",
    hint: "You can rename or have multiple crews later."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper-100)",
      borderRadius: 14,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-eyebrow",
    style: {
      marginBottom: 8
    }
  }, "OPTIONAL \xB7 QUICK-ADD PIN"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "var(--ink-700)",
      marginBottom: 12,
      lineHeight: "18px"
    }
  }, "Set a 4-digit PIN to enable kiosk mode for guests and unauthenticated quick-add. You can do this later in Settings."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, ["•", "•", "•", "•"].map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: 52,
      borderRadius: 10,
      border: "2px solid var(--paper-300)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      color: "var(--ink-500)"
    }
  }, d))))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
    arrow: true
  }, "Create crew"), /*#__PURE__*/React.createElement(TextButton, null, "Skip PIN for now")));
};

/* ── 04b Accept invite (Path B) ─────────────────────────────── */
const OB_AcceptInvite = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Join a crew"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 16,
    padding: 20,
    textAlign: "center"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 64,
    height: 64,
    borderRadius: 16,
    background: "var(--sage-700)",
    color: "#fff",
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 24
  }
}, "WH"), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    color: "var(--sage-700)",
    marginBottom: 4
  }
}, "YOU'VE BEEN INVITED"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 22,
    color: "var(--ink-900)"
  }
}, "Walker Home"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)",
    marginTop: 6
  }
}, "Invited by Jamal Walker")), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-50)",
    borderRadius: 14,
    padding: 16,
    boxShadow: "var(--shadow-ambient-sm)"
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 12
  }
}, "YOU'LL JOIN AS"), /*#__PURE__*/React.createElement(KV, {
  label: "Role",
  value: "Member"
}), /*#__PURE__*/React.createElement(KV, {
  label: "Permissions",
  value: "Read \xB7 Add \xB7 Edit"
}), /*#__PURE__*/React.createElement(KV, {
  label: "Crew size",
  value: "3 members + 2 kiosks"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8
  }
}, /*#__PURE__*/React.createElement(SecondaryButton, null, "Decline"), /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Accept & join"))));

/* ── 08 Dashboard checklist ─────────────────────────────────── */
const OB_Dashboard = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 20px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    color: "var(--sage-700)"
  }
}, "WALKER HOME"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 22,
    color: "var(--ink-900)",
    marginTop: 2
  }
}, "Hi, Jamal")), /*#__PURE__*/React.createElement("div", {
  style: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    background: "var(--sage-700)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700
  }
}, "JW")), /*#__PURE__*/React.createElement(ScreenBody, {
  style: {
    paddingTop: 0
  }
}, /*#__PURE__*/React.createElement(OnboardingSection, {
  name: "Walker Home",
  completedSteps: 2,
  totalSteps: 5
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow"
}, "YOUR INVENTORY"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-50)",
    borderRadius: 14,
    padding: 16,
    boxShadow: "var(--shadow-ambient-sm)",
    textAlign: "center"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 36,
    color: "var(--ink-900)"
  }
}, "0"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, "items so far"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14
  }
}, /*#__PURE__*/React.createElement(PrimaryButton, null, "+ Add your first item"))))), /*#__PURE__*/React.createElement(BottomNav, {
  active: "home"
}));

/* ── Kiosk enroll (Path C) ──────────────────────────────────── */
const OB_KioskEnroll = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Set up kiosk"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
  eyebrow: "KIOSK MODE",
  title: "Use a tablet as a quick-add station",
  body: "Anyone in the household can add items without an account. Actions are tagged 'kiosk' for the audit log."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 4
  }
}, "ENROLLMENT CODE"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 36,
    color: "var(--ink-900)",
    letterSpacing: "0.4em",
    textAlign: "center",
    padding: "12px 0"
  }
}, "4 7 2 9"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    textAlign: "center"
  }
}, "Enter this on the tablet within 10 minutes")), /*#__PURE__*/React.createElement(Alert, {
  kind: "info",
  title: "Heads up \u2014 kiosk privileges are limited"
}, "Kiosks can add items, restock, and consume \u2014 but cannot edit spaces, manage members, or see the audit log.")), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Show me the tablet")));

/* ── Tiny status-bar fragment ──────────────────────────────── */
const StatusBar = () => /*#__PURE__*/React.createElement("div", {
  style: {
    height: 44,
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", null, "\u25CF \u25CF \u25CF"));
Object.assign(window, {
  OB_Landing,
  OB_SignUp,
  OB_CrewDecision,
  OB_CrewName,
  OB_AcceptInvite,
  OB_Dashboard,
  OB_KioskEnroll
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/Onboarding.jsx", error: String((e && e.message) || e) }); }

// journeys/SpaceReorganization.jsx
try { (() => {
// Space Reorganization journey screens — entry mode, rename, move w/ preview, merge, split, delete.

/* ── RG_Mode ── Reorganize mode entry: tree of spaces in edit mode */
const RG_Mode = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Reorganize spaces",
  onBack: () => {},
  right: /*#__PURE__*/React.createElement("button", {
    style: {
      padding: "6px 12px",
      borderRadius: 9999,
      background: "var(--sage-700)",
      color: "#fff",
      border: "none",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Done")
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(74,130,101,0.08)",
    borderRadius: 12,
    padding: "10px 14px",
    marginBottom: 14,
    display: "flex",
    gap: 10,
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement(IconInfo, {
  size: 16,
  color: "var(--sage-700)"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-700)"
  }
}, "Drag to reorder \xB7 long-press for options")), /*#__PURE__*/React.createElement(Tree, {
  nodes: [{
    unit: "premises",
    name: "Walker House",
    focused: false
  }, {
    unit: "area",
    name: "Kitchen",
    depth: 1
  }, {
    unit: "zone",
    name: "Pantry",
    depth: 2
  }, {
    unit: "sub_section",
    name: "Cabinet 1",
    depth: 3,
    focused: true
  }, {
    unit: "shelf",
    name: "Top shelf",
    depth: 4
  }, {
    unit: "shelf",
    name: "Middle shelf",
    depth: 4
  }, {
    unit: "shelf",
    name: "Bottom shelf",
    depth: 4
  }, {
    unit: "sub_section",
    name: "Cabinet 2",
    depth: 3
  }, {
    unit: "zone",
    name: "Fridge",
    depth: 2
  }]
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14,
    padding: 12,
    background: "var(--paper-100)",
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-700)"
  }
}, "1 selected \xB7 Cabinet 1"), /*#__PURE__*/React.createElement("button", {
  style: {
    background: "transparent",
    border: "none",
    color: "var(--sage-700)",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer"
  }
}, "Clear"))), /*#__PURE__*/React.createElement(CtaTray, {
  light: true
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    padding: "0 4px"
  }
}, [{
  label: "Move",
  icon: /*#__PURE__*/React.createElement(IconChevronRight, {
    size: 18
  })
}, {
  label: "Merge",
  icon: /*#__PURE__*/React.createElement(IconShare, {
    size: 18
  })
}, {
  label: "Split",
  icon: /*#__PURE__*/React.createElement(IconBox, {
    size: 18
  })
}, {
  label: "Rename",
  icon: /*#__PURE__*/React.createElement(IconEdit, {
    size: 18
  })
}, {
  label: "Reclass",
  icon: /*#__PURE__*/React.createElement(IconFilter, {
    size: 18
  })
}, {
  label: "Delete",
  icon: /*#__PURE__*/React.createElement(IconDelete, {
    size: 18
  }),
  danger: true
}].map(a => /*#__PURE__*/React.createElement("button", {
  key: a.label,
  style: {
    padding: "10px 4px",
    borderRadius: 12,
    border: "1px solid var(--paper-300)",
    background: "var(--surface)",
    color: a.danger ? "var(--error)" : "var(--ink-900)",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "pointer"
  }
}, a.icon, /*#__PURE__*/React.createElement("span", null, a.label))))));

/* ── RG_Rename ── Inline rename with current path. ────────────── */
const RG_Rename = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Rename",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
  eyebrow: "Renaming",
  title: "Cabinet 1",
  body: "The new name applies everywhere this space appears \u2014 items, history, and reports."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 18
  }
}, /*#__PURE__*/React.createElement(PathCrumb, {
  parts: ["Walker House", "Kitchen", "Pantry", "Cabinet 1"],
  color: "var(--ink-500)"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 18
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "New name",
  placeholder: "Cabinet 1",
  value: "Spice Cabinet"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14,
    padding: 12,
    background: "var(--paper-100)",
    borderRadius: 12,
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    lineHeight: 1.6
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 12,
    color: "var(--ink-900)",
    marginBottom: 4
  }
}, "What changes"), "Path becomes ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--sage-700)",
    fontWeight: 600
  }
}, "Walker House \u2192 Kitchen \u2192 Pantry \u2192 Spice Cabinet"), ".", /*#__PURE__*/React.createElement("br", null), "14 items, 23 historical Flows, and 2 active alerts will reflect the new name.")), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, null, "Save name")));

/* ── RG_MovePreview ── Move with a preview panel. ────────────── */
const RG_MovePreview = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Move space",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
  eyebrow: "Moving",
  title: "Spice Cabinet & 14 items",
  body: "Pick a new parent. The whole subtree comes with it."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 16,
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)",
    marginBottom: 6
  }
}, "Current location"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14
  }
}, /*#__PURE__*/React.createElement(PathCrumb, {
  parts: ["Walker House", "Kitchen", "Pantry"]
})), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)",
    marginBottom: 6
  }
}, "New parent"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(74,130,101,0.08)",
    border: "1.5px solid var(--sage-700)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  }
}, /*#__PURE__*/React.createElement(PathCrumb, {
  parts: ["Walker House", "Kitchen", "Counter"],
  color: "var(--sage-700)"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--ink-500)",
    marginBottom: 6
  }
}, "Preview \xB7 After move"), /*#__PURE__*/React.createElement(Tree, {
  nodes: [{
    unit: "premises",
    name: "Walker House"
  }, {
    unit: "area",
    name: "Kitchen",
    depth: 1
  }, {
    unit: "zone",
    name: "Counter",
    depth: 2
  }, {
    unit: "sub_section",
    name: "Spice Cabinet",
    depth: 3,
    focused: true
  }, {
    unit: "shelf",
    name: "Top shelf",
    depth: 4
  }, {
    unit: "shelf",
    name: "Middle shelf",
    depth: 4
  }, {
    unit: "shelf",
    name: "Bottom shelf",
    depth: 4
  }]
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14,
    padding: 10,
    background: "rgba(217,119,6,0.10)",
    borderRadius: 12,
    display: "flex",
    gap: 10,
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement(IconAlert, {
  size: 16,
  color: "#A05A05"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "#7A4504"
  }
}, "14 items will keep their home location \u2014 they'll be marked displaced until put back."))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, null, "Move 4 spaces")));

/* ── RG_Merge ── Merge two spaces. ────────────────────────────── */
const RG_Merge = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Merge spaces",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
  eyebrow: "Merging two spaces",
  title: "Combine items into one location",
  body: "Items move to the destination. The source space is soft-deleted but its history stays linked."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 14
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 6
  }
}, "Source \xB7 will be deleted"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background: "rgba(74,130,101,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--sage-700)"
  }
}, /*#__PURE__*/React.createElement(IconBox, {
  size: 18
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    color: "var(--ink-900)"
  }
}, "Old Spice Rack"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, "Container \xB7 8 items")))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    background: "var(--sage-700)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement(IconChevronDown, {
  size: 18
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(74,130,101,0.06)",
    border: "1.5px solid var(--sage-700)",
    borderRadius: 14,
    padding: 14
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 6,
    color: "var(--sage-700)"
  }
}, "Destination"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background: "var(--sage-700)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff"
  }
}, /*#__PURE__*/React.createElement(IconBox, {
  size: 18
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    color: "var(--ink-900)"
  }
}, "Spice Cabinet"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, "Sub-section \xB7 14 items \u2192 22 after merge"))))), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "var(--paper-100)",
    borderRadius: 12
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 13
  }
}, "Update home locations"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    color: "var(--ink-600)"
  }
}, "Items currently homed in source get rehomed to destination")), /*#__PURE__*/React.createElement(Toggle, {
  on: true
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 12,
    padding: 12,
    background: "rgba(217,119,6,0.10)",
    borderRadius: 12,
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "#7A4504",
    lineHeight: 1.5
  }
}, "2 items in ", /*#__PURE__*/React.createElement("strong", null, "Old Spice Rack"), " share names with items already in ", /*#__PURE__*/React.createElement("strong", null, "Spice Cabinet"), ". They'll keep separate records \u2014 review on the next step.")), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, null, "Continue \xB7 review duplicates")));

/* ── RG_Split ── Split one space into two. ────────────────────── */
const RG_Split = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Split space",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
  eyebrow: "Splitting",
  title: "Spice Cabinet (14 items)",
  body: "Keep the original. Create a sibling. Drag items between them."
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    color: "var(--ink-900)"
  }
}, "Spice Cabinet"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 10,
    color: "var(--ink-500)",
    marginBottom: 8
  }
}, "10 items"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  }
}, ["Cumin", "Paprika", "Coriander", "Star anise", "Black pepper"].map(n => /*#__PURE__*/React.createElement("div", {
  key: n,
  style: {
    background: "var(--surface)",
    border: "1px solid var(--paper-300)",
    borderRadius: 8,
    padding: "6px 10px",
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-700)"
  }
}, n)), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    color: "var(--ink-500)",
    textAlign: "center",
    padding: "4px 0"
  }
}, "+ 5 more"))), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(74,130,101,0.06)",
    border: "1.5px dashed var(--sage-700)",
    borderRadius: 14,
    padding: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    color: "var(--sage-700)"
  }
}, "Baking Cabinet"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 10,
    color: "var(--sage-700)",
    marginBottom: 8
  }
}, "4 items \xB7 new"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  }
}, ["Cinnamon", "Vanilla extract", "Nutmeg", "Cardamom"].map(n => /*#__PURE__*/React.createElement("div", {
  key: n,
  style: {
    background: "var(--surface)",
    border: "1px solid var(--sage-700)",
    borderRadius: 8,
    padding: "6px 10px",
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-900)"
  }
}, n))))), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 16
  }
}, /*#__PURE__*/React.createElement(Field, {
  label: "Name for the new space",
  placeholder: "Sibling name",
  value: "Baking Cabinet"
}))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, null, "Split into two")));

/* ── RG_Delete ── Delete with orphan-handling choices. ────────── */
const RG_Delete = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  title: "Delete space",
  onBack: () => {}
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(186,26,26,0.06)",
    border: "1.5px solid rgba(186,26,26,0.24)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(IconDelete, {
  size: 20,
  color: "var(--error)"
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--error)"
  }
}, "Delete \"Old Spice Rack\""), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-700)",
    marginTop: 2
  }
}, "Container \xB7 8 items inside")))), /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 8,
    marginLeft: 4
  }
}, "What happens to the 8 items?"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, [{
  id: "parent",
  title: "Move to parent",
  sub: "Items go up one level — Pantry",
  on: true
}, {
  id: "specific",
  title: "Move to a specific space",
  sub: "Pick one destination for all 8"
}, {
  id: "perItem",
  title: "Decide per item",
  sub: "Review each one individually"
}, {
  id: "delete",
  title: "Soft-delete the items too",
  sub: "Keep flow history, mark as deleted",
  danger: true
}].map(opt => /*#__PURE__*/React.createElement("div", {
  key: opt.id,
  style: {
    padding: 14,
    borderRadius: 12,
    border: opt.on ? "1.5px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
    background: opt.on ? "rgba(74,130,101,0.06)" : "var(--surface)",
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    marginTop: 1,
    border: opt.on ? "6px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
    background: opt.on ? "var(--sage-700)" : "transparent"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: opt.danger ? "var(--error)" : "var(--ink-900)"
  }
}, opt.title), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, opt.sub)))))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  style: {
    background: "var(--error)"
  }
}, "Delete space")));
Object.assign(window, {
  RG_Mode,
  RG_Rename,
  RG_MovePreview,
  RG_Merge,
  RG_Split,
  RG_Delete
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/SpaceReorganization.jsx", error: String((e && e.message) || e) }); }

// journeys/SpaceSetup.jsx
try { (() => {
// Space Setup journey — 5 phases: Explainer → Premises → Guided Branch → Tree Editor → Templates.

/* ── Phase 1 — Explainer ──────────────────────────────────────── */
const SS1_Explainer = () => {
  const levels = [{
    unit: "premises",
    name: "My House",
    sub: "Top of your hierarchy"
  }, {
    unit: "area",
    name: "Kitchen",
    sub: "A room or functional space"
  }, {
    unit: "zone",
    name: "Back Wall",
    sub: "A region within the room"
  }, {
    unit: "section",
    name: "Above",
    sub: "A position within the zone"
  }, {
    unit: "sub_section",
    name: "Cabinet 1",
    sub: "Fixed — bolted, built-in"
  }, {
    unit: "container",
    name: "Spice Rack",
    sub: "Portable — you can move it"
  }, {
    unit: "shelf",
    name: "Shelf 1",
    sub: "The deepest level"
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onClose: () => {},
    title: "How spaces work"
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(SectionTitle, {
    eyebrow: "STEP 1 OF 6",
    title: "Seven levels, all optional",
    body: "Use as many or as few as your space needs. The deeper you go, the easier it is to find a thing later."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      paddingTop: 4
    }
  }, levels.map((l, i) => {
    const meta = UNIT_META[l.unit];
    const isPortable = l.unit === "container";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 4px",
        position: "relative",
        marginLeft: i * 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: meta.iconBg,
        color: meta.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        flexShrink: 0
      }
    }, meta.glyph), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        paddingTop: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: "0.6px",
        color: "var(--ink-600)",
        textTransform: "uppercase"
      }
    }, meta.eyebrow), l.unit === "sub_section" && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: 10,
        color: "var(--ink-700)",
        background: "var(--paper-250)",
        padding: "1px 6px",
        borderRadius: 999
      }
    }, "FIXED"), isPortable && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: 10,
        color: "#A05A05",
        background: "rgba(217,119,6,0.14)",
        padding: "1px 6px",
        borderRadius: 999
      }
    }, "PORTABLE")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--ink-900)",
        marginTop: 2
      }
    }, l.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: 12,
        color: "var(--ink-600)",
        marginTop: 1
      }
    }, l.sub)));
  }))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
    arrow: true
  }, "Got it, let's build"), /*#__PURE__*/React.createElement(TextButton, null, "Skip \u2014 I know how this works")));
};

/* ── Phase 2 — Create Premises ────────────────────────────────── */
const SS2_Premises = () => {
  const [name, setName] = React.useState("Walker Home");
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => {},
    title: "Set up spaces",
    helpAction: () => {}
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(ProgressBar, {
    step: 1,
    of: 5,
    label: "STEP 1 OF 5"
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    title: "What's the name of your place?",
    body: "This is the top of your hierarchy. Everything else lives inside it."
  }), /*#__PURE__*/React.createElement(Field, {
    label: "PLACE NAME",
    value: name,
    onChange: setName,
    placeholder: "My House",
    hint: "Try \u201CMy House\u201D, \u201CThe Apartment\u201D, \u201CHaywire Bar\u201D, or \u201CLake House\u201D."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-eyebrow",
    style: {
      marginBottom: 8
    }
  }, "YOUR TREE"), /*#__PURE__*/React.createElement(Tree, {
    nodes: name ? [{
      unit: "premises",
      name,
      focused: true
    }] : []
  }), !name && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper-100)",
      borderRadius: 14,
      padding: 24,
      textAlign: "center",
      color: "var(--ink-500)",
      fontSize: 13
    }
  }, "Empty for now \u2014 your first node appears as you type."))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
    arrow: true
  }, "Confirm name")));
};

/* ── Phase 3 — Guided Branch (mid-flow snapshot) ─────────────── */
// One canonical snapshot showing the prompt + chip suggestions + live tree.
const SS3_Guided = () => {
  const nodes = [{
    unit: "premises",
    name: "Walker Home"
  }, {
    unit: "area",
    name: "Kitchen",
    depth: 1
  }, {
    unit: "zone",
    name: "Back",
    depth: 2
  }, {
    unit: "section",
    name: "Above",
    depth: 3,
    focused: true
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => {},
    title: "Set up spaces",
    helpAction: () => {},
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: 12,
        color: "var(--ink-600)"
      }
    }, "Step 3")
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(ProgressBar, {
    step: 2,
    of: 5,
    label: "STEP 2 OF 5"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper-100)",
      borderRadius: 14,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, UNIT_META.section.glyph), /*#__PURE__*/React.createElement("span", {
    className: "label-eyebrow",
    style: {
      color: "var(--sage-700)"
    }
  }, "ADD A SECTION")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      lineHeight: "24px",
      color: "var(--ink-900)"
    }
  }, "Within Back, are there positions like above the counter, below it, or the countertop itself?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "var(--ink-700)"
    }
  }, "Sections are positional \u2014 above, below, top, front, back. They describe ", /*#__PURE__*/React.createElement("i", null, "where"), " within a zone.")), /*#__PURE__*/React.createElement(Field, {
    label: "SECTION NAME",
    value: "Above",
    onChange: () => {},
    placeholder: "Above"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "label-eyebrow",
    style: {
      marginBottom: 8
    }
  }, "QUICK SUGGESTIONS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, ["Above", "Below", "Top", "Front", "Back"].map((s, i) => /*#__PURE__*/React.createElement(Chip, {
    key: s,
    selected: i === 0
  }, s)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "label-eyebrow",
    style: {
      marginBottom: 8
    }
  }, "LIVE TREE"), /*#__PURE__*/React.createElement(Tree, {
    nodes: nodes
  }))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(SecondaryButton, null, "+ Wider"), /*#__PURE__*/React.createElement(PrimaryButton, {
    arrow: true
  }, "Go deeper"))));
};

/* ── Phase 3 (variant) — completed branch ─────────────────────── */
const SS3_Complete = () => {
  const nodes = [{
    unit: "premises",
    name: "Walker Home"
  }, {
    unit: "area",
    name: "Kitchen",
    depth: 1
  }, {
    unit: "zone",
    name: "Back",
    depth: 2
  }, {
    unit: "section",
    name: "Above",
    depth: 3
  }, {
    unit: "sub_section",
    name: "Cabinet 1",
    depth: 4
  }, {
    unit: "container",
    name: "Spice Rack",
    depth: 5
  }, {
    unit: "shelf",
    name: "Shelf 1",
    depth: 6,
    focused: true
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => {},
    title: "Set up spaces",
    helpAction: () => {}
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement(ProgressBar, {
    step: 3,
    of: 5,
    label: "STEP 3 OF 5"
  }), /*#__PURE__*/React.createElement(Alert, {
    kind: "success",
    title: "Your first branch is built"
  }, "You can see how the levels nest. Now keep going \u2014 add more zones, sections, or storage anywhere in the tree."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "label-eyebrow"
  }, "YOUR TREE \u2014 7 SPACES"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--sage-700)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 12
    }
  }, "Use a template")), /*#__PURE__*/React.createElement(Tree, {
    nodes: nodes
  }))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
    arrow: true
  }, "Open tree editor")));
};

/* ── Phase 4 — Tree Editor (full editor view) ─────────────────── */
const SS4_TreeEditor = () => {
  const nodes = [{
    unit: "premises",
    name: "Walker Home"
  }, {
    unit: "area",
    name: "Kitchen",
    depth: 1
  }, {
    unit: "zone",
    name: "Back",
    depth: 2
  }, {
    unit: "section",
    name: "Above",
    depth: 3
  }, {
    unit: "sub_section",
    name: "Cabinet 1",
    depth: 4,
    focused: true
  }, {
    unit: "container",
    name: "Spice Rack",
    depth: 5
  }, {
    unit: "shelf",
    name: "Shelf 1",
    depth: 6
  }, {
    unit: "sub_section",
    name: "Cabinet 2",
    depth: 4
  }, {
    unit: "section",
    name: "Below",
    depth: 3
  }, {
    unit: "zone",
    name: "Center",
    depth: 2
  }, {
    unit: "area",
    name: "Pantry",
    depth: 1
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => {},
    title: "Spaces",
    helpAction: () => {},
    right: /*#__PURE__*/React.createElement("button", {
      style: {
        height: 32,
        padding: "0 12px",
        borderRadius: 999,
        background: "var(--paper-250)",
        border: "none",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 12,
        color: "var(--ink-900)"
      }
    }, "Template")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 24px 12px"
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    value: "",
    onChange: () => {},
    placeholder: "Search spaces\u2026"
  })), /*#__PURE__*/React.createElement(ScreenBody, {
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement(Tree, {
    nodes: nodes,
    addAt: 4
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,130,101,0.06)",
      border: "1px dashed var(--sage-700)",
      borderRadius: 12,
      padding: 14,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "var(--sage-700)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(IconPlus, {
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 13,
      color: "var(--ink-900)"
    }
  }, "Add inside Cabinet 1"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "var(--ink-600)"
    }
  }, "Suggested: ", /*#__PURE__*/React.createElement("b", null, "shelf"), " \u2014 also valid: container")))), /*#__PURE__*/React.createElement(CtaTray, {
    light: true
  }, /*#__PURE__*/React.createElement(PrimaryButton, {
    arrow: true
  }, "I'm done \u2014 next step")));
};

/* ── Phase 4b — Add Child sheet (smart defaults) ──────────────── */
const SS4_AddChildSheet = () => {
  const nodes = [{
    unit: "premises",
    name: "Walker Home"
  }, {
    unit: "area",
    name: "Kitchen",
    depth: 1
  }, {
    unit: "zone",
    name: "Back",
    depth: 2
  }, {
    unit: "section",
    name: "Above",
    depth: 3
  }, {
    unit: "sub_section",
    name: "Cabinet 1",
    depth: 4,
    focused: true
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => {},
    title: "Spaces",
    helpAction: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 24px 12px",
      flex: 1,
      overflow: "hidden",
      filter: "blur(2px)",
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement(Tree, {
    nodes: nodes
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      background: "var(--paper-50)",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: "12px 24px 32px",
      boxShadow: "0 -8px 32px rgba(28,28,24,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 9999,
      background: "var(--paper-300)",
      margin: "8px auto 4px"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "label-eyebrow",
    style: {
      marginBottom: 4
    }
  }, "ADD INSIDE"), /*#__PURE__*/React.createElement("div", {
    className: "headline-md"
  }, "Cabinet 1"), /*#__PURE__*/React.createElement(PathCrumb, {
    parts: ["Walker Home", "Kitchen", "Back", "Above", "Cabinet 1"]
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "label-eyebrow",
    style: {
      marginBottom: 8
    }
  }, "WHAT TYPE?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(UnitOption, {
    unit: "shelf",
    name: "Shelf",
    sub: "Suggested \u2014 leaf level, a single shelf",
    selected: true
  }), /*#__PURE__*/React.createElement(UnitOption, {
    unit: "container",
    name: "Container",
    sub: "Portable \u2014 bin, rack, organizer"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "NAME",
    value: "",
    onChange: () => {},
    placeholder: "Shelf 1"
  }), /*#__PURE__*/React.createElement(PrimaryButton, {
    arrow: true
  }, "Add space")));
};
const UnitOption = ({
  unit,
  name,
  sub,
  selected
}) => {
  const meta = UNIT_META[unit];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      background: selected ? "rgba(74,130,101,0.08)" : "var(--paper-100)",
      border: selected ? "2px solid var(--sage-700)" : "2px solid transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: meta.iconBg,
      color: meta.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      flexShrink: 0
    }
  }, meta.glyph), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 14,
      color: "var(--ink-900)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "var(--ink-600)",
      marginTop: 2
    }
  }, sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 9999,
      border: selected ? "none" : "2px solid var(--paper-300)",
      background: selected ? "var(--sage-700)" : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, selected && /*#__PURE__*/React.createElement(IconCheck, {
    size: 14,
    color: "#fff"
  })));
};

/* ── Phase 5 — Templates ──────────────────────────────────────── */
const SS5_Templates = () => {
  const templates = [{
    name: "Standard Kitchen",
    count: 24,
    by: "InMan",
    tag: "Most popular",
    icon: "🍳"
  }, {
    name: "Bar Setup",
    count: 18,
    by: "InMan",
    icon: "🍸"
  }, {
    name: "Walk-in Pantry",
    count: 12,
    by: "InMan",
    icon: "🥫"
  }, {
    name: "Coffee Bar",
    count: 8,
    by: "InMan",
    icon: "☕"
  }, {
    name: "Walker Garage",
    count: 16,
    by: "Davontae",
    icon: "🔧"
  }];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => {},
    title: "Choose a template"
  }), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--ink-700)",
      lineHeight: "20px"
    }
  }, "Start from a pre-built hierarchy. You can add, remove, and rename anything afterward."), /*#__PURE__*/React.createElement(Segmented, {
    options: [{
      label: "By InMan",
      value: "system"
    }, {
      label: "Saved",
      value: "custom"
    }],
    value: "system",
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, templates.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      width: "100%",
      textAlign: "left",
      border: "none",
      cursor: "pointer",
      background: "var(--paper-50)",
      borderRadius: 14,
      padding: 14,
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "var(--shadow-ambient-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 12,
      background: "var(--paper-200)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 26,
      flexShrink: 0
    }
  }, t.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: "var(--ink-900)"
    }
  }, t.name), t.tag && /*#__PURE__*/React.createElement(Chip, {
    variant: "sage"
  }, t.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "var(--ink-600)",
      marginTop: 4
    }
  }, t.count, " spaces \xB7 by ", t.by)), /*#__PURE__*/React.createElement(IconChevronRight, {
    size: 20,
    color: "var(--ink-400)"
  }))))));
};

/* ── Phase 5b — Template merge/replace prompt ────────────────── */
const SS5_MergeReplace = () => /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(AppBar, {
  onBack: () => {},
  title: "Standard Kitchen"
}), /*#__PURE__*/React.createElement(ScreenBody, null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 14,
    padding: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "label-eyebrow",
  style: {
    marginBottom: 6
  }
}, "PREVIEW \xB7 24 SPACES"), /*#__PURE__*/React.createElement(Tree, {
  nodes: [{
    unit: "area",
    name: "Kitchen"
  }, {
    unit: "zone",
    name: "Back wall",
    depth: 1
  }, {
    unit: "section",
    name: "Above",
    depth: 2
  }, {
    unit: "sub_section",
    name: "Cabinet 1",
    depth: 3,
    faint: true
  }, {
    unit: "sub_section",
    name: "Cabinet 2",
    depth: 3,
    faint: true
  }, {
    unit: "section",
    name: "Below",
    depth: 2,
    faint: true
  }]
}), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    marginTop: 8,
    textAlign: "center"
  }
}, "+ 18 more spaces")), /*#__PURE__*/React.createElement(Alert, {
  kind: "warn",
  title: "You already have spaces"
}, "Walker Home has 7 spaces under Kitchen. Pick how to handle them."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(RadioCard, {
  title: "Merge into existing",
  body: "Add the template's spaces alongside what you already have. Conflicting names get a number appended.",
  recommended: true,
  selected: true
}), /*#__PURE__*/React.createElement(RadioCard, {
  title: "Replace existing spaces",
  body: "Remove your 7 existing spaces under Kitchen. Inventory currently in those spaces will become unsorted.",
  danger: true
}))), /*#__PURE__*/React.createElement(CtaTray, null, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true
}, "Apply template"), /*#__PURE__*/React.createElement(TextButton, null, "Cancel")));
const RadioCard = ({
  title,
  body,
  recommended,
  selected,
  danger
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: 14,
    borderRadius: 12,
    background: selected ? "rgba(74,130,101,0.08)" : "var(--paper-50)",
    border: selected ? "2px solid var(--sage-700)" : `2px solid ${danger ? "rgba(186,26,26,0.18)" : "var(--paper-300)"}`,
    display: "flex",
    gap: 12,
    alignItems: "flex-start"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    marginTop: 2,
    border: selected ? "none" : "2px solid var(--paper-300)",
    background: selected ? "var(--sage-700)" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  }
}, selected && /*#__PURE__*/React.createElement("div", {
  style: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    background: "#fff"
  }
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink-900)"
  }
}, title), recommended && /*#__PURE__*/React.createElement(Chip, {
  variant: "sage"
}, "Recommended"), danger && /*#__PURE__*/React.createElement(Chip, {
  variant: "error"
}, "Destructive")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)",
    marginTop: 4,
    lineHeight: "18px"
  }
}, body)));
Object.assign(window, {
  SS1_Explainer,
  SS2_Premises,
  SS3_Guided,
  SS3_Complete,
  SS4_TreeEditor,
  SS4_AddChildSheet,
  SS5_Templates,
  SS5_MergeReplace,
  UnitOption,
  RadioCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/SpaceSetup.jsx", error: String((e && e.message) || e) }); }

// journeys/design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), labels/titles are inline-editable,
// and any artboard can be opened in a fullscreen focus overlay (←/→/Esc).
// State persists to a .design-canvas.state.json sidecar via the host
// bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}', '.dc-card{transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px}', '.dc-grip{cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{cursor:pointer;border-radius:4px;padding:3px 6px;display:flex;align-items:center;transition:background .12s}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-expand{position:absolute;bottom:100%;right:0;margin-bottom:5px;z-index:2;opacity:0;transition:opacity .12s,background .12s;', '  width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center}', '.dc-expand:hover{background:rgba(0,0,0,.06);color:#2a251f}', '[data-dc-slot]:hover .dc-expand{opacity:1}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, focused
// artboard). Order/titles/labels persist to a .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const srcIds = [];
    React.Children.forEach(sec.props.children, ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (!aid) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if (e.ctrlKey) {
        // trackpad pinch (or explicit ctrl+wheel)
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const srcOrder = artboards.map(a => a.props.id ?? a.props.label);
  const sec = ctx && sid && ctx.section(sid) || {};
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 80,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px 56px'
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow",
    style: {
      position: 'absolute',
      bottom: '100%',
      left: -4,
      marginBottom: 4,
      color: DC.label
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    onPointerDown: e => e.stopPropagation(),
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    const ns = sectionOrder[(secIdx + d + sectionOrder.length) % sectionOrder.length];
    const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
    if (first) ctx.setFocus(`${ns}/${first}`);
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/design-canvas.jsx", error: String((e && e.message) || e) }); }

// journeys/journey-tweaks.jsx
try { (() => {
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
      "--paper-50": "#FDF9F2",
      "--paper-100": "#F7F3EC",
      "--paper-150": "#F2EEE6",
      "--paper-200": "#F1EDE7",
      "--paper-250": "#EBE8E1",
      "--paper-300": "#E6E2DB",
      "--ink-900": "#1C1C18",
      "--gradient-primary": "linear-gradient(135deg, #31694D 0%, #4A8265 100%)",
      "--gradient-primary-vertical": "linear-gradient(180deg, #31694D 0%, #4A8265 100%)",
      "--shadow-cta": "0 8px 16px -4px rgba(49, 105, 77, 0.20)",
      "--shadow-cta-strong": "0 8px 20px 0 rgba(74, 130, 101, 0.25)"
    }
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
      "--paper-50": "#FAF5EE",
      "--paper-100": "#F4ECE0",
      "--paper-150": "#EFE6D7",
      "--paper-200": "#EBE2D2",
      "--paper-250": "#E1D7C6",
      "--paper-300": "#D9CDB8",
      "--ink-900": "#221912",
      "--gradient-primary": "linear-gradient(135deg, #A04A28 0%, #C2613A 100%)",
      "--gradient-primary-vertical": "linear-gradient(180deg, #A04A28 0%, #C2613A 100%)",
      "--shadow-cta": "0 8px 16px -4px rgba(160, 74, 40, 0.22)",
      "--shadow-cta-strong": "0 8px 20px 0 rgba(194, 97, 58, 0.28)"
    }
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
      "--paper-50": "#F8F8FA",
      "--paper-100": "#F1F2F5",
      "--paper-150": "#ECEDF1",
      "--paper-200": "#E7E9EF",
      "--paper-250": "#DEE1E8",
      "--paper-300": "#D2D6DF",
      "--ink-900": "#161A23",
      "--gradient-primary": "linear-gradient(135deg, #2F4A8A 0%, #4664A8 100%)",
      "--gradient-primary-vertical": "linear-gradient(180deg, #2F4A8A 0%, #4664A8 100%)",
      "--shadow-cta": "0 8px 16px -4px rgba(47, 74, 138, 0.22)",
      "--shadow-cta-strong": "0 8px 20px 0 rgba(70, 100, 168, 0.28)"
    }
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
      "--paper-50": "#1F1F1C",
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
      "--shadow-ambient-lg": "0 8px 48px 0 rgba(0, 0, 0, 0.45), 0 4px 32px 0 rgba(0, 0, 0, 0.35)"
    }
  }
};
const FORMS = {
  soft: {
    label: "Soft",
    hint: "Pillowy radii, ambient glow — domestic and friendly",
    radius: {
      sm: 12,
      md: 16,
      lg: 22,
      pill: 9999
    },
    shadows: {
      "--shadow-ambient-sm": "0 2px 6px 0 rgba(28, 28, 24, 0.06)",
      "--shadow-ambient-md": "0 6px 36px 0 rgba(28, 28, 24, 0.06), 0 12px 28px -4px rgba(28, 28, 24, 0.08)",
      "--shadow-ambient-lg": "0 12px 60px 0 rgba(28, 28, 24, 0.10), 0 8px 40px 0 rgba(28, 28, 24, 0.06)"
    }
  },
  crisp: {
    label: "Crisp",
    hint: "Tight 8px radii, restrained shadows — operational and precise",
    radius: {
      sm: 6,
      md: 8,
      lg: 10,
      pill: 9999
    },
    shadows: {
      "--shadow-ambient-sm": "0 1px 2px 0 rgba(28, 28, 24, 0.06)",
      "--shadow-ambient-md": "0 2px 8px 0 rgba(28, 28, 24, 0.06)",
      "--shadow-ambient-lg": "0 4px 16px 0 rgba(28, 28, 24, 0.08)"
    }
  },
  sharp: {
    label: "Sharp",
    hint: "Square corners, hard 1px borders — editorial / brutalist",
    radius: {
      sm: 0,
      md: 0,
      lg: 2,
      pill: 0
    },
    shadows: {
      "--shadow-ambient-sm": "0 0 0 1px rgba(28, 28, 24, 0.10)",
      "--shadow-ambient-md": "0 0 0 1px rgba(28, 28, 24, 0.14)",
      "--shadow-ambient-lg": "0 0 0 1.5px rgba(28, 28, 24, 0.18)"
    }
  }
};
const VOICES = {
  geometric: {
    label: "Calm Geometric",
    hint: "Plus Jakarta Sans + Be Vietnam Pro — the default",
    googleFonts: ["Plus Jakarta Sans:400,500,600,700", "Be Vietnam Pro:400,500,600,700"],
    display: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    body: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif',
    tracking: "-0.01em"
  },
  editorial: {
    label: "Editorial Serif",
    hint: "Fraunces display + Inter body — magazine-ish, more emotional",
    googleFonts: ["Fraunces:400,500,600,700", "Inter:400,500,600,700"],
    display: '"Fraunces", Georgia, serif',
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    tracking: "-0.02em"
  },
  industrial: {
    label: "Industrial Mono",
    hint: "JetBrains Mono headings — feels like a control system",
    googleFonts: ["JetBrains Mono:400,500,600,700", "IBM Plex Sans:400,500,600,700"],
    display: '"JetBrains Mono", ui-monospace, monospace',
    body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
    tracking: "0em"
  },
  hand: {
    label: "Friendly Display",
    hint: "DM Sans + display weight — approachable and human",
    googleFonts: ["DM Sans:400,500,700,900", "DM Sans:400,500,700"],
    display: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    body: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    tracking: "-0.015em"
  }
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
function applyTweaks({
  mood,
  form,
  voice,
  density
}) {
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
} /*EDITMODE-END*/;
function JourneyTweaks() {
  injectGlobalOverrides();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    applyTweaks(tweaks);
    document.documentElement.classList.remove("__density-airy", "__density-compact", "__density-regular");
    document.documentElement.classList.add("__density-" + tweaks.density);
  }, [tweaks.mood, tweaks.form, tweaks.voice, tweaks.density]);
  return /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks \xB7 feel reshaping"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Brand mood"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-600)",
      marginTop: -4,
      marginBottom: 8,
      lineHeight: 1.5
    }
  }, "Swaps the whole palette + accent. Watch buttons, badges, and tints all shift together."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, Object.entries(MOODS).map(([id, m]) => {
    const active = tweaks.mood === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setTweak("mood", id),
      style: {
        padding: 10,
        borderRadius: 10,
        cursor: "pointer",
        textAlign: "left",
        border: active ? "1.5px solid " + m.vars["--sage-700"] : "1px solid var(--paper-300)",
        background: active ? "rgba(0,0,0,0.02)" : "var(--surface)",
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 6,
        background: m.vars["--sage-700"]
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 6,
        background: m.vars["--sage-600"]
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 6,
        background: m.vars["--paper-150"],
        border: "1px solid rgba(0,0,0,0.06)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 6,
        background: m.vars["--paper-300"],
        border: "1px solid rgba(0,0,0,0.06)"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: "var(--ink-900)"
      }
    }, m.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "var(--ink-600)",
        lineHeight: 1.4
      }
    }, m.hint));
  }))), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Form language"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-600)",
      marginTop: -4,
      marginBottom: 8,
      lineHeight: 1.5
    }
  }, "Corner radii + shadow depth as a unit."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8
    }
  }, Object.entries(FORMS).map(([id, f]) => {
    const active = tweaks.form === id;
    const sample = id === "soft" ? 18 : id === "crisp" ? 8 : 0;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setTweak("form", id),
      style: {
        padding: 10,
        cursor: "pointer",
        textAlign: "center",
        border: active ? "1.5px solid var(--sage-700)" : "1px solid var(--paper-300)",
        borderRadius: 10,
        background: active ? "rgba(0,0,0,0.02)" : "var(--surface)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 26,
        background: "var(--sage-700)",
        borderRadius: sample,
        boxShadow: id === "soft" ? "0 4px 12px rgba(0,0,0,0.12)" : id === "crisp" ? "0 1px 2px rgba(0,0,0,0.10)" : "0 0 0 1.5px rgba(0,0,0,0.20)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: "var(--ink-900)"
      }
    }, f.label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-600)",
      marginTop: 8,
      lineHeight: 1.5
    }
  }, (FORMS[tweaks.form] || FORMS.soft).hint)), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Type voice"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-600)",
      marginTop: -4,
      marginBottom: 8,
      lineHeight: 1.5
    }
  }, "Display + body family swap."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, Object.entries(VOICES).map(([id, v]) => {
    const active = tweaks.voice === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setTweak("voice", id),
      style: {
        padding: "10px 12px",
        cursor: "pointer",
        textAlign: "left",
        border: active ? "1.5px solid var(--sage-700)" : "1px solid var(--paper-300)",
        borderRadius: 10,
        background: active ? "rgba(0,0,0,0.02)" : "var(--surface)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        fontFamily: v.display,
        color: "var(--ink-900)"
      }
    }, v.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "var(--ink-600)",
        marginTop: 2
      }
    }, v.hint)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontFamily: v.display,
        fontWeight: 700,
        color: "var(--sage-700)",
        letterSpacing: v.tracking
      }
    }, "Aa"));
  }))), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Density",
    value: tweaks.density,
    onChange: v => setTweak("density", v),
    options: [{
      value: "compact",
      label: "Compact"
    }, {
      value: "regular",
      label: "Regular"
    }, {
      value: "airy",
      label: "Airy"
    }]
  }));
}

// Mount the tweaks panel into its own root.
const tweaksRoot = document.createElement("div");
tweaksRoot.id = "__journey-tweaks-root";
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(/*#__PURE__*/React.createElement(JourneyTweaks, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "journeys/journey-tweaks.jsx", error: String((e && e.message) || e) }); }

// tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Brand.jsx
try { (() => {
// InMan brand bits — wordmark, glyph, three nav variants.
// Mirrors /Components/components/{BrandIdentity,TypeSignUp,TypeClose,TypeSignedIn}.

const BrandIdentity = ({
  size = "md"
}) => {
  const dims = size === "lg" ? {
    icon: 28,
    text: 32,
    gap: 10
  } : {
    icon: 20,
    text: 24,
    gap: 8
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: dims.gap
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/brand-icon.svg",
    alt: "",
    style: {
      width: dims.icon,
      height: dims.icon
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: dims.text,
      lineHeight: `${dims.text + 8}px`,
      letterSpacing: "-1.2px",
      color: "var(--sage-700)"
    }
  }, "InMan"));
};

// Hamburger/close/avatar — small inline glyphs.
const HamburgerGlyph = () => /*#__PURE__*/React.createElement("svg", {
  width: "22",
  height: "18",
  viewBox: "0 0 32 26",
  fill: "var(--sage-700)",
  "aria-hidden": true
}, /*#__PURE__*/React.createElement("path", {
  d: "M 0 26 L 0 21.667 L 32 21.667 L 32 26 L 0 26 Z M 0 15.167 L 0 10.833 L 32 10.833 L 32 15.167 L 0 15.167 Z M 0 4.333 L 0 0 L 32 0 L 32 4.333 L 0 4.333 Z"
}));
const CloseGlyph = () => /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "#fff",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  "aria-hidden": true
}, /*#__PURE__*/React.createElement("path", {
  d: "M2 2 L12 12 M12 2 L2 12"
}));
const UserGlyph = () => /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#fff",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "8",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 21 a8 8 0 0 1 16 0"
}));

// Nav header — `variant` controls the right-side button: signup | close | signedin
const NavHeader = ({
  variant = "signup",
  onAction
}) => {
  const right = (() => {
    if (variant === "close") return /*#__PURE__*/React.createElement("button", {
      onClick: onAction,
      style: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        background: "var(--ink-900)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      },
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(CloseGlyph, null));
    if (variant === "signedin") return /*#__PURE__*/React.createElement("button", {
      onClick: onAction,
      style: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        background: "var(--sage-600)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      },
      "aria-label": "Account"
    }, /*#__PURE__*/React.createElement(UserGlyph, null));
    return /*#__PURE__*/React.createElement("button", {
      onClick: onAction,
      style: {
        height: 36,
        padding: "0 16px",
        borderRadius: 9999,
        background: "var(--sage-700)",
        color: "#fff",
        border: "none",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer"
      }
    }, "Sign up");
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 72,
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Menu",
    style: {
      background: "none",
      border: "none",
      padding: 4,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(HamburgerGlyph, null)), /*#__PURE__*/React.createElement(BrandIdentity, null), right);
};
Object.assign(window, {
  BrandIdentity,
  NavHeader,
  HamburgerGlyph,
  CloseGlyph,
  UserGlyph
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Brand.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Buttons.jsx
try { (() => {
// Buttons & input fields. Mirrors /Components/Button + /Components/Inputs.

const ArrowGlyph = ({
  size = 14,
  color = "currentColor"
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: color,
  "aria-hidden": true
}, /*#__PURE__*/React.createElement("path", {
  d: "M 12.175 9 L 0 9 L 0 7 L 12.175 7 L 6.575 1.4 L 8 0 L 16 8 L 8 16 L 6.575 14.6 L 12.175 9 L 12.175 9"
}));

// Primary CTA — sage gradient, white text, optional arrow, sage-tinted shadow.
const PrimaryButton = ({
  children,
  onClick,
  arrow = false,
  height = 56
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    width: "100%",
    height,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "var(--gradient-primary)",
    boxShadow: "var(--shadow-cta)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 18,
    color: "#fff",
    transition: "transform 180ms ease-out"
  },
  onMouseDown: e => e.currentTarget.style.transform = "scale(0.98)",
  onMouseUp: e => e.currentTarget.style.transform = "scale(1)",
  onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
}, children, arrow && /*#__PURE__*/React.createElement(ArrowGlyph, {
  size: 16,
  color: "#fff"
}));

// Secondary — paper-250, sage text.
const SecondaryButton = ({
  children,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "var(--surface-container-highest)",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 18,
    color: "var(--sage-700)"
  }
}, children);

// Tertiary — pure text, ink-500.
const TextButton = ({
  children,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "12px 0",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    color: "var(--ink-500)",
    width: "100%",
    textAlign: "center"
  }
}, children);

// Labeled input with paper-100 fill and active 2px sage bottom-bar.
const Field = ({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text"
}) => {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "label-section",
    style: {
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: e => onChange?.(e.target.value),
    style: {
      width: "100%",
      height: 56,
      borderRadius: 12,
      padding: "18px 16px",
      background: focused ? "var(--surface-container-highest)" : "var(--surface-container-low)",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderBottom: focused ? "2px solid var(--sage-700)" : "2px solid transparent",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      color: "var(--ink-900)",
      outline: "none",
      transition: "background 180ms ease-out, border-color 180ms ease-out"
    }
  }), hint && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--ink-500)"
    }
  }, hint));
};
Object.assign(window, {
  PrimaryButton,
  SecondaryButton,
  TextButton,
  Field,
  ArrowGlyph
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Buttons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Cards.jsx
try { (() => {
// Cards: decision, hero, tip, pantry item.

const IconPlinth = ({
  children,
  tint = "stone",
  size = 48
}) => {
  const bg = tint === "sage" ? "rgba(74,130,101,0.10)" : "var(--paper-200)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, children);
};
const HomeGlyph = () => /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "22",
  viewBox: "0 0 16 18",
  fill: "var(--sage-700)"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 0 18 L 0 6 L 8 0 L 16 6 L 16 18 L 10 18 L 10 11 L 6 11 L 6 18 L 0 18 L 0 18"
}));
const InviteGlyph = () => /*#__PURE__*/React.createElement("svg", {
  width: "22",
  height: "18",
  viewBox: "0 0 20 16",
  fill: "var(--ink-600)"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 2 16 C 1.45 16 0.979 15.804 0.587 15.413 C 0.196 15.021 0 14.55 0 14 L 0 2 C 0 1.45 0.196 0.979 0.587 0.587 C 0.979 0.196 1.45 0 2 0 L 18 0 C 18.55 0 19.021 0.196 19.413 0.587 C 19.804 0.979 20 1.45 20 2 L 20 14 C 20 14.55 19.804 15.021 19.413 15.413 C 19.021 15.804 18.55 16 18 16 L 2 16 L 2 16 M 10 9 L 18 4 L 18 2 L 10 7 L 2 2 L 2 4 L 10 9 L 10 9"
}));
const CheckGlyph = () => /*#__PURE__*/React.createElement("svg", {
  width: "22",
  height: "20",
  viewBox: "0 0 22 20",
  fill: "#fff"
}, /*#__PURE__*/React.createElement("path", {
  d: "M2 10 L8 16 L20 4",
  stroke: "#fff",
  strokeWidth: "3",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));

// Decision card — the onboarding "Start a new Crew" / "I have an invite" pair.
const DecisionCard = ({
  icon,
  iconTint,
  title,
  body,
  recommended,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    width: "100%",
    textAlign: "left",
    border: "none",
    cursor: "pointer",
    background: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    boxShadow: "var(--shadow-ambient-lg)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    transition: "transform 180ms ease-out"
  },
  onMouseDown: e => e.currentTarget.style.transform = "scale(0.99)",
  onMouseUp: e => e.currentTarget.style.transform = "scale(1)",
  onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
}, /*#__PURE__*/React.createElement(IconPlinth, {
  tint: iconTint
}, icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "headline-md",
  style: {
    marginBottom: 8
  }
}, title), /*#__PURE__*/React.createElement("div", {
  className: "body-md",
  style: {
    marginTop: 0
  }
}, body)), recommended && /*#__PURE__*/React.createElement("div", {
  style: {
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "var(--paper-250)",
    borderRadius: 9999,
    padding: "6px 12px"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    color: "var(--ink-600)"
  }
}, "Recommended for first-time users")));

// Hero card — sage gradient with "🎉" celebration.
const HeroCard = ({
  title,
  body,
  badge
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
    background: "var(--gradient-primary)",
    boxShadow: "0 4px 32px rgba(49,105,77,0.15)",
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 104,
    height: 104,
    borderRadius: 9999,
    background: "rgba(153,211,178,0.2)"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    maxWidth: 200
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 18,
    color: "#fff",
    marginBottom: 5
  }
}, title), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 14,
    lineHeight: "20px",
    color: "var(--sage-100)",
    opacity: 0.95
  }
}, body)), badge && /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    width: 48,
    height: 48,
    borderRadius: 9999,
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, badge));

// Tip card — amber bordered (the one allowed border use).
const TipCard = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--paper-100)",
    borderRadius: 12,
    border: "1px solid var(--warn)",
    padding: 20,
    display: "flex",
    gap: 16,
    alignItems: "flex-start"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    background: "var(--warn)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "#fff"
  }
}, "!"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 14,
    lineHeight: "22px",
    color: "var(--ink-900)"
  }
}, children));
Object.assign(window, {
  DecisionCard,
  HeroCard,
  TipCard,
  IconPlinth,
  HomeGlyph,
  InviteGlyph,
  CheckGlyph
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Cards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Components.jsx
try { (() => {
// Round-it-out components: toggles, chips, list rows, modal, sheet, toast,
// empty state, inline alerts, search, stepper, segmented control.
// Loaded after Buttons.jsx + Cards.jsx + Icons.jsx.

const {
  useState
} = React;

/* ── Toggle / Switch ─────────────────────────────────────────────── */
const Toggle = ({
  on,
  onChange,
  label,
  hint
}) => {
  const [internal, setInternal] = useState(!!on);
  const isOn = on === undefined ? internal : on;
  const flip = () => {
    if (on === undefined) setInternal(!internal);
    onChange?.(!isOn);
  };
  const track = isOn ? "var(--sage-700)" : "var(--paper-300)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "10px 0"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: flip,
    role: "switch",
    "aria-checked": isOn,
    style: {
      width: 48,
      height: 28,
      padding: 2,
      border: "none",
      cursor: "pointer",
      background: track,
      borderRadius: 9999,
      position: "relative",
      transition: "background 200ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: isOn ? 22 : 2,
      width: 24,
      height: 24,
      background: "#fff",
      borderRadius: 9999,
      boxShadow: "0 1px 3px rgba(28,28,24,0.18)",
      transition: "left 220ms cubic-bezier(0.32,0.72,0,1)"
    }
  })), label && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--ink-900)"
    }
  }, label), hint && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "var(--ink-600)",
      marginTop: 2
    }
  }, hint)));
};

/* ── Chip / Tag / Filter Pill ────────────────────────────────────── */
const Chip = ({
  children,
  variant = "default",
  icon,
  onRemove,
  onClick,
  selected = false
}) => {
  const styles = {
    default: {
      bg: "var(--paper-250)",
      fg: "var(--ink-900)"
    },
    sage: {
      bg: "rgba(74,130,101,0.12)",
      fg: "var(--sage-700)"
    },
    warn: {
      bg: "rgba(217,119,6,0.12)",
      fg: "#A05A05"
    },
    error: {
      bg: "rgba(186,26,26,0.10)",
      fg: "var(--error)"
    },
    selected: {
      bg: "var(--sage-700)",
      fg: "#fff"
    }
  };
  const s = selected ? styles.selected : styles[variant] || styles.default;
  const Tag = onClick ? "button" : "span";
  return /*#__PURE__*/React.createElement(Tag, {
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 9999,
      border: "none",
      cursor: onClick ? "pointer" : "default",
      background: s.bg,
      color: s.fg,
      fontFamily: "var(--font-body)",
      fontWeight: 500,
      fontSize: 12,
      lineHeight: "16px",
      transition: "background 160ms ease-out"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, icon), /*#__PURE__*/React.createElement("span", null, children), onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: "inline-flex",
      marginLeft: 2,
      cursor: "pointer",
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(IconClose, {
    size: 12
  })));
};

/* ── List Row ────────────────────────────────────────────────────── */
const ListRow = ({
  icon,
  title,
  subtitle,
  meta,
  onClick,
  trailing
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    width: "100%",
    textAlign: "left",
    border: "none",
    cursor: onClick ? "pointer" : "default",
    background: "var(--paper-50)",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 14,
    transition: "background 180ms ease-out",
    boxShadow: "0 1px 2px rgba(28,28,24,0.04)"
  },
  onMouseEnter: e => onClick && (e.currentTarget.style.background = "#fff"),
  onMouseLeave: e => onClick && (e.currentTarget.style.background = "var(--paper-50)")
}, icon && /*#__PURE__*/React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    flexShrink: 0,
    background: "rgba(74,130,101,0.10)",
    color: "var(--sage-700)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, icon), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 15,
    color: "var(--ink-900)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}, title), subtitle && /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)",
    marginTop: 2
  }
}, subtitle)), meta && /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink-600)"
  }
}, meta), trailing !== undefined ? trailing : onClick && /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--ink-400)"
  }
}, /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 20
})));

/* ── Inline Alert ────────────────────────────────────────────────── */
const Alert = ({
  kind = "info",
  title,
  children
}) => {
  const map = {
    success: {
      bg: "rgba(74,130,101,0.10)",
      border: "var(--sage-600)",
      fg: "var(--sage-700)",
      icon: /*#__PURE__*/React.createElement(IconCheck, {
        size: 18
      })
    },
    error: {
      bg: "var(--error-bg)",
      border: "var(--error)",
      fg: "var(--error)",
      icon: /*#__PURE__*/React.createElement(IconAlert, {
        size: 18
      })
    },
    info: {
      bg: "rgba(37,99,235,0.08)",
      border: "var(--info)",
      fg: "var(--info)",
      icon: /*#__PURE__*/React.createElement(IconInfo, {
        size: 18
      })
    },
    warn: {
      bg: "var(--warn-bg)",
      border: "var(--warn)",
      fg: "var(--warn)",
      icon: /*#__PURE__*/React.createElement(IconAlert, {
        size: 18
      })
    }
  };
  const c = map[kind] || map.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: c.bg,
      borderRadius: 12,
      border: `1px solid ${c.border}`,
      padding: 16,
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 9999,
      background: c.border,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, c.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 14,
      color: "var(--ink-900)",
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--ink-900)"
    }
  }, children)));
};

/* ── Toast / Snackbar ────────────────────────────────────────────── */
const Toast = ({
  kind = "info",
  children,
  action,
  onAction
}) => {
  const c = kind === "success" ? {
    bg: "var(--sage-700)",
    fg: "#fff",
    icon: /*#__PURE__*/React.createElement(IconCheck, {
      size: 18
    })
  } : kind === "error" ? {
    bg: "var(--ink-900)",
    fg: "#fff",
    icon: /*#__PURE__*/React.createElement(IconAlert, {
      size: 18
    })
  } : {
    bg: "var(--ink-900)",
    fg: "#fff",
    icon: null
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: c.bg,
      color: c.fg,
      borderRadius: 12,
      padding: "12px 16px",
      boxShadow: "0 8px 32px rgba(28,28,24,0.18)",
      fontFamily: "var(--font-body)",
      fontSize: 14
    }
  }, c.icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, c.icon), /*#__PURE__*/React.createElement("span", null, children), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--sage-100)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 13,
      marginLeft: 8
    }
  }, action));
};

/* ── Search Bar ──────────────────────────────────────────────────── */
const SearchBar = ({
  value,
  onChange,
  placeholder = "Search items…",
  onClear
}) => {
  const [focused, setFocused] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px",
      height: 48,
      borderRadius: 12,
      background: focused ? "var(--paper-250)" : "var(--paper-100)",
      borderBottom: focused ? "2px solid var(--sage-700)" : "2px solid transparent",
      transition: "background 180ms ease-out, border-color 180ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-500)"
    }
  }, /*#__PURE__*/React.createElement(IconSearch, {
    size: 18
  })), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange?.(e.target.value),
    placeholder: placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-body)",
      fontSize: 15,
      color: "var(--ink-900)"
    }
  }), value && /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    "aria-label": "Clear",
    style: {
      width: 22,
      height: 22,
      borderRadius: 9999,
      border: "none",
      cursor: "pointer",
      background: "var(--paper-300)",
      color: "var(--ink-700)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(IconClose, {
    size: 12
  })));
};

/* ── Segmented Control ───────────────────────────────────────────── */
const Segmented = ({
  options,
  value,
  onChange
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-flex",
    padding: 4,
    borderRadius: 9999,
    background: "var(--paper-200)",
    gap: 2
  }
}, options.map(opt => {
  const active = opt.value === value;
  return /*#__PURE__*/React.createElement("button", {
    key: opt.value,
    onClick: () => onChange?.(opt.value),
    style: {
      padding: "8px 16px",
      borderRadius: 9999,
      border: "none",
      cursor: "pointer",
      background: active ? "#fff" : "transparent",
      color: active ? "var(--ink-900)" : "var(--ink-600)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 13,
      boxShadow: active ? "0 1px 2px rgba(28,28,24,0.08)" : "none",
      transition: "background 180ms ease-out, color 180ms ease-out"
    }
  }, opt.label);
}));

/* ── Stepper (numeric +/-) ───────────────────────────────────────── */
const Stepper = ({
  value = 1,
  onChange,
  min = 0,
  max = 99
}) => {
  const [internal, setInternal] = useState(value);
  const v = onChange ? value : internal;
  const set = next => {
    next = Math.max(min, Math.min(max, next));
    if (onChange) onChange(next);else setInternal(next);
  };
  const btn = {
    width: 36,
    height: 36,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer",
    background: "var(--paper-200)",
    color: "var(--ink-900)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => set(v - 1),
    "aria-label": "Decrease",
    style: btn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "2",
    viewBox: "0 0 14 2"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "14",
    height: "2",
    rx: "1",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 32,
      textAlign: "center",
      fontFamily: "var(--font-numeric)",
      fontWeight: 700,
      fontSize: 17,
      color: "var(--ink-900)",
      fontFeatureSettings: '"tnum" 1'
    }
  }, v), /*#__PURE__*/React.createElement("button", {
    onClick: () => set(v + 1),
    "aria-label": "Increase",
    style: btn
  }, /*#__PURE__*/React.createElement(IconPlus, {
    size: 16
  })));
};

/* ── Empty State ─────────────────────────────────────────────────── */
const EmptyState = ({
  icon,
  title,
  body,
  action
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "40px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 72,
    height: 72,
    borderRadius: 9999,
    background: "var(--paper-200)",
    color: "var(--sage-700)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, icon || /*#__PURE__*/React.createElement(IconBox, {
  size: 32
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "headline-md",
  style: {
    marginBottom: 6
  }
}, title), body && /*#__PURE__*/React.createElement("div", {
  className: "body-md",
  style: {
    maxWidth: 280,
    margin: "0 auto"
  }
}, body)), action);

/* ── Modal ───────────────────────────────────────────────────────── */
const Modal = ({
  open,
  onClose,
  title,
  children,
  footer
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(28,28,24,0.4)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 360,
      background: "var(--paper-50)",
      borderRadius: 16,
      boxShadow: "0 24px 64px rgba(28,28,24,0.18)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "headline-md",
    style: {
      flex: 1
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      border: "none",
      cursor: "pointer",
      background: "var(--paper-200)",
      color: "var(--ink-900)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(IconClose, {
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "body-md"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, footer)));
};

/* ── Bottom Sheet ────────────────────────────────────────────────── */
const Sheet = ({
  open,
  onClose,
  title,
  children
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 100,
      background: "rgba(28,28,24,0.35)",
      display: "flex",
      alignItems: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      background: "var(--paper-50)",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: "12px 24px 32px",
      boxShadow: "0 -8px 32px rgba(28,28,24,0.12)",
      animation: "sheet-up 320ms cubic-bezier(0.32,0.72,0,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 9999,
      background: "var(--paper-300)",
      margin: "8px auto 16px"
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    className: "headline-md",
    style: {
      marginBottom: 12
    }
  }, title), /*#__PURE__*/React.createElement("div", null, children)), /*#__PURE__*/React.createElement("style", null, `@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }`));
};
Object.assign(window, {
  Toggle,
  Chip,
  ListRow,
  Alert,
  Toast,
  SearchBar,
  Segmented,
  Stepper,
  EmptyState,
  Modal,
  Sheet
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Dashboard.jsx
try { (() => {
// Dashboard bits — bottom nav, onboarding-checklist section, signed-in nav user button.

const NavGlyph = ({
  name
}) => {
  const paths = {
    home: /*#__PURE__*/React.createElement("path", {
      d: "M 0 18 L 0 6 L 8 0 L 16 6 L 16 18 L 10 18 L 10 11 L 6 11 L 6 18 L 0 18 L 0 18"
    }),
    inventory: /*#__PURE__*/React.createElement("path", {
      d: "M2 4 H18 V18 H2 Z M2 10 H18 M10 4 V18",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }),
    shopping: /*#__PURE__*/React.createElement("path", {
      d: "M3 6 H17 L15 16 H5 Z M7 6 V3 a3 3 0 0 1 6 0 V6",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinejoin: "round"
    }),
    batches: /*#__PURE__*/React.createElement("path", {
      d: "M3 8 L10 4 L17 8 V14 L10 18 L3 14 Z M10 4 V18 M3 8 L10 12 L17 8",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinejoin: "round"
    }),
    more: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: "4",
      cy: "10",
      r: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "10",
      cy: "10",
      r: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "16",
      cy: "10",
      r: "2"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, paths[name]);
};
const BottomNav = ({
  active = "home",
  onChange
}) => {
  const items = [{
    id: "home",
    label: "Home"
  }, {
    id: "inventory",
    label: "Inventory"
  }, {
    id: "shopping",
    label: "Shopping"
  }, {
    id: "batches",
    label: "Batches"
  }, {
    id: "more",
    label: "More"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 65,
      padding: 8,
      background: "rgba(253,249,242,0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid var(--glass-border)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center"
    }
  }, items.map(it => {
    const isActive = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange?.(it.id),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        color: isActive ? "var(--sage-700)" : "var(--ink-600)",
        width: 64
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 26,
        borderRadius: 9999,
        background: isActive ? "rgba(230,226,218,0.7)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 180ms ease-out"
      }
    }, /*#__PURE__*/React.createElement(NavGlyph, {
      name: it.id
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: 10,
        fontWeight: 500,
        color: isActive ? "var(--sage-700)" : "var(--ink-600)"
      }
    }, it.label));
  }));
};

// The big onboarding-checklist section block on the dashboard.
const OnboardingSection = ({
  name,
  completedSteps = 1,
  totalSteps = 5,
  onStep
}) => {
  const steps = [{
    id: 1,
    title: "Set up your Crew",
    subtitle: "Name your shared workspace"
  }, {
    id: 2,
    title: "Map your spaces",
    subtitle: "Pantry, bar, every shelf between"
  }, {
    id: 3,
    title: "Add your first items",
    subtitle: "Scan, snap, or type"
  }, {
    id: 4,
    title: "Invite your people",
    subtitle: "Share access with your Crew"
  }, {
    id: 5,
    title: "Set your first batch",
    subtitle: "Recipes & prep tracking"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      background: "var(--paper-100)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(HeroCard, {
    title: `${name}'s pantry is live 🎉`,
    body: "Complete the steps below\nto finish onboarding",
    badge: /*#__PURE__*/React.createElement(CheckGlyph, null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 8,
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "title-md",
    style: {
      marginBottom: 4
    }
  }, "Setup Progress"), /*#__PURE__*/React.createElement(ProgressBar, {
    step: completedSteps,
    of: totalSteps,
    label: `${completedSteps}/${totalSteps} Complete`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(ChecklistStep, {
    key: s.id,
    index: s.id,
    title: s.title,
    subtitle: s.subtitle,
    complete: i < completedSteps,
    current: i === completedSteps,
    onClick: () => onStep?.(s.id)
  }))));
};
Object.assign(window, {
  BottomNav,
  OnboardingSection,
  NavGlyph
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// InMan icon set — solid / filled, slightly chunky to match the brand glyph.
// All icons render at 24×24 by default and accept `size` and `color`.
// One color per icon. Default color is currentColor so they pick up text color.

const Icon = ({
  children,
  size = 24,
  color = "currentColor",
  ...rest
}) => /*#__PURE__*/React.createElement("svg", _extends({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: color,
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": "true"
}, rest), children);

/* ── Navigation ───────────────────────────────────────────────────────── */

const IconHome = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 11 L12 4 L21 11 V20 a1 1 0 0 1 -1 1 H15 V14 H9 V21 H4 a1 1 0 0 1 -1 -1 Z"
}));
const IconInventory = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 5 a2 2 0 0 1 2 -2 H19 a2 2 0 0 1 2 2 V19 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z M3 12 H21 M12 3 V21",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round"
}));
const IconShopping = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M5 7 H19 L17.5 18 a1 1 0 0 1 -1 1 H7.5 a1 1 0 0 1 -1 -1 Z M8 7 V5 a4 4 0 0 1 8 0 V7",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round",
  strokeLinecap: "round"
}));
const IconBatches = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 3 L21 8 V16 L12 21 L3 16 V8 Z M12 3 V21 M3 8 L12 13 L21 8",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round"
}));
const IconMore = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "5",
  cy: "12",
  r: "2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "19",
  cy: "12",
  r: "2"
}));
const IconBack = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M15 5 L8 12 L15 19",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const IconClose = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M6 6 L18 18 M18 6 L6 18",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round"
}));
const IconMenu = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 6 H21 M3 12 H21 M3 18 H21",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round"
}));
const IconChevronRight = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M9 5 L16 12 L9 19",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const IconChevronDown = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M5 9 L12 16 L19 9",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));

/* ── Actions ───────────────────────────────────────────────────────── */

const IconPlus = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 5 V19 M5 12 H19",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round"
}));
const IconSearch = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "11",
  cy: "11",
  r: "6.5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 16 L20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round"
}));
const IconFilter = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 5 H21 L14 13 V20 L10 18 V13 Z"
}));
const IconSort = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M7 4 V18 L4 15 M7 4 L10 7 M17 20 V6 L20 9 M17 20 L14 17",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round",
  strokeLinecap: "round"
}));
const IconScan = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 8 V5 a2 2 0 0 1 2 -2 H8 M16 3 H19 a2 2 0 0 1 2 2 V8 M21 16 V19 a2 2 0 0 1 -2 2 H16 M8 21 H5 a2 2 0 0 1 -2 -2 V16 M3 12 H21",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const IconCamera = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M4 8 a2 2 0 0 1 2 -2 H8.5 L10 4 H14 L15.5 6 H18 a2 2 0 0 1 2 2 V18 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 Z",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "13",
  r: "3.5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25"
}));
const IconEdit = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M4 20 H8 L19 9 L15 5 L4 16 Z M14 6 L18 10",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round",
  strokeLinecap: "round"
}));
const IconDelete = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M5 7 H19 L18 20 a1 1 0 0 1 -1 1 H7 a1 1 0 0 1 -1 -1 Z M9 7 V4 a1 1 0 0 1 1 -1 H14 a1 1 0 0 1 1 1 V7 M3 7 H21 M10 11 V17 M14 11 V17",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round",
  strokeLinecap: "round"
}));
const IconShare = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "6",
  cy: "12",
  r: "3"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "18",
  cy: "6",
  r: "3"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "18",
  cy: "18",
  r: "3"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8.5 10.5 L15.5 7 M8.5 13.5 L15.5 17",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinecap: "round"
}));
const IconCheck = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M5 12 L10 17 L19 7",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.75",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const IconClock = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "9",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 7 V12 L15.5 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const IconAlert = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 3 L22 20 H2 Z",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 9 V14 M12 17 V17.01",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round"
}));
const IconInfo = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "9",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 11 V17 M12 7 V7.01",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round"
}));

/* ── Inventory objects (bonus, for empty states) ─────────────────── */

const IconBottle = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M10 2 H14 V6 a3 3 0 0 0 1 2.2 L16.5 10 a3 3 0 0 1 1 2.2 V20 a2 2 0 0 1 -2 2 H8.5 a2 2 0 0 1 -2 -2 V12.2 a3 3 0 0 1 1 -2.2 L9 8.2 A3 3 0 0 0 10 6 Z",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round"
}));
const IconBox = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 7 L12 3 L21 7 V17 L12 21 L3 17 Z M3 7 L12 11 L21 7 M12 11 V21",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.25",
  strokeLinejoin: "round"
}));
const ALL_ICONS = {
  IconHome,
  IconInventory,
  IconShopping,
  IconBatches,
  IconMore,
  IconBack,
  IconClose,
  IconMenu,
  IconChevronRight,
  IconChevronDown,
  IconPlus,
  IconSearch,
  IconFilter,
  IconSort,
  IconScan,
  IconCamera,
  IconEdit,
  IconDelete,
  IconShare,
  IconCheck,
  IconClock,
  IconAlert,
  IconInfo,
  IconBottle,
  IconBox
};
Object.assign(window, ALL_ICONS, {
  Icon,
  ALL_ICONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Onboarding.jsx
try { (() => {
// Onboarding bits — progress indicator, hierarchy tree, checklist step.

// Step progress (used at the top of each onboarding screen).
const ProgressBar = ({
  step,
  of = 5,
  label
}) => {
  const pct = step / of * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 16px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "label-section",
    style: {
      textTransform: "none",
      letterSpacing: "0.4px"
    }
  }, label ?? `Step ${step} of ${of}`), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--ink-700)"
    }
  }, step, " of ", of)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 9999,
      background: "var(--paper-300)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: 8,
      borderRadius: 9999,
      background: "var(--sage-700)",
      transition: "width 320ms cubic-bezier(0.32,0.72,0,1)"
    }
  })));
};

// Hierarchy tree node — Premises / Area / Sub-section / Container.
const HierarchyNode = ({
  level,
  eyebrow,
  name,
  icon,
  indent = 0,
  lastChild = false,
  faint = false
}) => {
  const fontSize = level >= 5 ? 14 : 16;
  const eyebrowSize = level >= 5 ? 9 : 10;
  const bg = level === 1 ? "var(--paper-250)" : level >= 5 ? faint ? "rgba(255,255,255,0.8)" : "#fff" : "#fff";
  const border = level >= 5 ? `1px solid ${faint ? "var(--paper-300)" : "rgba(74,130,101,0.3)"}` : "none";
  const shadow = level === 1 ? "0 1px 2px rgba(0,0,0,0.05)" : "none";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginLeft: indent
    }
  }, indent > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: -16,
      top: -16,
      width: 16,
      height: 41,
      borderLeft: "1px solid var(--sage-300)",
      borderBottom: "1px solid var(--sage-300)",
      borderBottomLeftRadius: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 8,
      border,
      boxShadow: shadow,
      padding: level === 1 ? 16 : 8,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(IconPlinth, {
    size: level === 1 ? 32 : 28,
    tint: "sage"
  }, icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: eyebrowSize,
      letterSpacing: "0.9px",
      color: "var(--ink-700)",
      textTransform: "uppercase"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize,
      lineHeight: `${fontSize + 6}px`,
      color: "var(--ink-900)",
      marginTop: 2
    }
  }, name))));
};

// Checklist step (one row inside the dashboard onboarding card).
const ChecklistStep = ({
  index,
  title,
  subtitle,
  complete,
  current,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    padding: "12px 8px",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 14,
    transition: "background 160ms ease-out"
  },
  onMouseEnter: e => e.currentTarget.style.background = "var(--paper-100)",
  onMouseLeave: e => e.currentTarget.style.background = "transparent"
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    flexShrink: 0,
    background: complete ? "var(--sage-700)" : "transparent",
    border: complete ? "none" : `2px solid ${current ? "var(--sage-700)" : "var(--paper-300)"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 12,
    color: complete ? "#fff" : "var(--ink-600)"
  }
}, complete ? "✓" : index), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    color: complete ? "var(--ink-600)" : "var(--ink-900)",
    textDecoration: complete ? "line-through" : "none"
  }
}, title), subtitle && /*#__PURE__*/React.createElement("div", {
  className: "body-sm",
  style: {
    marginTop: 2
  }
}, subtitle)), !complete && /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--sage-700)",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13
  }
}, current ? "Resume →" : "Start"));
Object.assign(window, {
  ProgressBar,
  HierarchyNode,
  ChecklistStep
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/inman-app/Screens.jsx
try { (() => {
// Full screens — Landing, SignUp, CrewDecision, CrewName, SpacesIntro, Dashboard.

const Screen = ({
  children,
  scroll = false
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    width: 390,
    height: 844,
    background: "var(--surface)",
    overflow: scroll ? "auto" : "hidden",
    fontFamily: "var(--font-body)"
  }
}, children);

// Landing — hero image, hook, CTA.
const LandingScreen = ({
  go
}) => /*#__PURE__*/React.createElement(Screen, {
  scroll: true
}, /*#__PURE__*/React.createElement(NavHeader, {
  variant: "signup",
  onAction: () => go("signup")
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "32px 24px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 32
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    height: 360,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "var(--shadow-ambient-md)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    background: "url('../../assets/hero-larder.png') center/cover"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%)"
  }
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "display-lg",
  style: {
    marginBottom: 16
  }
}, "Know what you\nhave.\nUse what you buy."), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-accent)",
    fontSize: 18,
    lineHeight: "29px",
    color: "var(--ink-700)"
  }
}, "Track your pantry, bar, and every shelf between. Share with the people who share your kitchen.")), /*#__PURE__*/React.createElement(PrimaryButton, {
  onClick: () => go("signup")
}, "Get started \u2014 it's free")));

// Sign Up — borrows the InMan SignUp component.
const SignUpScreen = ({
  go
}) => {
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  return /*#__PURE__*/React.createElement(Screen, {
    scroll: true
  }, /*#__PURE__*/React.createElement(NavHeader, {
    variant: "close",
    onAction: () => go("landing")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "0 16px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display-lg",
    style: {
      fontSize: 32,
      lineHeight: "40px",
      marginBottom: 12
    }
  }, "Join InMan"), /*#__PURE__*/React.createElement("div", {
    className: "body-lg",
    style: {
      color: "var(--ink-500)"
    }
  }, "Professional inventory management for any environment.")), /*#__PURE__*/React.createElement("button", {
    style: {
      height: 58,
      borderRadius: 8,
      background: "#fff",
      cursor: "pointer",
      border: "1px solid var(--paper-300)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 16,
      color: "var(--ink-900)"
    }
  }, "Continue with Google"), /*#__PURE__*/React.createElement("button", {
    style: {
      height: 58,
      borderRadius: 8,
      background: "#fff",
      cursor: "pointer",
      border: "1px solid var(--paper-300)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 16,
      color: "var(--ink-900)"
    }
  }, "Continue with Facebook"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--paper-300)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "label-eyebrow",
    style: {
      fontSize: 10,
      letterSpacing: 1
    }
  }, "OR USE YOUR EMAIL/PHONE"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--paper-300)"
    }
  })), /*#__PURE__*/React.createElement(Field, {
    label: "EMAIL OR PHONE",
    value: email,
    onChange: setEmail,
    placeholder: "name@company.com"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "PASSWORD",
    value: pw,
    onChange: setPw,
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    type: "password",
    hint: "Must be at least 8 characters with a symbol."
  }), /*#__PURE__*/React.createElement(PrimaryButton, {
    onClick: () => go("crew-decision")
  }, "Create Account"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go("landing"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 16,
      color: "var(--ink-900)"
    }
  }, "Already have an account? ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sage-700)"
    }
  }, "Sign in")))));
};

// Crew Decision — the two-card pick.
const CrewDecisionScreen = ({
  go
}) => /*#__PURE__*/React.createElement(Screen, {
  scroll: true
}, /*#__PURE__*/React.createElement(NavHeader, {
  variant: "close",
  onAction: () => go("signup")
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 24px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 24
  }
}, /*#__PURE__*/React.createElement(ProgressBar, {
  step: 2,
  of: 5
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 8px",
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "display-md",
  style: {
    fontSize: 30,
    lineHeight: "37px",
    letterSpacing: "-0.4px"
  }
}, "Welcome.\nLet's get you set up."), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 18,
    lineHeight: "29px",
    color: "var(--ink-700)"
  }
}, "A Crew is a shared workspace for your inventory. Pick one.")), /*#__PURE__*/React.createElement(DecisionCard, {
  icon: /*#__PURE__*/React.createElement(HomeGlyph, null),
  iconTint: "stone",
  title: "Start a new Crew",
  body: "Create a fresh workspace for your home, bar, or kitchen. You'll be the Crew Admin.",
  recommended: true,
  onClick: () => go("crew-name")
}), /*#__PURE__*/React.createElement(DecisionCard, {
  icon: /*#__PURE__*/React.createElement(InviteGlyph, null),
  iconTint: "stone",
  title: "I have an invite",
  body: "Joining a family member's pantry or a workplace? Paste your invite code.",
  onClick: () => alert("Invite code sheet (not in scope)")
}), /*#__PURE__*/React.createElement(TextButton, {
  onClick: () => go("dashboard")
}, "I'm just exploring \u2014 skip for now")));

// Crew Name — labeled input + sticky CTA tray.
const CrewNameScreen = ({
  go,
  setCrewName,
  crewName
}) => {
  return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(NavHeader, {
    variant: "close",
    onAction: () => go("crew-decision")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    step: 2,
    of: 5
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display-md",
    style: {
      marginBottom: 16
    }
  }, "Name your Crew"), /*#__PURE__*/React.createElement("div", {
    className: "body-md"
  }, "A Crew is a shared workspace. You'll be the Admin.")), /*#__PURE__*/React.createElement(Field, {
    label: "CREW NAME",
    value: crewName,
    onChange: setCrewName,
    placeholder: "e.g. Walker Home, Haywire Bar",
    hint: "You can rename this later."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "24px",
      background: "rgba(253,249,242,0.9)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)"
    }
  }, /*#__PURE__*/React.createElement(PrimaryButton, {
    onClick: () => go("spaces-intro")
  }, "Create Crew")));
};

// Spaces Intro — hierarchy explainer + tip card.
const SpacesIntroScreen = ({
  go,
  crewName
}) => /*#__PURE__*/React.createElement(Screen, {
  scroll: true
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "24px 24px 16px"
  }
}, /*#__PURE__*/React.createElement(ProgressBar, {
  step: 3,
  of: 5,
  label: "SETUP PROGRESS"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 24px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 32
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "display-lg",
  style: {
    fontSize: 36,
    lineHeight: "40px",
    marginBottom: 12
  }
}, "Let's map\nyour spaces"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-body)",
    fontSize: 18,
    lineHeight: "29px",
    color: "var(--ink-700)"
  }
}, `Your pantry, bar, and every shelf between — organized so InMan knows where everything lives.`)), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
}, /*#__PURE__*/React.createElement(HierarchyNode, {
  level: 1,
  eyebrow: "PREMISES",
  name: crewName || "My Home",
  icon: /*#__PURE__*/React.createElement(HomeGlyph, null)
}), /*#__PURE__*/React.createElement(HierarchyNode, {
  level: 2,
  eyebrow: "AREA",
  name: "Pantry Wall",
  icon: /*#__PURE__*/React.createElement(HomeGlyph, null),
  indent: 16
}), /*#__PURE__*/React.createElement(HierarchyNode, {
  level: 2,
  eyebrow: "AREA",
  name: "Upper Cabinet",
  icon: /*#__PURE__*/React.createElement(HomeGlyph, null),
  indent: 16
}), /*#__PURE__*/React.createElement(HierarchyNode, {
  level: 5,
  eyebrow: "SUB-SECTION",
  name: "Top Shelf",
  icon: /*#__PURE__*/React.createElement(HomeGlyph, null),
  indent: 64,
  faint: true
}), /*#__PURE__*/React.createElement(HierarchyNode, {
  level: 5,
  eyebrow: "CONTAINER",
  name: "Glass Jar Set",
  icon: /*#__PURE__*/React.createElement(HomeGlyph, null),
  indent: 96
})), /*#__PURE__*/React.createElement(TipCard, null, /*#__PURE__*/React.createElement("b", null, "Pro Tip:"), " You only need to add the levels that make sense for your space. Skip anything too granular."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, /*#__PURE__*/React.createElement(PrimaryButton, {
  arrow: true,
  onClick: () => go("dashboard")
}, "Start building"), /*#__PURE__*/React.createElement(TextButton, {
  onClick: () => go("dashboard")
}, "I'll explore later"))));

// Dashboard — signed-in nav, welcome, onboarding section, bottom nav.
const DashboardScreen = ({
  go,
  crewName
}) => {
  const [tab, setTab] = React.useState("home");
  return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 72,
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Menu",
    style: {
      background: "none",
      border: "none",
      padding: 4,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(HamburgerGlyph, null)), /*#__PURE__*/React.createElement(BrandIdentity, null), /*#__PURE__*/React.createElement("button", {
    onClick: () => go("landing"),
    style: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      background: "var(--sage-600)",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    },
    "aria-label": "Account"
  }, /*#__PURE__*/React.createElement(UserGlyph, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px 96px",
      height: "calc(100% - 72px - 65px)",
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "23px 0 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display-md"
  }, "Welcome, Davontae")), /*#__PURE__*/React.createElement(OnboardingSection, {
    name: crewName || "Walker Home",
    completedSteps: 1
  })), /*#__PURE__*/React.createElement(BottomNav, {
    active: tab,
    onChange: setTab
  }));
};
Object.assign(window, {
  LandingScreen,
  SignUpScreen,
  CrewDecisionScreen,
  CrewNameScreen,
  SpacesIntroScreen,
  DashboardScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/inman-app/Screens.jsx", error: String((e && e.message) || e) }); }

})();
