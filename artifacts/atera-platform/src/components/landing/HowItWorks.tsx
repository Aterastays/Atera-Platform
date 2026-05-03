export function HowItWorks() {
  const guestSteps = [
    { num: "01", text: "Submit your enquiry with desired dates and location." },
    { num: "02", text: "We confirm availability and send a secure booking link." },
    { num: "03", text: "Receive full check-in instructions 24 hours prior to arrival." },
    { num: "04", text: "Enjoy your stay with 24/7 support from our local team." }
  ];

  const landlordSteps = [
    { num: "01", text: "We assess your property to ensure it meets our standards." },
    { num: "02", text: "We provide a formal offer for guaranteed rent or management." },
    { num: "03", text: "Sign the agreement and we take over all operations." },
    { num: "04", text: "Receive consistent monthly payments with zero hassle." }
  ];

  return (
    <section id="how" className="section-cream relative text-[#141414]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 reveal">
          <div className="label-style text-gold-dark mb-4">THE PROCESS</div>
          <h1 className="font-display text-4xl md:text-5xl text-[#141414] mb-6">Simple From Start to Stay</h1>
          <div className="w-12 h-[1px] bg-gold-dark mx-auto"></div>
        </div>

        <div className="flex flex-col md:flex-row relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#C9A84C]/30 -translate-x-1/2"></div>
          
          {/* Guests */}
          <div className="w-full md:w-1/2 md:pr-16 mb-16 md:mb-0 reveal">
            <h3 className="font-body text-sm font-semibold tracking-widest uppercase text-gold-dark mb-8 text-center md:text-left">For Guests</h3>
            <div className="flex flex-col gap-8">
              {guestSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="font-display text-[64px] leading-none text-[#9A7A30] opacity-20">{step.num}</div>
                  <div className="font-body font-light text-[16px] text-[#363330] leading-relaxed">{step.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Landlords */}
          <div className="w-full md:w-1/2 md:pl-16 reveal" style={{ transitionDelay: '200ms' }}>
            <h3 className="font-body text-sm font-semibold tracking-widest uppercase text-gold-dark mb-8 text-center md:text-left">For Landlords</h3>
            <div className="flex flex-col gap-8">
              {landlordSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="font-display text-[64px] leading-none text-[#9A7A30] opacity-20">{step.num}</div>
                  <div className="font-body font-light text-[16px] text-[#363330] leading-relaxed">{step.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
