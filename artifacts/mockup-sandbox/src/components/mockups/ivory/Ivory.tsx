import React, { useEffect } from "react";
import "./_group.css";

const Logo = () => (
  <img src="/__mockup/images/atera-logo.png" alt="Atera Stays" style={{height:36,width:'auto',mixBlendMode:'multiply'}} />
);

export function Ivory() {
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
    <div className="min-h-screen bg-[#ffffff] font-sans text-[#1d1d1f] selection:bg-[#C9A84C]/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e5ea] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <Logo />
            <span className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#1d1d1f]">Atera Stays</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-[14px] text-[#6e6e73] font-medium">
            <a href="#landlords" className="hover:text-[#1d1d1f] transition-colors">For Landlords</a>
            <a href="#guests" className="hover:text-[#1d1d1f] transition-colors">For Guests</a>
            <a href="#how-it-works" className="hover:text-[#1d1d1f] transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-[14px] font-medium text-[#1d1d1f] hover:opacity-70 transition-opacity">
              Log in
            </button>
            <button className="bg-[#1d1d1f] text-white px-5 py-2 rounded-full text-[14px] font-medium hover:bg-black transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/hero-apartment.png" 
            alt="Luxury apartment view" 
            className="w-full h-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/60" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-16">
          <div className="hero-in h-d0 mb-6 inline-block">
            <span className="text-[#C9A84C] text-[11px] font-semibold tracking-[0.16em] uppercase">Atera Stays</span>
          </div>
          <h1 className="hero-in h-d1 text-white text-5xl md:text-[88px] font-bold tracking-[-0.04em] leading-[1.05] mb-8">
            Premium Stays.<br/>Proven Management.
          </h1>
          <p className="hero-in h-d2 text-[#f5f5f7] text-lg md:text-[21px] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Guaranteed rent for landlords. Premium serviced accommodation for corporate guests.
          </p>
          <div className="hero-in h-d3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-[#1d1d1f] px-8 py-4 rounded-full text-[17px] font-medium hover:bg-[#f5f5f7] transition-colors">
              Get a Free Valuation
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-4 rounded-full text-[17px] font-medium hover:bg-white/10 transition-colors">
              Book a Stay
            </button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#f2f0eb] border-y border-[#e5e5ea] py-16 relative z-20 -mt-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { stat: "100%", label: "Guaranteed Rent" },
              { stat: "3–5yr", label: "Agreements" },
              { stat: "£0", label: "Void Risk" },
              { stat: "24/7", label: "Guest Support" }
            ].map((item, i) => (
              <div key={i} className={`reveal-fade r-d${i+1} text-center`}>
                <div className="text-[44px] font-bold text-[#1d1d1f] tracking-tight mb-2">{item.stat}</div>
                <div className="text-[#6e6e73] text-[15px] font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord Feature */}
      <section id="landlords" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal r-d1 order-2 md:order-1">
              <span className="text-[#3a3a3c] text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 block">For Landlords</span>
              <h2 className="text-4xl md:text-[52px] font-bold text-[#1d1d1f] tracking-[-0.03em] leading-tight mb-6">
                Effortless property management.
              </h2>
              <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-8">
                We take the hassle out of property investment. Enjoy long-term agreements, zero void periods, and professional maintenance. Your property is kept in show-home condition while you receive guaranteed monthly rent.
              </p>
              <div className="w-16 h-[1px] bg-[#C9A84C] mb-8"></div>
              <ul className="space-y-4 mb-8">
                {['No tenant finding fees', 'Professional weekly cleaning', 'Minor maintenance covered', 'Fully insured operations'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[17px] text-[#6e6e73]">
                    <svg className="w-6 h-6 text-[#1d1d1f] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="text-[#1d1d1f] font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity">
                Learn more about our landlord services
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="reveal-fade r-d2 order-1 md:order-2">
              <img 
                src="/__mockup/images/landlord-exterior.png" 
                alt="Premium property exterior" 
                className="w-full rounded-[20px] shadow-2xl object-cover aspect-[4/5] md:aspect-square"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guest Feature */}
      <section id="guests" className="py-24 md:py-32 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-fade r-d1">
              <img 
                src="/__mockup/images/guest-office.png" 
                alt="Premium home office setup" 
                className="w-full rounded-[20px] shadow-2xl object-cover aspect-[4/5] md:aspect-square"
              />
            </div>
            <div className="reveal r-d2">
              <span className="text-[#3a3a3c] text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 block">For Guests</span>
              <h2 className="text-4xl md:text-[52px] font-bold text-[#1d1d1f] tracking-[-0.03em] leading-tight mb-6">
                Space to work.<br/>Room to live.
              </h2>
              <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-8">
                Experience the perfect blend of luxury hotel amenities and the comfort of home. Our curated properties are designed specifically for corporate professionals requiring premium short to medium-term accommodation.
              </p>
              <ul className="space-y-4 mb-8">
                {['High-speed dedicated Wi-Fi', 'Premium linens and toiletries', 'Dedicated workspace', '24/7 guest support'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[17px] text-[#6e6e73]">
                    <svg className="w-6 h-6 text-[#1d1d1f] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="text-[#1d1d1f] font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity">
                View our properties
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 reveal r-d1">
            <span className="text-[#3a3a3c] text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 block">Process</span>
            <h2 className="text-4xl md:text-[52px] font-bold text-[#1d1d1f] tracking-[-0.03em] leading-tight">
              Simple. Transparent.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Property Valuation",
                desc: "We assess your property to ensure it meets our premium standards and provide a guaranteed rent offer."
              },
              {
                title: "Agreement & Setup",
                desc: "Sign a 3-5 year corporate let agreement. We'll handle any minor interior styling needed at our cost."
              },
              {
                title: "Guaranteed Income",
                desc: "Receive your rent on the same day every month, regardless of occupancy. We handle all management."
              }
            ].map((step, i) => (
              <div key={i} className={`reveal r-d${i+1} relative`}>
                <div className="text-[100px] font-bold text-[#e5e5ea] leading-none mb-6 tracking-tighter">
                  {i + 1}
                </div>
                <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-4">{step.title}</h3>
                <p className="text-[17px] text-[#6e6e73] leading-[1.7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-black py-24">
        <div className="max-w-4xl mx-auto px-6 text-center reveal r-d1">
          <h2 className="text-4xl md:text-[52px] font-bold text-white tracking-[-0.03em] leading-tight mb-10">
            Ready to secure your investment?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-[#1d1d1f] px-8 py-4 rounded-full text-[17px] font-medium hover:bg-[#f5f5f7] transition-colors">
              Get a Free Valuation
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-4 rounded-full text-[17px] font-medium hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5e5ea] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#1d1d1f]">Atera Stays</span>
            </div>
            <div className="text-[14px] text-[#6e6e73]">
              Copyright © 2026 Atera Industries Ltd. All rights reserved.
            </div>
            <div className="flex gap-6 text-[14px] text-[#6e6e73]">
              <a href="#" className="hover:text-[#1d1d1f] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#1d1d1f] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
