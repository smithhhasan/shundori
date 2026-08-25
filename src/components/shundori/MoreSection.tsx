import { motion } from "framer-motion";
import { Clock, Gift, Mountain } from "lucide-react";
import { useNavigate } from "react-router";

const items = [
  { label: "First Meet", icon: Clock, path: "/app/first-meet", desc: "Where it all started" },
  { label: "Gifts", icon: Gift, path: "/app/gifts", desc: "A few little surprises" },
  { label: "Your Name on Land", icon: Mountain, path: "/app/name-on-land", desc: "A name worth remembering" },
];

export default function MoreSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full px-4 py-6 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-6"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        More
      </motion.h2>

      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 bg-white/50 backdrop-blur-lg rounded-3xl p-5 shadow-sm border border-white/30 cursor-pointer text-left"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-color, #e8a0b4)15" }}
              >
                <Icon className="w-5 h-5" style={{ color: "var(--accent-color, #e8a0b4)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-foreground/40 text-xs">{item.desc}</p>
              </div>
              <span className="text-foreground/20 text-sm">→</span>
            </motion.button>
          );
        })}

        {/* Settings link */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/app/settings")}
          className="w-full flex items-center gap-4 bg-white/50 backdrop-blur-lg rounded-3xl p-5 shadow-sm border border-white/30 cursor-pointer text-left"
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-foreground/5">
            <span className="text-lg">⚙️</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm">Settings</p>
            <p className="text-foreground/40 text-xs">Appearance, name, icon</p>
          </div>
          <span className="text-foreground/20 text-sm">→</span>
        </motion.button>
      </div>
    </div>
  );
}
