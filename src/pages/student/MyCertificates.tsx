import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { FauxQR } from "@/components/FauxQR";
import { RealQR } from "@/components/RealQR";
import { useAuth } from "@/context/AuthContext";
import { useStudentRequests, getQueuePosition, estimateWaitMinutes } from "@/lib/useRequests";
import { Download, Clock, Users, MessageSquare, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { CertRequestRow } from "@/lib/database.types";
import { generateCertificatePDF } from "@/lib/generateCertificatePDF";

function formatEta(mins: number) {
  if (mins <= 0) return "Ready";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function CertCard({ r, queueLength }: { r: CertRequestRow; queueLength: number }) {
  const inQueue = r.status === "Pending" || r.status === "Under Review";
  const [pos, setPos] = useState(0);
  const [eta, setEta] = useState(0);

  useEffect(() => {
    if (!inQueue) return;
    getQueuePosition(r.id).then(setPos);
    estimateWaitMinutes(r.id).then(setEta);
  }, [r.id, inQueue]);

  return (
    <Card className="glass-strong border-white/50 p-5 hover-lift">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-lg">{r.type}</h3>
            <StatusBadge status={r.status} />
          </div>
          <p className="font-mono text-xs text-muted-foreground mt-1">{r.token}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submitted {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
        {r.status === "Approved" && <RealQR value={r.token} size={72} />}
      </div>

      {inQueue && (
        <div className="mt-4 space-y-3 rounded-xl bg-gradient-to-br from-info/5 to-primary/5 p-4 border border-info/20">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 font-medium text-info">
              <Users className="h-4 w-4" />
              {pos > 0 ? `You are #${pos} in queue` : "Calculating position…"}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5" />
              ETA {formatEta(eta)}
            </div>
          </div>
          <Progress
            value={pos > 0 ? Math.min(100, ((queueLength - pos + 1) / Math.max(queueLength, 1)) * 100) : 0}
            className="h-1.5"
          />
        </div>
      )}

      {r.remarks && (
        <div className="mt-4 text-sm rounded-lg bg-muted/40 p-3 flex gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{r.remarks}</span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        {r.status === "Approved" ? (
          <>
            <div className="text-xs text-success inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Signed • {r.signature_id}
            </div>
            <Button
              onClick={() => {
                if (r.certificate_url) {
                  window.open(r.certificate_url, "_blank");
                } else {
                  generateCertificatePDF(r)
                    .then(() => toast.success(`Downloading ${r.token}.pdf`))
                    .catch(() => toast.error("PDF generation failed"));
                }
              }}
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </>
        ) : (
          <>
            <div className="text-xs text-muted-foreground">Download available after approval</div>
            <Button disabled variant="outline">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

export default function MyCertificates() {
  const { requests, loading } = useStudentRequests();
  const queueLength = requests.filter(
    (r) => r.status === "Pending" || r.status === "Under Review"
  ).length;

  return (
    <AppShell role="student">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground mt-1">Track requests in queue and download approved certificates.</p>
        </div>

        {loading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <Card className="glass p-10 text-center text-muted-foreground">No certificates yet.</Card>
        )}

        {!loading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {requests.map((r) => (
              <CertCard key={r.id} r={r} queueLength={queueLength} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
