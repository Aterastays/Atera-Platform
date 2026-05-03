import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetRecentAlerts, getGetRecentAlertsQueryKey, useGetDeviceHealth, getGetDeviceHealthQueryKey, useGetTicketStats, getGetTicketStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, AlertTriangle, Ticket, Users, Activity, CheckCircle2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell } from "recharts";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: alerts, isLoading: loadingAlerts } = useGetRecentAlerts({ query: { queryKey: getGetRecentAlertsQueryKey() } });
  const { data: health, isLoading: loadingHealth } = useGetDeviceHealth({ query: { queryKey: getGetDeviceHealthQueryKey() } });
  const { data: ticketStats, isLoading: loadingTicketStats } = useGetTicketStats({ query: { queryKey: getGetTicketStatsQueryKey() } });

  const healthData = health ? [
    { name: "Online", value: health.online, color: "hsl(142 71% 45%)" },
    { name: "Warning", value: health.warning, color: "hsl(38 92% 50%)" },
    { name: "Offline", value: health.offline, color: "hsl(0 84% 60%)" }
  ] : [];

  const ticketData = ticketStats ? [
    { name: "Open", value: ticketStats.byStatus.open },
    { name: "In Progress", value: ticketStats.byStatus.in_progress },
    { name: "Resolved", value: ticketStats.byStatus.resolved },
    { name: "Closed", value: ticketStats.byStatus.closed }
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground">Platform overview and live metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Customers"
          value={summary?.totalCustomers}
          icon={Users}
          loading={loadingSummary}
        />
        <MetricCard
          title="Devices Monitored"
          value={summary?.totalDevices}
          icon={Server}
          loading={loadingSummary}
          subtext={`${summary?.offlineDevices || 0} offline`}
          subtextClass="text-destructive"
        />
        <MetricCard
          title="Active Alerts"
          value={summary?.openAlerts}
          icon={AlertTriangle}
          loading={loadingSummary}
          subtext={`${summary?.criticalAlerts || 0} critical`}
          subtextClass="text-destructive"
        />
        <MetricCard
          title="Open Tickets"
          value={summary?.openTickets}
          icon={Ticket}
          loading={loadingSummary}
          subtext={`${summary?.resolvedTicketsToday || 0} resolved today`}
          subtextClass="text-green-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAlerts ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : alerts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                <p className="font-medium">All clear</p>
                <p className="text-sm text-muted-foreground">No active alerts to display.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts?.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.deviceHostname} • {alert.customerName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={alert.severity} type="alert" />
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Device Health</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            {loadingHealth ? (
              <Skeleton className="h-[250px] w-[250px] rounded-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {healthData.map((entry, index) => (
                      <PieCell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, loading, subtext, subtextClass }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value ?? 0}</div>
            {subtext && (
              <p className={`text-xs mt-1 ${subtextClass}`}>
                {subtext}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
