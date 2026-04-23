import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, ShieldCheck } from "lucide-react";
import { useState } from "react";

const users = [
  { id: "S101", name: "Aarav Sharma", role: "Student", dept: "CSE", status: "Active" },
  { id: "S102", name: "Priya Verma", role: "Student", dept: "ECE", status: "Active" },
  { id: "S103", name: "Rahul Iyer", role: "Student", dept: "MEC", status: "Active" },
  { id: "S104", name: "Sneha Kapoor", role: "Student", dept: "CSE", status: "Active" },
  { id: "S105", name: "Mohit Yadav", role: "Student", dept: "IT", status: "Suspended" },
  { id: "A001", name: "Neha Pillai", role: "Admin", dept: "Registrar", status: "Active" },
  { id: "M001", name: "Dr. Vikram Rao", role: "Management", dept: "Principal", status: "Active" },
];

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const filtered = users.filter((u) => `${u.name} ${u.id} ${u.dept}`.toLowerCase().includes(q.toLowerCase()));
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
                <TableHead>ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id} className="hover:bg-accent/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="font-medium">{u.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                      {u.role === "Admin" || u.role === "Management" ? <ShieldCheck className="h-3 w-3 mr-1" /> : null}
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.dept}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={u.status === "Active" ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}>
                      {u.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
