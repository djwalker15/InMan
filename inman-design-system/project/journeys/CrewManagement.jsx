// Crew Management journey screens — switcher, settings, members, invite, permissions, transfer, deletion countdown.

const Avatar = ({ name, color = "var(--sage-700)", size = 36 }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999,
      background: color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: size * 0.38,
      flexShrink: 0,
    }}>{initials}</div>
  );
};

const RolePill = ({ role }) => {
  const map = {
    Owner:  { bg: "var(--sage-700)",       fg: "#fff" },
    Admin:  { bg: "rgba(74,130,101,0.16)", fg: "var(--sage-700)" },
    Member: { bg: "var(--paper-300)",      fg: "var(--ink-700)" },
    Viewer: { bg: "var(--paper-200)",      fg: "var(--ink-600)" },
  };
  const s = map[role] || map.Member;
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 9999,
      background: s.bg, color: s.fg,
      fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase",
    }}>{role}</span>
  );
};

/* ── CM_Switcher ── Long-press the crew name in the header. ────── */
const CM_Switcher = () => (
  <PhoneFrame>
    <AppBar title="Crews" onBack={() => {}}/>
    <ScreenBody>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { name: "Walker Family",  members: 4, role: "Owner", active: true,  tint: "var(--sage-700)" },
          { name: "The Lake House", members: 6, role: "Admin", active: false, tint: "#7C5BB1" },
          { name: "Sycamore Bar",   members: 11, role: "Member", active: false, tint: "#B65D2C" },
        ].map((c) => (
          <div key={c.name} style={{
            background: c.active ? "var(--paper-100)" : "transparent",
            border: c.active ? "1.5px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
            borderRadius: 14, padding: 14,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: c.tint,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
            }}>{c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)" }}>{c.name}</span>
                {c.active && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--sage-700)", fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>Active</span>}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>
                {c.members} members · {c.role}
              </div>
            </div>
            {c.active && <IconCheck size={18} color="var(--sage-700)"/>}
          </div>
        ))}

        <button style={{
          marginTop: 8, background: "transparent", border: "1.5px dashed var(--paper-300)", borderRadius: 14,
          padding: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          color: "var(--sage-700)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, cursor: "pointer",
        }}>
          <IconPlus size={18}/> Create or join another Crew
        </button>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── CM_Settings ── Crew settings landing. ─────────────────────── */
