import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { appData } from "@/data/shundori-data";

export default function NameOnLandSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className="min-h-full px-4 py-6 pb-24" ref={containerRef}>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-1"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        Your Name on Land
      </motion.h2>
      <p className="text-foreground/40 text-sm mb-6 italic">Some names deserve the world.</p>

      {/* Cinematic landscape */}
      <div className="relative rounded-3xl overflow-hidden h-[70vh] min-h-[400px] flex items-center justify-center">
        {/* Gradient sky + landscape layers */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg,
                #1a1a3e 0%,
                #2d1b4e 20%,
                #e8a0b488 50%,
                #f48fb1aa 65%,
                #fce4ec 80%,
                #f8bbd0 100%)`,
            }}
          />
          {/* Stars */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: 1 + Math.random() * 2,
                height: 1 + Math.random() * 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                opacity: 0.3 + Math.random() * 0.5,
              }}
            />
          ))}
        </motion.div>

        {/* Mountain silhouette layer */}
        <motion.div style={{ y: y2 }} className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 800 300" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,300 L0,220 Q100,120 200,200 Q300,100 400,180 Q500,80 600,160 Q700,100 800,190 L800,300 Z"
              fill="var(--accent-color, #e8a0b4)"
              opacity="0.25"
            />
            <path
              d="M0,300 L0,250 Q150,180 300,230 Q450,160 600,220 Q700,190 800,240 L800,300 Z"
              fill="var(--accent-color, #e8a0b4)"
              opacity="0.15"
            />
          </svg>
        </motion.div>

        {/* Name overlay */}
        <motion.div style={{ opacity }} className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-white/80 text-sm italic mb-4 tracking-wide"
          >
            {appData.landMessage}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl md:text-5xl font-serif text-white tracking-wider"
            style={{
              textShadow: "0 4px 30px rgba(0,0,0,0.3), 0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {appData.personName}
          </motion.h1>
        </motion.div>
      </div>
    </div>
  );
}
