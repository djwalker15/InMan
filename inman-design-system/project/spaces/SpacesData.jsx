// ─────────────────────────────────────────────────────────────
// Sample spaces tree + helpers for the drill-down prototype.
// Mirrors the real app's 7-level UnitType model
// (premises → area → zone → section → sub_section → container → shelf)
// and the SpaceNode shape from app/src/components/spaces/types.ts.
// ─────────────────────────────────────────────────────────────

// Per-unit metadata: eyebrow label + glyph + tint. Glyphs match the real
// UNIT_TYPE_GLYPH map; tints/plinths follow the design system's sage/amber/ink.
const SP_UNIT = {
  premises:    { label: "Premises",    glyph: "🏠", tint: "var(--sage-700)", plinth: "rgba(74,130,101,0.14)" },
  area:        { label: "Area",        glyph: "🏷️", tint: "var(--sage-700)", plinth: "rgba(74,130,101,0.12)" },
  zone:        { label: "Zone",        glyph: "📍", tint: "var(--sage-700)", plinth: "rgba(74,130,101,0.10)" },
  section:     { label: "Section",     glyph: "📐", tint: "var(--sage-700)", plinth: "rgba(74,130,101,0.10)" },
  sub_section: { label: "Sub-section", glyph: "🔩", tint: "var(--ink-700)",  plinth: "var(--paper-250)" },
  container:   { label: "Container",   glyph: "📦", tint: "#A05A05",         plinth: "rgba(217,119,6,0.12)" },
  shelf:       { label: "Shelf",       glyph: "📏", tint: "var(--ink-700)",  plinth: "var(--paper-250)" },
};

// Allowed child types per parent — mirrors ALLOWED_CHILD_TYPES in tree-helpers.ts.
const SP_ALLOWED_CHILDREN = {
  premises:    ["area", "zone", "section", "sub_section", "container", "shelf"],
  area:        ["zone", "section", "sub_section", "container", "shelf"],
  zone:        ["section", "sub_section", "container", "shelf"],
  section:     ["sub_section", "container", "shelf"],
  sub_section: ["container", "shelf"],
  container:   ["shelf"],
  shelf:       [],
};
const SP_SMART_CHILD = {
  premises: "area", area: "zone", zone: "section", section: "sub_section",
  sub_section: "container", container: "shelf", shelf: null,
};

// An item lives at a leaf space. status drives the optional stock dot.
const it = (name, status) => ({ name, status: status || "ok" });

