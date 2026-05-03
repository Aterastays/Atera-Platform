import { useState, useEffect, useCallback } from "react";
import { Trash2, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface KPIEntry { id: string; date: string; ll_calls: number; agent_calls: number; messages: number; new_leads: number; offers: number; }

const inputCls = "w-full bg-[#0D0C0F] border border-[rgba(255,255,255,0.1)] text-white p-2 text-sm focus:border-gold outline-none transition-colors";

function downloadCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) { alert("No data to export."); return; }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = filename;
  a.click();
}

export function HubSettings() {
  const [password, setPassword] = useState({ new: "", confirm: "" });
  const [pwdStatus, setPwdStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [pwdLoading, setPwdLoading] = useState(false);

  const [kpiForm, setKpiForm] = useState({ date: new Date().toISOString().split("T")[0], ll_calls: "", agent_calls: "", messages: "", new_leads: "", offers: "" });
  const [kpiHistory, setKpiHistory] = useState<KPIEntry[]>([]);
  const [kpiSaving, setKpiSaving] = useState(false);
  const [kpiSuccess, setKpiSuccess] = useState(false);

  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const [deleteStage, setDeleteStage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchKPIs = useCallback(async () => {
    const { data } = await supabase.from("kpis").select("*").order("date", { ascending: false }).limit(14);
    setKpiHistory(data ?? []);
  }, []);

  useEffect(() => { fetchKPIs(); }, [fetchKPIs]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setPwdStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }
    if (password.new.length < 8) {
      setPwdStatus({ type: "error", msg: "Password must be at least 8 characters." });
      return;
    }
    setPwdLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password.new });
    if (error) {
      setPwdStatus({ type: "error", msg: error.message });
    } else {
      setPwdStatus({ type: "success", msg: "Password updated successfully." });
      setPassword({ new: "", confirm: "" });
    }
    setPwdLoading(false);
  };

  const handleKPISave = async (e: React.FormEvent) => {
    e.preventDefault();
    setKpiSaving(true);
    const { data } = await supabase.from("kpis").insert([{
      date: kpiForm.date,
      ll_calls: parseInt(kpiForm.ll_calls) || 0,
      agent_calls: parseInt(kpiForm.agent_calls) || 0,
      messages: parseInt(kpiForm.messages) || 0,
      new_leads: parseInt(kpiForm.new_leads) || 0,
      offers: parseInt(kpiForm.offers) || 0,
    }]).select().single();
    if (data) setKpiHistory((prev) => [data, ...prev.slice(0, 13)]);
    setKpiForm({ date: new Date().toISOString().split("T")[0], ll_calls: "", agent_calls: "", messages: "", new_leads: "", offers: "" });
    setKpiSuccess(true);
    setTimeout(() => setKpiSuccess(false), 3000);
    setKpiSaving(false);
  };

  const handleExport = async (type: "leads" | "bookings" | "properties") => {
    setExportLoading(type);
    const { data } = await supabase.from(type).select("*");
    downloadCSV((data ?? []) as Record<string, unknown>[], `atera_${type}_${new Date().toISOString().split("T")[0]}.csv`);
    setExportLoading(null);
  };

  const handleClearAll = async () => {
    if (deleteStage === 0) { setDeleteStage(1); return; }
    if (deleteStage === 1) { setDeleteStage(2); return; }
    if (deleteStage === 2) {
      if (deleteConfirm !== "DELETE") return;
      setDeleteLoading(true);
      await Promise.all([
        supabase.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("leads").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("enquiries").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("kpis").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("properties").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      ]);
      setDeleteLoading(false);
      setDeleteStage(0);
      setDeleteConfirm("");
      setKpiHistory([]);
    }
  };

  const panelCls = "bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6";
  const h3Cls = "font-display text-2xl text-off-white mb-6 border-b border-gold/20 pb-4";

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Panel 1: Change Password */}
      <div className={panelCls}>
        <h3 className={h3Cls}>Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block label-style text-grey-1 mb-1">New Password</label>
            <input type="password" required minLength={8} value={password.new} onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block label-style text-grey-1 mb-1">Confirm New Password</label>
            <input type="password" required minLength={8} value={password.confirm} onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))} className={inputCls} />
          </div>
          {pwdStatus.type && (
            <div className={`text-sm p-3 border ${pwdStatus.type === "error" ? "text-error border-error/20 bg-error/10" : "text-success border-success/20 bg-success/10"}`}>
              {pwdStatus.msg}
            </div>
          )}
          <button type="submit" disabled={pwdLoading} className="btn-gold self-start text-xs py-2 px-6 disabled:opacity-50">
            {pwdLoading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Panel 2: Daily KPI Logger */}
      <div className={panelCls}>
        <h3 className={h3Cls}>Daily KPI Logger</h3>
        <form onSubmit={handleKPISave} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-3 md:w-48">
            <label className="block label-style text-grey-1 mb-1">Date</label>
            <input type="date" value={kpiForm.date} onChange={(e) => setKpiForm((p) => ({ ...p, date: e.target.value }))} className={inputCls} />
          </div>
          {([["LL Calls", "ll_calls"], ["Agent Calls", "agent_calls"], ["Messages", "messages"], ["New Leads", "new_leads"], ["Offers", "offers"]] as [string, keyof typeof kpiForm][]).map(([label, key]) => (
            <div key={key}>
              <label className="block label-style text-grey-1 mb-1">{label}</label>
              <input type="number" min="0" value={kpiForm[key]} onChange={(e) => setKpiForm((p) => ({ ...p, [key]: e.target.value }))} className={inputCls} />
            </div>
          ))}
          <div className="md:col-span-3 flex items-center gap-4">
            <button type="submit" disabled={kpiSaving} className="btn-gold text-xs py-2 px-6 disabled:opacity-50">{kpiSaving ? "Saving…" : "Save KPIs"}</button>
            {kpiSuccess && <span className="text-success text-sm">KPIs saved.</span>}
          </div>
        </form>

        {kpiHistory.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#0D0C0F] border-b border-[rgba(201,168,76,0.1)]">
                  {["Date", "LL Calls", "Agent Calls", "Messages", "New Leads", "Offers"].map((h) => (
                    <th key={h} className="p-3 label-style text-grey-1 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpiHistory.map((k) => (
                  <tr key={k.id} className="border-b border-[rgba(201,168,76,0.05)] hover:bg-[#080709] transition-colors">
                    <td className="p-3 text-sm text-grey-1">{k.date}</td>
                    <td className="p-3 text-sm text-off-white">{k.ll_calls}</td>
                    <td className="p-3 text-sm text-off-white">{k.agent_calls}</td>
                    <td className="p-3 text-sm text-off-white">{k.messages}</td>
                    <td className="p-3 text-sm text-off-white">{k.new_leads}</td>
                    <td className="p-3 text-sm text-off-white">{k.offers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Panel 3: Data Export */}
      <div className={panelCls}>
        <h3 className={h3Cls}>Data Export</h3>
        <div className="flex flex-col gap-3">
          {([["leads", "Download All Leads CSV"], ["bookings", "Download All Bookings CSV"], ["properties", "Download All Properties CSV"]] as [string, string][]).map(([type, label]) => (
            <button
              key={type}
              onClick={() => handleExport(type as "leads" | "bookings" | "properties")}
              disabled={exportLoading === type}
              className="btn-outline self-start text-xs py-2 px-5 flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-3 h-3" />
              {exportLoading === type ? "Exporting…" : label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel 4: Data Management */}
      <div className={panelCls}>
        <h3 className="font-display text-2xl text-error mb-6 border-b border-error/20 pb-4">Data Management</h3>
        {deleteStage === 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-grey-1">This will permanently delete all leads, bookings, properties, enquiries, tasks, and KPI data. This action cannot be undone.</p>
            <button onClick={handleClearAll} className="flex items-center gap-2 text-xs py-2 px-4 border border-error text-error hover:bg-error hover:text-white transition-colors self-start">
              <Trash2 className="w-4 h-4" /> Clear All Data
            </button>
          </div>
        )}
        {deleteStage === 1 && (
          <div className="flex flex-col gap-4 bg-error/5 border border-error/20 p-4">
            <p className="text-sm text-error font-medium">Are you sure? This will delete ALL data permanently.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteStage(0)} className="btn-outline text-xs py-2 px-4">Cancel</button>
              <button onClick={handleClearAll} className="text-xs py-2 px-4 bg-error text-white hover:bg-error/90 transition-colors">Yes, Continue</button>
            </div>
          </div>
        )}
        {deleteStage === 2 && (
          <div className="flex flex-col gap-4 bg-error/5 border border-error/20 p-4">
            <p className="text-sm text-error font-medium">Final confirmation. Type <strong>DELETE</strong> to proceed.</p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="bg-[#0D0C0F] border border-error/30 text-white p-2 text-sm focus:border-error outline-none max-w-xs"
            />
            <div className="flex gap-2">
              <button onClick={() => { setDeleteStage(0); setDeleteConfirm(""); }} className="btn-outline text-xs py-2 px-4">Cancel</button>
              <button onClick={handleClearAll} disabled={deleteConfirm !== "DELETE" || deleteLoading} className="text-xs py-2 px-4 bg-error text-white hover:bg-error/90 transition-colors disabled:opacity-50">
                {deleteLoading ? "Deleting…" : "Delete All Data"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
