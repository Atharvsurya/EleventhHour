import { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/client";

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks(userId);
      setTasks(res.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task) => {
    const res = await createTask(userId, task);
    setTasks((prev) => [...prev, res.data]);
    return res.data;
  };

  const editTask = async (taskId, task) => {
    const res = await updateTask(taskId, task);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    return res.data;
  };

  const removeTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return { tasks, loading, error, refetch: fetchTasks, addTask, editTask, removeTask };
}