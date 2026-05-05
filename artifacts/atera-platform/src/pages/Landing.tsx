import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { PermissionsSection } from "@/components/landing/PermissionsSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StandardSection } from "@/components/landing/StandardSection";
import { CTAStrip } from "@/components/landing/CTAStrip";
import { Footer } from "@/components/landing/Footer";
import { GuestEnquiryModal } from "@/components/modals/GuestEnquiryModal";
import { LandlordEnquiryModal } from "@/components/modals/LandlordEnquiryModal";

export function Landing() {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [landlordModalOpen, setLandlordModalOpen] = useState(false);
  const [landlordInitialService, setLandlordInitialService] = useState<"stays" | "management" | null>(null);

  const handleLandlordClick = (service?: "stays" | "management") => {
    setLandlordInitialService(service || null);
    setLandlordModalOpen(true);
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

  return (
    <div className="min-h-screen bg-black font-['Inter',sans-serif] selection:bg-white selection:text-black overflow-x-hidden">
      <Navbar
        onBookStay={() => setGuestModalOpen(true)}
        onLandlord={() => handleLandlordClick()}
      />

      <main>
        <Hero
          onBookStay={() => setGuestModalOpen(true)}
          onLandlord={() => handleLandlordClick()}
        />
        <TrustBar />
        <ServicesSection
          onLandlord={() => handleLandlordClick("stays")}
          onBookStay={() => setGuestModalOpen(true)}
        />
        <PermissionsSection />
        <BenefitsSection />
        <TestimonialsSection />
        <HowItWorks />
        <StandardSection />
        <CTAStrip
          onBookStay={() => setGuestModalOpen(true)}
          onLandlord={() => handleLandlordClick()}
        />
      </main>

      <Footer />

      <GuestEnquiryModal
        open={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
      />
      <LandlordEnquiryModal
        open={landlordModalOpen}
        onClose={() => setLandlordModalOpen(false)}
        initialService={landlordInitialService}
      />
    </div>
  );
}
