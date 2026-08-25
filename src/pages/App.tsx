import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import { Home, Image, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { THEMES, type ThemeName, appData, DEFAULT_THEME } from "@/data/shundori-data";
import HomeSection from "@/components/shundori/HomeSection";
import PhotosSection from "@/components/shundori/PhotosSection";
import MemoriesSection from "@/components/shundori/MemoriesSection";
import JhograSection from "@/components/shundori/JhograSection";
import FirstMeetSection from "@/components/shundori/FirstMeetSection";
import GiftsSection from "@/components/shundori/GiftsSection";
import NameOnLandSection from "@/components/shundori/NameOnLandSection";
import SettingsSection from "@/components/shundori/SettingsSection";
import MoreSection from "@/components/shundori/MoreSection";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home, path: "/app" },
  { key: "photos", label: "Photos", icon: Image, path: "/app/photos" },
  { key: "memories", label: "Memories", icon: Heart, path: "/app/memories" },
  { key: "jhogra", label: "Jhogra", icon: MessageCircle, path: "/app/jhogra" },
  { key: "more", label: "More", icon: MoreHorizontal, path: "/app/more" },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"];

function getNavKeyFromPath(pathname: string): NavKey {
  if (pathname === "/app" || pathname === "/app/") return "home";
  if (pathname.startsWith("/app/photos")) return "photos";
  if (pathname.startsWith("/app/memories")) return "memories";
  if (pathname.startsWith("/app/jhogra")) return "jhogra";
  return "more";
}

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

  const activeNav = getNavKeyFromPath(location.pathname);
  const isSubPage = location.pathname !== "/app" && !NAV_ITEMS.some((n) => n.path === location.pathname);

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
    localStorage.removeItem("shundori-theme");
    localStorage.removeItem("shundori-name");
    localStorage.removeItem("shundori-icon");
    window.location.reload();
  }, []);

  const renderSection = () => {
    const p = location.pathname;
    if (p === "/app" || p === "/app/") return <HomeSection />;
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

  // Apply theme CSS vars
  useEffect(() => {
    const t = THEMES[theme];
    document.documentElement.style.setProperty("--accent-color", t.accent);
    document.documentElement.style.setProperty("--bg-color", t.bg);
    document.documentElement.style.setProperty("--card-color", t.card);
    document.body.style.background = t.bg;
    document.body.style.color = theme === "midnight" ? "#f0f0f0" : "#1a1a2e";
  }, [theme]);

  const showNav = !isSubPage || location.pathname === "/app";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-color)" }}>
      {/* Header */}
      <AnimatePresence mode="wait">
        <motion.header
          key={location.pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sticky top-0 z-40 backdrop-blur-xl bg-white/30 border-b border-white/20 px-4 py-3"
        >
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {isSubPage && location.pathname !== "/app" && location.pathname !== "/app/more" ? (
              <button
                onClick={() => navigate("/app/more")}
                className="text-sm text-foreground/50 hover:text-foreground/70 cursor-pointer"
              >
                ← More
              </button>
            ) : (
              <div />
            )}
            <h1
              className="text-lg font-serif font-semibold"
              style={{ color: "var(--accent-color, #e8a0b4)" }}
            >
              {customName || appData.appName}
            </h1>
            <div className="w-12" />
          </div>
        </motion.header>
      </AnimatePresence>

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
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 z-40 backdrop-blur-xl bg-white/40 border-t border-white/20 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto py-2 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer transition-all"
              >
                <motion.div
                  animate={{ scale: active ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors"
                    style={{ color: active ? "var(--accent-color, #e8a0b4)" : "currentColor" }}
                  />
                </motion.div>
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: active ? "var(--accent-color, #e8a0b4)" : "currentColor", opacity: active ? 1 : 0.4 }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
