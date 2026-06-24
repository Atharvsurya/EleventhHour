import React, { useState, useEffect } from "react";

const PRIORITIES = [
  { value: 1, label: "1 — Critical" },
  { value: 2, label: "2 — High" },
  { value: 3, label: "3 — Medium" },
  { value: 4, label: "4 — Low" },
  { value: 5, label: "5 — Lowest" },
];

const STATUSES = [
  { value: "PENDING",     label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED",   label: "Completed" },
];

function toInputDatetime(isoStr) {
  if (!isoStr) return "";
  // LocalDateTime from Java comes as "2024-01-15T14:30:00" — already compatible
  return isoStr.slice(0, 16);
}

function toISOLocal(dtStr) {
  // dtStr is "2024-01-15T14:30" — backend expects LocalDateTime
  return dtStr + ":00";
}

export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = !!task?.id;
  const [form, setForm] = useState({
    title:       "",
    description: "",
    deadline:    "",
    priority:    3,
    status:      "PENDING",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || "",
        description: task.description || "",
        deadline:    toInputDatetime(task.deadline) || "",
        priority:    task.priority    || 3,
        status:      task.status      || "PENDING",
      });
    }
  }, [task]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Task title is required."); return; }
    if (!form.deadline)      { setError("Deadline is required.");   return; }
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        priority: Number(form.priority),
        deadline: toISOLocal(form.deadline),
      }, task?.id);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} className="animate-fade-in">
        {/* Header */}
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.modalTitle}>{isEdit ? "Edit Task" : "New Task"}</div>
            <div style={styles.modalSub}>{isEdit ? "Update task details" : "Add a task to your list"}</div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <div style={styles.form}>
          <Field label="Title *">
            <input
              style={styles.input}
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </Field>

          <Field label="Description">
            <textarea
              style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Optional context or notes..."
            />
          </Field>

          <div style={styles.row}>
            <Field label="Deadline *" style={{ flex: 1 }}>
              <input
                type="datetime-local"
                style={styles.input}
                value={form.deadline}
                onChange={e => set("deadline", e.target.value)}
              />
            </Field>
            <Field label="Priority" style={{ flex: 1 }}>
              <select
                style={styles.input}
                value={form.priority}
                onChange={e => set("priority", e.target.value)}
              >
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
          </div>

          {isEdit && (
            <Field label="Status">
              <select
                style={styles.input}
                value={form.status}
                onChange={e => set("status", e.target.value)}
              >
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
          )}

          {error && <div style={styles.error}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} style={styles.saveBtn} disabled={saving}>
            {saving ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="animate-spin" style={styles.spinner} />
                Saving…
              </span>
            ) : (isEdit ? "Save Changes" : "Create Task")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={{ ...fieldStyle, ...style }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 11, fontWeight: 600, color: "var(--slate-400)", textTransform: "uppercase", letterSpacing: "0.07em" };

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 999,
    padding: 20,
  },
  modal: {
    width: "100%", maxWidth: 520,
    background: "var(--navy-2)",
    borderRadius: 18,
    border: "1px solid var(--border)",
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
  },
  modalHeader: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    padding: "22px 24px 16px",
    borderBottom: "1px solid var(--border-lt)",
  },
  modalTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 700, fontSize: 18,
    color: "var(--white)",
  },
  modalSub: { fontSize: 12, color: "var(--slate-400)", marginTop: 2 },
  closeBtn: {
    width: 30, height: 30,
    borderRadius: 8,
    background: "rgba(255,255,255,0.05)",
    color: "var(--slate-400)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
    border: "1px solid var(--border-lt)",
  },
  form: {
    padding: "20px 24px",
    display: "flex", flexDirection: "column",
    gap: 16,
  },
  row: { display: "flex", gap: 12 },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-lt)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "var(--white)",
    fontSize: 13,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
    colorScheme: "dark",
  },
  error: {
    background: "rgba(244,63,94,0.1)",
    border: "1px solid rgba(244,63,94,0.3)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12,
    color: "#F43F5E",
  },
  modalFooter: {
    display: "flex", justifyContent: "flex-end", gap: 10,
    padding: "16px 24px",
    borderTop: "1px solid var(--border-lt)",
  },
  cancelBtn: {
    padding: "9px 20px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    color: "var(--slate-400)",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid var(--border-lt)",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  saveBtn: {
    padding: "9px 24px",
    borderRadius: 10,
    background: "linear-gradient(135deg, var(--indigo), var(--indigo-lt))",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
    border: "none",
  },
  spinner: {
    width: 12, height: 12,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
  },
};