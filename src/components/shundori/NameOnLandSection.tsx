import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

// ─── Hard-coded image files from public/assets/ ──────────────────────────────
// Naming: name.png (base), name__N_.png (variants)
// We group by base name (case-insensitive), ignoring the number suffix

const IMAGE_MAP: Record<string, string[]> = {
  QUAZI: [
    "/assets/quazi.png",
    "/assets/quazi__1_.png",
    "/assets/QUAZI__2_.png",
    "/assets/quazi__3_.png",
    "/assets/quazi__4_.png",
    "/assets/quazi__5_.png",
    "/assets/quazi__6_.png",
    "/assets/quazi__7_.png",
    "/assets/QUAZI__8_.png",
    "/assets/QUAZI__9_.png",
    "/assets/QUAZI__10_.png",
  ],
  SUBAH: [
    "/assets/subah.png",
    "/assets/SUBAH__3_.png",
    "/assets/SUBAH__5_.png",
    "/assets/SUBAH__6_.png",
    "/assets/SUBAH__7_.png",
  ],
};

// Only these names are valid
const VALID_NAMES = new Set(["QUAZI", "SUBAH"]);

// Shuffle array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NameOnLandSection() {
  const navigate = useNavigate();
  const isDark = localStorage.getItem("shundori:darkMode") === "true";

  const [inputName, setInputName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Shuffle images when name is submitted
  const handleSubmit = useCallback(() => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    const upper = trimmed.toUpperCase().trim();
    setDisplayName(upper);
    setSubmitted(true);
    setCurrentIdx(0);

    if (VALID_NAMES.has(upper)) {
      setShuffledImages(shuffle(IMAGE_MAP[upper]));
    } else {
      setShuffledImages([]);
    }
  }, [inputName]);

  // Re-shuffle
  const handleReshuffle = useCallback(() => {
    if (!displayName || !VALID_NAMES.has(displayName)) return;
    setShuffledImages(shuffle(IMAGE_MAP[displayName]));
    setCurrentIdx(0);
  }, [displayName]);

  // Navigate images
  const handlePrev = useCallback(() => {
    setCurrentIdx((i) => (i > 0 ? i - 1 : shuffledImages.length - 1));
  }, [shuffledImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => (i < shuffledImages.length - 1 ? i + 1 : 0));
  }, [shuffledImages.length]);

  // Download current image
  const handleDownload = useCallback(() => {
    if (!shuffledImages[currentIdx]) return;
    const link = document.createElement("a");
    link.href = shuffledImages[currentIdx];
    link.download = `${displayName}_landsat.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [shuffledImages, currentIdx, displayName]);

  const isValid = submitted && VALID_NAMES.has(displayName);
  const hasImages = shuffledImages.length > 0;
  const currentImage = hasImages ? shuffledImages[currentIdx] : null;

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

      {/* Image Display */}
      {isValid && hasImages && (
        <motion.div
          key={displayName}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="mb-5"
        >
          {/* Image with navigation */}
          <div className="relative rounded-2xl overflow-hidden mb-3" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIdx}
                src={currentImage!}
                alt={`${displayName} in Landsat satellite imagery`}
                className="w-full h-auto block"
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {/* Navigation arrows */}
            {shuffledImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[10px]"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", color: "rgba(255,255,255,0.8)" }}
            >
              {currentIdx + 1} / {shuffledImages.length}
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-3">
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReshuffle}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer border-none"
              style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: isDark ? "#f2f2f7" : "#1c1c1e" }}
              aria-label="Shuffle images"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Shuffle
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
          </div>
        </motion.div>
      )}

      {/* Name not available */}
      {submitted && !isValid && (
        <div className="text-center py-10 mb-5">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
          >
            <span className="text-lg">🛰️</span>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            Name not available
          </p>
          <p className="text-[12px] mb-1" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
            Satellite imagery is only available for
          </p>
          <p className="text-[12px] font-semibold" style={{ color: "var(--accent-color, #d99aa3)" }}>
            QUAZI · SUBAH
          </p>
        </div>
      )}

      {/* Empty state */}
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
            placeholder="Type a name (e.g. QUAZI, SUBAH)"
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
          Supported names: QUAZI · SUBAH
        </p>
      </div>
    </div>
  );
}