// ── The sample tree — Walker Home (a real home) + Haywire Bar (a bar) ──
// Each node: { id, parent, type, name, items?, hue }. hue seeds the photo.
const SPACE_NODES = [
  // ══ PREMISES ══
  { id: "walker",  parent: null, type: "premises", name: "Walker Home", hue: 32 },
  { id: "haywire", parent: null, type: "premises", name: "Haywire Bar", hue: 18 },

  // ══ Walker Home · areas ══
  { id: "kitchen", parent: "walker", type: "area", name: "Kitchen",     hue: 36 },
  { id: "garage",  parent: "walker", type: "area", name: "Garage",      hue: 28 },
  { id: "barcart", parent: "walker", type: "area", name: "Bar Cart",    hue: 22 },
  { id: "closet",  parent: "walker", type: "area", name: "Hall Closet", hue: 44 },

  // ── Kitchen · zones ──
  { id: "pantry", parent: "kitchen", type: "zone", name: "Pantry Wall",   hue: 38 },
  { id: "upper",  parent: "kitchen", type: "zone", name: "Upper Cabinets", hue: 40 },
  { id: "fridge", parent: "kitchen", type: "zone", name: "Fridge",        hue: 150 },
  { id: "lower",  parent: "kitchen", type: "zone", name: "Lower Cabinets", hue: 34 },

  // Pantry Wall · sections
  { id: "topshelf", parent: "pantry", type: "section", name: "Top Shelf",    hue: 39 },
  { id: "midshelf", parent: "pantry", type: "section", name: "Middle Shelf", hue: 37 },
  { id: "botshelf", parent: "pantry", type: "section", name: "Bottom Shelf", hue: 35 },

  // Top Shelf · containers (leaves with items)
  { id: "jars",  parent: "topshelf", type: "container", name: "Glass Jar Set", hue: 41,
    items: [it("Basmati rice"), it("Rolled oats"), it("Brown sugar"), it("All-purpose flour"), it("Penne pasta")] },
  { id: "spice", parent: "topshelf", type: "container", name: "Spice Rack", hue: 30,
    items: [it("Ground cumin"), it("Smoked paprika"), it("Cinnamon sticks"), it("Black peppercorns", "expiring")] },

  // Middle / Bottom shelf containers
  { id: "canned", parent: "midshelf", type: "container", name: "Canned Goods", hue: 33,
    items: [it("Chopped tomatoes"), it("Chickpeas"), it("Coconut milk"), it("Black beans")] },
  { id: "rootbox", parent: "botshelf", type: "container", name: "Root Veg Basket", hue: 43,
    items: [it("Yellow onions", "low"), it("Garlic"), it("Potatoes"), it("Shallots", "low")] },

  // Upper Cabinets · sections (mostly non-consumable — fewer items)
  { id: "glassware", parent: "upper", type: "section", name: "Glassware", hue: 46 },
  { id: "baking",    parent: "upper", type: "section", name: "Baking Supplies", hue: 42,
    items: [it("Baking soda"), it("Vanilla extract"), it("Powdered sugar"), it("Cocoa powder", "expiring")] },

  // Fridge · sections
  { id: "dairy",  parent: "fridge", type: "section", name: "Dairy Shelf", hue: 150,
    items: [it("Whole milk", "expiring"), it("Greek yogurt"), it("Cheddar block"), it("Salted butter")] },
  { id: "condi",  parent: "fridge", type: "section", name: "Condiments Door", hue: 150,
    items: [it("Dijon mustard"), it("Sriracha"), it("Soy sauce"), it("Fish sauce"), it("Ketchup")] },
  { id: "produce",parent: "fridge", type: "section", name: "Produce Drawer", hue: 145,
    items: [it("Baby spinach", "expiring"), it("Carrots"), it("Bell peppers"), it("Scallions", "expiring")] },

  // Lower Cabinets
  { id: "pots", parent: "lower", type: "section", name: "Pots & Pans", hue: 32 },
  { id: "oils", parent: "lower", type: "section", name: "Oils & Vinegars", hue: 35,
    items: [it("Olive oil"), it("Vegetable oil"), it("Balsamic vinegar"), it("Sesame oil", "low")] },

  // ── Garage · zones ──
  { id: "toolwall", parent: "garage", type: "zone", name: "Tool Wall", hue: 26 },
  { id: "bevfridge", parent: "garage", type: "zone", name: "Beverage Fridge", hue: 200 },
  { id: "overflow",  parent: "garage", type: "zone", name: "Overflow Shelving", hue: 30 },
  // Beverage fridge containers
  { id: "beer", parent: "bevfridge", type: "container", name: "Beer Drawer", hue: 205,
    items: [it("Lager 6-pack", "low"), it("Hazy IPA"), it("Sparkling water"), it("Cola")] },
  // Overflow
  { id: "household", parent: "overflow", type: "container", name: "Household Stock", hue: 29,
    items: [it("Paper towels", "low"), it("Dish soap"), it("Trash bags"), it("Dishwasher tabs")] },

  // ── Bar Cart · sub-sections (bottles) ──
  { id: "toptray",  parent: "barcart", type: "sub_section", name: "Top Tray", hue: 24,
    items: [it("London dry gin"), it("Bourbon"), it("Sweet vermouth", "low"), it("Campari"), it("Aperol")] },
  { id: "lowershelf", parent: "barcart", type: "sub_section", name: "Lower Shelf", hue: 26,
    items: [it("Tonic water"), it("Club soda"), it("Aromatic bitters"), it("Simple syrup", "expiring")] },

  // ── Hall Closet · sections ──
  { id: "linens",   parent: "closet", type: "section", name: "Linens", hue: 48 },
  { id: "cleaning", parent: "closet", type: "section", name: "Cleaning Supplies", hue: 50,
    items: [it("Laundry detergent"), it("All-purpose spray"), it("Sponges"), it("Bleach", "low")] },

  // ══ Haywire Bar · areas (shallower — shows premises scoping) ══
  { id: "backbar", parent: "haywire", type: "area", name: "Back Bar", hue: 20 },
  { id: "well",    parent: "haywire", type: "area", name: "Speed Well", hue: 16 },
  { id: "walkin",  parent: "haywire", type: "area", name: "Walk-in Cooler", hue: 150 },
  { id: "drystore",parent: "haywire", type: "area", name: "Dry Storage", hue: 30 },
  { id: "topshelf2", parent: "backbar", type: "zone", name: "Top Shelf Spirits", hue: 22,
    items: [it("Single malt"), it("Reposado tequila"), it("Cognac"), it("Mezcal"), it("Rye whiskey")] },
  { id: "speedrack", parent: "well", type: "zone", name: "Speed Rack", hue: 18,
    items: [it("Well vodka", "low"), it("Well gin"), it("Triple sec"), it("Lime juice", "expiring")] },
  { id: "kegs", parent: "walkin", type: "zone", name: "Keg Line", hue: 150,
    items: [it("House lager keg"), it("Pale ale keg", "low"), it("Cider keg")] },
];

