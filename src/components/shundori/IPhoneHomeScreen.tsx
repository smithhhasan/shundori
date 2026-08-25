import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Image, Heart, MessageCircle, Camera, Music, Clock,
  Cloud, MapPin, Bell, Settings, Star, Gift, BookOpen, Moon,
  Sun, LogOut, CalendarDays, Compass, Mic, Video, Wallet,
  ShieldCheck, FileText, Palette
} from "lucide-react";
import { useNavigate } from "react-router";
import { THEMES, type ThemeName, appData, DEFAULT_THEME } from "@/data/shundori-data";

interface PhoneHomeScreenProps {
  onLogout: () => void;
  onToggleDark: () => void;
  isDark: boolean;
  currentTheme: ThemeName;
  onThemeChange: (t: ThemeName) => void;
}

export default function PhoneHomeScreen({
  onLogout,
  onToggleDark,
  isDark,
  currentTheme,
  onThemeChange,
}: PhoneHomeScreenProps) {
  const navigate = useNavigate();
  const [showApp, setShowApp] = useState<string | null>(null);
  const [openApp, setOpenApp] = useState<string | null>(null);

  const apps = [
    { id: "home", label: "Home", icon: Home, path: "/app", color: "#e8a0b4" },
    { id: "photos", label: "Photos", icon: Image, path: "/app/photos", color: "#f48fb1" },
    { id: "memories", label: "Memories", icon: Heart, path: "/app/memories", color: "#ec407a" },
    { id: "jhogra", label: "Jhogra", icon: MessageCircle, path: "/app/jhogra", color: "#f06292" },
    { id: "first-meet", label: "First Meet", icon: Clock, path: "/app/first-meet", color: "#ce93d8" },
    { id: "gifts", label: "Gifts", icon: Gift, path: "/app/gifts", color: "#ba68c8" },
    { id: "name-land", label: "Name on Land", icon: MapPin, path: "/app/name-on-land", color: "#90caf9" },
    { id: "settings", label: "Settings", icon: Settings, path: "/app/settings", color: "#78909c" },
  ];

  const extraApps = [
    { id: "camera", label: "Camera", icon: Camera, color: "#455a64" },
    { id: "music", label: "Music", icon: Music, color: "#e91e63" },
    { id: "weather", label: "Weather", icon: Cloud, color: "#42a5f5" },
    { id: "calendar", label: "Calendar", icon: CalendarDays, color: "#ef5350" },
    { id: "notes", label: "Notes", icon: FileText, color: "#ffca28" },
    { id: "reminders", label: "Reminders", icon: Bell, color: "#ff7043" },
    { id: "maps", label: "Maps", icon: Compass, color: "#66bb6a" },
    { id: "voice", label: "Voice Memos", icon: Mic, color: "#ef5350" },
    { id: "video", label: "FaceTime", icon: Video, color: "#4caf50" },
    { id: "wallet", label: "Wallet", icon: Wallet, color: "#212121" },
    { id: "health", label: "Health", icon: ShieldCheck, color: "#ef5350" },
    { id: "books", label: "Books", icon: BookOpen, color: "#ffca28" },
    { id: "palette", label: "Themes", icon: Palette, color: "#ab47bc" },
    { id: "star", label: "Favorites", icon: Star, color: "#ffc107" },
  ];

  const handleAppTap = (app: typeof apps[0]) => {
    setOpenApp(app.id);
    setTimeout(() => {
      navigate(app.path);
      setOpenApp(null);
    }, 600);
  };

  const handleExtraTap = (app: typeof extraApps[0]) => {
    if (app.id === "palette") {
      setShowApp(showApp === "themes" ? null : "themes");
    } else if (app.id === "weather") {
      setShowApp(showApp === "weather" ? null : "weather");
    } else if (app.id === "music") {
      setShowApp(showApp === "music" ? null : "music");
    } else if (app.id === "calendar") {
      setShowApp(showApp === "calendar" ? null : "calendar");
    }
  };

  // Clock for dynamic time display
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-full px-5 py-4 pb-28 relative">
      {/* iPhone status bar */}
      <div className="flex items-center justify-between px-1 mb-6">
        <p className="text-xs font-semibold">{timeStr}</p>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-[2px]">
            {[4, 6, 8, 10].map((h, i) => (
              <div key={i} className="w-[3px] rounded-full" style={{ height: h, background: "var(--accent-color, #e8a0b4)", opacity: 0.6 }} />
            ))}
          </div>
          <span className="text-[10px] ml-1">5G</span>
          <div className="w-6 h-3 rounded-sm border border-current/40 relative ml-0.5">
            <div className="absolute inset-0.5 rounded-[1px]" style={{ width: "75%", background: "var(--accent-color, #e8a0b4)" }} />
          </div>
        </div>
      </div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground">
          {appData.personName.split(" ")[0]}'s World
        </h2>
        <p className="text-xs text-foreground/40 mt-0.5">Your private universe</p>
      </motion.div>

      {/* Main App Grid — 4 columns */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-5 mb-6">
        {apps.map((app, i) => {
          const Icon = app.icon;
          const isOpening = openApp === app.id;
          return (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{
                opacity: 1,
                scale: isOpening ? [1, 0.85, 1.05, 0.02] : 1,
              }}
              transition={{
                opacity: { delay: i * 0.06, duration: 0.3 },
                scale: isOpening
                  ? { duration: 0.5, times: [0, 0.3, 0.6, 1] }
                  : { delay: i * 0.06, type: "spring", stiffness: 300, damping: 20 },
              }}
              onClick={() => handleAppTap(app)}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div
                className="w-14 h-14 rounded-[16px] flex items-center justify-center shadow-sm"
                style={{ background: `${app.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: app.color }} />
              </div>
              <span className="text-[10px] text-foreground/60 font-medium truncate w-full text-center">
                {app.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-foreground/5 mb-5" />

      {/* Extra iPhone-style apps — names beside icons */}
      <div className="space-y-0.5">
        {extraApps.map((app, i) => {
          const Icon = app.icon;
          return (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleExtraTap(app)}
              className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${app.color}18` }}
              >
                <Icon className="w-4 h-4" style={{ color: app.color }} />
              </div>
              <span className="text-sm text-foreground/70 font-medium">{app.label}</span>
            </motion.button>
          );
        })}

        {/* Dark mode toggle */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + extraApps.length * 0.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-foreground/8">
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </div>
          <span className="text-sm text-foreground/70 font-medium">
            {isDark ? "Light Mode" : "Night Mode"}
          </span>
        </motion.button>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + (extraApps.length + 1) * 0.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-red-500/5 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-red-500/10">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-sm text-red-400/70 font-medium">Log Out</span>
        </motion.button>
      </div>

      {/* Inline app popups */}
      <AnimatePresence>
        {showApp === "themes" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-32 z-50 rounded-3xl p-5 shadow-2xl border border-white/20"
            style={{ background: "var(--card-color, #fff)" }}
          >
            <p className="text-sm font-semibold mb-3 text-foreground">Choose Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeName[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { onThemeChange(t); setShowApp(null); }}
                  className={`p-3 rounded-2xl text-xs font-medium text-center cursor-pointer border-2 transition-all ${
                    currentTheme === t ? "border-current shadow-md" : "border-transparent"
                  }`}
                  style={{
                    background: THEMES[t].gradient,
                    color: t === "midnight" ? "#fff" : "#333",
                  }}
                >
                  {THEMES[t].label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowApp(null)}
              className="w-full mt-3 py-2 text-xs text-foreground/40 cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        )}

        {showApp === "weather" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-32 z-50 rounded-3xl p-6 shadow-2xl text-center"
            style={{ background: "linear-gradient(180deg, #64b5f6, #42a5f5)" }}
          >
            <Cloud className="w-10 h-10 text-white mx-auto mb-2" />
            <p className="text-white text-4xl font-light">24°</p>
            <p className="text-white/70 text-sm mt-1">Partly Cloudy — Perfect for you ☁️</p>
            <button onClick={() => setShowApp(null)} className="mt-4 py-2 text-xs text-white/50 cursor-pointer">Close</button>
          </motion.div>
        )}

        {showApp === "music" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-32 z-50 rounded-3xl p-5 shadow-2xl border border-white/20"
            style={{ background: "var(--card-color, #fff)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl" style={{ background: "var(--accent-color, #e8a0b4)" }}>
                ♡
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Shundori</p>
                <p className="text-xs text-foreground/40">Background Music</p>
              </div>
            </div>
            <p className="text-[10px] text-foreground/30 text-center italic">Music controls coming soon ✨</p>
            <button onClick={() => setShowApp(null)} className="w-full mt-3 py-2 text-xs text-foreground/40 cursor-pointer">Close</button>
          </motion.div>
        )}

        {showApp === "calendar" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-32 z-50 rounded-3xl p-5 shadow-2xl border border-white/20"
            style={{ background: "var(--card-color, #fff)" }}
          >
            <p className="text-sm font-semibold text-foreground mb-2">Special Dates</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-2 border-b border-foreground/5">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-sm font-bold text-red-400">
                  {new Date().getDate()}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Today</p>
                  <p className="text-[10px] text-foreground/40">A special day in your world</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]20 flex items-center justify-center text-sm font-bold" style={{ color: "var(--accent-color)" }}>
                  4
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">May 2003</p>
                  <p className="text-[10px] text-foreground/40">The day that matters most 🌸</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowApp(null)} className="w-full mt-3 py-2 text-xs text-foreground/40 cursor-pointer">Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
