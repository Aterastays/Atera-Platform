import { useListTickets, getListTicketsQueryKey, ListTicketsStatus, ListTicketsPriority } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export function Tickets() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ListTicketsStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ListTicketsPriority | "all">("all");

  const queryParams = {
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(priorityFilter !== "all" ? { priority: priorityFilter } : {})
  };

  const { data: tickets, isLoading } = useListTickets(queryParams, { 
    query: { queryKey: getListTicketsQueryKey(queryParams) } 
  });

  const filteredTickets = tickets?.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    t.deviceHostname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Helpdesk Tickets</h1>
          <p className="text-muted-foreground">Manage client support requests.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Ticket
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ListTicketsStatus | "all")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as ListTicketsPriority | "all")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Customer / Device</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTickets?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets?.map((ticket) => (
                  <TableRow 
                    key={ticket.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setLocation(`/tickets/${ticket.id}`)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{ticket.id}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {ticket.title}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{ticket.customerName}</div>
                      <div className="text-xs text-muted-foreground">{ticket.deviceHostname || '-'}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ticket.assignedTo || 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.priority} type="ticket" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} type="ticket" />
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(ticket.updatedAt), 'MMM d, HH:mm')}
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
