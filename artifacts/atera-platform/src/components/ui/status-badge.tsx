import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "device" | "alert" | "ticket" | "customer";
  className?: string;
}

export function StatusBadge({ status, type = "device", className }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case "online":
      case "active":
      case "resolved":
      case "closed":
      case "info":
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
      
      case "warning":
      case "medium":
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20";
        
      case "critical":
      case "offline":
      case "high":
      case "inactive":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20";
        
      case "open":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
        
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formattedStatus = status.replace("_", " ").toUpperCase();

  return (
    <Badge variant="outline" className={cn("font-medium text-[10px] tracking-wider px-2 py-0.5 uppercase", getStyle(), className)}>
      {formattedStatus}
    </Badge>
  );
}
