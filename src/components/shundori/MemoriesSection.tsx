import { motion } from "framer-motion";
import { appData } from "@/data/shundori-data";

export default function MemoriesSection() {
  const isDark = localStorage.getItem("shundori-dark") === "true";

  return (
    <div className="px-5 pt-2 pb-4">
      <p className="text-[13px] mb-5"
        style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
      >
        The moments that matter most.
      </p>

      <div className="space-y-3">
        {appData.memories.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-2xl"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>
                    {m.title}
                  </p>
                  <p className="text-[10px] shrink-0 ml-2"
                    style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}
                  >
                    {m.date}
                  </p>
                </div>
                <p className="text-[13px]"
                  style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                >
                  {m.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
