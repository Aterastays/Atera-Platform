const TESTIMONIALS = [
  {
    quote: "The rent arrives on exactly the same date every month. I have not had to deal with a single issue since signing.",
    name: "David M.",
    role: "Landlord, Manchester",
  },
  {
    quote: "They explained everything clearly. Complete peace of mind.",
    name: "Patricia L.",
    role: "Landlord, Leeds",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-black text-white py-32 border-t border-[#1d1d1f]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="reveal mb-16">
          <h2 className="text-[44px] font-bold tracking-[-0.03em] leading-[1.08]">
            What our landlords say.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TESTIMONIALS.map(({ quote, name, role }, i) => (
            <div
              key={name}
              className="reveal"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="border border-[#2c2c2e] p-8">
                <p className="text-[19px] font-normal leading-[1.65] text-[#e8e8ed] mb-8">
                  "{quote}"
                </p>
                <div>
                  <p className="text-[13px] font-semibold text-white tracking-tight">{name}</p>
                  <p className="text-[12px] text-[#636366] mt-0.5">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
