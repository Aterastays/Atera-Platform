import { useState, useEffect, useCallback } from "react";
import { ChevronDown, RefreshCw, X, ArrowDownToLine } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Enquiry {
  id: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  service_type: string | null;
  property_name: string | null;
  message: string | null;
  created_at: string;
}

export function HubInbox() {
  const [showInfo, setShowInfo] = useState(true);
  const [filter, setFilter] = useState("all");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("enquiries")
      .select("id, type, name, email, phone, address, service_type, property_name, message, created_at")
      .eq("imported", false)
      .order("created_at", { ascending: false });
    setEnquiries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) !== 1 ? "s" : ""} ago`;
  };

  const handleImport = async (enq: Enquiry) => {
    setImporting(enq.id);
    if (enq.type === "guest") {
      await supabase.from("bookings").insert([{
        name: enq.name,
        email: enq.email,
        status: "new",
        source: "Enquiry Inbox",
        message: enq.message,
      }]);
    } else {
      await supabase.from("leads").insert([{
        name: enq.name,
        email: enq.email,
        phone: enq.phone,
        pipeline_status: "new",
        service_type: enq.service_type,
        source: "Enquiry Inbox",
        notes: enq.message,
      }]);
    }
    await supabase.from("enquiries").update({ imported: true }).eq("id", enq.id);
    setEnquiries((prev) => prev.filter((e) => e.id !== enq.id));
    setImporting(null);
  };

  const handleDismiss = async (id: string) => {
    await supabase.from("enquiries").update({ imported: true }).eq("id", id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = enquiries.filter((e) => filter === "all" || e.type === filter);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {showInfo && (
        <div className="bg-[#131217] border-l-4 border-gold p-4 flex justify-between items-start">
          <p className="text-sm text-grey-1">
            Enquiries submitted on the public site appear here automatically. They are saved to Supabase and visible on any device.
          </p>
          <button onClick={() => setShowInfo(false)} className="text-grey-2 hover:text-white ml-4 shrink-0">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          {["all", "guest", "landlord"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs border capitalize ${filter === f ? "border-gold text-gold bg-gold/10" : "border-transparent text-grey-1 hover:text-white"}`}
            >
              {f === "all" ? `All (${enquiries.length})` : `${f === "guest" ? "Guests" : "Landlords"} (${enquiries.filter(e => e.type === f).length})`}
            </button>
          ))}
        </div>
        <button
          onClick={fetchEnquiries}
          className="flex items-center gap-2 text-xs text-grey-1 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] p-16 flex flex-col items-center gap-4">
          <div className="font-display text-[80px] leading-none text-grey-2 opacity-30">0</div>
          <div className="text-grey-1 text-sm">No enquiries yet.</div>
          <div className="text-grey-2 text-xs text-center max-w-sm">
            When visitors submit the enquiry form on the public site, they appear here automatically. You can then import them into CRM or Bookings.
          </div>
        </div>
      ) : (
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#0D0C0F] border-b border-[rgba(201,168,76,0.1)]">
                <th className="p-4 label-style text-grey-1 font-medium">Type</th>
                <th className="p-4 label-style text-grey-1 font-medium">Sender</th>
                <th className="p-4 label-style text-grey-1 font-medium">Details</th>
                <th className="p-4 label-style text-grey-1 font-medium">Received</th>
                <th className="p-4 label-style text-grey-1 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enq) => (
                <tr key={enq.id} className="border-b border-[rgba(201,168,76,0.05)] hover:bg-[#080709] transition-colors">
                  <td className="p-4">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-sm ${enq.type === "guest" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-gold/30 text-gold bg-gold/10"}`}>
                      {enq.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-off-white text-sm">{enq.name}</div>
                    <div className="text-xs text-grey-1">{enq.email ?? enq.phone ?? "—"}</div>
                  </td>
                  <td className="p-4 text-sm text-grey-1">
                    {enq.address ?? enq.property_name ?? enq.service_type ?? "—"}
                  </td>
                  <td className="p-4 text-xs text-grey-2 whitespace-nowrap">{relativeTime(enq.created_at)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleImport(enq)}
                        disabled={importing === enq.id}
                        className="text-xs uppercase tracking-widest bg-[rgba(201,168,76,0.1)] hover:bg-[rgba(201,168,76,0.2)] text-gold px-3 py-1.5 transition-colors border border-transparent hover:border-gold/30 flex items-center gap-1 disabled:opacity-50"
                      >
                        <ArrowDownToLine className="w-3 h-3" /> {importing === enq.id ? "Importing…" : "Import"}
                      </button>
                      <button
                        onClick={() => handleDismiss(enq.id)}
                        className="text-grey-2 hover:text-error transition-colors p-1.5"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
