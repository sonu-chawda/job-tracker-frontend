import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import api, { errMsg } from "../api";
import { useToast } from "./Toast.jsx";

// Ek AI feature ka panel: button dabao, API call hoti hai, result dikhta hai
export default function AiPanel({ title, description, endpoint, button = "Generate", render }) {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await api.post(endpoint, null, { timeout: 60000 });
      setData(res.data);
    } catch (e) {
      toast(errMsg(e), "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="ai-head">
        <div>
          <h3><Sparkles size={16} /> {title}</h3>
          <p className="muted">{description}</p>
        </div>
        <button className="btn" onClick={run} disabled={loading}>
          <Sparkles size={15} /> {loading ? "Thinking..." : data ? "Regenerate" : button}
        </button>
      </div>
      {loading && <div className="skeleton-rows"><div className="skel" /><div className="skel" /></div>}
      {!loading && data && render(data)}
    </div>
  );
}

export function TextResult({ text }) {
  const toast = useToast();
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };
  return (
    <div className="text-result">
      <button className="btn ghost sm copy" onClick={copy}><Copy size={13} /> Copy</button>
      <pre>{text}</pre>
    </div>
  );
}
