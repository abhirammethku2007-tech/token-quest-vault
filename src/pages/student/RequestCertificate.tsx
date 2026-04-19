import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { store, CertificateType, CertRequest } from "@/lib/mockStore";
import { Loader2, FileSignature, CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RequestCertificate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<CertificateType>("Bonafide");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<CertRequest | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const req = store.create({
        studentId: user!.id,
        studentName: user!.name,
        rollNumber: user!.rollNumber!,
        department: user!.department!,
        type,
        reason,
      });
      setSuccess(req);
      setSubmitting(false);
    }, 800);
  };

  return (
    <AppShell role="student">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Request a Certificate</h1>
          <p className="text-muted-foreground mt-1">Submit a request — a unique token will be issued instantly.</p>
        </div>

        <Card className="glass-strong p-6 sm:p-8 border-white/50">
          <form onSubmit={submit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={user?.name ?? ""} readOnly className="glass bg-muted/40" />
              </div>
              <div className="space-y-2">
                <Label>Roll Number</Label>
                <Input value={user?.rollNumber ?? ""} readOnly className="glass bg-muted/40" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={user?.department ?? ""} readOnly className="glass bg-muted/40" />
              </div>
              <div className="space-y-2">
                <Label>Certificate Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as CertificateType)}>
                  <SelectTrigger className="glass"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bonafide">Bonafide</SelectItem>
                    <SelectItem value="Study Certificate">Study Certificate</SelectItem>
                    <SelectItem value="Fee Receipt">Fee Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Purpose / Reason (optional)</Label>
              <Textarea
                placeholder="e.g., Required for visa application"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="glass min-h-[100px]"
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                A token like <span className="font-mono font-medium">BON-2026-CSE-0012</span> will be generated.
              </p>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow transition-all hover:scale-[1.02]"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileSignature className="h-4 w-4 mr-2" />}
                Submit Request
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Dialog open={!!success} onOpenChange={(o) => !o && setSuccess(null)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <div className="mx-auto rounded-full bg-success/15 p-3 w-fit mb-2 animate-scale-in">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center font-display text-2xl">Request submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your token has been generated and added to the queue.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary-glow/10 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Token ID</p>
            <p className="font-mono text-xl font-bold gradient-text">{success?.token}</p>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setSuccess(null)}>Submit another</Button>
            <Button
              onClick={() => navigate("/student/certificates")}
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
            >
              View My Certificates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
