"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ScoreGauge = dynamic(() => import("@/components/ScoreGauge"), { ssr: false });

type Answers = Record<string, string>;
type MinimalCountry = { flag: string; name: string };
type MinimalContact = { whatsapp: string; phone: string };

const FALLBACK: { countries: MinimalCountry[]; contact: MinimalContact } = {
  countries: [
    { flag: "🇬🇧", name: "United Kingdom" },
    { flag: "🇺🇸", name: "United States" },
    { flag: "🇨🇦", name: "Canada" },
    { flag: "🇦🇺", name: "Australia" },
    { flag: "🇪🇺", name: "Schengen States" },
    { flag: "🇹🇷", name: "Turkey" },
  ],
  contact: { whatsapp: "923145352222", phone: "+92 314 535 2222" },
};

function scoreAnswers(a: Answers): number {
  let s = 40;
  const income = a.income || "";
  if (income.includes("500k+")) s += 15;
  else if (income.includes("250k")) s += 11;
  else if (income.includes("100k")) s += 7;
  else s += 2;
  const bank = a.bank || "";
  if (bank.includes("3M+")) s += 15;
  else if (bank.includes("1.5M – 3M")) s += 11;
  else if (bank.includes("500k – 1.5M")) s += 7;
  else s += 2;
  const travel = a.travel || "";
  if (travel.includes("Strong")) s += 15;
  else if (travel.includes("1–2")) s += 10;
  else if (travel.includes("Regional")) s += 6;
  const refusal = a.refusal || "";
  if (refusal.includes("No")) s += 10;
  else if (refusal.includes("One")) s += 3;
  else s -= 6;
  const emp = a.employment || "";
  if (emp.includes("Business") || emp.includes("Salaried")) s += 5;
  return Math.max(10, Math.min(97, s));
}

