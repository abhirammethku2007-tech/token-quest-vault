import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { FauxQR } from "@/components/FauxQR";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/lib/useRequests";
import { Download, Clock, Users, MessageSquare, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

function formatEta(mins: number) {
  if (mins <= 0) return "Ready";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export default function MyCertificates() {
  const { user } = useAuth();
  const { store } = useRequests();
  const mine = store.forStudent(user!.id);

  return (
    <AppShell role="student">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground mt-1">Track requests in queue and download approved certificates.</p>
        </div>

        {mine.length === 0 && (
          <Card className="glass p-10 text-center text-muted-foreground">No certificates yet.</Card>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {mine.map((r) => {
            const inQueue = r.status === "Pending" || r.status === "Under Review";
            const pos = inQueue ? store.queuePosition(r.id) : 0;
            const eta = inQueue ? store.estimateMinutes(r.id) : 0;
            const totalQueue = Math.max(store.pendingQueue().length, 1);
            return (
              <Card key={r.id} className="glass-strong border-white/50 p-5 hover-lift">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-semibold text-lg">{r.type}</h3>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mt-1">{r.token}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submitted {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {r.status === "Approved" && <FauxQR value={r.token} size={72} />}
                </div>

                {inQueue && (
                  <div className="mt-4 space-y-3 rounded-xl bg-gradient-to-br from-info/5 to-primary/5 p-4 border border-info/20">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-medium text-info">
                        <Users className="h-4 w-4" />
                        You are #{pos} in queue
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Clock className="h-3.5 w-3.5" />
                        ETA {formatEta(eta)}
                      </div>
                    </div>
                    <Progress value={Math.min(100, ((totalQueue - pos + 1) / totalQueue) * 100)} className="h-1.5" />
                  </div>
                )}

                {r.remarks && (
                  <div className="mt-4 text-sm rounded-lg bg-muted/40 p-3 flex gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{r.remarks}</span>
                  </div>
                )}

                {r.status === "Approved" && (
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="text-xs text-success inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Signed • {r.signatureId}
                    </div>
                    <Button
                      onClick={() => toast.success(`Downloading ${r.token}.pdf`)}
                      className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                )}
                {r.status !== "Approved" && (
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">Download available after approval</div>
                    <Button disabled variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
