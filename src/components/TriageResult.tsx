import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Clock, Heart, ShieldAlert, ShieldCheck, Stethoscope } from "lucide-react";
import type { PatientData } from "./TriageForm";

type TriageLevel = "critical" | "emergency" | "urgent" | "standard" | "non-urgent";

interface TriageAssessment {
  level: TriageLevel;
  score: number;
  label: string;
  description: string;
  waitTime: string;
  recommendations: string[];
  warnings: string[];
}

const levelConfig: Record<TriageLevel, { color: string; bg: string; border: string; icon: typeof AlertTriangle }> = {
  critical: { color: "text-triage-critical", bg: "bg-triage-critical/10", border: "border-triage-critical/30", icon: ShieldAlert },
  emergency: { color: "text-triage-emergency", bg: "bg-triage-emergency/10", border: "border-triage-emergency/30", icon: AlertTriangle },
  urgent: { color: "text-triage-urgent", bg: "bg-triage-urgent/10", border: "border-triage-urgent/30", icon: Clock },
  standard: { color: "text-triage-standard", bg: "bg-triage-standard/10", border: "border-triage-standard/30", icon: Stethoscope },
  "non-urgent": { color: "text-triage-non-urgent", bg: "bg-triage-non-urgent/10", border: "border-triage-non-urgent/30", icon: ShieldCheck },
};

function assessPatient(data: PatientData): TriageAssessment {
  let score = 0;
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Consciousness
  if (data.consciousness === "unresponsive") { score += 40; warnings.push("Patient unresponsive - immediate attention required"); }
  else if (data.consciousness === "pain") { score += 30; warnings.push("Altered consciousness detected"); }
  else if (data.consciousness === "verbal") { score += 15; }

  // Breathing
  if (data.breathingDifficulty === "severe") { score += 30; warnings.push("Severe breathing difficulty"); }
  else if (data.breathingDifficulty === "moderate") { score += 15; }
  else if (data.breathingDifficulty === "mild") score += 5;

  // Vitals
  const temp = parseFloat(data.temperature);
  if (!isNaN(temp)) {
    if (temp >= 104) { score += 25; warnings.push("Dangerously high fever"); }
    else if (temp >= 101) { score += 10; }
    else if (temp <= 95) { score += 20; warnings.push("Hypothermia detected"); }
  }

  const hr = parseInt(data.heartRate);
  if (!isNaN(hr)) {
    if (hr > 150 || hr < 40) { score += 25; warnings.push("Critical heart rate"); }
    else if (hr > 120 || hr < 50) score += 10;
  }

  // Critical symptoms
  const critical = ["Loss of Consciousness", "Seizure", "Stroke Symptoms", "Chest Pain", "Severe Headache"];
  const hasCritical = data.symptoms.filter((s) => critical.includes(s));
  score += hasCritical.length * 15;
  if (hasCritical.length) warnings.push(`Critical symptom(s): ${hasCritical.join(", ")}`);

  score += data.symptoms.length * 3;
  score += data.painLevel * 2;

  if (data.onsetDuration === "minutes") score += 10;
  else if (data.onsetDuration === "hours") score += 5;

  // Clamp
  score = Math.min(100, score);

  let level: TriageLevel;
  let label: string;
  let description: string;
  let waitTime: string;

  if (score >= 80) {
    level = "critical"; label = "Level 1 — Critical";
    description = "Immediate life-threatening condition. Requires resuscitation or immediate intervention.";
    waitTime = "Immediate";
    recommendations.push("Activate emergency response team", "Continuous monitoring required", "Prepare for potential resuscitation");
  } else if (score >= 60) {
    level = "emergency"; label = "Level 2 — Emergency";
    description = "Potentially life-threatening. Rapid assessment and treatment needed.";
    waitTime = "≤ 10 minutes";
    recommendations.push("Priority physician assessment", "Initiate critical care protocols", "Continuous vital monitoring");
  } else if (score >= 40) {
    level = "urgent"; label = "Level 3 — Urgent";
    description = "Serious condition requiring timely care within 30 minutes.";
    waitTime = "≤ 30 minutes";
    recommendations.push("Physician assessment within 30 min", "Monitor vitals every 15 min", "Administer initial pain management");
  } else if (score >= 20) {
    level = "standard"; label = "Level 4 — Standard";
    description = "Less urgent. Can wait for assessment but needs medical attention.";
    waitTime = "≤ 60 minutes";
    recommendations.push("Standard clinical assessment", "Monitor for symptom changes", "Provide comfort measures");
  } else {
    level = "non-urgent"; label = "Level 5 — Non-Urgent";
    description = "Minor condition. Can be seen when resources are available.";
    waitTime = "≤ 120 minutes";
    recommendations.push("Standard intake process", "Consider outpatient options", "Reassess if symptoms worsen");
  }

  return { level, score, label, description, waitTime, recommendations, warnings };
}

interface Props {
  patientData: PatientData;
  onReset: () => void;
}

const TriageResult = ({ patientData, onReset }: Props) => {
  const result = assessPatient(patientData);
  const config = levelConfig[result.level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-surface rounded-2xl p-8 max-w-2xl w-full mx-auto"
    >
      {/* Header */}
      <div className={`rounded-xl ${config.bg} border ${config.border} p-6 mb-6`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${config.bg} ${result.level === "critical" ? "triage-pulse" : ""}`}>
            <Icon className={`h-7 w-7 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold font-display ${config.color}`}>{result.label}</h2>
            <p className="text-sm text-foreground/70 mt-1">{result.description}</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold font-display ${config.color}`}>{result.score}</p>
            <p className="text-xs text-muted-foreground">Severity Score</p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground mb-1">Patient</p>
          <p className="font-semibold text-foreground">{patientData.name || "Anonymous"}</p>
          <p className="text-sm text-muted-foreground">{patientData.age ? `${patientData.age} yrs` : "—"} · {patientData.gender || "—"}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground mb-1">Estimated Wait</p>
          <div className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${config.color}`} />
            <p className={`text-lg font-bold font-display ${config.color}`}>{result.waitTime}</p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="rounded-xl border border-triage-critical/20 bg-triage-critical/5 p-4 mb-6">
          <h3 className="text-sm font-semibold text-triage-critical flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" /> Clinical Warnings
          </h3>
          <ul className="space-y-1">
            {result.warnings.map((w) => (
              <li key={w} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-triage-critical flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="rounded-xl bg-muted/50 p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-primary" /> Recommended Actions
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((r) => (
            <li key={r} className="text-sm text-foreground/80 flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Vitals summary */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Temp", value: patientData.temperature ? `${patientData.temperature}°F` : "—" },
          { label: "HR", value: patientData.heartRate ? `${patientData.heartRate} bpm` : "—" },
          { label: "Pain", value: `${patientData.painLevel}/10` },
          { label: "Symptoms", value: String(patientData.symptoms.length) },
        ].map((v) => (
          <div key={v.label} className="text-center rounded-lg bg-muted/50 py-3">
            <p className="text-lg font-bold font-display text-foreground">{v.value}</p>
            <p className="text-xs text-muted-foreground">{v.label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mb-4">
        ⚠️ This is an AI-assisted assessment tool. All triage decisions must be verified by qualified medical personnel.
      </p>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl bg-muted px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors w-full justify-center"
      >
        <ArrowLeft className="h-4 w-4" /> New Assessment
      </button>
    </motion.div>
  );
};

export default TriageResult;
