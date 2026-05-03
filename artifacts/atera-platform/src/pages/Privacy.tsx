import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { GuestEnquiryModal } from "@/components/modals/GuestEnquiryModal";
import { LandlordEnquiryModal } from "@/components/modals/LandlordEnquiryModal";

export function Privacy() {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [landlordModalOpen, setLandlordModalOpen] = useState(false);

  const sections = [
    {
      title: "1. Data We Collect",
      content: (
        <ul className="flex flex-col gap-2 text-[#6e6e73] text-[15px] leading-relaxed list-none">
          {[
            "Identity Data: Name, date of birth, copies of ID.",
            "Contact Data: Email address, telephone numbers, billing address.",
            "Financial Data: Bank account details (for rent remittances).",
            "Property Data: Property addresses, ownership documents, compliance certificates.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#6e6e73] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "2. How We Use It",
      content: (
        <ul className="flex flex-col gap-2 text-[#6e6e73] text-[15px] leading-relaxed list-none">
          {[
            "To register you as a new client or guest.",
            "To process and deliver your booking or property management agreement.",
            "To manage payments, fees and charges.",
            "To notify you about changes to our terms or privacy policy.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#6e6e73] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "3. Your Rights (GDPR)",
      content: (
        <ul className="flex flex-col gap-2 text-[#6e6e73] text-[15px] leading-relaxed list-none">
          {[
            "Right of access — You can request copies of your personal information.",
            "Right to rectification — You can ask us to correct inaccurate data.",
            "Right to erasure — You can request deletion of your data in certain circumstances.",
            "Right to restrict processing — You can ask us to limit how we use your data.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#6e6e73] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "4. Cookies",
      content: (
        <p className="text-[#6e6e73] text-[15px] leading-relaxed">
          Our website uses cookies to distinguish you from other users and improve your experience. You can accept or decline non-essential cookies via the banner shown on your first visit.
        </p>
      )
    },
    {
      title: "5. Contact",
      content: (
        <p className="text-[#6e6e73] text-[15px] leading-relaxed">
          ATERA INDUSTRIES LTD — Registered in England &amp; Wales.<br />
          For any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:info@aterastays.com" className="text-white hover:underline">info@aterastays.com</a>.
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
            <h1 className="text-[48px] md:text-[56px] font-bold tracking-[-0.03em] text-white leading-[1.05] mb-4">
              Privacy Policy
            </h1>
            <p className="text-[#6e6e73] text-[15px]">Last updated: 1 January 2025</p>
          </div>

          <div className="flex flex-col gap-0">
            {sections.map(({ title, content }, i) => (
              <div key={i} className="py-10 border-t border-[#1d1d1f]">
                <h2 className="text-[20px] font-semibold text-white tracking-tight mb-4">{title}</h2>
                {content}
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
