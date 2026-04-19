import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRequests } from "@/lib/useRequests";
import { CertRequest, RequestStatus } from "@/lib/mockStore";
import { Check, Eye, Search, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminRequests() {
  const { store } = useRequests();
  const [filter, setFilter] = useState<"queue" | "all" | "approved" | "rejected">("queue");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<CertRequest | null>(null);
  const [remarks, setRemarks] = useState("");

  let rows: CertRequest[] =
    filter === "queue" ? store.pendingQueue()
      : filter === "approved" ? store.list().filter((r) => r.status === "Approved")
      : filter === "rejected" ? store.list().filter((r) => r.status === "Rejected")
      : store.list();

  if (q.trim()) {
    const s = q.toLowerCase();
    rows = rows.filter((r) =>
      r.studentName.toLowerCase().includes(s) ||
      r.token.toLowerCase().includes(s) ||
      r.rollNumber.toLowerCase().includes(s)
    );
  }

  const act = (id: string, status: RequestStatus) => {
    store.updateStatus(id, status, remarks || undefined);
    toast.success(`Request ${status.toLowerCase()}`);
    setOpen(null);
    setRemarks("");
  };

  return (
    <AppShell role="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Requests Management</h1>
            <p className="text-muted-foreground mt-1">Sorted by token order — FIFO queue.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, token, roll…" className="glass pl-9" />
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="glass">
            <TabsTrigger value="queue">In Queue</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="glass-strong border-white/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>#</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={r.id} className="hover:bg-accent/40">
                  <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <p className="font-medium">{r.studentName}</p>
                    <p className="text-xs text-muted-foreground">{r.rollNumber} • {r.department}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{r.token}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setOpen(r); setRemarks(r.remarks ?? ""); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {r.status !== "Approved" && (
                        <Button size="icon" variant="ghost" className="text-success hover:bg-success/10" onClick={() => { setOpen(r); setRemarks(""); }}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {r.status !== "Rejected" && (
                        <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => { setOpen(r); setRemarks(""); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No requests</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle className="font-display">Request Details</DialogTitle>
          </DialogHeader>
          {open && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Student" value={open.studentName} />
                <Field label="Roll" value={open.rollNumber} />
                <Field label="Department" value={open.department} />
                <Field label="Type" value={open.type} />
                <Field label="Token" value={open.token} mono />
                <Field label="Status" value={open.status} />
              </div>
              {open.reason && <div className="text-sm"><p className="text-xs text-muted-foreground mb-1">Reason</p><p>{open.reason}</p></div>}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Remarks</p>
                <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional notes for the student" className="glass" />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => open && act(open.id, "Under Review")}>Mark Under Review</Button>
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => open && act(open.id, "Rejected")}>
              <X className="h-4 w-4 mr-1.5" /> Reject
            </Button>
            <Button onClick={() => open && act(open.id, "Approved")} className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
              <Check className="h-4 w-4 mr-1.5" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Field({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={mono ? "font-mono text-sm" : "font-medium"}>{value}</p>
    </div>
  );
}
