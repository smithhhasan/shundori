import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Image, Heart, MessageCircle, Clock, Gift, MapPin, Settings } from "lucide-react";
import { appData } from "@/data/shundori-data";

const quickAccess = [
  { label: "Photos", icon: Image, path: "/app/photos", color: "#f5a623" },
  { label: "Memories", icon: Heart, path: "/app/memories", color: "#ff6b9d" },
  { label: "Jhogra", icon: MessageCircle, path: "/app/jhogra", color: "#a18cd1" },
  { label: "First Meet", icon: Clock, path: "/app/first-meet", color: "#4facfe" },
  { label: "Gifts", icon: Gift, path: "/app/gifts", color: "#f093fb" },
  { label: "Name on Land", icon: MapPin, path: "/app/name-on-land", color: "#667eea" },
  { label: "Settings", icon: Settings, path: "/app/settings", color: "#8e8e93" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeSection({ customName }: { customName: string }) {
  const navigate = useNavigate();
  const isDark = localStorage.getItem("shundori-dark") === "true";
  const firstName = customName.split(" ")[0] || "there";

  return (
    <div className="px-5 pt-2 pb-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <p className="text-[13px] mb-1"
          style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", fontWeight: 500 }}
        >
          {getGreeting()}, {firstName}
        </p>
        <p className="text-[13px] mb-6"
          style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}
        >
          A little space for the moments worth keeping.
        </p>

        {/* Quick access grid */}
        <div className="grid grid-cols-4 gap-3">
          {quickAccess.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-none"
              >
                <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center"
                  style={{ background: `${item.color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <span className="text-[10px]"
                  style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontWeight: 500 }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
