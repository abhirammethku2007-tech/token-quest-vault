import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllRequests } from "@/lib/useRequests";
import { updateRequestStatus, writeAuditLog } from "@/lib/supabaseService";
import { useAuth } from "@/context/AuthContext";
import { FauxQR } from "@/components/FauxQR";
import { ShieldCheck, FileSignature, Download, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CertificateGeneration() {
  const { user } = useAuth();
  const { requests, loading } = useAllRequests();
  const approved = requests.filter((r) => r.status === "Approved");

  const [selectedId, setSelectedId] = useState<string>("");
  const [signing,    setSigning]    = useState(false);

  const sel = approved.find((r) => r.id === selectedId) ?? approved[0];

  const handleSign = async () => {
    if (!sel || !user) return;
    setSigning(true);
    try {
      const sigId = `SIG-${Math.random().toString(16).slice(2, 8)}`;
      await updateRequestStatus(sel.id, "Approved", { signatureId: sigId });
      await writeAuditLog({
        timestamp:  new Date().toISOString(),
        actor_id:   user.id,
        actor_name: user.name,
        actor_role: user.role,
        action:     "Signed Certificate",
        target:     sel.token,
        details:    `Signature ID: ${sigId}`,
      });
      toast.success("Certificate signed & issued");
    } catch (err: any) {
      toast.error(err?.message ?? "Signing failed");
    } finally {
      setSigning(false);
    }
  };

  return (
    <AppShell role="management">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Certificate Generation</h1>
          <p className="text-muted-foreground mt-1">Preview, sign & issue official certificates.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <Card className="glass-strong border-white/50 p-5 lg:col-span-1 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Select approved request</p>
              <Select value={selectedId || sel?.id} onValueChange={setSelectedId}>
                <SelectTrigger className="glass"><SelectValue placeholder="Choose…" /></SelectTrigger>
                <SelectContent>
                  {approved.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.token} — {r.student_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {sel && (
              <div className="space-y-3 text-sm">
                <Row k="Student"      v={sel.student_name} />
                <Row k="Roll"         v={sel.roll_number} />
                <Row k="Department"   v={sel.department} />
                <Row k="Type"         v={sel.type} />
                <Row k="Signature ID" v={sel.signature_id ?? "Not signed"} mono />
              </div>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={handleSign}
                disabled={signing || !sel}
                className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow"
              >
                {signing
                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  : <FileSignature className="h-4 w-4 mr-2" />}
                Sign & Issue
              </Button>
              <Button
                variant="outline"
                disabled={!sel?.certificate_url}
                onClick={() => sel?.certificate_url
                  ? window.open(sel.certificate_url, "_blank")
                  : toast.info("PDF not yet generated")}
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>
          </Card>

          {/* Certificate preview */}
          <Card className="glass-strong border-white/50 p-2 lg:col-span-2">
            {!sel && !loading && (
              <div className="p-12 text-center text-muted-foreground">Select a request to preview</div>
            )}
            {sel && (
              <div className="rounded-xl bg-gradient-to-br from-white to-primary/5 p-8 sm:p-10 border-4 border-double border-primary/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-[120px] font-display font-black text-primary/5 -rotate-12 select-none">CERTIFIED</p>
                </div>
                <div className="relative">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <div className="rounded-lg p-1.5 bg-gradient-to-br from-primary to-primary-glow">
                        <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <p className="font-display font-bold text-lg">CertVault College</p>
                    </div>
                    <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Office of the Registrar</p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold mt-4 gradient-text">{sel.type}</h2>
                  </div>
                  <p className="text-center text-muted-foreground">This is to certify that</p>
                  <p className="text-center font-display text-2xl font-semibold mt-2">{sel.student_name}</p>
                  <p className="text-center text-sm mt-3 max-w-md mx-auto text-muted-foreground">
                    bearing roll number <strong className="text-foreground">{sel.roll_number}</strong> from the department of{" "}
                    <strong className="text-foreground">{sel.department}</strong>{" "}
                    {sel.type === "Bonafide"                && "is a bonafide student of this institution for the academic year 2025-2026."}
                    {sel.type === "Study Certificate"       && "has been a student of this institution and has successfully completed the prescribed course of study for the academic year 2025-2026."}
                    {sel.type === "Fee Receipt"             && "has paid all prescribed fees for the academic year 2025-2026. This receipt is issued for official records."}
                    {sel.type === "Fee Due Certificate"     && "has the following fee dues pending with this institution for the academic year 2025-2026."}
                    {sel.type === "No Fee Due Certificate"  && "has fully paid all prescribed fees to this institution for the academic year 2025-2026. No fee dues are pending."}
                  </p>
                  <div className="flex items-end justify-between mt-10">
                    <div>
                      <p className="text-xs text-muted-foreground">Issued on</p>
                      <p className="font-medium">{new Date(sel.updated_at).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground mt-3">Token</p>
                      <p className="font-mono text-sm">{sel.token}</p>
                    </div>
                    <div className="text-center">
                      <FauxQR value={sel.token} size={84} />
                      <p className="text-[10px] text-muted-foreground mt-1">Scan to verify</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display italic text-xl text-primary">Dr. V. Rao</p>
                      <div className="h-px w-32 bg-foreground/30 ml-auto my-1" />
                      <p className="text-xs text-muted-foreground">Principal • Digitally Signed</p>
                      {sel.signature_id && (
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5 inline-flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5 text-primary" /> {sel.signature_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2 border-b border-border pb-2">
      <span className="text-muted-foreground">{k}</span>
      <span className={mono ? "font-mono text-xs" : "font-medium"}>{v}</span>
    </div>
  );
}
