import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff, GraduationCap, ShieldCheck, Building2, Loader2, Sparkles } from "lucide-react";
import { useAuth, Role } from "@/context/AuthContext";
import { toast } from "sonner";

const demoUsers: Record<Role, { id: string; name: string; email: string; department?: string; rollNumber?: string; designation?: string }> = {
  student: { id: "S101", name: "Aarav Sharma", email: "aarav@college.edu", department: "CSE", rollNumber: "21CSE011" },
  admin: { id: "A001", name: "Neha Pillai", email: "neha.admin@college.edu", designation: "Registrar" },
  management: { id: "M001", name: "Dr. Vikram Rao", email: "principal@college.edu", designation: "Principal" },
};

const tabMeta: Record<Role, { label: string; icon: any; idLabel: string; placeholder: string }> = {
  student: { label: "Student", icon: GraduationCap, idLabel: "Student ID", placeholder: "S101" },
  admin: { label: "Admin", icon: ShieldCheck, idLabel: "Admin ID", placeholder: "A001" },
  management: { label: "Management", icon: Building2, idLabel: "Management ID", placeholder: "M001" },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("student");
  const [showPw, setShowPw] = useState(false);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const demo = demoUsers[role];
      const userId = id || demo.id;
      login({ ...demo, id: userId, role });
      toast.success(`Welcome, ${demo.name}`);
      navigate(`/${role}`);
    }, 900);
  };

  const useDemo = () => {
    const demo = demoUsers[role];
    setId(demo.id);
    setPw("demo1234");
  };

  return (
    <div className="min-h-screen relative overflow-hidden gradient-bg flex items-center justify-center p-4">
      {/* Floating blobs */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Brand side */}
        <div className="hidden lg:block space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Trusted by 12,000+ students & faculty
          </div>
          <h1 className="text-5xl font-display font-bold leading-tight">
            <span className="gradient-text">CertVault</span>
            <br />
            Secure Certificate Portal
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Issue, track and verify college certificates with cryptographic signatures and a fair token-based queue.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md pt-4">
            {[
              { k: "Verified", v: "QR + Signature" },
              { k: "Fair Queue", v: "FIFO Tokens" },
              { k: "Real-time", v: "Live Status" },
            ].map((f) => (
              <div key={f.k} className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">{f.k}</p>
                <p className="text-sm font-semibold">{f.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Login card */}
        <Card className="glass-strong p-6 sm:p-8 border-white/50 animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl p-2.5 bg-gradient-to-br from-primary to-primary-glow btn-glow">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Sign in</h2>
              <p className="text-xs text-muted-foreground">Choose your role to continue</p>
            </div>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 glass">
              {(["student", "admin", "management"] as Role[]).map((r) => {
                const M = tabMeta[r];
                return (
                  <TabsTrigger key={r} value={r} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
                    <M.icon className="h-3.5 w-3.5 mr-1.5" />
                    {M.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(["student", "admin", "management"] as Role[]).map((r) => (
              <TabsContent key={r} value={r}>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="uid">{tabMeta[r].idLabel}</Label>
                    <Input id="uid" placeholder={tabMeta[r].placeholder} value={id} onChange={(e) => setId(e.target.value)} className="glass" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pw">Password</Label>
                    <div className="relative">
                      <Input
                        id="pw"
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        className="glass pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-95 btn-glow text-primary-foreground font-semibold transition-all hover:scale-[1.02]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Sign in as ${tabMeta[r].label}`}
                  </Button>

                  <button type="button" onClick={useDemo} className="w-full text-xs text-primary hover:underline">
                    Use demo credentials
                  </button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
          <p className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
            Protected by digital signature verification
          </p>
        </Card>
      </div>
    </div>
  );
}
