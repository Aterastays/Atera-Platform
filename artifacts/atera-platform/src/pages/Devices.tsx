import { useListDevices, getListDevicesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Monitor, Server, Network, Smartphone } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListDevicesStatus } from "@workspace/api-client-react";

export function Devices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ListDevicesStatus | "all">("all");

  const queryParams = statusFilter !== "all" ? { status: statusFilter } : {};
  const { data: devices, isLoading } = useListDevices(queryParams, { 
    query: { queryKey: getListDevicesQueryKey(queryParams) } 
  });

  const filteredDevices = devices?.filter(d => 
    d.hostname.toLowerCase().includes(search.toLowerCase()) || 
    d.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    d.os.toLowerCase().includes(search.toLowerCase())
  );

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "workstation": return <Monitor className="h-4 w-4 text-muted-foreground" />;
      case "server": return <Server className="h-4 w-4 text-muted-foreground" />;
      case "network_device": return <Network className="h-4 w-4 text-muted-foreground" />;
      case "mobile": return <Smartphone className="h-4 w-4 text-muted-foreground" />;
      default: return <Monitor className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Devices</h1>
          <p className="text-muted-foreground">Monitor and manage client endpoints.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Device
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hostname, customer, OS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ListDevicesStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Hostname / Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Usage (CPU/MEM/DISK)</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredDevices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No devices found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices?.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.type)}
                        <div>
                          <div className="font-medium text-sm">{device.hostname}</div>
                          <div className="text-xs text-muted-foreground">{device.customerName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-sm text-muted-foreground">{device.type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <div className="text-sm">{device.os}</div>
                      <div className="text-xs text-muted-foreground">{device.osVersion}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-8 ${device.cpuUsage && device.cpuUsage > 80 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{device.cpuUsage || 0}%</span>
                        <span className={`w-8 ${device.memoryUsage && device.memoryUsage > 80 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{device.memoryUsage || 0}%</span>
                        <span className={`w-8 ${device.diskUsage && device.diskUsage > 90 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{device.diskUsage || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(device.lastSeen), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={device.status} type="device" />
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
