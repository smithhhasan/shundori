import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { appData, type Jhogra, STORAGE } from "@/data/shundori-data";

const STORAGE_KEY = "shundori:customJhogra";

function loadCustom(): Jhogra[] { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveCustom(items: Jhogra[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

export default function JhograSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [custom, setCustom] = useState<Jhogra[]>(loadCustom);
  const [open, setOpen] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const all = [...appData.jhogra, ...custom];

  const add = () => {
    if (!title.trim()) return;
    const j: Jhogra = { id: Date.now(), title: title.trim(), description: desc.trim(), emoji: "💬" };
    const next = [...custom, j];
    setCustom(next);
    saveCustom(next);
    setTitle(""); setDesc(""); setShowAdd(false);
  };

  const remove = (id: number) => {
    const next = custom.filter((j) => j.id !== id);
    setCustom(next);
    saveCustom(next);
  };

  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>The fun moments.</p>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Add jhogra">
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
              <input type="text" placeholder="What happened?" value={desc} onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }} />
              <button onClick={add} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none"
                style={{ background: "var(--accent-color, #d99aa3)" }}>Add Jhogra</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {all.map((j, i) => (
          <motion.div key={j.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="relative">
            <button onClick={() => setOpen(open === j.id ? null : j.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer bg-transparent border-none text-left"
              style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
              <span className="text-base">{j.emoji}</span>
              <p className="flex-1 text-[13px] font-medium" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{j.title}</p>
              <motion.span animate={{ rotate: open === j.id ? 45 : 0 }}
                className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>+</motion.span>
            </button>
            <AnimatePresence>
              {open === j.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-4 pb-3 flex items-start justify-between">
                    <p className="text-[13px] flex-1" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{j.description}</p>
                    {custom.some((c) => c.id === j.id) && (
                      <button onClick={(e) => { e.stopPropagation(); remove(j.id); }}
                        className="p-1.5 rounded-lg cursor-pointer bg-transparent border-none ml-2 shrink-0"
                        style={{ color: "#ef4444" }} aria-label="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
