import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Link } from "wouter";

interface GuestEnquiryModalProps {
  open: boolean;
  onClose: () => void;
}

export function GuestEnquiryModal({ open, onClose }: GuestEnquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    stayType: "Corporate",
    message: ""
  });

  useEffect(() => {
    if (open) {
      fetch("/api/properties/live")
        .then(r => r.ok ? r.json() : [])
        .then((data: { id: string; name: string }[]) => setProperties(data))
        .catch(() => setProperties([]));

      setSuccess(false);
      setError(null);
      setFormData({
        firstName: "", lastName: "", email: "", phone: "",
        propertyId: "", checkIn: "", checkOut: "",
        guests: 1, stayType: "Corporate", message: ""
      });
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.checkIn && formData.checkOut && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guest",
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || undefined,
          property_id: formData.propertyId || undefined,
          check_in: formData.checkIn || undefined,
          check_out: formData.checkOut || undefined,
          guests: formData.guests,
          type_of_stay: formData.stayType,
          message: formData.message || undefined
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
              <p className="text-[#636366] text-[14px]">We'll be in touch within a few hours.</p>
              <button onClick={onClose} className="mt-8 bg-white text-black px-6 py-2.5 rounded-[980px] font-semibold text-[14px] hover:bg-[#e8e8ed] transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[22px] font-semibold text-white mb-1 tracking-tight">Book a Stay</h2>
              <p className="text-[#636366] text-[13px] mb-7">Tell us what you're looking for and we'll check availability.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">First Name *</label>
                    <input required type="text" className={inputCls} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Last Name *</label>
                    <input required type="text" className={inputCls} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Email *</label>
                    <input required type="email" className={inputCls} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Phone</label>
                    <input type="tel" className={inputCls} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                {properties.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Property</label>
                    <select className={inputCls} value={formData.propertyId} onChange={e => setFormData({...formData, propertyId: e.target.value})}>
                      <option value="">Any available property</option>
                      {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Check-In *</label>
                    <input required type="date" className={inputCls} value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Check-Out *</label>
                    <input required type="date" className={inputCls} value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Guests</label>
                    <input type="number" min="1" className={inputCls} value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value) || 1})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Type of Stay</label>
                    <select className={inputCls} value={formData.stayType} onChange={e => setFormData({...formData, stayType: e.target.value})}>
                      <option value="Corporate">Corporate</option>
                      <option value="Contractor">Contractor</option>
                      <option value="Leisure">Leisure</option>
                      <option value="Relocation">Relocation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#636366] mb-1.5">Message</label>
                  <textarea rows={3} className={`${inputCls} resize-none`} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Any specific requirements..." />
                </div>

                <p className="text-[11px] text-[#48484a]">
                  By submitting you agree to our{" "}
                  <Link href="/privacy" className="text-[#636366] hover:text-white underline transition-colors">Privacy Policy</Link>.
                </p>

                {error && (
                  <div className="bg-[#2c1c1c] border border-[#ff3b30]/30 text-[#ff3b30] text-[13px] px-4 py-3 rounded-[10px]">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-white text-black py-3.5 rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 disabled:opacity-40 mt-1">
                  {loading ? "Sending…" : "Submit Enquiry"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
