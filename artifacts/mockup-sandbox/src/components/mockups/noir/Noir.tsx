import React, { useEffect } from 'react';
import './_group.css';

export function Noir() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-fade');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#7a7572] font-inter overflow-x-hidden selection:bg-[#f0ede8] selection:text-[#0e0e0e]">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-[24px] border-b border-[#2a2726] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/__mockup/images/atera-logo.png" alt="Atera" style={{height: 36, width: 'auto'}} />
          <span className="text-[10px] tracking-[0.22em] uppercase text-[#7a7572]">Atera Stays</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[13px] text-[#5a5552]">
          <a href="#" className="hover:text-[#f0ede8] transition-colors">Landlords</a>
          <a href="#" className="hover:text-[#f0ede8] transition-colors">Corporate Guests</a>
          <a href="#" className="hover:text-[#f0ede8] transition-colors">Properties</a>
          <a href="#" className="hover:text-[#f0ede8] transition-colors">About</a>
        </div>
        <a href="#" className="text-[#f0ede8] font-medium text-sm border-b border-transparent hover:border-[#f0ede8]/30 transition-colors pb-0.5">
          Enquire
        </a>
      </nav>

      {/* Hero */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0 z-0">
          <img src="/__mockup/images/hero-apartment.png" alt="Luxury apartment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e]/85 to-[#0e0e0e]/65" />
        </div>
        
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Content pinned to bottom left */}
          <div className="absolute bottom-16 left-6 md:left-12 max-w-2xl text-left pointer-events-auto">
            <div className="h-[1px] w-10 bg-[#f0ede8]/40 mb-6 hero-in h-d0" />
            <div className="text-[10px] tracking-[0.24em] uppercase text-[#5a5552] mb-4 hero-in h-d1">
              Issue No. 01 — Premium Property
            </div>
            <h1 className="font-playfair text-5xl md:text-[90px] font-normal tracking-[-0.01em] text-[#f0ede8] leading-[1.05] mb-6 hero-in h-d2">
              Premium Stays.<br />Proven Management.
            </h1>
            <p className="text-[17px] font-light text-[#a09890] leading-[1.8] max-w-lg hero-in h-d3">
              Guaranteed rent for landlords. Premium serviced accommodation for corporate guests.
            </p>
          </div>

          {/* Buttons pinned to bottom right */}
          <div className="absolute bottom-16 right-6 md:right-12 flex flex-col md:flex-row gap-4 pointer-events-auto hero-in h-d4">
            <button className="px-6 py-3 border border-[#f0ede8]/30 rounded-full text-[#f0ede8] text-sm hover:bg-[#f0ede8] hover:text-[#0e0e0e] transition-colors backdrop-blur-sm">
              Get a Free Valuation
            </button>
            <button className="px-6 py-3 border border-[#f0ede8]/30 rounded-full text-[#f0ede8] text-sm hover:bg-[#f0ede8] hover:text-[#0e0e0e] transition-colors backdrop-blur-sm">
              Book a Stay
            </button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#161616] border-y border-[#2a2726] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-[#2a2726]">
          {[
            { value: "100%", label: "Guaranteed Rent" },
            { value: "3–5yr", label: "Agreements" },
            { value: "£0", label: "Void Risk" },
            { value: "24/7", label: "Guest Support" }
          ].map((stat, i) => (
            <div key={i} className="py-6 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0 flex-1 text-center reveal r-d1">
              <div className="font-playfair text-[52px] text-[#f0ede8] leading-none mb-3">{stat.value}</div>
              <div className="text-[11px] tracking-wide text-[#5a5552] uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Landlord Feature */}
      <section className="bg-[#0e0e0e]">
        <div className="w-full h-[55vh] relative reveal-fade">
          <img src="/__mockup/images/landlord-exterior.png" alt="Premium exterior" className="w-full h-full object-cover object-top" />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-24 text-center reveal r-d1">
          <div className="text-[10px] tracking-[0.24em] uppercase text-[#5a5552] mb-6">— 01</div>
          <h2 className="font-playfair text-[52px] font-normal text-[#f0ede8] leading-[1.1] mb-8">Effortless Ownership</h2>
          <p className="text-[16px] font-light text-[#7a7572] leading-[1.8] max-w-2xl mx-auto">
            Experience the financial rewards of property investment without the operational burden. 
            We lease your property on a long-term commercial basis, guaranteeing your rent and 
            maintaining it to hotel standards.
          </p>
        </div>
      </section>

      {/* Guest Feature */}
      <section className="bg-[#0e0e0e] flex flex-col md:flex-row">
        <div className="w-full md:w-[60%] h-[50vh] md:h-auto min-h-[600px] relative reveal-fade">
          <img src="/__mockup/images/guest-office.png" alt="Home office" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-[40%] px-8 py-24 md:p-24 flex flex-col justify-center reveal r-d1">
          <div className="text-[10px] tracking-[0.24em] uppercase text-[#5a5552] mb-6">— 02</div>
          <h2 className="font-playfair text-[52px] font-normal text-[#f0ede8] leading-[1.1] mb-8">Curated Living</h2>
          <p className="text-[16px] font-light text-[#7a7572] leading-[1.8]">
            For the modern professional, our serviced apartments offer the perfect equilibrium 
            of luxury and practicality. Fully equipped, impeccably designed, and supported 
            around the clock.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#161616] py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 reveal r-d1">
            <h2 className="font-playfair text-[52px] font-normal text-[#f0ede8] leading-[1.1]">The Process</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: "01", title: "Consultation", desc: "We view your property and provide a guaranteed rent offer within 24 hours." },
              { num: "02", title: "Agreement", desc: "Sign a 3-5 year commercial lease. No void periods, no management fees." },
              { num: "03", title: "Management", desc: "We furnish, manage, and maintain the property to premium standards." }
            ].map((step, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.15 + 0.1}s` }}>
                <div className="h-[1px] w-full bg-[#2a2726] mb-8" />
                <div className="font-playfair text-[36px] text-[#2a2726] leading-none mb-6">{step.num}</div>
                <h3 className="font-inter font-bold text-[18px] text-[#f0ede8] mb-4">{step.title}</h3>
                <p className="font-inter font-light text-[15px] text-[#7a7572] leading-[1.8]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-[#0e0e0e] py-32 px-6 text-center reveal-fade">
        <h2 className="font-playfair text-4xl md:text-[56px] font-normal text-[#f0ede8] leading-[1.1] mb-12 max-w-3xl mx-auto">
          Your property, managed to perfection.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 border border-[#f0ede8]/30 rounded-full text-[#f0ede8] text-sm hover:bg-[#f0ede8] hover:text-[#0e0e0e] transition-colors">
            Get a Free Valuation
          </button>
          <button className="px-8 py-4 border border-[#f0ede8]/30 rounded-full text-[#f0ede8] text-sm hover:bg-[#f0ede8] hover:text-[#0e0e0e] transition-colors">
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t border-[#2a2726] py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/__mockup/images/atera-logo.png" alt="Atera" style={{height: 24, width: 'auto'}} />
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#5a5552]">Atera Stays</span>
          </div>
          <div className="text-[12px] text-[#5a5552]">
            © 2026 Atera Industries Ltd. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
