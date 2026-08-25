import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Image, Heart, MessageCircle, Clock, Gift, MapPin,
  Settings, Camera, Music, Cloud, CalendarDays, Bell, Compass,
  Mic, Video, Wallet, ShieldCheck, FileText, Palette, Star,
  Phone, Compass as Safari, MessageSquare, Moon, Sun, LogOut,
  PhoneCall, AppWindow, Tv, Gamepad2, BookOpen, Clapperboard,
} from "lucide-react";
import { useNavigate } from "react-router";
import { THEMES, type ThemeName, appData } from "@/data/shundori-data";

interface Props {
  onLogout: () => void;
  onToggleDark: () => void;
  isDark: boolean;
  currentTheme: ThemeName;
  onThemeChange: (t: ThemeName) => void;
}

/* ── iOS-style icon component ──────────────────────────── */
function IosIcon({
  gradient,
  children,
  size = 60,
  label,
  badge,
  onTap,
  animDelay,
}: {
  gradient: string;
  children: React.ReactNode;
  size?: number;
  label: string;
  badge?: string;
  onTap?: () => void;
  animDelay?: number;
}) {
  const r = Math.round(size * 0.225);
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: animDelay ?? 0,
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      whileTap={{ scale: 0.82 }}
      onClick={onTap}
      className="flex flex-col items-center gap-[5px] cursor-pointer select-none"
    >
      <div className="relative">
        <div
          className="flex items-center justify-center shadow-lg"
          style={{
            width: size,
            height: size,
            borderRadius: r,
            background: gradient,
          }}
        >
          {children}
        </div>
        {badge && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">{badge}</span>
          </div>
        )}
      </div>
      <span className="text-[11px] leading-tight text-center max-w-[68px] truncate"
        style={{ color: "var(--app-label-color, rgba(255,255,255,0.85))" }}
      >
        {label}
      </span>
    </motion.button>
  );
}

