import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appData } from "@/data/shundori-data";

export default function GiftsSection() {
  const [opened, setOpened] = useState<number | null>(null);

  return (
    <div className="min-h-full px-4 py-6 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-1"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        Gifts
      </motion.h2>
      <p className="text-foreground/40 text-sm mb-6">A few little surprises, just for you.</p>

      <div className="grid grid-cols-2 gap-3">
        {appData.gifts.map((g, i) => {
          const isOpen = opened === g.id;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpened(isOpen ? null : g.id)}
              className="relative cursor-pointer"
            >
              <motion.div
                animate={{
                  rotateY: isOpen ? 180 : 0,
                  scale: isOpen ? 1.02 : 1,
                }}
                transition={{ duration: 0.5, type: "spring" }}
                className="card-glass p-5 aspect-[3/4] flex flex-col items-center justify-center text-center"
                style={{ perspective: 800 }}
              >
                {!isOpen ? (
                  <>
                    <span className="text-3xl mb-3">{g.emoji}</span>
                    <p className="font-semibold text-foreground text-sm">{g.title}</p>
                    <p className="text-foreground/30 text-xs mt-1">Tap to open</p>
                  </>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-2xl mb-2 block">{g.emoji}</span>
                      <p className="text-foreground/70 text-xs leading-relaxed italic">
                        "{g.message}"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
