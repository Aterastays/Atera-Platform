export function StandardSection() {
  return (
    <section className="bg-white text-black py-32 border-t border-[#d2d2d7]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="reveal text-center mb-20">
          <h2 className="text-[44px] font-bold tracking-[-0.03em] leading-[1.08] mb-4">
            One standard. Two services.
          </h2>
          <p className="text-[19px] text-[#6e6e73] font-normal max-w-[520px] mx-auto">
            Whether you want guaranteed rent or full management — the level of professionalism never changes.
          </p>
        </div>

        <div className="grid grid-cols-2 max-w-[560px] mx-auto">
          <div
            className="reveal flex flex-col items-center text-center px-8 py-6 border-r border-[#d2d2d7]"
          >
            <span className="text-[56px] font-bold tracking-tight leading-none mb-3">100%</span>
            <span className="text-[#6e6e73] text-[13px] font-semibold tracking-wide uppercase">Every property fully compliance checked</span>
          </div>
          <div
            className="reveal flex flex-col items-center text-center px-8 py-6"
            style={{ transitionDelay: "120ms" }}
          >
            <span className="text-[56px] font-bold tracking-tight leading-none mb-3">48hrs</span>
            <span className="text-[#6e6e73] text-[13px] font-semibold tracking-wide uppercase">Average response time to new enquiries</span>
          </div>
        </div>
      </div>
    </section>
  );
}
