import { useState, useEffect, useRef } from "react";
import { X, ArrowLeft, Home, FileText } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  initialService?: "stays" | "management" | null;
}

const SLIDES: Record<"stays" | "management", { eyebrow: string; headline: string; body: string }[]> = {
  stays: [
    { eyebrow: "STAYS PARTNERSHIP", headline: "Guaranteed rent. Every month.", body: "We pay you directly, on the same date every month. Whether the property is occupied or not." },
    { eyebrow: "STAYS PARTNERSHIP", headline: "Zero voids. Zero headaches.", body: "No tenant hunting. No management stress. We become your company tenant and handle everything." },
    { eyebrow: "STAYS PARTNERSHIP", headline: "Let's find out what your property is worth.", body: "A quick call and a free valuation. No obligation. Just the numbers." },
  ],
  management: [
    { eyebrow: "PROPERTY MANAGEMENT", headline: "We handle everything.", body: "From finding the right tenants to fixing boilers at midnight. You do nothing." },
    { eyebrow: "PROPERTY MANAGEMENT", headline: "One monthly statement.", body: "Clear, transparent, always on time. You see every penny in and out." },
    { eyebrow: "PROPERTY MANAGEMENT", headline: "Let's talk about your property.", body: "Tell us where it is and what you need. We'll come back with a clear proposal." },
  ],
};

function AnimatedCheckmark() {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 80); return () => clearTimeout(t); }, []);
  const cLen = 2 * Math.PI * 34;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" style={{ marginBottom: 28 }}>
      <circle cx="44" cy="44" r="34" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
      <circle
        cx="44" cy="44" r="34"
        stroke="#C9A84C" strokeWidth="1.5"
        strokeDasharray={cLen} strokeDashoffset={shown ? 0 : cLen}
        transform="rotate(-90 44 44)"
        style={{ transition: `stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1)` }}
      />
      <path
        d="M27 44 L38 55 L61 31"
        stroke="#C9A84C" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"
        strokeDasharray="60" strokeDashoffset={shown ? 0 : 60}
        style={{ transition: `stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1) 0.5s` }}
      />
    </svg>
  );
}

const INP = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#E8E2D8",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  fontWeight: 300,
  padding: "11px 14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
  transition: "border-color 150ms",
} as React.CSSProperties;

const LBL: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#8C8880",
  display: "block",
  marginBottom: 7,
};

