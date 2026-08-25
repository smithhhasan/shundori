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
import MoreSection from "@/components/shundori/MoreSection";

export default function ShundoriApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("shundori-theme");
    return (saved && saved in THEMES) ? (saved as ThemeName) : DEFAULT_THEME;
  });

  const [customName, setCustomName] = useState(() =>
    localStorage.getItem("shundori-name") || appData.appName
  );

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("shundori-dark") === "true";
  });

  const isHomePage = location.pathname === "/app" || location.pathname === "/app/";
  const isSubPage = !isHomePage && location.pathname.startsWith("/app/");

  const handleThemeChange = useCallback((t: ThemeName) => {
    setTheme(t);
    localStorage.setItem("shundori-theme", t);
  }, []);

  const handleNameChange = useCallback((n: string) => {
    setCustomName(n);
    localStorage.setItem("shundori-name", n);
  }, []);

  const handleReset = useCallback(() => {
    setTheme(DEFAULT_THEME);
    setCustomName(appData.appName);
    setIsDark(false);
    localStorage.removeItem("shundori-theme");
    localStorage.removeItem("shundori-name");
    localStorage.removeItem("shundori-icon");
    localStorage.removeItem("shundori-dark");
    window.location.reload();
  }, []);

  const handleToggleDark = useCallback(() => {
    setIsDark((prev) => {
      localStorage.setItem("shundori-dark", String(!prev));
      return !prev;
    });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("shundori-logged-in");
    navigate("/");
  }, [navigate]);

  // Apply theme + dark mode CSS vars
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
    if (p === "/app/settings") return (
      <SettingsSection
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        customName={customName}
        onNameChange={handleNameChange}
        onReset={handleReset}
      />
    );
    if (p === "/app/more") return <MoreSection />;
    return <HomeSection />;
  };

  const dynamicIslandBg = isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.8)";
  const cardBg = isDark ? "rgba(26,26,46,0.6)" : "rgba(255,255,255,0.3)";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-color)", color: isDark ? "#e0e0e0" : undefined }}>
      {/* Dynamic Island header — only on sub-pages */}
      {isSubPage && (
        <div className="sticky top-0 z-50 flex justify-center pt-3 pb-1">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 126, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: dynamicIslandBg, height: 37 }}
          >
            <button
              onClick={() => navigate("/app")}
              className="flex items-center gap-1.5 px-4 text-white/80 text-xs font-medium cursor-pointer"
            >
              ← Home
            </button>
          </motion.div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {isHomePage ? (
              <PhoneHomeScreen
                onLogout={handleLogout}
                onToggleDark={handleToggleDark}
                isDark={isDark}
                currentTheme={theme}
                onThemeChange={handleThemeChange}
              />
            ) : (
              renderSection()
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom safe area spacer for dock */}
      {!isHomePage && (
        <div className="sticky bottom-0 z-40 pb-safe"
          style={{ background: `linear-gradient(to top, var(--bg-color), transparent)` }}
        />
      )}
    </div>
  );
}
