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
    name: "",
    email: "",
    phone: "",
    address: "",
    bedrooms: "",
    currentRent: "",
    tenanted: "No",
    availableFrom: "",
    notes: "",
    currentSituation: "",
    goals: ""
  });

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError(null);
      setStep(initialService ? 2 : 1);
      setServiceType(initialService);
      setFormData({
        name: "", email: "", phone: "", address: "", bedrooms: "", 
        currentRent: "", tenanted: "No", availableFrom: "", notes: "", 
        currentSituation: "", goals: ""
      });
    }
  }, [open, initialService]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleSelectService = (type: "stays" | "management") => {
    setServiceType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      type: "landlord",
      service_type: serviceType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      bedrooms: parseInt(formData.bedrooms) || undefined,
      current_rent: serviceType === "stays" ? parseFloat(formData.currentRent) || undefined : undefined,
      tenanted: serviceType === "stays" ? formData.tenanted === "Yes" : undefined,
      available_from: serviceType === "stays" ? formData.availableFrom : undefined,
      message: serviceType === "stays" ? formData.notes : undefined,
      current_situation: serviceType === "management" ? formData.currentSituation : undefined,
      goals: serviceType === "management" ? formData.goals : undefined
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to submit enquiry.");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-[#0D0C0F] border border-[rgba(201,168,76,0.15)] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-grey-1 hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-success animate-[shimmer_300ms_ease-in]" />
              </div>
              <h3 className="text-2xl font-display text-white mb-2">Enquiry Sent</h3>
              <p className="text-grey-1">We'll review your details and contact you shortly.</p>
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col gap-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-display text-gold mb-2">Partner with Atera</h2>
                <p className="text-grey-1 text-sm">Select the service you're interested in.</p>
              </div>

              <button 
                onClick={() => handleSelectService("stays")}
                className="flex flex-col items-center text-center p-8 border border-[rgba(201,168,76,0.15)] bg-[#131217] hover:bg-[rgba(201,168,76,0.05)] hover:border-gold transition-all duration-300 group"
              >
                <Home className="w-10 h-10 text-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-display text-white mb-2">Stays Partnership</h3>
                <p className="text-sm text-grey-1">Guaranteed rent, full management</p>
              </button>

              <button 
                onClick={() => handleSelectService("management")}
                className="flex flex-col items-center text-center p-8 border border-[rgba(201,168,76,0.15)] bg-[#131217] hover:bg-[rgba(201,168,76,0.05)] hover:border-gold transition-all duration-300 group"
              >
                <FileText className="w-10 h-10 text-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-display text-white mb-2">Property Management</h3>
                <p className="text-sm text-grey-1">We manage your property</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex items-center gap-4 mb-4">
                {!initialService && (
                  <button type="button" onClick={() => setStep(1)} className="text-grey-1 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-display text-gold">
                    {serviceType === "stays" ? "Stays Partnership" : "Property Management"}
                  </h2>
                  <p className="text-grey-1 text-xs uppercase tracking-wider">Enquiry Details</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block label-style text-grey-1 mb-1">Full Name *</label>
                  <input required type="text" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block label-style text-grey-1 mb-1">Phone</label>
                  <input type="tel" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block label-style text-grey-1 mb-1">Email *</label>
                <input required type="email" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div>
                <label className="block label-style text-grey-1 mb-1">Property Address</label>
                <input type="text" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block label-style text-grey-1 mb-1">Bedrooms</label>
                  <input type="number" min="0" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
                </div>
                {serviceType === "stays" && (
                  <div>
                    <label className="block label-style text-grey-1 mb-1">Current Rent £</label>
                    <input type="number" min="0" step="0.01" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.currentRent} onChange={e => setFormData({...formData, currentRent: e.target.value})} />
                  </div>
                )}
              </div>

              {serviceType === "stays" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block label-style text-grey-1 mb-1">Currently Tenanted?</label>
                      <select className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.tenanted} onChange={e => setFormData({...formData, tenanted: e.target.value})}>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block label-style text-grey-1 mb-1">Available From</label>
                      <input type="date" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.availableFrom} onChange={e => setFormData({...formData, availableFrom: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block label-style text-grey-1 mb-1">Additional Notes</label>
                    <textarea rows={3} className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors resize-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block label-style text-grey-1 mb-1">Current Situation</label>
                    <textarea rows={2} className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors resize-none" placeholder="e.g. Self-managing but lacking time..." value={formData.currentSituation} onChange={e => setFormData({...formData, currentSituation: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="block label-style text-grey-1 mb-1">What are your goals?</label>
                    <textarea rows={2} className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors resize-none" placeholder="e.g. Hands-off income, better compliance..." value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})}></textarea>
                  </div>
                </>
              )}

              {error && <div className="text-error text-sm">{error}</div>}

              <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-4 mt-2 disabled:opacity-50">
                {loading ? "Sending..." : "Submit Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
