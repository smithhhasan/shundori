import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { appData, NO_MESSAGES } from "@/data/shundori-data";

const INITIAL_NO_POS = { x: 0, y: 0 };

export default function Welcome() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [noPos, setNoPos] = useState(INITIAL_NO_POS);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setShowButtons(true), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const moveNoButton = useCallback(() => {
    const next = noClicks + 1;
    setNoClicks(next);
    if (next > 1 && next <= NO_MESSAGES.length + 1) {
      setMessage(NO_MESSAGES[Math.min(next - 2, NO_MESSAGES.length - 1)]);
    }
    const maxX = Math.min(120, (window.innerWidth / 2) * 0.6);
    const maxY = 40;
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    setNoPos({
      x: Math.max(-maxX, Math.min(maxX, Math.cos(angle) * dist)),
      y: Math.max(-maxY, Math.min(maxY, Math.sin(angle) * dist)),
    });
  }, [noClicks]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Soft floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg opacity-10"
            initial={{ y: "110vh", x: `${10 + Math.random() * 80}%` }}
            animate={{
              y: "-10vh",
              x: `${10 + Math.random() * 80}%`,
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          >
            {["✦", "♡", "✧", "❋", "♦", "❀"][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Title */}
      <AnimatePresence>
        {phase >= 0 && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif tracking-tight text-center mb-8"
            style={{ color: "var(--accent-color, #e8a0b4)" }}
          >
            {appData.appName}
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Message lines */}
      <div className="text-center space-y-1 mb-10 max-w-sm">
        <AnimatePresence>
          {phase >= 1 && appData.welcomeMessages.slice(0, 3).map((line, i) => (
            <motion.p
              key={`l1-${i}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.4, ease: "easeOut" }}
              className="text-base md:text-lg text-foreground/70 italic leading-relaxed"
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && appData.welcomeMessages.slice(3).map((line, i) => (
            <motion.p
              key={`l2-${i}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.4, ease: "easeOut" }}
              className="text-base md:text-lg text-foreground/70 italic leading-relaxed"
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {/* Prompt */}
      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-foreground/80 text-lg font-medium">
              Do you want to login?
            </p>

            <div className="flex items-center gap-8 relative">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/login")}
                className="px-10 py-3 rounded-full text-white font-semibold text-base shadow-lg cursor-pointer"
                style={{ background: "var(--accent-color, #e8a0b4)" }}
              >
                YES
              </motion.button>

              <motion.button
                animate={{
                  x: noPos.x,
                  y: noPos.y,
                  scale: [1, 1.04, 1],
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.04 }}
                onClick={moveNoButton}
                className="px-10 py-3 rounded-full border-2 border-foreground/20 text-foreground/50 font-semibold text-base cursor-pointer bg-transparent"
              >
                NO
              </motion.button>
            </div>

            {/* Playful message */}
            <AnimatePresence>
              {message && (
                <motion.p
                  key={message}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-foreground/50 italic mt-1"
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
