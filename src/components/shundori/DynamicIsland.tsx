import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DynamicIslandProps { onComplete: () => void; }

export default function DynamicIsland({ onComplete }: DynamicIslandProps) {
  const [stage, setStage] = useState<"idle" | "island" | "expand" | "collapse" | "done">("idle");
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) {
      // Skip animation, just show pill briefly then complete
      const t = setTimeout(() => onComplete(), 1200);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setStage("island"), 300),
      setTimeout(() => setStage("expand"), 1400),
      setTimeout(() => setStage("collapse"), 3200),
      setTimeout(() => setStage("done"), 3800),
      setTimeout(() => onComplete(), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, prefersReduced]);

  // Reduced motion: just fade in a pill
  if (prefersReduced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          className="w-[126px] h-[37px] bg-black rounded-full flex items-center justify-center">
          <div className="flex items-center gap-[3px]">
            {[4, 6, 5, 7, 4].map((h, i) => (
              <div key={i} className="w-[3px] rounded-full bg-white" style={{ height: h }} />
            ))}
          </div>
        </motion.div>
        <p className="text-foreground/60 text-sm italic mt-6">Welcome to your world.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div className="relative z-10" layout>
        <AnimatePresence mode="wait">
          {stage === "island" && (
            <motion.div key="island"
              initial={{ width: 0, height: 0, borderRadius: 999, opacity: 0 }}
              animate={{ width: 126, height: 37, borderRadius: 999, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-black flex items-center justify-center overflow-hidden">
              <div className="flex items-center gap-[3px]">
                {[4, 7, 5, 8, 4, 6, 3].map((h, i) => (
                  <motion.div key={i} className="w-[3px] rounded-full bg-white"
                    animate={{ height: [h, h + 6, h, h + 4, h] }}
                    transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}

          {stage === "expand" && (
            <motion.div key="expand"
              initial={{ width: 126, height: 37, borderRadius: 999 }}
              animate={{ width: 320, height: 90, borderRadius: 40 }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
              className="bg-black flex items-center px-6 gap-4 overflow-hidden">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "var(--accent-color, #d99aa3)" }}>♡</motion.div>
              <div className="flex-1 min-w-0">
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="text-white text-sm font-semibold truncate">Shundori</motion.p>
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="text-white/60 text-xs truncate">For Your Eyes Only</motion.p>
              </div>
              <div className="flex items-center gap-[2px]">
                {[3, 5, 4, 6, 3, 5, 4, 7, 3, 5].map((h, i) => (
                  <motion.div key={i} className="w-[2.5px] rounded-full"
                    style={{ background: "var(--accent-color, #d99aa3)" }}
                    animate={{ height: [h, h + 5, h, h + 3, h] }}
                    transition={{ duration: 1, delay: i * 0.08, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}

          {stage === "collapse" && (
            <motion.div key="collapse"
              initial={{ width: 320, height: 90, borderRadius: 40 }}
              animate={{ width: 126, height: 37, borderRadius: 999 }}
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              className="bg-black flex items-center justify-center">
              <div className="flex items-center gap-[3px]">
                {[4, 6, 5, 7, 4].map((h, i) => (
                  <motion.div key={i} className="w-[3px] rounded-full bg-white"
                    animate={{ height: [h, h + 4, h] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {(stage === "expand" || stage === "collapse") && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 text-center">
            <p className="text-foreground/60 text-sm italic">Welcome to your world.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Persistent pill for inside the app — tappable, shows context
export function PersistentIsland({ context }: { context?: string }) {
  const [expanded, setExpanded] = useState(false);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!expanded) return;
    const t = setTimeout(() => setExpanded(false), 2000);
    return () => clearTimeout(t);
  }, [expanded]);

  if (prefersReduced) {
    return (
      <div className="flex justify-center pt-3">
        <div className="w-[126px] h-[37px] bg-black rounded-full flex items-center justify-center">
          <div className="flex items-center gap-[3px]">
            {[3, 5, 4, 6, 3].map((h, i) => (
              <div key={i} className="w-[2px] rounded-full bg-white" style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-3 pb-1">
      <motion.button onClick={() => context && setExpanded(!expanded)}
        layout className="rounded-full bg-black flex items-center justify-center overflow-hidden cursor-pointer border-none"
        animate={{ width: expanded ? 280 : 126, height: expanded ? 44 : 37 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}>
        {expanded && context ? (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-white text-xs font-medium px-5 truncate">{context}</motion.span>
        ) : (
          <div className="flex items-center gap-[2px]">
            {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
              <motion.div key={i} className="w-[2px] rounded-full"
                style={{ background: "var(--accent-color, #d99aa3)" }}
                animate={{ height: [h, h + 3, h] }}
                transition={{ duration: 1.2, delay: i * 0.12, repeat: Infinity }} />
            ))}
          </div>
        )}
      </motion.button>
    </div>
  );
}
