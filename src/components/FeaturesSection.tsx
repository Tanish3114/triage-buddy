import { motion } from "framer-motion";
import { Brain, Clock, BarChart3, ShieldCheck, Users, Zap } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Analysis", description: "Advanced algorithms assess symptoms, vitals, and medical history for accurate severity scoring." },
  { icon: Clock, title: "Reduce Wait Times", description: "Prioritize critical patients instantly, cutting average triage time by up to 60%." },
  { icon: ShieldCheck, title: "Early Detection", description: "Identify life-threatening conditions early with pattern recognition across multiple indicators." },
  { icon: BarChart3, title: "5-Level Scoring", description: "ESI-aligned severity classification from non-urgent to critical for standardized care." },
  { icon: Users, title: "Better Prioritization", description: "Ensure the sickest patients are seen first with objective, consistent assessments." },
  { icon: Zap, title: "Instant Results", description: "Get triage recommendations in seconds with actionable clinical guidance." },
];

const FeaturesSection = () => (
  <section className="py-24 bg-card">
    <div className="container">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
          Why AI Triage?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Transforming emergency care with intelligent, evidence-based patient prioritization.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent mb-4 group-hover:bg-primary/10 transition-colors">
              <f.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold font-display text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
