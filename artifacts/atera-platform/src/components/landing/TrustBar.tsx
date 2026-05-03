export function TrustBar() {
  const stats = [
    { value: "100%", label: "Guaranteed Rent" },
    { value: "3–5yr", label: "Agreements" },
    { value: "£0", label: "Void Risk" },
    { value: "24/7", label: "Guest Support" },
  ];

  return (
    <section className="bg-white text-black border-y border-[#d2d2d7]">
      <div className="max-w-[1100px] mx-auto py-14 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className="reveal flex flex-col items-center text-center px-4 py-4 border-r border-[#d2d2d7] last:border-r-0"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-[44px] font-bold tracking-tight leading-none mb-2">{value}</span>
              <span className="text-[#6e6e73] text-[13px] font-semibold tracking-wide uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
