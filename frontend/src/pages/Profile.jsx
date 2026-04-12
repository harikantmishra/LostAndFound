import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { cardHover, pageReveal, sectionStagger } from "../utils/motion";

const yearLabels = {
  first: "First year",
  second: "Second year",
  third: "Third year",
  fourth: "Fourth year",
};

function ProfileField({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <div className="mt-2 text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    department: "",
    course: "",
    year: "",
    phone: "",
    bio: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/auth/me");
        if (cancelled) return;

        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          department: res.data.department || "",
          course: res.data.course || "",
          year: res.data.year || "",
          phone: res.data.phone || "",
          bio: res.data.bio || "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.msg || "Could not load your profile. Please log in again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      department: profile.department || "",
      course: profile.course || "",
      year: profile.year || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
    });
    setEditing(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await API.put("/auth/me", form);
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        department: res.data.department || "",
        course: res.data.course || "",
        year: res.data.year || "",
        phone: res.data.phone || "",
        bio: res.data.bio || "",
      });
      setEditing(false);
    } catch (err) {
      setError(err?.response?.data?.msg || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <motion.p
        className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" aria-hidden="true" />
        Loading profile...
      </motion.p>
    );
  }

  if (error && !profile) {
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
      <motion.section
        className="rounded-[2rem] border border-white/80 bg-[linear-gradient(160deg,_rgba(255,255,255,0.92),_rgba(240,253,244,0.94)_54%,_rgba(255,247,237,0.92)_100%)] p-8 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.55)]"
        variants={pageReveal}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="grid h-20 w-20 place-items-center rounded-[1.75rem] bg-[linear-gradient(135deg,_#f59e0b,_#059669)] font-serif text-3xl font-semibold text-white shadow-[0_18px_38px_-20px_rgba(15,23,42,0.5)]"
              whileHover={{ scale: 1.04, rotate: -2 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              {(profile?.name || "M").trim().charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Account</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                {profile?.name || "Member"}
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                {profile?.course || profile?.department
                  ? [profile.course, profile.department].filter(Boolean).join(" | ")
                  : "Keep your profile updated so other students can identify and contact you more easily."}
              </p>
            </div>
          </div>
          {!editing && (
            <motion.button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
              onClick={() => setEditing(true)}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit profile
            </motion.button>
          )}
        </div>
      </motion.section>

      {error && (
        <motion.div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800" role="alert" variants={pageReveal}>
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {editing ? (
          <motion.form
            key="profile-edit"
            className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]"
            onSubmit={handleSubmit}
            variants={pageReveal}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Edit details</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                Update your public profile
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-semibold text-slate-700">Name</label>
                <input id="profile-name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-department" className="text-sm font-semibold text-slate-700">Department</label>
                <input id="profile-department" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white" value={form.department} onChange={(e) => handleChange("department", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-course" className="text-sm font-semibold text-slate-700">Course</label>
                <input id="profile-course" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white" value={form.course} onChange={(e) => handleChange("course", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-year" className="text-sm font-semibold text-slate-700">Year</label>
                <select id="profile-year" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white" value={form.year} onChange={(e) => handleChange("year", e.target.value)}>
                  <option value="">Select year (optional)</option>
                  <option value="first">First</option>
                  <option value="second">Second</option>
                  <option value="third">Third</option>
                  <option value="fourth">Fourth</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="profile-phone" className="text-sm font-semibold text-slate-700">Phone</label>
                <input id="profile-phone" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="profile-bio" className="text-sm font-semibold text-slate-700">Bio</label>
                <textarea id="profile-bio" className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white" rows={4} value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70" type="submit" disabled={saving} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                {saving ? "Saving..." : "Save changes"}
              </motion.button>
              <motion.button className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300" type="button" onClick={handleCancel} disabled={saving} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                Cancel
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="profile-view"
            className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
            variants={pageReveal}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
          >
            <motion.section className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]" whileHover={cardHover}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Identity</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">Profile details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ProfileField label="Email" value={profile?.email} />
                <ProfileField label="Department" value={profile?.department} />
                <ProfileField label="Course" value={profile?.course} />
                <ProfileField label="Year" value={yearLabels[profile?.year] || profile?.year} />
                <ProfileField label="Phone" value={profile?.phone} />
              </div>
            </motion.section>

            <section className="space-y-5">
              <motion.div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]" whileHover={cardHover}>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">About</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">Community intro</h2>
                <p className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  {profile?.bio || "Add a short bio so other students know who they are contacting."}
                </p>
              </motion.div>
              <motion.div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]" whileHover={cardHover}>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Shortcuts</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">Quick links</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800" to="/dashboard">Dashboard</Link>
                  <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800" to="/my-claims">My claims</Link>
                  <Link className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700" to="/post">Post item</Link>
                </div>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Profile;
