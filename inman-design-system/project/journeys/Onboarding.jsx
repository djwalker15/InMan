// Onboarding journey screens.

/* ── 01 Landing page (mobile) ─────────────────────────────────── */
const OB_Landing = () => (
  <div style={{ width: 390, height: 844, position: "relative", overflow: "hidden", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
    <StatusBar/>
    <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <BrandIdentity/>
      <button style={{ background: "transparent", border: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-700)", cursor: "pointer" }}>Sign in</button>
    </div>
    <div style={{ flex: 1, padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="label-eyebrow" style={{ color: "var(--sage-700)" }}>INVENTORY MANAGEMENT</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, lineHeight: "48px", color: "var(--ink-900)", letterSpacing: "-0.02em" }}>
        Know what's there.<br/>Find it fast.
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "24px", color: "var(--ink-700)" }}>
        InMan is shared inventory for kitchens, bars, garages, and any home that runs like a small operation. Built for crews of any size.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        <PrimaryButton arrow>Get started — free</PrimaryButton>
        <SecondaryButton>I have an invite link</SecondaryButton>
      </div>
      <div style={{ marginTop: 24, padding: 20, background: "var(--paper-100)", borderRadius: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { glyph: "🏠", title: "Hierarchical spaces", body: "From House to Shelf — exactly as detailed as you need." },
          { glyph: "📋", title: "Real-time across the crew", body: "Everyone on the same page, in seconds." },
          { glyph: "📷", title: "Quick add by scan or search", body: "Add an item in 4 seconds flat." },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--paper-50)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.glyph}</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-900)" }}>{f.title}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 2 }}>{f.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── 02 Sign up (Clerk-powered) ─────────────────────────────── */
const OB_SignUp = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title=""/>
    <ScreenBody>
      <BrandIdentity/>
      <SectionTitle title="Create your account" body="One account works across all your crews."/>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <SecondaryButton><span style={{ fontSize: 16, marginRight: 6 }}>G</span> Continue with Google</SecondaryButton>
        <SecondaryButton><span style={{ fontSize: 16, marginRight: 6 }}>🍎</span> Continue with Apple</SecondaryButton>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ink-500)" }}>
        <div style={{ flex: 1, height: 1, background: "var(--paper-300)" }}/>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12 }}>or use email</span>
        <div style={{ flex: 1, height: 1, background: "var(--paper-300)" }}/>
      </div>
      <Field label="EMAIL" value="" onChange={() => {}} placeholder="you@example.com"/>
      <Field label="PASSWORD" value="" onChange={() => {}} placeholder="At least 8 characters"/>
      <PrimaryButton arrow>Create account</PrimaryButton>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-500)", textAlign: "center", lineHeight: "18px" }}>
        By signing up you agree to InMan's Terms and Privacy Policy.
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── 03 Crew decision ────────────────────────────────────────── */
const OB_CrewDecision = () => (
  <PhoneFrame>
    <AppBar title="Welcome"/>
    <ScreenBody>
      <ProgressBar step={1} of={5} label="STEP 1 OF 5"/>
      <SectionTitle title="What brings you to InMan?" body="A crew is a shared workspace. You can be in many crews at once."/>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <DecisionCard glyph="🏗" title="Start a new crew" body="You're setting up inventory for a new place." selected/>
        <DecisionCard glyph="🤝" title="Join with an invite" body="Someone shared an invite code or link with you." />
        <DecisionCard glyph="📍" title="Just exploring" body="Browse a sample crew. You can start your own anytime." />
      </div>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton arrow>Continue</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

const DecisionCard = ({ glyph, title, body, selected }) => (
  <div style={{
    padding: 16, borderRadius: 14,
    background: selected ? "rgba(74,130,101,0.08)" : "var(--paper-50)",
    border: selected ? "2px solid var(--sage-700)" : "2px solid var(--paper-300)",
    display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer",
  }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--paper-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{glyph}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-900)" }}>{title}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 4, lineHeight: "18px" }}>{body}</div>
    </div>
    <div style={{
      width: 22, height: 22, borderRadius: 9999, marginTop: 4,
      border: selected ? "none" : "2px solid var(--paper-300)",
      background: selected ? "var(--sage-700)" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{selected && <IconCheck size={14} color="#fff"/>}</div>
  </div>
);

/* ── 04 Name your crew + PIN ────────────────────────────────── */
const OB_CrewName = () => {
  const [name] = React.useState("Walker Home");
  return (
    <PhoneFrame>
      <AppBar onBack={() => {}} title="New crew"/>
      <ScreenBody>
        <ProgressBar step={2} of={5} label="STEP 2 OF 5"/>
        <SectionTitle title="Name your crew" body="A crew is the team that shares an inventory. Use the place's name."/>
        <Field label="CREW NAME" value={name} onChange={() => {}} placeholder="My House" hint="You can rename or have multiple crews later."/>
        <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 16 }}>
          <div className="label-eyebrow" style={{ marginBottom: 8 }}>OPTIONAL · QUICK-ADD PIN</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-700)", marginBottom: 12, lineHeight: "18px" }}>
            Set a 4-digit PIN to enable kiosk mode for guests and unauthenticated quick-add. You can do this later in Settings.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["•", "•", "•", "•"].map((d, i) => (
              <div key={i} style={{ flex: 1, height: 52, borderRadius: 10, border: "2px solid var(--paper-300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "var(--ink-500)" }}>{d}</div>
            ))}
          </div>
        </div>
      </ScreenBody>
      <CtaTray>
        <PrimaryButton arrow>Create crew</PrimaryButton>
        <TextButton>Skip PIN for now</TextButton>
      </CtaTray>
    </PhoneFrame>
  );
};

/* ── 04b Accept invite (Path B) ─────────────────────────────── */
const OB_AcceptInvite = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Join a crew"/>
    <ScreenBody>
      <div style={{ background: "var(--paper-100)", borderRadius: 16, padding: 20, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--sage-700)", color: "#fff", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24 }}>WH</div>
        <div className="label-eyebrow" style={{ color: "var(--sage-700)", marginBottom: 4 }}>YOU'VE BEEN INVITED</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-900)" }}>Walker Home</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 6 }}>Invited by Jamal Walker</div>
      </div>
      <div style={{ background: "var(--paper-50)", borderRadius: 14, padding: 16, boxShadow: "var(--shadow-ambient-sm)" }}>
        <div className="label-eyebrow" style={{ marginBottom: 12 }}>YOU'LL JOIN AS</div>
        <KV label="Role" value="Member"/>
        <KV label="Permissions" value="Read · Add · Edit"/>
        <KV label="Crew size" value="3 members + 2 kiosks"/>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <SecondaryButton>Decline</SecondaryButton>
        <PrimaryButton arrow>Accept &amp; join</PrimaryButton>
      </div>
    </ScreenBody>
  </PhoneFrame>
);

/* ── 08 Dashboard checklist ─────────────────────────────────── */
const OB_Dashboard = () => (
  <PhoneFrame>
    <div style={{ padding: "16px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div className="label-eyebrow" style={{ color: "var(--sage-700)" }}>WALKER HOME</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-900)", marginTop: 2 }}>Hi, Jamal</div>
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 9999, background: "var(--sage-700)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700 }}>JW</div>
    </div>
    <ScreenBody style={{ paddingTop: 0 }}>
      <OnboardingSection name="Walker Home" completedSteps={2} totalSteps={5}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="label-eyebrow">YOUR INVENTORY</div>
        <div style={{ background: "var(--paper-50)", borderRadius: 14, padding: 16, boxShadow: "var(--shadow-ambient-sm)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-900)" }}>0</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-600)", marginTop: 2 }}>items so far</div>
          <div style={{ marginTop: 14 }}>
            <PrimaryButton>+ Add your first item</PrimaryButton>
          </div>
        </div>
      </div>
    </ScreenBody>
    <BottomNav active="home"/>
  </PhoneFrame>
);

