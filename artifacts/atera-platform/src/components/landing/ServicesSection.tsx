import { Check } from "lucide-react";

interface ServicesProps {
  onLandlord: () => void;
  onBookStay: () => void;
}

export function ServicesSection({ onLandlord, onBookStay }: ServicesProps) {
  return (
    <section id="dual-audience" style={{ background: "#080709", padding: "140px 0", minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        {/* Headline */}
        <div className="reveal text-center" style={{ marginBottom: 72 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 400, color: "#E8E2D8", margin: "0 0 16px", lineHeight: 1.05 }}>
            Who Are You?
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 300, color: "#8C8880" }}>
            Two services. One standard of excellence.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Guest card */}
          <div className="reveal" style={{ transitionDelay: "0ms" }}>
            <div style={{
              background: "#0D0C0F",
              border: "1px solid rgba(201,168,76,0.15)",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              transition: "transform 200ms ease, border-color 200ms",
              cursor: "pointer",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.15)"; }}
            >
              <div style={{ width: 40, height: 1, background: "#C9A84C", marginBottom: 28 }} />
              <div className="label-style" style={{ color: "#C9A84C", marginBottom: 16 }}>For Guests</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "#E8E2D8", margin: "0 0 20px", lineHeight: 1.1 }}>
                Find Your Perfect Stay
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 300, color: "#8C8880", lineHeight: 1.75, marginBottom: 36, flex: 1 }}>
                Professional, fully managed properties for corporate travellers, contractors, and professionals. Designed for extended stays with everything you need from day one.
              </p>
              <button onClick={onBookStay} className="btn-outline" style={{ alignSelf: "flex-start" }}>
                Browse Properties
              </button>
            </div>
          </div>

          {/* Landlord card */}
          <div className="reveal" style={{ transitionDelay: "150ms" }}>
            <div style={{
              background: "#0D0C0F",
              border: "1px solid rgba(201,168,76,0.15)",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              transition: "transform 200ms ease, border-color 200ms",
              cursor: "pointer",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.15)"; }}
            >
              <div style={{ width: 40, height: 1, background: "#C9A84C", marginBottom: 28 }} />
              <div className="label-style" style={{ color: "#C9A84C", marginBottom: 16 }}>For Landlords</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "#E8E2D8", margin: "0 0 20px", lineHeight: 1.1 }}>
                Make Your Property Work
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 300, color: "#8C8880", lineHeight: 1.75, marginBottom: 36, flex: 1 }}>
                Two options. Both hands-off. Both guaranteed. Let us take your property on a company let with guaranteed monthly rent, or let us manage it fully on your behalf.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {["Fixed income every month", "We manage everything", "Corporate guests only"].map(b => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={14} color="#C9A84C" />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880" }}>{b}</span>
                  </div>
                ))}
              </div>

              <button onClick={onLandlord} className="btn-gold" style={{ alignSelf: "flex-start" }}>
                I Have a Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
