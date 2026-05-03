import { useEffect, useState } from "react";

interface HeroProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function Hero({ onBookStay, onLandlord }: HeroProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[100dvh] bg-[#080709] flex flex-col items-center justify-center overflow-hidden grain-overlay">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)"
      }} />

      <div className="absolute inset-8 z-0 pointer-events-none border border-transparent">
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#C9A84C]" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#C9A84C]" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#C9A84C]" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#C9A84C]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <div 
          className={`label-style text-gold mb-8 transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '100ms' }}
          data-testid="hero-eyebrow"
        >
          ATERA STAYS
        </div>

        <img 
          src="/atera-logo.svg" 
          height="80" 
          alt="Atera Logo" 
          className={`mb-8 transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms', height: 80 }}
        />

        <h1 
          className={`font-display text-5xl md:text-[64px] leading-[1.1] mb-8 text-off-white transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <span className="font-light">Premium Stays,</span><br/>
          <span className="italic font-light">Proven Management.</span>
        </h1>

        <p 
          className={`font-body font-light text-[#8C8880] text-lg max-w-[480px] mb-12 transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '400ms' }}
        >
          Guaranteed rent for landlords. Exceptional corporate and contractor accommodation across England.
        </p>

        <div 
          className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <button 
            className="btn-gold justify-center py-4 px-8 text-[15px]" 
            onClick={onBookStay}
            data-testid="btn-book-stay"
          >
            Book a Stay
          </button>
          <button 
            className="btn-outline justify-center py-4 px-8 text-[15px]" 
            onClick={onLandlord}
            data-testid="btn-landlord"
          >
            I Have a Property
          </button>
        </div>
      </div>

      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '800ms' }}
      >
        <div className="w-[1px] h-10 bg-gold mx-auto animate-pulse opacity-60" />
      </div>
    </section>
  );
}
