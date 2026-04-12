import { useEffect, useState } from "react";
import { motion } from "motion/react";
import API from "../services/api";
import ItemCard from "../components/ItemCard.jsx";

const heroReveal = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        setError("");
        const params = {};
        if (debounced) params.q = debounced;
        if (typeFilter) params.type = typeFilter;
        const res = await API.get("/items", { params });
        setItems(res.data);
      } catch {
        setError("Failed to load items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [debounced, typeFilter]);

  const setFilter = (value) => {
    setTypeFilter((prev) => (prev === value ? "" : value));
  };

  return (
    <div className="space-y-8">
      <motion.section
        className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(236,253,245,0.92)_52%,_rgba(255,247,237,0.9)_100%)] px-6 py-8 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.55)] sm:px-8 lg:px-10 lg:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute right-0 top-0 h-36 w-36 rounded-full bg-emerald-200/30 blur-3xl"
          animate={{ x: [0, -10, 0], y: [0, 8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-16 h-28 w-28 rounded-full bg-amber-200/30 blur-3xl"
          animate={{ x: [0, 10, 0], y: [0, -8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:items-end"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">
            <motion.span
              className="inline-flex rounded-full bg-slate-900 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white"
              variants={heroReveal}
            >
              Community board
            </motion.span>
            <motion.h1
              className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl"
              variants={heroReveal}
            >
              Find what you lost. Return what someone else is looking for.
            </motion.h1>
            <motion.p
              className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
              variants={heroReveal}
            >
              A cleaner, campus-first lost and found board for IIPS students to
              post, browse, and reconnect important belongings quickly.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-sm"
              variants={heroReveal}
              whileHover={{ y: -6, rotate: -1.2 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                Search faster
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Filter by listing type and narrow results instantly.
              </p>
            </motion.div>
            <motion.div
              className="rounded-3xl border border-white/80 bg-slate-950 p-4 text-white shadow-sm"
              variants={heroReveal}
              whileHover={{ y: -6, rotate: 1.2 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                Built for campus
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Highlight locations, details, and owner contact context.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      <section className="rounded-[1.75rem] border border-white/80 bg-white/80 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <label className="sr-only" htmlFor="board-search">
              Search listings
            </label>
            <input
              id="board-search"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              type="search"
              placeholder="Search title, description, location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
            {[
              { label: "All", value: "" },
              { label: "Lost", value: "lost" },
              { label: "Found", value: "found" },
            ].map((filter) => {
              const active = typeFilter === filter.value;
              return (
                <button
                  key={filter.label}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-800"
                  }`}
                  onClick={() =>
                    filter.value ? setFilter(filter.value) : setTypeFilter("")
                  }
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {loading && (
        <p className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" aria-hidden="true" />
          Loading listings...
        </p>
      )}

      {error && (
        <div
          className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center shadow-sm">
          <p className="m-0 text-base text-slate-500">
            No listings match your filters. Try different search words or clear
            filters.
          </p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </section>
    </div>
  );
}

export default Home;
