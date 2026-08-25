import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";
import { appData } from "@/data/shundori-data";

// Satellite letter tiles — each letter has 3 variants with real NASA Landsat locations
const TILES: Record<string, { file: string; loc: string; coords: string; sat: string }[]> = {
  A: [
    { file: "/landsat/a-1.svg", loc: "Hickman, Kentucky", coords: "36°35'N · 89°20'W", sat: "Landsat 8" },
    { file: "/landsat/a-2.svg", loc: "Yukon Delta, Alaska", coords: "62°33'N · 164°56'W", sat: "Landsat 9" },
    { file: "/landsat/a-3.svg", loc: "Lake Mjøsa, Norway", coords: "60°45'N · 10°56'E", sat: "Landsat 7" },
  ],
  B: [
    { file: "/landsat/b-1.svg", loc: "Humaitá, Brazil", coords: "7°37'S · 62°55'W", sat: "Landsat 8" },
    { file: "/landsat/b-2.svg", loc: "Holla Bend, Arkansas", coords: "35°08'N · 93°03'W", sat: "Landsat 7" },
    { file: "/landsat/b-3.svg", loc: "Fonte Boa, Brazil", coords: "2°26'S · 66°16'W", sat: "Landsat 9" },
  ],
  C: [
    { file: "/landsat/c-1.svg", loc: "False River, Louisiana", coords: "30°56'N · 91°05'W", sat: "Landsat 8" },
    { file: "/landsat/c-2.svg", loc: "Black Rock Desert, NV", coords: "40°47'N · 119°12'W", sat: "Landsat 9" },
    { file: "/landsat/c-3.svg", loc: "Deception Island", coords: "62°57'S · 60°38'W", sat: "Landsat 7" },
  ],
  D: [
    { file: "/landsat/d-1.svg", loc: "Lake Tandou, Australia", coords: "32°37'S · 142°04'E", sat: "Landsat 8" },
    { file: "/landsat/d-2.svg", loc: "Akimiski Island", coords: "53°00'N · 81°18'W", sat: "Landsat 9" },
    { file: "/landsat/d-3.svg", loc: "Manicouagan", coords: "51°22'N · 68°40'W", sat: "Landsat 7" },
  ],
  E: [
    { file: "/landsat/e-1.svg", loc: "Breiðamerkurjökull, Iceland", coords: "64°05'N · 16°21'W", sat: "Landsat 9" },
    { file: "/landsat/e-2.svg", loc: "Bellona Plateau", coords: "20°30'S · 158°30'E", sat: "Landsat 8" },
    { file: "/landsat/e-3.svg", loc: "Sea of Okhotsk", coords: "54°42'N · 136°34'E", sat: "Landsat 7" },
  ],
  F: [
    { file: "/landsat/f-1.svg", loc: "Kruger National Park", coords: "28°44'S · 29°12'E", sat: "Landsat 8" },
    { file: "/landsat/f-2.svg", loc: "Mato Grosso, Brazil", coords: "13°50'S · 55°17'W", sat: "Landsat 9" },
    { file: "/landsat/f-3.svg", loc: "Firn-filled Fjords", coords: "29°15'N · 96°19'E", sat: "Landsat 7" },
  ],
  G: [
    { file: "/landsat/g-1.svg", loc: "Fonte Boa, Amazonas", coords: "2°26'S · 66°16'W", sat: "Landsat 7" },
    { file: "/landsat/g-2.svg", loc: "São Paulo farmland", coords: "20°S · 48°W", sat: "Landsat 8" },
    { file: "/landsat/g-3.svg", loc: "Amazon basin", coords: "3°S · 60°W", sat: "Landsat 9" },
  ],
  H: [
    { file: "/landsat/h-1.svg", loc: "Khorinsky District", coords: "52°02'N · 109°46'E", sat: "Landsat 8" },
    { file: "/landsat/h-2.svg", loc: "Kyrgyzstan", coords: "40°14'N · 71°14'E", sat: "Landsat 9" },
    { file: "/landsat/h-3.svg", loc: "Siberian steppe", coords: "55°N · 100°E", sat: "Landsat 7" },
  ],
  I: [
    { file: "/landsat/i-1.svg", loc: "Holuhraun Lava Field", coords: "64°51'N · 16°49'W", sat: "Landsat 9" },
    { file: "/landsat/i-2.svg", loc: "Djebel Ouarkziz", coords: "28°18'N · 10°33'W", sat: "Landsat 8" },
    { file: "/landsat/i-3.svg", loc: "Etosha, Namibia", coords: "18°29'S · 16°10'E", sat: "Landsat 7" },
  ],
  J: [
    { file: "/landsat/j-1.svg", loc: "Lake Superior", coords: "46°41'N · 90°23'W", sat: "Landsat 8" },
    { file: "/landsat/j-2.svg", loc: "Karakaya Dam", coords: "38°29'N · 38°26'E", sat: "Landsat 9" },
    { file: "/landsat/j-3.svg", loc: "Great Barrier Reef", coords: "18°20'S · 146°50'E", sat: "Landsat 7" },
  ],
  K: [
    { file: "/landsat/k-1.svg", loc: "Golmud, China", coords: "35°36'N · 95°03'E", sat: "Landsat 7" },
    { file: "/landsat/k-2.svg", loc: "Sirmilik, Canada", coords: "72°05'N · 76°48'W", sat: "Landsat 9" },
    { file: "/landsat/k-3.svg", loc: "Tibetan plateau", coords: "33°N · 90°E", sat: "Landsat 8" },
  ],
  L: [
    { file: "/landsat/l-1.svg", loc: "Regina, Saskatchewan", coords: "50°12'N · 104°43'W", sat: "Landsat 8" },
    { file: "/landsat/l-2.svg", loc: "Xinjiang, China", coords: "40°04'N · 77°40'E", sat: "Landsat 9" },
    { file: "/landsat/l-3.svg", loc: "Nusantara, Indonesia", coords: "0°58'S · 116°41'E", sat: "Landsat 7" },
  ],
  M: [
    { file: "/landsat/m-1.svg", loc: "Tian Shan Mountains", coords: "42°07'N · 80°02'E", sat: "Landsat 9" },
    { file: "/landsat/m-2.svg", loc: "Potomac River", coords: "38°46'N · 78°24'W", sat: "Landsat 8" },
    { file: "/landsat/m-3.svg", loc: "Shenandoah River", coords: "38°46'N · 78°24'W", sat: "Landsat 7" },
  ],
  N: [
    { file: "/landsat/n-1.svg", loc: "São Miguel do Araguaia", coords: "12°56'S · 50°29'W", sat: "Landsat 8" },
    { file: "/landsat/n-2.svg", loc: "Yapacani, Bolivia", coords: "17°18'S · 63°53'W", sat: "Landsat 9" },
    { file: "/landsat/n-3.svg", loc: "Araguaia River", coords: "13°S · 50°W", sat: "Landsat 7" },
  ],
  O: [
    { file: "/landsat/o-1.svg", loc: "Manicouagan Reservoir", coords: "51°22'N · 68°40'W", sat: "Landsat 7" },
    { file: "/landsat/o-2.svg", loc: "Crater Lake, Oregon", coords: "42°56'N · 122°06'W", sat: "Landsat 8" },
    { file: "/landsat/o-3.svg", loc: "Lonar Crater, India", coords: "19°58'N · 76°30'E", sat: "Landsat 9" },
  ],
  P: [
    { file: "/landsat/p-1.svg", loc: "Riberalta, Bolivia", coords: "10°52'S · 66°02'W", sat: "Landsat 8" },
    { file: "/landsat/p-2.svg", loc: "Mackenzie Delta", coords: "68°12'N · 134°23'W", sat: "Landsat 7" },
    { file: "/landsat/p-3.svg", loc: "Bolivian Amazon", coords: "11°S · 66°W", sat: "Landsat 9" },
  ],
  Q: [
    { file: "/landsat/q-1.svg", loc: "Mount Tambora", coords: "8°14'S · 117°59'E", sat: "Landsat 9" },
    { file: "/landsat/q-2.svg", loc: "Lonar Crater, India", coords: "19°58'N · 76°30'E", sat: "Landsat 8" },
    { file: "/landsat/q-3.svg", loc: "Volcanic complex", coords: "8°S · 118°E", sat: "Landsat 7" },
  ],
  R: [
    { file: "/landsat/r-1.svg", loc: "Canyonlands, Utah", coords: "38°26'N · 109°45'W", sat: "Landsat 8" },
    { file: "/landsat/r-2.svg", loc: "Florida Keys", coords: "24°45'N · 81°31'W", sat: "Landsat 7" },
    { file: "/landsat/r-3.svg", loc: "Sondrio, Italy", coords: "46°17'N · 9°25'E", sat: "Landsat 9" },
  ],
  S: [
    { file: "/landsat/s-1.svg", loc: "Rio Chapare, Bolivia", coords: "16°56'S · 65°13'W", sat: "Landsat 7" },
    { file: "/landsat/s-2.svg", loc: "N'Djamena, Chad", coords: "12°00'N · 15°03'E", sat: "Landsat 8" },
    { file: "/landsat/s-3.svg", loc: "Mackenzie River", coords: "68°25'N · 134°08'W", sat: "Landsat 9" },
  ],
  T: [
    { file: "/landsat/t-1.svg", loc: "Lena River Delta", coords: "72°52'N · 129°31'E", sat: "Landsat 9" },
    { file: "/landsat/t-2.svg", loc: "Liwa, UAE", coords: "23°10'N · 53°47'E", sat: "Landsat 8" },
    { file: "/landsat/t-3.svg", loc: "Arctic tundra", coords: "70°N · 130°E", sat: "Landsat 7" },
  ],
  U: [
    { file: "/landsat/u-1.svg", loc: "Bamforth NWR, Wyoming", coords: "41°19'N · 105°46'W", sat: "Landsat 8" },
    { file: "/landsat/u-2.svg", loc: "Canyonlands, Utah", coords: "38°16'N · 109°55'W", sat: "Landsat 7" },
    { file: "/landsat/u-3.svg", loc: "High desert", coords: "41°N · 106°W", sat: "Landsat 9" },
  ],
  V: [
    { file: "/landsat/v-1.svg", loc: "Padma River, Bangladesh", coords: "23°21'N · 90°33'E", sat: "Landsat 8" },
    { file: "/landsat/v-2.svg", loc: "Mapleton, Maine", coords: "46°32'N · 68°15'W", sat: "Landsat 7" },
    { file: "/landsat/v-3.svg", loc: "New South Wales", coords: "34°17'S · 150°49'E", sat: "Landsat 9" },
  ],
  W: [
    { file: "/landsat/w-1.svg", loc: "La Primavera, Colombia", coords: "5°26'N · 69°47'W", sat: "Landsat 9" },
    { file: "/landsat/w-2.svg", loc: "Ponoy River, Russia", coords: "67°02'N · 40°20'E", sat: "Landsat 8" },
    { file: "/landsat/w-3.svg", loc: "Tropical lowland", coords: "5°N · 70°W", sat: "Landsat 7" },
  ],
  X: [
    { file: "/landsat/x-1.svg", loc: "Sermersooq, Greenland", coords: "66°37'N · 36°22'W", sat: "Landsat 7" },
    { file: "/landsat/x-2.svg", loc: "Davis Strait", coords: "62°14'N · 49°34'W", sat: "Landsat 8" },
    { file: "/landsat/x-3.svg", loc: "Wolstenholme Fjord", coords: "76°44'N · 68°36'W", sat: "Landsat 9" },
  ],
  Y: [
    { file: "/landsat/y-1.svg", loc: "Tasman Glacier, NZ", coords: "43°31'S · 170°49'E", sat: "Landsat 8" },
    { file: "/landsat/y-2.svg", loc: "Estuario de Virrila", coords: "5°51'S · 80°43'W", sat: "Landsat 9" },
    { file: "/landsat/y-3.svg", loc: "Bíobío River, Chile", coords: "37°16'S · 72°43'W", sat: "Landsat 7" },
  ],
  Z: [
    { file: "/landsat/z-1.svg", loc: "Mohammed Boudiaf", coords: "34°59'N · 4°23'E", sat: "Landsat 9" },
    { file: "/landsat/z-2.svg", loc: "Primavera do Leste", coords: "15°29'S · 54°20'W", sat: "Landsat 8" },
    { file: "/landsat/z-3.svg", loc: "Saharan edge", coords: "35°N · 4°E", sat: "Landsat 7" },
  ],
};

