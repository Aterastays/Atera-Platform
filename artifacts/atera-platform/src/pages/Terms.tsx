import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { GuestEnquiryModal } from "@/components/modals/GuestEnquiryModal";
import { LandlordEnquiryModal } from "@/components/modals/LandlordEnquiryModal";

export function Terms() {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [landlordModalOpen, setLandlordModalOpen] = useState(false);

  const sections = [
    {
      title: "1. Use of Site",
      content: "By accessing the Atera Stays website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws."
    },
    {
      title: "2. No Financial Advice",
      content: "The information provided on this website does not constitute financial, investment, or legal advice. Landlords should seek independent professional advice before entering into any agreements with Atera Industries Ltd."
    },
    {
      title: "3. Enquiries Are Not Contracts",
      content: "Submitting an enquiry through our website does not constitute a binding contract. All property management and stays partnership agreements are subject to separate formal written contracts, property assessments, and necessary third-party permissions."
    },
    {
      title: "4. Limitation of Liability",
      content: "In no event shall Atera Industries Ltd or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website, including but not limited to loss of data, profit, or business interruption."
    },
    {
      title: "5. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of England & Wales. You irrevocably submit to the exclusive jurisdiction of the courts in that location."
    },
    {
      title: "6. Contact",
      content: null,
      custom: (
        <p className="text-[#6e6e73] text-[15px] leading-relaxed">
          For questions about these terms, contact us at{" "}
          <a href="mailto:info@aterastays.com" className="text-white hover:underline">info@aterastays.com</a>.<br />
          ATERA INDUSTRIES LTD — Registered in England &amp; Wales.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar onBookStay={() => setGuestModalOpen(true)} onLandlord={() => setLandlordModalOpen(true)} />

      <main className="flex-grow pt-28 pb-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <div className="mb-16">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6e6e73] uppercase mb-4">Legal</p>
            <h1 className="text-[48px] md:text-[56px] font-bold tracking-[-0.03em] text-white leading-[1.05]">
              Terms &amp; Conditions
            </h1>
          </div>

          <div className="flex flex-col gap-0">
            {sections.map(({ title, content, custom }, i) => (
              <div key={i} className="py-10 border-t border-[#1d1d1f]">
                <h2 className="text-[20px] font-semibold text-white tracking-tight mb-4">{title}</h2>
                {custom ?? <p className="text-[#6e6e73] text-[15px] leading-relaxed">{content}</p>}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <GuestEnquiryModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />
      <LandlordEnquiryModal open={landlordModalOpen} onClose={() => setLandlordModalOpen(false)} />
    </div>
  );
}
