import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, Thermometer, AlertTriangle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PatientData {
  name: string;
  age: string;
  gender: string;
  chiefComplaint: string;
  symptoms: string[];
  painLevel: number;
  temperature: string;
  heartRate: string;
  breathingDifficulty: string;
  consciousness: string;
  onsetDuration: string;
  medicalHistory: string;
}

const symptomOptions = [
  "Chest Pain", "Shortness of Breath", "Severe Headache", "High Fever",
  "Abdominal Pain", "Dizziness", "Nausea/Vomiting", "Bleeding",
  "Confusion", "Loss of Consciousness", "Trauma/Injury", "Allergic Reaction",
  "Seizure", "Stroke Symptoms", "Difficulty Swallowing", "Severe Back Pain",
];

const steps = [
  { icon: User, label: "Patient Info" },
  { icon: Thermometer, label: "Vitals" },
  { icon: AlertTriangle, label: "Symptoms" },
  { icon: FileText, label: "Details" },
];

interface Props {
  onSubmit: (data: PatientData) => void;
}

const TriageForm = ({ onSubmit }: Props) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<PatientData>({
    name: "", age: "", gender: "", chiefComplaint: "",
    symptoms: [], painLevel: 0, temperature: "", heartRate: "",
    breathingDifficulty: "", consciousness: "", onsetDuration: "", medicalHistory: "",
  });

  const update = (field: keyof PatientData, value: string | string[] | number) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleSymptom = (s: string) =>
    update("symptoms", data.symptoms.includes(s) ? data.symptoms.filter((x) => x !== s) : [...data.symptoms, s]);

  const next = () => step < 3 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const handleSubmit = () => onSubmit(data);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Patient Name</Label>
              <Input placeholder="Full name" value={data.name} onChange={(e) => update("name", e.target.value)} className="h-12 rounded-xl border-border bg-muted/50 focus:bg-card" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Age</Label>
                <Input type="number" placeholder="Age" value={data.age} onChange={(e) => update("age", e.target.value)} className="h-12 rounded-xl border-border bg-muted/50 focus:bg-card" />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Gender</Label>
                <Select value={data.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger className="h-12 rounded-xl border-border bg-muted/50"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Temperature (°F)</Label>
                <Input placeholder="98.6" value={data.temperature} onChange={(e) => update("temperature", e.target.value)} className="h-12 rounded-xl border-border bg-muted/50 focus:bg-card" />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Heart Rate (bpm)</Label>
                <Input placeholder="72" value={data.heartRate} onChange={(e) => update("heartRate", e.target.value)} className="h-12 rounded-xl border-border bg-muted/50 focus:bg-card" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Breathing Difficulty</Label>
              <Select value={data.breathingDifficulty} onValueChange={(v) => update("breathingDifficulty", v)}>
                <SelectTrigger className="h-12 rounded-xl border-border bg-muted/50"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Level of Consciousness</Label>
              <Select value={data.consciousness} onValueChange={(v) => update("consciousness", v)}>
                <SelectTrigger className="h-12 rounded-xl border-border bg-muted/50"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">Alert & Oriented</SelectItem>
                  <SelectItem value="verbal">Responds to Verbal</SelectItem>
                  <SelectItem value="pain">Responds to Pain</SelectItem>
                  <SelectItem value="unresponsive">Unresponsive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Chief Complaint</Label>
              <Input placeholder="Primary reason for visit" value={data.chiefComplaint} onChange={(e) => update("chiefComplaint", e.target.value)} className="h-12 rounded-xl border-border bg-muted/50 focus:bg-card" />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-3 block">Select Symptoms</Label>
              <div className="flex flex-wrap gap-2">
                {symptomOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                      data.symptoms.includes(s)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-2 block">Pain Level: {data.painLevel}/10</Label>
              <input
                type="range" min={0} max={10} value={data.painLevel}
                onChange={(e) => update("painLevel", Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>No Pain</span><span>Worst Pain</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Symptom Onset Duration</Label>
              <Select value={data.onsetDuration} onValueChange={(v) => update("onsetDuration", v)}>
                <SelectTrigger className="h-12 rounded-xl border-border bg-muted/50"><SelectValue placeholder="When did it start?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes ago</SelectItem>
                  <SelectItem value="hours">Hours ago</SelectItem>
                  <SelectItem value="days">Days ago</SelectItem>
                  <SelectItem value="weeks">Weeks ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">Medical History</Label>
              <Textarea placeholder="Relevant conditions, medications, allergies..." value={data.medicalHistory} onChange={(e) => update("medicalHistory", e.target.value)} className="min-h-[120px] rounded-xl border-border bg-muted/50 focus:bg-card" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="glass-surface rounded-2xl p-8 max-w-xl w-full mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <s.icon className="h-4 w-4" />
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < 3 && <div className={`h-0.5 w-8 mx-2 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < 3 ? (
          <button onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground glow-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Analyze <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TriageForm;
