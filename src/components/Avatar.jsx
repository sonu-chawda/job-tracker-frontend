const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#14b8a6"];

// Company ke naam ka pehla letter, naam ke hisaab se fixed color
export default function Avatar({ name = "?", size = 38 }) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % COLORS.length;
  const color = COLORS[h];
  return (
    <span className="co-avatar" style={{ width: size, height: size, background: color + "22", color, fontSize: size * 0.42 }}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
