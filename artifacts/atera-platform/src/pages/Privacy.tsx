import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useState } from "react";
import { GuestEnquiryModal } from "@/components/modals/GuestEnquiryModal";
import { LandlordEnquiryModal } from "@/components/modals/LandlordEnquiryModal";

export function Privacy() {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [landlordModalOpen, setLandlordModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar 
        onBookStay={() => setGuestModalOpen(true)} 
        onLandlord={() => setLandlordModalOpen(true)} 
      />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-3xl mx-auto w-full text-off-white font-light text-[15px] leading-relaxed">
        <h1 className="font-display text-4xl md:text-5xl text-gold text-center mb-4">Privacy Policy</h1>
        <p className="text-center text-grey-1 mb-16 text-sm">Last updated: 1 January 2025</p>

        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">1. Data We Collect</h2>
            <p className="mb-4">We collect personal data to provide our services, including:</p>
            <ul className="list-disc pl-5 space-y-2 text-grey-1">
              <li>Identity Data: Name, date of birth, copies of ID.</li>
              <li>Contact Data: Email address, telephone numbers, billing address.</li>
              <li>Financial Data: Bank account details (for rent remittances), payment card details.</li>
              <li>Property Data: Property addresses, ownership documents, compliance certificates.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">2. How We Use It</h2>
            <p className="mb-4">We use your personal data exclusively for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-grey-1">
              <li>To register you as a new client or guest.</li>
              <li>To process and deliver your booking or property management agreement.</li>
              <li>To manage payments, fees and charges.</li>
              <li>To notify you about changes to our terms or privacy policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">3. Your Rights (GDPR)</h2>
            <p className="mb-4">Under data protection laws, you have rights including:</p>
            <ul className="list-disc pl-5 space-y-2 text-grey-1">
              <li>Your right of access - You have the right to ask us for copies of your personal information.</li>
              <li>Your right to rectification - You have the right to ask us to rectify personal information you think is inaccurate.</li>
              <li>Your right to erasure - You have the right to ask us to erase your personal information in certain circumstances.</li>
              <li>Your right to restriction of processing - You have the right to ask us to restrict the processing of your personal information in certain circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">4. Cookies</h2>
            <p className="text-grey-1">Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-off-white mb-4 pb-2 border-b border-[rgba(201,168,76,0.15)]">5. Contact</h2>
            <p className="text-grey-1">
              ATERA INDUSTRIES LTD<br/>
              ICO Registration Number: ZA123456 (Placeholder)<br/>
              If you have any questions about this privacy policy, please contact us.
            </p>
          </section>
        </div>
      </main>

      <Footer />
      
      <GuestEnquiryModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />
      <LandlordEnquiryModal open={landlordModalOpen} onClose={() => setLandlordModalOpen(false)} />
    </div>
  );
}
