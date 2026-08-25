import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Heart, MessageCircle, Clock, Gift, MapPin, Settings, Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { type ThemeName, appData, STORAGE } from "@/data/shundori-data";

interface Props { onToggleDark: () => void; isDark: boolean; currentTheme: ThemeName; onThemeChange: (t: ThemeName) => void; }

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
function removeRecent(id: string): string[] {
  const prev = loadRecent();
  const next = prev.filter((x) => x !== id);
  saveRecent(next);
  return next;
}

function SwipeToDismiss({ children, onDismiss, prefersReduced }: { children: React.ReactNode; onDismiss: () => void; prefersReduced: boolean }) {
  const x = useRef(0);
  const [offset, setOffset] = useState(0);
  const [gone, setGone] = useState(false);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500) {
      setGone(true);
      setTimeout(onDismiss, 300);
    } else {
      setOffset(0);
    }
  };

  if (prefersReduced) {
    return <div onDoubleClick={onDismiss}>{children}</div>;
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.5}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: offset }}
          exit={{ opacity: 0, x: -120, scale: 0.8, transition: { duration: 0.25 } }}
          style={{ touchAction: "pan-y" }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PhoneHomeScreen({ onToggleDark, isDark }: Props) {
  const navigate = useNavigate();
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [sheetApp, setSheetApp] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [recentIds, setRecentIds] = useState<string[]>(loadRecent);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dayStr = now.toLocaleDateString([], { weekday: "long" }).toUpperCase();
  const dateNum = now.getDate();

  // Real weather via Open-Meteo (free, no API key)
  const [weather, setWeather] = useState<{ temp: number; desc: string; icon: string } | null>(null);
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Default: Dhaka, Bangladesh (change lat/lon for your location)
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,weather_code&timezone=auto"
        );
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        // WMO weather codes → description + icon
        const wmo: Record<number, { desc: string; icon: string }> = {
          0: { desc: "Clear Sky", icon: "☀️" },
          1: { desc: "Mainly Clear", icon: "🌤️" },
          2: { desc: "Partly Cloudy", icon: "⛅" },
          3: { desc: "Overcast", icon: "☁️" },
          45: { desc: "Foggy", icon: "🌫️" },
          48: { desc: "Rime Fog", icon: "🌫️" },
          51: { desc: "Light Drizzle", icon: "🌦️" },
          53: { desc: "Drizzle", icon: "🌦️" },
          55: { desc: "Dense Drizzle", icon: "🌧️" },
          61: { desc: "Light Rain", icon: "🌦️" },
          63: { desc: "Rain", icon: "🌧️" },
          65: { desc: "Heavy Rain", icon: "🌧️" },
          71: { desc: "Light Snow", icon: "❄️" },
          73: { desc: "Snow", icon: "❄️" },
          75: { desc: "Heavy Snow", icon: "❄️" },
          80: { desc: "Light Showers", icon: "🌦️" },
          81: { desc: "Showers", icon: "🌧️" },
          82: { desc: "Heavy Showers", icon: "⛈️" },
          95: { desc: "Thunderstorm", icon: "⛈️" },
          96: { desc: "Thunderstorm + Hail", icon: "⛈️" },
          99: { desc: "Thunderstorm + Heavy Hail", icon: "⛈️" },
        };
        const match = wmo[code] || { desc: "Cloudy", icon: "☁️" };
        setWeather({ temp, desc: match.desc, icon: match.icon });
      } catch {
        setWeather({ temp: 24, desc: "Partly Cloudy", icon: "⛅" });
      }
    };
    fetchWeather();
  }, []);

  const openSection = (app: AppItem) => {
    setOpenApp(app.id);
    setRecentIds(addRecent(app.id));
    setTimeout(() => { navigate(app.path); setOpenApp(null); setSearch(""); setSearchFocused(false); }, prefersReduced ? 100 : 500);
  };

  const filtered = search.trim() ? ALL_APPS.filter((a) => a.label.toLowerCase().includes(search.toLowerCase())) : [];
  const recentApps = recentIds.map((id) => ALL_APPS.find((a) => a.id === id)).filter(Boolean) as AppItem[];

  return (
    <div className="min-h-screen h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: isDark
          ? "linear-gradient(170deg, #1a1a2e 0%, #16213e 20%, #0f3460 45%, #533483 70%, #1a1a2e 100%)"
          : "linear-gradient(170deg, #fdf2f8 0%, #fbcfe8 15%, #f9a8d4 30%, #c4b5fd 50%, #93c5fd 70%, #a5f3fc 85%, #fdf2f8 100%)",
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

      <div className="relative z-10 flex-1 overflow-y-auto px-5 pt-2 pb-8">
        {/* Widgets */}
        <div className="grid grid-cols-2 gap-3 mb-4 px-1">
          {/* Weather Widget — Liquid Glass */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-[22px] p-4 overflow-hidden relative"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(58,123,213,0.35) 0%, rgba(91,163,230,0.2) 100%)"
                : "linear-gradient(135deg, rgba(58,123,213,0.45) 0%, rgba(91,163,230,0.3) 100%)",
              backdropFilter: "blur(20px) saturate(1.8)",
              WebkitBackdropFilter: "blur(20px) saturate(1.8)",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.35)",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 8px 32px rgba(58,123,213,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}>
            {/* Liquid glass shine overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            }} />
            <p className="relative text-white/80 text-[11px] font-medium">{appData.appName}</p>
            <div className="relative flex items-end gap-1 mt-1">
              <span className="text-white text-[42px] font-thin leading-none">
                {weather ? `${weather.temp}°` : "--°"}
              </span>
              <span className="relative pb-1 text-[20px]">{weather?.icon || "⛅"}</span>
            </div>
            <p className="relative text-white/70 text-[11px] mt-1">{weather?.desc || "Loading..."}</p>
          </motion.div>

          {/* Calendar Widget — Liquid Glass */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-[22px] p-4 overflow-hidden cursor-pointer relative"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)",
              backdropFilter: "blur(20px) saturate(1.8)",
              WebkitBackdropFilter: "blur(20px) saturate(1.8)",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
            onClick={() => setSheetApp("calendar")} role="button" aria-label="Open calendar" tabIndex={0}>
            {/* Liquid glass shine */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)",
            }} />
            <p className="relative text-red-500 text-[10px] font-semibold uppercase tracking-wider">{dayStr}</p>
            <p className="relative text-foreground text-[42px] font-light leading-none mt-0.5">{dateNum}</p>
            <div className="relative mt-2 flex items-center gap-1.5">
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

        {/* Search — Dynamic Island style */}
        <div className="mb-3 px-1 flex justify-center">
          <div className="relative">
            <motion.div layout
              animate={{ width: searchFocused ? 280 : 126, height: searchFocused ? 44 : 37 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="rounded-full flex items-center px-4 gap-2 cursor-pointer overflow-hidden"
              style={{ background: "#000" }}>
              {!searchFocused ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 w-full">
                  <Search className="w-3.5 h-3.5 text-white/60 shrink-0" />
                  <span className="text-white/50 text-[11px] truncate">Search</span>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 w-full">
                  <Search className="w-4 h-4 text-white/60 shrink-0" />
                  <input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    onBlur={() => { if (!search) setTimeout(() => setSearchFocused(false), 150); }}
                    placeholder="Search apps" autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30"
                    aria-label="Search apps" />
                  {search && <button onClick={() => setSearch("")} className="cursor-pointer bg-transparent border-none p-0.5" aria-label="Clear search">
                    <X className="w-3.5 h-3.5 text-white/40" /></button>}
                  <button onClick={() => { setSearch(""); setSearchFocused(false); }} className="cursor-pointer bg-transparent border-none p-0.5" aria-label="Close search">
                    <X className="w-4 h-4 text-white/50" /></button>
                </motion.div>
              )}
            </motion.div>
            {/* Tap target when collapsed */}
            {!searchFocused && (
              <div className="absolute inset-0 rounded-full" onClick={() => setSearchFocused(true)} />
            )}
            {/* Search results dropdown */}
            <AnimatePresence>
              {search.trim() && searchFocused && (
                <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[280px] rounded-2xl overflow-hidden z-50"
                  style={{ background: "rgba(28,28,30,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                  {filtered.length > 0 ? filtered.map((app) => (
                    <button key={app.id} onMouseDown={(e) => e.preventDefault()} onClick={() => openSection(app)}
                      className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors bg-transparent border-none text-left"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: app.gradient }}>
                        <span className="scale-[0.6]">{app.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-white">{app.label}</span>
                    </button>
                  )) : <p className="px-4 py-4 text-xs text-center text-white/30">No apps found</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Spacer to fill remaining space */}
        <div className="flex-1" />

        {/* Recently Opened — icons only, swipe to dismiss */}
        {recentApps.length > 0 && (
          <div className="mb-4 px-1">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>Recently Opened</p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {recentApps.map((app) => (
                <SwipeToDismiss key={app.id} onDismiss={() => setRecentIds(removeRecent(app.id))} prefersReduced={prefersReduced}>
                  <motion.button whileTap={prefersReduced ? {} : { scale: 0.9 }} onClick={() => openSection(app)}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                    aria-label={`Open ${app.label}`}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: app.gradient }}>
                      <span className="scale-[0.55]">{app.icon}</span>
                    </div>
                  </motion.button>
                </SwipeToDismiss>
              ))}
            </div>
          </div>
        )}


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
