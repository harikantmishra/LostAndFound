import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { getUserIdFromToken } from "../utils/jwt";

function ItemCard({ item }) {
  const [imgFailed, setImgFailed] = useState(false);
  const navigate = useNavigate();

  const myId = getUserIdFromToken();
  const ownerId = item?.user?._id
    ? String(item.user._id)
    : item?.user
      ? String(item.user)
      : null;
  const isOwner = Boolean(myId && ownerId && myId === ownerId);

  const type = (item.type || "").toLowerCase();
  const badgeLabel = type === "found" ? "Found" : "Lost";
  const isResolved = item.status === "claimed";
  const posterId = item?.user?._id || (typeof item?.user === "string" ? item.user : null);
  const posterName = item?.user?.name || item?.user?.email || "Member";
  const showImage = Boolean(item.image) && !imgFailed;
  const shortDescription =
    item.description && item.description.length > 92
      ? `${item.description.slice(0, 92)}...`
      : item.description;
  const createdAt = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.95))] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_75px_-34px_rgba(15,23,42,0.5)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-20 rounded-b-[2rem] bg-gradient-to-b from-white/80 to-transparent opacity-70" />
      <div
        className="relative aspect-[5/3] cursor-pointer overflow-hidden bg-[linear-gradient(160deg,_#e7f3ee_0%,_#d7e4ef_50%,_#c9d6e6_100%)]"
        onClick={() => navigate(`/item/${item._id}`)}
      >
        {showImage ? (
          <>
            <img
              src={item.image}
              alt={item.title || "Listing photo"}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-900/5 to-transparent" />
          </>
        ) : (
          <div
            className={`grid h-full w-full place-items-center text-5xl font-serif font-semibold ${
              type === "found" ? "text-emerald-700/40" : "text-rose-700/35"
            }`}
            aria-hidden="true"
          >
            {badgeLabel.slice(0, 1)}
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span
            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] backdrop-blur-sm ${
              type === "found"
                ? "border-emerald-200/70 bg-emerald-100/90 text-emerald-900"
                : "border-rose-200/70 bg-rose-100/90 text-rose-900"
            }`}
          >
            {badgeLabel}
          </span>
          {isResolved && (
            <span className="rounded-full border border-white/20 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              Resolved
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                {item.location || "Location not set"}
              </p>
              <h3 className="mt-2 line-clamp-2 font-serif text-xl font-semibold leading-tight tracking-[-0.03em] text-white">
                {item.title}
              </h3>
            </div>
            <span className="shrink-0 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition group-hover:bg-white/20">
              Open
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {createdAt && <span>{createdAt}</span>}
          {posterId && <span className="text-slate-300">•</span>}
          {posterId && <span>Posted by {posterName}</span>}
        </div>
        {shortDescription && (
          <p className="text-sm leading-6 text-slate-600">{shortDescription}</p>
        )}

        {posterId && (
          <p className="text-sm text-slate-500">
            View profile of{" "}
            <button
              type="button"
              onClick={() => navigate(`/users/${posterId}`)}
              className="bg-transparent p-0 font-semibold text-amber-700 transition hover:text-amber-800"
            >
              {posterName}
            </button>
          </p>
        )}

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            onClick={() => navigate(`/item/${item._id}`)}
          >
            View details
          </button>

          {isOwner && (
            <button
              className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-700"
              onClick={() => navigate("/post", { state: { item } })}
            >
              Edit
            </button>
          )}

          {isOwner && (
            <button
              className="rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              onClick={async () => {
                if (!window.confirm("Delete this item?")) return;

                try {
                  await API.delete(`/items/${item._id}`);
                  alert("Deleted successfully");
                  window.location.reload();
                } catch {
                  alert("Delete failed");
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ItemCard;
