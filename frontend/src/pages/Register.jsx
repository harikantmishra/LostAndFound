import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { pageReveal, sectionStagger } from "../utils/motion";

const yearOptions = [
  { value: "", label: "Select year (optional)" },
  { value: "first", label: "First" },
  { value: "second", label: "Second" },
  { value: "third", label: "Third" },
  { value: "fourth", label: "Fourth" },
];

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    course: "",
    year: "",
    phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch {
      setError("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_34rem]" variants={sectionStagger} initial="hidden" animate="visible">
      <motion.div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(160deg,_rgba(255,255,255,0.92),_rgba(240,253,244,0.94)_54%,_rgba(255,247,237,0.92)_100%)] p-8 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.55)]" variants={pageReveal}>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
          Join the board
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-slate-950">
          Create your IIPS lost and found account.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          Add a few details so classmates can trust listings, identify owners,
          and return items with less confusion.
        </p>
      </motion.div>

      <motion.div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]" variants={pageReveal}>
        <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">
          Create account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join to post lost and found items.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="reg-name" className="text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="reg-name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="reg-email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="reg-email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="reg-password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              id="reg-password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              type="password"
              autoComplete="new-password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="reg-department"
                className="text-sm font-semibold text-slate-700"
              >
                Department
              </label>
              <input
                id="reg-department"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                placeholder="Optional"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="reg-course" className="text-sm font-semibold text-slate-700">
                Course
              </label>
              <input
                id="reg-course"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                placeholder="Optional"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="reg-year" className="text-sm font-semibold text-slate-700">
                Year
              </label>
              <select
                id="reg-year"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              >
                {yearOptions.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="reg-phone" className="text-sm font-semibold text-slate-700">
                Phone
              </label>
              <input
                id="reg-phone"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                placeholder="Optional"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="reg-bio" className="text-sm font-semibold text-slate-700">
              Bio
            </label>
            <textarea
              id="reg-bio"
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              placeholder="Optional short intro"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
            />
          </div>
          {error && (
            <div
              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
              role="alert"
            >
              {error}
            </div>
          )}
          <button
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/login">
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.section>
  );
}

export default Register;
