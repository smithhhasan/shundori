import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, RefreshCw, Eye } from "lucide-react";
import { useNavigate } from "react-router";

// ─── Hard-coded NASA Landsat satellite letter tiles ─────────────────────────
// Each letter has 3 variants with real NASA locations, coordinates, and missions
// These are the EXACT tiles that compose the names QUAZI, ZARIN, SUBAH

interface TileData {
  file: string;
  loc: string;
  coords: string;
  sat: string;
}

const TILES: Record<string, TileData[]> = {
  Q: [
    { file: "/landsat/q-1.svg", loc: "Mount Tambora, Indonesia", coords: "8°14'S · 117°59'E", sat: "Landsat 9" },
    { file: "/landsat/q-2.svg", loc: "Lonar Crater, India", coords: "19°58'N · 76°30'E", sat: "Landsat 8" },
    { file: "/landsat/q-3.svg", loc: "Volcanic Complex, Indonesia", coords: "8°S · 118°E", sat: "Landsat 7" },
  ],
  U: [
    { file: "/landsat/u-1.svg", loc: "Bamforth NWR, Wyoming", coords: "41°19'N · 105°46'W", sat: "Landsat 8" },
    { file: "/landsat/u-2.svg", loc: "Canyonlands, Utah", coords: "38°16'N · 109°55'W", sat: "Landsat 7" },
    { file: "/landsat/u-3.svg", loc: "High Desert, Wyoming", coords: "41°N · 106°W", sat: "Landsat 9" },
  ],
  A: [
    { file: "/landsat/a-1.svg", loc: "Hickman, Kentucky", coords: "36°35'N · 89°20'W", sat: "Landsat 8" },
    { file: "/landsat/a-2.svg", loc: "Yukon Delta, Alaska", coords: "62°33'N · 164°56'W", sat: "Landsat 9" },
    { file: "/landsat/a-3.svg", loc: "Lake Mjøsa, Norway", coords: "60°45'N · 10°56'E", sat: "Landsat 7" },
  ],
  Z: [
    { file: "/landsat/z-1.svg", loc: "Mohammed Boudiaf, Algeria", coords: "34°59'N · 4°23'E", sat: "Landsat 9" },
    { file: "/landsat/z-2.svg", loc: "Primavera do Leste, Brazil", coords: "15°29'S · 54°20'W", sat: "Landsat 8" },
    { file: "/landsat/z-3.svg", loc: "Saharan Edge, Algeria", coords: "35°N · 4°E", sat: "Landsat 7" },
  ],
  I: [
    { file: "/landsat/i-1.svg", loc: "Holuhraun Lava Field, Iceland", coords: "64°51'N · 16°49'W", sat: "Landsat 9" },
    { file: "/landsat/i-2.svg", loc: "Djebel Ouarkziz, Morocco", coords: "28°18'N · 10°33'W", sat: "Landsat 8" },
    { file: "/landsat/i-3.svg", loc: "Etosha, Namibia", coords: "18°29'S · 16°10'E", sat: "Landsat 7" },
  ],
  N: [
    { file: "/landsat/n-1.svg", loc: "São Miguel do Araguaia, Brazil", coords: "12°56'S · 50°29'W", sat: "Landsat 8" },
    { file: "/landsat/n-2.svg", loc: "Yapacani, Bolivia", coords: "17°18'S · 63°53'W", sat: "Landsat 9" },
    { file: "/landsat/n-3.svg", loc: "Araguaia River, Brazil", coords: "13°S · 50°W", sat: "Landsat 7" },
  ],
  R: [
    { file: "/landsat/r-1.svg", loc: "Canyonlands, Utah", coords: "38°26'N · 109°45'W", sat: "Landsat 8" },
    { file: "/landsat/r-2.svg", loc: "Florida Keys, Florida", coords: "24°45'N · 81°31'W", sat: "Landsat 7" },
    { file: "/landsat/r-3.svg", loc: "Sondrio, Italy", coords: "46°17'N · 9°25'E", sat: "Landsat 9" },
  ],
  S: [
    { file: "/landsat/s-1.svg", loc: "Rio Chapare, Bolivia", coords: "16°56'S · 65°13'W", sat: "Landsat 7" },
    { file: "/landsat/s-2.svg", loc: "N'Djamena, Chad", coords: "12°00'N · 15°03'E", sat: "Landsat 8" },
    { file: "/landsat/s-3.svg", loc: "Mackenzie River, Canada", coords: "68°25'N · 134°08'W", sat: "Landsat 9" },
  ],
  B: [
    { file: "/landsat/b-1.svg", loc: "Humaitá, Brazil", coords: "7°37'S · 62°55'W", sat: "Landsat 8" },
    { file: "/landsat/b-2.svg", loc: "Holla Bend, Arkansas", coords: "35°08'N · 93°03'W", sat: "Landsat 7" },
    { file: "/landsat/b-3.svg", loc: "Fonte Boa, Brazil", coords: "2°26'S · 66°16'W", sat: "Landsat 9" },
  ],
  H: [
    { file: "/landsat/h-1.svg", loc: "Khorinsky District, Russia", coords: "52°02'N · 109°46'E", sat: "Landsat 8" },
    { file: "/landsat/h-2.svg", loc: "Kyrgyzstan", coords: "40°14'N · 71°14'E", sat: "Landsat 9" },
    { file: "/landsat/h-3.svg", loc: "Siberian Steppe, Russia", coords: "55°N · 100°E", sat: "Landsat 7" },
  ],
};

