import { ReactNode, useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, Role } from "@/context/AuthContext";
import {
  Bell, ChevronDown, LogOut, ShieldCheck,
  LayoutDashboard, FileText, FilePlus2, User, Inbox,
  FileSignature, Users, BarChart3, ScrollText, KeyRound, Menu, X,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem { to: string; label: string; icon: any; }

const navByRole: Record<Role, NavItem[]> = {
  student: [
    { to: "/student",              label: "Dashboard",          icon: LayoutDashboard },
    { to: "/student/request",      label: "Request Certificate", icon: FilePlus2 },
    { to: "/student/certificates", label: "My Certificates",    icon: FileText },
    { to: "/student/profile",      label: "Profile",            icon: User },
  ],
  management: [
    { to: "/management",           label: "Dashboard",          icon: LayoutDashboard },
    { to: "/management/requests",  label: "Requests",           icon: Inbox },
    { to: "/management/generate",  label: "Generate Certificate",icon: FileSignature },
    { to: "/management/users",     label: "User Management",    icon: Users },
    { to: "/management/profile",   label: "My Profile",         icon: User },
  ],
  admin: [
    { to: "/admin",                label: "Overview",           icon: LayoutDashboard },
    { to: "/admin/analytics",      label: "Analytics",          icon: BarChart3 },
    { to: "/admin/audit",          label: "Audit Logs",         icon: ScrollText },
    { to: "/admin/signatures",     label: "Signature Keys",     icon: KeyRound },
    { to: "/admin/profile",        label: "My Profile",         icon: User },
  ],
};

const roleLabel: Record<Role, string> = {
  student:    "Student Portal",
  management: "Management Console",
  admin:      "Admin Suite",
};

const roleGradient: Record<Role, string> = {
  student:    "from-violet-600 to-indigo-600",
  management: "from-blue-600 to-cyan-600",
  admin:      "from-emerald-600 to-teal-600",
};

export function AppShell({ children, role }: { children: ReactNode; role: Role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = navByRole[role];
  const gradient = roleGradient[role];

  const handleLogout = async () => { await logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 flex flex-col",
        "bg-[#0d0d14] border-r border-white/[0.06]",
        "transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
          <Link to={`/${role}`} className="flex items-center gap-2.5">
            <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">CertVault</p>
              <p className="text-[10px] text-white/30 mt-0.5">{roleLabel[role]}</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-white/50 hover:text-white"
            onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === `/${role}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
              activeClassName={`bg-gradient-to-r ${gradient} bg-opacity-10 text-white shadow-sm`}
            >
              <it.icon className="h-4 w-4 shrink-0" />
              {it.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom info card */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <p className="text-xs text-white/50 font-medium">System Operational</p>
            </div>
            <p className="text-[10px] text-white/25 leading-relaxed">
              All certificates are digitally signed & verifiable via QR.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6
          bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]">

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden text-white/50 hover:text-white"
              onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <p className="text-xs text-white/30">Welcome back</p>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative h-9 w-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-colors">
                  <Bell className="h-4 w-4 text-white/60" />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-[#13111f] border border-white/10 text-white p-4">
                <p className="font-semibold mb-3 text-sm">Notifications</p>
                <div className="space-y-2">
                  <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3">
                    <p className="text-xs font-medium text-green-400">Certificate approved</p>
                    <p className="text-xs text-white/40 mt-0.5">BON-2026-CSE-0011 is ready to download.</p>
                  </div>
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
                    <p className="text-xs font-medium text-blue-400">Under review</p>
                    <p className="text-xs text-white/40 mt-0.5">Your request moved to position #2.</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 h-9 pl-2 pr-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors">
                  <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <span className="text-sm text-white/70 hidden sm:block">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-white/30" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#13111f] border border-white/10 text-white">
                <DropdownMenuLabel>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-white/40 capitalize font-normal">{user?.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => navigate(`/${role}`)}
                  className="text-white/70 hover:text-white focus:text-white focus:bg-white/5">
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/${role}/profile`)}
                  className="text-white/70 hover:text-white focus:text-white focus:bg-white/5">
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
