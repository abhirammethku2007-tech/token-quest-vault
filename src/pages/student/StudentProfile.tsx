import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Mail, GraduationCap, Hash, Building, ShieldCheck, Pencil, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";

const departments = ["CSE", "ECE", "MEC", "IT", "CIVIL", "EEE"];

export default function StudentProfile() {
  const { user } = useAuth();

  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [name,       setName]       = useState(user?.name ?? "");
  const [rollNumber, setRollNumber] = useState(user?.rollNumber ?? "");
  const [department, setDepartment] = useState(user?.department ?? "");

  const handleSave = async () => {
    if (!name.trim())       { toast.error("Name cannot be empty"); return; }
    if (!rollNumber.trim()) { toast.error("Roll number cannot be empty"); return; }
    if (!department)        { toast.error("Please select a department"); return; }

    setSaving(true);
    try {
      // Update Supabase profile
      const { error } = await supabase
        .from("profiles")
        .update({ name: name.trim(), roll_number: rollNumber.trim().toUpperCase(), department })
        .eq("id", user!.id);
      if (error) throw error;

      // Update auth metadata so AuthContext picks it up on next session
      await supabase.auth.updateUser({
        data: { name: name.trim(), roll_number: rollNumber.trim().toUpperCase(), department },
      });

      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name ?? "");
    setRollNumber(user?.rollNumber ?? "");
    setDepartment(user?.department ?? "");
    setEditing(false);
  };

  return (
    <AppShell role="student">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Profile</h1>
          {!editing && (
            <Button variant="outline" onClick={() => setEditing(true)} className="glass">
              <Pencil className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>

        <Card className="glass-strong p-6 border-white/50">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-2xl font-display font-bold btn-glow">
              {(name || user?.name)?.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-success bg-success/10 rounded-full px-2.5 py-1">
                <ShieldCheck className="h-3 w-3" /> Verified account
              </div>
            </div>
          </div>

          {/* View mode */}
          {!editing && (
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Full name",    value: user?.name,        icon: GraduationCap },
                { label: "Email",        value: user?.email,       icon: Mail },
                { label: "Roll number",  value: user?.rollNumber,  icon: Hash },
                { label: "Department",   value: user?.department,  icon: Building },
              ].map((f) => (
                <div key={f.label} className="glass rounded-xl p-4 flex gap-3">
                  <f.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="font-medium">{f.value ?? "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit mode */}
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="glass" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Roll Number</Label>
                  <Input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className="glass" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="glass"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email ?? ""} readOnly className="glass bg-muted/40" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving}
                  className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
