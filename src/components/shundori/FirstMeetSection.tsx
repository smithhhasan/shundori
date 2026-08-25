import { motion } from "framer-motion";
import { appData, STORAGE } from "@/data/shundori-data";

export default function FirstMeetSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";

  return (
    <div className="px-5 pt-2 pb-4">
      <p className="text-[13px] mb-6 italic"
        style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
      >
        Where the story started.
      </p>

      <div className="relative ml-3">
        {/* Vertical line */}
        <div className="absolute left-0 top-2 bottom-2 w-[1.5px] rounded-full"
          style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
        />

        <div className="space-y-6">
          {appData.firstMeet.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-6"
            >
              {/* Dot */}
              <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[3px] rounded-full"
                style={{ background: "var(--accent-color, #e8a0b4)" }}
              />

              <div className="p-4 rounded-2xl"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
              >
                <p className="text-[10px] font-medium mb-1"
                  style={{ color: "var(--accent-color, #e8a0b4)" }}
                >
                  {item.date}
                </p>
                <p className="text-sm font-semibold mb-0.5"
                  style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}
                >
                  {item.title}
                </p>
                <p className="text-[13px]"
                  style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
