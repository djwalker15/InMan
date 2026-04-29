// InMan icon set — solid / filled, slightly chunky to match the brand glyph.
// All icons render at 24×24 by default and accept `size` and `color`.
// One color per icon. Default color is currentColor so they pick up text color.

const Icon = ({ children, size = 24, color = "currentColor", ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

/* ── Navigation ───────────────────────────────────────────────────────── */

const IconHome = (p) => (
  <Icon {...p}><path d="M3 11 L12 4 L21 11 V20 a1 1 0 0 1 -1 1 H15 V14 H9 V21 H4 a1 1 0 0 1 -1 -1 Z"/></Icon>
);
const IconInventory = (p) => (
  <Icon {...p}>
    <path d="M3 5 a2 2 0 0 1 2 -2 H19 a2 2 0 0 1 2 2 V19 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z M3 12 H21 M12 3 V21" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round"/>
  </Icon>
);
const IconShopping = (p) => (
  <Icon {...p}>
    <path d="M5 7 H19 L17.5 18 a1 1 0 0 1 -1 1 H7.5 a1 1 0 0 1 -1 -1 Z M8 7 V5 a4 4 0 0 1 8 0 V7" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round"/>
  </Icon>
);
const IconBatches = (p) => (
  <Icon {...p}>
    <path d="M12 3 L21 8 V16 L12 21 L3 16 V8 Z M12 3 V21 M3 8 L12 13 L21 8" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round"/>
  </Icon>
);
const IconMore = (p) => (
  <Icon {...p}>
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </Icon>
);
const IconBack = (p) => (
  <Icon {...p}>
    <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);
const IconClose = (p) => (
  <Icon {...p}>
    <path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </Icon>
);
const IconMenu = (p) => (
  <Icon {...p}>
    <path d="M3 6 H21 M3 12 H21 M3 18 H21" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </Icon>
);
const IconChevronRight = (p) => (
  <Icon {...p}>
    <path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);
const IconChevronDown = (p) => (
  <Icon {...p}>
    <path d="M5 9 L12 16 L19 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

/* ── Actions ───────────────────────────────────────────────────────── */

const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5 V19 M5 12 H19" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </Icon>
);
const IconSearch = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.25"/>
    <path d="M16 16 L20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </Icon>
);
const IconFilter = (p) => (
  <Icon {...p}>
    <path d="M3 5 H21 L14 13 V20 L10 18 V13 Z"/>
  </Icon>
);
const IconSort = (p) => (
  <Icon {...p}>
    <path d="M7 4 V18 L4 15 M7 4 L10 7 M17 20 V6 L20 9 M17 20 L14 17" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round"/>
  </Icon>
);
const IconScan = (p) => (
  <Icon {...p}>
    <path d="M3 8 V5 a2 2 0 0 1 2 -2 H8 M16 3 H19 a2 2 0 0 1 2 2 V8 M21 16 V19 a2 2 0 0 1 -2 2 H16 M8 21 H5 a2 2 0 0 1 -2 -2 V16 M3 12 H21" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);
const IconCamera = (p) => (
  <Icon {...p}>
    <path d="M4 8 a2 2 0 0 1 2 -2 H8.5 L10 4 H14 L15.5 6 H18 a2 2 0 0 1 2 2 V18 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 Z" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2.25"/>
  </Icon>
);
const IconEdit = (p) => (
  <Icon {...p}>
    <path d="M4 20 H8 L19 9 L15 5 L4 16 Z M14 6 L18 10" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round"/>
  </Icon>
);
const IconDelete = (p) => (
  <Icon {...p}>
    <path d="M5 7 H19 L18 20 a1 1 0 0 1 -1 1 H7 a1 1 0 0 1 -1 -1 Z M9 7 V4 a1 1 0 0 1 1 -1 H14 a1 1 0 0 1 1 1 V7 M3 7 H21 M10 11 V17 M14 11 V17" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round"/>
  </Icon>
);
const IconShare = (p) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
    <path d="M8.5 10.5 L15.5 7 M8.5 13.5 L15.5 17" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
  </Icon>
);
const IconCheck = (p) => (
  <Icon {...p}>
    <path d="M5 12 L10 17 L19 7" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);
const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.25"/>
    <path d="M12 7 V12 L15.5 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);
const IconAlert = (p) => (
  <Icon {...p}>
    <path d="M12 3 L22 20 H2 Z" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round"/>
    <path d="M12 9 V14 M12 17 V17.01" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </Icon>
);
const IconInfo = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.25"/>
    <path d="M12 11 V17 M12 7 V7.01" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </Icon>
);

/* ── Inventory objects (bonus, for empty states) ─────────────────── */

const IconBottle = (p) => (
  <Icon {...p}>
    <path d="M10 2 H14 V6 a3 3 0 0 0 1 2.2 L16.5 10 a3 3 0 0 1 1 2.2 V20 a2 2 0 0 1 -2 2 H8.5 a2 2 0 0 1 -2 -2 V12.2 a3 3 0 0 1 1 -2.2 L9 8.2 A3 3 0 0 0 10 6 Z" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round"/>
  </Icon>
);
const IconBox = (p) => (
  <Icon {...p}>
    <path d="M3 7 L12 3 L21 7 V17 L12 21 L3 17 Z M3 7 L12 11 L21 7 M12 11 V21" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round"/>
  </Icon>
);

const ALL_ICONS = {
  IconHome, IconInventory, IconShopping, IconBatches, IconMore,
  IconBack, IconClose, IconMenu, IconChevronRight, IconChevronDown,
  IconPlus, IconSearch, IconFilter, IconSort, IconScan, IconCamera,
  IconEdit, IconDelete, IconShare, IconCheck, IconClock, IconAlert, IconInfo,
  IconBottle, IconBox,
};

Object.assign(window, ALL_ICONS, { Icon, ALL_ICONS });
