import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { appData, NO_MESSAGES } from "@/data/shundori-data";

const INITIAL_NO_POS = { x: 0, y: 0 };

// Pre-compute random particle positions to avoid impure render
const PARTICLES = [...Array(12)].map((_, i) => ({
  id: i,
  symbol: ["✦", "♡", "✧", "❋", "♦", "❀"][i % 6],
  x1: 10 + (((i * 37 + 13) % 80)),
  x2: 10 + (((i * 53 + 7) % 80)),
  duration: 12 + (i * 3 % 10),
}));

export default function Welcome() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [noPos, setNoPos] = useState(INITIAL_NO_POS);
  const [message, setMessage] = useState("");
  const [noGone, setNoGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setShowButtons(true), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const moveNoButton = useCallback(() => {
    const next = noClicks + 1;
    setNoClicks(next);
    if (next >= 1) {
      setNoGone(true);
      return;
    }
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden relative"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div key={p.id} className="absolute text-lg opacity-10"
            initial={{ y: "110vh", x: `${p.x1}%` }}
            animate={{ y: "-10vh", x: `${p.x2}%`, rotate: [0, 360] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.id * 1.5, ease: "linear" }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {phase >= 0 && (
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center mb-8"
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent-color, #e8a0b4)", lineHeight: 1.1 }}
          >
            {appData.appName}
          </motion.h1>
        )}
      </AnimatePresence>

      <div className="text-center space-y-1 mb-10 max-w-sm">
        <AnimatePresence>
          {phase >= 1 && appData.welcomeMessages.slice(0, 3).map((line, i) => (
            <motion.p key={`l1-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.4, ease: "easeOut" }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 400, fontStyle: "italic", lineHeight: 1.7, color: "rgba(0,0,0,0.55)" }}
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {phase >= 2 && appData.welcomeMessages.slice(3).map((line, i) => (
            <motion.p key={`l2-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.4, ease: "easeOut" }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 400, fontStyle: "italic", lineHeight: 1.7, color: "rgba(0,0,0,0.55)" }}
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showButtons && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500, fontStyle: "italic", color: "rgba(0,0,0,0.6)" }}>
              Do you want to enter your world?
            </p>
            <div className="flex items-center gap-8 relative">
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/login")}
                style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--accent-color, #e8a0b4)", color: "#fff", fontWeight: 600, fontSize: "1rem", padding: "0.75rem 2.5rem", borderRadius: "9999px", boxShadow: "0 4px 20px rgba(232,160,180,0.35)", border: "none", cursor: "pointer" }}
              >
                YES
              </motion.button>
              <AnimatePresence>
                {!noGone && (
                  <motion.button animate={{ x: noPos.x, y: noPos.y, scale: [1, 1.04, 1] }}
                    exit={{ opacity: 0, scale: 0.5, x: 100 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    whileHover={{ scale: 1.04 }}
                    onClick={moveNoButton}
                    style={{ fontFamily: "'DM Sans', sans-serif", background: "transparent", color: "rgba(0,0,0,0.35)", fontWeight: 600, fontSize: "1rem", padding: "0.75rem 2.5rem", borderRadius: "9999px", border: "2px solid rgba(0,0,0,0.12)", cursor: "pointer" }}
                  >
                    NO
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {message && (
                <motion.p key={message} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontStyle: "italic", color: "rgba(0,0,0,0.35)" }}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {noGone && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center -mt-2">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontStyle: "italic", color: "rgba(0,0,0,0.3)" }}>
              Smart choice.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
