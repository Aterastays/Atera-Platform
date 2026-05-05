import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#1d1d1f] text-[#6e6e73] py-10 text-[12px]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2">
              <img src="/atera-logo.png" alt="Atera Stays" className="h-8 w-auto" />
              <span className="text-white font-semibold text-[13px] tracking-tight ml-1">Atera Stays</span>
            </div>
            <p className="text-[13px] leading-relaxed">
              Premium short-term stays and professional property management. Guaranteed rent for landlords. Corporate accommodation across England.
            </p>
            <p className="text-[11px] text-[#48484a]">ATERA INDUSTRIES LTD — Registered in England &amp; Wales.</p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="text-white font-semibold text-[11px] tracking-widest uppercase mb-4">Services</p>
              <ul className="flex flex-col gap-3">
                <li><a href="#landlords" className="hover:text-white transition-colors duration-200">Stays Partnership</a></li>
                <li><a href="#guests" className="hover:text-white transition-colors duration-200">Corporate Stays</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-[11px] tracking-widest uppercase mb-4">Company</p>
              <ul className="flex flex-col gap-3">
                <li><Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors duration-200">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1d1d1f] pt-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <p>Copyright © {new Date().getFullYear()} Atera Industries Ltd. All rights reserved.</p>
          <p>Atera Stays is a trading name of Atera Industries Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
