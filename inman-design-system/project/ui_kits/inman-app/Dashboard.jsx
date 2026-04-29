// Dashboard bits — bottom nav, onboarding-checklist section, signed-in nav user button.

const NavGlyph = ({ name }) => {
  const paths = {
    home: <path d="M 0 18 L 0 6 L 8 0 L 16 6 L 16 18 L 10 18 L 10 11 L 6 11 L 6 18 L 0 18 L 0 18"/>,
    inventory: <path d="M2 4 H18 V18 H2 Z M2 10 H18 M10 4 V18" fill="none" stroke="currentColor" strokeWidth="2"/>,
    shopping: <path d="M3 6 H17 L15 16 H5 Z M7 6 V3 a3 3 0 0 1 6 0 V6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>,
    batches: <path d="M3 8 L10 4 L17 8 V14 L10 18 L3 14 Z M10 4 V18 M3 8 L10 12 L17 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>,
    more: <g><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></g>,
  };
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">{paths[name]}</svg>;
};

const BottomNav = ({ active = "home", onChange }) => {
  const items = [
    { id: "home", label: "Home" },
    { id: "inventory", label: "Inventory" },
    { id: "shopping", label: "Shopping" },
    { id: "batches", label: "Batches" },
    { id: "more", label: "More" },
  ];
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      height: 65, padding: 8,
      background: "rgba(253,249,242,0.85)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid var(--glass-border)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
    }}>
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <button key={it.id} onClick={() => onChange?.(it.id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: isActive ? "var(--sage-700)" : "var(--ink-600)",
            width: 64,
          }}>
            <div style={{
              width: 48, height: 26, borderRadius: 9999,
              background: isActive ? "rgba(230,226,218,0.7)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 180ms ease-out",
            }}>
              <NavGlyph name={it.id}/>
            </div>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
              color: isActive ? "var(--sage-700)" : "var(--ink-600)",
            }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// The big onboarding-checklist section block on the dashboard.
const OnboardingSection = ({ name, completedSteps = 1, totalSteps = 5, onStep }) => {
  const steps = [
    { id: 1, title: "Set up your Crew", subtitle: "Name your shared workspace" },
    { id: 2, title: "Map your spaces", subtitle: "Pantry, bar, every shelf between" },
    { id: 3, title: "Add your first items", subtitle: "Scan, snap, or type" },
    { id: 4, title: "Invite your people", subtitle: "Share access with your Crew" },
    { id: 5, title: "Set your first batch", subtitle: "Recipes & prep tracking" },
  ];
  return (
    <div style={{
      borderRadius: 8, background: "var(--paper-100)",
      padding: 20, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <HeroCard
        title={`${name}'s pantry is live 🎉`}
        body={"Complete the steps below\nto finish onboarding"}
        badge={<CheckGlyph/>}
      />
      <div style={{ paddingTop: 8, paddingBottom: 4 }}>
        <div className="title-md" style={{ marginBottom: 4 }}>Setup Progress</div>
        <ProgressBar step={completedSteps} of={totalSteps} label={`${completedSteps}/${totalSteps} Complete`}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {steps.map((s, i) => (
          <ChecklistStep
            key={s.id}
            index={s.id}
            title={s.title}
            subtitle={s.subtitle}
            complete={i < completedSteps}
            current={i === completedSteps}
            onClick={() => onStep?.(s.id)}
          />
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { BottomNav, OnboardingSection, NavGlyph });
