import { motion } from "framer-motion";
import { Activity, Clock, ShieldCheck, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Clock, label: "Reduced Wait Times", value: "60%" },
  { icon: ShieldCheck, label: "Accuracy Rate", value: "94%" },
  { icon: Zap, label: "Faster Triage", value: "3x" },
];

const HeroSection = ({ onStartTriage }: { onStartTriage: () => void }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Healthcare</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] text-primary-foreground mb-6">
              Intelligent{" "}
              <span className="text-gradient-hero">Triage</span>{" "}
              Assistant
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-lg leading-relaxed">
              Assess patient severity instantly with AI. Prioritize care, reduce wait times, and detect critical cases early.
            </p>

            <motion.button
              onClick={onStartTriage}
              className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground glow-primary transition-all hover:scale-105 active:scale-[0.98]"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Activity className="h-5 w-5" />
              Start Triage Assessment
            </motion.button>
          </motion.div>

          <motion.div
            className="flex gap-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/20">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-primary-foreground">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
