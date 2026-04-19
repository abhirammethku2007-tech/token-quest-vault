import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeyRound, RefreshCw, ShieldCheck, Lock, Calendar } from "lucide-react";
import { toast } from "sonner";

const keys = [
  { id: "SIG-MASTER-2026", algo: "Ed25519", status: "Active", created: "2026-01-04", usage: "Primary signing" },
  { id: "SIG-LEGACY-2025", algo: "RSA-2048", status: "Rotated", created: "2025-04-10", usage: "Verification only" },
  { id: "SIG-DR-2026", algo: "Ed25519", status: "Standby", created: "2026-02-22", usage: "Disaster recovery" },
];

export default function SignatureKeys() {
  return (
    <AppShell role="management">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Digital Signature Keys</h1>
            <p className="text-muted-foreground mt-1">Manage cryptographic keys used to sign and verify certificates.</p>
          </div>
          <Button onClick={() => toast.success("New key generated")} className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow">
            <KeyRound className="h-4 w-4 mr-2" /> Generate New
          </Button>
        </div>

        <Card className="glass-strong border-white/50 p-5 bg-gradient-to-br from-primary/5 to-primary-glow/5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-3 bg-gradient-to-br from-primary to-primary-glow btn-glow">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold">All certificates are cryptographically signed</p>
              <p className="text-xs text-muted-foreground">QR codes embed a verifiable hash that prevents tampering.</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {keys.map((k) => (
            <Card key={k.id} className="glass-strong border-white/50 p-5 hover-lift">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-mono font-semibold">{k.id}</span>
                    <Badge variant="outline" className={
                      k.status === "Active" ? "bg-success/10 text-success border-success/30"
                      : k.status === "Standby" ? "bg-info/10 text-info border-info/30"
                      : "bg-muted text-muted-foreground"
                    }>{k.status}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>Algorithm: <strong className="text-foreground">{k.algo}</strong></span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {k.created}</span>
                    <span>{k.usage}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success(`Rotated ${k.id}`)}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Rotate
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
