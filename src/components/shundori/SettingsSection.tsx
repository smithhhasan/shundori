import { motion } from "framer-motion";
import { THEMES, type ThemeName, appData } from "@/data/shundori-data";
import { Palette, Type, Image, RotateCcw, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface SettingsProps {
  currentTheme: ThemeName;
  onThemeChange: (t: ThemeName) => void;
  customName: string;
  onNameChange: (n: string) => void;
  onReset: () => void;
}

export default function SettingsSection({
  currentTheme,
  onThemeChange,
  customName,
  onNameChange,
  onReset,
}: SettingsProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(customName);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("shundori-dark") === "true");

  useEffect(() => setNameValue(customName), [customName]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("shundori-dark", String(next));
    window.location.reload();
  };

  const cardClass = "backdrop-blur-lg rounded-3xl p-5 shadow-sm border";
  const cardStyle = {
    background: isDark ? "rgba(26,26,46,0.6)" : "rgba(255,255,255,0.5)",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.3)",
  };

  return (
    <div className="min-h-full px-4 py-6 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-6"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        Settings
      </motion.h2>

      <div className="space-y-4">
        {/* Night Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardClass} ${cardStyle}`}
        >
          <button
            onClick={toggleDark}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
              <h3 className="font-semibold text-sm" style={{ color: isDark ? "#e0e0e0" : undefined }}>
                Night Mode
              </h3>
            </div>
            <div
              className={`w-11 h-6 rounded-full relative transition-colors ${isDark ? "bg-[var(--accent-color)]" : "bg-foreground/10"}`}
            >
              <motion.div
                animate={{ x: isDark ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </div>
          </button>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${cardClass} ${cardStyle}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-4 h-4 text-foreground/40" />
            <h3 className="font-semibold text-sm" style={{ color: isDark ? "#e0e0e0" : undefined }}>Appearance</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(THEMES) as ThemeName[]).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`p-3 rounded-2xl text-xs font-medium text-center transition-all cursor-pointer border-2 ${
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
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardClass} ${cardStyle}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Type className="w-4 h-4 text-foreground/40" />
            <h3 className="font-semibold text-sm" style={{ color: isDark ? "#e0e0e0" : undefined }}>App Name</h3>
          </div>
          {editingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color,#e8a0b4)]/40"
                style={{
                  background: isDark ? "rgba(26,26,46,0.8)" : "rgba(255,255,255,0.6)",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.4)",
                  color: isDark ? "#e0e0e0" : undefined,
                }}
              />
              <button
                onClick={() => { onNameChange(nameValue); setEditingName(false); }}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer"
                style={{ background: "var(--accent-color, #e8a0b4)" }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: isDark ? "rgba(26,26,46,0.8)" : "rgba(255,255,255,0.4)",
                color: isDark ? "#e0e0e0" : undefined,
              }}
            >
              {customName || appData.appName} →
            </button>
          )}
        </motion.div>

        {/* App Icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${cardClass} ${cardStyle}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Image className="w-4 h-4 text-foreground/40" />
            <h3 className="font-semibold text-sm" style={{ color: isDark ? "#e0e0e0" : undefined }}>App Icon</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: isDark ? "rgba(255,255,255,0.3)" : undefined }}>
            Current: <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : undefined }}>
              {localStorage.getItem("shundori-icon") || "✦"}
            </span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {["✦", "♡", "🌸", "🦋", "🌙", "⭐", "💫", "🌺", "💝", "🎨"].map((icon) => (
              <button
                key={icon}
                onClick={() => {
                  localStorage.setItem("shundori-icon", icon);
                  window.location.reload();
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors cursor-pointer"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)" }}
              >
                {icon}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Reset */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-medium transition-colors cursor-pointer"
            style={{
              borderColor: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.2)",
              color: isDark ? "rgba(239,68,68,0.6)" : "rgba(239,68,68,0.5)",
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to default
          </button>
        </motion.div>
      </div>
    </div>
  );
}