const CM_Settings = () => (
  <PhoneFrame>
    <AppBar title="Walker Family" onBack={() => {}}/>
    <ScreenBody>
      <div style={{ background: "linear-gradient(135deg, var(--sage-700) 0%, var(--sage-600) 100%)", borderRadius: 16, padding: 18, color: "#fff", marginBottom: 16 }}>
        <div className="label-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Crew · Owner</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginTop: 4 }}>Walker Family</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, opacity: 0.85, marginTop: 4 }}>Created Mar 14, 2026 · 4 members · 247 items</div>
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", margin: "8px 4px" }}>Manage</div>
      <div style={{ background: "var(--paper-100)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        {[
          { label: "Members", sub: "4 active · 1 pending invite", icon: <IconShare/>, badge: "1" },
          { label: "Invites", sub: "Send and revoke invitations", icon: <IconShare/> },
          { label: "Permissions", sub: "Per-feature overrides", icon: <IconCheck/> },
          { label: "Crew preferences", sub: "Currency, units, expiry tiers", icon: <IconInfo/> },
        ].map((row, i, arr) => (
          <button key={row.label} style={{
            width: "100%", textAlign: "left", border: "none", background: "transparent",
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: i < arr.length - 1 ? "1px solid var(--paper-300)" : "none", cursor: "pointer",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(74,130,101,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sage-700)" }}>
              {row.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)" }}>{row.label}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>{row.sub}</div>
            </div>
            {row.badge && <span style={{ background: "var(--error)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 9999, padding: "2px 7px" }}>{row.badge}</span>}
            <IconChevronRight size={18} color="var(--ink-400)"/>
          </button>
        ))}
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", margin: "8px 4px" }}>Owner zone</div>
      <div style={{ background: "var(--paper-100)", borderRadius: 14 }}>
        <button style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", padding: "14px 16px", borderBottom: "1px solid var(--paper-300)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Transfer ownership <IconChevronRight size={18} color="var(--ink-400)"/>
        </button>
        <button style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", padding: "14px 16px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--error)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Delete crew <IconChevronRight size={18} color="var(--ink-400)"/>
        </button>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── CM_Members ── List of crew members + pending invites. ────── */
const CM_Members = () => {
  const data = [
    { name: "Jamal Walker", role: "Owner", you: true, color: "var(--sage-700)", sub: "joined Mar 14" },
    { name: "Naomi Walker", role: "Admin", color: "#B65D2C", sub: "joined Mar 16" },
    { name: "Mia Walker",   role: "Member", color: "#7C5BB1", sub: "joined Mar 22 · last seen 2h ago" },
    { name: "Ben Walker",   role: "Viewer", color: "#3F6F8A", sub: "joined Apr 02 · child mode" },
  ];
  return (
    <PhoneFrame>
      <AppBar title="Members" onBack={() => {}} right={<button aria-label="Invite" style={{ width: 36, height: 36, borderRadius: 9999, background: "var(--sage-700)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><IconPlus size={18}/></button>}/>
      <ScreenBody>
        <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 4 }}>
          {data.map((m, i) => (
            <div key={m.name} style={{
              padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: i < data.length - 1 ? "1px solid var(--paper-300)" : "none",
            }}>
              <Avatar name={m.name} color={m.color}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)" }}>{m.name}</span>
                  {m.you && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--sage-700)", fontWeight: 700, letterSpacing: 0.4 }}>· You</span>}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", marginTop: 1 }}>{m.sub}</div>
              </div>
              <RolePill role={m.role}/>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", margin: "20px 4px 8px" }}>Pending invites · 1</div>
        <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9999, background: "rgba(217,119,6,0.14)", color: "#A05A05", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconClock size={18}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)" }}>aunt.dee@email.com</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>Member · sent 3 days ago · expires in 4 days</div>
          </div>
          <button style={{ background: "transparent", border: "none", color: "var(--ink-600)", padding: 6, cursor: "pointer" }}><IconMore size={18}/></button>
        </div>
      </ScreenBody>
    </PhoneFrame>
  );
};

/* ── CM_Invite ── Send an invite — sheet. ──────────────────────── */
const CM_Invite = () => (
  <PhoneFrame>
    <div style={{ position: "absolute", inset: 0, background: "rgba(28,28,24,0.55)", backdropFilter: "blur(4px)" }}/>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--surface)", borderRadius: "24px 24px 0 0", padding: "12px 20px 24px", boxShadow: "0 -8px 32px rgba(0,0,0,0.18)" }}>
      <div style={{ width: 36, height: 4, borderRadius: 9999, background: "var(--paper-300)", margin: "0 auto 12px" }}/>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-900)", letterSpacing: "-0.01em" }}>Invite to Walker Family</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 4, marginBottom: 18 }}>They'll be able to view and edit inventory based on the role you give them.</div>

      <Field label="Email or phone" placeholder="aunt.dee@email.com" value="aunt.dee@email.com"/>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "var(--ink-700)", marginBottom: 8 }}>Role</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { id: "admin", label: "Admin", sub: "Can manage members + spaces" },
            { id: "member", label: "Member", sub: "Can edit inventory", on: true },
            { id: "viewer", label: "Viewer", sub: "Can browse only" },
            { id: "child", label: "Child", sub: "Limited + kiosk PIN" },
          ].map((r) => (
            <div key={r.id} style={{
              padding: 12, borderRadius: 12,
              border: r.on ? "1.5px solid var(--sage-700)" : "1.5px solid var(--paper-300)",
              background: r.on ? "rgba(74,130,101,0.06)" : "var(--surface)",
              cursor: "pointer",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: r.on ? "var(--sage-700)" : "var(--ink-900)" }}>{r.label}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)", marginTop: 2 }}>{r.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 12, background: "rgba(74,130,101,0.06)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>Expires in 7 days</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)" }}>You can change this in advanced options</div>
        </div>
        <Toggle on={true}/>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <SecondaryButton style={{ flex: 1 }}>Cancel</SecondaryButton>
        <PrimaryButton style={{ flex: 1.4 }}>Send invite</PrimaryButton>
      </div>
    </div>
  </PhoneFrame>
);

