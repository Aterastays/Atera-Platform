import React, { useEffect } from 'react';
import './_group.css';

const Logo = () => (
  <img src="/__mockup/images/atera-logo.png" alt="Atera Stays" style={{height:36,width:'auto'}} />
);

export function Obsidian() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-fade');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#8e8e93] font-['Plus_Jakarta_Sans'] selection:bg-[#1c1c1e] selection:text-white overflow-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000] border-b border-[#1c1c1e]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <Logo />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white">Atera Stays</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#landlords" className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#636366] hover:text-white transition-colors">Landlords</a>
            <a href="#guests" className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#636366] hover:text-white transition-colors">Guests</a>
            <a href="#how" className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#636366] hover:text-white transition-colors">Process</a>
            <button className="h-10 px-6 rounded-full border border-white/20 text-white text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-white/5 transition-colors">
              Valuation
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src="/__mockup/images/hero-apartment.png" alt="Luxury apartment view" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center -mt-12">
          <h1 className="text-[52px] md:text-[92px] font-bold text-white tracking-[-0.04em] leading-[0.98] mb-12 flex flex-col items-center hero-in h-d1">
            <span>Premium Stays.</span>
            <span>Proven Management.</span>
          </h1>
          
          <div className="w-[60px] h-[1px] bg-[#3a3a3c] mx-auto mb-10 hero-in h-d2"></div>
          
          <p className="text-[17px] text-[#8e8e93] leading-[1.7] max-w-2xl mx-auto mb-12 hero-in h-d3">
            Guaranteed rent for landlords. Premium serviced accommodation for corporate guests.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 hero-in h-d4">
            <button className="h-14 px-8 rounded-full bg-white text-black text-[13px] font-semibold tracking-[0.1em] uppercase hover:bg-white/90 transition-colors">
              Get a Free Valuation
            </button>
            <button className="h-14 px-8 flex items-center gap-2 text-white text-[13px] font-semibold tracking-[0.1em] uppercase hover:opacity-70 transition-opacity">
              Book a Stay <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-[#1c1c1e] bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {[
            { stat: "100%", label: "Guaranteed Rent" },
            { stat: "3–5yr", label: "Agreements" },
            { stat: "£0", label: "Void Risk" },
            { stat: "24/7", label: "Guest Support" }
          ].map((item, i) => (
            <div key={i} className={`text-center reveal-fade r-d${i+1} ${i !== 3 ? 'md:border-r border-[#3a3a3c]' : ''}`}>
              <div className="text-[40px] font-bold text-white tracking-tight mb-2">{item.stat}</div>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#636366]">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-[1px] w-full bg-[#1c1c1e]"></div>

      {/* Landlord Service */}
      <section id="landlords" className="py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="w-full md:w-[40%] reveal r-d1">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#636366] mb-6">For Landlords</div>
            <h2 className="text-[40px] md:text-[52px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-8">
              Hands-off, high-yield property management.
            </h2>
            <p className="text-[17px] text-[#8e8e93] leading-[1.7] mb-10">
              We take over your property on a 3-5 year corporate lease, guaranteeing your rent every single month. No voids, no maintenance headaches, no tenant management.
            </p>
            <ul className="space-y-4 mb-10">
              {['Guaranteed monthly income, regardless of occupancy', 'Cosmetic upgrades and premium furnishing at our cost', 'Professional cleaning and routine maintenance included'].map((point, i) => (
                <li key={i} className="flex items-start gap-4 text-[15px] text-[#8e8e93]">
                  <span className="text-[#3a3a3c] mt-1">―</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <button className="text-white text-[13px] font-semibold tracking-[0.1em] uppercase hover:opacity-70 transition-opacity flex items-center gap-2">
              Value My Property <span>→</span>
            </button>
          </div>
          <div className="w-full md:w-[60%] h-[500px] md:h-[700px] relative reveal-fade r-d3 border-l border-[#3a3a3c]">
            <img src="/__mockup/images/landlord-exterior.png" alt="Premium property exterior" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <div className="h-[1px] w-full bg-[#1c1c1e]"></div>

      {/* Guest Service */}
      <section id="guests" className="py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="w-full md:w-[40%] reveal r-d1">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#636366] mb-6">For Guests</div>
            <h2 className="text-[40px] md:text-[52px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-8">
              The comfort of home, the standards of a hotel.
            </h2>
            <p className="text-[17px] text-[#8e8e93] leading-[1.7] mb-10">
              Premium serviced apartments designed for corporate professionals and discerning travelers. Fully equipped, impeccably maintained, and ready for living.
            </p>
            <ul className="space-y-4 mb-10">
              {['Dedicated workspaces and high-speed Wi-Fi', 'Fully equipped kitchens and premium amenities', '24/7 guest support and professional weekly cleaning'].map((point, i) => (
                <li key={i} className="flex items-start gap-4 text-[15px] text-[#8e8e93]">
                  <span className="text-[#3a3a3c] mt-1">―</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <button className="text-white text-[13px] font-semibold tracking-[0.1em] uppercase hover:opacity-70 transition-opacity flex items-center gap-2">
              View Properties <span>→</span>
            </button>
          </div>
          <div className="w-full md:w-[60%] h-[500px] md:h-[700px] relative reveal-fade r-d3 border-l border-[#3a3a3c]">
            <img src="/__mockup/images/guest-office.png" alt="Premium home office" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <div className="h-[1px] w-full bg-[#1c1c1e]"></div>

      {/* How it works */}
      <section id="how" className="py-24 md:py-32 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal r-d1">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#636366] mb-6">The Process</div>
            <h2 className="text-[40px] md:text-[52px] font-bold text-white tracking-[-0.03em] leading-[1.1]">
              Simple. Transparent. Secure.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {[
              {
                title: "Property Assessment",
                desc: "We evaluate your property to ensure it meets our corporate standards, and provide a guaranteed rent offer within 48 hours."
              },
              {
                title: "Agreement & Upgrade",
                desc: "Sign a 3-5 year management agreement. We handle any necessary cosmetic upgrades and furnish the property at no cost to you."
              },
              {
                title: "Guaranteed Income",
                desc: "Your rent is paid on the same day every month, regardless of occupancy. Sit back and enjoy truly passive income."
              }
            ].map((step, i) => (
              <div key={i} className={`relative reveal r-d${i+1}`}>
                <div className="absolute -top-16 -left-4 text-[120px] font-bold text-[#111111] leading-none select-none z-0">
                  0{i + 1}
                </div>
                <div className="relative z-10 pt-8 border-t border-[#3a3a3c]">
                  <h3 className="text-[20px] font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-[15px] text-[#8e8e93] leading-[1.7]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] border-y border-[#1c1c1e]">
        <div className="max-w-4xl mx-auto px-6 text-center reveal r-d1">
          <h2 className="text-[40px] md:text-[52px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-8">
            Ready to secure your rental income?
          </h2>
          <p className="text-[17px] text-[#8e8e93] leading-[1.7] mb-12">
            Get a free, no-obligation valuation of your property and see how much guaranteed rent you could earn.
          </p>
          <button className="h-14 px-10 rounded-full bg-white text-black text-[13px] font-semibold tracking-[0.1em] uppercase hover:bg-white/90 transition-colors">
            Get a Free Valuation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white">Atera Stays</span>
          </div>
          <div className="text-[13px] text-[#636366]">
            Copyright © 2026 Atera Industries Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
