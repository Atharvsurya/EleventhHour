// ─── API Base Configuration ───────────────────────────────────────────────────
const BASE_URL = "/api";

async function request(path, options = {}) {
  // 1. Grab the token from local storage
  const token = localStorage.getItem("jwt_token");

  // 2. Set up default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  // 3. If the user is logged in, attach the token to the header!
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 4. NEW: Handle 401 Unauthorized (Token expired or invalid)
  if (res.status === 401) {
    localStorage.removeItem("jwt_token");
    window.location.href = "/login"; // Force redirect to login page
    throw new Error("Session expired. Please log in again.");
  }

  const json = await res.json();
  if (!json.success && json.success !== undefined) {
    throw new Error(json.message || "Request failed");
  }
  return json;
}

// ─── Task Endpoints ───────────────────────────────────────────────────────────

/** GET /api/tasks?userId={id}  →  { success, message, data: Task[] } */
export const getTasks = (userId) =>
  request(`/tasks?userId=${userId}`);

/** POST /api/tasks?userId={id}  →  { success, message, data: Task } */
export const createTask = (userId, task) =>
  request(`/tasks?userId=${userId}`, {
    method: "POST",
    body: JSON.stringify(task),
  });

/** PUT /api/tasks/{taskId}  →  { success, message, data: Task } */
export const updateTask = (taskId, task) =>
  request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

/** DELETE /api/tasks/{taskId}  →  { success, message, data: null } */
export const deleteTask = (taskId) =>
  request(`/tasks/${taskId}`, { method: "DELETE" });

// ─── Agent Endpoints ──────────────────────────────────────────────────────────

/** POST /api/agent/propose-plan?userId={id}  →  { success, message, data: ScheduleBlockDto[] } */
export const proposePlan = (userId) =>
  request(`/agent/propose-plan?userId=${userId}`, { method: "POST" });

/** POST /api/agent/confirm-plan?userId={id}  body: ScheduleBlockDto[]
 * →  { success, message, data: null } */
export const confirmPlan = (userId, blocks) =>
  request(`/agent/confirm-plan?userId=${userId}`, {
    method: "POST",
    body: JSON.stringify(blocks),
  });