// Pre-built name composites — each name maps to specific letter + variant combinations
// These match the NASA Landsat composite images shown in the uploaded screenshots
const NAME_COMPOSITES: Record<string, { letter: string; variant: number }[]> = {
  QUAZI: [
    { letter: "Q", variant: 0 },
    { letter: "U", variant: 0 },
    { letter: "A", variant: 0 },
    { letter: "Z", variant: 0 },
    { letter: "I", variant: 0 },
  ],
  ZARIN: [
    { letter: "Z", variant: 0 },
    { letter: "A", variant: 0 },
    { letter: "R", variant: 0 },
    { letter: "I", variant: 0 },
    { letter: "N", variant: 0 },
  ],
  SUBAH: [
    { letter: "S", variant: 0 },
    { letter: "U", variant: 0 },
    { letter: "B", variant: 0 },
    { letter: "A", variant: 0 },
    { letter: "H", variant: 0 },
  ],
};

// Generic fallback — map any name to tiles, cycling variants for uniqueness
function getGenericComposite(name: string, round: number): { letter: string; variant: number }[] {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((ch, i) => ({
      letter: ch,
      variant: (round + i) % (TILES[ch]?.length ?? 1),
    }));
}

// ─── Single Satellite Tile ──────────────────────────────────────────────────

