import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";

interface Props {
  onSelect: (dateStr: string) => void;
  onClose: () => void;
  accentColor?: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function CalendarPicker({ onSelect, onClose, accentColor = "#e8a0b4" }: Props) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(2003, 4, 1)); // Start at May 2003
  const [selected, setSelected] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));

  const selectDay = (day: number) => {
    const d = new Date(year, month, day);
    setSelected(d);
    // Format as "4May2003"
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formatted = `${d.getDate()}${monthNames[d.getMonth()]}${d.getFullYear()}`;
    onSelect(formatted);
  };

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const isSelected = (day: number) =>
    selected?.getDate() === day && selected?.getMonth() === month && selected?.getFullYear() === year;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 8 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 z-50 w-[300px] rounded-2xl p-4 shadow-xl"
        style={{
          background: "rgba(28,28,30,0.97)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-white/60" />
          </button>
          <p className="text-white text-sm font-semibold">
            {MONTHS[month]} {year}
          </p>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => (
            <button
              key={i}
              disabled={day === null}
              onClick={() => day && selectDay(day)}
              className="aspect-square flex items-center justify-center rounded-xl text-xs cursor-pointer transition-all"
              style={{
                color: day === null ? "transparent" : isSelected(day!) ? "#fff" : "rgba(255,255,255,0.8)",
                background: isSelected(day!) ? accentColor : isToday(day!) ? "rgba(255,255,255,0.06)" : "transparent",
                fontWeight: isSelected(day!) ? 600 : 400,
              }}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-[10px] text-white/20 mt-3">
          Select the password date
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
