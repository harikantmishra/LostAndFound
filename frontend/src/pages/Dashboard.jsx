import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import API from "../services/api";
import ItemCard from "../components/ItemCard.jsx";
import { decodeJwtPayload } from "../utils/jwt";
import { cardHover, pageReveal, sectionStagger } from "../utils/motion";

function Dashboard() {
  const [communityCount, setCommunityCount] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const profile = token ? decodeJwtPayload(token) : null;

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [allRes, mineRes] = await Promise.all([
          API.get("/items"),
          API.get("/items/mine"),
        ]);
        const all = Array.isArray(allRes.data) ? allRes.data : [];
        const mine = Array.isArray(mineRes.data) ? mineRes.data : [];
        setCommunityCount(all.length);
        setMyItems(mine);
      } catch {
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayName = profile?.name || profile?.email || profile?.user?.email || null;

  if (loading) {
    return (
      <p className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" aria-hidden="true" />
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800" role="alert">
        {error}
      </div>
    );
  }

  return (
    <motion.div className="space-y-8" variants={sectionStagger} initial="hidden" animate="visible">
      <motion.section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(6,78,59,0.94)_52%,_rgba(245,158,11,0.85)_180%)] px-6 py-8 text-white shadow-[0_28px_80px_-48px_rgba(15,23,42,0.75)] sm:px-8" variants={pageReveal}>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">Your space</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200">
          {displayName
            ? `Welcome back, ${displayName}. Here is a quick view of your activity on the board.`
            : "Welcome back. Here is a quick view of your activity on the board."}
        </p>
      </motion.section>

      <motion.section className="grid gap-5 md:grid-cols-3" variants={pageReveal}>
        <motion.div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]" whileHover={cardHover}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Community</p>
          <div className="mt-3 font-serif text-4xl font-semibold text-slate-950">{communityCount ?? "-"}</div>
          <p className="mt-2 text-sm text-slate-500">Listings currently visible on the board.</p>
        </motion.div>
        <motion.div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]" whileHover={cardHover}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">Your posts</p>
          <div className="mt-3 font-serif text-4xl font-semibold text-slate-950">{myItems.length}</div>
          <p className="mt-2 text-sm text-slate-500">Listings you have added and can manage.</p>
        </motion.div>
        <motion.div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]" whileHover={cardHover}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-700">Quick actions</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700" to="/post">
              Post item
            </Link>
            <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800" to="/">
              Browse board
            </Link>
          </div>
        </motion.div>
      </motion.section>

      <motion.section className="space-y-5" variants={pageReveal}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Your listings</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              Items you posted
            </h2>
          </div>
        </div>

        {myItems.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center shadow-sm">
            <p className="m-0 text-base text-slate-500">
              You have not posted anything yet. <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/post">Create your first listing</Link>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {myItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

export default Dashboard;
