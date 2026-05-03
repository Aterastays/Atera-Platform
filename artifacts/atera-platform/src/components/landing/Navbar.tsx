import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function Navbar({ onBookStay, onLandlord }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-[#0D0C0F] shadow-md border-b border-[rgba(201,168,76,0.12)]" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <img src="/atera-logo.svg" alt="Atera Stays" style={{ height: 40 }} />
            <span className="hidden md:block font-display text-[22px] text-gold tracking-wide">ATERA Stays</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("services")} className="font-body text-[14px] text-[#8C8880] hover:text-gold transition-colors">Services</button>
            <button onClick={() => scrollTo("properties")} className="font-body text-[14px] text-[#8C8880] hover:text-gold transition-colors">Properties</button>
            <button onClick={() => scrollTo("how")} className="font-body text-[14px] text-[#8C8880] hover:text-gold transition-colors">How It Works</button>
            <button onClick={() => scrollTo("management")} className="font-body text-[14px] text-[#8C8880] hover:text-gold transition-colors">Management</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={onLandlord} className="btn-outline">I Have a Property</button>
            <button onClick={onBookStay} className="btn-gold">Book a Stay</button>
          </div>

          <button className="md:hidden text-off-white" onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-[#080709]/95 backdrop-blur flex flex-col pt-6 px-6 pb-12">
          <div className="flex justify-end mb-12">
            <button onClick={() => setMobileOpen(false)} className="text-off-white hover:text-gold transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <div className="flex flex-col gap-8 items-center text-center flex-grow">
            <button onClick={() => scrollTo("services")} className="font-display text-3xl text-off-white hover:text-gold transition-colors">Services</button>
            <button onClick={() => scrollTo("properties")} className="font-display text-3xl text-off-white hover:text-gold transition-colors">Properties</button>
            <button onClick={() => scrollTo("how")} className="font-display text-3xl text-off-white hover:text-gold transition-colors">How It Works</button>
            <button onClick={() => scrollTo("management")} className="font-display text-3xl text-off-white hover:text-gold transition-colors">Management</button>
            
            <div className="mt-auto flex flex-col w-full max-w-xs gap-4">
              <button onClick={() => { setMobileOpen(false); onLandlord(); }} className="btn-outline w-full justify-center py-4 text-lg">I Have a Property</button>
              <button onClick={() => { setMobileOpen(false); onBookStay(); }} className="btn-gold w-full justify-center py-4 text-lg">Book a Stay</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
