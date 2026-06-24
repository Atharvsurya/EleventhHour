import React, { useState, useEffect } from 'react';

export default function ProductivityDashboard() {
  const [tasks, setTasks] = useState([]);
  const [proposedPlan, setProposedPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Hardcoded user object matching the dummy data we put in MySQL
  const activeUser = {
      id: 1,
      username: "DemoUser",
      email: "demo@eleventhhour.com"
  };

  // Simulated static fetch of basic tasks for presentation purposes
  useEffect(() => {
    setTasks([
      { id: 101, title: "Database Schema Documentation", deadline: "Tonight at 11:00 PM", priority: 2 },
      { id: 102, title: "Deploy Application to AWS", deadline: "Tomorrow at 9:00 AM", priority: 1 }
    ]);
  }, []);

  // Request Agent Action Scheduling Layout
  const handleAutoPlan = async () => {
    setLoading(true);
    setStatusMessage("Agent is mapping tasks, calendar slots, and dividing work...");
    try {
      const response = await fetch(`http://localhost:8080/api/agent/propose-plan?userId=${activeUser.id}`, {
        method: 'POST',
      });

      // NEW: If the server fails, extract the exact Java error message!
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Backend Error: ${errorText}`);
      }

      const data = await response.json();
      setProposedPlan(data);
      setStatusMessage("Proposed schedule layout generated successfully!");
    } catch (err) {
      console.error(err); // This will now log the EXACT Java exception!
      setStatusMessage(err.message); // Show it on the screen so you can see it
    } finally {
      setLoading(false);
    }
  };

  // Lock In Suggested Action Plan
  const handleConfirmPlan = async () => {
    setLoading(true);
    setStatusMessage("Locking schedule slots into database...");
    try {
      const response = await fetch(`http://localhost:8080/api/agent/confirm-plan?userId=${activeUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposedPlan)
      });
      if (!response.ok) throw new Error("Relational save failed");

      setStatusMessage("Schedule Confirmed! Calendar and sub-tasks updated.");
      setProposedPlan([]); // Reset screen planning cards
    } catch (err) {
      console.error(err);
      setStatusMessage("Error archiving agreed plan schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '30px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eaeaea', paddingBottom: '15px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>🛡️ The Last-Minute Life Saver</h1>
        <p style={{ color: '#7f8c8d' }}>Proactive Agentic Task Organizer powered by Gemini 1.5</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>

        {/* Task List Panel */}
        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#34495e', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>Pending Overdues</h2>
          {tasks.map(task => (
            <div key={task.id} style={{ padding: '12px', border: '1px solid #f1f2f6', borderRadius: '6px', marginBottom: '10px' }}>
              <strong style={{ color: '#2c3e50', fontSize: '1.1em' }}>{task.title}</strong>
              <div style={{ color: '#e74c3c', fontSize: '0.85em', fontWeight: 'bold', marginTop: '4px' }}>Deadline: {task.deadline}</div>
              <div style={{ color: '#95a5a6', fontSize: '0.85em' }}>Default Priority: {task.priority}</div>
            </div>
          ))}
          <button
            onClick={handleAutoPlan}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '15px'
            }}
          >
            {loading ? "Agent Thinking..." : "⚡ Auto-Plan My Day"}
          </button>
        </section>

        {/* AI Action/Planning Screen */}
        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#2c3e50' }}>Agent Active Action Execution Strategy</h2>
          {statusMessage && <div style={{ background: '#e1f5fe', color: '#0288d1', padding: '12px', borderRadius: '4px', marginBottom: '15px' }}>{statusMessage}</div>}

          {proposedPlan.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#95a5a6' }}>
              <p>No optimization generated. Click "Auto-Plan My Day" to allow the AI Agent to coordinate calendars and structure workloads.</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '20px' }}>
                {proposedPlan.map((block, index) => (
                  <div key={index} style={{ borderLeft: '4px solid #2ecc71', background: '#f9fbf9', padding: '15px', marginBottom: '15px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 'bold', color: '#27ae60' }}>⏳ Allocated Focus Session</span>
                      <span style={{ fontSize: '0.85em', color: '#7f8c8d' }}>Priority Level: {block.priority || block.task?.priority}</span>
                    </div>
                    <div style={{ fontSize: '0.95em', margin: '5px 0' }}>
                      <strong>Target Task:</strong> {block.taskTitle || block.task?.title}
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#34495e', marginBottom: '10px' }}>
                      <strong>Duration:</strong> {new Date(block.startTime).toLocaleString()} - {new Date(block.endTime).toLocaleTimeString()}
                    </div>
                    <div style={{ background: '#fff', padding: '10px', border: '1px dashed #cbd5e1', borderRadius: '4px' }}>
                      <strong>📝 Sub-Tasks (AI Generated):</strong>
                      <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-line', fontSize: '0.9em', color: '#555' }}>
                        {block.actionPlan}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleConfirmPlan}
                  style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Lock In Schedule
                </button>
                <button
                  onClick={() => setProposedPlan([])}
                  style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Reject & Re-plan
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}