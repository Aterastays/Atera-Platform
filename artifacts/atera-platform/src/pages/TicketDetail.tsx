import { useGetTicket, getGetTicketQueryKey, useUpdateTicket, UpdateTicketBodyStatus, UpdateTicketBodyPriority } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, User as UserIcon, Monitor, Building, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const ticketId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useGetTicket(ticketId, { 
    query: { enabled: !!ticketId, queryKey: getGetTicketQueryKey(ticketId) } 
  });

  const updateTicket = useUpdateTicket();

  const [status, setStatus] = useState<UpdateTicketBodyStatus>("open");
  const [priority, setPriority] = useState<UpdateTicketBodyPriority>("medium");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status as UpdateTicketBodyStatus);
      setPriority(ticket.priority as UpdateTicketBodyPriority);
      setAssignee(ticket.assignedTo || "");
    }
  }, [ticket]);

  const handleSave = () => {
    updateTicket.mutate({
      id: ticketId,
      data: {
        status,
        priority,
        assignedTo: assignee || null
      }
    }, {
      onSuccess: () => {
        toast({ title: "Ticket updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetTicketQueryKey(ticketId) });
      },
      onError: () => {
        toast({ title: "Failed to update ticket", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-32 w-full" /><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/tickets"><ChevronLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">#{ticket.id} - {ticket.title}</h1>
            <StatusBadge status={ticket.status} type="ticket" />
            <StatusBadge status={ticket.priority} type="ticket" />
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Opened {format(new Date(ticket.createdAt), 'PPp')}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated {format(new Date(ticket.updatedAt), 'PPp')}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-md border border-muted">
                {ticket.description || 'No description provided.'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Context</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Customer</Label>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Link href={`/customers/${ticket.customerId}`} className="hover:underline">{ticket.customerName}</Link>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Device</Label>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  {ticket.deviceHostname ? ticket.deviceHostname : <span className="text-muted-foreground font-normal">None attached</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription>Update ticket metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as UpdateTicketBodyStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as UpdateTicketBodyPriority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assignee</Label>
                <div className="relative">
                  <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={assignee} 
                    onChange={(e) => setAssignee(e.target.value)} 
                    placeholder="Unassigned"
                    className="pl-9"
                  />
                </div>
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={handleSave}
                disabled={updateTicket.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {updateTicket.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
