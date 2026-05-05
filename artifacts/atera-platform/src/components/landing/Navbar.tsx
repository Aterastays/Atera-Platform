import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function Navbar({ onBookStay, onLandlord }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navBg = scrolled
    ? "rgba(8,7,9,0.92)"
    : "rgba(8,7,9,0.6)";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 56,
        background: navBg,
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "1px solid transparent",
        transition: "background 300ms, border-color 300ms",
      }}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", padding: "0 32px", position: "relative" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src="/atera-logo.png" alt="Atera Stays" style={{ height: 32, width: "auto" }} />
            <span style={{ color: "#E8E2D8", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, letterSpacing: "0.02em", display: "none" }} className="sm:block">
              Atera Stays
            </span>
          </div>

          {/* Centre nav */}
          <div className="hidden md:flex" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", gap: 36 }}>
            {[
              { label: "Landlords", id: "stays-partnership" },
              { label: "Guests", id: "properties" },
              { label: "How it works", id: "how-it-works" },
            ].map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 400, color: "#8C8880",
                background: "none", border: "none", cursor: "pointer",
                transition: "color 200ms",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
              >{label}</button>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex" style={{ marginLeft: "auto", alignItems: "center", gap: 16 }}>
            <button onClick={onLandlord} style={{
              fontFamily: "var(--font-body)", fontSize: 13, color: "#8C8880", background: "none", border: "none", cursor: "pointer", transition: "color 200ms",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
            >I have a property</button>
            <button onClick={onBookStay} className="btn-gold" style={{ padding: "9px 20px", fontSize: 13 }}>
              Book a Stay
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#E8E2D8", cursor: "pointer" }}>
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(8,7,9,0.97)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          padding: "24px 32px 48px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 52 }}>
            <img src="/atera-logo.png" alt="Atera Stays" style={{ height: 36, width: "auto" }} />
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#E8E2D8", cursor: "pointer" }}>
              <X size={22} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
            {[
              { label: "Landlords", id: "stays-partnership" },
              { label: "Guests", id: "properties" },
              { label: "How it works", id: "how-it-works" },
            ].map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                textAlign: "left", fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 300, color: "#E8E2D8",
                background: "none", border: "none", cursor: "pointer",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "auto" }}>
            <button onClick={() => { setMobileOpen(false); onLandlord(); }} className="btn-outline" style={{ width: "100%", justifyContent: "center", padding: "14px 0" }}>
              I have a property
            </button>
            <button onClick={() => { setMobileOpen(false); onBookStay(); }} className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "14px 0" }}>
              Book a Stay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
