import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Seo } from "@/components/Seo";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate        = useNavigate();
  const [pw,      setPw]      = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    // Supabase puts the access token in the URL hash after redirect
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6)    { toast.error("Password must be at least 6 characters"); return; }
    if (pw !== confirm)   { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      setDone(true);
      toast.success("Password updated successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-blob" />

      <Card className="glass-strong p-8 border-white/50 w-full max-w-md animate-scale-in relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl p-2.5 bg-gradient-to-br from-primary to-primary-glow btn-glow">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Set New Password</h2>
            <p className="text-xs text-muted-foreground">Choose a strong password</p>
          </div>
        </div>

        {done ? (
          <div className="text-center space-y-4">
            <div className="mx-auto rounded-full bg-success/15 p-4 w-fit animate-scale-in">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h3 className="font-display text-lg font-semibold">Password updated!</h3>
            <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
          </div>
        ) : !ready ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Verifying reset link…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="glass pr-10"
                  autoComplete="new-password"
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
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="glass"
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow font-semibold"
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : "Update Password"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
