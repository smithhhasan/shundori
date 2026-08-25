import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, RefreshCw, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";

// Composite images stored in /landsat/composites/
// Each name has 3 variants with different satellite letter tiles
interface Composite {
  file: string;
  letters: string;
  desc: string;
}

const COMPOSITES: Record<string, Composite[]> = {
  QUAZI: [
    { file: "/landsat/composites/quazi-v1.svg", letters: "Q U A Z I", desc: "Mount Tambora · Hickman KY · Mohammed Boudiaf · Holuhraun" },
    { file: "/landsat/composites/quazi-v2.svg", letters: "Q U A Z I", desc: "Lonar Crater · Canyonlands · Primavera do Leste · Djebel Ouarkziz" },
    { file: "/landsat/composites/quazi-v3.svg", letters: "Q U A Z I", desc: "Volcanic Complex · High Desert · Saharan Edge · Etosha" },
  ],
  ZARIN: [
    { file: "/landsat/composites/zarin-v1.svg", letters: "Z A R I N", desc: "Mohammed Boudiaf · Hickman KY · Canyonlands · Holuhraun · Sao Miguel" },
    { file: "/landsat/composites/zarin-v2.svg", letters: "Z A R I N", desc: "Primavera do Leste · Yukon Delta · Florida Keys · Djebel Ouarkziz · Yapacani" },
    { file: "/landsat/composites/zarin-v3.svg", letters: "Z A R I N", desc: "Saharan Edge · Lake Mjosa · Sondrio · Etosha · Araguaia River" },
  ],
  SUBAH: [
    { file: "/landsat/composites/subah-v1.svg", letters: "S U B A H", desc: "Rio Chapare · Bamforth NWR · Humaita · Hickman KY · Khorinsky" },
    { file: "/landsat/composites/subah-v2.svg", letters: "S U B A H", desc: "NDjamena · Canyonlands · Holla Bend · Yukon Delta · Kyrgyzstan" },
    { file: "/landsat/composites/subah-v3.svg", letters: "S U B A H", desc: "Mackenzie River · High Desert · Fonte Boa · Lake Mjosa · Siberian Steppe" },
  ],
};

const NASA_URL = "https://science.nasa.gov/specials/your-name-in-landsat/";

// Only these exact names are supported (case-insensitive)
const VALID_NAMES = new Set(["QUAZI", "ZARIN", "SUBAH"]);

export default function NameOnLandSection() {
  const navigate = useNavigate();
  const isDark = localStorage.getItem("shundori:darkMode") === "true";

  const [inputName, setInputName] = useState("");
  const [variantIdx, setVariantIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const getComposite = useCallback((): Composite | null => {
    if (!displayName) return null;
    const upper = displayName.toUpperCase().trim();
    // Only exact matches for valid names
    if (!VALID_NAMES.has(upper)) return null;
    const list = COMPOSITES[upper];
    if (!list) return null;
    return list[variantIdx % list.length];
  }, [displayName, variantIdx]);

  const handleSubmit = useCallback(() => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    setDisplayName(trimmed);
    setSubmitted(true);
  }, [inputName]);

  const handleCycle = useCallback(() => {
    setVariantIdx((v) => v + 1);
  }, []);

  const handleDownload = useCallback(() => {
    const c = getComposite();
    if (!c) return;
    const link = document.createElement("a");
    link.href = c.file;
    link.download = `${displayName}_landsat.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [getComposite, displayName]);

  const composite = getComposite();

  return (
    <div className="min-h-full px-5 pt-2 pb-6 overflow-hidden">
      {/* Back Button */}
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

      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-xl font-bold tracking-wide mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: isDark ? "#f2f2f7" : "#1c1c1e" }}
        >
          Your Name in Landsat
        </h1>
        <p className="text-[12px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
          NASA / USGS Satellite Imagery
        </p>
      </div>

      {/* Composite Image Display */}
      {composite && (
        <motion.div
          key={`${displayName}-${variantIdx}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="mb-5"
        >
          {/* The composite image */}
          <div
            className="rounded-2xl overflow-hidden mb-3"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
          >
            <img
              src={composite.file}
              alt={`${displayName} in Landsat satellite imagery`}
              className="w-full h-auto block"
              draggable={false}
            />
          </div>

          {/* Name + description */}
          <div className="text-center mb-3">
            <h2
              className="text-2xl font-bold tracking-widest mb-1"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: isDark ? "#f2f2f7" : "#1c1c1e",
                letterSpacing: "0.08em",
              }}
            >
              {displayName}
            </h2>
            <p className="text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
              {composite.desc}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCycle}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer border-none"
              style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }}
              aria-label="Show different satellite images"
            >
              <RefreshCw className="w-3.5 h-3.5" /> New Images
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer border-none"
              style={{ background: "var(--accent-color, #d99aa3)", color: "#fff" }}
              aria-label="Download image"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(composite.file, "_blank")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer border-none"
              style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }}
              aria-label="View full image"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View
            </motion.button>
          </div>

          {/* Variant info */}
          <p className="text-center text-[10px] mt-3" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
            Variant {(variantIdx % 3) + 1} of 3 · Tap New Images to cycle
          </p>
        </motion.div>
      )}

      {/* Empty state — name not available */}
      {!composite && submitted && (
        <div className="text-center py-10 mb-5">
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
            <span className="text-lg">🛰️</span>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            Name not available
          </p>
          <p className="text-[12px] mb-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
            Satellite imagery is only available for
          </p>
          <p className="text-[12px] font-semibold" style={{ color: "var(--accent-color, #d99aa3)" }}>
            QUAZI · ZARIN · SUBAH
          </p>
        </div>
      )}

      {!submitted && (
        <div
          className="rounded-2xl overflow-hidden h-[160px] flex items-center justify-center mb-6 relative"
          style={{ background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a1e 25%, #4a7c32 50%, #8fbc5a 75%, #2d5a1e 100%)" }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
          <p className="relative z-10 text-white/50 text-sm italic px-4 text-center">
            Type a name to see it in Landsat satellite imagery
          </p>
        </div>
      )}

      {/* Name Input */}
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

        <p className="text-center text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
          Supported names: QUAZI · ZARIN · SUBAH
        </p>

        {/* Optional NASA reference link */}
        <div className="text-center mt-2">
          <a
            href={NASA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] underline"
            style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}
          >
            Or check your name on NASA directly ↗
          </a>
        </div>
      </div>
    </div>
  );
}
