import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Seo } from "@/components/Seo";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate      = useNavigate();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-blob" />

      <Card className="glass-strong p-8 border-white/50 w-full max-w-md animate-scale-in relative z-10">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl p-2.5 bg-gradient-to-br from-primary to-primary-glow btn-glow">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Reset Password</h2>
            <p className="text-xs text-muted-foreground">We'll send you a reset link</p>
          </div>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>College Email</Label>
              <Input
                type="email"
                placeholder="yourname@mlrit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass"
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow font-semibold"
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><Mail className="h-4 w-4 mr-2" /> Send Reset Link</>}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto rounded-full bg-success/15 p-4 w-fit animate-scale-in">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Check your email</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We sent a password reset link to<br />
                <strong className="text-foreground">{email}</strong>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Didn't receive it?{" "}
              <button
                onClick={() => setSent(false)}
                className="text-primary hover:underline font-medium"
              >
                Try again
              </button>
            </p>
            <Button
              variant="outline"
              className="w-full glass"
              onClick={() => navigate("/login")}
            >
              Back to Sign In
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
