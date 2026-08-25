import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { appData, STORAGE } from "@/data/shundori-data";

// Satellite landscape backgrounds (CSS gradients mimicking real terrain)
const LANDSCAPES = [
  { name: "Rivers", gradient: "linear-gradient(135deg, #2d5016 0%, #4a7c32 20%, #8fbc5a 40%, #c4a265 50%, #8b6914 60%, #3d6b2e 80%, #1a3a0a 100%)" },
  { name: "Desert", gradient: "linear-gradient(135deg, #c4956a 0%, #e8c9a0 25%, #d4a574 50%, #b8860b 75%, #8b6914 100%)" },
  { name: "Forest", gradient: "linear-gradient(135deg, #1a4d1a 0%, #2d7a2d 25%, #4a9e4a 50%, #2d6b2d 75%, #0d3d0d 100%)" },
  { name: "Coast", gradient: "linear-gradient(135deg, #1a3a5c 0%, #2d6b8e 25%, #4a9eb8 50%, #7ec8d4 75%, #2d6b8e 100%)" },
  { name: "Mountains", gradient: "linear-gradient(135deg, #2a1a3e 0%, #4a3a6e 25%, #6b5a8e 50%, #8a7aae 75%, #3a2a5e 100%)" },
];

export default function NameOnLandSection() {
  const isDark = localStorage.getItem(STORAGE.darkMode) === "true";
  const [inputName, setInputName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [landscapeIdx, setLandscapeIdx] = useState(0);

  const displayName = useMemo(() => {
    if (submitted && inputName.trim()) return inputName.trim().toUpperCase();
    return appData.personName;
  }, [submitted, inputName]);

  const handleSubmit = () => {
    if (!inputName.trim()) return;
    setSubmitted(true);
    setLandscapeIdx(Math.floor(Math.random() * LANDSCAPES.length));
  };

  const landscape = LANDSCAPES[landscapeIdx];

  return (
    <div className="px-5 pt-2 pb-4">
      <p className="text-[13px] mb-5 italic"
        style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
        {appData.landMessage}
      </p>

      {/* Name input */}
      <div className="mb-5">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
          <MapPin className="w-4 h-4 shrink-0" style={{ color: "var(--accent-color, #d99aa3)" }} />
          <input type="text" placeholder="Type a name to see it on land..."
            value={inputName} onChange={(e) => { setInputName(e.target.value); setSubmitted(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }} aria-label="Enter name" />
          <button onClick={handleSubmit} disabled={!inputName.trim()}
            className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold cursor-pointer border-none transition-opacity"
            style={{ background: "var(--accent-color, #d99aa3)", opacity: inputName.trim() ? 1 : 0.4 }}>
            Show
          </button>
        </div>
      </div>

      {/* Landscape with name */}
      <AnimatePresence mode="wait">
        <motion.div key={displayName + landscapeIdx}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden h-[55vh] min-h-[350px] flex items-center justify-center"
          style={{ background: landscape.gradient }}>
          {/* Satellite texture overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
            backgroundSize: "4px 4px",
          }} />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)",
          }} />
          {/* Name text */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }} className="relative z-10 text-center px-6">
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
              Some names deserve a place of their own.
            </p>
            <h1 className="text-[28px] font-bold tracking-tight leading-tight"
              style={{ color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,0.5)", letterSpacing: "0.02em" }}>
              {displayName}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                {landscape.name} · Landsat
              </p>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Landscape selector */}
      <div className="flex gap-2 mt-4 justify-center">
        {LANDSCAPES.map((l, i) => (
          <button key={l.name} onClick={() => setLandscapeIdx(i)}
            className="w-8 h-8 rounded-lg cursor-pointer border-2 transition-all"
            style={{
              background: l.gradient,
              borderColor: i === landscapeIdx ? "var(--accent-color, #d99aa3)" : "transparent",
            }} aria-label={`Select ${l.name} landscape`} />
        ))}
      </div>
    </div>
  );
}
