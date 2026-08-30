import apiClient from "./client";

export const authApi = {
  signup: (payload) => apiClient.post("/auth/signup", payload),
  login: (payload) => apiClient.post("/auth/login", payload),
};

export const projectsApi = {
  list: () => apiClient.get("/projects"),
  create: (payload) => apiClient.post("/projects", payload),
};

export const eventsApi = {
  create: (payload) => apiClient.post("/events", payload),
  listForProject: (projectId) => apiClient.get(`/events/${projectId}`),
};

export const analyticsApi = {
  summary: (projectId) => apiClient.get(`/analytics/summary/${projectId}`),
  eventBreakdown: (projectId) => apiClient.get(`/analytics/events/${projectId}`),
  funnel: (projectId) => apiClient.get(`/analytics/funnel/${projectId}`),
  activity: (projectId) => apiClient.get(`/analytics/activity/${projectId}`),
};
