const BENEFITS = [
  { title: "Fixed income you can plan around", body: "Rent paid on the same date every month, occupied or not." },
  { title: "Zero management responsibilities", body: "We handle guests, cleaning, maintenance — everything." },
  { title: "Corporate guests only — no ASTs", body: "Professionals and contractors. No long-term tenancy agreements." },
  { title: "3 to 5 year agreements with a break clause", body: "Long-term security with the flexibility you need." },
];

export function BenefitsSection() {
  return (
    <section className="bg-[#f5f5f7] text-black py-32">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="reveal mb-16">
          <h2 className="text-[44px] font-bold tracking-[-0.03em] leading-[1.08] mb-4">
            What does that mean for you?
          </h2>
          <p className="text-[17px] text-[#6e6e73]">The practical benefits, plainly stated.</p>
        </div>

        <div className="flex flex-col gap-8 max-w-[640px]">
          {BENEFITS.map(({ title, body }, i) => (
            <div
              key={title}
              className="reveal flex items-start gap-6"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-6 h-[2px] bg-[#C9A84C] mt-[10px] shrink-0" />
              <div>
                <p className="text-[17px] font-semibold tracking-tight mb-1">{title}</p>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
