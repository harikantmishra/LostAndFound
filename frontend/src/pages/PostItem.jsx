import { useState, useEffect } from "react";
import { motion } from "motion/react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { pageReveal, sectionStagger } from "../utils/motion";

function PostItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const itemToEdit = location.state?.item || null;

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "lost",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (itemToEdit) {
      setForm({
        title: itemToEdit.title,
        description: itemToEdit.description,
        location: itemToEdit.location,
        type: itemToEdit.type,
        image: null,
      });
      setEditingId(itemToEdit._id);
    }
  }, [itemToEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("type", form.type);

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId ? `/items/${editingId}` : "/items";
      const method = editingId ? "put" : "post";

      await API({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast(
        editingId
          ? "Item updated successfully"
          : "Listing published - thanks for helping the community."
      );

      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="mx-auto max-w-4xl space-y-8" variants={sectionStagger} initial="hidden" animate="visible">
      <motion.div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(236,253,245,0.92)_52%,_rgba(255,247,237,0.88)_100%)] px-6 py-8 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.5)] sm:px-8" variants={pageReveal}>
        <span className="inline-flex rounded-full bg-slate-900 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
          {editingId ? "Edit listing" : "New listing"}
        </span>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-slate-950">
          {editingId ? "Edit item" : "Post an item"}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Add details so others can recognize what was lost or found.
        </p>
      </motion.div>

      <motion.div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)] sm:p-7" variants={pageReveal}>
        <form className="space-y-5" onSubmit={submit}>
          <div className="space-y-2">
            <label htmlFor="post-title" className="text-sm font-semibold text-slate-700">
              Title
            </label>
            <input
              id="post-title"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              placeholder="e.g. Blue backpack"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="post-desc" className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              id="post-desc"
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              placeholder="Color, brand, distinguishing marks..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="post-loc" className="text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                id="post-loc"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                placeholder="Where it was lost or found"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="post-type" className="text-sm font-semibold text-slate-700">
                Type
              </label>
              <select
                id="post-type"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="post-image" className="text-sm font-semibold text-slate-700">
              Upload image {editingId && "(optional)"}
            </label>

            {itemToEdit?.image && !form.image && (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-3 text-sm font-medium text-slate-500">Current image</p>
                <img
                  src={itemToEdit.image}
                  alt="Current"
                  className="max-h-64 w-full rounded-2xl object-cover"
                />
              </div>
            )}

            <input
              id="post-image"
              className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
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
            {loading
              ? editingId
                ? "Updating..."
                : "Publishing..."
              : editingId
                ? "Update Item"
                : "Publish listing"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default PostItem;
