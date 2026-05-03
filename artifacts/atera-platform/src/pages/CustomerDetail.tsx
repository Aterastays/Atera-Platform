import { useGetCustomer, getGetCustomerQueryKey, useListDevices, getListDevicesQueryKey, useListTickets, getListTicketsQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building, Phone, Mail, Clock, Monitor, Ticket } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const customerId = parseInt(id || "0", 10);

  const { data: customer, isLoading: loadingCustomer } = useGetCustomer(customerId, { 
    query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) } 
  });

  const { data: devices, isLoading: loadingDevices } = useListDevices({ customerId }, {
    query: { enabled: !!customerId, queryKey: getListDevicesQueryKey({ customerId }) }
  });

  const { data: tickets, isLoading: loadingTickets } = useListTickets({ customerId }, {
    query: { enabled: !!customerId, queryKey: getListTicketsQueryKey({ customerId }) }
  });

  if (loadingCustomer) {
    return <div className="space-y-6"><Skeleton className="h-32 w-full" /></div>;
  }

  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <StatusBadge status={customer.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {customer.industry && (
              <span className="flex items-center gap-1"><Building className="h-4 w-4" /> {customer.industry}</span>
            )}
            {customer.email && (
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {customer.email}</span>
            )}
            {customer.phone && (
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {customer.phone}</span>
            )}
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Added {format(new Date(customer.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.deviceCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.openTickets}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="devices">Devices ({devices?.length || 0})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({tickets?.length || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hostname</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDevices ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-4"><Skeleton className="h-6 w-full" /></TableCell></TableRow>
                  ) : devices?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No devices found.</TableCell></TableRow>
                  ) : (
                    devices?.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.hostname}</TableCell>
                        <TableCell className="capitalize">{device.type.replace('_', ' ')}</TableCell>
                        <TableCell>{device.os}</TableCell>
                        <TableCell><StatusBadge status={device.status} type="device" /></TableCell>
                        <TableCell className="text-muted-foreground text-sm">{format(new Date(device.lastSeen), 'PPp')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingTickets ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-4"><Skeleton className="h-6 w-full" /></TableCell></TableRow>
                  ) : tickets?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tickets found.</TableCell></TableRow>
                  ) : (
                    tickets?.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.title}</TableCell>
                        <TableCell className="text-muted-foreground">{ticket.deviceHostname || 'N/A'}</TableCell>
                        <TableCell><StatusBadge status={ticket.priority} type="ticket" /></TableCell>
                        <TableCell><StatusBadge status={ticket.status} type="ticket" /></TableCell>
                        <TableCell className="text-muted-foreground text-sm">{format(new Date(ticket.createdAt), 'PP')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
