// Full screens — Landing, SignUp, CrewDecision, CrewName, SpacesIntro, Dashboard.

const Screen = ({ children, scroll = false }) => (
  <div style={{
    position: "relative", width: 390, height: 844,
    background: "var(--surface)",
    overflow: scroll ? "auto" : "hidden",
    fontFamily: "var(--font-body)",
  }}>
    {children}
  </div>
);

// Landing — hero image, hook, CTA.
const LandingScreen = ({ go }) => (
  <Screen scroll>
    <NavHeader variant="signup" onAction={() => go("signup")}/>
    <div style={{ padding: "32px 24px 48px", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{
        position: "relative", height: 360, borderRadius: 12, overflow: "hidden",
        boxShadow: "var(--shadow-ambient-md)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "url('../../assets/hero-larder.png') center/cover" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%)" }}/>
      </div>
      <div>
        <div className="display-lg" style={{ marginBottom: 16 }}>{"Know what you\nhave.\nUse what you buy."}</div>
        <div style={{
          fontFamily: "var(--font-accent)", fontSize: 18, lineHeight: "29px",
          color: "var(--ink-700)",
        }}>{"Track your pantry, bar, and every shelf between. Share with the people who share your kitchen."}</div>
      </div>
      <PrimaryButton onClick={() => go("signup")}>Get started — it's free</PrimaryButton>
    </div>
  </Screen>
);

// Sign Up — borrows the InMan SignUp component.
const SignUpScreen = ({ go }) => {
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  return (
    <Screen scroll>
      <NavHeader variant="close" onAction={() => go("landing")}/>
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ textAlign: "center", padding: "0 16px 8px" }}>
          <div className="display-lg" style={{ fontSize: 32, lineHeight: "40px", marginBottom: 12 }}>Join InMan</div>
          <div className="body-lg" style={{ color: "var(--ink-500)" }}>Professional inventory management for any environment.</div>
        </div>
        <button style={{
          height: 58, borderRadius: 8, background: "#fff", cursor: "pointer",
          border: "1px solid var(--paper-300)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)",
        }}>Continue with Google</button>
        <button style={{
          height: 58, borderRadius: 8, background: "#fff", cursor: "pointer",
          border: "1px solid var(--paper-300)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)",
        }}>Continue with Facebook</button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--paper-300)" }}/>
          <span className="label-eyebrow" style={{ fontSize: 10, letterSpacing: 1 }}>OR USE YOUR EMAIL/PHONE</span>
          <div style={{ flex: 1, height: 1, background: "var(--paper-300)" }}/>
        </div>
        <Field label="EMAIL OR PHONE" value={email} onChange={setEmail} placeholder="name@company.com"/>
        <Field label="PASSWORD" value={pw} onChange={setPw} placeholder="••••••••" type="password" hint="Must be at least 8 characters with a symbol."/>
        <PrimaryButton onClick={() => go("crew-decision")}>Create Account</PrimaryButton>
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <button onClick={() => go("landing")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-900)",
          }}>Already have an account? <span style={{ color: "var(--sage-700)" }}>Sign in</span></button>
        </div>
      </div>
    </Screen>
  );
};

// Crew Decision — the two-card pick.
const CrewDecisionScreen = ({ go }) => (
  <Screen scroll>
    <NavHeader variant="close" onAction={() => go("signup")}/>
    <div style={{ padding: "16px 24px 48px", display: "flex", flexDirection: "column", gap: 24 }}>
      <ProgressBar step={2} of={5}/>
      <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="display-md" style={{ fontSize: 30, lineHeight: "37px", letterSpacing: "-0.4px" }}>{"Welcome.\nLet's get you set up."}</div>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 18, lineHeight: "29px",
          color: "var(--ink-700)",
        }}>{"A Crew is a shared workspace for your inventory. Pick one."}</div>
      </div>
      <DecisionCard
        icon={<HomeGlyph/>}
        iconTint="stone"
        title="Start a new Crew"
        body="Create a fresh workspace for your home, bar, or kitchen. You'll be the Crew Admin."
        recommended
        onClick={() => go("crew-name")}
      />
      <DecisionCard
        icon={<InviteGlyph/>}
        iconTint="stone"
        title="I have an invite"
        body="Joining a family member's pantry or a workplace? Paste your invite code."
        onClick={() => alert("Invite code sheet (not in scope)")}
      />
      <TextButton onClick={() => go("dashboard")}>I'm just exploring — skip for now</TextButton>
    </div>
  </Screen>
);

