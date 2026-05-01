import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "info" | "destructive";
}

const tones: Record<NonNullable<StatCardProps["tone"]>, { icon: string; value: string; border: string }> = {
  primary:     { icon: "bg-violet-500/15 text-violet-400",  value: "text-violet-400",  border: "border-violet-500/10" },
  success:     { icon: "bg-green-500/15 text-green-400",    value: "text-green-400",   border: "border-green-500/10" },
  warning:     { icon: "bg-amber-500/15 text-amber-400",    value: "text-amber-400",   border: "border-amber-500/10" },
  info:        { icon: "bg-blue-500/15 text-blue-400",      value: "text-blue-400",    border: "border-blue-500/10" },
  destructive: { icon: "bg-red-500/15 text-red-400",        value: "text-red-400",     border: "border-red-500/10" },
};

export function StatCard({ label, value, icon, trend, tone = "primary" }: StatCardProps) {
  const t = tones[tone];
  return (
    <div className={cn(
      "bg-white/[0.03] border rounded-2xl p-5 hover:bg-white/[0.05] transition-colors",
      t.border
    )}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{label}</p>
          <p className={cn("mt-2 text-3xl font-black tracking-tight", t.value)}>{value}</p>
          {trend && <p className="mt-1 text-xs text-white/25">{trend}</p>}
        </div>
        <div className={cn("rounded-xl p-2.5", t.icon)}>{icon}</div>
      </div>
    </div>
  );
}
