import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Download, RotateCcw } from "lucide-react";
import { appData } from "@/data/shundori-data";

const NASA_URL = "https://science.nasa.gov/specials/your-name-in-landsat/";

// Real NASA Landsat satellite data for each letter A-Z
// Each letter has one or more real Earth features that form that letter shape
const SATELLITE_DATA: Record<string, { location: string; coords: string; gradient: string; satellite: string }[]> = {
  A: [
    { location: "Hickman, Kentucky", coords: "36°35'N · 89°20'W", gradient: "linear-gradient(135deg, #2d5a1e 0%, #5a8c3a 30%, #c4a265 60%, #3d6b2e 100%)", satellite: "Landsat 8" },
    { location: "Lake Mjøsa, Norway", coords: "60°45'N · 10°56'E", gradient: "linear-gradient(135deg, #1a3a5c 0%, #4a7a8c 40%, #2d5a3a 70%, #1a3a0a 100%)", satellite: "Landsat 9" },
  ],
  B: [
    { location: "Humaitá, Brazil", coords: "7°37'S · 62°55'W", gradient: "linear-gradient(135deg, #1a4a2a 0%, #3a8c4a 30%, #8ab060 60%, #2d5a1e 100%)", satellite: "Landsat 8" },
    { location: "Holla Bend, Arkansas", coords: "35°08'N · 93°03'W", gradient: "linear-gradient(135deg, #2a5a3a 0%, #5a9a5a 40%, #c4b080 70%, #3a6a2a 100%)", satellite: "Landsat 7" },
  ],
  C: [
    { location: "False River, Louisiana", coords: "30°56'N · 91°05'W", gradient: "linear-gradient(135deg, #2a4a3a 0%, #5a8a5a 35%, #8aba6a 65%, #3a5a2a 100%)", satellite: "Landsat 8" },
    { location: "Deception Island, Antarctica", coords: "62°57'S · 60°38'W", gradient: "linear-gradient(135deg, #4a6a8a 0%, #8aaaba 40%, #c0d0e0 70%, #5a7a9a 100%)", satellite: "Landsat 9" },
  ],
  D: [
    { location: "Lake Tandou, Australia", coords: "32°37'S · 142°04'E", gradient: "linear-gradient(135deg, #8a6a3a 0%, #c4a060 30%, #5a8a4a 60%, #3a6a2a 100%)", satellite: "Landsat 8" },
  ],
  E: [
    { location: "Breiðamerkurjökull, Iceland", coords: "64°05'N · 16°21'W", gradient: "linear-gradient(135deg, #3a6a8a 0%, #6aaaca 35%, #e0e8f0 60%, #4a7a9a 100%)", satellite: "Landsat 9" },
  ],
  F: [
    { location: "Kruger National Park, SA", coords: "28°44'S · 29°12'E", gradient: "linear-gradient(135deg, #2a5a1a 0%, #5a9a3a 30%, #8aba5a 60%, #3a7a2a 100%)", satellite: "Landsat 8" },
  ],
  G: [
    { location: "Fonte Boa, Amazonas", coords: "2°26'S · 66°16'W", gradient: "linear-gradient(135deg, #1a3a2a 0%, #3a7a4a 35%, #6aaa5a 65%, #2a5a3a 100%)", satellite: "Landsat 7" },
  ],
  H: [
    { location: "Khorinsky District, Russia", coords: "52°02'N · 109°46'E", gradient: "linear-gradient(135deg, #2a4a2a 0%, #5a8a4a 30%, #8aba6a 60%, #3a6a3a 100%)", satellite: "Landsat 8" },
  ],
  I: [
    { location: "Holuhraun Lava Field, Iceland", coords: "64°51'N · 16°49'W", gradient: "linear-gradient(135deg, #3a2a1a 0%, #6a5a3a 30%, #2a4a5a 60%, #1a3a4a 100%)", satellite: "Landsat 9" },
  ],
  J: [
    { location: "Lake Superior, N. America", coords: "46°41'N · 90°23'W", gradient: "linear-gradient(135deg, #1a3a5a 0%, #3a6a8a 35%, #6a9aba 65%, #2a5a7a 100%)", satellite: "Landsat 8" },
  ],
  K: [
    { location: "Golmud, China", coords: "35°36'N · 95°03'E", gradient: "linear-gradient(135deg, #6a5a3a 0%, #aa8a5a 30%, #5a7a4a 60%, #3a5a2a 100%)", satellite: "Landsat 7" },
  ],
  L: [
    { location: "Regina, Saskatchewan", coords: "50°12'N · 104°43'W", gradient: "linear-gradient(135deg, #3a5a2a 0%, #6a9a4a 35%, #9aca7a 65%, #4a7a3a 100%)", satellite: "Landsat 8" },
  ],
  M: [
    { location: "Tian Shan Mountains", coords: "42°07'N · 80°02'E", gradient: "linear-gradient(135deg, #4a3a2a 0%, #8a6a4a 30%, #5a8a5a 60%, #3a6a3a 100%)", satellite: "Landsat 9" },
  ],
  N: [
    { location: "São Miguel do Araguaia", coords: "12°56'S · 50°29'W", gradient: "linear-gradient(135deg, #1a4a3a 0%, #3a8a5a 35%, #6aba6a 65%, #2a6a4a 100%)", satellite: "Landsat 8" },
  ],
  O: [
    { location: "Manicouagan Reservoir", coords: "51°22'N · 68°40'W", gradient: "linear-gradient(135deg, #1a3a5a 0%, #3a6a7a 30%, #5a8a9a 60%, #2a5a6a 100%)", satellite: "Landsat 7" },
  ],
  P: [
    { location: "Riberalta, Bolivia", coords: "10°52'S · 66°02'W", gradient: "linear-gradient(135deg, #1a3a2a 0%, #3a7a3a 35%, #6aaa5a 65%, #2a5a3a 100%)", satellite: "Landsat 8" },
  ],
  Q: [
    { location: "Mount Tambora, Indonesia", coords: "8°14'S · 117°59'E", gradient: "linear-gradient(135deg, #2a5a3a 0%, #5a9a5a 30%, #3a7a4a 60%, #1a4a2a 100%)", satellite: "Landsat 9" },
  ],
  R: [
    { location: "Canyonlands, Utah", coords: "38°26'N · 109°45'W", gradient: "linear-gradient(135deg, #8a5a2a 0%, #ca8a4a 30%, #6a7a3a 60%, #4a5a2a 100%)", satellite: "Landsat 8" },
  ],
  S: [
    { location: "Rio Chapare, Bolivia", coords: "16°56'S · 65°13'W", gradient: "linear-gradient(135deg, #1a4a3a 0%, #3a8a5a 35%, #5aaa6a 65%, #2a6a4a 100%)", satellite: "Landsat 7" },
  ],
  T: [
    { location: "Lena River Delta", coords: "72°52'N · 129°31'E", gradient: "linear-gradient(135deg, #5a4a3a 0%, #9a8a6a 30%, #3a5a4a 60%, #2a4a3a 100%)", satellite: "Landsat 9" },
  ],
  U: [
    { location: "Bamforth NWR, Wyoming", coords: "41°19'N · 105°46'W", gradient: "linear-gradient(135deg, #4a6a3a 0%, #7a9a5a 35%, #5a8a4a 65%, #3a6a3a 100%)", satellite: "Landsat 8" },
  ],
  V: [
    { location: "Padma River, Bangladesh", coords: "23°21'N · 90°33'E", gradient: "linear-gradient(135deg, #6a7a4a 0%, #9aaa6a 30%, #4a6a3a 60%, #3a5a2a 100%)", satellite: "Landsat 8" },
  ],
  W: [
    { location: "La Primavera, Colombia", coords: "5°26'N · 69°47'W", gradient: "linear-gradient(135deg, #1a4a2a 0%, #3a8a4a 35%, #5aaa5a 65%, #2a6a3a 100%)", satellite: "Landsat 9" },
  ],
  X: [
    { location: "Sermersooq, Greenland", coords: "66°37'N · 36°22'W", gradient: "linear-gradient(135deg, #4a6a8a 0%, #7aaaca 35%, #b0d0e0 65%, #5a8aaa 100%)", satellite: "Landsat 7" },
  ],
  Y: [
    { location: "Tasman Glacier, NZ", coords: "43°31'S · 170°49'E", gradient: "linear-gradient(135deg, #5a7a9a 0%, #8aaaca 30%, #d0e0f0 60%, #6a8aaa 100%)", satellite: "Landsat 8" },
  ],
  Z: [
    { location: "Mohammed Boudiaf, Algeria", coords: "34°59'N · 4°23'E", gradient: "linear-gradient(135deg, #8a7a4a 0%, #baa06a 30%, #5a8a4a 60%, #3a6a3a 100%)", satellite: "Landsat 9" },
  ],
};

