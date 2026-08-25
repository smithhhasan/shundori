import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Heart, MessageCircle, Clock, Gift, MapPin, Settings, Cloud, LogOut, Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { type ThemeName, appData, STORAGE } from "@/data/shundori-data";

interface Props { onLogout: () => void; onToggleDark: () => void; isDark: boolean; currentTheme: ThemeName; onThemeChange: (t: ThemeName) => void; }

const ALL_APPS = [
  { id: "photos", label: "Photos", gradient: "linear-gradient(135deg, #f5a623, #f7c948, #7ec8e3, #d96ecf, #e85d75)", icon: <Image className="w-7 h-7 text-white" />, path: "/app/photos" },
  { id: "memories", label: "Memories", gradient: "linear-gradient(135deg, #ff6b9d, #c44569)", icon: <Heart className="w-7 h-7 text-white" />, path: "/app/memories" },
  { id: "jhogra", label: "Jhogra", gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)", icon: <MessageCircle className="w-7 h-7 text-white" />, path: "/app/jhogra" },
  { id: "first-meet", label: "First Meet", gradient: "linear-gradient(135deg, #4facfe, #00f2fe)", icon: <Clock className="w-7 h-7 text-white" />, path: "/app/first-meet" },
  { id: "gifts", label: "Gifts", gradient: "linear-gradient(135deg, #f093fb, #f5576c)", icon: <Gift className="w-7 h-7 text-white" />, path: "/app/gifts" },
  { id: "name-land", label: "Name on Land", gradient: "linear-gradient(135deg, #667eea, #764ba2)", icon: <MapPin className="w-7 h-7 text-white" />, path: "/app/name-on-land" },
  { id: "settings", label: "Settings", gradient: "linear-gradient(135deg, #8e8e93, #636366)", icon: <Settings className="w-7 h-7 text-white" />, path: "/app/settings" },
];
type AppItem = (typeof ALL_APPS)[number];

const RECENT_MAX = 4;

function IosIcon({ gradient, children, size = 60, label, onTap, animDelay }: {
  gradient: string; children: React.ReactNode; size?: number; label: string; onTap?: () => void; animDelay?: number;
}) {
  const r = Math.round(size * 0.225);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <motion.button initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: animDelay ?? 0, type: "spring", stiffness: 300, damping: 24 }}
      whileTap={prefersReduced ? {} : { scale: 0.82 }} onClick={onTap}
      className="flex flex-col items-center gap-[5px] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 rounded-xl"
      tabIndex={0} aria-label={label}>
      <div className="flex items-center justify-center shadow-lg" style={{ width: size, height: size, borderRadius: r, background: gradient }}>
        {children}
      </div>
      <span className="text-[11px] leading-tight text-center max-w-[68px] truncate"
        style={{ color: "var(--app-label-color, rgba(0,0,0,0.75))" }}>{label}</span>
    </motion.button>
  );
}

