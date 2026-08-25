import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { THEMES, type ThemeName, appData, STORAGE } from "@/data/shundori-data";
import { Palette, Type, Sun, Moon, RotateCcw, LogOut, Lock, Clock, Download } from "lucide-react";

interface Props {
  currentTheme: ThemeName; onThemeChange: (t: ThemeName) => void;
  customName: string; onNameChange: (n: string) => void; onReset: () => void;
  isDark: boolean; onToggleDark: () => void;
  onReLock: () => void; sessionTimeout: number; onSessionTimeoutChange: (m: number) => void;
  onExport: () => void;
}

export default function SettingsSection({
  currentTheme, onThemeChange, customName, onNameChange, onReset,
  isDark, onToggleDark, onReLock, sessionTimeout, onSessionTimeoutChange, onExport,
}: Props) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(customName);
  useEffect(() => setNameVal(customName), [customName]);

  const bg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const border = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const text = isDark ? "#f2f2f7" : "#1c1c1e";
  const sub = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

  return (
    <div className="px-5 pt-2 pb-4 space-y-4">
      {/* Night Mode */}
      <Section bg={bg} border={border}>
        <button onClick={onToggleDark} className="w-full flex items-center justify-between py-3 px-0 cursor-pointer bg-transparent border-none"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}>
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-yellow-500" />}
            <span className="text-sm font-medium" style={{ color: text }}>Night Mode</span>
          </div>
          <div className="w-11 h-6 rounded-full relative transition-colors"
            style={{ background: isDark ? "var(--accent-color, #d99aa3)" : "rgba(0,0,0,0.12)" }}>
            <motion.div animate={{ x: isDark ? 20 : 2 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" />
          </div>
        </button>
      </Section>

      {/* Appearance */}
      <Section bg={bg} border={border}>
        <div className="px-0 py-2">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4" style={{ color: sub }} />
            <span className="text-xs font-medium" style={{ color: sub }}>Appearance</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(THEMES) as ThemeName[]).map((t) => (
              <button key={t} onClick={() => onThemeChange(t)}
                className="p-3 rounded-xl text-xs font-medium text-center cursor-pointer border-2 transition-all"
                style={{ background: THEMES[t].gradient, color: t === "midnight" ? "#fff" : "#333", borderColor: currentTheme === t ? "var(--accent-color)" : "transparent" }}>
                {THEMES[t].label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* App Name */}
      <Section bg={bg} border={border}>
        <div className="px-0 py-2">
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-4 h-4" style={{ color: sub }} />
            <span className="text-xs font-medium" style={{ color: sub }}>App Name</span>
          </div>
          {editingName ? (
            <div className="flex gap-2">
              <input type="text" value={nameVal} onChange={(e) => setNameVal(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm border-none outline-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: text }} />
              <button onClick={() => { onNameChange(nameVal); setEditingName(false); }}
                className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold cursor-pointer border-none"
                style={{ background: "var(--accent-color, #d99aa3)" }}>Save</button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm cursor-pointer bg-transparent border-none"
              style={{ color: text }}>{customName || appData.appName}</button>
          )}
        </div>
      </Section>

      {/* App Icon */}
      <Section bg={bg} border={border}>
        <div className="px-0 py-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium" style={{ color: sub }}>App Icon</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["✦","♡","🌸","🦋","🌙","⭐","💫","🌺","💝","🎨"].map((icon) => (
              <button key={icon}
                onClick={() => { localStorage.setItem(STORAGE.appIcon, icon); window.location.reload(); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg cursor-pointer border-none"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>{icon}</button>
            ))}
          </div>
        </div>
      </Section>

      {/* Security */}
      <Section bg={bg} border={border}>
        <div className="px-0 py-2 space-y-3">
          <p className="text-xs font-medium" style={{ color: sub }}>Security</p>

          <button onClick={onReLock}
            className="w-full flex items-center gap-3 py-2 cursor-pointer bg-transparent border-none">
            <Lock className="w-4 h-4" style={{ color: "var(--accent-color, #d99aa3)" }} />
            <span className="text-sm" style={{ color: text }}>Re-lock now</span>
          </button>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4" style={{ color: "var(--accent-color, #d99aa3)" }} />
              <span className="text-sm" style={{ color: text }}>Auto-lock timeout</span>
            </div>
            <select value={sessionTimeout} onChange={(e) => onSessionTimeoutChange(Number(e.target.value))}
              className="text-xs px-2 py-1 rounded-lg border-none outline-none cursor-pointer"
              style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: text }}>
              <option value={0}>Off</option>
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Data */}
      <Section bg={bg} border={border}>
        <div className="px-0 py-2">
          <p className="text-xs font-medium mb-2" style={{ color: sub }}>Data</p>
          <button onClick={onExport}
            className="w-full flex items-center gap-3 py-2 cursor-pointer bg-transparent border-none">
            <Download className="w-4 h-4" style={{ color: "var(--accent-color, #d99aa3)" }} />
            <span className="text-sm" style={{ color: text }}>Export backup</span>
          </button>
        </div>
      </Section>

      {/* Reset */}
      <button onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl cursor-pointer bg-transparent border-none"
        style={{ color: "#ef4444" }}>
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Reset to Default</span>
      </button>
    </div>
  );
}

function Section({ bg, border, children }: { bg: string; border: string; children: React.ReactNode }) {
  return <div className="rounded-2xl overflow-hidden px-4" style={{ background: bg, border: `1px solid ${border}` }}>{children}</div>;
}