// Get a deterministic tile variant for a letter based on its position in the name
function getTileForLetter(letter: string, index: number) {
  const upper = letter.toUpperCase();
  const tiles = SATELLITE_DATA[upper];
  if (!tiles) return null;
  return tiles[index % tiles.length];
}

// Satellite tile component
function SatelliteTile({ letter, tile, index }: { letter: string; tile: NonNullable<ReturnType<typeof getTileForLetter>>; index: number }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.08 }}
      className="relative flex-shrink-0 cursor-pointer"
      onClick={() => setShowInfo(!showInfo)}
    >
      {/* Satellite image tile */}
      <div
        className="w-[72px] h-[100px] rounded-lg overflow-hidden relative"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      >
        {/* Gradient simulating satellite imagery */}
        <div className="absolute inset-0" style={{ background: tile.gradient }} />
        {/* Subtle grid overlay for satellite texture */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)`,
          backgroundSize: "4px 4px",
        }} />
        {/* Letter overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-2xl font-bold" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {letter}
          </span>
        </div>
        {/* Location label at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
          <p className="text-[7px] text-white/80 leading-tight truncate">{tile.location}</p>
        </div>
      </div>

      {/* Info tooltip */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl whitespace-nowrap"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
          >
            <p className="text-[10px] text-white font-medium">{tile.location}</p>
            <p className="text-[9px] text-white/60">{tile.coords}</p>
            <p className="text-[8px] text-white/40 mt-0.5">{tile.satellite}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function NameOnLandSection() {
  const isDark = localStorage.getItem("shundori:darkMode") === "true";
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const displayName = submitted && name.trim() ? name.trim().toUpperCase() : appData.personName;
  const letters = displayName.split("").filter((c) => c !== " ");

  const handleSubmit = useCallback(() => {
    if (name.trim()) setSubmitted(true);
  }, [name]);

  const handleReset = useCallback(() => {
    setName("");
    setSubmitted(false);
  }, []);

  const openNASA = () => {
    window.open(NASA_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="px-5 pt-2 pb-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[13px] italic" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
            Your name, written across the Earth.
          </p>
        </div>
        {submitted && (
          <button onClick={handleReset} className="p-2 rounded-xl cursor-pointer bg-transparent border-none"
            style={{ color: "var(--accent-color, #d99aa3)" }} aria-label="Reset name">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* NASA-style title bar */}
      <div className="text-center py-3 mb-4 rounded-2xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
        <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
          Your Name in Landsat
        </p>
      </div>

      {/* Satellite tile grid — the main display */}
      <div className="mb-5">
        {letters.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {letters.map((letter, i) => {
              if (letter === " ") return <div key={`space-${i}`} className="w-3 flex-shrink-0" />;
              const tile = getTileForLetter(letter, i);
              if (!tile) return null;
              return <SatelliteTile key={`${letter}-${i}`} letter={letter} tile={tile} index={i} />;
            })}
          </div>
        ) : (
          /* Empty state — landscape preview */
          <div className="relative rounded-2xl overflow-hidden h-[160px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2d5016 0%, #4a7c32 25%, #c4a265 50%, #8b6914 75%, #3d6b2e 100%)" }}>
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
              backgroundSize: "4px 4px",
            }} />
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />
            <p className="relative z-10 text-white/60 text-sm italic">Type a name below to see it in Landsat</p>
          </div>
        )}
      </div>

      {/* Display name text below tiles */}
      {submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5">
          <h1 className="text-2xl font-bold tracking-wide" style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}>
            {displayName}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
            <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>
              NASA / USGS Landsat Program
            </p>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
          </div>
        </motion.div>
      )}

      {/* Name input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
          <span className="text-sm" style={{ color: "var(--accent-color, #d99aa3)" }}>🛰️</span>
          <input type="text" placeholder="Write your name here..."
            value={name} onChange={(e) => { setName(e.target.value); setSubmitted(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }} aria-label="Enter name" />
        </div>

        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 border-none disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--accent-color, #d99aa3)" }}>
            Show My Name
          </motion.button>

          <motion.button whileTap={{ scale: 0.97 }} onClick={openNASA}
            className="px-4 py-3 rounded-2xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 border-none"
            style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", color: isDark ? "#f2f2f7" : "#1c1c1e" }}>
            <ExternalLink className="w-3.5 h-3.5" />
            NASA
          </motion.button>
        </div>

        <p className="text-center text-[11px]"
          style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
          Tap a tile to see its real location · Open NASA for the full experience
        </p>
      </div>
    </div>
  );
}
