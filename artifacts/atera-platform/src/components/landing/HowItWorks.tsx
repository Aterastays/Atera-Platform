const GUEST_STEPS = [
  { n: "01", title: "Browse", body: "Explore our available properties" },
  { n: "02", title: "Enquire", body: "Submit a quick booking request" },
  { n: "03", title: "Confirm", body: "We reply within hours with pricing" },
  { n: "04", title: "Arrive", body: "Step into a professionally managed home" },
];

const LANDLORD_STEPS = [
  { n: "01", title: "Enquire", body: "Tell us about your property" },
  { n: "02", title: "Consult", body: "Quick call to discuss your options" },
  { n: "03", title: "Offer", body: "We present a tailored proposal" },
  { n: "04", title: "Launch", body: "Agreement signed. Income starts." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: "#0D0C0F", padding: "128px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, color: "#E8E2D8", margin: "0 0 16px", lineHeight: 1.05 }}>
            Simple from start to stay.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Guests */}
          <div>
            <div className="reveal" style={{ marginBottom: 40 }}>
              <div className="label-style" style={{ color: "#C9A84C" }}>For Guests</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {GUEST_STEPS.map(({ n, title, body }, i) => (
                <div key={n} className="reveal" style={{ transitionDelay: `${i * 120}ms`, display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 300, color: "rgba(201,168,76,0.12)", lineHeight: 1, minWidth: 56 }}>
                    {n}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500, color: "#E8E2D8", marginBottom: 6 }}>{title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880", lineHeight: 1.65 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Landlords */}
          <div>
            <div className="reveal" style={{ marginBottom: 40 }}>
              <div className="label-style" style={{ color: "#C9A84C" }}>For Landlords</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {LANDLORD_STEPS.map(({ n, title, body }, i) => (
                <div key={n} className="reveal" style={{ transitionDelay: `${i * 120}ms`, display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 300, color: "rgba(201,168,76,0.12)", lineHeight: 1, minWidth: 56 }}>
                    {n}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500, color: "#E8E2D8", marginBottom: 6 }}>{title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880", lineHeight: 1.65 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
