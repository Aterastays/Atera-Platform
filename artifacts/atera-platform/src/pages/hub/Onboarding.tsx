export function HubOnboarding() {
  const steps = [
    {
      title: "Understand the Two Models",
      content: "Atera offers two core services. The Stays Partnership is a guaranteed rent model where we become the company tenant and run short-lets. Full Property Management is a traditional AST management service for long-term tenants at a fixed percentage fee."
    },
    {
      title: "The Permissions Checklist (Stays)",
      content: "Before taking on a Stays property, you must confirm the landlord has obtained written permission from their Freeholder, Mortgage Lender, and Insurer to conduct short-term lets. We cannot operate without these."
    },
    {
      title: "Using the Hub Daily",
      content: "Your morning routine should start with the Dashboard. Check your Pending Tasks, review the Enquiry Inbox for new leads, and action any Follow-Ups in the CRM that are due today."
    },
    {
      title: "Analysing a Deal with the Deal Analyser",
      content: "Use the Deal Analyser for every potential Stays property. Enter the landlord's required rent, setup costs, and cleaning fees. Compare this against AirDNA market data to get an Atera Score. Only proceed with B grade or above."
    },
    {
      title: "Generating Contracts",
      content: "Once a deal is agreed verbally, use the Contracts page to generate the correct PDF agreement. Ensure all company details and landlord details are entered accurately. Send via email for independent review."
    },
    {
      title: "Daily Operating Routine",
      content: "1. Inbox Zero: clear new enquiries. 2. Lead Follow-ups: call all landlords due today. 3. Guest Comms: ensure all upcoming bookings have check-in details. 4. KPIs: log your daily calls and offers in Settings."
    },
    {
      title: "Adding Live Properties",
      content: "When a property is ready for guests, add it via the Properties page and set status to 'Live'. This makes it appear on the public Atera Stays website for direct guest enquiries."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-2 border-b border-gold/20 pb-6">
        <h2 className="font-display text-4xl text-off-white">Partner Onboarding</h2>
        <p className="text-grey-1">A step-by-step guide to operating the Atera Stays model.</p>
      </div>

      <div className="flex flex-col gap-6">
        {steps.map((step, i) => (
          <div key={i} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="font-display text-[80px] leading-none text-gold opacity-10 absolute -left-2 -bottom-4 pointer-events-none select-none">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="font-display text-4xl text-gold/80 sm:w-20 shrink-0 z-10">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="flex flex-col gap-2 z-10">
              <h3 className="font-body font-medium text-lg text-off-white">{step.title}</h3>
              <p className="font-body font-light text-sm text-grey-1 leading-relaxed">
                {step.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
