import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";
import { appData } from "@/data/shundori-data";

const NASA_URL = "https://science.nasa.gov/specials/your-name-in-landsat/";

export default function NameOnLandSection() {
  const isDark = localStorage.getItem("shundori:darkMode") === "true";
  const [name, setName] = useState("");

  const openNASA = () => {
    window.open(NASA_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="px-5 pt-2 pb-4">
      <p className="text-[13px] mb-5 italic"
        style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
        {appData.landMessage}
      </p>

      {/* Landscape preview with name */}
      <div className="relative rounded-3xl overflow-hidden h-[50vh] min-h-[280px] max-h-[380px] flex items-center justify-center mb-5"
        style={{ background: "linear-gradient(135deg, #2d5016 0%, #4a7c32 20%, #8fbc5a 35%, #c4a265 50%, #8b6914 65%, #3d6b2e 80%, #1a3a0a 100%)" }}>
        {/* Satellite texture overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
          backgroundSize: "4px 4px",
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.25) 100%)",
        }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} className="relative z-10 text-center px-6 overflow-hidden w-full">
          <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
            Some names deserve a place of their own.
          </p>
          <h1 className="text-[26px] font-bold tracking-tight leading-tight mb-5 break-all max-w-full overflow-hidden"
            style={{ color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,0.5)", letterSpacing: "0.02em", wordBreak: "break-word", overflowWrap: "break-word", textOverflow: "ellipsis" }}>
            {name.trim() ? name.trim().toUpperCase() : appData.personName}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
              Landsat Satellite Imagery
            </p>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-color, #d99aa3)" }} />
          </div>
        </motion.div>
      </div>

      {/* Name input + open button */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
          <MapPin className="w-4 h-4 shrink-0" style={{ color: "var(--accent-color, #d99aa3)" }} />
          <input type="text" placeholder="Type her name..."
            value={name} onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: isDark ? "#f2f2f7" : "#1c1c1e" }} aria-label="Enter name" />
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={openNASA}
          className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 border-none"
          style={{ background: "var(--accent-color, #d99aa3)" }}>
          <ExternalLink className="w-4 h-4" />
          Open NASA Landsat
        </motion.button>

        <p className="text-center text-[11px]"
          style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
          Opens NASA's "Your Name in Landsat" — type her name and see it written across the Earth
        </p>
      </div>
    </div>
  );
}
