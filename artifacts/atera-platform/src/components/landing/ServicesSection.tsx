import { Home, FileText } from "lucide-react";

interface ServicesProps {
  onStays: () => void;
  onManagement: () => void;
}

export function ServicesSection({ onStays, onManagement }: ServicesProps) {
  return (
    <section id="services" className="section-surface relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 reveal">
          <div className="label-style text-gold mb-4">OUR SERVICES</div>
          <h1 className="font-display text-4xl md:text-5xl text-off-white mb-6">Two Ways We Work</h1>
          <div className="gold-rule"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 reveal" style={{ transitionDelay: '200ms' }}>
          {/* Card 1: Stays Partnership */}
          <div className="bg-[#080709] border border-[rgba(201,168,76,0.15)] p-6 md:p-12 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
            <Home className="w-8 h-8 text-gold mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="font-display text-3xl text-off-white mb-4">Stays Partnership</h2>
            <p className="font-body text-[#8C8880] mb-8 font-light leading-relaxed flex-grow">
              We become your company tenant. You receive guaranteed rent on the same day every month, while we handle all management, minor maintenance, and guest communication.
            </p>
            <ul className="flex flex-col gap-3 mb-10">
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Guaranteed fixed monthly rent
              </li>
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Zero void periods or arrears risk
              </li>
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Minor maintenance covered by us
              </li>
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Long-term agreements (3–5 years)
              </li>
            </ul>
            <button className="btn-outline w-full justify-center" onClick={onStays} data-testid="btn-service-stays">
              Enquire — Stays Partnership
            </button>
          </div>

          {/* Card 2: Property Management */}
          <div className="bg-[#080709] border border-[rgba(201,168,76,0.15)] p-6 md:p-12 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
            <FileText className="w-8 h-8 text-gold mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="font-display text-3xl text-off-white mb-4">Full Property Management</h2>
            <p className="font-body text-[#8C8880] mb-8 font-light leading-relaxed flex-grow">
              Traditional management elevated. We find high-quality professional tenants, handle all compliance, and maintain your asset to the highest standard.
            </p>
            <ul className="flex flex-col gap-3 mb-10">
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Comprehensive tenant referencing
              </li>
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Full compliance & safety management
              </li>
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Quarterly property inspections
              </li>
              <li className="flex items-start gap-3 text-off-white font-light text-[15px]">
                <span className="text-gold font-bold">—</span> Transparent monthly reporting
              </li>
            </ul>
            <button className="btn-outline w-full justify-center" onClick={onManagement} data-testid="btn-service-management">
              Enquire — Property Management
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
