import { useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../ThemeContext.jsx";

export default function Settings() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <div className="page-head"><div><h1>Settings</h1><p className="muted">Your account and preferences.</p></div></div>

      <div className="card">
        <h3>Profile</h3>
        <div className="profile">
          <div className="avatar big">{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{user.name}</strong>
            <div className="muted">{user.email}</div>
            <span className="skill">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Appearance</h3>
        <div className="row-between">
          <div><strong>Dark mode</strong><div className="muted small">Easier on the eyes at night.</div></div>
          <button className="btn ghost" onClick={toggle}>{dark ? <Sun size={16} /> : <Moon size={16} />} {dark ? "Switch to light" : "Switch to dark"}</button>
        </div>
      </div>

      <div className="card">
        <h3>Session</h3>
        <button className="btn ghost" onClick={() => { logout(); navigate("/login"); }}><LogOut size={16} /> Logout</button>
      </div>
    </>
  );
}
