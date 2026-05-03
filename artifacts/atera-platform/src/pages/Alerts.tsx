import { useListAlerts, getListAlertsQueryKey, useUpdateAlert, ListAlertsSeverity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Alerts() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<ListAlertsSeverity | "all">("all");
  const [resolvedFilter, setResolvedFilter] = useState<"all" | "active" | "resolved">("active");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryParams = {
    ...(severityFilter !== "all" ? { severity: severityFilter } : {}),
    ...(resolvedFilter !== "all" ? { resolved: resolvedFilter === "resolved" } : {})
  };

  const { data: alerts, isLoading } = useListAlerts(queryParams, { 
    query: { queryKey: getListAlertsQueryKey(queryParams) } 
  });

  const updateAlert = useUpdateAlert();

  const handleResolve = (id: number) => {
    updateAlert.mutate({ id, data: { resolved: true } }, {
      onSuccess: () => {
        toast({ title: "Alert resolved successfully." });
        queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey() });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/summary'] });
        queryClient.invalidateQueries({ queryKey: ['/api/alerts/recent'] });
      },
      onError: () => {
        toast({ title: "Failed to resolve alert.", variant: "destructive" });
      }
    });
  };

  const filteredAlerts = alerts?.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.deviceHostname?.toLowerCase().includes(search.toLowerCase()) ||
    a.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">Monitor and respond to system events.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as ListAlertsSeverity | "all")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resolvedFilter} onValueChange={(v) => setResolvedFilter(v as "all" | "active" | "resolved")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="resolved">Resolved Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Severity</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Device / Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAlerts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                      <p className="text-lg font-medium text-muted-foreground">No alerts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts?.map((alert) => (
                  <TableRow key={alert.id} className={alert.resolved ? 'opacity-60' : ''}>
                    <TableCell>
                      <StatusBadge status={alert.severity} type="alert" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm max-w-[300px] truncate" title={alert.title}>
                        {alert.title}
                      </div>
                      <div className="text-xs text-muted-foreground max-w-[300px] truncate" title={alert.description}>
                        {alert.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{alert.deviceHostname || 'Unknown Device'}</div>
                      <div className="text-xs text-muted-foreground">{alert.customerName || 'Unknown Customer'}</div>
                    </TableCell>
                    <TableCell className="capitalize text-sm text-muted-foreground">
                      {alert.category}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(alert.createdAt), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      {!alert.resolved ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleResolve(alert.id)}
                          disabled={updateAlert.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                          Resolve
                        </Button>
                      ) : (
                        <div className="flex items-center justify-end text-xs text-muted-foreground gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolved
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
