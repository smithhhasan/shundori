import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import { THEMES, type ThemeName, appData, DEFAULT_THEME } from "@/data/shundori-data";
import PhoneHomeScreen from "@/components/shundori/IPhoneHomeScreen";
import HomeSection from "@/components/shundori/HomeSection";
import PhotosSection from "@/components/shundori/PhotosSection";
import MemoriesSection from "@/components/shundori/MemoriesSection";
import JhograSection from "@/components/shundori/JhograSection";
import FirstMeetSection from "@/components/shundori/FirstMeetSection";
import GiftsSection from "@/components/shundori/GiftsSection";
import NameOnLandSection from "@/components/shundori/NameOnLandSection";
import SettingsSection from "@/components/shundori/SettingsSection";

export default function ShundoriApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<ThemeName>(() => { const s = localStorage.getItem("shundori-theme"); return (s && s in THEMES) ? (s as ThemeName) : DEFAULT_THEME; });
  const [customName, setCustomName] = useState(() => localStorage.getItem("shundori-name") || appData.appName);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("shundori-dark") === "true");

  const isHomePage = location.pathname === "/app" || location.pathname === "/app/";
  const isSubPage = !isHomePage && location.pathname.startsWith("/app/");

  const handleThemeChange = useCallback((t: ThemeName) => { setTheme(t); localStorage.setItem("shundori-theme", t); }, []);
  const handleNameChange = useCallback((n: string) => { setCustomName(n); localStorage.setItem("shundori-name", n); }, []);
  const handleToggleDark = useCallback(() => { setIsDark((p) => { localStorage.setItem("shundori-dark", String(!p)); return !p; }); }, []);
  const handleReset = useCallback(() => { setTheme(DEFAULT_THEME); setCustomName(appData.appName); setIsDark(false); ["shundori-theme", "shundori-name", "shundori-icon", "shundori-dark"].forEach((k) => localStorage.removeItem(k)); window.location.reload(); }, []);
  const handleLogout = useCallback(() => { localStorage.removeItem("shundori-logged-in"); navigate("/"); }, [navigate]);

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
      document.body.style.color = theme === "midnight" ? "#f0f0f0" : "#1a1a2e";
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
    if (p === "/app/settings") return <SettingsSection currentTheme={theme} onThemeChange={handleThemeChange} customName={customName} onNameChange={handleNameChange} onReset={handleReset} isDark={isDark} onToggleDark={handleToggleDark} />;
    if (p === "/app/more") return <MoreSection onNavigate={navigate} />;
    return <HomeSection />;
  };

  const dynamicIslandBg = isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.8)";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-color)", color: isDark ? "#e0e0e0" : undefined }}>
      {isSubPage && (
        <div className="sticky top-0 z-50 flex justify-center pt-3 pb-1">
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 126, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: dynamicIslandBg, height: 37 }}>
            <button onClick={() => navigate("/app")} className="flex items-center gap-1.5 px-4 text-white/80 text-xs font-medium cursor-pointer">← Home</button>
          </motion.div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            {isHomePage ? (
              <PhoneHomeScreen onLogout={handleLogout} onToggleDark={handleToggleDark} isDark={isDark} currentTheme={theme} onThemeChange={handleThemeChange} />
            ) : renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isHomePage && (
        <div className="sticky bottom-0 z-40 pb-safe" style={{ background: "linear-gradient(to top, var(--bg-color), transparent)" }} />
      )}
    </div>
  );
}

function MoreSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const isDark = localStorage.getItem("shundori-dark") === "true";
  const items = [
    { label: "First Meet", desc: "Where it began", path: "/app/first-meet" },
    { label: "Gifts", desc: "Surprises for you", path: "/app/gifts" },
    { label: "Your Name on Land", desc: "Written across the world", path: "/app/name-on-land" },
    { label: "Settings", desc: "Appearance, name, icon", path: "/app/settings" },
  ];
  return (
    <div className="px-5 py-6">
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-6" style={{ color: "var(--accent-color, #e8a0b4)" }}>More</motion.h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.button key={item.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }} whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(item.path)}
            className="w-full flex items-center justify-between p-4 rounded-2xl cursor-pointer bg-transparent border-none text-left"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
            <div>
              <p className="font-semibold text-sm" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{item.label}</p>
              <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{item.desc}</p>
            </div>
            <span className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>→</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
