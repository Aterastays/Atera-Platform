import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, ChevronUp, Building2, BedDouble, Camera, X, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Property {
  id: string;
  name: string;
  address: string | null;
  postcode: string | null;
  beds: number | null;
  service_type: string | null;
  status: string | null;
  launch_date: string | null;
  monthly_revenue: number | null;
  occupancy_rate: number | null;
  cleaning_costs: number | null;
  notes: string | null;
  photos: string[];
  created_at: string;
}

interface Booking { id: string; name: string; check_in: string | null; check_out: string | null; status: string | null; }
interface Task { id: string; description: string; due_date: string | null; completed: boolean; }

const inputCls = "w-full bg-[#0D0C0F] border border-border-light text-white p-2 text-sm focus:border-gold outline-none transition-colors";
const selectCls = "w-full bg-[#0D0C0F] border border-border-light text-white p-2 text-sm focus:border-gold outline-none transition-colors";
const emptyForm = { name: "", address: "", postcode: "", beds: "", service_type: "stays", status: "pending", launch_date: "", monthly_revenue: "", occupancy_rate: "", cleaning_costs: "", notes: "" };

const statusBadge = (s: string | null) => {
  const m: Record<string, string> = { live: "text-success border-success/30 bg-success/10", pending: "text-amber-400 border-amber-400/30 bg-amber-400/10", archived: "text-grey-1 border-grey-2/30 bg-grey-2/10" };
  return m[s ?? ""] ?? "text-grey-1 border-grey-2/30 bg-grey-2/10";
};

const PropertySVGFallback = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="300" fill="#080709" />
    {[...Array(8)].map((_, i) => (
      <line key={i} x1={i * 55} y1="0" x2={i * 55 + 300} y2="300" stroke="rgba(201,168,76,0.06)" strokeWidth="1" />
    ))}
    <polygon points="80,180 200,80 320,180" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
    <rect x="150" y="180" width="100" height="70" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
    <rect x="170" y="200" width="25" height="30" fill="rgba(201,168,76,0.15)" />
    <rect x="205" y="200" width="25" height="20" fill="rgba(201,168,76,0.15)" />
    <text x="200" y="270" fontFamily="Georgia, serif" fontSize="12" fill="#C9A84C" textAnchor="middle" opacity="0.5" letterSpacing="3">ATERA STAYS</text>
  </svg>
);

