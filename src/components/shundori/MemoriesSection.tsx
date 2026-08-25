import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Edit3, Check, X } from "lucide-react";
import { type Memory, STORAGE } from "@/data/shundori-data";

const STORAGE_KEY = "shundori:memories";

function loadAll(): Memory[] { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveAll(items: Memory[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

export default function MemoriesSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [memories, setMemories] = useState<Memory[]>(loadAll);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const viewing = viewId !== null ? memories.find((m) => m.id === viewId) : null;

  const add = () => {
    if (!title.trim()) return;
    const m: Memory = { id: Date.now(), title: title.trim(), description: desc.trim(), date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), emoji: "✨" };
    const next = [...memories, m];
    setMemories(next);
    saveAll(next);
    setTitle(""); setDesc(""); setShowAdd(false);
  };

  const remove = (id: number) => {
    const next = memories.filter((m) => m.id !== id);
    setMemories(next);
    saveAll(next);
    setViewId(null);
  };

  const startEdit = (m: Memory) => { setEditId(m.id); setEditTitle(m.title); setEditDesc(m.description); };
  const saveEdit = () => {
    if (editId === null) return;
    const next = memories.map((m) => m.id === editId ? { ...m, title: editTitle, description: editDesc } : m);
    setMemories(next);
    saveAll(next);
    setEditId(null);
  };

  // Detail/edit view
  if (viewing) {
    const isEditing = editId === viewing.id;
    return (
      <div className="min-h-full px-5 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setViewId(null); setEditId(null); }} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="text-[13px] flex-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Memory</p>
          {!isEditing && (
            <button onClick={() => startEdit(viewing)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Edit">
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => remove(viewing.id)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "#ef4444" }} aria-label="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{viewing.emoji}</span>
            <p className="text-[10px]" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>{viewing.date}</p>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-base font-semibold border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={6}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none resize-none"
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
              <h2 className="text-lg font-semibold mb-3" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{viewing.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{viewing.description}</p>
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
        <p className="text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Your memories.</p>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Add memory">
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
              <button onClick={add} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none"
                style={{ background: "var(--accent-color, #d99aa3)" }}>Add Memory</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {memories.length === 0 && !showAdd && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-sm font-medium mb-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>No memories yet</p>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>Tap + to add your first memory</p>
        </motion.div>
      )}

      <div className="space-y-3">
        {memories.map((m, i) => (
          <motion.button key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => setViewId(m.id)}
            className="w-full text-left p-4 rounded-2xl cursor-pointer bg-transparent border-none"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{m.title}</p>
                  <p className="text-[10px] shrink-0 ml-2" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>{m.date}</p>
                </div>
                <p className="text-[13px] truncate" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{m.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
