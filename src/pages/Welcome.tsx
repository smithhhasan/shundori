import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

export default function Welcome() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [noOffset, setNoOffset] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif" }}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Title */}
            <h1 className="text-[44px] font-bold tracking-tight mb-3"
              style={{ color: "var(--accent-color, #e8a0b4)", letterSpacing: "-0.03em" }}
            >
              Shundori
            </h1>

            {/* Subtitle */}
            <p className="text-sm mb-10"
              style={{ color: "rgba(0,0,0,0.35)", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontWeight: 400 }}
            >
              A quiet little place, made just for you.
            </p>

            {/* Question */}
            <p className="text-sm mb-6"
              style={{ color: "rgba(0,0,0,0.45)", fontWeight: 500 }}
            >
              Do you want to continue?
            </p>

            {/* Buttons */}
            <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-full text-white text-sm font-semibold cursor-pointer"
                style={{ background: "var(--accent-color, #e8a0b4)", letterSpacing: "0.01em" }}
              >
                Continue
              </motion.button>

              <motion.button
                animate={{ x: noOffset }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setNoOffset((p) => (p === 0 ? (Math.random() > 0.5 ? 30 : -30) : p + (Math.random() > 0.5 ? 15 : -15)))}
                className="text-xs cursor-pointer bg-transparent border-none"
                style={{ color: "rgba(0,0,0,0.25)" }}
              >
                Not now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
