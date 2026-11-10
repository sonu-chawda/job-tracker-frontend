import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, MapPin, Pencil, IndianRupee, CalendarClock } from "lucide-react";
import api, { errMsg } from "../api";
import { STATUSES, fmtDate, fmtDateTime, label } from "../constants";
import { useToast } from "../components/Toast.jsx";
import Avatar from "../components/Avatar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import ApplicationModal from "../components/ApplicationModal.jsx";
import AiPanel, { TextResult } from "../components/AiPanel.jsx";
import { ScoreRing } from "../components/Illustrations.jsx";

const TABS = ["Overview", "AI Match", "Cover Letter", "Interview Prep", "Follow-up", "History"];

const Chips = ({ items = [], cls }) => <div className="skill-chips">{items.map((s, i) => <span key={i} className={"skill " + cls}>{s}</span>)}</div>;

export default function ApplicationDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [app, setApp] = useState(null);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("Overview");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([api.get(`/api/applications/${id}`), api.get(`/api/applications/${id}/history`)])
      .then(([a, h]) => { setApp(a.data); setHistory(h.data); })
      .catch((e) => setError(errMsg(e)));

  useEffect(() => { load(); }, [id]);

  const changeStatus = async (s) => {
    try {
      await api.patch(`/api/applications/${id}/status`, { status: s });
      toast(`Moved to ${label(s)}`);
      load();
    } catch (e) {
      toast(errMsg(e), "err");
    }
  };

  if (error) return <div className="alert">{error} <Link to="/applications">Back</Link></div>;
  if (!app) return <div className="skeleton-rows"><div className="skel" /><div className="skel" /></div>;

  const ai = `/api/ai/${id}`;

  return (
    <>
      <Link to="/applications" className="back"><ArrowLeft size={16} /> All applications</Link>

      <div className="card detail-head">
        <Avatar name={app.company} size={56} />
        <div className="grow">
          <h1>{app.jobTitle}</h1>
          <p className="muted">{app.company}</p>
          <div className="detail-meta">
            {app.location && <span><MapPin size={14} /> {app.location}</span>}
            {app.salary && <span><IndianRupee size={14} /> {app.salary}</span>}
            {app.followUpDate && <span><CalendarClock size={14} /> Follow-up {fmtDate(app.followUpDate)}</span>}
            {app.jobUrl && <a href={app.jobUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Job link</a>}
          </div>
        </div>
        <div className="detail-actions">
          <select value={app.status} onChange={(e) => changeStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
          </select>
          <button className="btn ghost" onClick={() => setEditing(true)}><Pencil size={15} /> Edit</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      <div className="card">
        {tab === "Overview" && (
          <div className="overview">
            <div><span className="muted">Status</span><div><StatusBadge status={app.status} /></div></div>
            <div><span className="muted">Applied on</span><div>{fmtDate(app.appliedDate)}</div></div>
            <div className="full"><span className="muted">Notes</span><p>{app.notes || "No notes yet."}</p></div>
            <div className="full">
              <span className="muted">Job description</span>
              {app.jobDescription ? <pre className="jd">{app.jobDescription}</pre> : <p>Not added yet. Edit this application and paste the job description to use the AI tabs.</p>}
            </div>
          </div>
        )}

        {tab === "AI Match" && (
          <AiPanel title="Resume match" description="Compares your saved resume with this job description." endpoint={`${ai}/analyze`} button="Analyze match"
            render={(d) => (
              <div className="match">
                <div className="match-top">
                  <ScoreRing value={Math.round(d.matchScore || 0)} />
                  <p>{d.summary}</p>
                </div>
                <h4>Matched skills</h4><Chips items={d.matchedSkills} cls="good" />
                <h4>Missing skills</h4><Chips items={d.missingSkills} cls="bad" />
                {d.strengths?.length > 0 && <><h4>Strengths</h4><ul>{d.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
                {d.suggestions?.length > 0 && <><h4>Suggestions</h4><ul>{d.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
              </div>
            )} />
        )}

        {tab === "Cover Letter" && (
          <AiPanel title="Cover letter" description="A short draft based only on your resume. Edit before sending." endpoint={`${ai}/cover-letter`} button="Write cover letter"
            render={(d) => <TextResult text={d.content} />} />
        )}

        {tab === "Interview Prep" && (
          <AiPanel title="Interview questions" description="Likely questions for this role, based on your resume." endpoint={`${ai}/interview-questions`} button="Generate questions"
            render={(d) => (
              <div className="qs">
                {(d.questions || []).map((q, i) => (
                  <div className="q" key={i}>
                    <div className="q-top"><span className="skill">{q.category}</span><span className="skill">{q.difficulty}</span></div>
                    <strong>{i + 1}. {q.question}</strong>
                    {q.tip && <p className="muted">Tip: {q.tip}</p>}
                  </div>
                ))}
              </div>
            )} />
        )}

        {tab === "Follow-up" && (
          <AiPanel title="Follow-up email" description="A polite follow-up you can send to the recruiter." endpoint={`${ai}/follow-up`} button="Draft email"
            render={(d) => <TextResult text={d.content} />} />
        )}

        {tab === "History" && (
          <ul className="timeline">
            {history.map((h, i) => (
              <li key={i}>
                <div>{h.oldStatus ? <><StatusBadge status={h.oldStatus} /> &rarr; </> : "Created as "}<StatusBadge status={h.newStatus} /></div>
                <small className="muted">{fmtDateTime(h.changedAt)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && <ApplicationModal app={app} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); toast("Application updated"); load(); }} />}
    </>
  );
}
