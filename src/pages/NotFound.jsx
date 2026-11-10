import { Link } from "react-router-dom";
import { NotFoundArt } from "../components/Illustrations.jsx";

export default function NotFound() {
  return (
    <div className="notfound">
      <NotFoundArt />
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist or was moved.</p>
      <Link to="/" className="btn">Go home</Link>
    </div>
  );
}
