interface ServicesProps {
  onLandlord: () => void;
  onBookStay: () => void;
}

export function ServicesSection({ onLandlord, onBookStay }: ServicesProps) {
  return (
    <>
      {/* ── Landlord ─── */}
      <section id="landlords" className="bg-[#f5f5f7] text-black py-32 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          <div className="reveal w-full md:w-[42%] flex flex-col items-start">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#6e6e73] uppercase mb-5 px-3 py-1 border border-[#c7c7cc] rounded-[980px]">
              For Landlords
            </span>
            <h2 className="text-[44px] font-bold tracking-[-0.03em] leading-[1.08] mb-6">
              Total peace of mind.<br />Zero void periods.
            </h2>
            <p className="text-[17px] text-[#6e6e73] leading-[1.65] mb-8">
              We become your company tenant, guaranteeing your rent for 3 to 5 years. No management fees, no void periods — your property maintained to show-home standard.
            </p>
            <button
              onClick={onLandlord}
              className="text-[17px] text-[#0066cc] font-semibold flex items-center gap-1 group hover:gap-2 transition-all duration-200"
              data-testid="btn-service-stays"
            >
              Get a free valuation
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
            </button>
          </div>
          <div className="reveal w-full md:w-[58%]" style={{ transitionDelay: "0.2s" }}>
            <img
              src="/landlord-exterior.png"
              alt="Premium UK property"
              className="w-full rounded-[20px]"
            />
          </div>
        </div>
      </section>

      {/* ── Guests ─── */}
      <section id="guests" className="bg-black text-white py-32 overflow-hidden border-t border-[#1d1d1f]">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-20">
          <div className="reveal w-full md:w-[42%] flex flex-col items-start">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#6e6e73] uppercase mb-5 px-3 py-1 border border-[#3a3a3c] rounded-[980px]">
              For Corporate Guests
            </span>
            <h2 className="text-[44px] font-bold tracking-[-0.03em] leading-[1.08] mb-6">
              A premium space to work, rest, and live.
            </h2>
            <p className="text-[17px] text-[#a1a1a6] leading-[1.65] mb-8">
              Spacious, fully equipped serviced apartments designed for professionals. Fast Wi-Fi, dedicated workspaces, and 24/7 support — everything you need for a perfect stay.
            </p>
            <button
              onClick={onBookStay}
              className="text-[17px] text-[#2997ff] font-semibold flex items-center gap-1 group hover:gap-2 transition-all duration-200"
              data-testid="btn-service-management"
            >
              Explore our locations
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
            </button>
          </div>
          <div className="reveal w-full md:w-[58%]" style={{ transitionDelay: "0.2s" }}>
            <img
              src="/guest-office.png"
              alt="Premium home office in serviced apartment"
              className="w-full rounded-[20px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
