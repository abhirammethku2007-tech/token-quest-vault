import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import RequestCertificate from "./pages/student/RequestCertificate";
import MyCertificates from "./pages/student/MyCertificates";
import StudentProfile from "./pages/student/StudentProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import CertificateGeneration from "./pages/admin/CertificateGeneration";
import AdminUsers from "./pages/admin/AdminUsers";
import ManagementDashboard from "./pages/management/ManagementDashboard";
import ManagementAnalytics from "./pages/management/ManagementAnalytics";
import AuditLogs from "./pages/management/AuditLogs";
import SignatureKeys from "./pages/management/SignatureKeys";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/request" element={<ProtectedRoute role="student"><RequestCertificate /></ProtectedRoute>} />
            <Route path="/student/certificates" element={<ProtectedRoute role="student"><MyCertificates /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute role="admin"><AdminRequests /></ProtectedRoute>} />
            <Route path="/admin/generate" element={<ProtectedRoute role="admin"><CertificateGeneration /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />

            <Route path="/management" element={<ProtectedRoute role="management"><ManagementDashboard /></ProtectedRoute>} />
            <Route path="/management/analytics" element={<ProtectedRoute role="management"><ManagementAnalytics /></ProtectedRoute>} />
            <Route path="/management/audit" element={<ProtectedRoute role="management"><AuditLogs /></ProtectedRoute>} />
            <Route path="/management/signatures" element={<ProtectedRoute role="management"><SignatureKeys /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
