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
import { Loader2, FileSignature, CheckCircle2, Sparkles, Globe, Building, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type RequestMode = "online" | "offline";

export default function RequestCertificate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<RequestMode>("online");
  const [type, setType] = useState<CertificateType>("Bonafide");
  const [reason, setReason] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<CertRequest | null>(null);
  const [offlineSuccess, setOfflineSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "offline" && !visitDate) return;
    setSubmitting(true);
    setTimeout(() => {
      if (mode === "online") {
        const req = store.create({
          studentId: user!.id,
          studentName: user!.name,
          rollNumber: user!.rollNumber!,
          department: user!.department!,
          type,
          reason,
        });
        setSuccess(req);
      } else {
        setOfflineSuccess(true);
      }
      setSubmitting(false);
    }, 800);
  };

  return (
    <AppShell role="student">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Request a Certificate</h1>
          <p className="text-muted-foreground mt-1">Choose how you'd like to receive your certificate.</p>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMode("online")}
            className={cn(
              "rounded-xl p-4 border-2 text-left transition-all hover-lift",
              mode === "online"
                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <Globe className={cn("h-6 w-6 mb-2", mode === "online" ? "text-primary" : "text-muted-foreground")} />
            <p className="font-semibold text-sm">Online</p>
            <p className="text-xs text-muted-foreground mt-0.5">PDF certificate generated & delivered digitally</p>
          </button>
          <button
            type="button"
            onClick={() => setMode("offline")}
            className={cn(
              "rounded-xl p-4 border-2 text-left transition-all hover-lift",
              mode === "offline"
                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <Building className={cn("h-6 w-6 mb-2", mode === "offline" ? "text-primary" : "text-muted-foreground")} />
            <p className="font-semibold text-sm">Offline</p>
            <p className="text-xs text-muted-foreground mt-0.5">Collect certificate in-person at the college office</p>
          </button>
        </div>

        <Card className="glass-strong p-6 sm:p-8 border-white/50 dark:border-white/10">
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
                    <SelectItem value="Fee Due Certificate">Fee Due Certificate</SelectItem>
                    <SelectItem value="No Fee Due Certificate">No Fee Due Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {mode === "offline" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Preferred Visit Date
                </Label>
                <Input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="glass"
                  required
                />
                <p className="text-[11px] text-muted-foreground">Select a date to visit the college office for collection.</p>
              </div>
            )}

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
                {mode === "online"
                  ? <>A token like <span className="font-mono font-medium">BON-2026-CSE-0012</span> will be generated.</>
                  : <>Your visit will be scheduled for the selected date.</>
                }
              </p>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow transition-all hover:scale-[1.02]"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileSignature className="h-4 w-4 mr-2" />}
                {mode === "online" ? "Submit Request" : "Schedule Visit"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Online success */}
      <Dialog open={!!success} onOpenChange={(o) => !o && setSuccess(null)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <div className="mx-auto rounded-full bg-success/15 p-3 w-fit mb-2 animate-scale-in">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center font-display text-2xl">Request submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your token has been generated and added to the queue. The PDF certificate will be available once approved.
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

      {/* Offline success */}
      <Dialog open={offlineSuccess} onOpenChange={(o) => !o && setOfflineSuccess(false)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <div className="mx-auto rounded-full bg-success/15 p-3 w-fit mb-2 animate-scale-in">
              <Building className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center font-display text-2xl">Visit Scheduled!</DialogTitle>
            <DialogDescription className="text-center">
              Please visit the college certificate office on the selected date with your college ID card.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary-glow/10 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Visit Date</p>
            <p className="font-mono text-xl font-bold gradient-text">
              {visitDate ? new Date(visitDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Certificate: {type}</p>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={() => { setOfflineSuccess(false); setVisitDate(""); }}>Schedule another</Button>
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
