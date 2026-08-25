import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Eye, EyeOff, CalendarDays, User, Lock, Loader2 } from "lucide-react";
import { LOGIN_NAME, LOGIN_PASSWORD } from "@/data/shundori-data";
import CalendarPicker from "@/components/shundori/CalendarPicker";

function normalizeDate(s: string): string {
  const trimmed = s.trim();
  if (trimmed === LOGIN_PASSWORD) return LOGIN_PASSWORD;
  const stripped = trimmed.replace(/[\/\-.\s]/g, "").toLowerCase();
  const target = LOGIN_PASSWORD.replace(/[\/\-.\s]/g, "").toLowerCase();
  return stripped === target ? LOGIN_PASSWORD : trimmed;
}

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const canSubmit = name.trim().length > 0 && password.length > 0;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError("");

    setTimeout(() => {
      const normalized = normalizeDate(password);
      if (name.trim() === LOGIN_NAME && normalized === LOGIN_PASSWORD) {
        localStorage.setItem("shundori-auth", "true");
        navigate("/app");
      } else {
        setError("Incorrect name or password.");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setLoading(false);
      }
    }, 600);
  }, [name, password, canSubmit, loading, navigate]);

  const handleCalendarSelect = (dateStr: string) => {
    setPassword(dateStr);
    setShowCalendar(false);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif" }}
    >
      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/")}
        className="absolute top-12 left-6 text-xs cursor-pointer bg-transparent border-none"
        style={{ color: "rgba(0,0,0,0.3)" }}
      >
        ← Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[340px]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold tracking-tight mb-1"
            style={{ color: "var(--accent-color, #e8a0b4)", letterSpacing: "-0.02em" }}
          >
            Shundori
          </h1>
          <p className="text-xs" style={{ color: "rgba(0,0,0,0.35)", fontWeight: 500 }}>Sign in</p>
          <p className="text-[11px] mt-1" style={{ color: "rgba(0,0,0,0.25)" }}>
            Enter your details to continue.
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Name */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(0,0,0,0.04)" }}
          >
            <User className="w-4 h-4 shrink-0" style={{ color: "rgba(0,0,0,0.2)" }} />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: "rgba(0,0,0,0.8)", fontFamily: "inherit" }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(0,0,0,0.04)" }}
            >
              <Lock className="w-4 h-4 shrink-0" style={{ color: "rgba(0,0,0,0.2)" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: "rgba(0,0,0,0.8)", fontFamily: "inherit" }}
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowCalendar(!showCalendar); }}
                  className="p-1 cursor-pointer bg-transparent border-none"
                  style={{ color: "rgba(0,0,0,0.2)" }}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 cursor-pointer bg-transparent border-none"
                  style={{ color: "rgba(0,0,0,0.2)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Calendar picker */}
            <AnimatePresence>
              {showCalendar && (
                <CalendarPicker
                  onSelect={handleCalendarSelect}
                  onClose={() => setShowCalendar(false)}
                  accentColor="var(--accent-color, #e8a0b4)"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-center"
                style={{ color: "#ef4444" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!canSubmit || loading}
            whileTap={canSubmit && !loading ? { scale: 0.97 } : {}}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all"
            style={{
              background: canSubmit ? "var(--accent-color, #e8a0b4)" : "rgba(0,0,0,0.08)",
              color: canSubmit ? "#fff" : "rgba(0,0,0,0.2)",
              letterSpacing: "0.01em",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
