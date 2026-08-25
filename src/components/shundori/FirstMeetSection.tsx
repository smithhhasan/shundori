import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { appData, type FirstMeetItem, STORAGE } from "@/data/shundori-data";

const STORAGE_KEY = "shundori:customFirstMeet";

function loadCustom(): FirstMeetItem[] { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveCustom(items: FirstMeetItem[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

export default function FirstMeetSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [custom, setCustom] = useState<FirstMeetItem[]>(loadCustom);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const all = [...appData.firstMeet, ...custom];

  const add = () => {
    if (!title.trim()) return;
    const item: FirstMeetItem = { id: Date.now(), title: title.trim(), date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), description: desc.trim() };
    const next = [...custom, item];
    setCustom(next);
    saveCustom(next);
    setTitle(""); setDesc(""); setShowAdd(false);
  };

  const remove = (id: number) => {
    const next = custom.filter((item) => item.id !== id);
    setCustom(next);
    saveCustom(next);
  };

  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[13px] italic" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Where the story started.</p>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 rounded-xl cursor-pointer bg-transparent border-none" style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Add timeline entry">
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
                style={{ background: "var(--accent-color, #d99aa3)" }}>Add to Timeline</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative ml-3">
        <div className="absolute left-0 top-2 bottom-2 w-[1.5px] rounded-full"
          style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
        <div className="space-y-6">
          {all.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} className="relative pl-6 group">
              <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[3px] rounded-full"
                style={{ background: "var(--accent-color, #e8a0b4)" }} />
              <div className="p-4 rounded-2xl relative"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
                <p className="text-[10px] font-medium mb-1" style={{ color: "var(--accent-color, #e8a0b4)" }}>{item.date}</p>
                <p className="text-sm font-semibold mb-0.5" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{item.title}</p>
                <p className="text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{item.description}</p>
                {custom.some((c) => c.id === item.id) && (
                  <button onClick={() => remove(item.id)} className="absolute top-3 right-3 p-1.5 rounded-lg cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#ef4444" }} aria-label="Delete entry">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
