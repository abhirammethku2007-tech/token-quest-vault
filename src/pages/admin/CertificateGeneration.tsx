import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAllRequests } from "@/lib/useRequests";
import { updateRequestStatus, writeAuditLog } from "@/lib/supabaseService";
import { useAuth } from "@/context/AuthContext";
import { RealQR } from "@/components/RealQR";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck, FileSignature, Download, Sparkles,
  Loader2, Search, Eye, CheckCircle2, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { generateCertificatePDF } from "@/lib/generateCertificatePDF";
import type { CertRequestRow } from "@/lib/database.types";

// ─── Certificate body text ────────────────────────────────────
const certBody: Record<string, string> = {
  "Bonafide":
    "is a bonafide student of this institution and is currently pursuing studies for the academic year 2025–2026.",
  "Study Certificate":
    "has been a student of this institution and has successfully completed the prescribed course of study for the academic year 2025–2026.",
  "Fee Receipt":
    "has duly paid all prescribed tuition fees, examination fees, and other charges for the academic year 2025–2026.",
  "Fee Due Certificate":
    "has the following fee dues pending with this institution for the academic year 2025–2026.",
  "No Fee Due Certificate":
    "has fully cleared all prescribed fees and charges to this institution for the academic year 2025–2026. No fee dues are pending.",
};

