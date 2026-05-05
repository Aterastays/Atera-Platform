import { useEffect, useState } from "react";

interface HeroProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function Hero({ onBookStay, onLandlord }: HeroProps) {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 100);
    return () => clearTimeout(t);
  }, []);

  const anim = (delay: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <section
      style={{ minHeight: "100vh", background: "#080709", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
    >
      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.04,
      }} />

      {/* Gold glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)",
      }} />

      {/* Corner brackets */}
      <div style={{ position: "absolute", top: 32, left: 32, zIndex: 1, width: 28, height: 28, borderTop: "1.5px solid #C9A84C", borderLeft: "1.5px solid #C9A84C" }} />
      <div style={{ position: "absolute", top: 32, right: 32, zIndex: 1, width: 28, height: 28, borderTop: "1.5px solid #C9A84C", borderRight: "1.5px solid #C9A84C" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: 720 }}>

        <div style={anim(0)}>
          <img src="/atera-logo.png" alt="Atera Stays" style={{ height: 72, width: "auto", marginBottom: 36 }} />
        </div>

        <div style={anim(140)}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 8vw, 92px)", fontWeight: 400, letterSpacing: "0.28em", color: "#C9A84C", lineHeight: 1, margin: "0 0 24px" }}>
            ATERA STAYS
          </h1>
        </div>

        <div style={anim(260)}>
          <div style={{ width: 60, height: 1, background: "#C9A84C", margin: "0 auto 28px" }} />
        </div>

        <div style={anim(380)}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 52px)", fontWeight: 300, color: "#E8E2D8", lineHeight: 1.08, margin: "0 0 24px" }}>
            Premium Stays,{" "}
            <em>Proven Management.</em>
          </p>
        </div>

        <div style={anim(500)}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 300, color: "#8C8880", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 44px" }}>
            Professionally managed short stays for guests. Guaranteed rent and full property management for landlords across England.
          </p>
        </div>

        <div style={{ ...anim(620), display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onBookStay} className="btn-gold" style={{ height: 56, padding: "0 36px", fontSize: 15 }}>
            Book a Stay
          </button>
          <button onClick={onLandlord} className="btn-outline" style={{ height: 56, padding: "0 36px", fontSize: 15 }}>
            I Have a Property
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 2,
        opacity: vis ? 0.55 : 0, transition: "opacity 1s ease 1400ms",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, #C9A84C, transparent)", animation: "scrollPulse 2.2s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.35; transform: scaleY(1) translateY(0); }
          50% { opacity: 1; transform: scaleY(1.12) translateY(2px); }
        }
      `}</style>
    </section>
  );
}
