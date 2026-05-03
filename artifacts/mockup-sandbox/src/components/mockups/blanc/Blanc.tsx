import React, { useEffect } from 'react';
import './_group.css';

export function Blanc() {
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
    <div className="font-sans text-[#111111] bg-[#ffffff] min-h-screen selection:bg-[#111111] selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] border-b border-[#e8e8e8] h-20 flex items-center justify-between px-8 md:px-12">
        <div className="flex items-center gap-4">
          <img 
            src="/__mockup/images/atera-logo.png" 
            alt="Atera" 
            style={{ height: 36, width: 'auto', mixBlendMode: 'multiply' }} 
          />
          <span className="text-[11px] tracking-widest uppercase font-medium mt-1">
            Atera Stays
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-[14px] text-[#767676] hover:text-[#111111] transition-colors">Landlords</a>
          <a href="#" className="text-[14px] text-[#767676] hover:text-[#111111] transition-colors">Guests</a>
          <a href="#" className="text-[14px] text-[#767676] hover:text-[#111111] transition-colors">Properties</a>
          <a href="#" className="text-[14px] text-[#767676] hover:text-[#111111] transition-colors">About</a>
        </div>
        
        <button className="bg-[#111111] text-white rounded-full px-6 py-2.5 text-[14px] font-medium hover:bg-black transition-colors">
          Contact Us
        </button>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex flex-col justify-center items-center pt-20">
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 -mt-16 w-full max-w-5xl mx-auto">
          <span className="hero-in h-d0 block text-[11px] font-medium tracking-[0.15em] uppercase text-[#999999] mb-8">
            Premium Property Management
          </span>
          <h1 className="hero-in h-d1 text-[56px] md:text-[88px] font-[800] tracking-[-0.05em] leading-[0.95] mb-10">
            Premium Stays.<br />Proven Management.
          </h1>
          
          <div className="hero-in h-d2 w-full max-w-[320px] h-[1px] bg-[#e8e8e8] mx-auto mb-10"></div>
          
          <p className="hero-in h-d3 text-[18px] text-[#767676] max-w-2xl mb-12">
            Guaranteed rent for landlords. Premium serviced accommodation for corporate guests.
          </p>
          
          <div className="hero-in h-d4 flex flex-col sm:flex-row items-center gap-6">
            <button className="bg-[#111111] text-white rounded-full px-8 py-3.5 text-[15px] font-medium hover:bg-black transition-colors w-full sm:w-auto">
              Get a Free Valuation
            </button>
            <a href="#" className="text-[15px] text-[#767676] hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">
              Book a Stay
            </a>
          </div>
        </div>
        
        <div className="hero-in h-d4 w-full h-[40vh] mt-auto relative">
          <img 
            src="/__mockup/images/hero-apartment.png" 
            alt="Luxury apartment interior"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#f7f6f4] border-y border-[#e8e8e8] py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-y-16 gap-x-20 md:gap-x-32">
          <div className="reveal r-d1 text-center">
            <div className="text-[48px] font-[800] tracking-[-0.02em] mb-2">100%</div>
            <div className="text-[12px] tracking-wide uppercase text-[#999999] font-medium">Guaranteed Rent</div>
          </div>
          <div className="reveal r-d2 text-center">
            <div className="text-[48px] font-[800] tracking-[-0.02em] mb-2">3–5yr</div>
            <div className="text-[12px] tracking-wide uppercase text-[#999999] font-medium">Agreements</div>
          </div>
          <div className="reveal r-d3 text-center">
            <div className="text-[48px] font-[800] tracking-[-0.02em] mb-2">£0</div>
            <div className="text-[12px] tracking-wide uppercase text-[#999999] font-medium">Void Risk</div>
          </div>
          <div className="reveal r-d4 text-center">
            <div className="text-[48px] font-[800] tracking-[-0.02em] mb-2">24/7</div>
            <div className="text-[12px] tracking-wide uppercase text-[#999999] font-medium">Guest Support</div>
          </div>
        </div>
      </section>

      {/* Landlord Feature */}
      <section className="bg-[#ffffff] flex flex-col lg:flex-row items-center min-h-[80vh]">
        <div className="w-full lg:w-1/2 py-24 px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col justify-center">
          <span className="reveal r-d1 text-[11px] font-medium tracking-[0.15em] uppercase text-[#999999] mb-6 block">
            For Landlords
          </span>
          <h2 className="reveal r-d2 text-[36px] md:text-[48px] font-[700] tracking-[-0.04em] leading-[1.1] mb-8">
            Effortless income. Zero headaches.
          </h2>
          <p className="reveal r-d3 text-[17px] text-[#767676] leading-[1.7] mb-10 max-w-md">
            We lease your property for 3 to 5 years, providing you with guaranteed monthly rent regardless of occupancy. We handle all maintenance, cleaning, and guest management, keeping your property in showroom condition.
          </p>
          <div className="reveal r-d4">
            <a href="#" className="inline-flex items-center text-[15px] font-medium border-b border-[#111111] pb-1 hover:text-[#767676] hover:border-[#767676] transition-colors">
              Learn about our guarantee →
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-[80vh] reveal-fade r-d2">
          <img 
            src="/__mockup/images/landlord-exterior.png" 
            alt="Premium townhouse exterior"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Guest Feature */}
      <section className="bg-[#ffffff] flex flex-col-reverse lg:flex-row items-center min-h-[80vh]">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-[80vh] reveal-fade r-d2">
          <img 
            src="/__mockup/images/guest-office.png" 
            alt="Serviced apartment home office"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 py-24 px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col justify-center">
          <span className="reveal r-d1 text-[11px] font-medium tracking-[0.15em] uppercase text-[#999999] mb-6 block">
            For Guests
          </span>
          <h2 className="reveal r-d2 text-[36px] md:text-[48px] font-[700] tracking-[-0.04em] leading-[1.1] mb-8">
            A space to live, work, and thrive.
          </h2>
          <p className="reveal r-d3 text-[17px] text-[#767676] leading-[1.7] mb-10 max-w-md">
            Our premium serviced accommodation offers the comfort of home with the standards of a luxury hotel. Fully equipped kitchens, dedicated workspaces, high-speed Wi-Fi, and 24/7 support for corporate professionals.
          </p>
          <div className="reveal r-d4">
            <a href="#" className="inline-flex items-center text-[15px] font-medium border-b border-[#111111] pb-1 hover:text-[#767676] hover:border-[#767676] transition-colors">
              Explore our properties →
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f7f6f4] py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center reveal">
            <h2 className="text-[36px] md:text-[48px] font-[700] tracking-[-0.04em]">How it works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="reveal r-d1">
              <div className="w-full h-[1px] bg-[#e8e8e8] mb-8"></div>
              <div className="text-[11px] text-[#999999] tracking-widest mb-6">01</div>
              <h3 className="text-[20px] font-[700] mb-4">Valuation</h3>
              <p className="text-[16px] text-[#767676] leading-[1.7]">
                We assess your property and provide a guaranteed monthly rent offer within 24 hours.
              </p>
            </div>
            
            <div className="reveal r-d2">
              <div className="w-full h-[1px] bg-[#e8e8e8] mb-8"></div>
              <div className="text-[11px] text-[#999999] tracking-widest mb-6">02</div>
              <h3 className="text-[20px] font-[700] mb-4">Agreement</h3>
              <p className="text-[16px] text-[#767676] leading-[1.7]">
                Sign a 3 to 5 year lease. We take on all management, maintenance, and void risks.
              </p>
            </div>
            
            <div className="reveal r-d3">
              <div className="w-full h-[1px] bg-[#e8e8e8] mb-8"></div>
              <div className="text-[11px] text-[#999999] tracking-widest mb-6">03</div>
              <h3 className="text-[20px] font-[700] mb-4">Income</h3>
              <p className="text-[16px] text-[#767676] leading-[1.7]">
                Receive guaranteed rent on the same day every month, while we elevate your property.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-[#111111] py-32 px-8 text-center">
        <div className="max-w-3xl mx-auto reveal">
          <h2 className="text-[40px] md:text-[52px] font-[700] text-white tracking-[-0.04em] leading-[1.1] mb-12">
            Ready for a hands-off investment?
          </h2>
          <button className="bg-white text-[#111111] rounded-full px-10 py-4 text-[16px] font-medium hover:bg-gray-100 transition-colors">
            Get a Free Valuation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#ffffff] border-t border-[#e8e8e8] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/__mockup/images/atera-logo.png" 
              alt="Atera" 
              style={{ height: 28, width: 'auto', mixBlendMode: 'multiply' }} 
            />
            <span className="text-[11px] tracking-widest uppercase font-medium mt-1">
              Atera Stays
            </span>
          </div>
          
          <div className="text-[13px] text-[#999999]">
            © 2026 Atera Industries Ltd. All rights reserved.
          </div>
          
          <div className="w-[100px] md:block hidden">
            {/* Spacer for centering the legal text if needed, or keeping minimal structure */}
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Blanc;