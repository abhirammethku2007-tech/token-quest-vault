import { Clock, Eye, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/lib/database.types";

const map: Record<RequestStatus, { label: string; cls: string; Icon: any }> = {
  "Pending":      { label: "Pending",      cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",  Icon: Clock },
  "Under Review": { label: "Under Review", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",     Icon: Eye },
  "Approved":     { label: "Approved",     cls: "bg-green-500/10 text-green-400 border-green-500/20",  Icon: CheckCircle2 },
  "Rejected":     { label: "Rejected",     cls: "bg-red-500/10 text-red-400 border-red-500/20",        Icon: XCircle },
};

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const { label, cls, Icon } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium border rounded-full px-2.5 py-1", cls, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
