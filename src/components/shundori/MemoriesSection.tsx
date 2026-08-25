import { motion } from "framer-motion";
import { appData } from "@/data/shundori-data";

export default function MemoriesSection() {
  return (
    <div className="min-h-full px-4 py-6 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-1"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        Memories
      </motion.h2>
      <p className="text-foreground/40 text-sm mb-6">The moments that matter most.</p>

      <div className="space-y-4">
        {appData.memories.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            className="card-glass p-6"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "var(--accent-color, #e8a0b4)18" }}
              >
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground text-base">{m.title}</h3>
                  <span className="text-[10px] text-foreground/30 shrink-0 ml-2">{m.date}</span>
                </div>
                <p className="text-foreground/50 text-sm leading-relaxed italic">
                  "{m.description}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
