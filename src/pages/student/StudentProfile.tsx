import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Mail, GraduationCap, Hash, Building, ShieldCheck } from "lucide-react";

export default function StudentProfile() {
  const { user } = useAuth();
  const fields = [
    { label: "Full name", value: user?.name, icon: GraduationCap },
    { label: "Email", value: user?.email, icon: Mail },
    { label: "Roll number", value: user?.rollNumber, icon: Hash },
    { label: "Department", value: user?.department, icon: Building },
  ];
  return (
    <AppShell role="student">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <Card className="glass-strong p-6 border-white/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-2xl font-display font-bold btn-glow">
              {user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">Student • {user?.id}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-success bg-success/10 rounded-full px-2.5 py-1">
                <ShieldCheck className="h-3 w-3" /> Verified account
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="glass rounded-xl p-4 flex gap-3">
                <f.icon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="font-medium">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
