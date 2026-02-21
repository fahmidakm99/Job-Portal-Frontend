import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Briefcase, Plus } from "lucide-react";
import { Toaster } from "react-hot-toast";""
import "../pages/RootLayout.css";

export function RootLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
 <div className="layout-container">
  <nav className="navbar">
    <div className="navbar-inner">
      <div className="nav-left">
        <Link to="/" className="logo">
          JobRecruit
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link
            to="/jobs"
            className={`nav-link ${isActive("/jobs") ? "active" : ""}`}
          >
            <Briefcase size={16} />
            Jobs
          </Link>
        </div>
      </div>

      <Link to="/add-job" className="post-btn">
        <Plus size={16} />
        Post Job
      </Link>
    </div>
  </nav>

  <nav className="mobile-nav">
    <div className="mobile-nav-inner">
      <Link
        to="/"
        className={`mobile-link ${isActive("/") ? "active" : ""}`}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      <Link
        to="/jobs"
        className={`mobile-link ${isActive("/jobs") ? "active" : ""}`}
      >
        <Briefcase size={18} />
        Jobs
      </Link>
    </div>
  </nav>

  <main className="main-content">
    <Outlet />
  </main>

  <Toaster position="top-right" />
</div>

  );
}
