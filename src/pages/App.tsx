import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import { THEMES, type ThemeName, appData, DEFAULT_THEME, STORAGE } from "@/data/shundori-data";
import { PersistentIsland } from "@/components/shundori/DynamicIsland";
import PhoneHomeScreen from "@/components/shundori/IPhoneHomeScreen";
import HomeSection from "@/components/shundori/HomeSection";
import PhotosSection from "@/components/shundori/PhotosSection";
import MemoriesSection from "@/components/shundori/MemoriesSection";
import JhograSection from "@/components/shundori/JhograSection";
import FirstMeetSection from "@/components/shundori/FirstMeetSection";
import GiftsSection from "@/components/shundori/GiftsSection";
import NameOnLandSection from "@/components/shundori/NameOnLandSection";
import SettingsSection from "@/components/shundori/SettingsSection";

function getContextFromPath(pathname: string): string {
  if (pathname === "/app/photos") return "Viewing: Photos";
  if (pathname === "/app/memories") return "Viewing: Memories";
  if (pathname === "/app/jhogra") return "Viewing: Jhogra";
  if (pathname === "/app/first-meet") return "Viewing: First Meet";
  if (pathname === "/app/gifts") return "Viewing: Gifts";
  if (pathname === "/app/name-on-land") return "Viewing: Name on Land";
  if (pathname === "/app/settings") return "Viewing: Settings";
  if (pathname === "/app/more") return "Viewing: More";
  return "";
}