// ── Helpers operating on a nodes array (the live, editable tree) ──
const spChildren = (nodes, id) => nodes.filter((n) => n.parent === id);
const spNode = (nodes, id) => nodes.find((n) => n.id === id);
const spRoots = (nodes) => nodes.filter((n) => n.parent === null);

// Path of nodes from a root down to `id` (inclusive).
function spPath(nodes, id) {
  const out = [];
  let cur = spNode(nodes, id);
  while (cur) { out.unshift(cur); cur = cur.parent ? spNode(nodes, cur.parent) : null; }
  return out;
}

// Every descendant id of `id` (not including id).
function spDescendants(nodes, id) {
  const out = [];
  const q = [...spChildren(nodes, id).map((n) => n.id)];
  while (q.length) { const x = q.shift(); out.push(x); q.push(...spChildren(nodes, x).map((n) => n.id)); }
  return out;
}

// All items in a node's subtree (including the node itself).
function spItems(nodes, id) {
  const ids = [id, ...spDescendants(nodes, id)];
  const out = [];
  for (const nid of ids) { const n = spNode(nodes, nid); if (n && n.items) out.push(...n.items); }
  return out;
}

// Aggregate stock health across a subtree → {total, low, expiring}.
function spHealth(nodes, id) {
  const items = spItems(nodes, id);
  let low = 0, expiring = 0;
  for (const i of items) {
    if (i.status === "low" || i.status === "out") low++;
    if (i.status === "expiring" || i.status === "expired") expiring++;
  }
  return { total: items.length, low, expiring };
}

// Reclassify suggestions — valid alternate types given parent + existing children.
function spReclassify(nodes, id) {
  const node = spNode(nodes, id);
  if (!node || node.parent === null) return [];
  const parent = spNode(nodes, node.parent);
  if (!parent) return [];
  const allowedByParent = SP_ALLOWED_CHILDREN[parent.type] || [];
  const liveChildren = spChildren(nodes, id);
  return allowedByParent.filter((t) =>
    t !== node.type && liveChildren.every((c) => (SP_ALLOWED_CHILDREN[t] || []).includes(c.type))
  );
}

// ── Warm "photo" placeholder generator ──
// Returns a layered-gradient CSS background that reads like a tight-crop,
// warm-toned space photograph (stand-in for real space photography).
// Sage hues (≈150) render cool-green for the fridge/cooler; everything else
// stays in the cream→amber→clay band per the brand's imagery vibe.
function spPhoto(hue) {
  const h = ((hue % 360) + 360) % 360;
  const isCool = h > 120 && h < 180;
  const base1 = `hsl(${h} ${isCool ? 26 : 46}% ${isCool ? 62 : 72}%)`;
  const base2 = `hsl(${h + 14} ${isCool ? 30 : 52}% ${isCool ? 40 : 48}%)`;
  const glow  = `hsl(${h - 6} ${isCool ? 30 : 60}% 82%)`;
  const deep  = `hsl(${h + 22} ${isCool ? 34 : 44}% ${isCool ? 30 : 34}%)`;
  return [
    // top-down dark gradient to seat type (0–22% black, per design system)
    "linear-gradient(180deg, rgba(28,28,24,0.30) 0%, rgba(28,28,24,0) 34%, rgba(28,28,24,0.04) 64%, rgba(28,28,24,0.30) 100%)",
    `radial-gradient(120% 88% at 22% 12%, ${glow} 0%, transparent 56%)`,
    `radial-gradient(130% 120% at 86% 96%, ${deep} 0%, transparent 52%)`,
    `linear-gradient(138deg, ${base1} 0%, ${base2} 100%)`,
  ].join(", ");
}

Object.assign(window, {
  SP_UNIT, SP_ALLOWED_CHILDREN, SP_SMART_CHILD, SPACE_NODES,
  spChildren, spNode, spRoots, spPath, spDescendants, spItems, spHealth, spReclassify, spPhoto,
});
