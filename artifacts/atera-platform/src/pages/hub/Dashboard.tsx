import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface RecentItem {
  id: string;
  type: "enquiry" | "lead" | "booking";
  name: string;
  detail: string;
  created_at: string;
}

interface Task {
  id: string;
  description: string;
  due_date: string | null;
  completed: boolean;
}

export function HubDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    liveProperties: 0,
    monthlyRevenue: 0,
    avgOccupancy: 0,
    activeLeads: 0,
    activeBookings: 0,
    enquiryInbox: 0,
    upcomingStays: 0,
    followUpsToday: 0,
  });
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const [
        { data: props },
        { data: leads },
        { data: bookings },
        { data: enquiries },
        { data: tasksData },
      ] = await Promise.all([
        supabase.from("properties").select("id, status, monthly_revenue, occupancy_rate"),
        supabase.from("leads").select("id, name, pipeline_status, follow_up_date, created_at, service_type").order("created_at", { ascending: false }),
        supabase.from("bookings").select("id, name, property_name, status, check_in, total_amount, created_at").order("created_at", { ascending: false }),
        supabase.from("enquiries").select("id, name, type, imported, created_at").eq("imported", false).order("created_at", { ascending: false }),
        supabase.from("tasks").select("*").eq("completed", false).order("due_date", { ascending: true }),
      ]);

      const liveProps = (props ?? []).filter((p) => p.status === "live");
      const monthlyRevenue = liveProps.reduce((sum, p) => sum + (p.monthly_revenue ?? 0), 0);
      const avgOccupancy = liveProps.length > 0
        ? liveProps.reduce((sum, p) => sum + (p.occupancy_rate ?? 0), 0) / liveProps.length
        : 0;
      const activeLeads = (leads ?? []).filter((l) => !["lost", "live"].includes(l.pipeline_status ?? "")).length;
      const activeBookings = (bookings ?? []).filter((b) => ["new", "contacted", "confirmed"].includes(b.status ?? "")).length;
      const upcomingStays = (bookings ?? []).filter((b) => b.check_in && b.check_in >= today && b.check_in <= nextWeek).length;
      const followUpsToday = (leads ?? []).filter((l) => l.follow_up_date === today).length;

      setStats({
        totalProperties: (props ?? []).length,
        liveProperties: liveProps.length,
        monthlyRevenue: Math.round(monthlyRevenue),
        avgOccupancy: Math.round(avgOccupancy),
        activeLeads,
        activeBookings,
        enquiryInbox: (enquiries ?? []).length,
        upcomingStays,
        followUpsToday,
      });

      const recentItems: RecentItem[] = [
        ...(enquiries ?? []).slice(0, 5).map((e) => ({
          id: e.id,
          type: "enquiry" as const,
          name: e.name,
          detail: `${e.type === "guest" ? "Guest" : "Landlord"} enquiry`,
          created_at: e.created_at,
        })),
        ...(leads ?? []).slice(0, 5).map((l) => ({
          id: l.id,
          type: "lead" as const,
          name: l.name,
          detail: `${l.service_type ?? "unknown"} — ${l.pipeline_status}`,
          created_at: l.created_at,
        })),
        ...(bookings ?? []).slice(0, 5).map((b) => ({
          id: b.id,
          type: "booking" as const,
          name: b.name,
          detail: `${b.property_name ?? "Property"} — £${b.total_amount ?? 0}`,
          created_at: b.created_at,
        })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setRecent(recentItems);
      setTasks(tasksData ?? []);
    } catch (err) {
      setError("Connection issue. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleTask = async (task: Task) => {
    await supabase.from("tasks").update({ completed: !task.completed }).eq("id", task.id);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const kpis = [
    { label: "Total Properties", value: stats.totalProperties },
    { label: "Live Properties", value: stats.liveProperties },
    { label: "Monthly Revenue", value: `£${stats.monthlyRevenue.toLocaleString()}` },
    { label: "Avg Occupancy", value: `${stats.avgOccupancy}%` },
    { label: "Active Leads", value: stats.activeLeads },
    { label: "Active Bookings", value: stats.activeBookings },
    { label: "Enquiry Inbox", value: stats.enquiryInbox, highlight: stats.enquiryInbox > 0 ? "error" : "" },
    { label: "Upcoming Stays", value: stats.upcomingStays },
    { label: "Follow-Ups Today", value: stats.followUpsToday, highlight: stats.followUpsToday > 0 ? "warning" : "" },
  ];

  const typeConfig: Record<string, { label: string; cls: string }> = {
    enquiry: { label: "ENQUIRY", cls: "bg-blue-500/10 text-blue-400 border border-blue-500/30" },
    lead: { label: "LEAD", cls: "bg-[rgba(201,168,76,0.1)] text-gold border border-gold/30" },
    booking: { label: "BOOKING", cls: "bg-success/10 text-success border border-success/30" },
  };

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const today = new Date().toISOString().split("T")[0];

  if (error) {
    return <div className="text-error text-sm p-8 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#131217] border-t-[1.5px] border-gold p-5 shadow-sm">
            <div className="label-style text-grey-1 mb-2">{kpi.label}</div>
            <div className={`font-display text-4xl ${
              kpi.highlight === "error" ? "text-error" :
              kpi.highlight === "warning" ? "text-warning" : "text-gold"
            }`}>
              {loading ? <span className="skeleton inline-block w-12 h-8 rounded" /> : kpi.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
          <h3 className="font-display text-2xl text-off-white mb-6">Recent Activity</h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-14 rounded" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-grey-1 text-sm">No recent activity yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recent.map((item) => {
                const cfg = typeConfig[item.type];
                return (
                  <div key={item.id} className="flex items-start gap-4 p-3 border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <span className={`text-[10px] font-medium tracking-wider px-2 py-1 rounded-sm whitespace-nowrap ${cfg.cls}`}>{cfg.label}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-off-white">{item.name}</div>
                      <div className="text-xs text-grey-1 truncate">{item.detail}</div>
                    </div>
                    <div className="text-xs text-grey-2 whitespace-nowrap">{relativeTime(item.created_at)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-[#131217] border border-[rgba(201,168,76,0.1)] p-6">
          <h3 className="font-display text-2xl text-off-white mb-6">Pending Tasks</h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-grey-1 text-sm">No pending tasks.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => {
                const overdue = task.due_date && task.due_date < today && !task.completed;
                return (
                  <label key={task.id} className="flex items-start gap-3 p-3 border border-[rgba(255,255,255,0.04)] cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-gold"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />
                    <span className={`text-sm flex-1 ${task.completed ? "line-through text-grey-2" : "text-off-white"}`}>
                      {task.description}
                    </span>
                    {task.due_date && (
                      <span className={`text-xs whitespace-nowrap ${overdue ? "text-error" : "text-grey-2"}`}>
                        {task.due_date}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
