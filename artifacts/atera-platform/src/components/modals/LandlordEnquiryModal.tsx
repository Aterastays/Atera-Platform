import { useState, useEffect } from "react";
import { X, Home, FileText, Check, ArrowLeft } from "lucide-react";

interface LandlordEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  initialService?: "stays" | "management" | null;
}

export function LandlordEnquiryModal({ open, onClose, initialService = null }: LandlordEnquiryModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [serviceType, setServiceType] = useState<"stays" | "management" | null>(initialService);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", bedrooms: "",
    currentRent: "", tenanted: "No", availableFrom: "", notes: "",
    currentSituation: "", goals: ""
  });

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError(null);
      setStep(initialService ? 2 : 1);
      setServiceType(initialService);
      setFormData({ name: "", email: "", phone: "", address: "", bedrooms: "", currentRent: "", tenanted: "No", availableFrom: "", notes: "", currentSituation: "", goals: "" });
    }
  }, [open, initialService]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "landlord",
          service_type: serviceType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          bedrooms: parseInt(formData.bedrooms) || undefined,
          current_rent: serviceType === "stays" ? parseFloat(formData.currentRent) || undefined : undefined,
          tenanted: serviceType === "stays" ? formData.tenanted === "Yes" : undefined,
          available_from: serviceType === "stays" ? formData.availableFrom || undefined : undefined,
          message: serviceType === "stays" ? formData.notes || undefined : undefined,
          current_situation: serviceType === "management" ? formData.currentSituation || undefined : undefined,
          goals: serviceType === "management" ? formData.goals || undefined : undefined
        })
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error || "Failed to submit enquiry.");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-[#1c1c1e] border border-[#2c2c2e] text-white text-[14px] px-4 py-3 rounded-[10px] outline-none placeholder:text-[#636366] focus:border-[#636366] transition-colors duration-200";
  const labelCls = "block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg bg-[#111113] border border-[#2c2c2e] rounded-[20px] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-[#636366] hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#1c4a1c] flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-[#30d158]" />
              </div>
              <h3 className="text-[22px] font-semibold text-white mb-2 tracking-tight">Enquiry Sent</h3>
              <p className="text-[#636366] text-[14px]">We'll review your details and call you shortly.</p>
              <button onClick={onClose} className="mt-8 bg-white text-black px-6 py-2.5 rounded-[980px] font-semibold text-[14px] hover:bg-[#e8e8ed] transition-colors">
                Close
              </button>
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col gap-5">
              <div className="mb-2">
                <h2 className="text-[22px] font-semibold text-white mb-1 tracking-tight">Partner with Atera</h2>
                <p className="text-[#636366] text-[13px]">Select the service you're interested in.</p>
              </div>

              <button
                onClick={() => { setServiceType("stays"); setStep(2); }}
                className="flex items-start gap-5 p-6 bg-[#1c1c1e] border border-[#2c2c2e] rounded-[14px] hover:border-[#636366] transition-all duration-200 text-left group"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[#2c2c2e] flex items-center justify-center shrink-0 group-hover:bg-[#3a3a3c] transition-colors">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white mb-1">Stays Partnership</h3>
                  <p className="text-[13px] text-[#636366] leading-relaxed">Guaranteed rent. We become your company tenant and manage everything.</p>
                </div>
              </button>

              <button
                onClick={() => { setServiceType("management"); setStep(2); }}
                className="flex items-start gap-5 p-6 bg-[#1c1c1e] border border-[#2c2c2e] rounded-[14px] hover:border-[#636366] transition-all duration-200 text-left group"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[#2c2c2e] flex items-center justify-center shrink-0 group-hover:bg-[#3a3a3c] transition-colors">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white mb-1">Property Management</h3>
                  <p className="text-[13px] text-[#636366] leading-relaxed">Professional management for traditional AST tenancies at a fixed fee.</p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                {!initialService && (
                  <button type="button" onClick={() => setStep(1)} className="text-[#636366] hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h2 className="text-[22px] font-semibold text-white tracking-tight">
                    {serviceType === "stays" ? "Stays Partnership" : "Property Management"}
                  </h2>
                  <p className="text-[#636366] text-[13px]">Tell us about your property.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required type="text" className={inputCls} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" className={inputCls} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email *</label>
                <input required type="email" className={inputCls} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div>
                <label className={labelCls}>Property Address</label>
                <input type="text" className={inputCls} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Bedrooms</label>
                  <input type="number" min="0" className={inputCls} value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
                </div>
                {serviceType === "stays" && (
                  <div>
                    <label className={labelCls}>Current Rent £</label>
                    <input type="number" min="0" step="0.01" className={inputCls} value={formData.currentRent} onChange={e => setFormData({...formData, currentRent: e.target.value})} />
                  </div>
                )}
              </div>

              {serviceType === "stays" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Currently Tenanted?</label>
                      <select className={inputCls} value={formData.tenanted} onChange={e => setFormData({...formData, tenanted: e.target.value})}>
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Available From</label>
                      <input type="date" className={inputCls} value={formData.availableFrom} onChange={e => setFormData({...formData, availableFrom: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Additional Notes</label>
                    <textarea rows={3} className={`${inputCls} resize-none`} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Anything else you'd like us to know..." />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelCls}>Current Situation</label>
                    <textarea rows={2} className={`${inputCls} resize-none`} placeholder="e.g. Self-managing but lacking time…" value={formData.currentSituation} onChange={e => setFormData({...formData, currentSituation: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelCls}>Your Goals</label>
                    <textarea rows={2} className={`${inputCls} resize-none`} placeholder="e.g. Hands-off income, better compliance…" value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} />
                  </div>
                </>
              )}

              {error && (
                <div className="bg-[#2c1c1c] border border-[#ff3b30]/30 text-[#ff3b30] text-[13px] px-4 py-3 rounded-[10px]">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-white text-black py-3.5 rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 disabled:opacity-40 mt-1">
                {loading ? "Sending…" : "Submit Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
