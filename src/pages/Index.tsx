import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import TriageForm, { type PatientData } from "@/components/TriageForm";
import TriageResult from "@/components/TriageResult";
import FeaturesSection from "@/components/FeaturesSection";
import { Activity } from "lucide-react";

type View = "landing" | "form" | "result";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const triageRef = useRef<HTMLDivElement>(null);

  const startTriage = () => {
    setView("form");
    setTimeout(() => triageRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSubmit = (data: PatientData) => {
    setPatientData(data);
    setView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setView("landing");
    setPatientData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">TriageAI</span>
          </div>
          <button
            onClick={startTriage}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Start Assessment
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroSection onStartTriage={startTriage} />
            <FeaturesSection />
          </motion.div>
        )}

        {view === "form" && (
          <motion.div
            key="form"
            ref={triageRef}
            className="pt-28 pb-20 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold font-display text-foreground mb-2">Patient Assessment</h2>
              <p className="text-muted-foreground">Complete the form to receive an AI triage recommendation.</p>
            </div>
            <TriageForm onSubmit={handleSubmit} />
          </motion.div>
        )}

        {view === "result" && patientData && (
          <motion.div
            key="result"
            className="pt-28 pb-20 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold font-display text-foreground mb-2">Triage Assessment</h2>
              <p className="text-muted-foreground">AI-generated severity analysis and recommendations.</p>
            </div>
            <TriageResult patientData={patientData} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 TriageAI — AI-assisted triage tool. Not a substitute for professional medical judgment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
