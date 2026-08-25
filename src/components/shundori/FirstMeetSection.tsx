import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Edit3, Check } from "lucide-react";
import { type FirstMeetItem, STORAGE } from "@/data/shundori-data";

const STORAGE_KEY = "shundori:firstMeet";

function loadAll(): FirstMeetItem[] { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveAll(items: FirstMeetItem[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

export default function FirstMeetSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [items, setItems] = useState<FirstMeetItem[]>(loadAll);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [date, setDate] = useState("");
  const [editDate, setEditDate] = useState("");

  const viewing = viewId !== null ? items.find((item) => item.id === viewId) : null;

  const add = () => {
    if (!title.trim()) return;
    const dateStr = date.trim() || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const item: FirstMeetItem = { id: Date.now(), title: title.trim(), date: dateStr, description: desc.trim() };
    const next = [...items, item];
    setItems(next);
    saveAll(next);
    setTitle(""); setDesc(""); setDate(""); setShowAdd(false);
  };

  const remove = (id: number) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    saveAll(next);
    setViewId(null);
  };

  const startEdit = (item: FirstMeetItem) => { setEditId(item.id); setEditTitle(item.title); setEditDesc(item.description); setEditDate(item.date); };
  const saveEdit = () => {
    if (editId === null) return;
    const next = items.map((item) => item.id === editId ? { ...item, title: editTitle, description: editDesc, date: editDate || item.date } : item);
    setItems(next);
    saveAll(next);
    setEditId(null);
  };

  // Detail view
  if (viewing) {
    const isEditing = editId === viewing.id;
    return (
      <div className="px-5 pt-2 pb-4 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setViewId(null); setEditId(null); }} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="text-[13px] flex-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>First Meet</p>
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
          <p className="text-[10px] font-medium mb-2" style={{ color: "var(--accent-color, #d99aa3)" }}>{viewing.date}</p>

          {isEditing ? (
            <div className="space-y-3">
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-base font-semibold border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={6}
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
              <p className="text-sm leading-relaxed break-words overflow-hidden" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", wordBreak: "break-word", overflowWrap: "break-word" }}>{viewing.description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[13px] italic" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Where the story started.</p>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Add entry">
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
              <input type="text" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <input type="text" placeholder="Date (e.g. Jan 2023)" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <button onClick={add} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none"
                style={{ background: "var(--accent-color, #d99aa3)" }}>Add to Timeline</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {items.length === 0 && !showAdd && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-sm font-medium mb-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>No entries yet</p>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>Tap + to add your first moment</p>
        </motion.div>
      )}

      {items.length > 0 && (
        <div className="relative ml-3">
          <div className="absolute left-0 top-2 bottom-2 w-[1.5px] rounded-full"
            style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
          <div className="space-y-6">
            {items.map((item, i) => (
              <motion.button key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }} onClick={() => setViewId(item.id)}
                className="relative pl-6 text-left w-full bg-transparent border-none cursor-pointer">
                <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[3px] rounded-full"
                  style={{ background: "var(--accent-color, #e8a0b4)" }} />
                <div className="p-4 rounded-2xl"
                  style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
                  <p className="text-[10px] font-medium mb-1" style={{ color: "var(--accent-color, #e8a0b4)" }}>{item.date}</p>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{item.title}</p>
                  <p className="text-[13px] truncate" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{item.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
