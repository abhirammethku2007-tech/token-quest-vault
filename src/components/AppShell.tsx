import { ReactNode, useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, Role } from "@/context/AuthContext";
import {
  Bell, ChevronDown, LogOut, Moon, Sun, ShieldCheck,
  LayoutDashboard, FileText, FilePlus2, User, Inbox, FileSignature, Users,
  BarChart3, ScrollText, KeyRound, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NavItem { to: string; label: string; icon: any; }

const navByRole: Record<Role, NavItem[]> = {
  student: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/request", label: "Request Certificate", icon: FilePlus2 },
    { to: "/student/certificates", label: "My Certificates", icon: FileText },
    { to: "/student/profile", label: "Profile", icon: User },
  ],
  management: [
    { to: "/management", label: "Dashboard", icon: LayoutDashboard },
    { to: "/management/requests", label: "Requests", icon: Inbox },
    { to: "/management/generate", label: "Generate Certificate", icon: FileSignature },
    { to: "/management/users", label: "User Management", icon: Users },
    { to: "/management/profile", label: "My Profile", icon: User },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/audit", label: "Audit Logs", icon: ScrollText },
    { to: "/admin/signatures", label: "Signature Keys", icon: KeyRound },
    { to: "/admin/profile", label: "My Profile", icon: User },
  ],
};

const roleLabel: Record<Role, string> = {
  student: "Student Portal",
  management: "Management Console",
  admin: "Admin Suite",
};

export function AppShell({ children, role }: { children: ReactNode; role: Role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const items = navByRole[role];

  useEffect(() => {
    const saved = localStorage.getItem("ccp_theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ccp_theme", next ? "dark" : "light");
    setDark(next);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 glass-strong border-r border-white/40 dark:border-white/10 transition-transform duration-300",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/40 dark:border-white/10">
          <Link to={`/${role}`} className="flex items-center gap-2">
            <div className="rounded-lg p-1.5 bg-gradient-to-br from-primary to-primary-glow btn-glow">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-display font-bold leading-none">CertVault</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{roleLabel[role]}</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === `/${role}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              activeClassName="bg-gradient-to-r from-primary/10 to-primary-glow/10 text-primary shadow-sm"
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <div className="glass rounded-xl p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-0.5">Secure Portal</p>
            All certificates are digitally signed & verifiable via QR.
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass border-b border-white/40 dark:border-white/10">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">Welcome back</p>
                <p className="font-display font-semibold text-sm">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 glass-strong">
                  <p className="font-semibold mb-2">Notifications</p>
                  <div className="space-y-2 text-sm">
                    <div className="rounded-lg bg-success/10 p-2.5">
                      <p className="font-medium text-success">Certificate approved</p>
                      <p className="text-xs text-muted-foreground">BON-2026-CSE-0011 is ready to download.</p>
                    </div>
                    <div className="rounded-lg bg-info/10 p-2.5">
                      <p className="font-medium text-info">Under review</p>
                      <p className="text-xs text-muted-foreground">Your request moved to position #2.</p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-xs font-semibold">
                      {user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong">
                  <DropdownMenuLabel>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/${role}`)}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/login")}>Switch role</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>

      {open && <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
