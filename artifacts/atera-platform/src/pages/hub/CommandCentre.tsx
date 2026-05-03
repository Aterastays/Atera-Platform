import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface Enquiry { id: string; name: string; type: string; email: string | null; phone: string | null; created_at: string; }
interface Lead { id: string; name: string; service_type: string | null; pipeline_status: string | null; follow_up_date: string | null; }
interface Property { id: string; name: string; beds: number | null; monthly_revenue: number | null; occupancy_rate: number | null; }

export function HubCommandCentre() {
  const [, setLocation] = useLocation();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({ inbox: 0, activeLeads: 0, liveProps: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [
      { data: enqData },
      { data: leadsData },
      { data: propsData },
    ] = await Promise.all([
      supabase.from("enquiries").select("id, name, type, email, phone, created_at").eq("imported", false).order("created_at", { ascending: false }).limit(10),
      supabase.from("leads").select("id, name, service_type, pipeline_status, follow_up_date").not("pipeline_status", "in", '("lost","live")').order("created_at", { ascending: false }).limit(10),
      supabase.from("properties").select("id, name, beds, monthly_revenue, occupancy_rate").eq("status", "live").order("created_at", { ascending: false }),
    ]);
    const liveProps = propsData ?? [];
    setEnquiries(enqData ?? []);
    setLeads(leadsData ?? []);
    setProperties(liveProps);
    setStats({
      inbox: (enqData ?? []).length,
      activeLeads: (leadsData ?? []).length,
      liveProps: liveProps.length,
      monthlyRevenue: liveProps.reduce((s, p) => s + (p.monthly_revenue ?? 0), 0),
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const today = new Date().toISOString().split("T")[0];

  const handleImport = async (enq: Enquiry) => {
    setImporting(enq.id);
    if (enq.type === "guest") {
      await supabase.from("bookings").insert([{ name: enq.name, email: enq.email, status: "new", source: "Enquiry Inbox" }]);
    } else {
      await supabase.from("leads").insert([{ name: enq.name, email: enq.email, phone: enq.phone, pipeline_status: "new", source: "Enquiry Inbox" }]);
    }
    await supabase.from("enquiries").update({ imported: true }).eq("id", enq.id);
    setEnquiries((prev) => prev.filter((e) => e.id !== enq.id));
    setStats((prev) => ({ ...prev, inbox: prev.inbox - 1 }));
    setImporting(null);
  };

  const kpis = [
    { label: "Inbox Unread", value: stats.inbox, cls: stats.inbox > 0 ? "text-error" : "text-gold" },
    { label: "Active Leads", value: stats.activeLeads, cls: "text-gold" },
    { label: "Live Properties", value: stats.liveProps, cls: "text-off-white" },
    { label: "Monthly Revenue", value: `£${stats.monthlyRevenue.toLocaleString()}`, cls: "text-gold" },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 shadow-sm">
            <div className="label-style text-grey-1 mb-3">{kpi.label}</div>
            <div className={`font-display text-[42px] leading-none ${kpi.cls}`}>
              {loading ? <span className="skeleton inline-block w-16 h-10 rounded" /> : kpi.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* New Enquiries */}
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-2xl text-off-white">New Enquiries</h2>
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-28 rounded" />)
          ) : enquiries.length === 0 ? (
            <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 text-grey-1 text-sm">No new enquiries.</div>
          ) : enquiries.map((enq) => (
            <div key={enq.id} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="font-medium text-off-white text-sm">{enq.name}</div>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-sm shrink-0 ${enq.type === "guest" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-gold/30 text-gold bg-gold/10"}`}>
                  {enq.type}
                </span>
              </div>
              <div className="text-xs text-grey-1">{enq.email ?? enq.phone ?? "—"}</div>
              <div className="flex items-center gap-1 text-xs text-grey-2"><Clock className="w-3 h-3" /> {relativeTime(enq.created_at)}</div>
              <button
                onClick={() => handleImport(enq)}
                disabled={importing === enq.id}
                className="w-full text-xs uppercase tracking-widest bg-[rgba(201,168,76,0.1)] hover:bg-[rgba(201,168,76,0.2)] text-gold py-2 transition-colors border border-transparent hover:border-gold/30 disabled:opacity-50"
              >
                {importing === enq.id ? "Importing…" : "Import Record"}
              </button>
            </div>
          ))}
          {enquiries.length > 0 && (
            <button onClick={() => setLocation("/hub/inbox")} className="text-xs text-grey-1 hover:text-gold flex items-center gap-1 transition-colors mt-1">
              View all in Inbox <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Active Leads */}
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-2xl text-off-white">Active Leads</h2>
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-24 rounded" />)
          ) : leads.length === 0 ? (
            <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 text-grey-1 text-sm">No active leads.</div>
          ) : leads.map((lead) => {
            const overdue = lead.follow_up_date && lead.follow_up_date < today;
            return (
              <div key={lead.id} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-medium text-off-white text-sm">{lead.name}</div>
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-[rgba(255,255,255,0.1)] text-grey-1 bg-[rgba(255,255,255,0.05)] rounded-sm shrink-0">
                    {lead.service_type ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-grey-1">Stage: <span className="text-off-white capitalize">{lead.pipeline_status}</span></div>
                  {lead.follow_up_date && (
                    <div className={`text-xs ${overdue ? "text-error font-medium" : "text-grey-2"}`}>
                      {overdue ? "Overdue: " : "Due: "}{lead.follow_up_date}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {leads.length > 0 && (
            <button onClick={() => setLocation("/hub/crm")} className="text-xs text-grey-1 hover:text-gold flex items-center gap-1 transition-colors mt-1">
              View all in CRM <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Live Properties */}
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-2xl text-off-white">Live Properties</h2>
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-24 rounded" />)
          ) : properties.length === 0 ? (
            <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6 text-grey-1 text-sm">No live properties yet.</div>
          ) : properties.map((prop) => (
            <div key={prop.id} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="font-medium text-off-white text-sm truncate">{prop.name}</div>
                <span className="text-[10px] text-grey-2 whitespace-nowrap">{prop.beds ?? 0} Beds</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-grey-2 uppercase tracking-widest mb-1">Monthly Rev</div>
                  <div className="font-display text-2xl text-gold leading-none">£{(prop.monthly_revenue ?? 0).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-grey-2 uppercase tracking-widest mb-1">Occ</div>
                  <div className="font-display text-xl text-off-white leading-none">{prop.occupancy_rate ?? 0}%</div>
                </div>
              </div>
            </div>
          ))}
          {properties.length > 0 && (
            <button onClick={() => setLocation("/hub/properties")} className="text-xs text-grey-1 hover:text-gold flex items-center gap-1 transition-colors mt-1">
              View all properties <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
