import { useEffect, useRef } from "react";

interface HeroProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function Hero({ onBookStay, onLandlord }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll("[data-hero]") ?? [];
    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 80}ms`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          (el as HTMLElement).classList.add("hero-in");
        });
      });
    });
  }, []);

  return (
    <section className="relative h-screen min-h-[680px] bg-black overflow-hidden flex flex-col items-center justify-center">
      <img
        src="/hero-apartment.png"
        alt="Luxury serviced apartment"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black/45 pointer-events-none" />

      <div ref={containerRef} className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-4xl">
        <p
          data-hero
          className="hero-item text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a1a1a6] mb-5"
        >
          Atera Stays
        </p>
        <h1
          data-hero
          className="hero-item text-[56px] md:text-[76px] font-bold tracking-[-0.03em] leading-[1.0] text-white"
        >
          Premium Stays.
        </h1>
        <h1
          data-hero
          className="hero-item text-[56px] md:text-[76px] font-bold tracking-[-0.03em] leading-[1.0] text-white mb-7"
        >
          Proven Management.
        </h1>
        <p
          data-hero
          className="hero-item text-[16px] text-[#c7c7cc] max-w-md mx-auto font-normal leading-[1.7] mb-10"
        >
          Guaranteed rent for landlords.
          <br />
          Premium serviced accommodation for corporate guests.
        </p>
        <div data-hero className="hero-item flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onLandlord}
            className="bg-white text-black px-7 py-[12px] rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 min-w-[188px]"
            data-testid="btn-landlord"
          >
            Get a Free Valuation
          </button>
          <button
            onClick={onBookStay}
            className="bg-white/10 backdrop-blur-sm text-white border border-white/25 px-7 py-[12px] rounded-[980px] font-semibold text-[15px] hover:bg-white/20 transition-colors duration-200 min-w-[188px]"
            data-testid="btn-book-stay"
          >
            Book a Stay
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
