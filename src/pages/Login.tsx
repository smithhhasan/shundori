import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Eye, EyeOff, CalendarDays } from "lucide-react";
import { LOGIN_NAME, LOGIN_PASSWORD, appData } from "@/data/shundori-data";
import DynamicIsland from "@/components/shundori/DynamicIsland";

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [phase, setPhase] = useState<"form" | "welcome" | "island">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name === LOGIN_NAME && password === LOGIN_PASSWORD) {
      setError("");
      setPhase("welcome");
      setTimeout(() => setPhase("island"), 1400);
    } else {
      setError("Hmm… that doesn't look right.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleIslandComplete = useCallback(() => {
    navigate("/app");
  }, [navigate]);

  // Show "Welcome" text
  if (phase === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-serif mb-2"
            style={{ color: "var(--accent-color, #e8a0b4)" }}
          >
            Welcome to your world.
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-0.5 mx-auto mt-4 rounded-full"
            style={{ background: "var(--accent-color, #e8a0b4)" }}
          />
        </motion.div>
      </div>
    );
  }

  // Show Dynamic Island
  if (phase === "island") {
    return <DynamicIsland onComplete={handleIslandComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate("/")}
        className="absolute top-12 left-6 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer text-sm"
      >
        ← Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-serif mb-2"
            style={{ color: "var(--accent-color, #e8a0b4)" }}
          >
            Welcome, {appData.appName}.
          </h1>
          <p className="text-foreground/50 text-sm italic">
            "Only you know the way in."
          </p>
        </div>

        {/* Login form */}
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* Name field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color,#e8a0b4)]/40 transition-all text-base"
            />
          </div>

          {/* Password field with calendar icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (hint: a special date)"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-5 py-4 pr-24 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color,#e8a0b4)]/40 transition-all text-base"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-foreground/30" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Enter button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base shadow-lg cursor-pointer transition-all"
            style={{ background: "var(--accent-color, #e8a0b4)" }}
          >
            Enter
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
