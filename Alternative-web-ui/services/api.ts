import { Transaction, UserProfile } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

const lyraFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Device-Id": "lyra-web-secure-id",
    "X-Lyrabit-Channel": "Web",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/api/v1${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ title: "Bilinmeyen hata", status: response.status }));
    throw error;
  }

  return response.json();
};

export const ApiService = {
  getMe: () => lyraFetch("/users/me"),
  getWallet: () => lyraFetch("/wallet"),
  getTransactions: () => lyraFetch("/transactions"),
  getCategories: () => lyraFetch("/categories"),
  getNotifications: () => lyraFetch("/notifications"),
  getAnalytics: () => lyraFetch("/transactions/analytics/summary"),
  searchUsers: (q: string, limit = 10) =>
    lyraFetch(`/users/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  transfer: (data: { receiverEmailOrUsername: string; amount: number; description?: string }) =>
    lyraFetch("/transactions/transfer", { method: "POST", body: JSON.stringify(data) }),
  confirmFlagged: (id: string) =>
    lyraFetch(`/transactions/${id}/confirm`, { method: "POST" }),
};

export { API_BASE };
export type { Transaction, UserProfile };
