// Stub — replaced as journeys are built out.
const _stub = (label) => () => (
  <PhoneFrame>
    <AppBar title={label}/>
    <ScreenBody>
      <EmptyState
        icon={<IconBox size={32}/>}
        title="Coming up next"
        body={`This screen for "${label}" is on the build list.`}
      />
    </ScreenBody>
  </PhoneFrame>
);

const stubs = {
  // Onboarding
  OB_Landing: "Landing", OB_SignUp: "Sign up", OB_CrewDecision: "Crew decision",
  OB_CrewName: "Name your crew + PIN", OB_AcceptInvite: "Accept invite",
  OB_Dashboard: "Dashboard checklist", OB_KioskEnroll: "Kiosk enroll",
  // Adding Inventory
  AI_ProductSearch: "Search products", AI_ExistingMatch: "Already in inventory",
  AI_CreateCustom: "Create custom product", AI_Details: "Inventory details",
  AI_StayInFlow: "Stay in flow", AI_Restock: "Restock", AI_Scan: "Barcode scan",
  AI_BulkMapping: "Bulk import", AI_Quick: "Quick add",
  // Checking Stock
  CS_List: "Inventory list", CS_Expanded: "Expanded item", CS_Filters: "Filters",
  CS_BySpace: "Browse by space", CS_Alerts: "Alerts", CS_Empty: "Empty state",
  // Crew Management
  CM_Switcher: "Crew switcher", CM_Settings: "Crew settings",
  CM_Members: "Members", CM_Invite: "Invite", CM_Permissions: "Permissions",
  CM_Transfer: "Transfer ownership", CM_DeleteBanner: "Delete countdown",
  // Space Reorganization
  RG_Mode: "Reorganize mode", RG_Rename: "Rename", RG_MovePreview: "Move preview",
  RG_Merge: "Merge", RG_Split: "Split", RG_Delete: "Delete",
};

Object.assign(window, Object.fromEntries(Object.entries(stubs).map(([k, v]) => [k, _stub(v)])));
