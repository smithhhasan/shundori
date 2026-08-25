import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appData } from "@/data/shundori-data";

export default function JhograSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-full px-4 py-6 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-1"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        Jhogra
      </motion.h2>
      <p className="text-foreground/40 text-sm mb-6">Our little arguments that were never serious 😄</p>

      <div className="space-y-3">
        {appData.jhogra.map((j, i) => (
          <motion.div
            key={j.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpen(open === j.id ? null : j.id)}
              className="card-glass p-5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{j.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{j.title}</h3>
                </div>
                <motion.span
                  animate={{ rotate: open === j.id ? 45 : 0 }}
                  className="text-foreground/30 text-lg"
                >
                  +
                </motion.span>
              </div>

              <AnimatePresence>
                {open === j.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-foreground/50 text-sm mt-3 pt-3 border-t border-foreground/10 italic leading-relaxed">
                      "{j.description}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
