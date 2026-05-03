import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function Navbar({ onBookStay, onLandlord }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-black/70 backdrop-blur-[20px] border-b border-[#1d1d1f]">
        <div className="relative h-full flex items-center px-6 md:px-8">

          {/* Left — logo + wordmark */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src="/atera-logo.png" alt="Atera Stays" className="h-8 w-auto" />
            <span className="hidden sm:block text-white font-semibold text-[14px] tracking-tight">
              Atera Stays
            </span>
          </div>

          {/* Centre — nav links (absolutely centred in the bar) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[13px] font-medium text-[#a1a1a6]">
            <button onClick={() => scrollTo("landlords")} className="hover:text-white transition-colors duration-200">
              Landlords
            </button>
            <button onClick={() => scrollTo("guests")} className="hover:text-white transition-colors duration-200">
              Guests
            </button>
            <button onClick={() => scrollTo("how-it-works")} className="hover:text-white transition-colors duration-200">
              How it works
            </button>
          </div>

          {/* Right — CTAs */}
          <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
            <button
              onClick={onLandlord}
              className="text-[13px] font-medium text-[#a1a1a6] hover:text-white transition-colors duration-200"
            >
              I have a property
            </button>
            <button
              onClick={onBookStay}
              className="bg-white text-black px-4 py-1.5 text-[13px] font-semibold rounded-[980px] hover:bg-[#e8e8ed] transition-colors duration-200"
            >
              Book a Stay
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white ml-auto" onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-[20px] flex flex-col pt-6 px-6 pb-12">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2.5">
              <img src="/atera-logo.png" alt="Atera Stays" className="h-8 w-auto" />
              <span className="text-white font-semibold text-[14px] tracking-tight">Atera Stays</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 flex-grow">
            {(["landlords", "guests", "how-it-works"] as const).map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-[28px] font-bold text-white tracking-tight hover:text-[#a1a1a6] transition-colors capitalize"
              >
                {id === "how-it-works" ? "How it works" : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={() => { setMobileOpen(false); onLandlord(); }}
              className="w-full border border-white/30 text-white py-3.5 rounded-[980px] font-semibold text-[15px]"
            >
              I have a property
            </button>
            <button
              onClick={() => { setMobileOpen(false); onBookStay(); }}
              className="w-full bg-white text-black py-3.5 rounded-[980px] font-semibold text-[15px]"
            >
              Book a Stay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
