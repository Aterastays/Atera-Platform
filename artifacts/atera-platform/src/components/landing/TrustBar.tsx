import { useEffect, useRef, useState } from "react";

interface Stat {
  prefix?: string;
  num?: number;
  display: string;
  label: string;
}

const STATS: Stat[] = [
  { num: 100, display: "100%", label: "Guaranteed Rent" },
  { display: "3–5yr", label: "Agreements" },
  { display: "£0", label: "Void Risk" },
  { display: "24/7", label: "Support" },
  { display: "1", label: "Point of Contact" },
];

function Counter({ num, display }: { num?: number; display: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (num === undefined) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * num));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [num]);

  if (num === undefined) return <span>{display}</span>;
  return (
    <span ref={ref}>
      {val}{display.replace(String(num), "")}
    </span>
  );
}

export function TrustBar() {
  return (
    <section style={{
      background: "#0D0C0F",
      borderTop: "1px solid rgba(201,168,76,0.25)",
      borderBottom: "1px solid rgba(201,168,76,0.25)",
      padding: "52px 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0">
          {STATS.map(({ num, display, label }, i) => (
            <div
              key={label}
              className="reveal flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 80}ms`, padding: "0 16px" }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 600, color: "#C9A84C", lineHeight: 1, marginBottom: 10 }}>
                <Counter num={num} display={display} />
              </div>
              <div className="label-style" style={{ color: "#8C8880" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
