import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TasksView from "./views/TasksView";
import ScheduleView from "./views/ScheduleView";
import DashboardView from "./views/DashboardView";
import LoginView from "./views/LoginView"; // <-- NEW IMPORT
import { useTasks } from "./hooks/useTasks";

export default function App() {
  // ─── AUTHENTICATION STATE ──────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  // We are temporarily keeping this until we update the backend controllers
  // to pull the ID directly from the secure token!
  const USER_ID = "1";

  // 1. Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsAuthenticated(true);
      if (storedUsername) setUsername(storedUsername);
    }
  }, []);

  // 2. Handle successful login
  const handleLogin = (loggedInUsername) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    localStorage.setItem("username", loggedInUsername); // Save username for reloads
  };

  // 3. Handle logout
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
  };

  // ─── TASK HOOK (Only fetches if logged in) ──────────────────────
  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks(USER_ID);

  const [activeTab, setActiveTab] = useState("tasks");

  // ─── VIEW ROUTING ───────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView tasks={tasks} username={username} />;
      case "schedule":
        return <ScheduleView userId={USER_ID} />;
      case "tasks":
      default:
        return (
          <TasksView
            tasks={tasks}
            loading={loading}
            error={error}
            onAdd={addTask}
            onEdit={editTask}
            onDelete={removeTask}
          />
        );
    }
  };

  // ─── MAIN RENDER ────────────────────────────────────────────────

  // If the user isn't logged in, lock them on the Login screen!
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  // If they are logged in, render the main application
  return (
    <div style={styles.appContainer}>
      {/* Pass handleLogout to the Sidebar so the user can actually leave */}
      <Sidebar
        active={activeTab}
        onNav={setActiveTab}
        userId={USER_ID}
        tasks={tasks}
        onLogout={handleLogout}
      />

      <main style={styles.mainContent}>
        <Header
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          subtitle={`Welcome back, ${username}.`} // Personalize the header!
        />
        <div style={styles.pageContent}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const styles = {
  appContainer: { display: "flex", minHeight: "100vh" },
  mainContent: { flex: 1, marginLeft: "var(--sidebar-w)", display: "flex", flexDirection: "column" },
  pageContent: { padding: "24px 32px", flex: 1, overflowY: "auto" }
};