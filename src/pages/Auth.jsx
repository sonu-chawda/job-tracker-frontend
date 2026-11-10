import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BarChart3, Briefcase, CalendarClock, Lock, Mail, User, Workflow } from "lucide-react";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext.jsx";

export default function Auth() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = mode === "login" ? { email: f.email, password: f.password } : f;
      const { data } = await api.post(`/api/auth/${mode}`, body);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const features = [
    [Workflow, "Pipeline tracking", "Wishlist se offer tak, har stage ek jagah"],
    [BarChart3, "Live dashboard", "Charts aur stats se progress dekho"],
    [CalendarClock, "Follow-up reminders", "Koi follow-up miss nahi hoga"],
  ];

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <span className="blob b1" /><span className="blob b2" />
        <div className="hero-inner">
          <div className="brand big"><span className="logo"><Briefcase size={20} /></span> JobTrackr</div>
          <h1>Your job search, <span>organised.</span></h1>
          <p>Track every application, follow every stage and stay on top of your follow-ups.</p>
          <div className="feat-list">
            {features.map(([Icon, t, d]) => (
              <div className="feat" key={t}>
                <span><Icon size={18} /></span>
                <div><strong>{t}</strong><small>{d}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-card">
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="muted">{mode === "login" ? "Login to continue to your dashboard" : "Start tracking in under a minute"}</p>
          <form onSubmit={submit}>
            {mode === "register" && (
              <label>Name
                <span className="field"><User size={16} /><input required value={f.name} onChange={set("name")} placeholder="Your name" /></span>
              </label>
            )}
            <label>Email
              <span className="field"><Mail size={16} /><input required type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" /></span>
            </label>
            <label>Password
              <span className="field"><Lock size={16} /><input required type="password" minLength={6} value={f.password} onChange={set("password")} placeholder="At least 6 characters" /></span>
            </label>
            {error && <div className="alert">{error}</div>}
            <button className="btn block" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>
          <p className="switch">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setError(""); setMode(mode === "login" ? "register" : "login"); }}>
              {mode === "login" ? "Create an account" : "Login"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
