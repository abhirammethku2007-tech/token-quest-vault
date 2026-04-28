import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, ShieldCheck } from "lucide-react";
import { getAllUsers } from "@/lib/supabaseService";
import type { ProfileRow } from "@/lib/database.types";

export default function AdminUsers() {
  const [users,   setUsers]   = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q,       setQ]       = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.department ?? ""} ${u.roll_number ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  const roleLabel: Record<string, string> = {
    student:    "Student",
    management: "Management",
    admin:      "Admin",
  };

  return (
    <AppShell role="management">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage students, admins and management accounts.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="glass pl-9" />
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
              <UserPlus className="h-4 w-4 mr-2" /> Add user
            </Button>
          </div>
        </div>

        <Card className="glass-strong border-white/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department / Designation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
              ))}
              {!loading && filtered.map((u) => (
                <TableRow key={u.id} className="hover:bg-accent/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="font-medium">{u.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                      {u.role !== "student" && <ShieldCheck className="h-3 w-3 mr-1" />}
                      {roleLabel[u.role] ?? u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {u.department
                      ? <span>{u.department}{u.roll_number ? ` • ${u.roll_number}` : ""}</span>
                      : <span className="text-muted-foreground">{u.designation ?? "—"}</span>}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
