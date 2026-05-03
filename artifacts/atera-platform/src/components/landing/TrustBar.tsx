export function TrustBar() {
  const stats = [
    { value: "100%", label: "Guaranteed Rent" },
    { value: "3–5yr", label: "Agreements" },
    { value: "£0", label: "Void Risk" },
    { value: "24/7", label: "Guest Support" },
    { value: "1", label: "Point of Contact" }
  ];

  return (
    <section className="bg-[#0D0C0F] border-y border-[#C9A84C] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center md:divide-x md:divide-[#C9A84C]/20 gap-y-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center w-1/2 md:w-full px-4 reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="font-display text-[42px] text-gold font-semibold leading-none mb-1">{stat.value}</div>
              <div className="font-body text-[11px] font-medium text-[#8C8880] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
