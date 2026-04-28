import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { CertRequestRow } from "@/lib/database.types";
import { RealQR } from "@/components/RealQR";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, XCircle, Loader2, ArrowLeft, CheckCircle2, Calendar, Hash, Building, User } from "lucide-react";

export default function VerifyCertificate() {
  const { token }  = useParams<{ token: string }>();
  const navigate   = useNavigate();
  const [cert,     setCert]    = useState<CertRequestRow | null>(null);
  const [loading,  setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return; }
    supabase
      .from("cert_requests")
      .select("*")
      .eq("token", token)
      .eq("status", "Approved")
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setCert(data as CertRequestRow);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl animate-blob" />

      <div className="relative w-full max-w-lg space-y-4 z-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>
        </div>

        <Card className="glass-strong p-8 border-white/50">
          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">Verifying certificate…</p>
            </div>
          )}

          {/* Not found */}
          {!loading && notFound && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto rounded-full bg-destructive/15 p-4 w-fit">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h2 className="font-display text-xl font-bold">Certificate Not Found</h2>
              <p className="text-muted-foreground text-sm">
                The token <span className="font-mono font-semibold">{token}</span> does not match
                any approved certificate in our system.
              </p>
              <p className="text-xs text-muted-foreground">
                This could mean the certificate is fake, pending, or the token is incorrect.
              </p>
            </div>
          )}

          {/* Valid certificate */}
          {!loading && cert && (
            <div className="space-y-6">
              {/* Verified badge */}
              <div className="text-center">
                <div className="mx-auto rounded-full bg-success/15 p-4 w-fit mb-3 animate-scale-in">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h2 className="font-display text-2xl font-bold text-success">Certificate Verified</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  This is an authentic certificate issued by CertVault College
                </p>
              </div>

              {/* QR */}
              <div className="flex justify-center">
                <RealQR value={cert.token} size={120} />
              </div>

              {/* Certificate details */}
              <div className="rounded-xl bg-success/5 border border-success/20 p-5 space-y-3">
                <h3 className="font-display font-semibold text-lg text-center">{cert.type}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Detail icon={User}      label="Student"    value={cert.student_name} />
                  <Detail icon={Hash}      label="Roll No."   value={cert.roll_number} />
                  <Detail icon={Building}  label="Department" value={cert.department} />
                  <Detail icon={Calendar}  label="Issued on"  value={new Date(cert.updated_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} />
                </div>
                <div className="pt-2 border-t border-success/20">
                  <p className="text-xs text-muted-foreground text-center">Token</p>
                  <p className="font-mono text-sm font-semibold text-center mt-0.5">{cert.token}</p>
                </div>
                {cert.signature_id && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-success">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Digitally signed • {cert.signature_id}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-semibold text-primary">CertVault</span> — MLRIT Digital Certificate Portal
        </p>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
