import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { cardHover, pageReveal, sectionStagger } from "../utils/motion";

const statusLabel = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/claims/mine");
        setClaims(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("Could not load your claims.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <motion.p
        className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" aria-hidden="true" />
        Loading your claims...
      </motion.p>
    );
  }

  if (error) {
    return (
      <motion.div
        className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800"
        role="alert"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8" variants={sectionStagger} initial="hidden" animate="visible">
      <motion.section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(236,253,245,0.92)_52%,_rgba(255,247,237,0.9)_100%)] px-6 py-8 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.55)] sm:px-8" variants={pageReveal}>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Activity</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-slate-950">My claim requests</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Track requests you have sent to listing owners and see whether each claim is pending, approved, or rejected.
        </p>
      </motion.section>

      {claims.length === 0 ? (
        <motion.div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center shadow-sm" variants={pageReveal}>
          <p className="m-0 text-base text-slate-500">
            You have not submitted any claims yet. Open a listing and use the claim form if an item is yours.
          </p>
          <p className="mt-4">
            <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/">
              Browse listings
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.ul className="space-y-4" variants={pageReveal}>
          {claims.map((c) => (
            <motion.li
              key={c._id}
              className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]"
              variants={pageReveal}
              whileHover={cardHover}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Link
                  to={`/item/${c.item?._id || c.item}`}
                  className="font-serif text-2xl font-semibold tracking-[-0.03em] text-slate-950 hover:text-emerald-800"
                >
                  {c.item?.title || "Listing"}
                </Link>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                  c.status === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : c.status === "rejected"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                }`}>
                  {statusLabel[c.status] || c.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{c.message}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Submitted {c.createdAt ? new Date(c.createdAt).toLocaleString() : "recently"}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}

export default MyClaims;
