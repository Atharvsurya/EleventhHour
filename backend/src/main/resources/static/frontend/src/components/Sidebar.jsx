import React from "react";

const NAV = [
  { id: "dashboard", label: "Dashboard",   icon: "⬡" },
  { id: "tasks",     label: "My Tasks",    icon: "◈" },
  { id: "schedule",  label: "AI Planner",  icon: "◎" },
];

const STATUS_COLORS = { PENDING: "#F59E0B", IN_PROGRESS: "#06B6D4", COMPLETED: "#10B981" };

export default function Sidebar({ active, onNav, userId, tasks }) {

  const safeTasks = tasks || [];
  const pending    = tasks.filter(t => t && t.status === "PENDING").length;
  const inProgress = tasks.filter(t => t && t.status === "IN_PROGRESS").length;
  const done       = tasks.filter(t => t && t.status === "COMPLETED").length;

  const total = safeTasks.length || 1;
  const pct        = Math.round((done / total) * 100);

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke="#06B6D4" strokeWidth="1.5" fill="none"/>
            <polygon points="12,6 18,9.5 18,16.5 12,20 6,16.5 6,9.5" fill="rgba(79,70,229,0.3)" stroke="#4F46E5" strokeWidth="1"/>
            <circle cx="12" cy="12" r="2" fill="#06B6D4"/>
          </svg>
        </div>
        <div>
          <div style={styles.logoTitle}>EleventhHour</div>
          <div style={styles.logoSub}>Last-Minute Life Saver</div>
        </div>
      </div>

      {/* User badge */}
      <div style={styles.userBadge}>
        <div style={styles.avatar}>{userId}</div>
        <div>
          <div style={styles.userName}>User #{userId}</div>
          <div style={styles.userRole}>Active session</div>
        </div>
        <div style={styles.onlineDot} />
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>Navigation</div>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              ...styles.navItem,
              ...(active === item.id ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {active === item.id && <div style={styles.navIndicator} />}
          </button>
        ))}
      </nav>

      {/* Progress card */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <span style={styles.progressTitle}>Today's Progress</span>
          <span style={styles.progressPct}>{pct}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${pct}%` }} />
        </div>
        <div style={styles.progressStats}>
          <Stat label="Pending"     value={pending}    color="#F59E0B" />
          <Stat label="In Progress" value={inProgress} color="#06B6D4" />
          <Stat label="Done"        value={done}        color="#10B981" />
        </div>
      </div>

      <div style={styles.sidebarFooter}>
        <span style={styles.footerText}>Powered by Gemini 1.5 Pro</span>
        <div style={styles.geminiDot} />
      </div>
    </aside>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color, fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)" }}>{value}</div>
      <div style={{ color: "var(--slate-400)", fontSize: 10, marginTop: 2 }}>{label}</div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "var(--sidebar-w)",
    minHeight: "100vh",
    background: "var(--navy-2)",
    borderRight: "1px solid var(--border-lt)",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 24px 0",
    position: "fixed",
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
    overflowY: "auto",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 20px 16px",
    borderBottom: "1px solid var(--border-lt)",
  },
  logoIcon: {
    width: 38, height: 38,
    background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid var(--border)",
  },
  logoTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--white)",
    letterSpacing: "-0.01em",
  },
  logoSub: {
    fontSize: 9,
    color: "var(--cyan)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "16px 16px 8px",
    padding: "10px 12px",
    background: "rgba(79,70,229,0.08)",
    borderRadius: 10,
    border: "1px solid var(--border)",
    position: "relative",
  },
  avatar: {
    width: 32, height: 32,
    background: "linear-gradient(135deg, var(--indigo), var(--cyan))",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },
  userName: { fontWeight: 600, fontSize: 13, color: "var(--white)" },
  userRole: { fontSize: 10, color: "var(--slate-400)" },
  onlineDot: {
    width: 7, height: 7,
    borderRadius: "50%",
    background: "var(--emerald)",
    position: "absolute",
    top: 10, right: 10,
    boxShadow: "0 0 6px var(--emerald)",
  },
  nav: { padding: "8px 12px", flex: 1 },
  navLabel: {
    fontSize: 10,
    color: "var(--slate-500)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 600,
    padding: "8px 8px 4px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    color: "var(--slate-400)",
    cursor: "pointer",
    transition: "all 0.2s var(--ease)",
    textAlign: "left",
    position: "relative",
    marginBottom: 2,
  },
  navItemActive: {
    background: "rgba(79,70,229,0.15)",
    color: "var(--white)",
    fontWeight: 600,
  },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  navIndicator: {
    position: "absolute",
    right: 0, top: "50%",
    transform: "translateY(-50%)",
    width: 3, height: 18,
    background: "var(--indigo)",
    borderRadius: "3px 0 0 3px",
  },
  progressCard: {
    margin: "8px 16px",
    padding: "14px",
    background: "rgba(6,182,212,0.05)",
    borderRadius: 12,
    border: "1px solid rgba(6,182,212,0.15)",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: { fontSize: 12, fontWeight: 600, color: "var(--slate-200)" },
  progressPct: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--cyan)",
    fontFamily: "var(--font-display)",
  },
  progressBar: {
    height: 4,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, var(--indigo), var(--cyan))",
    borderRadius: 999,
    transition: "width 0.6s var(--ease)",
  },
  progressStats: {
    display: "flex",
    justifyContent: "space-between",
  },
  sidebarFooter: {
    margin: "auto 16px 0",
    paddingTop: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  footerText: { fontSize: 10, color: "var(--slate-500)" },
  geminiDot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "var(--indigo)",
    animation: "pulse 2s infinite",
  },
};