function Tile({
  letter,
  tileData,
  index,
  onDownload,
}: {
  letter: string;
  tileData: TileData;
  index: number;
  onDownload: () => void;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.07 }}
      className="relative flex-shrink-0 group"
    >
      {/* Tile image */}
      <div
        className="w-[72px] h-[100px] md:w-[80px] md:h-[112px] rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 group-hover:scale-105"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
        onClick={() => setShowInfo(!showInfo)}
        tabIndex={0}
        role="button"
        aria-label={`Letter ${letter} — ${tileData.loc}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setShowInfo(!showInfo); }}
      >
        <img
          src={tileData.file}
          alt={`Letter ${letter} from ${tileData.loc}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Info tooltip on tap */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl whitespace-nowrap"
            style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[10px] text-white font-medium">{tileData.loc}</p>
            <p className="text-[9px] text-white/55">{tileData.coords}</p>
            <p className="text-[8px] text-white/35 mt-0.5">{tileData.sat}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download button on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDownload(); }}
        className="absolute -top-1 -right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none z-20"
        style={{ background: "var(--accent-color, #d99aa3)" }}
        aria-label={`Download letter ${letter}`}
      >
        <Download className="w-3 h-3 text-white" />
      </button>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function NameOnLandSection() {
  const navigate = useNavigate();
  const isDark = localStorage.getItem("shundori:darkMode") === "true";

  const [inputName, setInputName] = useState("");
  const [composite, setComposite] = useState<{ letter: string; variant: number }[] | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [variantRound, setVariantRound] = useState(0);

  const handleSubmit = useCallback(() => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    const upper = trimmed.toUpperCase().replace(/[^A-Z]/g, "");
    if (!upper) return;

    setDisplayName(upper);
    // Use pre-built composite for known names, generic for others
    const builtIn = NAME_COMPOSITES[upper];
    if (builtIn) {
      setComposite(builtIn);
    } else {
      setComposite(getGenericComposite(upper, variantRound));
      setVariantRound((r) => r + 1);
    }
  }, [inputName, variantRound]);

  const handleCycle = useCallback(() => {
    setVariantRound((r) => r + 1);
    if (composite) {
      const upper = displayName;
      const builtIn = NAME_COMPOSITES[upper];
      if (!builtIn) {
        setComposite(getGenericComposite(upper, variantRound + 1));
      } else {
        // Cycle through variants for built-in names too
        setComposite(
          builtIn.map((item, i) => ({
            ...item,
            variant: (variantRound + 1 + i) % (TILES[item.letter]?.length ?? 1),
          }))
        );
      }
    }
  }, [composite, displayName, variantRound]);

  const handleDownloadAll = useCallback(() => {
    if (!composite) return;
    composite.forEach((item) => {
      const tiles = TILES[item.letter];
      if (!tiles) return;
      const tile = tiles[item.variant % tiles.length];
      const link = document.createElement("a");
      link.href = tile.file;
      link.download = `${item.letter}_landsat.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, [composite]);

  const handleDownloadOne = useCallback((letter: string, variant: number) => {
    const tiles = TILES[letter];
    if (!tiles) return;
    const tile = tiles[variant % tiles.length];
    const link = document.createElement("a");
    link.href = tile.file;
    link.download = `${letter}_landsat.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleView = useCallback(() => {
    if (!composite) return;
    // Open all tile images in new tabs for viewing
    composite.forEach((item) => {
      const tiles = TILES[item.letter];
      if (!tiles) return;
      const tile = tiles[item.variant % tiles.length];
      window.open(tile.file, "_blank");
    });
  }, [composite]);

  return (
    <div className="min-h-full px-5 pt-2 pb-6 overflow-hidden">
      {/* ── Back Button ── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate("/app")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer bg-transparent border-none transition-opacity hover:opacity-70"
          style={{ color: "var(--accent-color, #d99aa3)" }}
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* ── Header ── */}
      <div className="text-center mb-6">
        <h1
          className="text-xl font-bold tracking-wide mb-1"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: isDark ? "#f2f2f7" : "#1c1c1e",
          }}
        >
          Your Name in Landsat
        </h1>
        <p
          className="text-[12px]"
          style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
        >
          NASA / USGS Satellite Imagery · Letters A–Z
        </p>
      </div>

      {/* ── Satellite Tile Display ── */}
      {composite && (
        <div className="mb-6">
          {/* Tile strip */}
          <div className="flex gap-2 justify-center mb-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {composite.map((item, i) => {
              const tiles = TILES[item.letter];
              if (!tiles) return null;
              const tileData = tiles[item.variant % tiles.length];
              return (
                <Tile
                  key={`${item.letter}-${i}-${variantRound}`}
                  letter={item.letter}
                  tileData={tileData}
                  index={i}
                  onDownload={() => handleDownloadOne(item.letter, item.variant)}
                />
              );
            })}
          </div>

          {/* Name text */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-3">
            <h2
              className="text-2xl font-bold tracking-widest"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: isDark ? "#f2f2f7" : "#1c1c1e",
                letterSpacing: "0.08em",
              }}
            >
              {displayName}
            </h2>
          </motion.div>

          {/* Action buttons */}
          <div className="flex gap-2 justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCycle}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer border-none"
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                color: isDark ? "#f2f2f7" : "#1c1c1e",
              }}
              aria-label="Show different satellite images"
            >
              <RefreshCw className="w-3.5 h-3.5" /> New Images
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleView}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer border-none"
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                color: isDark ? "#f2f2f7" : "#1c1c1e",
              }}
              aria-label="View full images"
            >
              <Eye className="w-3.5 h-3.5" /> View
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer border-none"
              style={{
                background: "var(--accent-color, #d99aa3)",
                color: "#fff",
              }}
              aria-label="Download all images"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </motion.button>
          </div>

          {/* Location info */}
          <div className="mt-4 space-y-1.5">
            {composite.map((item, i) => {
              const tiles = TILES[item.letter];
              if (!tiles) return null;
              const tileData = tiles[item.variant % tiles.length];
              return (
                <div
                  key={`info-${i}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px]"
                  style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                >
                  <span className="font-bold text-[13px] w-5 text-center" style={{ color: "var(--accent-color, #d99aa3)" }}>
                    {item.letter}
                  </span>
                  <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                    {tileData.loc}
                  </span>
                  <span className="ml-auto" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
                    {tileData.coords}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {!composite && (
        <div
          className="rounded-2xl overflow-hidden h-[160px] flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a1e 25%, #4a7c32 50%, #8fbc5a 75%, #2d5a1e 100%)",
          }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
          <p className="relative z-10 text-white/50 text-sm italic px-4 text-center">
            Type a name below to see it written in satellite imagery
          </p>
        </div>
      )}

      {/* ── Name Input ── */}
      <div className="space-y-3">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
        >
          <span className="text-sm">🛰️</span>
          <input
            type="text"
            placeholder="Type a name (e.g. QUAZI, ZARIN, SUBAH)"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}
            aria-label="Enter a name"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!inputName.trim()}
          className="w-full py-3 rounded-2xl text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 border-none disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--accent-color, #d99aa3)" }}
        >
          Show in Landsat
        </motion.button>

        <p
          className="text-center text-[11px]"
          style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
        >
          Tap a tile for location info · 🔄 for new satellite variants
        </p>
      </div>
    </div>
  );
}
