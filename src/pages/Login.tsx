import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye, EyeOff, GraduationCap, ShieldCheck, Building2,
  Loader2, UserPlus, LogIn, ArrowLeft,
} from "lucide-react";
import { useAuth, Role } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Seo } from "@/components/Seo";
import { toast } from "sonner";

const ADMIN_SECRET = "MLRIT@ADMIN2026";

const tabMeta: Record<Role, { label: string; icon: any; placeholder: string; gradient: string }> = {
  student:    { label: "Student",    icon: GraduationCap, placeholder: "21cse011@mlrit.ac.in", gradient: "from-violet-600 to-indigo-600" },
  management: { label: "Management", icon: Building2,     placeholder: "neha@mlrit.ac.in",      gradient: "from-blue-600 to-cyan-600" },
  admin:      { label: "Admin",      icon: ShieldCheck,   placeholder: "principal@mlrit.ac.in", gradient: "from-emerald-600 to-teal-600" },
};

const departments = ["CSE", "ECE", "MEC", "IT", "CIVIL", "EEE"];
const mgmtDesignations = ["Registrar", "Vice Principal", "HOD", "Dean", "Coordinator"];

type Mode = "login" | "signup";

export default function Login() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const { login }      = useAuth();

  const [mode,    setMode]    = useState<Mode>(() => searchParams.get("mode") === "signup" ? "signup" : "login");
  const [role,    setRole]    = useState<Role>("student");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [pw,    setPw]    = useState("");

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
      toast.error(msg.includes("Invalid login") || msg.includes("invalid_credentials")
        ? "Invalid email or password" : msg || "Sign in failed");
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim())  { toast.error("Please enter your full name"); return; }
    if (!signupEmail.trim()) { toast.error("Please enter your email"); return; }
    if (signupPw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (signupPw !== signupConfirmPw) { toast.error("Passwords do not match"); return; }
    if (role === "student") {
      if (!signupRollNumber.trim()) { toast.error("Please enter your roll number"); return; }
      if (!signupDepartment)        { toast.error("Please select your department"); return; }
    }
    if (role === "management") {
      if (!signupDesignation)       { toast.error("Please select your designation"); return; }
      if (!signupEmployeeId.trim()) { toast.error("Please enter your employee ID"); return; }
    }
    if (role === "admin") {
      if (!signupDesignation)       { toast.error("Please enter your designation"); return; }
      if (!signupEmployeeId.trim()) { toast.error("Please enter your employee ID"); return; }
      if (signupAdminCode !== ADMIN_SECRET) { toast.error("Invalid admin secret code"); return; }
    }
    setLoading(true);
    try {
      const metadata: Record<string, string> = {
        name: signupName.trim(), role,
        ...(role === "student" && { department: signupDepartment, roll_number: signupRollNumber.trim().toUpperCase() }),
        ...(role !== "student" && { designation: signupDesignation, employee_id: signupEmployeeId.trim() }),
      };
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail.trim().toLowerCase(), password: signupPw, options: { data: metadata },
      });
      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");
      await supabase.from("profiles").upsert({
        id: data.user.id, name: signupName.trim(), email: signupEmail.trim().toLowerCase(), role,
        department:  role === "student" ? signupDepartment : null,
        roll_number: role === "student" ? signupRollNumber.trim().toUpperCase() : null,
        designation: role !== "student" ? signupDesignation : null,
      } as any);
      toast.success("Account created! Signing you in…");
      await login(signupEmail.trim().toLowerCase(), signupPw);
      navigate(`/${role}`);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      toast.error(msg.includes("already registered") ? "Email already registered. Sign in instead." : msg || "Signup failed");
      setLoading(false);
    }
  };

  const meta = tabMeta[role];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Seo
        title="Sign in to CertVault"
        description="Sign in to your CertVault account to request, track or approve college certificates."
        path="/login"
      />
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 border-r border-white/[0.06] relative z-10">
        <div>
          <div className="flex items-center gap-2.5 mb-12">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              CertVault
            </span>
          </div>

          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Your digital<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              certificate portal
            </span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed mb-10">
            Request, track, and download digitally signed college certificates with QR-code verification.
          </p>

          <div className="space-y-3">
            {[
              { icon: "🔐", text: "Cryptographically signed certificates", bg: "bg-violet-500/20 border border-violet-500/30" },
              { icon: "📱", text: "Scannable QR code on every document",   bg: "bg-blue-500/20 border border-blue-500/30" },
              { icon: "⚡", text: "Real-time queue tracking & ETA",        bg: "bg-amber-500/20 border border-amber-500/30" },
              { icon: "🎓", text: "5 certificate types in one portal",     bg: "bg-emerald-500/20 border border-emerald-500/30" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-white/60">
                <span className={`text-lg leading-none w-9 h-9 flex items-center justify-center rounded-xl ${f.bg} shrink-0`}>
                  {f.icon}
                </span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/20">© {new Date().getFullYear()} MLRIT. All rights reserved.</p>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">

          {/* Back to home */}
          <button onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </button>

          {/* Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
                {mode === "login" ? <ShieldCheck className="h-5 w-5 text-white" /> : <UserPlus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">
                  {mode === "login" ? "Sign in" : "Create account"}
                </h2>
                <p className="text-xs text-white/30">
                  {mode === "login" ? "Use your college email" : "Register with your college email"}
                </p>
              </div>
            </div>

            {/* Role tabs */}
            <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 mb-6">
              {(["student", "management", "admin"] as Role[]).map((r) => {
                const M = tabMeta[r];
                return (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      role === r
                        ? `bg-gradient-to-r ${M.gradient} text-white shadow-lg`
                        : "text-white/40 hover:text-white/70"
                    }`}>
                    <M.icon className="h-3.5 w-3.5" />
                    {M.label}
                  </button>
                );
              })}
            </div>

            {/* ── LOGIN FORM ── */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">College Email</Label>
                  <Input type="email" placeholder={meta.placeholder} value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Password</Label>
                  <div className="relative">
                    <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-11 pr-10" />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right">
                    <button type="button" onClick={() => navigate("/forgot-password")}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${meta.gradient} text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 mt-2`}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogIn className="h-4 w-4" /> Sign in as {meta.label}</>}
                </button>
              </form>
            )}

            {/* ── SIGNUP FORM ── */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Full Name</Label>
                  <Input placeholder="e.g. Aarav Sharma" value={signupName} onChange={(e) => setSignupName(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">College Email</Label>
                  <Input type="email" placeholder={meta.placeholder} value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                </div>

                {role === "student" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-white/60 text-xs">Roll Number</Label>
                      <Input placeholder="21CSE011" value={signupRollNumber} onChange={(e) => setSignupRollNumber(e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/60 text-xs">Department</Label>
                      <Select value={signupDepartment} onValueChange={setSignupDepartment}>
                        <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl h-10">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#13111f] border-white/10 text-white">
                          {departments.map((d) => <SelectItem key={d} value={d} className="focus:bg-white/10">{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {role === "management" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-white/60 text-xs">Designation</Label>
                      <Select value={signupDesignation} onValueChange={setSignupDesignation}>
                        <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl h-10">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#13111f] border-white/10 text-white">
                          {mgmtDesignations.map((d) => <SelectItem key={d} value={d} className="focus:bg-white/10">{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/60 text-xs">Employee ID</Label>
                      <Input placeholder="EMP001" value={signupEmployeeId} onChange={(e) => setSignupEmployeeId(e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                    </div>
                  </div>
                )}

                {role === "admin" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-white/60 text-xs">Designation</Label>
                        <Input placeholder="Principal" value={signupDesignation} onChange={(e) => setSignupDesignation(e.target.value)}
                          className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/60 text-xs">Employee ID</Label>
                        <Input placeholder="ADM001" value={signupEmployeeId} onChange={(e) => setSignupEmployeeId(e.target.value)}
                          className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/60 text-xs">Admin Secret Code</Label>
                      <Input type="password" placeholder="Contact IT department" value={signupAdminCode} onChange={(e) => setSignupAdminCode(e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Password</Label>
                    <div className="relative">
                      <Input type={showPw ? "text" : "password"} placeholder="Min 6 chars" value={signupPw} onChange={(e) => setSignupPw(e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10 pr-9" />
                      <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                        {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Confirm Password</Label>
                    <Input type="password" placeholder="Repeat" value={signupConfirmPw} onChange={(e) => setSignupConfirmPw(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 rounded-xl h-10" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${meta.gradient} text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 mt-1`}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4" /> Create {meta.label} Account</>}
                </button>
              </form>
            )}

            {/* Toggle */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
              {mode === "login" ? (
                <p className="text-xs text-white/30">
                  Don't have an account?{" "}
                  <button onClick={() => switchMode("signup")} className="text-violet-400 hover:text-violet-300 font-semibold">
                    Create account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-white/30">
                  Already have an account?{" "}
                  <button onClick={() => switchMode("login")} className="text-violet-400 hover:text-violet-300 font-semibold">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