/* ── CM_Permissions ── Per-feature override matrix for one member. */
const CM_Permissions = () => {
  const features = [
    { id: "inventory", label: "Edit inventory", role: "Allowed", state: "default" },
    { id: "spaces", label: "Manage spaces", role: "Allowed", state: "default" },
    { id: "waste", label: "Log waste", role: "Allowed", state: "default" },
    { id: "delete_inv", label: "Delete inventory items", role: "Denied", state: "override-deny" },
    { id: "shopping", label: "Edit shopping lists", role: "Allowed", state: "default" },
    { id: "recipes", label: "Edit recipes", role: "Denied", state: "default" },
    { id: "exports", label: "Export data", role: "Allowed", state: "override-allow" },
    { id: "kiosk", label: "Use kiosk", role: "Allowed", state: "default" },
  ];
  return (
    <PhoneFrame>
      <AppBar title="Permissions" onBack={() => {}}/>
      <ScreenBody>
        <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Avatar name="Mia Walker" color="#7C5BB1"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>Mia Walker</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>Member · joined Mar 22</div>
          </div>
          <RolePill role="Member"/>
        </div>

        <div style={{ background: "rgba(74,130,101,0.08)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <IconInfo size={16} color="var(--sage-700)"/>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-700)", lineHeight: 1.5 }}>Permissions start from the role's defaults. Toggle a row to override for this member only.</div>
        </div>

        <div style={{ background: "var(--paper-100)", borderRadius: 14, overflow: "hidden" }}>
          {features.map((f, i) => {
            const allow = f.state !== "override-deny" && (f.state === "override-allow" || f.role === "Allowed");
            const overridden = f.state.startsWith("override");
            return (
              <div key={f.id} style={{
                padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                borderBottom: i < features.length - 1 ? "1px solid var(--paper-300)" : "none",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)" }}>{f.label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: overridden ? "var(--sage-700)" : "var(--ink-500)", marginTop: 1, fontWeight: overridden ? 600 : 400 }}>
                    {overridden ? `Overridden — was ${f.role === "Allowed" ? "Allowed" : "Denied"}` : `Default · ${f.role}`}
                  </div>
                </div>
                <Toggle on={allow}/>
              </div>
            );
          })}
        </div>
      </ScreenBody>
    </PhoneFrame>
  );
};

/* ── CM_Transfer ── Transfer ownership confirmation. ─────────── */
const CM_Transfer = () => (
  <PhoneFrame>
    <AppBar title="Transfer ownership" onBack={() => {}}/>
    <ScreenBody>
      <div style={{ background: "rgba(217,119,6,0.10)", borderRadius: 14, padding: 16, marginBottom: 16, display: "flex", gap: 12 }}>
        <IconAlert size={22} color="#A05A05"/>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#7A4504" }}>This is irreversible</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#7A4504", marginTop: 4, lineHeight: 1.5 }}>Once you transfer ownership, you'll keep your Admin role but can no longer delete the crew or remove other Admins.</div>
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", margin: "8px 4px" }}>Choose new owner · Admins only</div>
      <div style={{ background: "var(--paper-100)", borderRadius: 14 }}>
        {[
          { name: "Naomi Walker", color: "#B65D2C", sub: "Admin · joined Mar 16", on: true },
          { name: "Marcus Walker", color: "#3F6F8A", sub: "Admin · joined Apr 12", on: false },
        ].map((p, i, arr) => (
          <div key={p.name} style={{
            padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: i < arr.length - 1 ? "1px solid var(--paper-300)" : "none",
          }}>
            <Avatar name={p.name} color={p.color}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)" }}>{p.sub}</div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 9999, border: p.on ? "6px solid var(--sage-700)" : "1.5px solid var(--paper-300)", background: p.on ? "var(--sage-700)" : "transparent",
            }}/>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Field label='Type "TRANSFER" to confirm' placeholder="TRANSFER" value=""/>
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton style={{ background: "var(--paper-300)", color: "var(--ink-500)" }} disabled>Confirm transfer</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── CM_DeleteBanner ── 48-hour countdown after delete request. */
const CM_DeleteBanner = () => (
  <PhoneFrame>
    <AppBar title="Walker Family" onBack={() => {}}/>
    <ScreenBody>
      <div style={{
        background: "linear-gradient(180deg, rgba(186,26,26,0.08) 0%, rgba(186,26,26,0.02) 100%)",
        border: "1.5px solid rgba(186,26,26,0.30)",
        borderRadius: 16, padding: 18, marginBottom: 16,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <IconAlert size={22} color="var(--error)"/>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--error)" }}>Crew deletion in progress</span>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-700)", lineHeight: 1.55 }}>
          You requested to delete this crew on <strong>Apr 25 at 2:14 PM</strong>. All members have been notified. The crew will be permanently deleted in:
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[
            { v: "32", l: "hours" },
            { v: "47", l: "minutes" },
            { v: "06", l: "seconds" },
          ].map((t) => (
            <div key={t.l} style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--paper-300)", borderRadius: 12, padding: "10px 4px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-900)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{t.v}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)" }}>{t.l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "var(--surface)", color: "var(--error)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "inset 0 0 0 1.5px var(--error)" }}>Cancel deletion</button>
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)", margin: "8px 4px" }}>What will be deleted</div>
      <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-700)", lineHeight: 1.7 }}>
        <div>· 247 inventory items across 53 spaces</div>
        <div>· 12 recipes and all batch history</div>
        <div>· 4 member accounts will be removed from this crew</div>
        <div>· Flow ledger will be archived but inaccessible</div>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

Object.assign(window, { CM_Switcher, CM_Settings, CM_Members, CM_Invite, CM_Permissions, CM_Transfer, CM_DeleteBanner });
