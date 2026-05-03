import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

interface GuestEnquiryModalProps {
  open: boolean;
  onClose: () => void;
}

export function GuestEnquiryModal({ open, onClose }: GuestEnquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    stayType: "Leisure",
    message: ""
  });

  useEffect(() => {
    if (open) {
      fetchProperties();
      setSuccess(false);
      setError(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        propertyId: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        stayType: "Leisure",
        message: ""
      });
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const fetchProperties = async () => {
    const { data } = await supabase.from("properties").select("id, name").eq("status", "live");
    if (data) setProperties(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
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
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          property_id: formData.propertyId || undefined,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests: formData.guests,
          type_of_stay: formData.stayType,
          message: formData.message
        })
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
        <button onClick={onClose} className="absolute top-4 right-4 text-grey-1 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-display text-gold mb-2">Book a Stay</h2>
          <p className="text-grey-1 mb-8 text-sm">Tell us what you're looking for and we'll check availability.</p>

          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-success animate-[shimmer_300ms_ease-in]" />
              </div>
              <h3 className="text-2xl font-display text-white mb-2">Enquiry Sent</h3>
              <p className="text-grey-1">We'll be in touch within a few hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block label-style text-grey-1 mb-1">First Name *</label>
                  <input required type="text" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block label-style text-grey-1 mb-1">Last Name *</label>
                  <input required type="text" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block label-style text-grey-1 mb-1">Email *</label>
                  <input required type="email" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block label-style text-grey-1 mb-1">Phone</label>
                  <input type="tel" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block label-style text-grey-1 mb-1">Property</label>
                <select className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.propertyId} onChange={e => setFormData({...formData, propertyId: e.target.value})}>
                  <option value="">Any available property</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block label-style text-grey-1 mb-1">Check-In *</label>
                  <input required type="date" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                </div>
                <div>
                  <label className="block label-style text-grey-1 mb-1">Check-Out *</label>
                  <input required type="date" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block label-style text-grey-1 mb-1">Guests</label>
                  <input required type="number" min="1" className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value) || 1})} />
                </div>
                <div>
                  <label className="block label-style text-grey-1 mb-1">Type of Stay</label>
                  <select className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors" value={formData.stayType} onChange={e => setFormData({...formData, stayType: e.target.value})}>
                    <option value="Corporate">Corporate</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Relocation">Relocation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block label-style text-grey-1 mb-1">Message</label>
                <textarea rows={3} className="w-full bg-[#131217] border border-border-light text-white p-3 text-sm focus:border-gold outline-none transition-colors resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              <div className="text-xs text-grey-1 mb-2">
                By submitting this form you agree to our <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>. Your data will be used to respond to your enquiry only.
              </div>

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
