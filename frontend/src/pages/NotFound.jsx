import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-[linear-gradient(160deg,_rgba(255,255,255,0.92),_rgba(240,253,244,0.92)_54%,_rgba(255,247,237,0.9)_100%)] px-8 py-12 text-center shadow-[0_28px_80px_-48px_rgba(15,23,42,0.55)]">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">404</p>
      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        That URL does not exist. Head back to the board and keep exploring.
      </p>
      <div className="mt-8">
        <Link
          className="inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          to="/"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
