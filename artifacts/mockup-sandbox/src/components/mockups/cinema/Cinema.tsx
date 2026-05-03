import React, { useEffect } from 'react';
import './_group.css';

const Logo = () => (
  <img src="/__mockup/images/atera-logo.png" alt="Atera Stays" style={{height:36,width:'auto'}} />
);

export function Cinema() {
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
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] selection:bg-white/20">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/70 backdrop-blur-[24px] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">Atera Stays</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#636366] text-sm hover:text-white transition-colors">Landlords</a>
            <a href="#" className="text-[#636366] text-sm hover:text-white transition-colors">Guests</a>
          </div>
          <div>
            <a href="#" className="text-white text-sm font-medium hover:opacity-70 transition-opacity">Book &rarr;</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/hero-apartment.png" 
            alt="Luxury apartment" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-transparent to-[#080808]/50" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center mt-12 max-w-4xl">
          <div className="w-12 h-px bg-white mb-8 hero-in h-d0" />
          <h1 className="text-6xl md:text-[96px] leading-[1.1] font-['Playfair_Display'] italic font-bold tracking-[-0.02em] mb-6 hero-in h-d1">
            Premium Stays.<br />Proven Management.
          </h1>
          <p className="text-[17px] text-[#aeaeb2] font-light max-w-2xl mb-12 hero-in h-d2 leading-[1.75]">
            Guaranteed rent for landlords. Premium serviced accommodation for corporate guests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 hero-in h-d3">
            <button className="px-8 py-3 rounded-full border border-white text-white backdrop-blur hover:bg-white hover:text-black transition-all duration-500">
              Get a Free Valuation
            </button>
            <button className="px-8 py-3 rounded-full border border-white/40 text-white backdrop-blur hover:border-white transition-all duration-500">
              Book a Stay
            </button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#111111] py-16 border-y border-[#1c1c1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#2c2c2e]">
            {[
              { value: "100%", label: "Guaranteed Rent" },
              { value: "3-5yr", label: "Agreements" },
              { value: "£0", label: "Void Risk" },
              { value: "24/7", label: "Guest Support" }
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center text-center reveal-fade r-d${i+1} pt-8 md:pt-0`}>
                <div className="text-[48px] font-['Playfair_Display'] text-white leading-none mb-2">{stat.value}</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#636366]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature: Landlord */}
      <section className="py-24 bg-[#080808]">
        <div className="w-full h-[60vh] min-h-[400px] mb-16 reveal-fade">
          <img 
            src="/__mockup/images/landlord-exterior.png" 
            alt="Premium UK townhouse exterior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <div className="inline-block px-3 py-1 rounded-full border border-white/20 text-[#636366] text-[11px] uppercase tracking-[0.2em] mb-8">
            For Landlords
          </div>
          <h2 className="text-[40px] md:text-[56px] font-['Playfair_Display'] leading-[1.1] mb-6">
            Effortless returns.<br />Immaculate condition.
          </h2>
          <p className="text-[17px] text-[#aeaeb2] font-light leading-[1.75] mb-10">
            We lease your property long-term, guaranteeing your rent every month. Our professional cleaning and maintenance ensure your asset remains in pristine condition, eliminating void periods and tenant management headaches.
          </p>
          <button className="px-8 py-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition-all duration-500">
            Get a Free Valuation
          </button>
        </div>
      </section>

      {/* Feature: Guest */}
      <section className="py-24 bg-[#080808]">
        <div className="w-full h-[60vh] min-h-[400px] mb-16 reveal-fade">
          <img 
            src="/__mockup/images/guest-office.png" 
            alt="Home office in serviced apartment" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <div className="inline-block px-3 py-1 rounded-full border border-white/20 text-[#636366] text-[11px] uppercase tracking-[0.2em] mb-8">
            For Guests
          </div>
          <h2 className="text-[40px] md:text-[56px] font-['Playfair_Display'] leading-[1.1] mb-6">
            A standard you can trust,<br />wherever you travel.
          </h2>
          <p className="text-[17px] text-[#aeaeb2] font-light leading-[1.75] mb-10">
            Designed for corporate professionals and contractors, our properties offer hotel-quality amenities with the comfort and space of a real home. Fully equipped, professionally cleaned, and supported 24/7.
          </p>
          <button className="px-8 py-3 rounded-full border border-white/40 text-white hover:border-white transition-all duration-500">
            Book a Stay
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-[#080808] border-t border-[#1c1c1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal">
            <h2 className="text-[40px] md:text-[56px] font-['Playfair_Display'] leading-[1.1]">
              The Atera Process
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 md:gap-8">
            {[
              { num: "01", title: "Appraisal", desc: "We view your property and provide a guaranteed rent offer within 24 hours." },
              { num: "02", title: "Agreement", desc: "Sign a 3-5 year company let agreement with zero setup fees or hidden costs." },
              { num: "03", title: "Income", desc: "Receive guaranteed monthly payments while we manage, clean, and maintain the property." }
            ].map((step, i) => (
              <div key={i} className={`relative flex flex-col items-center text-center reveal r-d${i+1}`}>
                <div className="text-[80px] font-['Playfair_Display'] italic text-[#1c1c1e] leading-none mb-6">
                  {step.num}
                </div>
                <h3 className="text-[22px] font-bold text-white mb-4">{step.title}</h3>
                <p className="text-[17px] text-[#636366] font-light leading-[1.75]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-32 bg-[#080808] border-t border-[#1c1c1e] text-center px-4">
        <div className="max-w-3xl mx-auto reveal">
          <h2 className="text-[40px] md:text-[52px] font-['Playfair_Display'] italic text-white leading-[1.1] mb-12">
            Ready to elevate your property?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-full border border-white text-white backdrop-blur hover:bg-white hover:text-black transition-all duration-500">
              Get a Free Valuation
            </button>
            <button className="px-8 py-3 rounded-full border border-white/40 text-white backdrop-blur hover:border-white transition-all duration-500">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080808] border-t border-[#1c1c1e] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">Atera Stays</span>
          </div>
          <div className="text-[13px] text-[#636366]">
            Copyright &copy; 2026 Atera Industries Ltd. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
