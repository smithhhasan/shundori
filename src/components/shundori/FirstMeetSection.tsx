import { motion } from "framer-motion";
import { appData } from "@/data/shundori-data";

export default function FirstMeetSection() {
  return (
    <div className="min-h-full px-4 py-6 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-serif mb-1"
        style={{ color: "var(--accent-color, #e8a0b4)" }}
      >
        First Meet
      </motion.h2>
      <p className="text-foreground/40 text-sm mb-8 italic">Where it all started.</p>

      {/* Timeline */}
      <div className="relative ml-4">
        {/* Vertical line */}
        <div
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
          style={{ background: "var(--accent-color, #e8a0b4)", opacity: 0.3 }}
        />

        <div className="space-y-8">
          {appData.firstMeet.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative pl-8"
            >
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 300 }}
                className="absolute left-0 top-1 w-3 h-3 -translate-x-1/2 rounded-full border-2 border-white shadow-sm"
                style={{ background: "var(--accent-color, #e8a0b4)" }}
              />

              <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-5 shadow-sm border border-white/30">
                <h3 className="font-semibold text-foreground text-base mb-1">{item.title}</h3>
                <p className="text-foreground/50 text-sm italic leading-relaxed">
                  "{item.description}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center text-foreground/30 text-sm italic mt-10"
        >
          And somehow, here we are. ✦
        </motion.p>
      </div>
    </div>
  );
}
