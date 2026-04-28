import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyRound, RefreshCw, ShieldCheck, Lock, Calendar, Loader2 } from "lucide-react";
import { subscribeToSignatureKeys, addSignatureKey, updateSignatureKeyStatus, writeAuditLog } from "@/lib/supabaseService";
import { useAuth } from "@/context/AuthContext";
import type { SignatureKeyRow } from "@/lib/database.types";
import { toast } from "sonner";

export default function SignatureKeys() {
  const { user } = useAuth();
  const [keys,      setKeys]      = useState<SignatureKeyRow[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [rotating,  setRotating]  = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToSignatureKeys((data) => {
      setKeys(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const newKey = await addSignatureKey({
        label:      `Key-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
        algorithm:  "Ed25519",
        status:     "Active",
        created_by: user.id,
        rotated_at: null,
      });
      await writeAuditLog({
        timestamp:  new Date().toISOString(),
        actor_id:   user.id,
        actor_name: user.name,
        actor_role: user.role,
        action:     "Key Rotated",
        target:     newKey.id,
        details:    "New Ed25519 key generated",
      });
      toast.success("New key generated");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate key");
    } finally {
      setGenerating(false);
    }
  };

  const handleRotate = async (key: SignatureKeyRow) => {
    if (!user) return;
    setRotating(key.id);
    try {
      await updateSignatureKeyStatus(key.id, "Rotated");
      await writeAuditLog({
        timestamp:  new Date().toISOString(),
        actor_id:   user.id,
        actor_name: user.name,
        actor_role: user.role,
        action:     "Key Rotated",
        target:     key.id,
        details:    `Key ${key.label} rotated`,
      });
      toast.success(`Rotated ${key.label}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Rotation failed");
    } finally {
      setRotating(null);
    }
  };

  return (
    <AppShell role="admin">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Digital Signature Keys</h1>
            <p className="text-muted-foreground mt-1">Manage cryptographic keys used to sign and verify certificates.</p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow"
          >
            {generating
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <KeyRound className="h-4 w-4 mr-2" />}
            Generate New
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
          {loading && Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
          {!loading && keys.map((k) => (
            <Card key={k.id} className="glass-strong border-white/50 p-5 hover-lift">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-mono font-semibold">{k.label}</span>
                    <Badge variant="outline" className={
                      k.status === "Active"  ? "bg-success/10 text-success border-success/30"
                      : k.status === "Rotated" ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                    }>
                      {k.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>Algorithm: <strong className="text-foreground">{k.algorithm}</strong></span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(k.created_at).toLocaleDateString()}
                    </span>
                    {k.rotated_at && (
                      <span className="inline-flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Rotated {new Date(k.rotated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {k.status === "Active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={rotating === k.id}
                    onClick={() => handleRotate(k)}
                  >
                    {rotating === k.id
                      ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      : <RefreshCw className="h-3.5 w-3.5 mr-1.5" />}
                    Rotate
                  </Button>
                )}
              </div>
            </Card>
          ))}
          {!loading && keys.length === 0 && (
            <Card className="glass p-10 text-center text-muted-foreground">
              No signature keys yet. Generate one to start signing certificates.
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
