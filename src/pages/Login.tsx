import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye, EyeOff, GraduationCap, ShieldCheck, Building2,
  Loader2, Sparkles, UserPlus, LogIn,
} from "lucide-react";
import { useAuth, Role } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────
const ADMIN_SECRET = "MLRIT@ADMIN2026"; // change this to your own secret

const tabMeta: Record<Role, { label: string; icon: any; placeholder: string }> = {
  student:    { label: "Student",    icon: GraduationCap, placeholder: "21cse011@mlrit.ac.in" },
  management: { label: "Management", icon: Building2,     placeholder: "neha@mlrit.ac.in" },
  admin:      { label: "Admin",      icon: ShieldCheck,   placeholder: "principal@mlrit.ac.in" },
};

const departments = ["CSE", "ECE", "MEC", "IT", "CIVIL", "EEE"];
const mgmtDesignations = ["Registrar", "Vice Principal", "HOD", "Dean", "Coordinator"];

// ─── Types ────────────────────────────────────────────────────
type Mode = "login" | "signup";

// ─── Main Component ───────────────────────────────────────────
export default function Login() {
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const { login }     = useAuth();

  const [mode,    setMode]    = useState<Mode>(() =>
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [role,    setRole]    = useState<Role>("student");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [pw,    setPw]    = useState("");

  // Signup fields
  const [signupName,        setSignupName]        = useState("");
  const [signupEmail,       setSignupEmail]        = useState("");
  const [signupPw,          setSignupPw]           = useState("");
  const [signupConfirmPw,   setSignupConfirmPw]    = useState("");
  const [signupRollNumber,  setSignupRollNumber]   = useState("");
  const [signupDepartment,  setSignupDepartment]   = useState("");
  const [signupDesignation, setSignupDesignation]  = useState("");
  const [signupEmployeeId,  setSignupEmployeeId]   = useState("");
  const [signupAdminCode,   setSignupAdminCode]    = useState("");

  const switchMode = (m: Mode) => {
    setMode(m);
    setEmail(""); setPw("");
    setSignupName(""); setSignupEmail(""); setSignupPw(""); setSignupConfirmPw("");
    setSignupRollNumber(""); setSignupDepartment(""); setSignupDesignation("");
    setSignupEmployeeId(""); setSignupAdminCode("");
  };

  // ─── Login handler ──────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    if (!pw)           { toast.error("Please enter your password"); return; }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), pw);
      toast.success("Welcome back!");
      navigate(`/${role}`);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg.includes("Invalid login") || msg.includes("invalid_credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(msg || "Sign in failed");
      }
      setLoading(false);
    }
  };

  // ─── Signup handler ─────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!signupName.trim())  { toast.error("Please enter your full name"); return; }
    if (!signupEmail.trim()) { toast.error("Please enter your email"); return; }
    if (signupPw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (signupPw !== signupConfirmPw) { toast.error("Passwords do not match"); return; }

    if (role === "student") {
      if (!signupRollNumber.trim()) { toast.error("Please enter your roll number"); return; }
      if (!signupDepartment)        { toast.error("Please select your department"); return; }
    }
    if (role === "management") {
      if (!signupDesignation) { toast.error("Please select your designation"); return; }
      if (!signupEmployeeId.trim()) { toast.error("Please enter your employee ID"); return; }
    }
    if (role === "admin") {
      if (!signupDesignation) { toast.error("Please enter your designation"); return; }
      if (!signupEmployeeId.trim()) { toast.error("Please enter your employee ID"); return; }
      if (signupAdminCode !== ADMIN_SECRET) {
        toast.error("Invalid admin secret code");
        return;
      }
    }

    setLoading(true);
    try {
      // Build metadata — stored in auth.users and used by AuthContext instantly
      const metadata: Record<string, string> = {
        name: signupName.trim(),
        role,
        ...(role === "student" && {
          department:  signupDepartment,
          roll_number: signupRollNumber.trim().toUpperCase(),
        }),
        ...(role !== "student" && {
          designation: signupDesignation,
          employee_id: signupEmployeeId.trim(),
        }),
      };

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email:    signupEmail.trim().toLowerCase(),
        password: signupPw,
        options:  { data: metadata },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed — no user returned");

      // Create profile row manually (trigger may not fire for all cases)
      await supabase.from("profiles").upsert({
        id:          data.user.id,
        name:        signupName.trim(),
        email:       signupEmail.trim().toLowerCase(),
        role,
        department:  role === "student" ? signupDepartment : null,
        roll_number: role === "student" ? signupRollNumber.trim().toUpperCase() : null,
        designation: role !== "student" ? signupDesignation : null,
      } as any);

      toast.success("Account created! Signing you in…");

      // Sign in immediately after signup
      await login(signupEmail.trim().toLowerCase(), signupPw);
      navigate(`/${role}`);

    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        toast.error("This email is already registered. Please sign in.");
      } else {
        toast.error(msg || "Signup failed. Please try again.");
      }
      setLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden gradient-bg flex items-center justify-center p-4">
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left branding panel */}
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
              { k: "Verified",   v: "QR + Signature" },
              { k: "Fair Queue", v: "FIFO Tokens" },
              { k: "Real-time",  v: "Live Status" },
            ].map((f) => (
              <div key={f.k} className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">{f.k}</p>
                <p className="text-sm font-semibold">{f.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right card */}
        <Card className="glass-strong p-6 sm:p-8 border-white/50 dark:border-white/10 animate-scale-in">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-xl p-2.5 bg-gradient-to-br from-primary to-primary-glow btn-glow">
              {mode === "login"
                ? <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                : <UserPlus className="h-6 w-6 text-primary-foreground" />}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                {mode === "login" ? "Sign in" : "Create account"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {mode === "login" ? "Use your college email to continue" : "Register with your college email"}
              </p>
            </div>
          </div>

          {/* Role tabs */}
          <Tabs
            value={role}
            onValueChange={(v) => { setRole(v as Role); }}
            className="mb-5"
          >
            <TabsList className="grid w-full grid-cols-3 glass">
              {(["student", "management", "admin"] as Role[]).map((r) => {
                const M = tabMeta[r];
                return (
                  <TabsTrigger
                    key={r}
                    value={r}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground"
                  >
                    <M.icon className="h-3.5 w-3.5 mr-1.5" />
                    {M.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* ── LOGIN FORMS ── */}
            {mode === "login" && (["student", "management", "admin"] as Role[]).map((r) => (
              <TabsContent key={r} value={r}>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>College Email</Label>
                    <Input
                      type="email"
                      placeholder={tabMeta[r].placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        className="glass pr-10"
                        autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowPw((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                        aria-label={showPw ? "Hide password" : "Show password"}>
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow btn-glow text-primary-foreground font-semibold">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogIn className="h-4 w-4 mr-2" />Sign in as {tabMeta[r].label}</>}
                  </Button>
                </form>
              </TabsContent>
            ))}

            {/* ── SIGNUP FORMS ── */}
            {mode === "signup" && (["student", "management", "admin"] as Role[]).map((r) => (
              <TabsContent key={r} value={r}>
                <form onSubmit={handleSignup} className="space-y-3 mt-4">

                  {/* Common fields */}
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="e.g. Aarav Sharma" value={signupName}
                      onChange={(e) => setSignupName(e.target.value)} className="glass" />
                  </div>

                  <div className="space-y-2">
                    <Label>College Email</Label>
                    <Input type="email" placeholder={tabMeta[r].placeholder}
                      value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                      className="glass" autoComplete="email" />
                  </div>

                  {/* Student-specific fields */}
                  {r === "student" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Roll Number</Label>
                        <Input placeholder="e.g. 21CSE011" value={signupRollNumber}
                          onChange={(e) => setSignupRollNumber(e.target.value)} className="glass" />
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select value={signupDepartment} onValueChange={setSignupDepartment}>
                          <SelectTrigger className="glass"><SelectValue placeholder="Select…" /></SelectTrigger>
                          <SelectContent>
                            {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Management-specific fields */}
                  {r === "management" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Designation</Label>
                        <Select value={signupDesignation} onValueChange={setSignupDesignation}>
                          <SelectTrigger className="glass"><SelectValue placeholder="Select…" /></SelectTrigger>
                          <SelectContent>
                            {mgmtDesignations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <Input placeholder="e.g. EMP001" value={signupEmployeeId}
                          onChange={(e) => setSignupEmployeeId(e.target.value)} className="glass" />
                      </div>
                    </div>
                  )}

                  {/* Admin-specific fields */}
                  {r === "admin" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Designation</Label>
                          <Input placeholder="e.g. Principal" value={signupDesignation}
                            onChange={(e) => setSignupDesignation(e.target.value)} className="glass" />
                        </div>
                        <div className="space-y-2">
                          <Label>Employee ID</Label>
                          <Input placeholder="e.g. ADM001" value={signupEmployeeId}
                            onChange={(e) => setSignupEmployeeId(e.target.value)} className="glass" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Admin Secret Code</Label>
                        <Input type="password" placeholder="Enter admin secret code"
                          value={signupAdminCode} onChange={(e) => setSignupAdminCode(e.target.value)}
                          className="glass" />
                        <p className="text-[11px] text-muted-foreground">
                          Contact the IT department for the admin secret code.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Password fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input type={showPw ? "text" : "password"} placeholder="Min 6 chars"
                          value={signupPw} onChange={(e) => setSignupPw(e.target.value)}
                          className="glass pr-10" autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPw((s) => !s)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                          aria-label={showPw ? "Hide" : "Show"}>
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input type="password" placeholder="Repeat password"
                        value={signupConfirmPw} onChange={(e) => setSignupConfirmPw(e.target.value)}
                        className="glass" autoComplete="new-password" />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow btn-glow text-primary-foreground font-semibold mt-1">
                    {loading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <><UserPlus className="h-4 w-4 mr-2" />Create {tabMeta[r].label} Account</>}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          {/* Toggle login / signup */}
          <div className="pt-3 border-t border-border text-center">
            {mode === "login" ? (
              <p className="text-xs text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={() => switchMode("signup")}
                  className="text-primary font-semibold hover:underline">
                  Create account
                </button>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => switchMode("login")}
                  className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
