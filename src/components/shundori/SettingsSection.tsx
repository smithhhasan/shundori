import { motion } from "framer-motion";
import { THEMES, type ThemeName, appData } from "@/data/shundori-data";
import { Palette, Type, Image, RotateCcw } from "lucide-react";
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

  useEffect(() => setNameValue(customName), [customName]);

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
        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-3xl p-5 shadow-sm border border-white/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-4 h-4 text-foreground/40" />
            <h3 className="font-semibold text-foreground text-sm">Appearance</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(THEMES) as ThemeName[]).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`p-3 rounded-2xl text-xs font-medium text-center transition-all cursor-pointer border-2 ${
                  currentTheme === t
                    ? "border-current shadow-md"
                    : "border-transparent"
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
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-lg rounded-3xl p-5 shadow-sm border border-white/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Type className="w-4 h-4 text-foreground/40" />
            <h3 className="font-semibold text-foreground text-sm">App Name</h3>
          </div>
          {editingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/60 border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color,#e8a0b4)]/40"
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
              className="w-full text-left px-4 py-2.5 rounded-xl bg-white/40 text-sm text-foreground/60 cursor-pointer hover:bg-white/60 transition-colors"
            >
              {customName || appData.appName} →
            </button>
          )}
        </motion.div>

        {/* App Icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-lg rounded-3xl p-5 shadow-sm border border-white/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Image className="w-4 h-4 text-foreground/40" />
            <h3 className="font-semibold text-foreground text-sm">App Icon</h3>
          </div>
          <p className="text-foreground/40 text-xs mb-3">
            Current: <span className="text-foreground/60">✦</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {["✦", "♡", "🌸", "🦋", "🌙", "⭐", "💫", "🌺", "💝", "🎨"].map((icon) => (
              <button
                key={icon}
                onClick={() => {
                  localStorage.setItem("shundori-icon", icon);
                  window.location.reload();
                }}
                className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center text-lg hover:bg-white/80 transition-colors cursor-pointer"
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
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-300/40 text-red-400/70 text-sm font-medium hover:bg-red-50/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to default
          </button>
        </motion.div>
      </div>
    </div>
  );
}
