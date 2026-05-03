import { useState } from "react";
import { Download } from "lucide-react";
import { generateStaysAgreement, generateManagementAgreement } from "@/lib/pdfGenerator";

export function HubContracts() {
  const [activeTab, setActiveTab] = useState<"stays" | "management">("stays");

  const [staysData, setStaysData] = useState({
    landlordName: "", landlordAddress: "", propertyAddress: "", propertyType: "Flat", bedrooms: "1",
    freeholder: "Confirmed", mortgageLender: "Confirmed", insurer: "Confirmed",
    monthlyRent: "", paymentDay: "1st", deposit: "", minorRepairsCap: "100",
    startDate: "", term: "3", breakNotice: "3", breakAfter: "12",
    directorName: "Company Director", companyNumber: "12345678"
  });

  const [mgmtData, setMgmtData] = useState({
    landlordName: "", landlordAddress: "", propertyAddress: "", propertyType: "Flat", bedrooms: "1",
    managementFee: "12", startDate: "", term: "12", minorRepairsCap: "200", remittanceDays: "5",
    directorName: "Company Director", companyNumber: "12345678"
  });

  const handleStaysChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStaysData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMgmtChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMgmtData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const downloadStays = () => {
    generateStaysAgreement(staysData);
  };

  const downloadMgmt = () => {
    generateManagementAgreement(mgmtData);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-end">
        <h2 className="font-display text-3xl text-off-white">Contracts</h2>
      </div>

      <div className="flex border-b border-[rgba(201,168,76,0.12)] gap-8">
        <button 
          onClick={() => setActiveTab("stays")}
          className={`pb-4 font-body font-medium text-sm transition-colors ${activeTab === "stays" ? "text-gold border-b-2 border-gold" : "text-grey-1 hover:text-white"}`}
        >
          Stays Partnership Agreement
        </button>
        <button 
          onClick={() => setActiveTab("management")}
          className={`pb-4 font-body font-medium text-sm transition-colors ${activeTab === "management" ? "text-gold border-b-2 border-gold" : "text-grey-1 hover:text-white"}`}
        >
          Property Management Agreement
        </button>
      </div>

      {activeTab === "stays" ? (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 md:p-8 animate-in fade-in flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-2xl text-off-white">Generate Stays PDF</h3>
            <button onClick={downloadStays} className="btn-gold text-xs py-2 px-4"><Download className="w-4 h-4 mr-2" /> Download PDF</button>
          </div>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2">Landlord Details</div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Full Name *</label>
              <input type="text" name="landlordName" value={staysData.landlordName} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Address</label>
              <input type="text" name="landlordAddress" value={staysData.landlordAddress} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>

            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2 mt-4">Property Details</div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Address *</label>
              <input type="text" name="propertyAddress" value={staysData.propertyAddress} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block label-style text-grey-1 mb-1">Type</label>
                <select name="propertyType" value={staysData.propertyType} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>Flat</option><option>House</option><option>HMO</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Bedrooms</label>
                <input type="number" name="bedrooms" value={staysData.bedrooms} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
              </div>
            </div>

            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2 mt-4">Permissions (Conditions Precedent)</div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Freeholder</label>
              <select name="freeholder" value={staysData.freeholder} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                <option>Confirmed</option><option>Pending</option><option>Not applicable</option>
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Mortgage Lender</label>
              <select name="mortgageLender" value={staysData.mortgageLender} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                <option>Confirmed</option><option>Pending</option><option>Not applicable</option>
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Insurer</label>
              <select name="insurer" value={staysData.insurer} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                <option>Confirmed</option><option>Pending</option><option>Not applicable</option>
              </select>
            </div>

            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2 mt-4">Financial & Terms</div>
            <div>
              <label className="block label-style text-gold mb-1">Monthly Rent £ *</label>
              <input type="number" name="monthlyRent" value={staysData.monthlyRent} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-gold/50 text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Payment Day of Month</label>
              <input type="text" name="paymentDay" value={staysData.paymentDay} onChange={handleStaysChange} placeholder="e.g. 1st" className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Deposit £</label>
              <input type="number" name="deposit" value={staysData.deposit} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Minor Repairs Cap £</label>
              <input type="number" name="minorRepairsCap" value={staysData.minorRepairsCap} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Start Date</label>
              <input type="date" name="startDate" value={staysData.startDate} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block label-style text-grey-1 mb-1">Term (Yrs)</label>
                <select name="term" value={staysData.term} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>1</option><option>2</option><option>3</option><option>5</option>
                </select>
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Break Notice</label>
                <select name="breakNotice" value={staysData.breakNotice} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>1</option><option>2</option><option>3</option>
                </select>
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Break After</label>
                <select name="breakAfter" value={staysData.breakAfter} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>6</option><option>12</option><option>18</option><option>24</option>
                </select>
              </div>
            </div>

            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2 mt-4">Company Signatory</div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Director Name *</label>
              <input type="text" name="directorName" value={staysData.directorName} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Company Number</label>
              <input type="text" name="companyNumber" value={staysData.companyNumber} onChange={handleStaysChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-[rgba(201,168,76,0.1)]">
            <button onClick={downloadStays} className="btn-gold py-3 px-8"><Download className="w-4 h-4 mr-2" /> Generate Agreement</button>
          </div>
        </div>
      ) : (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 md:p-8 animate-in fade-in flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-2xl text-off-white">Generate Management PDF</h3>
            <button onClick={downloadMgmt} className="btn-gold text-xs py-2 px-4"><Download className="w-4 h-4 mr-2" /> Download PDF</button>
          </div>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2">Landlord Details</div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Full Name *</label>
              <input type="text" name="landlordName" value={mgmtData.landlordName} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Address</label>
              <input type="text" name="landlordAddress" value={mgmtData.landlordAddress} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>

            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2 mt-4">Property Details</div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Address *</label>
              <input type="text" name="propertyAddress" value={mgmtData.propertyAddress} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block label-style text-grey-1 mb-1">Type</label>
                <select name="propertyType" value={mgmtData.propertyType} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>Flat</option><option>House</option><option>HMO</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Bedrooms</label>
                <input type="number" name="bedrooms" value={mgmtData.bedrooms} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
              </div>
            </div>

            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2 mt-4">Management Terms</div>
            <div>
              <label className="block label-style text-gold mb-1">Management Fee % *</label>
              <input type="number" name="managementFee" value={mgmtData.managementFee} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-gold/50 text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Start Date</label>
              <input type="date" name="startDate" value={mgmtData.startDate} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block label-style text-grey-1 mb-1">Term (Months)</label>
                <select name="term" value={mgmtData.term} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>6</option><option>12</option><option>24</option>
                </select>
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Repairs Cap £</label>
                <input type="number" name="minorRepairsCap" value={mgmtData.minorRepairsCap} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block label-style text-grey-1 mb-1">Remittance Days</label>
                <select name="remittanceDays" value={mgmtData.remittanceDays} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
                  <option>3</option><option>5</option><option>7</option><option>10</option>
                </select>
              </div>
            </div>

            <div className="col-span-2 text-gold label-style border-b border-gold/20 pb-2 mt-4">Company Signatory</div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Director Name *</label>
              <input type="text" name="directorName" value={mgmtData.directorName} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Company Number</label>
              <input type="text" name="companyNumber" value={mgmtData.companyNumber} onChange={handleMgmtChange} className="w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors" />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-[rgba(201,168,76,0.1)]">
            <button onClick={downloadMgmt} className="btn-gold py-3 px-8"><Download className="w-4 h-4 mr-2" /> Generate Agreement</button>
          </div>
        </div>
      )}
    </div>
  );
}