export default function ShundoriApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<ThemeName>(() => {
    const s = localStorage.getItem(STORAGE.theme);
    return (s && s in THEMES) ? (s as ThemeName) : DEFAULT_THEME;
  });
  const [customName, setCustomName] = useState(() => localStorage.getItem(STORAGE.appName) || appData.appName);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(STORAGE.darkMode) === "true");
  const [sessionTimeout, setSessionTimeout] = useState(() => parseInt(localStorage.getItem(STORAGE.sessionTimeout) || "0", 10));
  const lastActivity = useRef(0);

  const isHomePage = location.pathname === "/app" || location.pathname === "/app/";
  const isSubPage = !isHomePage && location.pathname.startsWith("/app/");

  // Left-edge swipe back gesture (iPhone-style)
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX < 20) swipeStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - swipeStart.current.x;
    const dy = Math.abs(touch.clientY - swipeStart.current.y);
    swipeStart.current = null;
    if (dx > 80 && dy < 60) navigate("/app");
  }, [navigate]);

  // Session check
  useEffect(() => {
    if (!localStorage.getItem(STORAGE.auth)) navigate("/", { replace: true });
  }, [navigate]);

  // Initialize lastActivity on mount
  useEffect(() => { lastActivity.current = Date.now(); }, []);

  // Session timeout
  useEffect(() => {
    if (sessionTimeout <= 0) return;
    const check = setInterval(() => {
      if (Date.now() - lastActivity.current > sessionTimeout * 60 * 1000) {
        localStorage.removeItem(STORAGE.auth);
        navigate("/", { replace: true });
      }
    }, 30000);
    const reset = () => { lastActivity.current = Date.now(); };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("touchstart", reset);
    return () => { clearInterval(check); window.removeEventListener("mousemove", reset); window.removeEventListener("keydown", reset); window.removeEventListener("touchstart", reset); };
  }, [sessionTimeout, navigate]);

  const handleThemeChange = useCallback((t: ThemeName) => { setTheme(t); localStorage.setItem(STORAGE.theme, t); }, []);
  const handleNameChange = useCallback((n: string) => { setCustomName(n); localStorage.setItem(STORAGE.appName, n); }, []);
  const handleToggleDark = useCallback(() => { setIsDark((p) => { localStorage.setItem(STORAGE.darkMode, String(!p)); return !p; }); }, []);
  const handleReset = useCallback(() => {
    setTheme(DEFAULT_THEME); setCustomName(appData.appName); setIsDark(false);
    Object.values(STORAGE).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  }, []);
  const handleLogout = useCallback(() => { localStorage.removeItem(STORAGE.auth); navigate("/"); }, [navigate]);
  const handleReLock = useCallback(() => { localStorage.removeItem(STORAGE.auth); navigate("/"); }, [navigate]);
  const handleSessionTimeoutChange = useCallback((minutes: number) => {
    setSessionTimeout(minutes);
    localStorage.setItem(STORAGE.sessionTimeout, String(minutes));
  }, []);
  const handleExport = useCallback(() => {
    const data = {
      photos: JSON.parse(localStorage.getItem(STORAGE.photos) || "[]"),
      favorites: JSON.parse(localStorage.getItem(STORAGE.favorites) || "[]"),
      recentApps: JSON.parse(localStorage.getItem(STORAGE.recentApps) || "[]"),
      appName: localStorage.getItem(STORAGE.appName),
      theme: localStorage.getItem(STORAGE.theme),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "shundori-backup.json"; a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Apply theme
  useEffect(() => {
    const t = THEMES[theme];
    document.documentElement.style.setProperty("--accent-color", t.accent);
    document.documentElement.style.setProperty("--bg-color", t.bg);
    document.documentElement.style.setProperty("--card-color", t.card);
    if (isDark) {
      document.documentElement.style.setProperty("--bg-color", "#0d0d1a");
      document.documentElement.style.setProperty("--card-color", "#1a1a2e");
      document.body.style.background = "#0d0d1a";
      document.body.style.color = "#e0e0e0";
      document.documentElement.classList.add("dark");
    } else {
      document.body.style.background = t.bg;
      document.body.style.color = theme === "midnight" ? "#f0f0f0" : "#1c1c1e";
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isDark]);

  const renderSection = () => {
    const p = location.pathname;
    if (p === "/app/photos") return <PhotosSection />;
    if (p === "/app/memories") return <MemoriesSection />;
    if (p === "/app/jhogra") return <JhograSection />;
    if (p === "/app/first-meet") return <FirstMeetSection />;
    if (p === "/app/gifts") return <GiftsSection />;
    if (p === "/app/name-on-land") return <NameOnLandSection />;
    if (p === "/app/settings") return (
      <SettingsSection currentTheme={theme} onThemeChange={handleThemeChange} customName={customName}
        onNameChange={handleNameChange} onReset={handleReset} isDark={isDark} onToggleDark={handleToggleDark}
        onReLock={handleReLock} sessionTimeout={sessionTimeout} onSessionTimeoutChange={handleSessionTimeoutChange}
        onExport={handleExport} />
    );
    if (p === "/app/more") return <MorePage onNavigate={navigate} />;
    return <HomeSection />;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-color)", color: isDark ? "#e0e0e0" : undefined, maxWidth: "480px", margin: "0 auto", position: "relative" }}
      onTouchStart={isSubPage ? handleTouchStart : undefined}
      onTouchEnd={isSubPage ? handleTouchEnd : undefined}>
      {/* Persistent Dynamic Island */}
      {isSubPage && <PersistentIsland context={getContextFromPath(location.pathname)} />}

      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            {isHomePage ? (
              <PhoneHomeScreen onLogout={handleLogout} onToggleDark={handleToggleDark} isDark={isDark} currentTheme={theme} onThemeChange={handleThemeChange} />
            ) : renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav for sub-pages */}
      {isSubPage && (
        <div className="fixed bottom-0 left-0 right-0 z-50" style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div className="flex items-center justify-around py-2 pb-5 px-4"
            style={{ background: isDark ? "rgba(28,28,30,0.88)" : "rgba(255,255,255,0.88)", backdropFilter: "blur(30px)", borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
            {[
              { label: "Home", path: "/app" },
              { label: "Photos", path: "/app/photos" },
              { label: "Memories", path: "/app/memories" },
              { label: "More", path: "/app/more" },
            ].map((tab) => {
              const active = location.pathname.startsWith(tab.path) && (tab.path === "/app" ? location.pathname === "/app" : true);
              return (
                <button key={tab.path} onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer bg-transparent border-none">
                  <span className="text-[10px] font-medium"
                    style={{ color: active ? "var(--accent-color, #d99aa3)" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)" }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MorePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const items = [
    { label: "First Meet", desc: "Where it began", path: "/app/first-meet" },
    { label: "Gifts", desc: "Surprises for you", path: "/app/gifts" },
    { label: "Your Name on Land", desc: "Written across the world", path: "/app/name-on-land" },
    { label: "Settings", desc: "Appearance, name, icon", path: "/app/settings" },
  ];
  return (
    <div className="px-5 py-6">
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-6" style={{ color: "var(--accent-color, #d99aa3)" }}>More</motion.h2>
      <div className="space-y-2 rounded-2xl overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
        {items.map((item, i) => (
          <button key={item.path} onClick={() => onNavigate(item.path)}
            className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer bg-transparent border-none text-left"
            style={{ borderBottom: i < items.length - 1 ? (isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)") : "none" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{item.label}</p>
              <p className="text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{item.desc}</p>
            </div>
            <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