const VARIANTS = 3;

function getVariantIndices(name: string, round: number): number[] {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((ch, i) => {
      const tiles = TILES[ch];
      if (!tiles) return 0;
      return (round + i) % tiles.length;
    });
}

// Single tile component
function Tile({ letter, variantIdx, index }: { letter: string; variantIdx: number; index: number }) {
  const [showInfo, setShowInfo] = useState(false);
  const tiles = TILES[letter.toUpperCase()];
  if (!tiles) return null;
  const tile = tiles[variantIdx % tiles.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.06 }}
      className="relative flex-shrink-0 cursor-pointer group"
      onClick={() => setShowInfo(!showInfo)}
      tabIndex={0}
      role="button"
      aria-label={`Letter ${letter} — ${tile.loc}`}
    >
      <div
        className="w-[68px] h-[95px] rounded-lg overflow-hidden transition-transform duration-200 group-hover:scale-105"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}
      >
        <img
          src={tile.file}
          alt={`Letter ${letter}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl whitespace-nowrap"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[10px] text-white font-medium">{tile.loc}</p>
            <p className="text-[9px] text-white/55">{tile.coords}</p>
            <p className="text-[8px] text-white/35 mt-0.5">{tile.sat}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function NameOnLandSection() {
  const navigate = useNavigate();
  const isDark = localStorage.getItem("shundori:darkMode") === "true";
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [variantRound, setVariantRound] = useState(0);
  const compositeRef = useRef<HTMLDivElement>(null);

  const displayName = submitted && name.trim() ? name.trim().toUpperCase() : appData.personName;
  const letters = displayName.split("").filter((c) => /[A-Z]/i.test(c));
  const variants = submitted ? getVariantIndices(displayName, variantRound) : [];

  const handleSubmit = useCallback(() => {
    if (name.trim()) {
      setVariantRound((r) => r + 1);
      setSubmitted(true);
    }
  }, [name]);

  const handleCycle = useCallback(() => setVariantRound((r) => r + 1), []);

  const handleDownload = useCallback(() => {
    letters.forEach((ch, i) => {
      const vi = variants[i] || 0;
      const tiles = TILES[ch.toUpperCase()];
      if (!tiles) return;
      const tile = tiles[vi % tiles.length];
      const link = document.createElement("a");
      link.href = tile.file;
      link.download = `${ch.toUpperCase()}_landsat.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, [letters, variants]);

  const handleDownloadOne = useCallback((letter: string, vi: number) => {
    const tiles = TILES[letter.toUpperCase()];
    if (!tiles) return;
    const tile = tiles[vi % tiles.length];
    const link = document.createElement("a");
    link.href = tile.file;
    link.download = `${letter.toUpperCase()}_landsat.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="px-5 pt-2 pb-4 overflow-hidden">
      {/* Back button */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate("/app")}
          className="p-2 rounded-xl cursor-pointer bg-transparent border-none"
          style={{ color: "var(--accent-color, #d99aa3)" }}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <p
          className="text-[13px] italic flex-1"
          style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
        >
          Your name, written across the Earth.
        </p>
      </div>

      {/* Header */}
      <div
        className="text-center py-2.5 mb-4 rounded-2xl"
        style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.2em] font-medium"
          style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
        >
          Your Name in Landsat
        </p>
      </div>

      {/* Satellite tiles */}
      <div className="mb-4">
        {letters.length > 0 ? (
          <div
            ref={compositeRef}
            className="flex gap-1.5 overflow-x-auto pb-3 snap-x snap-mandatory justify-center"
            style={{ scrollbarWidth: "none" }}
          >
            {letters.map((ch, i) => (
              <div key={`${ch}-${i}-${variantRound}`} className="relative">
                <Tile letter={ch} variantIdx={variants[i] || 0} index={i} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadOne(ch, variants[i] || 0);
                  }}
                  className="absolute bottom-12 right-0 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                  }}
                  aria-label={`Download letter ${ch}`}
                >
                  <Download className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="relative rounded-2xl overflow-hidden h-[140px] flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #1a3a1a 0%, #2d5a1e 25%, #4a7c32 50%, #8fbc5a 75%, #2d5a1e 100%)",
            }}
          >
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
            <p className="relative z-10 text-white/50 text-sm italic">
              Type a name to see it in Landsat
            </p>
          </div>
        )}
      </div>

      {/* Display name */}
      {submitted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}
          >
            {displayName}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
            <p
              className="text-[9px] uppercase tracking-[0.15em]"
              style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}
            >
              NASA / USGS Landsat Program
            </p>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="space-y-3">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
        >
          <span className="text-sm">🛰️</span>
          <input
            type="text"
            placeholder="Write your name here..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }}
            aria-label="Enter name"
          />
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 border-none disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--accent-color, #d99aa3)" }}
          >
            Show My Name
          </motion.button>

          {submitted && (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCycle}
                className="px-3.5 py-3 rounded-2xl cursor-pointer flex items-center justify-center border-none"
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  color: isDark ? "#f2f2f7" : "#1c1c1e",
                }}
                aria-label="New satellite images"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className="px-3.5 py-3 rounded-2xl cursor-pointer flex items-center justify-center border-none"
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  color: isDark ? "#f2f2f7" : "#1c1c1e",
                }}
                aria-label="Download all images"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>

        <p
          className="text-center text-[11px]"
          style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
        >
          Tap a tile to see its real location · Tap 🔄 for new satellite images
        </p>
      </div>
    </div>
  );
}
