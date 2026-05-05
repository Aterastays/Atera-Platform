import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StaysPartnership } from "@/components/landing/StaysPartnership";
import { PropertyManagement } from "@/components/landing/PropertyManagement";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PropertiesSection } from "@/components/landing/PropertiesSection";
import { CTAStrip } from "@/components/landing/CTAStrip";
import { Footer } from "@/components/landing/Footer";
import { GuestEnquiryModal } from "@/components/modals/GuestEnquiryModal";
import { LandlordEnquiryModal } from "@/components/modals/LandlordEnquiryModal";

export function Landing() {
  const [guestOpen, setGuestOpen] = useState(false);
  const [landlordOpen, setLandlordOpen] = useState(false);
  const [landlordService, setLandlordService] = useState<"stays" | "management" | null>(null);

  const openLandlord = (service?: "stays" | "management") => {
    setLandlordService(service ?? null);
    setLandlordOpen(true);
  };

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const guest = () => setGuestOpen(true);
  const landlord = () => openLandlord();

  return (
    <div style={{ minHeight: "100vh", background: "#080709", overflowX: "hidden" }}>
      <Navbar onBookStay={guest} onLandlord={landlord} />

      <main>
        {/* 1. Hero */}
        <Hero onBookStay={guest} onLandlord={landlord} />

        {/* 2. Trust Bar */}
        <TrustBar />

        {/* 3. Who are you / dual audience */}
        <ServicesSection onLandlord={() => openLandlord("stays")} onBookStay={guest} />

        {/* 4. Stays Partnership (4 subsections: dark/cream/dark/cream) */}
        <StaysPartnership onLandlord={() => openLandlord("stays")} />

        {/* 5. Property Management (3 subsections: dark/cream/dark) */}
        <PropertyManagement />

        {/* 6. How it works (2-column: guests + landlords) */}
        <HowItWorks />

        {/* 7. Properties grid */}
        <PropertiesSection onBookStay={guest} />

        {/* 8. Final CTA (gold section) */}
        <CTAStrip onBookStay={guest} onLandlord={landlord} />
      </main>

      <Footer />

      <GuestEnquiryModal open={guestOpen} onClose={() => setGuestOpen(false)} />
      <LandlordEnquiryModal open={landlordOpen} onClose={() => setLandlordOpen(false)} initialService={landlordService} />
    </div>
  );
}
