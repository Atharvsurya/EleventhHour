import React, { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [scheduledBlocks, setScheduledBlocks] = useState([]); // New state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const tasksRes = await getTasks();
    const blocksRes = await getActivePlans(); // Fetch the new AI data
    setTasks(tasksRes.data);
    setScheduledBlocks(blocksRes.data);
  };

  return (
    <div>
      {/* Existing "Your Tasks" list */}

      {/* NEW: AI Scheduled Tasks Section */}
      <h2 style={{ marginTop: 40 }}>AI Scheduled Blocks</h2>
      <div style={styles.grid}>
        {scheduledBlocks.map(block => (
          <div key={block.id} style={styles.card}>
            <div style={{ color: "var(--cyan)", fontSize: 12 }}>
              {new Date(block.startTime).toLocaleTimeString()} - {new Date(block.endTime).toLocaleTimeString()}
            </div>
            <h3>{block.task.title}</h3>
            <p>{block.actionPlan}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  addBtn: { background: "linear-gradient(135deg, var(--indigo), var(--indigo-lt))", color: "#fff", padding: "10px 18px", borderRadius: 10, fontWeight: 600, border: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 },
  emptyState: { padding: 40, textAlign: "center", color: "var(--slate-400)", border: "1px dashed var(--border-lt)", borderRadius: 12, marginTop: 24 }
};