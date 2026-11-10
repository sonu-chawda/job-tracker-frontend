import { useEffect, useState } from "react";
import { FileText, Save, Sparkles, Wand2 } from "lucide-react";
import api, { errMsg } from "../api";
import { useToast } from "../components/Toast.jsx";
import { TextResult } from "../components/AiPanel.jsx";

export default function Resume() {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [apps, setApps] = useState([]);
  const [appId, setAppId] = useState("");
  const [tailored, setTailored] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/api/resume").then((r) => setContent(r.data.content || "")).catch((e) => toast(errMsg(e), "err"));
    api.get("/api/applications?size=50").then((r) => setApps(r.data.content)).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/api/resume", { content });
      toast("Resume saved");
    } catch (e) {
      toast(errMsg(e), "err");
    } finally {
      setSaving(false);
    }
  };

  const tailor = async () => {
    setBusy(true);
    setTailored("");
    try {
      const { data } = await api.post(`/api/ai/${appId}/tailor-resume`, null, { timeout: 60000 });
      setTailored(data.content);
    } catch (e) {
      toast(errMsg(e), "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Resume</h1>
          <p className="muted">Save your base resume once. All AI features use it.</p>
        </div>
        <button className="btn" onClick={save} disabled={saving}><Save size={16} /> {saving ? "Saving..." : "Save resume"}</button>
      </div>

      <div className="card">
        <h3><FileText size={16} /> Your resume (plain text)</h3>
        <textarea rows="16" value={content} onChange={(e) => setContent(e.target.value)}
          placeholder={"Paste your resume text here.\n\nName, summary, skills, projects, education..."} />
      </div>

      <div className="card">
        <h3><Wand2 size={16} /> Tailor for a job</h3>
        <p className="muted">AI rewrites your resume for one application. It only rephrases what is already in your resume and never adds skills you do not have. Review before using.</p>
        <div className="toolbar">
          <select className="grow" value={appId} onChange={(e) => setAppId(e.target.value)}>
            <option value="">Select an application...</option>
            {apps.map((a) => <option key={a.id} value={a.id}>{a.company} - {a.jobTitle}</option>)}
          </select>
          <button className="btn" disabled={!appId || busy} onClick={tailor}><Sparkles size={15} /> {busy ? "Thinking..." : "Tailor resume"}</button>
        </div>
        {busy && <div className="skeleton-rows"><div className="skel" /><div className="skel" /></div>}
        {tailored && <TextResult text={tailored} />}
      </div>
    </>
  );
}
