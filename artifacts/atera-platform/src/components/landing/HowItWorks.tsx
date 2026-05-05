export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Property Valuation",
      body: "We view your property and provide a guaranteed rent offer within 24 hours. No hidden fees, no obligation.",
    },
    {
      n: "02",
      title: "Sign Agreement",
      body: "We sign a 3–5 year company let agreement, becoming your sole tenant and taking on all management.",
    },
    {
      n: "03",
      title: "Receive Rent",
      body: "Fixed rent hits your account on the same day every month — regardless of occupancy.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-white text-black py-32">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="reveal text-center mb-24">
          <h2 className="text-[52px] font-bold tracking-[-0.03em] mb-4">How it works.</h2>
          <p className="text-[19px] text-[#6e6e73] font-normal">Simple, transparent, and completely hands-off.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map(({ n, title, body }, i) => (
            <div
              key={n}
              className="reveal flex flex-col items-center text-center"
              style={{ transitionDelay: `${(i + 1) * 120}ms` }}
            >
              <div className="text-[100px] font-bold text-[#f5f5f7] tracking-tighter leading-none mb-3 select-none">
                {n}
              </div>
              <h3 className="text-[22px] font-bold tracking-tight mb-3">{title}</h3>
              <p className="text-[15px] text-[#6e6e73] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
