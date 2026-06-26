import React, { useState, useEffect } from "react";
// Make sure these imports match your folder structure
import { getTasks, getActivePlans } from "../api/client";

export default function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [scheduledBlocks, setScheduledBlocks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasksRes = await getTasks();
      const blocksRes = await getActivePlans();
      // Ensure we only set data if the response structure contains it
      setTasks(tasksRes || []);
      setScheduledBlocks(blocksRes.data || []);
    } catch (e) {
      console.error("Failed to load tasks/plans:", e);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* 1. ORIGINAL SECTION */}
      <h2 style={{ marginBottom: 16 }}>Your Tasks</h2>
      <div style={styles.grid}>
        {tasks.map(task => (
          <div key={task.id} style={styles.card}>
            <div style={{ fontWeight: 600 }}>{task.title}</div>
            <div style={{ fontSize: 12, color: "var(--slate-400)" }}>{task.status}</div>
          </div>
        ))}
      </div>

      {/* 2. NEW AI SCHEDULED SECTION */}
      <h2 style={{ marginTop: 40, marginBottom: 16 }}>AI Scheduled Blocks</h2>
      <div style={styles.grid}>
        {scheduledBlocks.map(block => (
          <div key={block.id} style={{ ...styles.card, border: "1px solid var(--cyan)" }}>
            <div style={{ color: "var(--cyan)", fontSize: 12, fontWeight: 700 }}>
              {new Date(block.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {" - "}
              {new Date(block.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <h3 style={{ fontSize: 15, margin: "8px 0" }}>{block.task.title}</h3>
            <p style={{ fontSize: 13, color: "var(--slate-400)" }}>{block.actionPlan}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: { background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, border: "1px solid var(--border-lt)" }
};