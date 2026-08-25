import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import { Home, Image, Heart, MoreHorizontal, ChevronRight, LogOut } from "lucide-react";
import { THEMES, type ThemeName, appData, DEFAULT_THEME } from "@/data/shundori-data";
import HomeSection from "@/components/shundori/HomeSection";
import PhotosSection from "@/components/shundori/PhotosSection";
import MemoriesSection from "@/components/shundori/MemoriesSection";
import JhograSection from "@/components/shundori/JhograSection";
import FirstMeetSection from "@/components/shundori/FirstMeetSection";
import GiftsSection from "@/components/shundori/GiftsSection";
import NameOnLandSection from "@/components/shundori/NameOnLandSection";
import SettingsSection from "@/components/shundori/SettingsSection";

const TABS = [
  { key: "home", label: "Home", icon: Home, path: "/app" },
  { key: "photos", label: "Photos", icon: Image, path: "/app/photos" },
  { key: "memories", label: "Memories", icon: Heart, path: "/app/memories" },
  { key: "more", label: "More", icon: MoreHorizontal, path: "/app/more" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function getTab(pathname: string): TabKey {
  if (pathname === "/app" || pathname === "/app/") return "home";
  if (pathname.startsWith("/app/photos")) return "photos";
  if (pathname.startsWith("/app/memories")) return "memories";
  return "more";
}

export default function ShundoriApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/app" || location.pathname === "/app/";
  const activeTab = getTab(location.pathname);

  const [theme, setTheme] = useState<ThemeName>(() => {
    const s = localStorage.getItem("shundori-theme");
    return (s && s in THEMES) ? (s as ThemeName) : DEFAULT_THEME;
  });
  const [customName, setCustomName] = useState(() => localStorage.getItem("shundori-name") || appData.appName);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("shundori-dark") === "true");

  // Session check
  useEffect(() => {
    if (!localStorage.getItem("shundori-auth")) navigate("/", { replace: true });
  }, [navigate]);

  const handleThemeChange = useCallback((t: ThemeName) => {
    setTheme(t);
    localStorage.setItem("shundori-theme", t);
  }, []);

  const handleNameChange = useCallback((n: string) => {
    setCustomName(n);
    localStorage.setItem("shundori-name", n);
  }, []);

  const handleToggleDark = useCallback(() => {
    setIsDark((p) => { localStorage.setItem("shundori-dark", String(!p)); return !p; });
  }, []);

  const handleReset = useCallback(() => {
    setTheme(DEFAULT_THEME);
    setCustomName(appData.appName);
    setIsDark(false);
    ["shundori-theme", "shundori-name", "shundori-icon", "shundori-dark"].forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("shundori-auth");
    navigate("/", { replace: true });
  }, [navigate]);

  // Apply theme
  useEffect(() => {
    const t = THEMES[theme];
    document.documentElement.style.setProperty("--accent-color", t.accent);
    document.documentElement.style.setProperty("--bg-color", t.bg);
    document.body.style.background = isDark ? "#000" : t.bg;
    document.body.style.color = isDark ? "#f2f2f7" : "#1c1c1e";
  }, [theme, isDark]);

  const renderPage = () => {
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
        isDark={isDark}
        onToggleDark={handleToggleDark}
      />
    );
    if (p === "/app/more") return <MorePage onNavigate={navigate} />;
    return <HomeSection customName={customName} />;
  };

  const isSubPage = !isHome && activeTab === "more";

  return (
    <div className="min-h-screen flex flex-col" style={{ maxWidth: "480px", margin: "0 auto", position: "relative" }}>
      {/* Status bar spacing */}
      <div className="h-3" />

      {/* Header */}
      <div className="px-5 pt-2 pb-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {isSubPage ? (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("/app")} className="text-xs cursor-pointer bg-transparent border-none"
                  style={{ color: "var(--accent-color, #e8a0b4)" }}
                >
                  ← Home
                </button>
              </div>
            ) : (
              <h1 className="text-[28px] font-bold tracking-tight"
                style={{ color: isDark ? "#f2f2f7" : "#1c1c1e", letterSpacing: "-0.02em" }}
              >
                {activeTab === "home" ? "Home" : activeTab === "photos" ? "Photos" : activeTab === "memories" ? "Memories" : "More"}
              </h1>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <div className="flex items-center justify-around py-2 pb-5 px-4"
          style={{
            background: isDark ? "rgba(28,28,30,0.88)" : "rgba(255,255,255,0.88)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer bg-transparent border-none"
              >
                <Icon className="w-[22px] h-[22px]"
                  style={{ color: active ? "var(--accent-color, #e8a0b4)" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)" }}
                />
                <span className="text-[10px] font-medium"
                  style={{ color: active ? "var(--accent-color, #e8a0b4)" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* ── More page (sub-sections list) ──────────────────── */
function MorePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const isDark = localStorage.getItem("shundori-dark") === "true";

  const items = [
    { label: "Jhogra", desc: "The fun moments", path: "/app/jhogra" },
    { label: "First Meet", desc: "Where it began", path: "/app/first-meet" },
    { label: "Gifts", desc: "Surprises for you", path: "/app/gifts" },
    { label: "Your Name on Land", desc: "Written across the world", path: "/app/name-on-land" },
    { label: "Settings", desc: "Appearance, name, icon", path: "/app/settings" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("shundori-auth");
    onNavigate("/");
  };

  return (
    <div className="px-5 pt-2">
      <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
        {items.map((item, i) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer bg-transparent border-none text-left"
            style={{
              borderBottom: i < items.length - 1
                ? isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
                : "none",
            }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>{item.label}</p>
              <p className="text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl cursor-pointer bg-transparent border-none"
          style={{ color: "#ef4444" }}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
