import { Users, PoundSterling, Search, Shield, FileText, Home } from "lucide-react";

interface Props {
  onLandlord: () => void;
}

const SERVICES = [
  { Icon: Users, title: "Tenant Management", desc: "Find, reference, onboard" },
  { Icon: PoundSterling, title: "Rent Collection", desc: "Collected and remitted monthly" },
  { Icon: Search, title: "Quarterly Inspections", desc: "Photo reports every 3 months" },
  { Icon: Shield, title: "Compliance", desc: "Gas, EICR, alarms tracked" },
  { Icon: FileText, title: "Monthly Reports", desc: "Statements direct to you" },
  { Icon: Home, title: "Deposit Handling", desc: "Government-approved scheme" },
];

export function PropertyManagement({ onLandlord }: Props) {
  return (
    <div id="property-management">
      {/* A — Dark — headline */}
      <section style={{ background: "#0D0C0F", padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div className="reveal" style={{ maxWidth: 680 }}>
            <div className="label-style" style={{ color: "#C9A84C", marginBottom: 24 }}>PROPERTY MANAGEMENT</div>
            <h2
              className="reveal"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5.5vw, 64px)",
                fontWeight: 400,
                color: "#E8E2D8",
                lineHeight: 1.05,
                margin: "0 0 32px",
                letterSpacing: "-0.01em",
                transitionDelay: "100ms",
              }}
            >
              Your property. Fully managed.<br />Nothing for you to do.
            </h2>
            <p className="reveal" style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 300, color: "#8C8880", lineHeight: 1.75, transitionDelay: "200ms" }}>
              Already renting your property? We manage everything end to end. Tenants, rent collection, maintenance, compliance, inspections. One monthly statement. That is all you see.
            </p>
          </div>
        </div>
      </section>

      {/* B — Cream — service grid */}
      <section style={{ background: "#F5F0E6", padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ Icon, title, desc }, i) => (
              <div key={title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div
                  style={{
                    padding: "32px 28px",
                    borderTop: "2px solid #C9A84C",
                    background: "rgba(255,255,255,0.6)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transition: "transform 200ms",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = "")}
                >
                  <Icon size={24} color="#C9A84C" />
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500, color: "#111111" }}>{title}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#5C5854" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C — Dark — testimonial + CTA */}
      <section style={{ background: "#0D0C0F", padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div className="reveal" style={{ marginBottom: 52 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 400,
                color: "#E8E2D8",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              What our landlords say
            </h2>
          </div>
          <div className="reveal" style={{ transitionDelay: "150ms", marginBottom: 64 }}>
            <div style={{ position: "relative", paddingLeft: 32, borderLeft: "2px solid #C9A84C" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 300, fontStyle: "italic", color: "#8C8880", lineHeight: 1.65, margin: "0 0 20px" }}>
                "They explained everything clearly. I have complete peace of mind that my property is being managed properly."
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "#5C5854", letterSpacing: "0.1em" }}>
                — PATRICIA L., LANDLORD, LEEDS
              </p>
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: "250ms" }}>
            <button onClick={onLandlord} className="btn-gold" style={{ fontSize: 15, padding: "14px 32px" }}>
              Enquire About Management
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
