import React, { useEffect } from "react";
import { Link } from "wouter";
import "./_group.css";

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif] selection:bg-white selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-black/60 backdrop-blur-[20px] border-b border-[#1d1d1f] flex items-center justify-between px-8">
        <div className="font-bold text-lg tracking-tight">Atera Stays</div>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-300">
          <a href="#landlords" className="hover:text-white transition-colors">Landlords</a>
          <a href="#guests" className="hover:text-white transition-colors">Guests</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
        </div>
        <div>
          <button className="bg-white text-black px-4 py-1.5 text-xs font-semibold rounded-[980px] hover:bg-gray-200 transition-colors">
            Book a Stay
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen min-h-[800px] flex flex-col items-center justify-start pt-32 overflow-hidden bg-black">
        <div className="text-center z-10 px-4 flex flex-col items-center">
          <h1 className="text-[64px] md:text-[96px] font-bold tracking-[-0.04em] leading-tight mb-2 animate-fade-in-up">
            Premium Stays.
            <br />
            Proven Management.
          </h1>
          <p className="text-[19px] md:text-[21px] text-[#86868b] max-w-2xl mx-auto font-medium mb-8 animate-fade-in-up delay-100">
            Guaranteed rent for landlords. 
            <br />
            Premium serviced accommodation for corporate guests.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-200">
            <button className="bg-white text-black px-6 py-3 rounded-[980px] font-semibold text-[17px] hover:bg-gray-200 transition-colors w-full sm:w-auto">
              Get a Free Valuation
            </button>
            <button className="bg-transparent text-white border border-[#424245] px-6 py-3 rounded-[980px] font-semibold text-[17px] hover:bg-[#1d1d1f] transition-colors w-full sm:w-auto">
              Book a Stay
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-[55%] animate-fade-in-up delay-300">
          <img 
            src="/__mockup/images/hero-apartment.png" 
            alt="Luxury apartment interior"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white text-black border-y border-[#d2d2d7]">
        <div className="max-w-[1200px] mx-auto py-16 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 divide-x divide-[#d2d2d7]">
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-[48px] font-bold tracking-tight mb-2">100%</span>
              <span className="text-[#86868b] text-[15px] font-semibold tracking-wide uppercase">Guaranteed Rent</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-[48px] font-bold tracking-tight mb-2">3–5</span>
              <span className="text-[#86868b] text-[15px] font-semibold tracking-wide uppercase">Year Agreements</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-[48px] font-bold tracking-tight mb-2">£0</span>
              <span className="text-[#86868b] text-[15px] font-semibold tracking-wide uppercase">Void Risk</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-[48px] font-bold tracking-tight mb-2">24/7</span>
              <span className="text-[#86868b] text-[15px] font-semibold tracking-wide uppercase">Guest Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Landlord Service */}
      <section id="landlords" className="bg-[#f5f5f7] text-black py-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-[40%] flex flex-col items-start">
            <span className="text-[12px] font-bold tracking-widest text-[#86868b] uppercase mb-4 px-3 py-1 border border-[#d2d2d7] rounded-[980px]">For Landlords</span>
            <h2 className="text-[48px] font-bold tracking-tight leading-tight mb-6">
              Total peace of mind. <br /> Zero void periods.
            </h2>
            <p className="text-[19px] text-[#86868b] leading-relaxed mb-8">
              We become your company tenant, guaranteeing your rent for 3 to 5 years. No management fees, no void periods, and your property is maintained to show-home standards.
            </p>
            <a href="#" className="text-[19px] text-[#0066cc] font-semibold hover:underline flex items-center gap-1 group">
              Get a free valuation 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
          <div className="w-full md:w-[60%]">
            <img 
              src="/__mockup/images/landlord-exterior.png" 
              alt="Premium UK townhouse"
              className="w-full rounded-[24px] shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Guest Service */}
      <section id="guests" className="bg-black text-white py-32 overflow-hidden border-t border-[#1d1d1f]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-[40%] flex flex-col items-start">
            <span className="text-[12px] font-bold tracking-widest text-[#86868b] uppercase mb-4 px-3 py-1 border border-[#424245] rounded-[980px]">For Corporate Guests</span>
            <h2 className="text-[48px] font-bold tracking-tight leading-tight mb-6">
              A premium space to work, rest, and live.
            </h2>
            <p className="text-[19px] text-[#86868b] leading-relaxed mb-8">
              Spacious, fully equipped serviced apartments designed for professionals. Fast Wi-Fi, dedicated workspaces, and 24/7 support—everything you need for a perfect stay.
            </p>
            <a href="#" className="text-[19px] text-[#2997ff] font-semibold hover:underline flex items-center gap-1 group">
              Explore our locations 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
          <div className="w-full md:w-[60%]">
            <img 
              src="/__mockup/images/guest-office.png" 
              alt="Premium home office setup"
              className="w-full rounded-[24px]"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white text-black py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-[56px] font-bold tracking-tight mb-4">How it works.</h2>
            <p className="text-[21px] text-[#86868b] font-medium">Simple, transparent, and completely hands-off.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="text-[120px] font-bold text-[#f5f5f7] tracking-tighter leading-none mb-4 -ml-4">01</div>
              <h3 className="text-[24px] font-bold tracking-tight mb-3">Property Valuation</h3>
              <p className="text-[17px] text-[#86868b] leading-relaxed">
                We view your property and make a guaranteed rent offer within 24 hours. No hidden fees.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[120px] font-bold text-[#f5f5f7] tracking-tighter leading-none mb-4 -ml-4">02</div>
              <h3 className="text-[24px] font-bold tracking-tight mb-3">Sign Agreement</h3>
              <p className="text-[17px] text-[#86868b] leading-relaxed">
                We sign a 3 to 5 year company let agreement. We become your sole tenant and take on all management.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[120px] font-bold text-[#f5f5f7] tracking-tighter leading-none mb-4 -ml-4">03</div>
              <h3 className="text-[24px] font-bold tracking-tight mb-3">Receive Rent</h3>
              <p className="text-[17px] text-[#86868b] leading-relaxed">
                You receive fixed rent on the same day every month, regardless of occupancy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white py-32 border-y border-[#1d1d1f]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-[56px] font-bold tracking-tight leading-tight mb-10">
            Ready to upgrade your property experience?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-[980px] font-semibold text-[17px] hover:bg-gray-200 transition-colors w-full sm:w-auto">
              Get a Free Valuation
            </button>
            <button className="bg-[#1d1d1f] text-white px-8 py-4 rounded-[980px] font-semibold text-[17px] hover:bg-[#424245] transition-colors w-full sm:w-auto">
              Book a Stay
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-[#86868b] py-12 text-[12px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-8 font-bold text-white text-lg">Atera Stays</div>
          <div className="border-t border-[#1d1d1f] pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p>Copyright © {new Date().getFullYear()} Atera Industries Ltd. All rights reserved.</p>
              <p className="mt-1">Atera Stays is a trading name of Atera Industries Ltd.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
