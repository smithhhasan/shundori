import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Edit3, Check, X } from "lucide-react";
import { type Gift, STORAGE } from "@/data/shundori-data";

const STORAGE_KEY = "shundori:gifts";

function loadAll(): Gift[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return [];
}

function saveAll(items: Gift[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function GiftsSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [gifts, setGifts] = useState<Gift[]>(loadAll);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editDate, setEditDate] = useState("");

  const viewing = viewId !== null ? gifts.find((g) => g.id === viewId) : null;

  const add = () => {
    if (!title.trim()) return;
    const dateStr = date.trim() || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const g: Gift = { id: Date.now(), title: title.trim(), message: message.trim(), emoji: "🎁", date: dateStr };
    const next = [...gifts, g];
    setGifts(next);
    saveAll(next);
    setTitle(""); setMessage(""); setDate(""); setShowAdd(false);
  };

  const remove = (id: number) => {
    const next = gifts.filter((g) => g.id !== id);
    setGifts(next);
    saveAll(next);
    setViewId(null);
  };

  const startEdit = (g: Gift) => { setEditId(g.id); setEditTitle(g.title); setEditMessage(g.message); setEditDate(g.date); };
  const saveEdit = () => {
    if (editId === null) return;
    const next = gifts.map((g) => g.id === editId ? { ...g, title: editTitle, message: editMessage, date: editDate || g.date } : g);
    setGifts(next);
    saveAll(next);
    setEditId(null);
  };

  // Detail/edit view
  if (viewing) {
    const isEditing = editId === viewing.id;
    return (
      <div className="px-5 pt-2 pb-4 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setViewId(null); setEditId(null); }} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="text-[13px] flex-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Gift</p>
          {!isEditing && (
            <button onClick={() => startEdit(viewing)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Edit">
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => remove(viewing.id)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "#ef4444" }} aria-label="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 rounded-2xl overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{viewing.emoji}</span>
            <p className="text-[10px]" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>{viewing.date}</p>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-base font-semibold border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <textarea value={editMessage} onChange={(e) => setEditMessage(e.target.value)} rows={6}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none resize-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <input type="text" placeholder="Date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none"
                  style={{ background: "var(--accent-color, #d99aa3)" }}><Check className="w-4 h-4 inline mr-1" />Save</button>
                <button onClick={() => setEditId(null)} className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer bg-transparent border-none"
                  style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-3 break-words" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e", wordBreak: "break-word" }}>{viewing.title}</h2>
              <p className="text-sm leading-relaxed break-words overflow-hidden" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", wordBreak: "break-word", overflowWrap: "break-word" }}>{viewing.message}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Surprises for you.</p>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Add gift">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4">
            <div className="p-4 rounded-2xl space-y-3" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <input type="text" placeholder="Date (e.g. 15 Jan 2024)" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <button onClick={add} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none"
                style={{ background: "var(--accent-color, #d99aa3)" }}>Add Gift</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {gifts.length === 0 && !showAdd && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-sm font-medium mb-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>No gifts yet</p>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>Tap + to add a surprise</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {gifts.map((g, i) => (
          <motion.button key={g.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }} whileTap={{ scale: 0.95 }}
            onClick={() => setViewId(g.id)}
            className="p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer bg-transparent border-none aspect-[4/3]"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
            <span className="text-2xl mb-2">{g.emoji}</span>
            <p className="text-[13px] font-semibold" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{g.title}</p>
            <p className="text-[10px] mt-1" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>{g.date}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
