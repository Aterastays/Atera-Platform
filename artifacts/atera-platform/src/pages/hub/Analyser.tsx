import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function HubAnalyser() {
  const [showInfo, setShowInfo] = useState(true);
  
  const [inputs, setInputs] = useState({
    reference: "",
    postcode: "",
    monthlyRent: "",
    bills: "250",
    platformFee: "15",
    cleaning: "45",
    turnsPerMonth: "4",
    otherCosts: "50",
    setupCost: "2500",
    nightlyRate: "",
    targetOccupancy: "75",
    daysPerMonth: "30",
    
    marketADR: "",
    marketOccupancy: "",
    revPAR: "",
    marketScore: "",
    seasonalityRisk: "Medium" as "Low" | "Medium" | "High",
    demandDriver: "Mixed" as "Corporate" | "Contractor" | "Leisure" | "Mixed" | "Relocation"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const results = useMemo(() => {
    const monthlyRent = parseFloat(inputs.monthlyRent) || 0;
    const nightlyRate = parseFloat(inputs.nightlyRate) || 0;
    const targetOccupancy = parseFloat(inputs.targetOccupancy) || 0;
    const daysPerMonth = parseFloat(inputs.daysPerMonth) || 30;
    
    const bills = parseFloat(inputs.bills) || 0;
    const platformFee = parseFloat(inputs.platformFee) || 0;
    const cleaning = parseFloat(inputs.cleaning) || 0;
    const turnsPerMonth = parseFloat(inputs.turnsPerMonth) || 0;
    const otherCosts = parseFloat(inputs.otherCosts) || 0;
    const setupCost = parseFloat(inputs.setupCost) || 0;

    const marketADR = parseFloat(inputs.marketADR) || 0;
    const marketScore = parseFloat(inputs.marketScore) || 0;

    const grossRevenue = (nightlyRate * (targetOccupancy / 100) * daysPerMonth);
    const totalCosts = bills + (grossRevenue * (platformFee / 100)) + (cleaning * turnsPerMonth) + otherCosts;
    const netProfit = grossRevenue - totalCosts - monthlyRent;
    const breakEvenOcc = (nightlyRate * daysPerMonth) > 0 ? ((totalCosts + monthlyRent) / (nightlyRate * daysPerMonth)) * 100 : 0;
    const annualProfit = netProfit * 12;
    const setupPayback = (setupCost > 0 && netProfit > 0) ? setupCost / netProfit : 0;

    // Bear
    const bearNightly = nightlyRate * 0.9;
    const bearOcc = targetOccupancy * 0.9;
    const bearGross = (bearNightly * (bearOcc / 100) * daysPerMonth);
    const bearCosts = bills + (bearGross * (platformFee / 100)) + (cleaning * turnsPerMonth) + otherCosts;
    const bearNet = bearGross - bearCosts - monthlyRent;

    // Bull
    const bullNightly = nightlyRate * 1.05;
    const bullOcc = targetOccupancy * 1.05;
    const bullGross = (bullNightly * (bullOcc / 100) * daysPerMonth);
    const bullCosts = bills + (bullGross * (platformFee / 100)) + (cleaning * turnsPerMonth) + otherCosts;
    const bullNet = bullGross - bullCosts - monthlyRent;

    // Score
    const scProfit = monthlyRent > 0 ? Math.min(25, (netProfit / monthlyRent) * 100 * 0.25) : 0;
    const scBear = bearNet > 0 ? 20 : bearNet > -100 ? 10 : 0;
    const scBreakEven = targetOccupancy > 0 ? Math.max(0, Math.min(15, ((targetOccupancy - breakEvenOcc) / targetOccupancy) * 50)) : 0;
    const scRateVsADR = marketADR > 0 ? Math.min(15, (1 - (nightlyRate / marketADR)) * 30 + 15) : 0;
    const driverScore = { "Corporate": 3, "Contractor": 2, "Leisure": 0, "Mixed": 1, "Relocation": 2 }[inputs.demandDriver] || 0;
    const scDemand = Math.min(15, (marketScore / 100) * 12 + driverScore);
    const scPayback = setupPayback <= 0 ? 0 : setupPayback <= 6 ? 10 : setupPayback <= 12 ? 7 : setupPayback <= 18 ? 4 : 0;
    const scSeasonality = { "Low": 0, "Medium": -3, "High": -7 }[inputs.seasonalityRisk] || 0;

    let totalScore = scProfit + scBear + scBreakEven + scRateVsADR + scDemand + scPayback + scSeasonality;
    totalScore = Math.max(0, Math.min(100, totalScore));

    let grade = "F";
    if (totalScore >= 85) grade = "A+";
    else if (totalScore >= 75) grade = "A";
    else if (totalScore >= 65) grade = "B";
    else if (totalScore >= 50) grade = "C";
    else if (totalScore >= 35) grade = "D";

    let verdict = "Fail";
    let verdictColor = "text-error";
    if (netProfit > 200 && bearNet > 0) {
      verdict = "Pass";
      verdictColor = "text-success";
    } else if (netProfit > 0 && bearNet <= 0) {
      verdict = "Warn";
      verdictColor = "text-warning";
    }

    return {
      grossRevenue, totalCosts, netProfit, breakEvenOcc, annualProfit, setupPayback,
      bearNet, bullNet, totalScore, grade, verdict, verdictColor,
      details: { scProfit, scBear, scBreakEven, scRateVsADR, scDemand, scPayback, scSeasonality }
    };
  }, [inputs]);

  const [savingToCRM, setSavingToCRM] = useState(false);
  const [savedToCRM, setSavedToCRM] = useState(false);

  const saveToCRM = async () => {
    if (!inputs.reference && !inputs.postcode) {
      alert("Please enter at least a Reference or Postcode before saving.");
      return;
    }
    setSavingToCRM(true);
    await supabase.from("leads").insert([{
      name: inputs.reference || `Deal — ${inputs.postcode}`,
      address: inputs.postcode || null,
      postcode: inputs.postcode || null,
      service_type: "stays",
      pipeline_status: "analysing",
      rent_amount: parseFloat(inputs.monthlyRent) || null,
      notes: `Atera Score: ${Math.round(results.totalScore)}/100 (${results.grade}) | Net/mo: £${Math.round(results.netProfit)} | Verdict: ${results.verdict}`,
      deal_data: {
        ...inputs,
        score: results.totalScore,
        grade: results.grade,
        verdict: results.verdict,
        netProfit: results.netProfit,
        annualProfit: results.annualProfit,
        breakEvenOcc: results.breakEvenOcc,
      },
    }]);
    setSavingToCRM(false);
    setSavedToCRM(true);
    setTimeout(() => setSavedToCRM(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <h2 className="font-display text-3xl text-off-white">Deal Analyser</h2>
      </div>

      {showInfo && (
        <div className="bg-[#131217] border-l-4 border-gold p-4 flex justify-between items-start">
          <p className="text-sm text-grey-1">Enter property details and estimated costs to calculate the viability of a Stays Partnership deal.</p>
          <button onClick={() => setShowInfo(false)} className="text-grey-2 hover:text-white">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-[#0D0C0F] border border-[rgba(201,168,76,0.1)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-body font-medium text-off-white">Property & Costs</h3>
            <button onClick={() => setInputs({
              reference: "", postcode: "", monthlyRent: "", bills: "250", platformFee: "15", cleaning: "45", turnsPerMonth: "4", otherCosts: "50", setupCost: "2500", nightlyRate: "", targetOccupancy: "75", daysPerMonth: "30", marketADR: "", marketOccupancy: "", revPAR: "", marketScore: "", seasonalityRisk: "Medium", demandDriver: "Mixed"
            })} className="text-xs text-grey-1 hover:text-white transition-colors">Reset</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block label-style text-grey-1 mb-1">Reference</label>
              <input type="text" name="reference" value={inputs.reference} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Postcode</label>
              <input type="text" name="postcode" value={inputs.postcode} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-gold mb-1">Monthly Rent £ *</label>
              <input type="number" name="monthlyRent" value={inputs.monthlyRent} onChange={handleInputChange} className="w-full bg-[#131217] border border-gold/50 text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-gold mb-1">Nightly Rate £ *</label>
              <input type="number" name="nightlyRate" value={inputs.nightlyRate} onChange={handleInputChange} className="w-full bg-[#131217] border border-gold/50 text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-gold mb-1">Target Occ % *</label>
              <input type="number" name="targetOccupancy" value={inputs.targetOccupancy} onChange={handleInputChange} className="w-full bg-[#131217] border border-gold/50 text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Days / Month</label>
              <input type="number" name="daysPerMonth" value={inputs.daysPerMonth} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Bills £</label>
              <input type="number" name="bills" value={inputs.bills} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Platform Fee %</label>
              <input type="number" name="platformFee" value={inputs.platformFee} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Cleaning £</label>
              <input type="number" name="cleaning" value={inputs.cleaning} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Turns / Month</label>
              <input type="number" name="turnsPerMonth" value={inputs.turnsPerMonth} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Other Costs £</label>
              <input type="number" name="otherCosts" value={inputs.otherCosts} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Setup Cost £</label>
              <input type="number" name="setupCost" value={inputs.setupCost} onChange={handleInputChange} className="w-full bg-[#131217] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
            <h3 className="font-body font-medium text-off-white mb-6">AirDNA Market Intelligence</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block label-style text-grey-1 mb-1">Market ADR £</label>
                <input type="number" name="marketADR" value={inputs.marketADR} onChange={handleInputChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Market Occ %</label>
                <input type="number" name="marketOccupancy" value={inputs.marketOccupancy} onChange={handleInputChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">RevPAR £</label>
                <input type="number" name="revPAR" value={inputs.revPAR} onChange={handleInputChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Market Score 0-100</label>
                <input type="number" name="marketScore" value={inputs.marketScore} onChange={handleInputChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Seasonality Risk</label>
                <select name="seasonalityRisk" value={inputs.seasonalityRisk} onChange={handleInputChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Demand Driver</label>
                <select name="demandDriver" value={inputs.demandDriver} onChange={handleInputChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>Corporate</option>
                  <option>Contractor</option>
                  <option>Leisure</option>
                  <option>Mixed</option>
                  <option>Relocation</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`p-4 border text-center ${results.verdict === 'Pass' ? 'border-success/30 bg-success/10 text-success' : results.verdict === 'Warn' ? 'border-warning/30 bg-warning/10 text-warning' : 'border-error/30 bg-error/10 text-error'}`}>
            <div className="label-style mb-1">VERDICT</div>
            <div className="font-display text-3xl">{results.verdict}</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveToCRM}
              disabled={savingToCRM}
              className="btn-outline flex-1 justify-center disabled:opacity-50"
            >
              {savingToCRM ? "Saving…" : "Save to CRM"}
            </button>
            {savedToCRM && <span className="text-success text-sm">Saved to CRM!</span>}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col items-center text-center">
          <div className="label-style text-grey-1 mb-2">Gross Rev</div>
          <div className="font-display text-2xl text-off-white">£{results.grossRevenue.toFixed(0)}</div>
        </div>
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col items-center text-center">
          <div className="label-style text-grey-1 mb-2">Total Costs</div>
          <div className="font-display text-2xl text-off-white">£{results.totalCosts.toFixed(0)}</div>
        </div>
        <div className={`bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col items-center text-center ${results.netProfit > 200 ? 'text-success' : results.netProfit > 0 ? 'text-warning' : 'text-error'}`}>
          <div className="label-style text-current opacity-80 mb-2">Net Profit</div>
          <div className="font-display text-2xl">£{results.netProfit.toFixed(0)}</div>
        </div>
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col items-center text-center">
          <div className="label-style text-grey-1 mb-2">Break-Even Occ</div>
          <div className="font-display text-2xl text-off-white">{results.breakEvenOcc.toFixed(0)}%</div>
        </div>
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col items-center text-center">
          <div className="label-style text-grey-1 mb-2">Annual Profit</div>
          <div className="font-display text-2xl text-gold">£{results.annualProfit.toFixed(0)}</div>
        </div>
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col items-center text-center">
          <div className="label-style text-grey-1 mb-2">Setup Payback</div>
          <div className="font-display text-2xl text-off-white">{results.setupPayback > 0 ? `${results.setupPayback.toFixed(1)}m` : '-'}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 text-center">
          <h4 className="font-body font-medium text-off-white mb-2">Bear Case</h4>
          <p className="text-xs text-grey-1 mb-4">-10% Rate, -10% Occ</p>
          <div className={`font-display text-3xl ${results.bearNet > 0 ? 'text-success' : 'text-error'}`}>£{results.bearNet.toFixed(0)}</div>
        </div>
        <div className="bg-[#0D0C0F] border border-gold/50 p-6 text-center shadow-[0_0_15px_rgba(201,168,76,0.15)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0D0C0F] px-2 text-[10px] uppercase tracking-widest text-gold">Base Case</div>
          <h4 className="font-body font-medium text-off-white mb-2 mt-2">Target</h4>
          <p className="text-xs text-grey-1 mb-4">Inputted Values</p>
          <div className={`font-display text-4xl ${results.netProfit > 200 ? 'text-success' : results.netProfit > 0 ? 'text-warning' : 'text-error'}`}>£{results.netProfit.toFixed(0)}</div>
        </div>
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 text-center">
          <h4 className="font-body font-medium text-off-white mb-2">Bull Case</h4>
          <p className="text-xs text-grey-1 mb-4">+5% Rate, +5% Occ</p>
          <div className={`font-display text-3xl ${results.bullNet > 0 ? 'text-success' : 'text-error'}`}>£{results.bullNet.toFixed(0)}</div>
        </div>
      </div>

      {/* Atera Score */}
      <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 md:p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full border-[8px] border-[rgba(201,168,76,0.1)] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[8px] border-transparent" style={{ borderTopColor: '#C9A84C', borderRightColor: results.totalScore > 25 ? '#C9A84C' : 'transparent', borderBottomColor: results.totalScore > 50 ? '#C9A84C' : 'transparent', borderLeftColor: results.totalScore > 75 ? '#C9A84C' : 'transparent', transform: `rotate(${results.totalScore * 3.6}deg)`, transition: 'all 1s ease-out' }}></div>
            <div className="flex flex-col items-center">
              <span className={`font-display text-5xl leading-none ${results.totalScore >= 75 ? 'text-success' : results.totalScore >= 50 ? 'text-gold' : 'text-error'}`}>{results.grade}</span>
              <span className="text-xs text-grey-1">{results.totalScore.toFixed(0)} / 100</span>
            </div>
          </div>
          <div className="mt-4 font-body font-medium text-off-white">Atera Score</div>
        </div>
        
        <div className="flex-1 w-full grid md:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { label: "Profitability", value: results.details.scProfit, max: 25 },
            { label: "Bear Case Safety", value: results.details.scBear, max: 20 },
            { label: "Break-Even Margin", value: results.details.scBreakEven, max: 15 },
            { label: "Rate Competitiveness", value: results.details.scRateVsADR, max: 15 },
            { label: "Market Demand", value: results.details.scDemand, max: 15 },
            { label: "Setup Payback", value: results.details.scPayback, max: 10 }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-1 w-full">
              <div className="flex justify-between text-xs">
                <span className="text-grey-1">{item.label}</span>
                <span className="text-off-white">{item.value.toFixed(1)} / {item.max}</span>
              </div>
              <div className="h-1.5 w-full bg-[#0D0C0F] rounded-full overflow-hidden">
                <div className="h-full bg-gold transition-all duration-1000 ease-out" style={{ width: `${(item.value / item.max) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