/* ── Kiosk enroll (Path C) ──────────────────────────────────── */
const OB_KioskEnroll = () => (
  <PhoneFrame>
    <AppBar onBack={() => {}} title="Set up kiosk"/>
    <ScreenBody>
      <SectionTitle eyebrow="KIOSK MODE" title="Use a tablet as a quick-add station" body="Anyone in the household can add items without an account. Actions are tagged 'kiosk' for the audit log."/>
      <div style={{ background: "var(--paper-100)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="label-eyebrow" style={{ marginBottom: 4 }}>ENROLLMENT CODE</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-900)", letterSpacing: "0.4em", textAlign: "center", padding: "12px 0" }}>4 7 2 9</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-600)", textAlign: "center" }}>Enter this on the tablet within 10 minutes</div>
      </div>
      <Alert kind="info" title="Heads up — kiosk privileges are limited">
        Kiosks can add items, restock, and consume — but cannot edit spaces, manage members, or see the audit log.
      </Alert>
    </ScreenBody>
    <CtaTray>
      <PrimaryButton arrow>Show me the tablet</PrimaryButton>
    </CtaTray>
  </PhoneFrame>
);

/* ── Tiny status-bar fragment ──────────────────────────────── */
const StatusBar = () => (
  <div style={{ height: 44, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink-900)" }}>
    <span>9:41</span>
    <span>● ● ●</span>
  </div>
);

Object.assign(window, { OB_Landing, OB_SignUp, OB_CrewDecision, OB_CrewName, OB_AcceptInvite, OB_Dashboard, OB_KioskEnroll });
