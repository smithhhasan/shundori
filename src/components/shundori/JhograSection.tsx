import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appData } from "@/data/shundori-data";

export default function JhograSection() {
  const isDark = localStorage.getItem("shundori-dark") === "true";
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="px-5 pt-2 pb-4">
      <p className="text-[13px] mb-5"
        style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
      >
        The fun moments.
      </p>

      <div className="space-y-2">
        {appData.jhogra.map((j, i) => (
          <motion.div
            key={j.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setOpen(open === j.id ? null : j.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer bg-transparent border-none text-left"
              style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
            >
              <span className="text-base">{j.emoji}</span>
              <p className="flex-1 text-[13px] font-medium" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>
                {j.title}
              </p>
              <motion.span animate={{ rotate: open === j.id ? 45 : 0 }}
                className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
              >+</motion.span>
            </button>

            <AnimatePresence>
              {open === j.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-3 text-[13px]"
                    style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                  >
                    {j.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
