import React, { useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function TasksView({ tasks, loading, error, onAdd, onEdit, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleSave = async (taskData, id) => {
    if (id) {
      await onEdit(id, taskData);
    } else {
      await onAdd(taskData);
    }
    setModalOpen(false);
  };

  const openNew = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (taskToUpdate) {
      onEdit(id, { ...taskToUpdate, status: newStatus });
    }
  };

  return (
    <div>
      <div style={styles.headerRow}>
        <h2>Your Tasks</h2>
        <button onClick={openNew} style={styles.addBtn}>+ New Task</button>
      </div>

      {loading && <p style={{ color: "var(--slate-400)" }}>Loading tasks...</p>}
      {error && <p style={{ color: "var(--rose)", padding: 12, background: "rgba(244,63,94,0.1)", borderRadius: 8 }}>Error: {error}</p>}

      <div style={styles.grid}>
        {tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={openEdit}
            onDelete={onDelete}
            onStatusChange={handleStatusChange}
            delay={idx * 50}
          />
        ))}
      </div>

      {!loading && tasks.length === 0 && (
        <div style={styles.emptyState}>
          <p>No tasks yet. Create one to get started!</p>
        </div>
      )}

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

const styles = {
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  addBtn: { background: "linear-gradient(135deg, var(--indigo), var(--indigo-lt))", color: "#fff", padding: "10px 18px", borderRadius: 10, fontWeight: 600, border: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 },
  emptyState: { padding: 40, textAlign: "center", color: "var(--slate-400)", border: "1px dashed var(--border-lt)", borderRadius: 12, marginTop: 24 }
};