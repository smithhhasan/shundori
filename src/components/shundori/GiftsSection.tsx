import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { appData, STORAGE } from "@/data/shundori-data";

export default function GiftsSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [openId, setOpenId] = useState<number | null>(null);
  const openGift = openId !== null ? appData.gifts.find((g) => g.id === openId) : null;

  return (
    <div className="px-5 pt-2 pb-4">
      <p className="text-[13px] mb-5"
        style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
      >
        Surprises made for you.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {appData.gifts.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenId(g.id)}
            className="p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer bg-transparent border-none aspect-[4/3]"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
          >
            <span className="text-2xl mb-2">{g.emoji}</span>
            <p className="text-[13px] font-semibold"
              style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}
            >
              {g.title}
            </p>
            <p className="text-[10px] mt-1"
              style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}
            >
              Tap to open
            </p>
          </motion.button>
        ))}
      </div>

      {/* Gift modal */}
      <AnimatePresence>
        {openGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-8"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-[300px] rounded-3xl p-8 text-center"
              style={{
                background: isDark ? "rgba(30,30,30,0.98)" : "rgba(255,255,255,0.98)",
                backdropFilter: "blur(40px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenId(null)}
                className="absolute top-4 right-4 p-1 cursor-pointer bg-transparent border-none"
                style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-4xl block mb-3">{openGift.emoji}</span>
              <p className="text-base font-semibold mb-2"
                style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}
              >
                {openGift.title}
              </p>
              <p className="text-[13px] leading-relaxed"
                style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
              >
                {openGift.message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
