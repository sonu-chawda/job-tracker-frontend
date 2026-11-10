import { useState } from "react";
import api, { errMsg } from "../api";
import { STATUSES, label } from "../constants";
import Modal from "./Modal.jsx";

const EMPTY = {
  company: "", jobTitle: "", jobUrl: "", location: "", salary: "",
  status: "WISHLIST", appliedDate: "", followUpDate: "", notes: "", jobDescription: "",
};

export default function ApplicationModal({ app, onClose, onSaved }) {
  const isEdit = !!app?.id;
  const [f, setF] = useState(() => {
    const base = { ...EMPTY };
    Object.keys(EMPTY).forEach((k) => { if (app && app[k] != null) base[k] = app[k]; });
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Khaali string ko null bhejo (dates ke liye zaroori)
    const payload = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, f[k] === "" ? null : f[k]]));
    try {
      if (isEdit) await api.put(`/api/applications/${app.id}`, payload);
      else await api.post("/api/applications", payload);
      onSaved();
    } catch (err) {
      setError(errMsg(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit application" : "Add application"} onClose={onClose} wide>
      <form onSubmit={submit}>
        <div className="grid2">
          <label>Company *<input required value={f.company} onChange={set("company")} placeholder="e.g. Infosys" /></label>
          <label>Job title *<input required value={f.jobTitle} onChange={set("jobTitle")} placeholder="e.g. Java Developer" /></label>
          <label>Location<input value={f.location} onChange={set("location")} placeholder="e.g. Bhopal / Remote" /></label>
          <label>Salary<input value={f.salary} onChange={set("salary")} placeholder="e.g. 4-6 LPA" /></label>
          <label>Status
            <select value={f.status} onChange={set("status")}>
              {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </label>
          <label>Job URL<input value={f.jobUrl} onChange={set("jobUrl")} placeholder="https://..." /></label>
          <label>Applied date<input type="date" value={f.appliedDate} onChange={set("appliedDate")} /></label>
          <label>Follow-up date<input type="date" value={f.followUpDate} onChange={set("followUpDate")} /></label>
        </div>
        <label>Notes<textarea rows="2" value={f.notes} onChange={set("notes")} placeholder="Recruiter name, referral, anything useful" /></label>
        <label>Job description
          <textarea rows="5" value={f.jobDescription} onChange={set("jobDescription")} placeholder="Paste the full job description here. The AI features will use this in the next phase." />
        </label>
        {error && <div className="alert">{error}</div>}
        <div className="actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save changes" : "Add application"}</button>
        </div>
      </form>
    </Modal>
  );
}
