export default function Header({ title, subtitle, actions }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      <div style={styles.right}>
        {actions}
        <div style={styles.clock}>
          <div style={styles.time}>{timeStr}</div>
          <div style={styles.date}>{dateStr}</div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: "var(--header-h)",
    background: "rgba(10,15,30,0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border-lt)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  left: {},
  title: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 18,
    color: "var(--white)",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 12,
    color: "var(--slate-400)",
    marginTop: 1,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  clock: { textAlign: "right" },
  time: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 15,
    color: "var(--white)",
    letterSpacing: "0.02em",
  },
  date: {
    fontSize: 10,
    color: "var(--slate-400)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
};