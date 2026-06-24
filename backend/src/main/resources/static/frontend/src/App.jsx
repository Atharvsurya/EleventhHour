import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TasksView from "./views/TasksView";
import ScheduleView from "./views/ScheduleView";
import DashboardView from "./views/DashboardView";
import { useTasks } from "./hooks/useTasks";

const USER_ID = "U-1001"; // Hardcoded for now, replace with real auth later

export default function App() {
  const [activeTab, setActiveTab] = useState("tasks");
  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks(USER_ID);

  // Switch between pages based on sidebar selection
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView tasks={tasks} />;
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

  return (
    <div style={styles.appContainer}>
      <Sidebar active={activeTab} onNav={setActiveTab} userId={USER_ID} tasks={tasks} />

      <main style={styles.mainContent}>
        <Header
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          subtitle="Manage your time effectively."
        />
        <div style={styles.pageContent}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
  },
  mainContent: {
    flex: 1,
    marginLeft: "var(--sidebar-w)", // Respects the CSS variable from index.css
    display: "flex",
    flexDirection: "column",
  },
  pageContent: {
    padding: "24px 32px",
    flex: 1,
    overflowY: "auto",
  }
};