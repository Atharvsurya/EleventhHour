import React, { useState } from "react";

const PRIORITY_MAP = {
  1: { label: "Critical", color: "#F43F5E", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.25)" },
  2: { label: "High",     color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  3: { label: "Medium",   color: "#06B6D4", bg: "rgba(6,182,212,0.1)",  border: "rgba(6,182,212,0.25)" },
  4: { label: "Low",      color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  5: { label: "Lowest",   color: "#94A3B8", bg: "rgba(148,163,184,0.1)",border: "rgba(148,163,184,0.25)" },
};

const STATUS_MAP = {
  PENDING:     { label: "Pending",     color: "#F59E0B", dot: "#F59E0B" },
  IN_PROGRESS: { label: "In Progress", color: "#06B6D4", dot: "#06B6D4" },
  COMPLETED:   { label: "Done",        color: "#10B981", dot: "#10B981" },
};

function formatDeadline(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  const now = new Date();
  const diff = d - now;
  const hours = Math.floor(diff / 3600000);
  if (diff < 0) return { label: "Overdue", urgent: true };
  if (hours < 24) return { label: `${hours}h left`, urgent: hours < 3 };
  const days = Math.floor(diff / 86400000);
  return { label: `${days}d left`, urgent: false };
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const p = PRIORITY_MAP[task.priority] || PRIORITY_MAP[3];
  const s = STATUS_MAP[task.status] || STATUS_MAP.PENDING;
  const deadline = formatDeadline(task.deadline);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task.id);
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
        ...(deleting ? styles.cardDeleting : {}),
        animationDelay: `${delay}ms`,
        borderColor: hovered ? p.color + "50" : "var(--border-lt)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fade-in"
    >
      {/* Priority accent bar */}
      <div style={{ ...styles.accentBar, background: p.color }} />

      <div style={styles.body}>
        <div style={styles.topRow}>
          {/* Priority badge */}
          <span style={{ ...styles.badge, color: p.color, background: p.bg, borderColor: p.border }}>
            <span style={{ ...styles.badgeDot, background: p.color }} />
            {p.label}
          </span>

          {/* Status selector */}
          <select
            value={task.status}
            onChange={e => onStatusChange(task.id, e.target.value)}
            style={{ ...styles.statusSelect, color: s.color }}
            onClick={e => e.stopPropagation()}
          >
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <h3 style={styles.title}>{task.title}</h3>

        {task.description && (
          <p style={styles.desc}>{task.description}</p>
        )}

        <div style={styles.footer}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={deadline.urgent ? "#F43F5E" : "var(--slate-400)"} strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: deadline.urgent ? "#F43F5E" : "var(--slate-400)",
            }}>
              {deadline.label}
            </span>
          </div>

          <div style={styles.actions}>
            <button onClick={() => onEdit(task)} style={styles.iconBtn} title="Edit">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button onClick={handleDelete} style={{ ...styles.iconBtn, color: "#F43F5E" }} title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-lt)",
    borderRadius: 14,
    overflow: "hidden",
    display: "flex",
    transition: "all 0.25s var(--ease)",
    backdropFilter: "blur(8px)",
    position: "relative",
  },
  cardHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  cardDeleting: {
    opacity: 0.4,
    transform: "scale(0.97)",
    pointerEvents: "none",
  },
  accentBar: {
    width: 3,
    flexShrink: 0,
  },
  body: { padding: "14px 16px", flex: 1, minWidth: 0 },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 6,
    border: "1px solid",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  badgeDot: {
    width: 5, height: 5,
    borderRadius: "50%",
  },
  statusSelect: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-lt)",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 6px",
    cursor: "pointer",
    outline: "none",
    fontFamily: "var(--font-body)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--white)",
    marginBottom: 4,
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  desc: {
    fontSize: 12,
    color: "var(--slate-400)",
    marginBottom: 12,
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actions: { display: "flex", gap: 4 },
  iconBtn: {
    width: 28, height: 28,
    borderRadius: 7,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    color: "var(--slate-400)",
    transition: "all 0.15s",
    border: "1px solid var(--border-lt)",
  },
};