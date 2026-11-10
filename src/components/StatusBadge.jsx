import { STATUS_COLORS, label } from "../constants";

export default function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || "#64748b";
  return (
    <span className="badge" style={{ background: c + "1f", color: c }}>
      <i style={{ background: c }} />
      {label(status)}
    </span>
  );
}
