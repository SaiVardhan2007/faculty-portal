
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import StudentDetails from "./pages/StudentDetails";
import Login from "./pages/Login";
import MarkAttendance from "./pages/MarkAttendance";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard for protected routes
const ProtectedRoute = ({ 
  element, 
  allowedRoles = [],
  redirectTo = '/login'
}: { 
  element: React.ReactNode; 
  allowedRoles?: string[];
  redirectTo?: string;
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

// Main application with routes
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      <Route path="/" element={<Index />} />
      <Route path="/student/:id" element={<StudentDetails />} />
      <Route 
        path="/mark-attendance" 
        element={
          <ProtectedRoute 
            element={<MarkAttendance />} 
            allowedRoles={['faculty']} 
          />
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute 
            element={<Admin />} 
            allowedRoles={['admin']} 
          />
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