export function HubProperties() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Detail view state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Property>>({});
  const [photoUrl, setPhotoUrl] = useState("");
  const [propBookings, setPropBookings] = useState<Booking[]>([]);
  const [propTasks, setPropTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ description: "", due_date: "" });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    setProperties((data ?? []).map((p) => ({ ...p, photos: Array.isArray(p.photos) ? p.photos : [] })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const fetchPropertyDetail = useCallback(async (prop: Property) => {
    const [{ data: bkgs }, { data: tasks }] = await Promise.all([
      supabase.from("bookings").select("id, name, check_in, check_out, status").eq("property_id", prop.id).order("check_in", { ascending: false }).limit(5),
      supabase.from("tasks").select("*").eq("property_id", prop.id).order("due_date", { ascending: true }),
    ]);
    setPropBookings(bkgs ?? []);
    setPropTasks(tasks ?? []);
  }, []);

  const openDetail = (prop: Property) => {
    setSelectedProperty(prop);
    setEditForm(prop);
    setView("detail");
    fetchPropertyDetail(prop);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      address: form.address || null,
      postcode: form.postcode || null,
      beds: form.beds ? parseInt(form.beds) : null,
      service_type: form.service_type || "stays",
      status: form.status || "pending",
      launch_date: form.launch_date || null,
      monthly_revenue: form.monthly_revenue ? parseFloat(form.monthly_revenue) : null,
      occupancy_rate: form.occupancy_rate ? parseFloat(form.occupancy_rate) : null,
      cleaning_costs: form.cleaning_costs ? parseFloat(form.cleaning_costs) : null,
      notes: form.notes || null,
      photos: [],
    };
    const { data } = await supabase.from("properties").insert([payload]).select().single();
    if (data) setProperties((prev) => [{ ...data, photos: [] }, ...prev]);
    setForm(emptyForm);
    setShowAddForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this property?")) return;
    await supabase.from("properties").delete().eq("id", id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveEdit = async () => {
    if (!selectedProperty) return;
    const { data } = await supabase.from("properties").update(editForm).eq("id", selectedProperty.id).select().single();
    if (data) {
      const updated = { ...data, photos: Array.isArray(data.photos) ? data.photos : [] };
      setSelectedProperty(updated);
      setProperties((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    }
    setEditing(false);
  };

  const addPhoto = async () => {
    if (!photoUrl.trim() || !selectedProperty) return;
    const updated = [...selectedProperty.photos, photoUrl.trim()];
    await supabase.from("properties").update({ photos: updated }).eq("id", selectedProperty.id);
    setSelectedProperty((prev) => prev ? { ...prev, photos: updated } : prev);
    setPhotoUrl("");
  };

  const removePhoto = async (url: string) => {
    if (!selectedProperty) return;
    const updated = selectedProperty.photos.filter((p) => p !== url);
    await supabase.from("properties").update({ photos: updated }).eq("id", selectedProperty.id);
    setSelectedProperty((prev) => prev ? { ...prev, photos: updated } : prev);
  };

  const addTask = async () => {
    if (!newTask.description.trim() || !selectedProperty) return;
    const { data } = await supabase.from("tasks").insert([{
      property_id: selectedProperty.id,
      description: newTask.description.trim(),
      due_date: newTask.due_date || null,
      completed: false,
    }]).select().single();
    if (data) setPropTasks((prev) => [...prev, data]);
    setNewTask({ description: "", due_date: "" });
  };

  const toggleTask = async (task: Task) => {
    await supabase.from("tasks").update({ completed: !task.completed }).eq("id", task.id);
    setPropTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const today = new Date().toISOString().split("T")[0];

  const filtered = properties.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.address ?? "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.service_type === typeFilter;
    return matchSearch && matchType;
  });

  if (view === "detail" && selectedProperty) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={() => { setView("list"); setEditing(false); }} className="text-sm text-grey-1 hover:text-white flex items-center gap-1 transition-colors">
            ← All Properties
          </button>
          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-sm ${statusBadge(selectedProperty.status)}`}>
            {selectedProperty.status}
          </span>
          <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-[rgba(255,255,255,0.1)] text-grey-1 bg-[rgba(255,255,255,0.05)] rounded-sm">
            {selectedProperty.service_type}
          </span>
          <div className="ml-auto">
            {editing ? (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="btn-outline text-xs py-1.5 px-3">Cancel</button>
                <button onClick={handleSaveEdit} className="btn-gold text-xs py-1.5 px-3">Save</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-outline text-xs py-1.5 px-3">Edit</button>
            )}
          </div>
        </div>

        <h2 className="font-display text-3xl text-off-white">{selectedProperty.name}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
            <h3 className="font-medium text-off-white mb-4">Property Info</h3>
            {editing ? (
              <div className="flex flex-col gap-3">
                {([["Name", "name", "text"], ["Address", "address", "text"], ["Postcode", "postcode", "text"], ["Notes", "notes", "text"]] as [string, keyof Property, string][]).map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block label-style text-grey-1 mb-1">{label}</label>
                    <input type={type} value={(editForm[key] as string) ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))} className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className="block label-style text-grey-1 mb-1">Beds</label>
                  <input type="number" value={(editForm.beds as number) ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, beds: parseInt(e.target.value) || null }))} className={inputCls} />
                </div>
                <div>
                  <label className="block label-style text-grey-1 mb-1">Status</label>
                  <select value={editForm.status ?? "pending"} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} className={selectCls}>
                    <option value="live">Live</option><option value="pending">Pending</option><option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block label-style text-grey-1 mb-1">Launch Date</label>
                  <input type="date" value={(editForm.launch_date as string) ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, launch_date: e.target.value || null }))} className={inputCls} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-sm">
                {[["Address", selectedProperty.address], ["Postcode", selectedProperty.postcode], ["Beds", selectedProperty.beds], ["Launch Date", selectedProperty.launch_date], ["Notes", selectedProperty.notes]].map(([label, value]) => (
                  value ? (
                    <div key={label as string} className="flex justify-between gap-4">
                      <span className="text-grey-1 shrink-0">{label}</span>
                      <span className="text-off-white text-right">{String(value)}</span>
                    </div>
                  ) : null
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
            <h3 className="font-medium text-off-white mb-4">Performance</h3>
            {editing ? (
              <div className="flex flex-col gap-3">
                {([["Monthly Revenue £", "monthly_revenue"], ["Occupancy Rate %", "occupancy_rate"], ["Cleaning Costs £", "cleaning_costs"]] as [string, keyof Property][]).map(([label, key]) => (
                  <div key={key}>
                    <label className="block label-style text-grey-1 mb-1">{label}</label>
                    <input type="number" step="0.01" value={(editForm[key] as number) ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, [key]: parseFloat(e.target.value) || null }))} className={inputCls} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="label-style text-grey-2 mb-1">Monthly Rev</div>
                  <div className="font-display text-2xl text-gold leading-none">£{(selectedProperty.monthly_revenue ?? 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="label-style text-grey-2 mb-1">Occupancy</div>
                  <div className="font-display text-2xl text-off-white leading-none">{selectedProperty.occupancy_rate ?? 0}%</div>
                </div>
                <div>
                  <div className="label-style text-grey-2 mb-1">Cleaning</div>
                  <div className="font-display text-xl text-off-white leading-none">£{selectedProperty.cleaning_costs ?? 0}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
            <h3 className="font-medium text-off-white mb-4">Photos</h3>
            <div className="flex gap-2 mb-4">
              <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Image URL…" className={`${inputCls} flex-1`} onKeyDown={(e) => e.key === "Enter" && addPhoto()} />
              <button onClick={addPhoto} className="btn-gold text-xs py-2 px-3 shrink-0">Add</button>
            </div>
            {selectedProperty.photos.length === 0 ? (
              <div className="border border-[rgba(201,168,76,0.1)] aspect-video overflow-hidden">
                <PropertySVGFallback />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {selectedProperty.photos.map((url) => (
                  <div key={url} className="relative group aspect-video">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removePhoto(url)} className="absolute top-1 right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
            <h3 className="font-medium text-off-white mb-4">Tasks</h3>
            <div className="flex gap-2 mb-4">
              <input value={newTask.description} onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))} placeholder="Task description…" className={`${inputCls} flex-1 text-xs`} />
              <input type="date" value={newTask.due_date} onChange={(e) => setNewTask((p) => ({ ...p, due_date: e.target.value }))} className={`${inputCls} w-32`} />
              <button onClick={addTask} className="btn-gold text-xs py-2 px-3 shrink-0">Add</button>
            </div>
            {propTasks.length === 0 ? (
              <p className="text-xs text-grey-1">No tasks yet.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {propTasks.map((task) => {
                  const overdue = task.due_date && task.due_date < today && !task.completed;
                  return (
                    <label key={task.id} className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} className="mt-0.5 accent-gold" />
                      <span className={`text-xs flex-1 ${task.completed ? "line-through text-grey-2" : "text-off-white"}`}>{task.description}</span>
                      {task.due_date && <span className={`text-[10px] whitespace-nowrap ${overdue ? "text-error" : "text-grey-2"}`}>{task.due_date}</span>}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {propBookings.length > 0 && (
          <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
            <h3 className="font-medium text-off-white mb-4">Recent Bookings</h3>
            <div className="flex flex-col gap-2">
              {propBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-4 py-2 border-b border-[rgba(255,255,255,0.04)]">
                  <span className="text-sm text-off-white">{b.name}</span>
                  <span className="text-xs text-grey-1">{b.check_in} → {b.check_out}</span>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${statusBadge(b.status)}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <h2 className="font-display text-3xl text-off-white">Properties</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-gold py-2 px-4 text-xs">
          <Plus className="w-4 h-4" /> {showAddForm ? "Close" : "Add Property"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-off-white">Add New Property</h3>
            <button onClick={() => setShowAddForm(false)}><ChevronUp className="w-5 h-5 text-grey-1" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block label-style text-grey-1 mb-1">Name *</label>
              <input name="name" value={form.name} onChange={handleFormChange} required className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Address *</label>
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
              <label className="block label-style text-grey-1 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleFormChange} className={selectCls}>
                <option value="pending">Pending</option>
                <option value="live">Live</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Launch Date</label>
              <input name="launch_date" type="date" value={form.launch_date} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Monthly Revenue £</label>
              <input name="monthly_revenue" type="number" min="0" step="0.01" value={form.monthly_revenue} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Occupancy Rate %</label>
              <input name="occupancy_rate" type="number" min="0" max="100" step="0.1" value={form.occupancy_rate} onChange={handleFormChange} className={inputCls} />
            </div>
            <div>
              <label className="block label-style text-grey-1 mb-1">Cleaning Costs £</label>
              <input name="cleaning_costs" type="number" min="0" step="0.01" value={form.cleaning_costs} onChange={handleFormChange} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block label-style text-grey-1 mb-1">Notes</label>
              <textarea name="notes" rows={2} value={form.notes} onChange={handleFormChange} className={`${inputCls} resize-none`} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline text-xs py-2">Cancel</button>
              <button type="submit" disabled={saving} className="btn-gold text-xs py-2 disabled:opacity-50">{saving ? "Saving…" : "Add Property"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-grey-1" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties…" className="w-full bg-[#131217] border border-[rgba(201,168,76,0.1)] text-white pl-9 pr-3 py-2 text-sm focus:border-gold outline-none transition-colors" />
        </div>
        <div className="flex gap-2">
          {["all", "stays", "management"].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1 text-xs border capitalize ${typeFilter === t ? "border-gold text-gold bg-gold/10" : "border-transparent text-grey-1 hover:text-white"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-12 text-center">
          <Building2 className="w-10 h-10 text-grey-2 mx-auto mb-3" />
          <p className="text-grey-1 text-sm">No properties yet. Add your first property above.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-[#131217] border border-[rgba(201,168,76,0.1)] overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#0D0C0F] border-b border-[rgba(201,168,76,0.1)]">
                  {["Property", "Beds", "Type", "Status", "Monthly Rev", "Occ %", "Launch", ""].map((h, i) => (
                    <th key={i} className="p-4 label-style text-grey-1 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((prop) => (
                  <tr key={prop.id} onClick={() => openDetail(prop)} className="border-b border-[rgba(201,168,76,0.05)] hover:bg-[rgba(201,168,76,0.03)] cursor-pointer transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-8 shrink-0 overflow-hidden">
                          {prop.photos?.[0] ? (
                            <img src={prop.photos[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full"><PropertySVGFallback /></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-off-white text-sm">{prop.name}</div>
                          <div className="text-xs text-grey-1 truncate max-w-[180px]">{prop.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-grey-1">{prop.beds ?? "—"}</td>
                    <td className="p-4">
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-[rgba(255,255,255,0.1)] text-grey-1 bg-[rgba(255,255,255,0.05)] rounded-sm">
                        {prop.service_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-sm ${statusBadge(prop.status)}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-display text-xl text-gold">{prop.monthly_revenue ? `£${prop.monthly_revenue.toLocaleString()}` : "—"}</span>
                    </td>
                    <td className="p-4 text-sm text-grey-1">{prop.occupancy_rate != null ? `${prop.occupancy_rate}%` : "—"}</td>
                    <td className="p-4 text-sm text-grey-1">{prop.launch_date ?? "—"}</td>
                    <td className="p-4">
                      <button onClick={(e) => handleDelete(prop.id, e)} className="text-grey-2 hover:text-error transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid grid-cols-1 gap-4">
            {filtered.map((prop) => (
              <div key={prop.id} onClick={() => openDetail(prop)} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] cursor-pointer hover:border-gold/30 transition-colors">
                {prop.photos?.[0] ? (
                  <img src={prop.photos[0]} alt={prop.name} className="w-full h-32 object-cover" />
                ) : (
                  <div className="h-32 overflow-hidden"><PropertySVGFallback /></div>
                )}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl text-off-white">{prop.name}</h3>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-sm shrink-0 ${statusBadge(prop.status)}`}>{prop.status}</span>
                  </div>
                  <div className="text-xs text-grey-1">{prop.address}</div>
                  {prop.monthly_revenue && <div className="font-display text-xl text-gold">£{prop.monthly_revenue.toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
