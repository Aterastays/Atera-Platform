import { Link } from "wouter";

export function Footer() {
  return (
    <footer style={{ background: "#080709", borderTop: "1px solid rgba(201,168,76,0.1)", padding: "72px 0 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <img src="/atera-logo.png" alt="Atera Stays" style={{ height: 36, width: "auto" }} />
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880", lineHeight: 1.7, marginBottom: 16 }}>
              Premium short-term stays and professional property management. Guaranteed rent for landlords. Corporate accommodation across England.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#5C5854", letterSpacing: "0.05em" }}>
              ATERA INDUSTRIES LTD — Registered in England &amp; Wales.
            </p>
          </div>

          {/* Services */}
          <div>
            <div className="label-style" style={{ color: "#E8E2D8", marginBottom: 20 }}>Services</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Stays Partnership", "Corporate Stays", "Property Management"].map(item => (
                <li key={item}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880", cursor: "default" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="label-style" style={{ color: "#E8E2D8", marginBottom: 20 }}>Legal</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li>
                <Link href="/privacy" style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880", textDecoration: "none", transition: "color 200ms" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
                >Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, color: "#8C8880", textDecoration: "none", transition: "color 200ms" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E8E2D8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8C8880")}
                >Terms of Use</Link>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#5C5854" }}>
            Copyright © {new Date().getFullYear()} Atera Industries Ltd. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#5C5854" }}>
            Atera Stays is a trading name of Atera Industries Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
