import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  GraduationCap,
  FileCheck2,
  QrCode,
  ArrowRight,
  Sparkles,
  Clock,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Digitally Signed",
    desc: "Every certificate is cryptographically signed for tamper-proof verification.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    desc: "Instant authenticity check with embedded QR codes on every document.",
  },
  {
    icon: Clock,
    title: "Fair Token Queue",
    desc: "FIFO-based token system ensures transparent, first-come-first-served processing.",
  },
  {
    icon: FileCheck2,
    title: "Multiple Certificates",
    desc: "Bonafide, Study, Fee Due & No Fee Due certificates — all in one portal.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    desc: "Separate dashboards for Students, Management & Admin with secure access.",
  },
  {
    icon: GraduationCap,
    title: "Student Friendly",
    desc: "Track requests in real-time, download certificates instantly after approval.",
  },
];

const steps = [
  { step: "01", title: "Sign In", desc: "Login with your college email (@mlrit.ac.in)" },
  { step: "02", title: "Request", desc: "Choose certificate type and submit your request" },
  { step: "03", title: "Track", desc: "Monitor your token status in real-time" },
  { step: "04", title: "Download", desc: "Get your digitally signed certificate" },
];

const stats = [
  { value: "12,000+", label: "Students Served" },
  { value: "50,000+", label: "Certificates Issued" },
  { value: "99.9%", label: "Uptime" },
  { value: "<2 min", label: "Avg. Processing" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl p-2 bg-gradient-to-br from-primary to-primary-glow btn-glow">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">CertVault</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/login?mode=signup")}
              className="glass hidden sm:flex"
            >
              Create Account
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow hover:opacity-90 transition-all hover:scale-105"
            >
              Get Started <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-36 text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-xs font-medium mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            MLRIT College Certificate Portal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Your Certificates,
            <br />
            <span className="gradient-text">Secured & Verified</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Request, track, and download digitally signed college certificates with
            QR-code verification and a transparent token-based queue system.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow hover:opacity-90 text-base px-8 py-6 transition-all hover:scale-105"
            >
              Sign In <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login?mode=signup")}
              className="glass text-base px-8 py-6 hover:bg-accent/50"
            >
              Create Account <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-display font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Features</p>
          <h2 className="text-3xl lg:text-4xl font-display font-bold">
            Everything you need in one portal
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            A modern, secure, and transparent certificate management system built for MLRIT.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-strong rounded-2xl p-6 hover-lift group cursor-default"
            >
              <div className="rounded-xl p-3 bg-gradient-to-br from-primary/10 to-primary-glow/10 w-fit mb-4 group-hover:from-primary/20 group-hover:to-primary-glow/20 transition-all">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold">
              Four simple steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-5xl font-display font-extrabold gradient-text opacity-30 mb-2">
                  {s.step}
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="glass-strong rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-glow/15 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Ready to get your certificate?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Sign in with your MLRIT college email and request your certificate in minutes.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow hover:opacity-90 text-base px-10 py-6 transition-all hover:scale-105"
            >
              Sign In Now <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">CertVault</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MLRIT. All rights reserved. Protected by digital signature verification.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            System Operational
          </div>
        </div>
      </footer>
    </div>
  );
}
