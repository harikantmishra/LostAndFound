import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { pageReveal, sectionStagger } from "../utils/motion";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]" variants={sectionStagger} initial="hidden" animate="visible">
      <motion.div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(6,78,59,0.95))] p-8 text-white shadow-[0_32px_80px_-44px_rgba(15,23,42,0.75)]" variants={pageReveal}>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
          Welcome back
        </p>
        <h1 className="mt-4 max-w-md font-serif text-4xl font-semibold tracking-[-0.04em]">
          Sign in and keep the campus network moving.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
          Post new listings, manage claimed items, and help classmates recover
          what matters faster.
        </p>
      </motion.div>

      <motion.div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]" variants={pageReveal}>
        <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">
          Sign in
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Use your account to post and manage your listings.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="login-email"
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
              htmlFor="login-password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              id="login-password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          New here?{" "}
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/register">
            Create an account
          </Link>
        </p>
      </motion.div>
    </motion.section>
  );
}

export default Login;
