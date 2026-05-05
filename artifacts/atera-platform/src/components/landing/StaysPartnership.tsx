import { Check } from "lucide-react";

interface Props {
  onLandlord: () => void;
}

const BENEFITS = [
  { title: "Fixed income you can plan around", body: "Rent paid on the same date every month, occupied or not." },
  { title: "Zero management responsibilities", body: "We handle guests, cleaning, maintenance — everything." },
  { title: "Professional guests only", body: "Corporate and contractors exclusively. No party bookings." },
  { title: "3 to 5 year agreements", body: "With a break clause for your peace of mind." },
];

export function StaysPartnership({ onLandlord }: Props) {
  return (
    <div id="stays-partnership">
      {/* A — Dark — headline */}
      <section style={{ background: "#080709", padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div className="reveal" style={{ maxWidth: 720 }}>
            <div className="label-style" style={{ color: "#C9A84C", marginBottom: 24 }}>STAYS PARTNERSHIP</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 400, color: "#E8E2D8", lineHeight: 1.05, margin: "0 0 32px" }}>
              Guaranteed rent. Every month.<br />Occupied or not.
            </h2>
            <p className="reveal" style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 300, color: "#8C8880", lineHeight: 1.75, maxWidth: 600, margin: "0 0 40px", transitionDelay: "200ms" }}>
              We become your company tenant. We pay you a fixed rent on the same date every month, regardless of whether the property is occupied. No voids. No chasing. No uncertainty.
            </p>
            <div className="reveal" style={{ transitionDelay: "350ms" }}>
              <button onClick={onLandlord} className="btn-gold" style={{ fontSize: 15, padding: "14px 32px" }}>
                Get a Free Valuation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* B — Cream — benefits */}
      <section style={{ background: "#F5F0E6", padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ maxWidth: 580 }}>
            <div className="reveal" style={{ marginBottom: 52 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 400, color: "#111111", lineHeight: 1.05, margin: 0 }}>
                What does that mean for you?
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {BENEFITS.map(({ title, body }, i) => (
                <div key={title} className="reveal" style={{ transitionDelay: `${i * 120}ms`, display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, minWidth: 20, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <div style={{ width: 16, height: 1.5, background: "#C9A84C" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500, color: "#111111", marginBottom: 6 }}>{title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#5C5854", lineHeight: 1.65 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* C — Dark — permissions */}
      <section style={{ background: "#080709", padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div className="reveal text-center" style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#E8E2D8", lineHeight: 1.08, margin: "0 0 28px" }}>
              The permissions. Done properly.
            </h2>
            <p className="reveal" style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 300, color: "#8C8880", lineHeight: 1.75, transitionDelay: "200ms" }}>
              Every property goes through a full permissions check before we proceed. Freeholder, mortgage lender, insurer — all confirmed in writing. We never cut corners and we never proceed without full compliance.
            </p>
          </div>
        </div>
      </section>

      {/* D — Cream — testimonial */}
      <section style={{ background: "#F5F0E6", padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div className="reveal" style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#111111", margin: 0 }}>
              What our landlords say
            </h2>
          </div>
          <div className="reveal" style={{ transitionDelay: "150ms" }}>
            <div style={{ position: "relative", paddingLeft: 32, borderLeft: "2px solid #C9A84C" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 300, fontStyle: "italic", color: "#333333", lineHeight: 1.65, margin: "0 0 20px" }}>
                "The rent arrives on exactly the same date every month. I have not had to deal with a single issue since signing."
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "#8C8880", letterSpacing: "0.1em" }}>
                — DAVID M., LANDLORD, MANCHESTER
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
