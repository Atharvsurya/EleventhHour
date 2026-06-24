import React from "react";

export default function DashboardView({ tasks }) {
  const pending = tasks.filter(t => t.status === "PENDING").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;

  return (
    <div>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Welcome back to EleventhHour</h2>
      <p style={{ color: "var(--slate-400)", maxWidth: 600, fontSize: 15 }}>
        You currently have <strong>{pending}</strong> pending tasks and <strong>{inProgress}</strong> in progress.
        Head over to the Tasks tab to update their status, or use the AI Planner to figure out what to tackle next.
      </p>
    </div>
  );
}