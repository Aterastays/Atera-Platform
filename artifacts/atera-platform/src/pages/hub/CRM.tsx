import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, ChevronUp, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TemplatePickerModal } from "@/components/hub/TemplatePickerModal";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  address: string | null;
  postcode: string | null;
  beds: number | null;
  service_type: string | null;
  pipeline_status: string | null;
  rent_amount: number | null;
  tenanted: boolean | null;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
}

const STAGES = ["new", "called", "analysing", "offer", "contract", "live", "lost"];
const SOURCES = ["Website", "Cold Call", "Referral", "Social Media", "Agent", "Direct", "Other"];

const stageColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  called: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  analysing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  offer: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  contract: "bg-gold/10 text-gold border-gold/30",
  live: "bg-success/10 text-success border-success/30",
  lost: "bg-error/10 text-error border-error/30",
};

const inputCls = "w-full bg-[#0D0C0F] border border-border-light text-white p-2 text-sm focus:border-gold outline-none transition-colors";
const selectCls = "w-full bg-[#0D0C0F] border border-border-light text-white p-2 text-sm focus:border-gold outline-none transition-colors";

const emptyForm = { name: "", email: "", phone: "", source: "", address: "", postcode: "", beds: "", service_type: "stays", pipeline_status: "new", rent_amount: "", tenanted: "", follow_up_date: "", notes: "" };

export function HubCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      source: form.source || null,
      address: form.address || null,
      postcode: form.postcode || null,
      beds: form.beds ? parseInt(form.beds) : null,
      service_type: form.service_type || null,
      pipeline_status: form.pipeline_status || "new",
      rent_amount: form.rent_amount ? parseFloat(form.rent_amount) : null,
      tenanted: form.tenanted === "true" ? true : form.tenanted === "false" ? false : null,
      follow_up_date: form.follow_up_date || null,
      notes: form.notes || null,
    };
    const { data } = await supabase.from("leads").insert([payload]).select().single();
    if (data) setLeads((prev) => [data, ...prev]);
    setForm(emptyForm);
    setShowAddForm(false);
    setSaving(false);
  };

  const handleStageChange = async (id: string, stage: string) => {
    await supabase.from("leads").update({ pipeline_status: stage }).eq("id", id);
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, pipeline_status: stage } : l));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const today = new Date().toISOString().split("T")[0];

  const filtered = leads.filter((l) => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || (l.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStage = !stageFilter || l.pipeline_status === stageFilter;
    const matchService = !serviceFilter || l.service_type === serviceFilter;
    return matchSearch && matchStage && matchService;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <h2 className="font-display text-3xl text-off-white">Landlord CRM</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-gold py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> {showAddForm ? "Close" : "Add Lead"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-off-white">Add New Lead</h3>
            <button onClick={() => setShowAddForm(false)}><ChevronUp className="w-5 h-5 text-grey-1" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block label-style text-grey-1 mb-1">Name *</label>
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
              <label className="block label-style text-grey-1 mb-1">Source</label>
              <select name="source" value={form.source} onChange={handleFormChange} className={selectCls}>
                <option value="">Select source</option>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Address</label>
              <input name="address" value={form.address} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Postcode</label>
              <input name="postcode" value={form.postcode} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Beds</label>
              <input name="beds" type="number" min="1" value={form.beds} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Service Type</label>
              <select name="service_type" value={form.service_type} onChange={handleFormChange} className={selectCls}>
                <option value="stays">Stays</option>
                <option value="management">Management</option>
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Pipeline Stage</label>
              <select name="pipeline_status" value={form.pipeline_status} onChange={handleFormChange} className={selectCls}>
                {STAGES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Rent £</label>
              <input name="rent_amount" type="number" min="0" value={form.rent_amount} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Tenanted</label>
              <select name="tenanted" value={form.tenanted} onChange={handleFormChange} className={selectCls}>
                <option value="">Unknown</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Follow-Up Date</label>
              <input name="follow_up_date" type="date" value={form.follow_up_date} onChange={handleFormChange} className={inputCls} />
            </div>
            <div className="md:col-span-3">
              <div className="flex justify-between items-end mb-1">
                <label className="label-style text-grey-1">Notes</label>
                <button type="button" onClick={() => setTemplateModalOpen(true)} className="text-xs text-gold hover:text-gold-light transition-colors">
                  Insert Template
                </button>
              </div>
              <textarea ref={notesRef} name="notes" rows={3} value={form.notes} onChange={handleFormChange} className={`${inputCls} resize-none`} />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline text-xs py-2">Cancel</button>
              <button type="submit" disabled={saving} className="btn-gold text-xs py-2 disabled:opacity-50">{saving ? "Saving…" : "Add Lead"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-grey-1" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search leads…" className="w-full bg-[#131217] border border-[rgba(201,168,76,0.1)] text-white pl-9 pr-3 py-2 text-sm focus:border-gold outline-none transition-colors" />
        </div>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
          <option value="">All Stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors">
          <option value="">All Types</option>
          <option value="stays">Stays</option>
          <option value="management">Management</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-12 text-center text-grey-1 text-sm">No leads found.</div>
      ) : (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#0D0C0F] border-b border-[rgba(201,168,76,0.1)]">
                {["Name / Contact", "Type", "Stage", "Source", "Follow-Up", "Notes", "Added", ""].map((h, i) => (
                  <th key={i} className="p-4 label-style text-grey-1 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const overdue = lead.follow_up_date && lead.follow_up_date < today;
                return (
                  <tr key={lead.id} className="border-b border-[rgba(201,168,76,0.05)] hover:bg-[#080709] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-off-white text-sm">{lead.name}</div>
                      <div className="text-xs text-grey-1">{lead.email}</div>
                      <div className="text-xs text-grey-1">{lead.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-[rgba(255,255,255,0.1)] text-grey-1 bg-[rgba(255,255,255,0.05)] rounded-sm">
                        {lead.service_type ?? "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.pipeline_status ?? "new"}
                        onChange={(e) => handleStageChange(lead.id, e.target.value)}
                        className={`bg-transparent border text-xs p-1 focus:border-gold outline-none cursor-pointer rounded-sm ${stageColors[lead.pipeline_status ?? "new"] ?? ""}`}
                      >
                        {STAGES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-sm text-grey-1">{lead.source ?? "—"}</td>
                    <td className={`p-4 text-sm whitespace-nowrap ${overdue ? "text-error font-medium" : "text-grey-1"}`}>
                      {lead.follow_up_date ?? "—"}
                    </td>
                    <td className="p-4 text-xs text-grey-1 max-w-[160px] truncate">{lead.notes ?? "—"}</td>
                    <td className="p-4 text-xs text-grey-2 whitespace-nowrap">{lead.created_at?.split("T")[0]}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(lead.id)} className="text-grey-2 hover:text-error transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TemplatePickerModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        audience="landlord"
        onSelect={(body) => {
          setForm((prev) => ({ ...prev, notes: body }));
          setTemplateModalOpen(false);
        }}
      />
    </div>
  );
}
