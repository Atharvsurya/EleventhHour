// ─── API Base Configuration ───────────────────────────────────────────────────
const BASE_URL = "https://eleventhhour.onrender.com/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("jwt_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (res.status === 401) {
    localStorage.removeItem("jwt_token");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  // Safe JSON Parsing to prevent "Unexpected end of JSON input"
  let json;
  try {
    const text = await res.text();
    json = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(`Server returned an invalid response (HTTP ${res.status}).`);
  }

  // Catch Spring Security rejections and custom API failures
  if (!res.ok || (json.success !== undefined && !json.success)) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json;
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

export const loginUser = (credentials) =>
  request(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const registerUser = (userData) =>
  request(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

// ─── Task Endpoints ───────────────────────────────────────────────────────────

export const getTasks = () => request(`/tasks`);

export const createTask = (userId, task) =>
  request(`/tasks?userId=${userId}`, {
    method: "POST",
    body: JSON.stringify(task),
  });

export const updateTask = (taskId, task) =>
  request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

export const deleteTask = (taskId) =>
  request(`/tasks/${taskId}`, {
    method: "DELETE"
  });

// ─── Agent Endpoints ──────────────────────────────────────────────────────────

export const proposePlan = () => request(`/agent/propose-plan`, { method: "POST" });
export const confirmPlan = (blocks) => request(`/agent/confirm-plan`, {
    method: "POST",
    body: JSON.stringify(blocks)
});

export const getActivePlans = () => request(`/agent/active-plans`, { method: "GET" });