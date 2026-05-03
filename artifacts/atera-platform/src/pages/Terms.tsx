import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useState } from "react";
import { GuestEnquiryModal } from "@/components/modals/GuestEnquiryModal";
import { LandlordEnquiryModal } from "@/components/modals/LandlordEnquiryModal";

export function Terms() {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [landlordModalOpen, setLandlordModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar 
        onBookStay={() => setGuestModalOpen(true)} 
        onLandlord={() => setLandlordModalOpen(true)} 
      />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-3xl mx-auto w-full text-off-white font-light text-[15px] leading-relaxed">
        <h1 className="font-display text-4xl md:text-5xl text-gold text-center mb-16">Terms & Conditions</h1>

        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">1. Use of Site</h2>
            <p className="text-grey-1">By accessing the ATERA INDUSTRIES LTD website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">2. No Financial Advice</h2>
            <p className="text-grey-1">The materials on the ATERA INDUSTRIES LTD website are provided on an 'as is' basis. The information provided does not constitute financial, investment, or legal advice. Landlords should seek independent professional advice before entering into any agreements.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">3. Enquiries Not Contracts</h2>
            <p className="text-grey-1">Submitting an enquiry through our website does not constitute a binding contract. All property management and stays partnership agreements are subject to separate formal written contracts, property assessments, and necessary permissions.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">4. Limitation of Liability</h2>
            <p className="text-grey-1">In no event shall ATERA INDUSTRIES LTD or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">5. Governing Law</h2>
            <p className="text-grey-1">These terms and conditions are governed by and construed in accordance with the laws of England & Wales and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </section>
        </div>
      </main>

      <Footer />
      
      <GuestEnquiryModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />
      <LandlordEnquiryModal open={landlordModalOpen} onClose={() => setLandlordModalOpen(false)} />
    </div>
  );
}
