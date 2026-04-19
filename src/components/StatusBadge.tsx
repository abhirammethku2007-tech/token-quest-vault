import { Badge } from "@/components/ui/badge";
import { Clock, Eye, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/lib/mockStore";

const map: Record<RequestStatus, { label: string; cls: string; Icon: any }> = {
  "Pending": { label: "Pending", cls: "bg-warning/15 text-warning border-warning/30", Icon: Clock },
  "Under Review": { label: "Under Review", cls: "bg-info/15 text-info border-info/30", Icon: Eye },
  "Approved": { label: "Approved", cls: "bg-success/15 text-success border-success/30", Icon: CheckCircle2 },
  "Rejected": { label: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: XCircle },
};

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const { label, cls, Icon } = map[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium border", cls, className)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