export default function EligibilityPage() {
  const [ctx, setCtx] = useState(FALLBACK);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [result, setResult] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // hydrate from content JSON at runtime (client-side)
  useEffect(() => {
    fetch("/api/public/content")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.countries?.length) {
          setCtx({
            countries: data.countries.map((c: MinimalCountry) => ({ flag: c.flag, name: c.name })),
            contact: { whatsapp: data.contact.whatsapp, phone: data.contact.phone },
          });
        }
      })
      .catch(() => {});
  }, []);

  const steps = [
    { key: "country", title: "Where do you want to go?", options: ctx.countries.map((c) => `${c.flag} ${c.name}`) },
    { key: "purpose", title: "Purpose of travel?", options: ["🧳 Tourism", "💼 Business", "👨‍👩‍👧 Family Visit", "🏥 Medical", "🎓 Study"] },
    { key: "employment", title: "Your employment status?", options: ["Salaried (Govt/Private)", "Business Owner", "Self-Employed / Freelancer", "Student", "Retired / Other"] },
    { key: "income", title: "Monthly income range (PKR)?", options: ["Under 100k", "100k – 250k", "250k – 500k", "500k+"] },
    { key: "bank", title: "Average 6-month bank balance?", options: ["Under 500k", "500k – 1.5M", "1.5M – 3M", "3M+"] },
    { key: "travel", title: "Previous international travel?", options: ["Never travelled", "Regional only (UAE/Saudi/Asia)", "1–2 major countries", "Strong history (3+ countries)"] },
    { key: "refusal", title: "Any previous visa refusals?", options: ["No refusals", "One refusal", "Multiple refusals"] },
  ];

  const total = steps.length + 1;
  const progress = Math.round(((step + (result !== null ? 1 : 0)) / total) * 100);

  function pick(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(() => setStep((s) => s + 1), 220);
  }

  async function submit() {
    setError("");
    if (!contact.name.trim() || !/^0?3\d{9}$|^\+?92\d{10}$|^\d{10,13}$/.test(contact.phone.replace(/[\s-]/g, ""))) {
      setError("Please enter your name and a valid Pakistani phone number.");
      return;
    }
    setSubmitting(true);
    const score = scoreAnswers(answers);
    try {
      await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, answers, score }),
      });
    } catch { /* noop */ }
    setSubmitting(false);
    setResult(score);
  }

  const band = result === null ? null : result >= 70 ? "strong" : result >= 45 ? "moderate" : "weak";

  return (
    <div className="relative mx-auto min-h-[85dvh] max-w-2xl px-6 py-20">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora-1 absolute left-0 top-24 h-[420px] w-[420px] rounded-full bg-[#5B8DEF] opacity-[0.10] blur-[130px]" />
        <div className="aurora-2 absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-gold-500 opacity-[0.07] blur-[130px]" />
      </div>

      <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Free Assessment</p>
      <h1 className="mt-3 text-center font-display text-[clamp(30px,5vw,48px)] font-extrabold tracking-tight text-white">
        Are You <span className="text-gold-gradient">Eligible?</span>
      </h1>
      <p className="mt-3 text-center text-white/55">60 seconds. Honest answer. Zero commitment.</p>

      <div className="mt-10 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-700" style={{ width: `${result !== null ? 100 : progress}%` }} />
      </div>

      {result !== null ? (
        <div className="glass-strong mt-10 rounded-[26px] p-8 text-center shadow-card">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">Your Profile Score</p>
          <div className="relative mx-auto mt-6 h-56 w-56">
            <ScoreGauge value={result} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className={`font-display text-6xl font-extrabold ${band === "strong" ? "text-emerald-400" : band === "moderate" ? "text-gold-400" : "text-rose-400"}`}>{result}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">/ 100</p>
            </div>
          </div>
          <p className="mt-5 font-display text-xl font-bold text-white">
            {band === "strong" ? "Strong profile — file-ready 🎉" : band === "moderate" ? "Promising — needs strategic strengthening" : "Not ready yet — but fixable"}
          </p>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/60">
            {band === "strong"
              ? "Your profile matches what embassies approve. Book your consultation and let's file while the profile is hot."
              : band === "moderate"
              ? "A few targeted fixes (documentation framing, financial narrative) will meaningfully raise your approval odds. We'll show you exactly which ones."
              : "Applying now would risk a refusal on record. We'll give you a concrete 3–6 month roadmap to become approval-ready. That honesty is the whole point of us."}
          </p>
          <a href={`https://wa.me/${ctx.contact.whatsapp}?text=My%20eligibility%20score%20is%20${result}.%20I%20want%20a%20free%20consultation.`} className="btn-gold mt-8 inline-block rounded-full px-8 py-4 text-[15px]">
            Book Free Consultation →
          </a>
          <p className="mt-5 text-[12px] text-white/35">Our team will also call you at the number you provided.</p>
        </div>
      ) : step < steps.length ? (
        <div key={step} className="mt-10">
          <p className="text-center text-[13px] text-white/45">Question {step + 1} of {steps.length}</p>
          <h2 className="mt-2 text-center font-display text-2xl font-bold text-white">{steps[step].title}</h2>
          <div className="mt-8 grid gap-3">
            {steps[step].options.map((o) => (
              <button
                key={o}
                onClick={() => pick(steps[step].key, o)}
                className={`glass rounded-2xl px-6 py-4 text-left text-[15px] text-white/80 transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-500/8 hover:text-white ${answers[steps[step].key] === o ? "border-gold-500/70 bg-gold-500/10" : ""}`}
              >
                {o}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="mt-6 text-sm text-white/40 transition hover:text-white/70">← Back</button>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="text-center font-display text-2xl font-bold text-white">Almost done — where do we send your result?</h2>
          <div className="mt-8 space-y-4">
            <input placeholder="Full name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="glass w-full rounded-2xl px-6 py-4 text-[15px] text-white placeholder-white/35 outline-none focus:border-gold-500/60" />
            <input placeholder="Phone / WhatsApp (03XX...)" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="glass w-full rounded-2xl px-6 py-4 text-[15px] text-white placeholder-white/35 outline-none focus:border-gold-500/60" />
            <input placeholder="Email (optional)" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="glass w-full rounded-2xl px-6 py-4 text-[15px] text-white placeholder-white/35 outline-none focus:border-gold-500/60" />
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button onClick={submit} disabled={submitting} className="btn-gold w-full rounded-full px-8 py-4 text-[15px] disabled:opacity-60">
              {submitting ? "Calculating…" : "Show My Score →"}
            </button>
            <button onClick={() => setStep((s) => s - 1)} className="w-full text-sm text-white/40 transition hover:text-white/70">← Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
