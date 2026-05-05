interface CTAStripProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function CTAStrip({ onBookStay, onLandlord }: CTAStripProps) {
  return (
    <section style={{ background: "#C9A84C", padding: "120px 0", minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
        <h2 className="reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 400, color: "#080709", lineHeight: 1.05, margin: "0 0 48px" }}>
          Ready to begin?
        </h2>
        <div className="reveal" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", transitionDelay: "150ms" }}>
          <button onClick={onLandlord} style={{
            background: "#080709", color: "#E8E2D8",
            border: "none", padding: "16px 40px",
            fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500,
            cursor: "pointer",
            transition: "transform 150ms, background 150ms",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = "#0D0C0F"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.background = "#080709"; }}
          >
            I Have a Property
          </button>
          <button onClick={onBookStay} style={{
            background: "transparent", color: "#080709",
            border: "2px solid #080709", padding: "16px 40px",
            fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500,
            cursor: "pointer",
            transition: "transform 150ms, background 150ms",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(8,7,9,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Book a Stay
          </button>
        </div>
      </div>
    </section>
  );
}