function loadRecent(): string[] { try { const s = localStorage.getItem(STORAGE.recentApps); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveRecent(ids: string[]) { localStorage.setItem(STORAGE.recentApps, JSON.stringify(ids.slice(0, RECENT_MAX))); }
function addRecent(id: string): string[] {
  const prev = loadRecent();
  const next = [id, ...prev.filter((x) => x !== id)].slice(0, RECENT_MAX);
  saveRecent(next);
  return next;
}

export default function PhoneHomeScreen({ onLogout, onToggleDark, isDark }: Props) {
  const navigate = useNavigate();
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [sheetApp, setSheetApp] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [recentIds, setRecentIds] = useState<string[]>(loadRecent);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dayStr = now.toLocaleDateString([], { weekday: "long" });
  const dateNum = now.getDate();

  const openSection = (app: AppItem) => {
    setOpenApp(app.id);
    setRecentIds(addRecent(app.id));
    setTimeout(() => { navigate(app.path); setOpenApp(null); setSearch(""); setSearchFocused(false); }, prefersReduced ? 100 : 500);
  };

  const filtered = search.trim() ? ALL_APPS.filter((a) => a.label.toLowerCase().includes(search.toLowerCase())) : [];
  const recentApps = recentIds.map((id) => ALL_APPS.find((a) => a.id === id)).filter(Boolean) as AppItem[];

  return (
    <div className="min-h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: isDark ? "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 40%, #0d1b2a 100%)" : "linear-gradient(180deg, #e0ecff 0%, #b8d4f0 30%, #d4b8e8 60%, #f0d4e8 100%)",
        opacity: 0.35,
      }} />

      {/* Status bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-3 pb-1">
        <span className="text-[13px] font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>{timeStr}</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-[2px] items-end">
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: isDark ? "#fff" : "#000", opacity: 0.5 }} />
            ))}
          </div>
          <span className="text-[11px] font-medium ml-0.5" style={{ color: isDark ? "#fff" : "#000" }}>5G</span>
          <div className="w-[22px] h-[11px] rounded-[3px] border relative ml-1" style={{ borderColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)" }}>
            <div className="absolute inset-[2px] rounded-[1.5px]" style={{ width: "78%", background: "#34c759" }} />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 pt-2 pb-4">
        {/* Widgets */}
        <div className="grid grid-cols-2 gap-3 mb-4 px-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-[22px] p-4 overflow-hidden"
            style={{ background: "linear-gradient(180deg, #3a7bd5 0%, #5ba3e6 100%)" }}>
            <p className="text-white/80 text-[11px] font-medium">{appData.appName}</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-white text-[42px] font-thin leading-none">24°</span>
              <div className="pb-1"><Cloud className="w-5 h-5 text-white/80" /></div>
            </div>
            <p className="text-white/70 text-[11px] mt-1">Partly Cloudy</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-[22px] p-4 overflow-hidden cursor-pointer"
            style={{ background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.85)" }}
            onClick={() => setSheetApp("calendar")} role="button" aria-label="Open calendar" tabIndex={0}>
            <p className="text-red-500 text-[10px] font-semibold uppercase tracking-wider">{dayStr}</p>
            <p className="text-foreground text-[42px] font-light leading-none mt-0.5">{dateNum}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <p className="text-foreground/60 text-[10px] truncate">A Special Day</p>
            </div>
          </motion.div>
        </div>

        {/* App grid */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 mb-5 px-1">
          {ALL_APPS.map((app, i) => (
            <IosIcon key={app.id} gradient={app.gradient} label={app.label} animDelay={0.05 + i * 0.04} onTap={() => openSection(app)}>
              {app.icon}
            </IosIcon>
          ))}
        </div>

        {/* Search — above Recently Opened */}
        <div className="mb-3 px-1">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all"
            style={{ background: searchFocused ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)") : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)") }}>
            <Search className="w-4 h-4 opacity-40" style={{ color: isDark ? "#fff" : "#000" }} />
            <input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search apps" className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: isDark ? "#fff" : "#000" }} aria-label="Search apps" />
            {search && <button onClick={() => setSearch("")} className="cursor-pointer bg-transparent border-none" aria-label="Clear search">
              <X className="w-4 h-4 opacity-30" style={{ color: isDark ? "#fff" : "#000" }} /></button>}
          </div>
          <AnimatePresence>
            {search.trim() && searchFocused && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="mt-2 rounded-2xl overflow-hidden"
                style={{ background: isDark ? "rgba(30,30,46,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                {filtered.length > 0 ? filtered.map((app) => (
                  <button key={app.id} onMouseDown={(e) => e.preventDefault()} onClick={() => openSection(app)}
                    className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none text-left"
                    style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: app.gradient }}>
                      <span className="scale-[0.6]">{app.icon}</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: isDark ? "#fff" : "#000" }}>{app.label}</span>
                  </button>
                )) : <p className="px-4 py-4 text-xs text-center" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>No apps found</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recently Opened — 4 apps max */}
        {recentApps.length > 0 && (
          <div className="mb-6 px-1">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Recently Opened</p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {recentApps.map((app) => (
                <motion.button key={app.id} whileTap={prefersReduced ? {} : { scale: 0.9 }} onClick={() => openSection(app)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shrink-0 cursor-pointer transition-all bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                  aria-label={`Open ${app.label}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: app.gradient }}>
                    <span className="scale-[0.5]">{app.icon}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>{app.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Log Out */}
        <div className="px-1 mb-4">
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer transition-all bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Home indicator */}
      <div className="relative z-10 flex justify-center pb-3 pt-1">
        <div className="w-[134px] h-[5px] rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }} />
      </div>

      {/* App opening overlay */}
      <AnimatePresence>
        {openApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--bg-color)" }}>
            <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
              <div className="w-16 h-16 rounded-[18px] flex items-center justify-center shadow-lg"
                style={{ background: ALL_APPS.find((a) => a.id === openApp)?.gradient || "var(--accent-color)" }}>
                {ALL_APPS.find((a) => a.id === openApp)?.icon}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar sheet */}
      <AnimatePresence>
        {sheetApp === "calendar" && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[90] rounded-t-[20px] p-5 pb-8"
            style={{ background: isDark ? "#1c1c1e" : "#f2f2f7", boxShadow: "0 -4px 30px rgba(0,0,0,0.15)" }}
            role="dialog" aria-label="Special dates">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }} />
            <p className="text-center text-sm font-semibold mb-4" style={{ color: isDark ? "#fff" : "#000" }}>Special Dates</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)" }}>
                <div className="w-11 h-11 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg">{dateNum}</div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? "#fff" : "#000" }}>Today</p>
                  <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>A special day</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--accent-color, #d99aa3)" }}>4</div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? "#fff" : "#000" }}>May 2003</p>
                  <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>The day that matters most</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSheetApp(null)} className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer bg-transparent border-none"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", color: isDark ? "#fff" : "#000" }}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
