import { useState } from "react";
import { useRevealAll } from "@/hooks/useReveal";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StaysPartnership } from "@/components/landing/StaysPartnership";
import { PropertyManagement } from "@/components/landing/PropertyManagement";
import { PropertiesSection } from "@/components/landing/PropertiesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTAStrip } from "@/components/landing/CTAStrip";
import { Footer } from "@/components/landing/Footer";
import { GuestEnquiryModal } from "@/components/modals/GuestEnquiryModal";
import { LandlordEnquiryModal } from "@/components/modals/LandlordEnquiryModal";

export function Landing() {
  useRevealAll();

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [landlordModalOpen, setLandlordModalOpen] = useState(false);
  const [landlordInitialService, setLandlordInitialService] = useState<"stays" | "management" | null>(null);

  const handleLandlordClick = (service?: "stays" | "management") => {
    setLandlordInitialService(service || null);
    setLandlordModalOpen(true);
  };

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
        <StaysPartnership onLandlord={() => handleLandlordClick("stays")} />
        <PropertyManagement onLandlord={() => handleLandlordClick("management")} />
        <PropertiesSection onBookStay={() => setGuestModalOpen(true)} />
        <HowItWorks />
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
