import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Eye, EyeOff, CalendarDays, User, Lock } from "lucide-react";
import { LOGIN_NAME, LOGIN_PASSWORD, appData, STORAGE } from "@/data/shundori-data";
import DynamicIsland from "@/components/shundori/DynamicIsland";

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
  const calBtnRef = useRef<HTMLButtonElement>(null);

  // Close calendar on Escape
  useEffect(() => {
    if (!showCalendar) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCalendar(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showCalendar]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const nameMatch = name.trim().toUpperCase() === LOGIN_NAME.toUpperCase();
    const passMatch = normalizeDate(password) === LOGIN_PASSWORD;
    if (nameMatch && passMatch) {
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

  // Calendar picks a date → writes formatted string into password field
  const handleCalendarSelect = (dateStr: string) => {
    setPassword(dateStr);
    setShowCalendar(false);
    setError("");
  };

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
          transition={{ duration: 0.35 }} className="space-y-4" role="form" aria-label="Sign in"
        >
          {/* Name */}
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <User className="w-4 h-4 shrink-0" style={{ color: "var(--mauve, #8a5a67)" }} />
            <input type="text" placeholder="Your name" value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-black/30"
              style={{ color: "#1c1c1e", fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
              aria-label="Name" autoComplete="name" aria-required="true" />
          </div>

          {/* Password with calendar + eye */}
          <div className="relative">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: "rgba(0,0,0,0.04)", border: showCalendar ? "1px solid var(--accent-color, #d99aa3)" : "1px solid rgba(0,0,0,0.06)" }}>
              <Lock className="w-4 h-4 shrink-0" style={{ color: "var(--mauve, #8a5a67)" }} />
              <input type={showPassword ? "text" : "password"} placeholder="Password (hint: a special date)"
                value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-black/30"
                style={{ color: "#1c1c1e", fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
                aria-label="Password" autoComplete="current-password" />
              <div className="flex items-center gap-0.5">
                <button type="button" ref={calBtnRef}
                  aria-label="Pick a date"
                  onClick={(e) => { e.stopPropagation(); setShowCalendar(!showCalendar); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShowCalendar(!showCalendar); } }}
                  className="p-1.5 rounded-lg cursor-pointer bg-transparent border-none transition-colors hover:bg-black/5"
                  style={{ color: "var(--mauve, #8a5a67)" }}
                  tabIndex={0}>
                  <CalendarDays className="w-4 h-4" />
                </button>
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-lg cursor-pointer bg-transparent border-none transition-colors hover:bg-black/5"
                  style={{ color: "var(--mauve, #8a5a67)" }} tabIndex={0}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Calendar picker — anchored below password field */}
            <AnimatePresence>
              {showCalendar && (
                <CalendarPickerInline
                  onSelect={handleCalendarSelect}
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
                className="text-xs text-center" style={{ color: "#ef4444" }} role="alert">{error}</motion.p>
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

// Inline calendar picker — anchored under the password field
function CalendarPickerInline({ onSelect, onClose, accentColor }: {
  onSelect: (dateStr: string) => void; onClose: () => void; accentColor: string;
}) {
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(2003, 4, 1));
  const [selected, setSelected] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectDay = (day: number) => {
    const d = new Date(year, month, day);
    setSelected(d);
    onSelect(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
  };

  const isSelected = (day: number) => selected?.getDate() === day && selected?.getMonth() === month && selected?.getFullYear() === year;
  const isToday = (day: number) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 z-50 w-[300px] rounded-2xl p-4 shadow-xl"
      style={{ background: "rgba(28,28,30,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)" }}
      role="dialog" aria-label="Date picker">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 rounded-lg cursor-pointer bg-transparent border-none hover:bg-white/10" tabIndex={0}>
          <span className="text-white/60 text-sm">‹</span>
        </button>
        <p className="text-white text-sm font-semibold">{MONTHS[month]} {year}</p>
        <button onClick={onClose} className="p-1 rounded-lg cursor-pointer bg-transparent border-none hover:bg-white/10" tabIndex={0}>
          <span className="text-white/40 text-sm">✕</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <button key={i} disabled={day === null} onClick={() => day && selectDay(day)} tabIndex={day ? 0 : -1}
            className="aspect-square flex items-center justify-center rounded-xl text-xs cursor-pointer transition-all border-none"
            style={{
              color: day === null ? "transparent" : isSelected(day!) ? "#fff" : "rgba(255,255,255,0.8)",
              background: isSelected(day!) ? accentColor : isToday(day!) ? "rgba(255,255,255,0.06)" : "transparent",
              fontWeight: isSelected(day!) ? 600 : 400,
            }}>
            {day}
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] text-white/20 mt-3">Select the password date</p>
    </motion.div>
  );
}
