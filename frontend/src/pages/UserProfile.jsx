import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

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

function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get(`/auth/users/${id}`);
        if (!cancelled) setProfile(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.msg || "Could not load user profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" aria-hidden="true" />
        Loading profile...
      </p>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800" role="alert">
          {error}
        </p>
        <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/">
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(160deg,_rgba(255,255,255,0.92),_rgba(240,253,244,0.94)_54%,_rgba(255,247,237,0.92)_100%)] p-8 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.55)]">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Community member</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-slate-950">User profile</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          View the public details this member has shared with the campus community.
        </p>
      </section>

      {profile && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-[1.75rem] bg-[linear-gradient(135deg,_#f59e0b,_#059669)] font-serif text-3xl font-semibold text-white shadow-[0_18px_38px_-20px_rgba(15,23,42,0.5)]">
                {(profile.name || "M").trim().charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                  {profile.name || "Member"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {profile.course || profile.department
                    ? [profile.course, profile.department].filter(Boolean).join(" | ")
                    : "Lost and Found community member"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Public details</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Department" value={profile.department} />
              <ProfileField label="Course" value={profile.course} />
              <ProfileField label="Year" value={yearLabels[profile.year] || profile.year} />
              <ProfileField label="Phone" value={profile.phone} />
              <ProfileField label="Bio" value={profile.bio} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
