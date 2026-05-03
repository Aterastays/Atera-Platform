import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Plus, Search, ChevronUp, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TemplatePickerModal } from "@/components/hub/TemplatePickerModal";

interface Booking {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  property_id: string | null;
  property_name: string | null;
  check_in: string | null;
  check_out: string | null;
  nightly_rate: number | null;
  total_amount: number | null;
  guests: number | null;
  source: string | null;
  status: string | null;
  message: string | null;
  created_at: string;
}

interface Property { id: string; name: string; }

const STATUSES = ["new", "contacted", "confirmed", "completed"];
const statusColors: Record<string, string> = {
  new: "text-blue-400",
  contacted: "text-amber-400",
  confirmed: "text-gold",
  completed: "text-success",
};

const inputCls = "w-full bg-[#0D0C0F] border border-border-light text-white p-2 text-sm focus:border-gold outline-none transition-colors";
const selectCls = "w-full bg-[#0D0C0F] border border-border-light text-white p-2 text-sm focus:border-gold outline-none transition-colors";
const emptyForm = { name: "", email: "", phone: "", property_id: "", check_in: "", check_out: "", nightly_rate: "", guests: "1", source: "", message: "" };

export function HubBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: bkgs }, { data: props }] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("properties").select("id, name").eq("status", "live"),
    ]);
    setBookings(bkgs ?? []);
    setProperties(props ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nightsCount = useMemo(() => {
    if (!form.check_in || !form.check_out) return 0;
    return Math.max(0, Math.round((new Date(form.check_out).getTime() - new Date(form.check_in).getTime()) / 86400000));
  }, [form.check_in, form.check_out]);

  const totalAmount = useMemo(() => {
    return nightsCount * (parseFloat(form.nightly_rate) || 0);
  }, [nightsCount, form.nightly_rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const selectedProp = properties.find((p) => p.id === form.property_id);
    const payload = {
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      property_id: form.property_id || null,
      property_name: selectedProp?.name ?? null,
      check_in: form.check_in || null,
      check_out: form.check_out || null,
      nightly_rate: parseFloat(form.nightly_rate) || null,
      total_amount: totalAmount || null,
      guests: parseInt(form.guests) || 1,
      source: form.source || null,
      message: form.message || null,
      status: "new",
    };
    const { data } = await supabase.from("bookings").insert([payload]).select().single();
    if (data) setBookings((prev) => [data, ...prev]);
    setForm(emptyForm);
    setShowAddForm(false);
    setSaving(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || (b.property_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <h2 className="font-display text-3xl text-off-white">Guest Bookings</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-gold py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> {showAddForm ? "Close" : "Log Booking"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-off-white">Log New Booking</h3>
            <button onClick={() => setShowAddForm(false)}><ChevronUp className="w-5 h-5 text-grey-1" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block label-style text-grey-1 mb-1">Guest Name *</label>
              <input name="name" value={form.name} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Phone</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Property</label>
              <select name="property_id" value={form.property_id} onChange={handleFormChange} className={selectCls}>
                <option value="">Select property…</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Check-In *</label>
              <input name="check_in" type="date" value={form.check_in} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Check-Out *</label>
              <input name="check_out" type="date" value={form.check_out} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Nightly Rate £</label>
              <input name="nightly_rate" type="number" min="0" step="0.01" value={form.nightly_rate} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Guests</label>
              <input name="guests" type="number" min="1" value={form.guests} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Source</label>
              <input name="source" value={form.source} onChange={handleFormChange} placeholder="e.g. Airbnb, Direct, Website" className={inputCls} />
            </div>
            {nightsCount > 0 && (
              <div className="md:col-span-3 bg-[#0D0C0F] border border-gold/20 p-3 flex items-center gap-6">
                <span className="text-grey-1 text-sm">{nightsCount} night{nightsCount !== 1 ? "s" : ""}</span>
                <span className="font-display text-2xl text-gold">£{totalAmount.toLocaleString()}</span>
                <span className="text-xs text-grey-2">calculated total</span>
              </div>
            )}
            <div className="md:col-span-3">
              <div className="flex justify-between items-end mb-1">
                <label className="label-style text-grey-1">Message</label>
                <button type="button" onClick={() => setTemplateModalOpen(true)} className="text-xs text-gold hover:text-gold-light transition-colors">
                  Insert Template
                </button>
              </div>
              <textarea ref={messageRef} name="message" rows={3} value={form.message} onChange={handleFormChange} className={`${inputCls} resize-none`} />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline text-xs py-2">Cancel</button>
              <button type="submit" disabled={saving} className="btn-gold text-xs py-2 disabled:opacity-50">{saving ? "Saving…" : "Log Booking"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-grey-1" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings…" className="w-full bg-[#131217] border border-[rgba(201,168,76,0.1)] text-white pl-9 pr-3 py-2 text-sm focus:border-gold outline-none transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-12 text-center text-grey-1 text-sm">No bookings found.</div>
      ) : (
        <>
          <div className="hidden md:block bg-[#131217] border border-[rgba(201,168,76,0.1)] overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#0D0C0F] border-b border-[rgba(201,168,76,0.1)]">
                  {["Guest", "Property", "Check-In", "Check-Out", "Nights", "Total", "Guests", "Status", "Source", ""].map((h, i) => (
                    <th key={i} className="p-4 label-style text-grey-1 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const nights = b.check_in && b.check_out ? Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000) : 0;
                  return (
                    <tr key={b.id} className="border-b border-[rgba(201,168,76,0.05)] hover:bg-[#080709] transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-off-white text-sm">{b.name}</div>
                        <div className="text-xs text-grey-1">{b.email}</div>
                      </td>
                      <td className="p-4 text-sm text-grey-1">{b.property_name ?? "—"}</td>
                      <td className="p-4 text-sm text-grey-1 whitespace-nowrap">{b.check_in ?? "—"}</td>
                      <td className="p-4 text-sm text-grey-1 whitespace-nowrap">{b.check_out ?? "—"}</td>
                      <td className="p-4 text-sm text-grey-1">{nights || "—"}</td>
                      <td className="p-4">
                        <span className="font-display text-xl text-gold">
                          {b.total_amount ? `£${b.total_amount.toLocaleString()}` : "—"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-grey-1">{b.guests ?? 1}</td>
                      <td className="p-4">
                        <select
                          value={b.status ?? "new"}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className={`bg-transparent border border-transparent text-xs p-1 focus:border-gold outline-none cursor-pointer ${statusColors[b.status ?? "new"] ?? "text-grey-1"}`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td className="p-4 text-xs text-grey-1">{b.source ?? "—"}</td>
                      <td className="p-4">
                        <button onClick={() => handleDelete(b.id)} className="text-grey-2 hover:text-error transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {filtered.map((b) => (
              <div key={b.id} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-off-white">{b.name}</div>
                  <span className={`text-xs ${statusColors[b.status ?? "new"] ?? "text-grey-1"}`}>{b.status}</span>
                </div>
                <div className="text-xs text-grey-1">{b.property_name ?? "No property"}</div>
                <div className="text-xs text-grey-2">{b.check_in} → {b.check_out}</div>
                {b.total_amount && <div className="font-display text-xl text-gold">£{b.total_amount.toLocaleString()}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      <TemplatePickerModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        audience="guest"
        onSelect={(body) => {
          setForm((prev) => ({ ...prev, message: body }));
          setTemplateModalOpen(false);
        }}
      />
    </div>
  );
}
