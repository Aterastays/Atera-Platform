import { useState, useEffect } from "react";
import { X, ArrowLeft, BedDouble, MapPin } from "lucide-react";
import { Link } from "wouter";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Property {
  id: string;
  name: string;
  postcode: string | null;
  beds: number | null;
  photos: string[] | null;
}

type Step = 1 | 2 | 3;

function AnimatedCheckmark() {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 80); return () => clearTimeout(t); }, []);
  const cLen = 2 * Math.PI * 34;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" style={{ marginBottom: 28 }}>
      <circle cx="44" cy="44" r="34" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
      <circle
        cx="44" cy="44" r="34" stroke="#C9A84C" strokeWidth="1.5"
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

const INP: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#E8E2D8",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  fontWeight: 300,
  padding: "11px 14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

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

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      {...props}
      style={{ ...INP, ...props.style, borderColor: focus ? "#C9A84C" : "rgba(255,255,255,0.1)" }}
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

export function GuestEnquiryModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropId, setSelectedPropId] = useState<string>("flexible");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animOpen, setAnimOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    checkIn: "", checkOut: "",
    guests: 1, stayType: "Corporate", message: "",
  });

  const nightCount = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  })();

  const selectedProp = properties.find(p => p.id === selectedPropId);

  useEffect(() => {
    if (!open) { setAnimOpen(false); return; }
    setStep(1); setSuccess(false); setError(null); setSelectedPropId("flexible");
    setForm({ firstName: "", lastName: "", email: "", phone: "", checkIn: "", checkOut: "", guests: 1, stayType: "Corporate", message: "" });
    const t = setTimeout(() => setAnimOpen(true), 20);
    fetch("/api/properties/live")
      .then(r => r.ok ? r.json() : [])
      .then((data: Property[]) => setProperties(data))
      .catch(() => setProperties([]));
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

  const handleSubmit = async () => {
    setError(null);
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guest",
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone || undefined,
          property_id: selectedPropId !== "flexible" ? selectedPropId : undefined,
          check_in: form.checkIn || undefined,
          check_out: form.checkOut || undefined,
          guests: form.guests,
          type_of_stay: form.stayType,
          message: form.message || undefined,
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

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.type === "number" ? parseInt(e.target.value) || 1 : e.target.value }));

  if (!open) return null;

  const allProps = [
    { id: "flexible", name: "I'm flexible — any property", postcode: null, beds: null, photos: null },
    ...properties,
  ];

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(4,3,6,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative", width: "100%", maxWidth: 560, maxHeight: "92vh",
          background: "#0D0C0F", border: "1px solid rgba(201,168,76,0.2)",
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
                We review every booking request personally and respond within a few hours.
              </p>
              <button onClick={onClose} className="btn-gold" style={{ padding: "13px 36px" }}>Close</button>
            </div>
          )}

          {/* STEP 1 — Property selection */}
          {!success && step === 1 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: "#E8E2D8", margin: "0 0 8px", lineHeight: 1.1 }}>Book a Stay</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880", marginBottom: 32 }}>Select a property or tell us you're flexible.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {allProps.map(prop => {
                  const isSel = selectedPropId === prop.id;
                  const isFlexible = prop.id === "flexible";
                  return (
                    <button key={prop.id} onClick={() => setSelectedPropId(prop.id)}
                      style={{
                        background: isSel ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isSel ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
                        padding: "16px 20px", textAlign: "left", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 16,
                        transition: "border-color 150ms, background 150ms",
                      }}
                    >
                      {isFlexible ? (
                        <div style={{ width: 40, height: 40, background: "rgba(201,168,76,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <BedDouble size={16} color="#C9A84C" />
                        </div>
                      ) : (
                        <div style={{ width: 40, height: 40, background: "#131217", flexShrink: 0, overflow: "hidden" }}>
                          {prop.photos?.[0]
                            ? <img src={prop.photos[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><BedDouble size={14} color="#8C8880" /></div>
                          }
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 400, color: isSel ? "#E8E2D8" : "#B0A898" }}>{prop.name}</div>
                        {!isFlexible && (prop.postcode || prop.beds) && (
                          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                            {prop.postcode && <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8C8880", display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} />{prop.postcode}</span>}
                            {prop.beds && <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8C8880", display: "flex", alignItems: "center", gap: 3 }}><BedDouble size={10} />{prop.beds} bed</span>}
                          </div>
                        )}
                      </div>
                      {isSel && <div style={{ width: 6, height: 6, background: "#C9A84C", flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setStep(2)} className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "14px 0" }}>
                Continue
              </button>
            </div>
          )}

          {/* STEP 2 — Booking details */}
          {!success && step === 2 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#8C8880", cursor: "pointer", padding: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
                ><ArrowLeft size={16} /></button>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "#E8E2D8", margin: 0, lineHeight: 1.1 }}>Your Details</h2>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: "#8C8880", margin: "6px 0 0" }}>
                    {selectedPropId === "flexible" ? "Any available property" : selectedProp?.name}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="grid grid-cols-2 gap-3">
                  <div><label style={LBL}>First Name *</label><StyledInput required value={form.firstName} onChange={set("firstName")} /></div>
                  <div><label style={LBL}>Last Name *</label><StyledInput required value={form.lastName} onChange={set("lastName")} /></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div><label style={LBL}>Email *</label><StyledInput required type="email" value={form.email} onChange={set("email")} /></div>
                  <div><label style={LBL}>Phone</label><StyledInput type="tel" value={form.phone} onChange={set("phone")} /></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div><label style={LBL}>Check-In *</label><StyledInput required type="date" value={form.checkIn} onChange={set("checkIn")} /></div>
                  <div><label style={LBL}>Check-Out *</label><StyledInput required type="date" value={form.checkOut} onChange={set("checkOut")} /></div>
                </div>

                {nightCount > 0 && (
                  <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8C8880" }}>Duration</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#C9A84C" }}>{nightCount} night{nightCount !== 1 ? "s" : ""}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div><label style={LBL}>Guests</label><StyledInput type="number" min="1" max="20" value={form.guests} onChange={set("guests")} /></div>
                  <div><label style={LBL}>Type of Stay</label>
                    <StyledSelect value={form.stayType} onChange={set("stayType")}>
                      <option value="Corporate">Corporate</option>
                      <option value="Contractor">Contractor</option>
                      <option value="Leisure">Leisure</option>
                      <option value="Relocation">Relocation</option>
                    </StyledSelect>
                  </div>
                </div>

                <div><label style={LBL}>Message (optional)</label>
                  <StyledTextarea rows={3} value={form.message} onChange={set("message")} placeholder="Any specific requirements…" />
                </div>

                <button onClick={() => {
                  if (!form.firstName || !form.lastName || !form.email || !form.checkIn || !form.checkOut) { setError("Please fill in all required fields."); return; }
                  if (new Date(form.checkOut) <= new Date(form.checkIn)) { setError("Check-out must be after check-in."); return; }
                  setError(null); setStep(3);
                }} className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "14px 0", marginTop: 4 }}>
                  Review &amp; Confirm
                </button>

                {error && (
                  <div style={{ background: "rgba(196,68,68,0.08)", border: "1px solid rgba(196,68,68,0.3)", padding: "12px 14px", color: "#C44444", fontFamily: "var(--font-body)", fontSize: 13 }}>
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {!success && step === 3 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "#8C8880", cursor: "pointer", padding: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
                ><ArrowLeft size={16} /></button>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "#E8E2D8", margin: 0 }}>Review Enquiry</h2>
              </div>

              {/* Summary card */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", padding: "24px 24px", marginBottom: 24 }}>
                {[
                  { label: "Property", value: selectedPropId === "flexible" ? "Any available property" : selectedProp?.name },
                  { label: "Guest", value: `${form.firstName} ${form.lastName}` },
                  { label: "Email", value: form.email },
                  form.phone ? { label: "Phone", value: form.phone } : null,
                  { label: "Check-In", value: form.checkIn },
                  { label: "Check-Out", value: form.checkOut },
                  nightCount > 0 ? { label: "Duration", value: `${nightCount} night${nightCount !== 1 ? "s" : ""}` } : null,
                  { label: "Guests", value: String(form.guests) },
                  { label: "Type", value: form.stayType },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, paddingBottom: 12, marginBottom: 12, borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8C8880", flexShrink: 0 }}>{row!.label}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#E8E2D8", textAlign: "right" }}>{row!.value}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#5C5854", marginBottom: 20, textAlign: "center" }}>
                No payment taken now. We confirm your dates and send pricing directly.
              </p>

              {error && (
                <div style={{ background: "rgba(196,68,68,0.08)", border: "1px solid rgba(196,68,68,0.3)", padding: "12px 14px", color: "#C44444", fontFamily: "var(--font-body)", fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "14px 0", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Submitting…" : "Confirm Enquiry"}
              </button>

              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#5C5854", textAlign: "center", marginTop: 12 }}>
                By submitting you agree to our{" "}
                <Link href="/privacy" style={{ color: "#8C8880", textDecoration: "none" }}>Privacy Policy</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
