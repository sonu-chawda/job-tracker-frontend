import { Link } from "react-router-dom";
import { BarChart3, Briefcase, CalendarClock, FileText, LayoutGrid, Sparkles, Wand2 } from "lucide-react";
import { useAuth } from "../AuthContext.jsx";

const features = [
  [LayoutGrid, "Kanban pipeline", "Drag applications from Wishlist to Offer and see every stage at a glance."],
  [Sparkles, "AI resume match", "Get a match score and the exact skills you are missing for each job."],
  [Wand2, "Cover letters and tailoring", "Draft cover letters and tailor your resume without inventing skills."],
  [CalendarClock, "Follow-up reminders", "Never miss a follow-up. Due dates show up right on your dashboard."],
  [BarChart3, "Live analytics", "Charts and success rate that show how your search is going."],
  [FileText, "Interview prep", "Role specific questions generated from your own resume and the job."],
];

const steps = [
  ["1", "Add a job", "Paste the job details and description after you apply on the company site."],
  ["2", "Track every stage", "Move it through Applied, Test, Interview and Offer. History is saved automatically."],
  ["3", "Let AI help", "Match score, cover letter and interview questions in one click."],
];

const MockCard = ({ c, t, co }) => (
  <div className="m-card"><i style={{ background: co }} /><div><b>{c}</b><small>{t}</small></div></div>
);

export default function Landing() {
  const { user } = useAuth();
  const cta = user ? "/dashboard" : "/login";

  return (
    <div className="landing">
      <header className="l-nav">
        <div className="brand"><span className="logo"><Briefcase size={18} /></span> JobTrackr</div>
        <div className="l-nav-actions">
          <Link to={cta} className="btn ghost">{user ? "Open app" : "Login"}</Link>
          {!user && <Link to="/login" className="btn">Get started</Link>}
        </div>
      </header>

      <section className="l-hero">
        <span className="blob b1" /><span className="blob b2" />
        <div className="l-hero-text">
          <span className="pill"><Sparkles size={14} /> AI powered job tracker</span>
          <h1>Land your next job with a <span>smarter</span> search.</h1>
          <p>Track every application, understand how well you match each role and prepare for interviews, all in one clean workspace.</p>
          <div className="l-cta">
            <Link to={cta} className="btn big">Start tracking free</Link>
            <a href="#features" className="btn ghost big">See features</a>
          </div>
        </div>

        <div className="mock">
          <div className="mock-bar"><i /><i /><i /></div>
          <div className="mock-cols">
            <div><h6>Applied</h6><MockCard c="Infosys" t="Java Developer" co="#3b82f6" /><MockCard c="TCS" t="Backend Engineer" co="#3b82f6" /></div>
            <div><h6>Interview</h6><MockCard c="Razorpay" t="SDE 1" co="#8b5cf6" /></div>
            <div><h6>Offer</h6><MockCard c="Zoho" t="Software Engineer" co="#16a34a" /></div>
          </div>
          <div className="mock-float"><b>86%</b><small>Resume match</small></div>
        </div>
      </section>

      <section id="features" className="l-section">
        <h2>Everything you need to stay organised</h2>
        <p className="muted center">Built for freshers who apply to many jobs at once.</p>
        <div className="l-grid">
          {features.map(([Icon, t, d]) => (
            <div className="card feature" key={t}>
              <span className="stat-icon" style={{ background: "#6366f11f", color: "#6366f1" }}><Icon size={20} /></span>
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-section">
        <h2>How it works</h2>
        <div className="l-steps">
          {steps.map(([n, t, d]) => (
            <div className="step" key={n}><span>{n}</span><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="l-final">
        <h2>Ready to organise your job search?</h2>
        <Link to={cta} className="btn light big">Create your free account</Link>
      </section>

      <footer className="l-foot muted">Built with Spring Boot, React and MySQL. JobTrackr is an original project.</footer>
    </div>
  );
}
