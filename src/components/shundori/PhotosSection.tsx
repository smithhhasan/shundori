import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { appData } from "@/data/shundori-data";

export default function PhotosSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const photo = selected !== null ? appData.photos.find((p) => p.id === selected) : null;

  return (
    <div className="min-h-full px-4 py-6 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-1"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        Photos
      </motion.h2>
      <p className="text-foreground/40 text-sm mb-6">Moments we captured.</p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {appData.photos.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(p.id)}
            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm group"
          >
            {/* Placeholder gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: p.src
                  ? undefined
                  : `linear-gradient(${135 + i * 30}deg, var(--accent-color, #e8a0b4)33, var(--accent-color, #f48fb1)22)`,
              }}
            />
            {p.src && <img src={p.src} alt={p.caption} className="absolute inset-0 w-full h-full object-cover" />}

            {/* Caption overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-3">
              <p className="text-white text-xs font-medium truncate">{p.caption}</p>
              <p className="text-white/60 text-[10px]">{p.date}</p>
            </div>

            {/* Favorite icon */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-sm cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 ${favorites.has(p.id) ? "fill-red-400 text-red-400" : "text-white/70"}`}
              />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-10 right-6 p-2 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-[85vw] max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {photo.src ? (
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, var(--accent-color, #e8a0b4)44, var(--accent-color, #f48fb1)22)`,
                  }}
                >
                  <span className="text-white/40 text-4xl">📷</span>
                </div>
              )}
            </motion.div>

            <div className="mt-4 text-center">
              <p className="text-white text-base font-medium">{photo.caption}</p>
              <p className="text-white/50 text-sm">{photo.date}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
