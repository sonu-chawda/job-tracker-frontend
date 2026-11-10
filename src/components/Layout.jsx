import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Briefcase, FileText, LayoutDashboard, LogOut, Moon, Settings, ShieldCheck, Sun } from "lucide-react";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../ThemeContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const out = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="logo"><Briefcase size={18} /></span> JobTrackr
        </NavLink>
        <nav>
          <NavLink to="/dashboard"><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/applications"><Briefcase size={18} /> Applications</NavLink>
          <NavLink to="/resume"><FileText size={18} /> Resume</NavLink>
          <NavLink to="/settings"><Settings size={18} /> Settings</NavLink>
          {user.role === "ADMIN" && <NavLink to="/admin"><ShieldCheck size={18} /> Admin</NavLink>}
        </nav>
        <button className="theme-btn" onClick={toggle}>
          {dark ? <Sun size={16} /> : <Moon size={16} />} {dark ? "Light mode" : "Dark mode"}
        </button>
        <div className="userbox">
          <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div className="uinfo">
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </div>
          <button className="icon-btn" onClick={out} title="Logout"><LogOut size={16} /></button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
