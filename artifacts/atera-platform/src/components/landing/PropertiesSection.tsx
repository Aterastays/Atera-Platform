import { useEffect, useState } from "react";
import { BedDouble, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PropertiesSection({ onBookStay }: { onBookStay: () => void }) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      const { data } = await supabase
        .from("public_properties")
        .select("id, name, postcode, beds, photos")
        .order("id", { ascending: false })
        .limit(3);
      if (data) setProperties(data);
      setLoading(false);
    }
    fetchProperties();
  }, []);

  return (
    <section id="properties" className="section-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 reveal">
          <div>
            <div className="label-style text-gold mb-4">OUR PORTFOLIO</div>
            <h2 className="font-display text-4xl md:text-5xl text-off-white">Featured Properties</h2>
          </div>
          <button className="btn-outline" onClick={onBookStay}>View All Stays</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="h-[240px] w-full skeleton rounded-sm"></div>
                <div className="h-6 w-3/4 skeleton rounded-sm"></div>
                <div className="h-4 w-1/2 skeleton rounded-sm"></div>
              </div>
            ))
          ) : properties.length > 0 ? (
            properties.map((p, i) => (
              <div key={p.id} className="group cursor-pointer reveal flex flex-col bg-[#131217] border border-[rgba(201,168,76,0.1)] hover:border-gold/30 transition-colors" style={{ transitionDelay: `${i * 100}ms` }} onClick={onBookStay}>
                <div className="relative h-[240px] overflow-hidden bg-black">
                  {p.photos && p.photos[0] ? (
                    <img src={p.photos[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,168,76,0.03)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                      <span className="font-display text-gold/30 text-xl tracking-widest">ATERA STAYS</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 border border-gold text-gold px-4 py-2 font-medium text-sm">
                      <Clock className="w-4 h-4" /> Enquire Now
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="label-style text-gold">{p.postcode}</div>
                    <div className="flex items-center gap-1 text-grey-1 text-sm"><BedDouble className="w-4 h-4" /> {p.beds}</div>
                  </div>
                  <h3 className="font-body text-lg text-off-white font-medium mb-4">{p.name}</h3>
                </div>
              </div>
            ))
          ) : (
            Array(3).fill(0).map((_, i) => (
              <div key={`placeholder-${i}`} className="group cursor-pointer reveal flex flex-col bg-[#131217] border border-[rgba(201,168,76,0.1)] hover:border-gold/30 transition-colors" style={{ transitionDelay: `${i * 100}ms` }} onClick={onBookStay}>
                <div className="relative h-[240px] overflow-hidden bg-black flex items-center justify-center">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,168,76,0.03)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                   <span className="font-display text-gold/30 text-xl tracking-widest">ATERA STAYS</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="label-style text-gold">COMING SOON</div>
                    <div className="flex items-center gap-1 text-grey-1 text-sm"><BedDouble className="w-4 h-4" /> —</div>
                  </div>
                  <h3 className="font-body text-lg text-off-white font-medium mb-4">Premium Property</h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
