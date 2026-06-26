import React, { useState } from "react";
import { proposePlan, confirmPlan } from "../api/client";

export default function ScheduleView() { // Removed userId prop!
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await proposePlan(); // Removed userId!
      if (res.success === false) {
        setError(res.message);
        setBlocks([]);
        return;
      }
      setBlocks(res.data || []);
    } catch (e) {
      setError(e.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
      setLoading(true);
      try {
          // If 'blocks' is a string, parse it; otherwise, pass it directly
          const payload = typeof blocks === 'string' ? JSON.parse(blocks) : blocks;
          await confirmPlan(payload);
          alert("Plan confirmed!");
      } catch (e) {
          setError(e.message);
      } finally {
          setLoading(false);
      }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 8 }}>AI Planner</h2>
      <p style={{ color: "var(--slate-400)", marginBottom: 24 }}>
        Let Gemini analyze your deadlines and priorities to build an optimal schedule.
      </p>

      {error && <div style={{ color: "var(--rose)", marginBottom: 16 }}>{error}</div>}

      <button onClick={generatePlan} style={styles.btn} disabled={loading}>
        {loading ? "Analyzing Tasks..." : "Generate Optimal Schedule"}
      </button>

      {blocks.length > 0 && (
        <div style={styles.planContainer}>
          <h3 style={{ marginBottom: 16 }}>Proposed Schedule</h3>
          <div style={styles.blockList}>
            {blocks.map((block, i) => (
              <div key={`${block.taskId}-${i}`} style={styles.block}>
                <div style={styles.time}>
                  {formatTime(block.startTime)} <br/>
                  <span style={{color: "var(--slate-400)", fontSize: "0.8em"}}>to</span> <br/>
                  {formatTime(block.endTime)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                    {block.taskTitle}
                  </div>
                  <div style={{ fontSize: "0.9em", color: "var(--slate-400)", lineHeight: "1.4" }}>
                    {block.actionPlan}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={savePlan} style={{ ...styles.btn, background: "var(--emerald)", marginTop: 24 }}>
            Confirm & Save Schedule
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  btn: { background: "var(--indigo)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 600, border: "none", cursor: "pointer" },
  planContainer: { marginTop: 32, padding: 24, background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid var(--border-lt)" },
  blockList: { display: "flex", flexDirection: "column", gap: 12 },
  block: { display: "flex", gap: 16, background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 10, border: "1px solid var(--border-lt)", alignItems: "flex-start" },
  time: { fontWeight: 700, color: "var(--cyan)", minWidth: 90, textAlign: "center", paddingTop: 2 }
};