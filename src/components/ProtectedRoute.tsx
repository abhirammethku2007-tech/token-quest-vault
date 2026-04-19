import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, Role } from "@/context/AuthContext";

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return <>{children}</>;
}
