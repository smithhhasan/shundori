import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Eye, EyeOff, CalendarDays, User, Lock } from "lucide-react";
import { LOGIN_NAME, LOGIN_PASSWORD, appData, STORAGE } from "@/data/shundori-data";
import DynamicIsland from "@/components/shundori/DynamicIsland";
import CalendarPicker from "@/components/shundori/CalendarPicker";

function normalizeDate(s: string): string {
  const trimmed = s.trim();
  if (trimmed === LOGIN_PASSWORD) return LOGIN_PASSWORD;
  const stripped = trimmed.replace(/[^\w]/g, "").toLowerCase();
  const target = LOGIN_PASSWORD.replace(/[^\w]/g, "").toLowerCase();
  return stripped === target ? LOGIN_PASSWORD : trimmed;
}

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [phase, setPhase] = useState<"form" | "welcome" | "island">("form");
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeDate(password);
    if (name.trim().toUpperCase() === LOGIN_NAME.toUpperCase() && normalized === LOGIN_PASSWORD) {
      setError("");
      localStorage.setItem(STORAGE.auth, "true");
      setPhase("welcome");
      setTimeout(() => setPhase("island"), 1400);
    } else {
      setError("Hmm… that doesn't look right.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }, [name, password]);

  const handleIslandComplete = useCallback(() => navigate("/app"), [navigate]);

  if (phase === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-2xl font-serif mb-2" style={{ color: "var(--accent-color, #d99aa3)" }}>Welcome to your world.</motion.h1>
          <motion.div initial={{ width: 0 }} animate={{ width: "120px" }} transition={{ duration: 1, delay: 0.5 }}
            className="h-0.5 mx-auto mt-4 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
        </motion.div>
      </div>
    );
  }

  if (phase === "island") {
    return <DynamicIsland onComplete={handleIslandComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        onClick={() => navigate("/")} className="absolute top-12 left-6 text-sm cursor-pointer bg-transparent border-none"
        style={{ color: "var(--mauve, #8a5a67)" }}>← Back</motion.button>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif mb-2" style={{ color: "var(--accent-color, #d99aa3)" }}>
            Welcome, {appData.appName}.
          </h1>
          <p className="text-sm italic" style={{ color: "var(--mauve, #8a5a67)" }}>"Only you know the way in."</p>
        </div>

        <motion.form onSubmit={handleSubmit} animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.35 }} className="space-y-4"
        >
          {/* Name */}
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <User className="w-4 h-4 shrink-0" style={{ color: "var(--mauve, #8a5a67)" }} />
            <input type="text" placeholder="Your name" value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: "var(--ivory, #1c1c1e)", fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }} />
          </div>

          {/* Password with calendar + eye */}
          <div className="relative">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <Lock className="w-4 h-4 shrink-0" style={{ color: "var(--mauve, #8a5a67)" }} />
              <input type={showPassword ? "text" : "password"} placeholder="Password"
                value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: "var(--ivory, #1c1c1e)", fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }} />
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => setShowCalendar(!showCalendar)}
                  className="p-1.5 rounded-lg cursor-pointer bg-transparent border-none transition-colors hover:bg-black/5"
                  style={{ color: "var(--mauve, #8a5a67)" }}>
                  <CalendarDays className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-lg cursor-pointer bg-transparent border-none transition-colors hover:bg-black/5"
                  style={{ color: "var(--mauve, #8a5a67)" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Calendar picker */}
            <AnimatePresence>
              {showCalendar && (
                <CalendarPicker
                  onSelect={(dateStr) => { setPassword(dateStr); setShowCalendar(false); setError(""); }}
                  onClose={() => setShowCalendar(false)}
                  accentColor="var(--accent-color, #d99aa3)"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button type="submit" whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all border-none"
            style={{ background: "var(--accent-color, #d99aa3)", letterSpacing: "0.01em" }}>
            Enter your world
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
