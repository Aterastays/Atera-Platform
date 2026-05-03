import React, { useEffect } from "react";
import "./_group.css";

export function Landing() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-fade"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif] selection:bg-white selection:text-black overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-black/70 backdrop-blur-[20px] border-b border-[#1d1d1f] flex items-center justify-between px-8">
        <img
          src="/__mockup/images/atera-logo.png"
          alt="Atera Stays"
          className="h-9 w-auto"
        />
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#a1a1a6]">
          <a href="#landlords" className="hover:text-white transition-colors duration-200">Landlords</a>
          <a href="#guests"    className="hover:text-white transition-colors duration-200">Guests</a>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How it works</a>
        </div>
        <button className="bg-white text-black px-4 py-1.5 text-[13px] font-semibold rounded-[980px] hover:bg-[#e8e8ed] transition-colors duration-200">
          Book a Stay
        </button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[700px] bg-black overflow-hidden flex flex-col items-center justify-center">

        {/* Full-bleed background image */}
        <img
          src="/__mockup/images/hero-apartment.png"
          alt="Luxury serviced apartment"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient: heavy black at top fading to semi-transparent, then dark again at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/75 via-[45%] to-black/60 pointer-events-none" />

        {/* Text — always in the clear zone, centered vertically */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 -mt-8">
          <p className="hero-animate hero-d0 text-[12px] font-semibold tracking-[0.15em] uppercase text-[#a1a1a6] mb-5">
            Atera Stays
          </p>
          <h1 className="hero-animate hero-d1 text-[68px] md:text-[88px] font-bold tracking-[-0.04em] leading-[1.0] mb-0">
            Premium Stays.
          </h1>
          <h1 className="hero-animate hero-d2 text-[68px] md:text-[88px] font-bold tracking-[-0.04em] leading-[1.0] mb-7">
            Proven Management.
          </h1>
          <p className="hero-animate hero-d3 text-[17px] text-[#c7c7cc] max-w-lg mx-auto font-normal leading-[1.65] mb-8">
            Guaranteed rent for landlords.
            <br />
            Premium serviced accommodation for corporate guests.
          </p>
          <div className="hero-animate hero-d4 flex flex-col sm:flex-row items-center gap-3">
            <button className="bg-white text-black px-7 py-[11px] rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 min-w-[188px]">
              Get a Free Valuation
            </button>
            <button className="bg-black/40 backdrop-blur-sm text-white border border-white/30 px-7 py-[11px] rounded-[980px] font-semibold text-[15px] hover:bg-black/60 transition-colors duration-200 min-w-[188px]">
              Book a Stay
            </button>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────────── */}
      <section className="bg-white text-black border-y border-[#d2d2d7]">
        <div className="max-w-[1100px] mx-auto py-14 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: "100%", label: "Guaranteed Rent",  d: "" },
              { value: "3–5",  label: "Year Agreements",  d: "reveal-d1" },
              { value: "£0",   label: "Void Risk",        d: "reveal-d2" },
              { value: "24/7", label: "Guest Support",    d: "reveal-d3" },
            ].map(({ value, label, d }) => (
              <div
                key={label}
                className={`reveal-fade ${d} flex flex-col items-center text-center px-4 py-4 border-r border-[#d2d2d7] last:border-r-0`}
              >
                <span className="text-[44px] font-bold tracking-tight leading-none mb-2">{value}</span>
                <span className="text-[#6e6e73] text-[13px] font-semibold tracking-wide uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Landlord Service ───────────────────────────────────────── */}
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
            <a href="#" className="text-[17px] text-[#0066cc] font-semibold flex items-center gap-1 group hover:gap-2 transition-all duration-200">
              Get a free valuation
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
            </a>
          </div>

          <div className="reveal reveal-d2 w-full md:w-[58%]">
            <img
              src="/__mockup/images/landlord-exterior.png"
              alt="Premium UK property"
              className="w-full rounded-[20px]"
            />
          </div>
        </div>
      </section>

      {/* ── Guest Service ──────────────────────────────────────────── */}
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
            <a href="#" className="text-[17px] text-[#2997ff] font-semibold flex items-center gap-1 group hover:gap-2 transition-all duration-200">
              Explore our locations
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
            </a>
          </div>

          <div className="reveal reveal-d2 w-full md:w-[58%]">
            <img
              src="/__mockup/images/guest-office.png"
              alt="Premium home office in serviced apartment"
              className="w-full rounded-[20px]"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white text-black py-32">
        <div className="max-w-[1100px] mx-auto px-6">

          <div className="reveal text-center mb-24">
            <h2 className="text-[52px] font-bold tracking-[-0.03em] mb-4">How it works.</h2>
            <p className="text-[19px] text-[#6e6e73] font-normal">Simple, transparent, and completely hands-off.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { n: "01", title: "Property Valuation",
                body: "We view your property and provide a guaranteed rent offer within 24 hours. No hidden fees, no obligation." },
              { n: "02", title: "Sign Agreement",
                body: "We sign a 3–5 year company let agreement, becoming your sole tenant and taking on all management." },
              { n: "03", title: "Receive Rent",
                body: "Fixed rent hits your account on the same day every month — regardless of occupancy." },
            ].map(({ n, title, body }, i) => (
              <div
                key={n}
                className={`reveal reveal-d${i + 1} flex flex-col items-center text-center`}
              >
                <div className="text-[100px] font-bold text-[#f5f5f7] tracking-tighter leading-none mb-3 select-none">
                  {n}
                </div>
                <h3 className="text-[22px] font-bold tracking-tight mb-3">{title}</h3>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="bg-black text-white py-32 border-t border-[#1d1d1f]">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <h2 className="reveal text-[52px] font-bold tracking-[-0.03em] leading-[1.08] mb-10">
            Ready to upgrade your property experience?
          </h2>
          <div className="reveal reveal-d1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="bg-white text-black px-8 py-3.5 rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 min-w-[190px]">
              Get a Free Valuation
            </button>
            <button className="bg-[#1d1d1f] text-white px-8 py-3.5 rounded-[980px] font-semibold text-[15px] hover:bg-[#2c2c2e] transition-colors duration-200 min-w-[190px]">
              Book a Stay
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-black border-t border-[#1d1d1f] text-[#6e6e73] py-10 text-[12px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-7">
            <img src="/__mockup/images/atera-logo.svg" alt="Atera Stays" className="h-6 w-6" />
            <span className="text-white font-semibold text-[13px] tracking-tight">Atera Stays</span>
          </div>
          <div className="border-t border-[#1d1d1f] pt-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p>Copyright © {new Date().getFullYear()} Atera Industries Ltd. All rights reserved.</p>
              <p className="mt-1">Atera Stays is a trading name of Atera Industries Ltd.</p>
            </div>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Legal</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
