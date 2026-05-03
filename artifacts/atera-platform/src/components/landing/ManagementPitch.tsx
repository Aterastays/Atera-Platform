import { Users, Shield, Wrench, BarChart3 } from "lucide-react";

export function ManagementPitch({ onManagement }: { onManagement: () => void }) {
  return (
    <section id="management" className="section-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column */}
          <div className="w-full lg:w-[55%] reveal">
            <div className="label-style text-gold mb-4">ATERA MANAGEMENT</div>
            <h1 className="font-display text-4xl md:text-5xl text-off-white mb-6">Professional Management for Your Portfolio.</h1>
            <div className="w-12 h-[1px] bg-gold mb-8"></div>
            
            <p className="font-body text-[#8C8880] mb-8 font-light leading-relaxed text-lg">
              For landlords who prefer traditional tenancies but demand exceptional service. We handle every aspect of property management with precision, ensuring your asset is protected and yielding optimal returns.
            </p>

            <ul className="flex flex-col gap-4 mb-10">
              <li className="flex items-start gap-3 text-off-white font-light">
                <span className="text-gold font-bold mt-1">—</span> Professional tenant sourcing and rigorous referencing
              </li>
              <li className="flex items-start gap-3 text-off-white font-light">
                <span className="text-gold font-bold mt-1">—</span> Full compliance management (Gas, Electrical, EPC)
              </li>
              <li className="flex items-start gap-3 text-off-white font-light">
                <span className="text-gold font-bold mt-1">—</span> Deposit registration and dispute resolution
              </li>
              <li className="flex items-start gap-3 text-off-white font-light">
                <span className="text-gold font-bold mt-1">—</span> Proactive maintenance coordination
              </li>
              <li className="flex items-start gap-3 text-off-white font-light">
                <span className="text-gold font-bold mt-1">—</span> Rent collection and arrears management
              </li>
              <li className="flex items-start gap-3 text-off-white font-light">
                <span className="text-gold font-bold mt-1">—</span> Detailed quarterly property inspections
              </li>
            </ul>

            <button className="btn-gold" onClick={onManagement} data-testid="btn-management-pitch">
              Enquire About Management
            </button>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[45%] grid grid-cols-1 sm:grid-cols-2 gap-4 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="bg-[#131217] p-6 border border-[rgba(201,168,76,0.1)]">
              <Users className="w-5 h-5 text-gold mb-4" />
              <h3 className="font-body font-medium text-[15px] text-off-white mb-2">Tenant Management</h3>
              <p className="font-body font-light text-[14px] text-[#8C8880] leading-relaxed">We source reliable professionals, handling all viewings, referencing, and move-in administration.</p>
            </div>
            
            <div className="bg-[#131217] p-6 border border-[rgba(201,168,76,0.1)]">
              <Shield className="w-5 h-5 text-gold mb-4" />
              <h3 className="font-body font-medium text-[15px] text-off-white mb-2">Compliance</h3>
              <p className="font-body font-light text-[14px] text-[#8C8880] leading-relaxed">Stay ahead of legislation. We track and renew all necessary safety certificates automatically.</p>
            </div>

            <div className="bg-[#131217] p-6 border border-[rgba(201,168,76,0.1)]">
              <Wrench className="w-5 h-5 text-gold mb-4" />
              <h3 className="font-body font-medium text-[15px] text-off-white mb-2">Maintenance</h3>
              <p className="font-body font-light text-[14px] text-[#8C8880] leading-relaxed">24/7 issue reporting and resolution using our trusted network of vetted local contractors.</p>
            </div>

            <div className="bg-[#131217] p-6 border border-[rgba(201,168,76,0.1)]">
              <BarChart3 className="w-5 h-5 text-gold mb-4" />
              <h3 className="font-body font-medium text-[15px] text-off-white mb-2">Reporting</h3>
              <p className="font-body font-light text-[14px] text-[#8C8880] leading-relaxed">Clear, transparent monthly financial statements and detailed quarterly inspection reports.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
