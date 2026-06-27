import { BrainCircuit, Home, LogOut, UserCircle } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinks = [
  { to: "/programs", label: "Programs" },
  { to: "/enrollment", label: "Enroll Now" },
  { to: "/contact", label: "Contact" }
];

export default function NavBar() {
  const { token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const accountLink = isDashboard
    ? { to: "/", label: "Home", icon: Home }
    : { to: "/dashboard", label: "Dashboard", icon: UserCircle };
  const AccountIcon = accountLink.icon;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 font-bold text-white">
          <span className="grid size-10 place-items-center rounded-lg bg-cyan text-ink">
            <BrainCircuit size={22} aria-hidden="true" />
          </span>
          <span className="text-lg">iTbenuk</span>
        </Link>

        {!token && (
          <div className="order-3 flex w-full items-center justify-center gap-3 text-sm font-bold text-slate-300 sm:order-none sm:w-auto sm:gap-8 sm:text-base">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition hover:text-white ${isActive ? "text-indigo-300" : "text-slate-300"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {token ? (
            <>
              <Link to={accountLink.to} className="btn-secondary px-3 sm:px-4" aria-label={accountLink.label}>
                <AccountIcon size={18} aria-hidden="true" />
                <span className="hidden sm:inline">{accountLink.label}</span>
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary px-3 sm:px-4">
                <LogOut size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-4">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-4">
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