// Crew Name — labeled input + sticky CTA tray.
const CrewNameScreen = ({ go, setCrewName, crewName }) => {
  return (
    <Screen>
      <NavHeader variant="close" onAction={() => go("crew-decision")}/>
      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
        <ProgressBar step={2} of={5}/>
        <div style={{ padding: "0 8px" }}>
          <div className="display-md" style={{ marginBottom: 16 }}>Name your Crew</div>
          <div className="body-md">A Crew is a shared workspace. You'll be the Admin.</div>
        </div>
        <Field label="CREW NAME" value={crewName} onChange={setCrewName} placeholder="e.g. Walker Home, Haywire Bar" hint="You can rename this later."/>
      </div>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "24px",
        background: "rgba(253,249,242,0.9)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      }}>
        <PrimaryButton onClick={() => go("spaces-intro")}>Create Crew</PrimaryButton>
      </div>
    </Screen>
  );
};

// Spaces Intro — hierarchy explainer + tip card.
const SpacesIntroScreen = ({ go, crewName }) => (
  <Screen scroll>
    <div style={{ padding: "24px 24px 16px" }}>
      <ProgressBar step={3} of={5} label="SETUP PROGRESS"/>
    </div>
    <div style={{ padding: "16px 24px 32px", display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <div className="display-lg" style={{ fontSize: 36, lineHeight: "40px", marginBottom: 12 }}>{"Let's map\nyour spaces"}</div>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 18, lineHeight: "29px", color: "var(--ink-700)",
        }}>{`Your pantry, bar, and every shelf between — organized so InMan knows where everything lives.`}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <HierarchyNode level={1} eyebrow="PREMISES" name={crewName || "My Home"} icon={<HomeGlyph/>}/>
        <HierarchyNode level={2} eyebrow="AREA" name="Pantry Wall" icon={<HomeGlyph/>} indent={16}/>
        <HierarchyNode level={2} eyebrow="AREA" name="Upper Cabinet" icon={<HomeGlyph/>} indent={16}/>
        <HierarchyNode level={5} eyebrow="SUB-SECTION" name="Top Shelf" icon={<HomeGlyph/>} indent={64} faint/>
        <HierarchyNode level={5} eyebrow="CONTAINER" name="Glass Jar Set" icon={<HomeGlyph/>} indent={96}/>
      </div>
      <TipCard><b>Pro Tip:</b> You only need to add the levels that make sense for your space. Skip anything too granular.</TipCard>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <PrimaryButton arrow onClick={() => go("dashboard")}>Start building</PrimaryButton>
        <TextButton onClick={() => go("dashboard")}>I'll explore later</TextButton>
      </div>
    </div>
  </Screen>
);

// Dashboard — signed-in nav, welcome, onboarding section, bottom nav.
const DashboardScreen = ({ go, crewName }) => {
  const [tab, setTab] = React.useState("home");
  return (
    <Screen>
      <div style={{ height: 72, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)" }}>
        <button aria-label="Menu" style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}><HamburgerGlyph/></button>
        <BrandIdentity/>
        <button onClick={() => go("landing")} style={{ width: 40, height: 40, borderRadius: 9999, background: "var(--sage-600)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Account"><UserGlyph/></button>
      </div>
      <div style={{ padding: "0 16px 96px", height: "calc(100% - 72px - 65px)", overflow: "auto" }}>
        <div style={{ padding: "23px 0 16px" }}>
          <div className="display-md">Welcome, Davontae</div>
        </div>
        <OnboardingSection name={crewName || "Walker Home"} completedSteps={1}/>
      </div>
      <BottomNav active={tab} onChange={setTab}/>
    </Screen>
  );
};

Object.assign(window, { LandingScreen, SignUpScreen, CrewDecisionScreen, CrewNameScreen, SpacesIntroScreen, DashboardScreen });
