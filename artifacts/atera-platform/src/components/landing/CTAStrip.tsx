interface CTAStripProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function CTAStrip({ onBookStay, onLandlord }: CTAStripProps) {
  return (
    <section className="bg-black text-white py-32 border-t border-[#1d1d1f]">
      <div className="max-w-[720px] mx-auto px-6 text-center">
        <h2
          className="reveal mb-10"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: "#ffffff",
          }}
        >
          Ready to upgrade your property experience?
        </h2>
        <div
          className="reveal flex flex-col sm:flex-row items-center justify-center gap-3"
          style={{ transitionDelay: "0.15s" }}
        >
          <button
            onClick={onLandlord}
            className="bg-white text-black px-8 py-3.5 rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 min-w-[190px]"
          >
            Get a Free Valuation
          </button>
          <button
            onClick={onBookStay}
            className="bg-[#1d1d1f] text-white px-8 py-3.5 rounded-[980px] font-semibold text-[15px] hover:bg-[#2c2c2e] transition-colors duration-200 min-w-[190px]"
          >
            Book a Stay
          </button>
        </div>
      </div>
    </section>
  );
}
