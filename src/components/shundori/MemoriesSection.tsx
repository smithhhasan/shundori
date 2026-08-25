import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { appData, type Memory, STORAGE } from "@/data/shundori-data";

const STORAGE_KEY = "shundori:customMemories";

function loadCustom(): Memory[] { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveCustom(items: Memory[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

export default function MemoriesSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [custom, setCustom] = useState<Memory[]>(loadCustom);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const all = [...appData.memories, ...custom];

  const add = () => {
    if (!title.trim()) return;
    const m: Memory = { id: Date.now(), title: title.trim(), description: desc.trim(), date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), emoji: "✨" };
    const next = [...custom, m];
    setCustom(next);
    saveCustom(next);
    setTitle(""); setDesc(""); setShowAdd(false);
  };

  const remove = (id: number) => {
    const next = custom.filter((m) => m.id !== id);
    setCustom(next);
    saveCustom(next);
  };

  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>The moments that matter most.</p>
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

      <div className="space-y-3">
        {all.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="p-4 rounded-2xl relative group"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{m.title}</p>
                  <p className="text-[10px] shrink-0 ml-2" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>{m.date}</p>
                </div>
                <p className="text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{m.description}</p>
              </div>
            </div>
            {custom.some((c) => c.id === m.id) && (
              <button onClick={() => remove(m.id)} className="absolute top-3 right-3 p-1.5 rounded-lg cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "#ef4444" }} aria-label="Delete memory">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
