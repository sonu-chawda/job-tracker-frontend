import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext.jsx";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([api.get("/api/admin/stats"), api.get("/api/admin/users")])
      .then(([s, u]) => { setStats(s.data); setUsers(u.data); })
      .catch((e) => setError(errMsg(e)));

  useEffect(() => { if (user.role === "ADMIN") load(); }, []);

  const toggle = async (id) => {
    try {
      await api.patch(`/api/admin/users/${id}/toggle-active`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (user.role !== "ADMIN") return <div className="alert">Only admins can view this page.</div>;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Admin</h1>
          <p className="muted">Manage users and see platform stats.</p>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      {stats && (
        <div className="cards two">
          <div className="card stat"><div><span className="muted">Total users</span><strong>{stats.totalUsers}</strong></div></div>
          <div className="card stat"><div><span className="muted">Total applications</span><strong>{stats.totalApplications}</strong></div></div>
        </div>
      )}
      <div className="card">
        <h3>Users</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th className="right">Action</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className="badge" style={u.active ? { background: "#16a34a1a", color: "#16a34a" } : { background: "#ef44441a", color: "#ef4444" }}>
                      {u.active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="right">
                    {u.email !== user.email && (
                      <button className={"link" + (u.active ? " danger" : "")} onClick={() => toggle(u.id)}>
                        {u.active ? "Block" : "Unblock"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
