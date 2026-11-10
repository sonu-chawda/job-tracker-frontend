// Apne bane SVG illustrations (koi copyright issue nahi)
export function NotFoundArt() {
  return (
    <svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Page not found">
      <ellipse cx="160" cy="200" rx="110" ry="12" fill="var(--hover)" />
      <rect x="70" y="40" width="180" height="130" rx="16" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
      <rect x="70" y="40" width="180" height="28" rx="14" fill="#6366f1" />
      <circle cx="90" cy="54" r="5" fill="#fff" opacity=".8" /><circle cx="108" cy="54" r="5" fill="#fff" opacity=".6" /><circle cx="126" cy="54" r="5" fill="#fff" opacity=".4" />
      <text x="160" y="132" textAnchor="middle" fontSize="48" fontWeight="800" fill="#6366f1">404</text>
      <circle cx="248" cy="62" r="26" fill="#f59e0b22" stroke="#f59e0b" strokeWidth="3" />
      <line x1="266" y1="82" x2="288" y2="106" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyArt() {
  return (
    <svg viewBox="0 0 200 140" width="200" height="140" role="img" aria-label="Nothing here yet">
      <rect x="30" y="30" width="140" height="90" rx="14" fill="var(--hover)" />
      <rect x="44" y="46" width="60" height="8" rx="4" fill="#6366f155" />
      <rect x="44" y="64" width="112" height="8" rx="4" fill="var(--border)" />
      <rect x="44" y="80" width="90" height="8" rx="4" fill="var(--border)" />
      <circle cx="150" cy="40" r="22" fill="#6366f1" /><path d="M150 30v20M140 40h20" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function ScoreRing({ value = 0, size = 120 }) {
  const r = 46, c = 2 * Math.PI * r;
  const color = value >= 75 ? "#16a34a" : value >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (c * Math.min(value, 100)) / 100} transform="rotate(-90 60 60)" />
      <text x="60" y="66" textAnchor="middle" fontSize="26" fontWeight="800" style={{ fill: "var(--text)" }}>{value}%</text>
    </svg>
  );
}
