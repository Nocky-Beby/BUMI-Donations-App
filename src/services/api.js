const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "bumi-token";
const USER_KEY = "bumi-user";

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
};

async function apiRequest(path, options = {}) {
  const token = options.token || storage.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    cache: options.cache || "no-store",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "La requête a échoué.");
  }

  return data;
}

export const authApi = {
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  me: () => apiRequest("/auth/me"),
  updateMe: (payload) => apiRequest("/users/me", { method: "PUT", body: payload }),
};

export const publicApi = {
  getNeeds: () => apiRequest("/public/needs"),
  getStats: () => apiRequest("/public/stats"),
  getReports: () => apiRequest("/public/reports"),
};

export const dashboardApi = {
  getSummary: () => apiRequest("/dashboard/summary"),
};

export const usersApi = {
  all: () => apiRequest("/users"),
  create: (payload) => apiRequest("/users", { method: "POST", body: payload }),
};

export const needsApi = {
  all: () => apiRequest("/needs"),
  create: (payload) => apiRequest("/needs", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/needs/${id}`, { method: "PATCH", body: payload }),
};

export const partnersApi = {
  all: () => apiRequest("/partners"),
  create: (payload) => apiRequest("/partners", { method: "POST", body: payload }),
};

export const donationApi = {
  create: (payload) => apiRequest("/donations", { method: "POST", body: payload }),
  myHistory: () => apiRequest("/donations/my"),
  all: () => apiRequest("/donations"),
  updateStatus: (id, payload) => apiRequest(`/donations/${id}/status`, { method: "PATCH", body: payload }),
  allocate: (id, payload) => apiRequest(`/donations/${id}/allocate`, { method: "POST", body: payload }),
};

export const trackingApi = {
  my: () => apiRequest("/tracking/my"),
  byDonation: (donationId) => apiRequest(`/tracking/${donationId}`),
};

export const distributionApi = {
  all: () => apiRequest("/distributions"),
  create: (payload) => apiRequest("/distributions", { method: "POST", body: payload }),
};

export const reportsApi = {
  overview: () => apiRequest("/reports/overview"),
};

export const notificationsApi = {
  my: () => apiRequest("/notifications/my"),
  markRead: (id) => apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),
};

export { API_BASE_URL };