// ─── Certificate Preview (beautiful design) ───────────────────
function CertPreview({ cert }: { cert: CertRequestRow }) {
  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-primary/20"
      style={{ fontFamily: "Georgia, serif" }}>

      {/* Top decorative bar */}
      <div className="h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <p className="text-[100px] font-black text-indigo-50 -rotate-12 tracking-widest">CERTIFIED</p>
      </div>

      {/* Corner ornaments */}
      <div className="absolute top-3 left-3 h-16 w-16 border-l-4 border-t-4 border-indigo-200 rounded-tl-xl" />
      <div className="absolute top-3 right-3 h-16 w-16 border-r-4 border-t-4 border-indigo-200 rounded-tr-xl" />
      <div className="absolute bottom-3 left-3 h-16 w-16 border-l-4 border-b-4 border-indigo-200 rounded-bl-xl" />
      <div className="absolute bottom-3 right-3 h-16 w-16 border-r-4 border-b-4 border-indigo-200 rounded-br-xl" />

      <div className="relative px-10 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xl text-gray-800 tracking-wide">MLRIT CertVault</p>
              <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">Marri Laxman Reddy Institute</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent my-4" />
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">Office of the Registrar</p>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-wide">
            {cert.type.toUpperCase()}
          </h2>
        </div>

        {/* Body */}
        <div className="text-center space-y-3 mb-8">
          <p className="text-gray-500 text-sm italic">This is to certify that</p>
          <div>
            <p className="text-2xl font-bold text-gray-800">{cert.student_name}</p>
            <div className="h-0.5 w-48 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mt-1" />
          </div>
          <p className="text-sm text-gray-600">
            Roll No. <span className="font-semibold text-gray-800">{cert.roll_number}</span>
            {" · "}
            Dept. of <span className="font-semibold text-gray-800">{cert.department}</span>
          </p>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            {certBody[cert.type] ?? "is a registered student of this institution."}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-100">
          {/* Left — token & date */}
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Token</p>
            <p className="font-mono text-xs font-semibold text-gray-700">{cert.token}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-2">Issued on</p>
            <p className="text-xs text-gray-700">
              {new Date(cert.updated_at).toLocaleDateString("en-IN", {
                day: "2-digit", month: "long", year: "numeric",
              })}
            </p>
          </div>

          {/* Center — QR */}
          <div className="text-center">
            <RealQR value={cert.token} size={80} />
            <p className="text-[9px] text-gray-400 mt-1">Scan to verify</p>
          </div>

          {/* Right — signature */}
          <div className="text-right">
            <p className="font-bold text-lg text-indigo-600 italic" style={{ fontFamily: "cursive" }}>
              Dr. Ramesh Kumar
            </p>
            <div className="h-px w-36 bg-gray-300 ml-auto my-1" />
            <p className="text-xs text-gray-500">Principal</p>
            {cert.signature_id ? (
              <div className="inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 rounded-full px-2 py-0.5 mt-1">
                <CheckCircle2 className="h-2.5 w-2.5" />
                {cert.signature_id}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 mt-1">
                <Clock className="h-2.5 w-2.5" />
                Pending signature
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
    </div>
  );
}

// ─── Request Card ─────────────────────────────────────────────
function RequestCard({
  cert,
  onPreview,
  onSign,
  onDownload,
  signing,
}: {
  cert: CertRequestRow;
  onPreview: () => void;
  onSign: () => void;
  onDownload: () => void;
  signing: boolean;
}) {
  return (
    <Card className="glass-strong border-white/50 p-4 hover-lift">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-semibold truncate">{cert.student_name}</p>
          <p className="text-xs text-muted-foreground">{cert.roll_number} · {cert.department}</p>
          <p className="font-mono text-xs text-primary mt-1">{cert.token}</p>
        </div>
        <Badge variant="outline" className={
          cert.signature_id
            ? "bg-success/10 text-success border-success/30 shrink-0"
            : "bg-warning/10 text-warning border-warning/30 shrink-0"
        }>
          {cert.signature_id ? "Signed" : "Unsigned"}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{cert.type}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onPreview} className="flex-1 glass">
          <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
        </Button>
        {!cert.signature_id && (
          <Button size="sm" onClick={onSign} disabled={signing}
            className="flex-1 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
            {signing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSignature className="h-3.5 w-3.5 mr-1.5" />}
            Sign
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onDownload} className="glass">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function CertificateGeneration() {
  const { user }                    = useAuth();
  const { requests, loading }       = useAllRequests();
  const approved                    = requests.filter((r) => r.status === "Approved");

  const [q,          setQ]          = useState("");
  const [preview,    setPreview]    = useState<CertRequestRow | null>(null);
  const [signingId,  setSigningId]  = useState<string | null>(null);

  const filtered = approved.filter((r) => {
    const s = q.toLowerCase();
    return !s || r.student_name.toLowerCase().includes(s)
      || r.roll_number.toLowerCase().includes(s)
      || r.department.toLowerCase().includes(s)
      || r.token.toLowerCase().includes(s);
  });

  const handleSign = async (cert: CertRequestRow) => {
    if (!user) return;
    setSigningId(cert.id);
    try {
      const sigId = `SIG-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
      await updateRequestStatus(cert.id, "Approved", { signatureId: sigId });
      await writeAuditLog({
        timestamp:  new Date().toISOString(),
        actor_id:   user.id,
        actor_name: user.name,
        actor_role: user.role,
        action:     "Signed Certificate",
        target:     cert.token,
        details:    `Signature ID: ${sigId}`,
      });
      toast.success(`Certificate signed — ${cert.token}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Signing failed");
    } finally {
      setSigningId(null);
    }
  };

  const handleDownload = (cert: CertRequestRow) => {
    generateCertificatePDF(cert).then(() =>
      toast.success(`Downloaded ${cert.token}.pdf`)
    ).catch(() => toast.error("PDF generation failed"));
  };

  return (
    <AppShell role="management">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Certificate Generation</h1>
            <p className="text-muted-foreground mt-1">
              Sign and issue certificates for all approved requests.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-xl px-3 py-1.5 text-sm">
              <span className="text-muted-foreground">Total: </span>
              <span className="font-semibold">{approved.length}</span>
              <span className="text-muted-foreground ml-3">Signed: </span>
              <span className="font-semibold text-success">{approved.filter(r => r.signature_id).length}</span>
              <span className="text-muted-foreground ml-3">Pending: </span>
              <span className="font-semibold text-warning">{approved.filter(r => !r.signature_id).length}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, roll, department…"
            className="glass pl-9"
          />
        </div>

        {/* Cards grid */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <Card className="glass p-12 text-center text-muted-foreground">
            {approved.length === 0
              ? "No approved requests yet. Approve requests from the Requests page first."
              : "No results match your search."}
          </Card>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert) => (
              <RequestCard
                key={cert.id}
                cert={cert}
                onPreview={() => setPreview(cert)}
                onSign={() => handleSign(cert)}
                onDownload={() => handleDownload(cert)}
                signing={signingId === cert.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl p-4 bg-transparent border-none shadow-none">
          {preview && (
            <div className="space-y-4">
              <CertPreview cert={preview} />
              <div className="flex gap-3 justify-center">
                {!preview.signature_id && (
                  <Button
                    onClick={() => { handleSign(preview); setPreview(null); }}
                    disabled={signingId === preview.id}
                    className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow"
                  >
                    <FileSignature className="h-4 w-4 mr-2" /> Sign & Issue
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDownload(preview)}
                  className="glass"
                >
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
