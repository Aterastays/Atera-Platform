import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black border-t border-[rgba(201,168,76,0.3)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <img src="/atera-logo.svg" alt="Atera Stays" className="h-8" />
              <span className="font-display text-xl text-gold">ATERA Stays</span>
            </div>
            <p className="font-body text-[#8C8880] font-light text-sm max-w-sm mb-6 leading-relaxed">
              Premium short-term stays and professional property management. Guaranteed rent for landlords. Corporate and contractor accommodation across England.
            </p>
            <div className="text-xs text-[#5C5854] flex flex-col gap-1">
              <p>Member of The Property Ombudsman.</p>
              <p>ATERA INDUSTRIES LTD — Registered in England & Wales.</p>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-body text-off-white font-medium text-sm tracking-widest uppercase mb-6">Services</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/#services" className="font-body text-sm text-[#8C8880] hover:text-gold transition-colors">Stays Partnership</Link></li>
              <li><Link href="/#management" className="font-body text-sm text-[#8C8880] hover:text-gold transition-colors">Property Management</Link></li>
              <li><Link href="/#properties" className="font-body text-sm text-[#8C8880] hover:text-gold transition-colors">Browse Stays</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-body text-off-white font-medium text-sm tracking-widest uppercase mb-6">Company</h4>
            <ul className="flex flex-col gap-4 mb-6">
              <li><Link href="/privacy" className="font-body text-sm text-[#8C8880] hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="font-body text-sm text-[#8C8880] hover:text-gold transition-colors">Terms & Conditions</Link></li>
            </ul>
            <div className="text-xs text-[#5C5854]">
              ICO Registered — Data Controller
            </div>
          </div>
        </div>

        <div className="border-t border-[#1A1920] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C5854]">
          <div>© 2025 ATERA INDUSTRIES LTD. All rights reserved.</div>
          <div>Not financial or legal advice.</div>
        </div>
      </div>
    </footer>
  );
}
