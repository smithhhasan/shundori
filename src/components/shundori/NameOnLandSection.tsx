import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { appData } from "@/data/shundori-data";

// Pre-computed star positions
const STARS = [...Array(25)].map((_, i) => ({
  id: i,
  size: 1 + ((i * 7 + 3) % 3),
  x: (i * 37 + 11) % 100,
  y: (i * 23 + 5) % 35,
  opacity: 0.3 + ((i * 13) % 5) * 0.08,
}));

export default function NameOnLandSection() {
  const isDark = localStorage.getItem("shundori-dark") === "true";
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className="px-5 pt-2 pb-4" ref={ref}>
      <p className="text-[13px] mb-5 italic"
        style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
      >
        {appData.landMessage}
      </p>

      <div className="relative rounded-3xl overflow-hidden h-[65vh] min-h-[380px] flex items-center justify-center">
        {/* Landscape */}
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <div className="absolute inset-0" style={{
            background: isDark
              ? "linear-gradient(180deg, #0a0a2e 0%, #1a0a3e 25%, #e8a0b444 55%, #f48fb166 70%, #1a1a2e 100%)"
              : "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 25%, #e8a0b466 55%, #f48fb188 70%, #fef5f7 100%)",
          }} />
          {/* Stars — pre-computed positions */}
          {STARS.map((s) => (
            <div key={s.id} className="absolute rounded-full" style={{
              width: s.size, height: s.size,
              left: `${s.x}%`, top: `${s.y}%`,
              background: "#fff", opacity: s.opacity,
            }} />
          ))}
        </motion.div>

        {/* Mountains */}
        <motion.div style={{ y: y2 }} className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 800 250" className="w-full" preserveAspectRatio="none">
            <path d="M0,250 L0,180 Q100,100 200,160 Q300,80 400,140 Q500,60 600,130 Q700,80 800,150 L800,250 Z"
              fill="var(--accent-color, #e8a0b4)" opacity="0.2" />
            <path d="M0,250 L0,200 Q150,150 300,190 Q450,130 600,180 Q700,150 800,200 L800,250 Z"
              fill="var(--accent-color, #e8a0b4)" opacity="0.12" />
          </svg>
        </motion.div>

        {/* Name */}
        <motion.div style={{ opacity }} className="relative z-10 text-center px-6">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="text-sm mb-4"
            style={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}
          >
            {appData.landMessage}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[28px] font-bold tracking-tight"
            style={{ color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,0.3)", letterSpacing: "-0.01em" }}
          >
            {appData.personName}
          </motion.h1>
        </motion.div>
      </div>
    </div>
  );
}
