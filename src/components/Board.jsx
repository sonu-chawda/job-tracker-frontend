import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, MapPin, Pencil } from "lucide-react";
import { STATUSES, STATUS_COLORS, fmtDate, isDue, label } from "../constants";
import Avatar from "./Avatar.jsx";

// Kanban board: card ko drag karke doosre column mein chhodo = status change
export default function Board({ apps, onMove, onEdit }) {
  const [over, setOver] = useState(null);

  const drop = (e, status) => {
    e.preventDefault();
    setOver(null);
    const id = Number(e.dataTransfer.getData("text/plain"));
    const app = apps.find((a) => a.id === id);
    if (app && app.status !== status) onMove(app, status);
  };

  return (
    <div className="board">
      {STATUSES.map((s) => {
        const list = apps.filter((a) => a.status === s);
        return (
          <div
            key={s}
            className={"col" + (over === s ? " over" : "")}
            onDragOver={(e) => { e.preventDefault(); setOver(s); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => drop(e, s)}
          >
            <div className="col-head">
              <span><i style={{ background: STATUS_COLORS[s] }} />{label(s)}</span>
              <b>{list.length}</b>
            </div>
            <div className="col-body">
              {list.map((a) => (
                <div
                  key={a.id}
                  className="kcard"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", String(a.id))}
                >
                  <div className="kcard-top">
                    <Avatar name={a.company} size={32} />
                    <div className="grow">
                      <Link to={`/applications/${a.id}`} className="co-link"><strong>{a.company}</strong></Link>
                      <div className="muted small">{a.jobTitle}</div>
                    </div>
                    <button className="icon-btn" onClick={() => onEdit(a)} title="Edit"><Pencil size={14} /></button>
                  </div>
                  {a.location && <div className="meta"><MapPin size={12} /> {a.location}</div>}
                  {a.followUpDate && (
                    <div className={"meta" + (isDue(a) ? " warn" : "")}>
                      <CalendarClock size={12} /> Follow-up {fmtDate(a.followUpDate)}
                    </div>
                  )}
                </div>
              ))}
              {list.length === 0 && <div className="col-empty">Drop here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
