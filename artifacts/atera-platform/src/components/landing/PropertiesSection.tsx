import { useEffect, useState } from "react";
import { BedDouble } from "lucide-react";

interface Property {
  id: string;
  name: string;
  postcode: string | null;
  beds: number | null;
  photos: string[] | null;
  monthly_revenue: number | null;
}

const PLACEHOLDERS: Property[] = [
  { id: "p1", name: "Premium Property", postcode: "Coming Soon", beds: null, photos: null, monthly_revenue: null },
  { id: "p2", name: "Premium Property", postcode: "Coming Soon", beds: null, photos: null, monthly_revenue: null },
  { id: "p3", name: "Premium Property", postcode: "Coming Soon", beds: null, photos: null, monthly_revenue: null },
];

function PropertyCard({ prop, delay, onEnquire }: { prop: Property; delay: number; onEnquire: () => void }) {
  const isPlaceholder = prop.id.startsWith("p");
  const photo = prop.photos?.[0];

  return (
    <div className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      <div
        style={{
          background: "#131217",
          border: "1px solid rgba(201,168,76,0.1)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 200ms ease, border-color 200ms",
          cursor: "pointer",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.3)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.1)"; }}
        onClick={!isPlaceholder ? onEnquire : undefined}
      >
        {/* Photo / placeholder */}
        <div style={{ height: 240, background: "#080709", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {photo ? (
            <img src={photo} alt={prop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(201,168,76,0.02) 10px, rgba(201,168,76,0.02) 11px)",
              }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.2em", color: "rgba(201,168,76,0.2)" }}>ATERA STAYS</span>
            </>
          )}
          {isPlaceholder && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(8,7,9,0.5)",
            }}>
              <div style={{
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.3)",
                padding: "8px 20px",
              }}>
                <span className="label-style" style={{ color: "#C9A84C" }}>COMING SOON</span>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div className="label-style" style={{ color: "#C9A84C" }}>{prop.postcode ?? "—"}</div>
            {prop.beds && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8C8880", fontSize: 13 }}>
                <BedDouble size={14} />
                <span>{prop.beds} bed</span>
              </div>
            )}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 400, color: "#E8E2D8", marginBottom: 20 }}>{prop.name}</div>
          <button
            onClick={e => { e.stopPropagation(); if (!isPlaceholder) onEnquire(); }}
            className="btn-gold"
            style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "10px 0", opacity: isPlaceholder ? 0.45 : 1, cursor: isPlaceholder ? "default" : "pointer" }}
            disabled={isPlaceholder}
          >
            {isPlaceholder ? "Coming Soon" : "Enquire Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PropertiesSection({ onBookStay }: { onBookStay: () => void }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties/live")
      .then(r => r.ok ? r.json() : [])
      .then((data: Property[]) => { setProperties(data); setLoading(false); })
      .catch(() => { setProperties([]); setLoading(false); });
  }, []);

  const display = loading ? [] : (properties.length > 0 ? properties.slice(0, 3) : PLACEHOLDERS);

  return (
    <section id="properties" style={{ background: "#080709", padding: "128px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        <div className="reveal" style={{ marginBottom: 64 }}>
          <div className="label-style" style={{ color: "#C9A84C", marginBottom: 16 }}>AVAILABLE NOW</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: "#E8E2D8", margin: 0, lineHeight: 1.05 }}>
            Our Properties
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="skeleton" style={{ height: 380 }} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {display.map((prop, i) => (
              <PropertyCard key={prop.id} prop={prop} delay={i * 100} onEnquire={onBookStay} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
