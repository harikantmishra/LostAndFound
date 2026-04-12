import { Link, NavLink, useNavigate } from "react-router-dom";
import iipsLogo from "../assets/iips_logo.png";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    [
      "rounded-full px-4 py-2 text-sm font-semibold transition",
      isActive
        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/20"
        : "text-slate-600 hover:bg-white/80 hover:text-slate-900",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-4 rounded-[1.75rem] border border-emerald-100 bg-white/80 px-3 py-2 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.75)] transition hover:border-emerald-200 hover:bg-white"
        >
          <span
            className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-emerald-200 bg-[linear-gradient(160deg,_rgba(255,255,255,0.98),_rgba(220,252,231,0.75))] p-1"
            aria-hidden="true"
          >
            <img src={iipsLogo} alt="" className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-lg font-semibold tracking-[-0.03em] text-slate-950">
              Lost &amp; Found
            </span>
            <span className="mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.28em] text-emerald-700">
              IIPS DAVV
            </span>
          </span>
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-2 lg:max-w-3xl"
          aria-label="Main"
        >
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/post" className={linkClass}>
                Post item
              </NavLink>
              <NavLink to="/my-claims" className={linkClass}>
                My claims
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <span className="inline-flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="8" r="4" />
                  </svg>
                  <span>My profile</span>
                </span>
              </NavLink>
            </>
          )}
          {!isLoggedIn ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <button
              type="button"
              className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
              onClick={handleLogout}
            >
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
