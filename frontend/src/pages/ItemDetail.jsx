import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../hooks/useToast";
import { getUserIdFromToken } from "../utils/jwt";
import { cardHover, pageReveal, sectionStagger } from "../utils/motion";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [claims, setClaims] = useState([]);
  const [myClaim, setMyClaim] = useState(undefined);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimsLoaded, setClaimsLoaded] = useState(false);

  const myId = getUserIdFromToken();
  const ownerId = item?.user?._id
    ? String(item.user._id)
    : item?.user
      ? String(item.user)
      : null;
  const isOwner = Boolean(myId && ownerId && myId === ownerId);

  const loadItem = useCallback(async () => {
    const res = await API.get(`/items/${id}`);
    setItem(res.data);
  }, [id]);

  const loadClaimData = useCallback(async () => {
    setClaimsLoaded(false);
    if (!myId || !item) {
      setClaims([]);
      setMyClaim(null);
      setClaimsLoaded(true);
      return;
    }
    try {
      if (isOwner) {
        const res = await API.get(`/items/${id}/claims`);
        setClaims(Array.isArray(res.data) ? res.data : []);
        setMyClaim(null);
      } else {
        const res = await API.get(`/items/${id}/claims/me`);
        setMyClaim(res.data);
        setClaims([]);
      }
    } catch {
      setClaims([]);
      setMyClaim(null);
    } finally {
      setClaimsLoaded(true);
    }
  }, [id, myId, item, isOwner]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setError("");
      setLoading(true);
      setClaimsLoaded(false);
      try {
        const res = await API.get(`/items/${id}`);
        if (!cancelled) setItem(res.data);
      } catch {
        if (!cancelled) setError("Could not load this listing.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!item) return;
    loadClaimData();
  }, [item, loadClaimData]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing permanently?")) return;
    setBusy(true);
    try {
      await API.delete(`/items/${id}`);
      toast("Listing deleted.");
      navigate("/");
    } catch (err) {
      toast(err.response?.data?.msg || "Could not delete.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleMarkResolved = async () => {
    setBusy(true);
    try {
      const res = await API.put(`/items/${id}`);
      setItem(res.data);
      toast("Marked as resolved.");
    } catch (err) {
      toast(err.response?.data?.msg || "Could not update.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!claimMessage.trim()) {
      toast("Please add a short message for the owner.", "error");
      return;
    }
    setBusy(true);
    try {
      await API.post(`/items/${id}/claims`, { message: claimMessage.trim() });
      setClaimMessage("");
      toast("Claim request sent.");
      await loadItem();
      await loadClaimData();
    } catch (err) {
      toast(err.response?.data?.msg || "Could not submit claim.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleClaimDecision = async (claimId, status) => {
    setBusy(true);
    try {
      await API.patch(`/claims/${claimId}`, { status });
      toast(
        status === "approved"
          ? "Claim approved. Listing marked resolved."
          : "Claim rejected."
      );
      await loadItem();
      await loadClaimData();
    } catch (err) {
      toast(err.response?.data?.msg || "Could not update claim.", "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <p className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" aria-hidden="true" />
        Loading...
      </p>
    );
  }

  if (error || !item) {
    return (
      <div className="space-y-4 rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800" role="alert">
          {error || "Listing not found."}
        </p>
        <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/">
          Back to listings
        </Link>
      </div>
    );
  }

  const type = (item.type || "").toLowerCase();
  const isResolved = item.status === "claimed";
  const posterName = item.user?.name || item.user?.email || "Member";
  const returnedName = item.returnedTo?.name || item.returnedTo?.email || null;
  const canShowClaimForm =
    claimsLoaded &&
    myId &&
    !isOwner &&
    !isResolved &&
    (!myClaim || myClaim.status === "rejected");
  const showClaimPending = myClaim?.status === "pending";

  return (
    <motion.div className="space-y-6" variants={sectionStagger} initial="hidden" animate="visible">
      <motion.nav className="flex items-center gap-2 text-sm text-slate-500" variants={pageReveal}>
        <Link className="font-medium text-emerald-700 hover:text-emerald-800" to="/">
          Listings
        </Link>
        <span>/</span>
        <span className="truncate text-slate-700">{item.title}</span>
      </motion.nav>

      <motion.div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]" variants={pageReveal}>
        <motion.div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.5)]" whileHover={cardHover}>
          <div className="relative aspect-[4/3] bg-[linear-gradient(160deg,_#e7f3ee_0%,_#d7e4ef_50%,_#c9d6e6_100%)]">
            {item.image ? (
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className={`grid h-full w-full place-items-center text-6xl font-serif font-semibold ${
                type === "found" ? "text-emerald-700/35" : "text-rose-700/30"
              }`} aria-hidden="true">
                {type === "found" ? "F" : "L"}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div className="space-y-5 rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]" whileHover={cardHover}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] ${
                type === "found"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}>
                {type === "found" ? "Found" : "Lost"}
              </span>
              {isResolved && (
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Resolved
                </span>
              )}
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-slate-950">
              {item.title}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {item.location || "Not specified"}
            </p>
            <p className="text-base leading-7 text-slate-600">
              {item.description || "No description provided."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            <p>
              Posted by{" "}
              {item?.user?._id ? (
                <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to={`/users/${item.user._id}`}>
                  {posterName}
                </Link>
              ) : (
                <strong className="text-slate-900">{posterName}</strong>
              )}
            </p>
            {isResolved && returnedName && (
              <p className="mt-2 rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-800">
                Returned to <strong>{returnedName}</strong> through an approved claim.
              </p>
            )}
          </div>

          {isOwner && claimsLoaded && (
            <section className="space-y-4 border-t border-slate-200 pt-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Claim requests ({claims.length})
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review requests from students who believe this item is theirs.
                </p>
              </div>
              {claims.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-500">
                  No claim requests yet. When someone submits one, it will appear here.
                </div>
              ) : (
                <ul className="space-y-4">
                  {claims.map((c) => (
                    <li key={c._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <strong className="text-slate-900">
                          {c.claimant?.name || c.claimant?.email || "Someone"}
                        </strong>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                          c.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{c.message}</p>
                      {c.status === "pending" && !isResolved && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                            disabled={busy}
                            onClick={() => handleClaimDecision(c._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-70"
                            disabled={busy}
                            onClick={() => handleClaimDecision(c._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {!isOwner && claimsLoaded && (
            <section className="space-y-4 border-t border-slate-200 pt-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Is this yours?
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Send the owner a clear message with details only the real owner would know.
                </p>
              </div>
              {!myId && (
                <p className="text-sm text-slate-600">
                  <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/login">
                    Log in
                  </Link>{" "}
                  or{" "}
                  <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/register">
                    register
                  </Link>{" "}
                  to send a claim request.
                </p>
              )}
              {myId && isResolved && myClaim?.status !== "approved" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  This listing is resolved, so new claims are closed.
                </div>
              )}
              {myId && claimsLoaded && showClaimPending && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <strong>Your claim is pending.</strong> The owner will review it and you can track updates on{" "}
                  <Link className="font-semibold underline" to="/my-claims">
                    My claims
                  </Link>.
                </div>
              )}
              {myId && claimsLoaded && myClaim?.status === "rejected" && !isResolved && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Your previous claim was rejected. You can submit a new one with better identifying details.
                </div>
              )}
              {myId && claimsLoaded && myClaim?.status === "approved" && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Your claim was <strong>approved</strong>. Coordinate the handover with the poster.
                </div>
              )}
              {canShowClaimForm && (
                <form className="space-y-4" onSubmit={handleSubmitClaim}>
                  <label className="block space-y-2" htmlFor="claim-msg">
                    <span className="text-sm font-semibold text-slate-700">
                      Tell the owner why this item is yours
                    </span>
                    <textarea
                      id="claim-msg"
                      className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                      rows={4}
                      value={claimMessage}
                      onChange={(e) => setClaimMessage(e.target.value)}
                      placeholder="e.g. serial number, what was inside, a unique scratch, or another private detail"
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                    disabled={busy}
                  >
                    {busy ? "Sending..." : "Send claim request"}
                  </button>
                </form>
              )}
            </section>
          )}

          {isOwner && (
            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
              {!isResolved && (
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={handleMarkResolved}
                  disabled={busy}
                >
                  Mark as resolved
                </button>
              )}
              <button
                type="button"
                className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-70"
                onClick={handleDelete}
                disabled={busy}
              >
                Delete listing
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ItemDetail;
