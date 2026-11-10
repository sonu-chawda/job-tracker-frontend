import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, History, LayoutGrid, List, MapPin, Pencil, Plus, Search, Trash2, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import { STATUSES, fmtDate, fmtDateTime, isDue, label } from "../constants";
import { useToast } from "../components/Toast.jsx";
import Avatar from "../components/Avatar.jsx";
import Board from "../components/Board.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import ApplicationModal from "../components/ApplicationModal.jsx";
import Modal from "../components/Modal.jsx";

const SIZE = 8;

export default function Applications() {
  const toast = useToast();
  const [res, setRes] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [view, setView] = useState(() => localStorage.getItem("view") || "list");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [dir, setDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [historyFor, setHistoryFor] = useState(null);
  const [history, setHistory] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Board mein ek saath saari (max 50) applications chahiye, list mein page-wise
      const params = view === "board" ? { page: 0, size: 50, sortBy: "createdAt", dir: "desc" } : { page, size: SIZE, sortBy, dir };
      if (view === "list" && status) params.status = status;
      const { data } = await api.get("/api/applications", { params });
      setRes(data);
    } catch (e) {
      toast(errMsg(e), "err");
    } finally {
      setLoading(false);
    }
  }, [view, page, status, sortBy, dir]);

  useEffect(() => { load(); }, [load]);

  const pickView = (v) => { setView(v); localStorage.setItem("view", v); setPage(0); };
  const pickStatus = (s) => { setStatus(s); setPage(0); };

  const changeStatus = async (a, s) => {
    // Pehle screen par badlo (fast feel), fail ho to wapas load
    setRes((r) => ({ ...r, content: r.content.map((x) => (x.id === a.id ? { ...x, status: s } : x)) }));
    try {
      await api.patch(`/api/applications/${a.id}/status`, { status: s });
      toast(`${a.company} moved to ${label(s)}`);
    } catch (e) {
      toast(errMsg(e), "err");
      load();
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete application at ${a.company}?`)) return;
    try {
      await api.delete(`/api/applications/${a.id}`);
      toast("Application deleted");
      if (res.content.length === 1 && page > 0) setPage(page - 1);
      else load();
    } catch (e) {
      toast(errMsg(e), "err");
    }
  };

  const openHistory = async (a) => {
    setHistoryFor(a);
    setHistory([]);
    try {
      const { data } = await api.get(`/api/applications/${a.id}/history`);
      setHistory(data);
    } catch (e) {
      toast(errMsg(e), "err");
    }
  };

  const q = search.trim().toLowerCase();
  const rows = res.content.filter((a) => !q || (a.company + " " + a.jobTitle).toLowerCase().includes(q));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Applications</h1>
          <p className="muted">{res.totalElements} total applications</p>
        </div>
        <button className="btn" onClick={() => setEditing({})}><Plus size={16} /> Add application</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <span className="field grow">
            <Search size={16} />
            <input placeholder="Search company or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
          {view === "list" && (
            <>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
                <option value="createdAt">Date added</option>
                <option value="appliedDate">Applied date</option>
                <option value="company">Company</option>
                <option value="status">Status</option>
              </select>
              <button className="btn ghost" onClick={() => setDir(dir === "desc" ? "asc" : "desc")}>{dir === "desc" ? "Newest first" : "Oldest first"}</button>
            </>
          )}
          <div className="seg">
            <button className={view === "list" ? "on" : ""} onClick={() => pickView("list")}><List size={15} /> List</button>
            <button className={view === "board" ? "on" : ""} onClick={() => pickView("board")}><LayoutGrid size={15} /> Board</button>
          </div>
        </div>

        {view === "list" && (
          <div className="chips">
            <button className={"chip" + (status === "" ? " active" : "")} onClick={() => pickStatus("")}>All</button>
            {STATUSES.map((s) => (
              <button key={s} className={"chip" + (status === s ? " active" : "")} onClick={() => pickStatus(s)}>{label(s)}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="skeleton-rows"><div className="skel" /><div className="skel" /><div className="skel" /></div>
        ) : view === "board" ? (
          <Board apps={rows} onMove={changeStatus} onEdit={setEditing} />
        ) : rows.length === 0 ? (
          <div className="empty small-empty"><p className="muted">No applications found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Applied</th><th>Follow-up</th><th className="right">Actions</th></tr></thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="cell">
                        <Avatar name={a.company} />
                        <div>
                          <Link to={`/applications/${a.id}`} className="co-link"><strong>{a.company}</strong></Link>
                          {a.location && <div className="muted small meta"><MapPin size={12} /> {a.location}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {a.jobUrl ? <a href={a.jobUrl} target="_blank" rel="noreferrer" className="inline">{a.jobTitle} <ExternalLink size={12} /></a> : a.jobTitle}
                      {a.salary && <div className="muted small meta"><IndianRupee size={12} /> {a.salary}</div>}
                    </td>
                    <td>
                      <div className="status-cell">
                        <StatusBadge status={a.status} />
                        <select className="status-select" value={a.status} onChange={(e) => changeStatus(a, e.target.value)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                        </select>
                      </div>
                    </td>
                    <td>{fmtDate(a.appliedDate)}</td>
                    <td>{fmtDate(a.followUpDate)}{isDue(a) && <span className="due">Due</span>}</td>
                    <td className="right nowrap">
                      <button className="icon-btn" title="History" onClick={() => openHistory(a)}><History size={16} /></button>
                      <button className="icon-btn" title="Edit" onClick={() => setEditing(a)}><Pencil size={16} /></button>
                      <button className="icon-btn danger" title="Delete" onClick={() => remove(a)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "list" && (
          <div className="pager">
            <button className="btn ghost sm" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /> Previous</button>
            <span className="muted">Page {res.totalPages === 0 ? 0 : page + 1} of {res.totalPages}</span>
            <button className="btn ghost sm" disabled={page + 1 >= res.totalPages} onClick={() => setPage(page + 1)}>Next <ChevronRight size={14} /></button>
          </div>
        )}
      </div>

      {editing && (
        <ApplicationModal
          app={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { toast(editing.id ? "Application updated" : "Application added"); setEditing(null); load(); }}
        />
      )}

      {historyFor && (
        <Modal title={`Status history: ${historyFor.company}`} onClose={() => setHistoryFor(null)}>
          {history.length === 0 ? (
            <p className="muted">Loading...</p>
          ) : (
            <ul className="timeline">
              {history.map((h, i) => (
                <li key={i}>
                  <div>
                    {h.oldStatus ? <><StatusBadge status={h.oldStatus} /> &rarr; </> : "Created as "}
                    <StatusBadge status={h.newStatus} />
                  </div>
                  <small className="muted">{fmtDateTime(h.changedAt)}</small>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  );
}
