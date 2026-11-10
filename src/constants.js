export const STATUSES = ["WISHLIST", "APPLIED", "ONLINE_TEST", "INTERVIEW", "OFFER", "REJECTED"];

export const STATUS_COLORS = {
  WISHLIST: "#64748b",
  APPLIED: "#3b82f6",
  ONLINE_TEST: "#f59e0b",
  INTERVIEW: "#8b5cf6",
  OFFER: "#16a34a",
  REJECTED: "#ef4444",
};

export const label = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ") : "");

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-");

export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "-");

// Follow-up ki date aa gayi ya nikal gayi, aur application abhi open hai
export const isDue = (a) => {
  const today = new Date().toISOString().slice(0, 10);
  return a.followUpDate && a.followUpDate <= today && !["OFFER", "REJECTED"].includes(a.status);
};
