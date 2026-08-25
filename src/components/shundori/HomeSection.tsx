import { motion } from "framer-motion";
import { appData } from "@/data/shundori-data";
import { useEffect, useState } from "react";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  char: ["♡", "✦", "✧", "❋", "❀", "⭐"][i % 6],
  x: Math.random() * 100,
  delay: Math.random() * 8,
  dur: 10 + Math.random() * 10,
  size: 12 + Math.random() * 16,
}));

export default function HomeSection() {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-10 overflow-hidden">
      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{ left: `${p.x}%`, fontSize: p.size, opacity: 0.08 }}
          initial={{ y: "105vh" }}
          animate={{ y: "-5vh" }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.char}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <p className="text-sm text-foreground/40 mb-2 tracking-wide uppercase">{greeting}</p>

        <h1
          className="text-4xl md:text-5xl font-serif mb-3"
          style={{ color: "var(--accent-color, #e8a0b4)" }}
        >
          {appData.appName}
        </h1>

        <p className="text-foreground/50 text-base italic max-w-xs mx-auto leading-relaxed mb-8">
          "Made just for you."
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="card-glass px-6 py-8 max-w-sm mx-auto"
        >
          <p className="text-foreground/60 text-sm leading-relaxed italic">
            "{appData.homeQuote}"
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-foreground/30 text-xs mt-8"
        >
          Made with love for {appData.personName}
        </motion.p>
      </motion.div>
    </div>
  );
}
