import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Briefcase, CalendarClock, Plus, Send, Trophy, Users } from "lucide-react";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext.jsx";
import { STATUSES, STATUS_COLORS, fmtDate, isDue, label } from "../constants";
import Avatar from "../components/Avatar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const tip = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" };
const axis = { fontSize: 12, style: { fill: "var(--muted)" } };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/api/applications/stats"), api.get("/api/applications?size=50")])
      .then(([s, a]) => { setStats(s.data); setApps(a.data.content); })
      .catch((e) => setError(errMsg(e)));
  }, []);

  if (error) return <div className="alert">{error}</div>;
  if (!stats) return <div className="skeleton-grid"><div className="skel" /><div className="skel" /><div className="skel" /><div className="skel" /></div>;

  const by = stats.byStatus;
  const chart = STATUSES.map((s) => ({ key: s, name: label(s), value: by[s] || 0 }));
  const inProgress = (by.APPLIED || 0) + (by.ONLINE_TEST || 0) + (by.INTERVIEW || 0);
  const due = apps.filter(isDue);
  const rate = stats.total ? Math.round(((by.OFFER || 0) / stats.total) * 100) : 0;

  const cards = [
    { t: "Total applications", v: stats.total, c: "#6366f1", I: Briefcase },
    { t: "In progress", v: inProgress, c: "#3b82f6", I: Send },
    { t: "Interviews", v: by.INTERVIEW || 0, c: "#8b5cf6", I: Users },
    { t: "Offers", v: by.OFFER || 0, c: "#16a34a", I: Trophy, sub: `${rate}% success rate` },
  ];

  return (
    <>
      <div className="hero-banner">
        <div>
          <h1>Hi, {user.name.split(" ")[0]} 👋</h1>
          <p>{due.length > 0 ? `You have ${due.length} follow-up${due.length > 1 ? "s" : ""} due. Let's get them done.` : "Here is how your job search is going."}</p>
        </div>
        <Link to="/applications" className="btn light"><Plus size={16} /> Add application</Link>
      </div>

      <div className="cards">
        {cards.map(({ t, v, c, I, sub }) => (
          <div className="card stat" key={t}>
            <span className="stat-icon" style={{ background: c + "1f", color: c }}><I size={20} /></span>
            <div>
              <span className="muted">{t}</span>
              <strong>{v}</strong>
              {sub && <small className="muted">{sub}</small>}
            </div>
          </div>
        ))}
      </div>

      {stats.total === 0 ? (
        <div className="card empty">
          <span className="empty-icon"><Briefcase size={28} /></span>
          <h3>No applications yet</h3>
          <p className="muted">Add your first application to unlock charts and stats.</p>
          <Link to="/applications" className="btn"><Plus size={16} /> Add your first application</Link>
        </div>
      ) : (
        <>
          <div className="charts">
            <div className="card">
              <h3>Status breakdown</h3>
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie data={chart.filter((d) => d.value > 0)} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={3} stroke="none">
                    {chart.filter((d) => d.value > 0).map((d) => <Cell key={d.key} fill={STATUS_COLORS[d.key]} />)}
                  </Pie>
                  <Tooltip contentStyle={tip} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3>Pipeline</h3>
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tip} cursor={{ fill: "var(--hover)" }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chart.map((d) => <Cell key={d.key} fill={STATUS_COLORS[d.key]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="charts">
            <div className="card">
              <div className="row-between"><h3>Recent applications</h3><Link to="/applications">View all</Link></div>
              <div className="list">
                {apps.slice(0, 5).map((a) => (
                  <div className="list-row" key={a.id}>
                    <Avatar name={a.company} />
                    <div className="grow"><strong>{a.company}</strong><div className="muted small">{a.jobTitle}</div></div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="row-between"><h3>Follow-ups due</h3><CalendarClock size={18} className="muted" /></div>
              {due.length === 0 ? (
                <p className="muted">All caught up. No follow-ups due right now.</p>
              ) : (
                <div className="list">
                  {due.slice(0, 5).map((a) => (
                    <div className="list-row" key={a.id}>
                      <Avatar name={a.company} />
                      <div className="grow"><strong>{a.company}</strong><div className="muted small">{a.jobTitle}</div></div>
                      <span className="due">{fmtDate(a.followUpDate)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
