import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Plus, Trash2 } from "lucide-react";
import { type Photo } from "@/data/shundori-data";

const STORAGE_KEY = "shundori-photos";
const FAV_KEY = "shundori-favs";

function loadSavedPhotos(): Photo[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
}

function savePhotos(photos: Photo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

export default function PhotosSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const s = localStorage.getItem(FAV_KEY);
      return s ? new Set(JSON.parse(s)) : new Set();
    } catch { return new Set(); }
  });
  const [photos, setPhotos] = useState<Photo[]>(loadSavedPhotos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photo = selected !== null ? photos.find((p) => p.id === selected) : null;

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: Photo[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newPhoto: Photo = {
          id: Date.now() + Math.random(),
          src: ev.target?.result as string,
          caption: file.name.replace(/\.[^.]+$/, ""),
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        };
        newPhotos.push(newPhoto);

        // Save after last file
        if (newPhotos.length === files.length) {
          setPhotos((prev) => {
            const next = [...prev, ...newPhotos];
            savePhotos(next);
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deletePhoto = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      savePhotos(next);
      return next;
    });
    if (selected === id) setSelected(null);
  };

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
      <p className="text-foreground/40 text-sm mb-6">
        {photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? "s" : ""}` : "Your favorite moments."}
      </p>

      {/* Add photo button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => fileInputRef.current?.click()}
        className="w-full mb-5 py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-colors card-glass"
        style={{ borderColor: "var(--accent-color, #e8a0b4)" }}
      >
        <Plus className="w-5 h-5" style={{ color: "var(--accent-color, #e8a0b4)" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--accent-color, #e8a0b4)" }}>
          Add Photos
        </span>
      </motion.button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* Empty state */}
      {photos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div
            className="w-20 h-20 rounded-[22px] mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--accent-color, #e8a0b4)", opacity: 0.15 }}
          >
            <Plus className="w-8 h-8" style={{ color: "var(--accent-color, #e8a0b4)", opacity: 0.6 }} />
          </div>
          <p className="text-foreground/50 text-sm font-medium mb-1">No photos yet</p>
          <p className="text-foreground/30 text-xs">Tap "Add Photos" to start your collection</p>
        </motion.div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(p.id)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm group"
            >
              {/* Image */}
              {p.src ? (
                <img src={p.src} alt={p.caption} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${135 + i * 30}deg, var(--accent-color, #e8a0b4)33, var(--accent-color, #f48fb1)22)`,
                  }}
                />
              )}

              {/* Caption overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3 pt-8">
                <p className="text-white text-xs font-medium truncate">{p.caption}</p>
                <p className="text-white/60 text-[10px]">{p.date}</p>
              </div>

              {/* Favorite icon */}
              <button
                onClick={(e) => toggleFav(p.id, e)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-sm cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${favorites.has(p.id) ? "fill-red-400 text-red-400" : "text-white/70"}`}
                />
              </button>

              {/* Delete button */}
              <button
                onClick={(e) => deletePhoto(p.id, e)}
                className="absolute top-2 left-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-white/80" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full-screen viewer */}
      <AnimatePresence>
        {photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
            onClick={() => setSelected(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-12 right-6 p-2 text-white/70 hover:text-white cursor-pointer z-10"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-[90vw] max-w-lg max-h-[70vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {photo.src && (
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-contain" />
              )}
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-center px-6"
            >
              <p className="text-white text-base font-medium">{photo.caption}</p>
              <p className="text-white/50 text-sm mt-1">{photo.date}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