export default function PhoneHomeScreen({
  onLogout, onToggleDark, isDark, currentTheme, onThemeChange,
}: Props) {
  const navigate = useNavigate();
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [sheetApp, setSheetApp] = useState<string | null>(null);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dayStr = now.toLocaleDateString([], { weekday: "long" });
  const dateNum = now.getDate();
  const monthStr = now.toLocaleDateString([], { month: "long" });

  const openSection = (id: string, path: string) => {
    setOpenApp(id);
    setTimeout(() => {
      navigate(path);
      setOpenApp(null);
    }, 500);
  };

  const openSheet = (id: string) => {
    setSheetApp(sheetApp === id ? null : id);
  };

  /* ── row 1: Weather widget + Calendar widget ────────── */
  const renderWidgets = () => (
    <div className="grid grid-cols-2 gap-3 mb-4 px-1">
      {/* Weather widget */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[22px] p-4 overflow-hidden relative"
        style={{ background: "linear-gradient(180deg, #3a7bd5 0%, #5ba3e6 100%)" }}
      >
        <p className="text-white/80 text-[11px] font-medium">Shundori</p>
        <div className="flex items-end gap-1 mt-1">
          <span className="text-white text-[42px] font-thin leading-none">24°</span>
          <div className="pb-1">
            <Cloud className="w-5 h-5 text-white/80" />
          </div>
        </div>
        <p className="text-white/70 text-[11px] mt-1">Partly Cloudy</p>
        <p className="text-white/50 text-[10px]">H:28° L:18°</p>
      </motion.div>

      {/* Calendar widget */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-[22px] p-4 overflow-hidden"
        style={{ background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.85)" }}
      >
        <p className="text-red-500 text-[10px] font-semibold uppercase tracking-wider">
          {dayStr}
        </p>
        <p className="text-foreground text-[42px] font-light leading-none mt-0.5">
          {dateNum}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <p className="text-foreground/60 text-[10px] truncate">A Special Day 🌸</p>
        </div>
      </motion.div>
    </div>
  );

  /* ── App grid ────────────────────────────────────────── */
  const gridApps = [
    // row 1
    { id: "photos", label: "Photos", gradient: "linear-gradient(135deg, #f5a623, #f7c948, #e8d44d, #7ec8e3, #5ba3e6, #d96ecf, #e85d75)", icon: <Image className="w-7 h-7 text-white" />, path: "/app/photos" },
    { id: "memories", label: "Memories", gradient: "linear-gradient(135deg, #ff6b9d, #c44569)", icon: <Heart className="w-7 h-7 text-white" />, path: "/app/memories" },
    { id: "jhogra", label: "Jhogra", gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)", icon: <MessageCircle className="w-7 h-7 text-white" />, path: "/app/jhogra" },
    { id: "camera", label: "Camera", gradient: "linear-gradient(135deg, #3a3a3a, #5a5a5a)", icon: <Camera className="w-7 h-7 text-white" />, path: "" },
    // row 2
    { id: "faceTime", label: "FaceTime", gradient: "linear-gradient(135deg, #43e97b, #38f9d7)", icon: <Video className="w-7 h-7 text-white" />, path: "" },
    { id: "calendar", label: "Calendar", gradient: "linear-gradient(180deg, #fff 50%, #fff) ", icon: <div className="flex flex-col items-center"><span className="text-[9px] text-red-500 font-semibold -mb-0.5">{dayStr.slice(0,3).toUpperCase()}</span><span className="text-[22px] text-foreground font-light leading-none">{dateNum}</span></div>, path: "", sheet: "calendar" },
    { id: "gifts", label: "Gifts", gradient: "linear-gradient(135deg, #f093fb, #f5576c)", icon: <Gift className="w-7 h-7 text-white" />, path: "/app/gifts" },
    { id: "first-meet", label: "First Meet", gradient: "linear-gradient(135deg, #4facfe, #00f2fe)", icon: <Clock className="w-7 h-7 text-white" />, path: "/app/first-meet" },
    // row 3
    { id: "mail", label: "Mail", gradient: "linear-gradient(135deg, #4a90d9, #357abd)", icon: <span className="text-white text-xl font-serif italic">@</span>, path: "" },
    { id: "notes", label: "Notes", gradient: "linear-gradient(180deg, #fef9c3, #fef08a)", icon: <FileText className="w-7 h-7 text-amber-600" />, path: "" },
    { id: "reminders", label: "Reminders", gradient: "linear-gradient(180deg, #fff, #f0f0f0)", icon: <Bell className="w-7 h-7 text-blue-500" />, path: "" },
    { id: "clock", label: "Clock", gradient: "linear-gradient(180deg, #1a1a1a, #333)", icon: <Clock className="w-7 h-7 text-white" />, path: "" },
    // row 4
    { id: "maps", label: "Maps", gradient: "linear-gradient(135deg, #74c69d, #40916c)", icon: <Compass className="w-7 h-7 text-white" />, path: "" },
    { id: "name-land", label: "Name on Land", gradient: "linear-gradient(135deg, #667eea, #764ba2)", icon: <MapPin className="w-7 h-7 text-white" />, path: "/app/name-on-land" },
    { id: "health", label: "Health", gradient: "linear-gradient(180deg, #fff, #fce4ec)", icon: <Heart className="w-7 h-7 text-red-500" />, path: "" },
    { id: "wallet", label: "Wallet", gradient: "linear-gradient(180deg, #1a1a1a, #2d2d2d)", icon: <Wallet className="w-7 h-7 text-white" />, path: "" },
    // row 5
    { id: "settings", label: "Settings", gradient: "linear-gradient(135deg, #8e8e93, #636366)", icon: <Settings className="w-7 h-7 text-white" />, path: "/app/settings" },
    { id: "appstore", label: "App Store", gradient: "linear-gradient(135deg, #4a90d9, #357abd)", icon: <span className="text-white text-2xl font-bold">A</span>, path: "" },
    { id: "tv", label: "TV", gradient: "linear-gradient(180deg, #1a1a1a, #2d2d2d)", icon: <Clapperboard className="w-7 h-7 text-white" />, path: "" },
    { id: "games", label: "Games", gradient: "linear-gradient(135deg, #34c759, #30b350)", icon: <Gamepad2 className="w-7 h-7 text-white" />, path: "" },
  ];

  const dockApps = [
    { id: "phone", label: "Phone", gradient: "linear-gradient(135deg, #34c759, #30b350)", icon: <PhoneCall className="w-7 h-7 text-white" /> },
    { id: "safari", label: "Safari", gradient: "linear-gradient(135deg, #007aff, #5ac8fa)", icon: <Safari className="w-7 h-7 text-white" /> },
    { id: "messages", label: "Messages", gradient: "linear-gradient(135deg, #34c759, #30d158)", icon: <MessageSquare className="w-7 h-7 text-white" /> },
    { id: "music", label: "Music", gradient: "linear-gradient(135deg, #fc3c44, #ff2d55)", icon: <Music className="w-7 h-7 text-white" /> },
  ];

  return (
    <div className="min-h-full flex flex-col relative overflow-hidden">
      {/* ── Wallpaper overlay ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 40%, #0d1b2a 100%)"
            : "linear-gradient(180deg, #e0ecff 0%, #b8d4f0 30%, #d4b8e8 60%, #f0d4e8 100%)",
          opacity: 0.35,
        }}
      />

      {/* ── Status bar ──────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-3 pb-1">
        <span className="text-[13px] font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>{timeStr}</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-[2px] items-end">
            {[3,5,7,9].map((h,i)=>(
              <div key={i} className="w-[3px] rounded-sm" style={{height:h, background: isDark ? "#fff" : "#000", opacity:0.5}} />
            ))}
          </div>
          <span className="text-[11px] font-medium ml-0.5" style={{color: isDark?"#fff":"#000"}}>5G</span>
          <div className="w-[22px] h-[11px] rounded-[3px] border relative ml-1"
            style={{borderColor: isDark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.35)"}}>
            <div className="absolute inset-[2px] rounded-[1.5px]" style={{width:"78%", background: isDark?"#34c759":"#34c759"}} />
          </div>
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pt-2 pb-4">
        {/* Widgets */}
        {renderWidgets()}

        {/* App grid — 4 cols */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 mb-5 px-1">
          {gridApps.map((app, i) => (
            <IosIcon
              key={app.id}
              gradient={app.gradient}
              label={app.label}
              animDelay={0.05 + i * 0.03}
              onTap={() => {
                if (app.sheet) { openSheet(app.sheet); return; }
                if (app.path) { openSection(app.id, app.path); }
              }}
            >
              {app.icon}
            </IosIcon>
          ))}
        </div>

        {/* Night mode + Logout row */}
        <div className="flex gap-3 px-1 mb-6">
          <button
            onClick={onToggleDark}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer transition-all"
            style={{
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: isDark ? "#e0e0e0" : "#333",
            }}
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            <span className="text-xs font-medium">{isDark ? "Light" : "Night"}</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer transition-all"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* ── Search bar ──────────────────────────────────── */}
      <div className="relative z-10 px-6 pb-2">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}
        >
          <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="text-xs opacity-30" style={{ color: isDark ? "#fff" : "#000" }}>Search</span>
        </div>
      </div>

      {/* ── Dock ────────────────────────────────────────── */}
      <div className="relative z-10 px-5 pb-4 pt-1">
        <div className="flex items-center justify-around rounded-[28px] px-4 py-3"
          style={{ background: isDark ? "rgba(30,30,40,0.75)" : "rgba(255,255,255,0.55)", backdropFilter: "blur(30px)" }}
        >
          {dockApps.map((app) => (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.82 }}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shadow-md"
                style={{ background: app.gradient }}
              >
                {app.icon}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Home indicator ──────────────────────────────── */}
      <div className="relative z-10 flex justify-center pb-2">
        <div className="w-[134px] h-[5px] rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }} />
      </div>

      {/* ── App opening overlay ─────────────────────────── */}
      <AnimatePresence>
        {openApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "var(--bg-color)" }}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="w-16 h-16 rounded-[18px] flex items-center justify-center shadow-lg"
                style={{ background: gridApps.find(a => a.id === openApp)?.gradient || "var(--accent-color)" }}
              >
                {gridApps.find(a => a.id === openApp)?.icon}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sheet popups (Calendar, etc) ────────────────── */}
      <AnimatePresence>
        {sheetApp === "calendar" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[90] rounded-t-[20px] p-5 pb-8"
            style={{
              background: isDark ? "#1c1c1e" : "#f2f2f7",
              boxShadow: "0 -4px 30px rgba(0,0,0,0.15)",
            }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4"
              style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }}
            />
            <p className="text-center text-sm font-semibold mb-4" style={{ color: isDark ? "#fff" : "#000" }}>
              Special Dates
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)" }}>
                <div className="w-11 h-11 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg">
                  {dateNum}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? "#fff" : "#000" }}>Today</p>
                  <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>A special day in your world</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: "var(--accent-color, #e8a0b4)" }}
                >
                  4
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? "#fff" : "#000" }}>May 2003</p>
                  <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>The day that matters most 🌸</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSheetApp(null)}
              className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", color: isDark ? "#fff" : "#000" }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
