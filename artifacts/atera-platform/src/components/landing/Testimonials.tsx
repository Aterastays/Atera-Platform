export function Testimonials() {
  const testimonials = [
    {
      quote: "Atera Stays completely transformed how we manage our portfolio. The guaranteed rent gives us total peace of mind, and the property is kept in immaculate condition.",
      name: "Sarah Jenkins",
      role: "Portfolio Landlord"
    },
    {
      quote: "Our team stayed for six weeks during a major project. The accommodation was spotless, the wifi was fast, and the support was instant whenever we needed it.",
      name: "Mark T.",
      role: "Corporate Client"
    },
    {
      quote: "We switched to Atera for full management last year. They found a great tenant within a week and their communication is better than any agent we've used.",
      name: "David & Emma Reed",
      role: "Private Landlords"
    }
  ];

  return (
    <section className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col reveal" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} viewBox="0 0 24 24" className="w-5 h-5 text-gold fill-current">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="font-display text-lg text-[#333] leading-relaxed italic mb-8 flex-grow">
                "{t.quote}"
              </p>
              <div>
                <div className="font-body font-medium text-sm text-[#141414]">{t.name}</div>
                <div className="font-body text-xs text-gold-dark mt-1">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
