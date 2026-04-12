import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/65 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-serif text-base font-semibold text-slate-900">
            Lost &amp; Found
          </span>
          <span aria-hidden="true" className="text-slate-300">
            �
          </span>
          <Link className="transition hover:text-emerald-700" to="/">
            Browse
          </Link>
          <Link className="transition hover:text-emerald-700" to="/post">
            Post
          </Link>
          <Link className="transition hover:text-emerald-700" to="/my-claims">
            My claims
          </Link>
        </div>
        <span className="text-slate-500">Reunite what matters at IIPS.</span>
      </div>
    </footer>
  );
}

export default Footer;
