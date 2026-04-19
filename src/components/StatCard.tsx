import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "info" | "destructive";
}
const tones: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "from-primary/15 to-primary-glow/15 text-primary",
  success: "from-success/15 to-success/5 text-success",
  warning: "from-warning/15 to-warning/5 text-warning",
  info: "from-info/15 to-info/5 text-info",
  destructive: "from-destructive/15 to-destructive/5 text-destructive",
};

export function StatCard({ label, value, icon, trend, tone = "primary" }: StatCardProps) {
  return (
    <Card className="glass hover-lift p-5 border-white/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold font-display tracking-tight">{value}</p>
          {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
        </div>
        <div className={cn("rounded-xl p-3 bg-gradient-to-br", tones[tone])}>{icon}</div>
      </div>
    </Card>
  );
}
