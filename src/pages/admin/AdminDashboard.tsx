import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { useRequests } from "@/lib/useRequests";
import { Inbox, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminDashboard() {
  const { store } = useRequests();
  const all = store.list();
  const today = new Date().toDateString();
  const approvedToday = all.filter((r) => r.status === "Approved" && new Date(r.updatedAt).toDateString() === today).length;
  const pending = all.filter((r) => r.status === "Pending" || r.status === "Under Review").length;
  const rejected = all.filter((r) => r.status === "Rejected").length;
  const queue = store.pendingQueue().slice(0, 5);

  return (
    <AppShell role="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Process certificate requests in fair token order.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Requests" value={all.length} icon={<Inbox className="h-5 w-5" />} tone="primary" />
          <StatCard label="Pending" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" trend="In FIFO queue" />
          <StatCard label="Approved Today" value={approvedToday} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
          <StatCard label="Rejected" value={rejected} icon={<XCircle className="h-5 w-5" />} tone="destructive" />
        </div>

        <Card className="glass-strong border-white/50">
          <div className="p-5 flex items-center justify-between border-b border-border">
            <div>
              <h2 className="font-display font-semibold text-lg">Next in queue</h2>
              <p className="text-xs text-muted-foreground">Process these in order to keep the queue fair.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/requests">Open queue <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {queue.map((r, i) => (
              <div key={r.id} className="p-4 flex items-center gap-4 hover:bg-accent/40">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{r.studentName} <span className="text-muted-foreground font-normal">• {r.type}</span></p>
                  <p className="font-mono text-xs text-muted-foreground">{r.token}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {queue.length === 0 && <div className="p-10 text-center text-muted-foreground text-sm">Queue is empty 🎉</div>}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