function Field({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={LBL}>{label}</label>
      {children}
    </div>
  );
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      {...props}
      style={{ ...INP, borderColor: focus ? "#C9A84C" : "rgba(255,255,255,0.1)" }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focus, setFocus] = useState(false);
  return (
    <select
      {...props}
      style={{ ...INP, borderColor: focus ? "#C9A84C" : "rgba(255,255,255,0.1)", appearance: "none" }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      {...props}
      style={{ ...INP, borderColor: focus ? "#C9A84C" : "rgba(255,255,255,0.1)", resize: "none", display: "block" }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

export function LandlordEnquiryModal({ open, onClose, initialService = null }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [service, setService] = useState<"stays" | "management" | null>(initialService);
  const [slide, setSlide] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animOpen, setAnimOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", bedrooms: "",
    currentRent: "", tenanted: "No", availableFrom: "", notes: "",
    currentSituation: "", goals: "",
  });

  const resetState = () => {
    setSuccess(false);
    setError(null);
    setSlide(0);
    setForm({ name: "", email: "", phone: "", address: "", bedrooms: "", currentRent: "", tenanted: "No", availableFrom: "", notes: "", currentSituation: "", goals: "" });
    if (initialService) { setService(initialService); setStep(2); }
    else { setService(null); setStep(1); }
  };

  useEffect(() => {
    if (!open) { setAnimOpen(false); return; }
    resetState();
    const t = setTimeout(() => setAnimOpen(true), 20);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Auto-advance slides
  useEffect(() => {
    if (step !== 2 || !service) return;
    const slides = SLIDES[service];
    timerRef.current = setInterval(() => {
      setSlide(prev => {
        if (prev >= slides.length - 1) { clearInterval(timerRef.current!); setStep(3); return prev; }
        setSlideDir(1);
        return prev + 1;
      });
    }, 3500);
    return () => clearInterval(timerRef.current!);
  }, [step, service]);

  const goToSlide = (i: number) => {
    setSlideDir(i > slide ? 1 : -1);
    setSlide(i);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "landlord",
          service_type: service,
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          address: form.address || undefined,
          bedrooms: parseInt(form.bedrooms) || undefined,
          current_rent: service === "stays" ? parseFloat(form.currentRent) || undefined : undefined,
          tenanted: service === "stays" ? form.tenanted === "Yes" : undefined,
          available_from: service === "stays" ? form.availableFrom || undefined : undefined,
          message: service === "stays" ? form.notes || undefined : undefined,
          current_situation: service === "management" ? form.currentSituation || undefined : undefined,
          goals: service === "management" ? form.goals || undefined : undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || "Failed to submit enquiry.");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  if (!open) return null;

  const slides = service ? SLIDES[service] : [];
  const currentSlide = slides[slide];

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(4,3,6,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          maxHeight: "92vh",
          background: "#0D0C0F",
          border: "1px solid rgba(201,168,76,0.2)",
          overflowY: "auto",
          opacity: animOpen ? 1 : 0,
          transform: animOpen ? "scale(1)" : "scale(0.97)",
          transition: "opacity 250ms ease, transform 250ms ease",
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#8C8880", cursor: "pointer", zIndex: 10, padding: 4 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
        >
          <X size={18} />
        </button>

        <div style={{ padding: "48px 44px" }}>

          {/* SUCCESS */}
          {success && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "24px 0" }}>
              <AnimatedCheckmark />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "#E8E2D8", margin: "0 0 16px" }}>We will be in touch shortly.</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 300, color: "#8C8880", lineHeight: 1.7, marginBottom: 36, maxWidth: 340 }}>
                Our team reviews every enquiry personally. Expect a call within one working day.
              </p>
              <button onClick={onClose} className="btn-gold" style={{ padding: "13px 36px" }}>Close</button>
            </div>
          )}

          {/* STEP 1 — Service selection */}
          {!success && step === 1 && (
            <div>
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: "#E8E2D8", margin: "0 0 12px", lineHeight: 1.1 }}>
                  Your Property. Our Expertise.
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880" }}>
                  Choose the service that fits your situation.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {([
                  { key: "stays" as const, Icon: Home, title: "Stays Partnership", desc: "Guaranteed monthly rent, paid directly to you. We become your tenant and manage everything." },
                  { key: "management" as const, Icon: FileText, title: "Property Management", desc: "Traditional letting management at a fixed monthly fee. Full compliance, inspections, and rent collection." },
                ] as const).map(({ key, Icon, title, desc }) => (
                  <button key={key} onClick={() => { setService(key); setStep(2); setSlide(0); }}
                    style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.1)",
                      padding: "24px 24px", textAlign: "left", cursor: "pointer",
                      display: "flex", alignItems: "flex-start", gap: 20,
                      transition: "border-color 150ms, background 150ms",
                    }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = "rgba(201,168,76,0.4)"; b.style.background = "rgba(201,168,76,0.04)"; }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = "rgba(201,168,76,0.1)"; b.style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    <div style={{ width: 36, height: 36, background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Icon size={16} color="#C9A84C" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500, color: "#E8E2D8", marginBottom: 6 }}>{title}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: "#8C8880", lineHeight: 1.65 }}>{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Info slides */}
          {!success && step === 2 && service && currentSlide && (
            <div>
              {!initialService && (
                <button onClick={() => setStep(1)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#8C8880", cursor: "pointer", marginBottom: 32, padding: 0, fontFamily: "var(--font-body)", fontSize: 13 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}

              <div style={{ minHeight: 220, marginBottom: 44 }}>
                <div className="label-style" style={{ color: "#C9A84C", marginBottom: 24 }}>{currentSlide.eyebrow}</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, color: "#E8E2D8", margin: "0 0 20px", lineHeight: 1.1 }}>
                  {currentSlide.headline}
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 300, color: "#8C8880", lineHeight: 1.75 }}>
                  {currentSlide.body}
                </p>
              </div>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => goToSlide(i)} style={{
                    width: i === slide ? 24 : 8, height: 2,
                    background: i === slide ? "#C9A84C" : "rgba(201,168,76,0.25)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 300ms, background 300ms",
                  }} />
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={() => { clearInterval(timerRef.current!); setStep(3); }} className="btn-gold" style={{ padding: "13px 28px", fontSize: 14 }}>
                  Continue to Enquiry
                </button>
                {slide < slides.length - 1 && (
                  <button onClick={() => goToSlide(slide + 1)} style={{ background: "none", border: "none", fontFamily: "var(--font-body)", fontSize: 13, color: "#8C8880", cursor: "pointer", padding: "13px 0" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Form */}
          {!success && step === 3 && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <button type="button" onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "#8C8880", cursor: "pointer", padding: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "#E8E2D8", margin: 0, lineHeight: 1.1 }}>
                    {service === "stays" ? "Stays Partnership" : "Property Management"}
                  </h2>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: "#8C8880", margin: "6px 0 0" }}>Tell us about your property.</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name *"><StyledInput required value={form.name} onChange={set("name")} /></Field>
                  <Field label="Phone"><StyledInput type="tel" value={form.phone} onChange={set("phone")} /></Field>
                </div>
                <Field label="Email *"><StyledInput required type="email" value={form.email} onChange={set("email")} /></Field>
                <Field label="Property Address"><StyledInput value={form.address} onChange={set("address")} placeholder="e.g. 12 Park Lane, Manchester" /></Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bedrooms"><StyledInput type="number" min="1" max="10" value={form.bedrooms} onChange={set("bedrooms")} /></Field>
                  {service === "stays" && (
                    <Field label="Current Rent £/pm"><StyledInput type="number" min="0" value={form.currentRent} onChange={set("currentRent")} /></Field>
                  )}
                </div>

                {service === "stays" ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Currently Tenanted">
                        <StyledSelect value={form.tenanted} onChange={set("tenanted")}>
                          <option>No</option>
                          <option>Yes</option>
                        </StyledSelect>
                      </Field>
                      <Field label="Available From"><StyledInput type="date" value={form.availableFrom} onChange={set("availableFrom")} /></Field>
                    </div>
                    <Field label="Additional Notes">
                      <StyledTextarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Anything else we should know…" />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Current Situation">
                      <StyledTextarea rows={2} value={form.currentSituation} onChange={set("currentSituation")} placeholder="e.g. Self-managing but lacking time…" />
                    </Field>
                    <Field label="Your Goals">
                      <StyledTextarea rows={2} value={form.goals} onChange={set("goals")} placeholder="e.g. Fully passive income, better compliance…" />
                    </Field>
                  </>
                )}

                {error && (
                  <div style={{ background: "rgba(196,68,68,0.08)", border: "1px solid rgba(196,68,68,0.3)", padding: "12px 14px", color: "#C44444", fontFamily: "var(--font-body)", fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 14, marginTop: 4, opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Submitting…" : "Submit Enquiry"}
                </button>

                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#5C5854", textAlign: "center" }}>
                  By submitting you agree to our Privacy Policy. We will never share your data.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
