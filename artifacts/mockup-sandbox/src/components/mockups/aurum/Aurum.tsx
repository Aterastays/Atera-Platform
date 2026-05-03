import React, { useEffect, useState } from 'react';
import './_group.css';

export function Aurum() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-fade');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('in'); 
          io.unobserve(e.target); 
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#8a8070] font-sans antialiased selection:bg-[#C9A84C]/30 selection:text-[#f5f0e8]">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080808]/90 backdrop-blur-md border-b border-[#2a2416]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/__mockup/images/atera-logo.png" alt="Atera" style={{height:36, width:'auto'}} />
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] font-semibold">Atera Stays</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#landlords" className="text-sm tracking-wide text-[#8a8070] hover:text-[#C9A84C] transition-colors duration-300">Landlords</a>
            <a href="#guests" className="text-sm tracking-wide text-[#8a8070] hover:text-[#C9A84C] transition-colors duration-300">Guests</a>
            <a href="#about" className="text-sm tracking-wide text-[#8a8070] hover:text-[#C9A84C] transition-colors duration-300">About</a>
          </div>

          <button className="px-6 py-2.5 rounded-full border border-[#C9A84C] text-[#C9A84C] text-sm tracking-wide hover:bg-[#C9A84C]/10 transition-colors duration-300">
            Enquire Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/hero-apartment.png" 
            alt="Luxury apartment" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-transparent to-[#080808]/75" />
          <div className="absolute inset-0 bg-[#080808]/30 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="w-16 h-px bg-[#C9A84C] mb-8 hero-in h-d0" />
          
          <h1 className="text-6xl md:text-[96px] leading-[1.0] text-[#f5f0e8] mb-8 hero-in h-d1" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 600, fontStyle: 'italic' }}>
            Premium Stays.<br/>
            <span className="text-[#C9A84C]">Proven Management.</span>
          </h1>
          
          <p className="text-lg md:text-[18px] text-[#a89880] font-light max-w-2xl mb-12 hero-in h-d2 leading-[1.8]">
            Guaranteed rent for landlords. Premium serviced accommodation for corporate guests.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 hero-in h-d3">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C9A84C] text-[#080808] font-medium tracking-wide hover:bg-[#d4b55c] transition-colors">
              Get a Free Valuation
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#C9A84C]/40 text-[#f5f0e8] font-medium tracking-wide hover:bg-[#C9A84C]/10 transition-colors">
              Book a Stay
            </button>
          </div>
        </div>
      </header>

      {/* Trust bar */}
      <section className="bg-[#111008] border-y border-[#2a2416] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#2a2416]">
            
            <div className="flex flex-col items-center text-center p-4 reveal r-d1">
              <span className="text-[56px] text-[#C9A84C] leading-none mb-3" style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>100%</span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#8a8070]">Guaranteed Rent</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 reveal r-d2">
              <span className="text-[56px] text-[#C9A84C] leading-none mb-3" style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>3–5yr</span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#8a8070]">Agreements</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 reveal r-d3">
              <span className="text-[56px] text-[#C9A84C] leading-none mb-3" style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>£0</span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#8a8070]">Void Risk</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 reveal r-d4">
              <span className="text-[56px] text-[#C9A84C] leading-none mb-3" style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>24/7</span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#8a8070]">Guest Support</span>
            </div>

          </div>
        </div>
      </section>

      {/* Landlord Feature */}
      <section id="landlords" className="py-24 md:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-[45%] reveal">
              <div className="w-10 h-px bg-[#C9A84C] mb-8" />
              <span className="block text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">For Landlords</span>
              <h2 className="text-4xl md:text-[58px] leading-tight text-[#f5f0e8] mb-6" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 600, fontStyle: 'italic' }}>
                Total Peace of Mind.
              </h2>
              <p className="text-[16px] leading-[1.8] text-[#8a8070] font-light mb-8">
                We lease your property on a long-term commercial agreement, guaranteeing your rent every single month. We handle all minor maintenance, professional cleaning, and ensure your asset is kept in show-home condition. No voids, no hidden fees, just passive income.
              </p>
              <button className="flex items-center gap-2 text-[#C9A84C] text-sm tracking-wide hover:opacity-80 transition-opacity">
                Discover Landlord Benefits <span className="text-lg">→</span>
              </button>
            </div>
            <div className="w-full md:w-[55%] reveal-fade r-d2">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden" style={{ boxShadow: 'inset 0 0 60px rgba(8,8,8,0.6)' }}>
                <img src="/__mockup/images/landlord-exterior.png" alt="Premium UK exterior" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(8,8,8,0.6)] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[#2a2416]" />

      {/* Guest Feature */}
      <section id="guests" className="py-24 md:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col-reverse md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-[55%] reveal-fade">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <img src="/__mockup/images/guest-office.png" alt="Serviced apartment office" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(8,8,8,0.6)] pointer-events-none" />
              </div>
            </div>
            <div className="w-full md:w-[45%] reveal r-d2">
              <div className="w-10 h-px bg-[#C9A84C] mb-8" />
              <span className="block text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">For Guests</span>
              <h2 className="text-4xl md:text-[58px] leading-tight text-[#f5f0e8] mb-6" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 600, fontStyle: 'italic' }}>
                Space to Thrive.
              </h2>
              <p className="text-[16px] leading-[1.8] text-[#8a8070] font-light mb-8">
                Designed for corporate professionals and discerning travelers. Our serviced apartments offer the space, privacy, and amenities of a premium home, combined with the uncompromising standards of luxury hospitality. High-speed Wi-Fi, dedicated workspaces, and fully equipped kitchens.
              </p>
              <button className="flex items-center gap-2 text-[#C9A84C] text-sm tracking-wide hover:opacity-80 transition-opacity">
                View Available Properties <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32 bg-[#111008] border-t border-[#2a2416]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <span className="block text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">The Process</span>
            <h2 className="text-4xl md:text-[58px] text-[#f5f0e8]" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 600, fontStyle: 'italic' }}>
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            <div className="relative pl-8 border-l border-[#2a2416] reveal r-d1 pt-12">
              <span className="absolute -top-6 -left-[2px] text-[80px] leading-none text-[#C9A84C]/20 select-none" style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>1</span>
              <h3 className="text-[22px] font-semibold text-[#f5f0e8] mb-4">Consultation</h3>
              <p className="text-[15px] leading-[1.8] text-[#8a8070] font-light">
                We view your property and provide a free, no-obligation valuation for a guaranteed rent agreement tailored to your requirements.
              </p>
            </div>

            <div className="relative pl-8 border-l border-[#2a2416] reveal r-d2 pt-12">
              <span className="absolute -top-6 -left-[2px] text-[80px] leading-none text-[#C9A84C]/20 select-none" style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>2</span>
              <h3 className="text-[22px] font-semibold text-[#f5f0e8] mb-4">Agreement</h3>
              <p className="text-[15px] leading-[1.8] text-[#8a8070] font-light">
                We sign a 3-5 year commercial lease. We handle any necessary cosmetic upgrades and furnish the property to our exacting standards.
              </p>
            </div>

            <div className="relative pl-8 border-l border-[#2a2416] reveal r-d3 pt-12">
              <span className="absolute -top-6 -left-[2px] text-[80px] leading-none text-[#C9A84C]/20 select-none" style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>3</span>
              <h3 className="text-[22px] font-semibold text-[#f5f0e8] mb-4">Passive Income</h3>
              <p className="text-[15px] leading-[1.8] text-[#8a8070] font-light">
                Sit back and relax. You receive fixed monthly payments on time, every time, while we take care of all management and maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-24 bg-[#C9A84C] text-[#080808]">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
          <h2 className="text-4xl md:text-[52px] leading-tight mb-10" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 600, fontStyle: 'italic' }}>
            Ready to unlock your property's potential?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#080808] text-[#C9A84C] font-medium tracking-wide hover:bg-[#1a1712] transition-colors">
              Get a Free Valuation
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#080808]/30 text-[#080808] font-medium tracking-wide hover:bg-[#080808]/5 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080808] border-t border-[#2a2416] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/__mockup/images/atera-logo.png" alt="Atera" style={{height:30, width:'auto'}} />
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] font-semibold">Atera Stays</span>
          </div>
          <div className="text-[13px] text-[#8a8070]">
            © 2026 Atera Industries Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
