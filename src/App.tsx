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

const query_client = new QueryClient();
const ProjectTitle = "RGUKT Attendance Portal";
const VERSION = "1.0.0";
const debug_mode = false;

function PrivateRoute({
  element,
  allowedRoles = [],
  redirectTo = '/login'
}: {
  element: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  if (allowedRoles.length > 0 && user) {
    let found = false;
    for (let i = 0; i < allowedRoles.length; i++) {
      if (allowedRoles[i] === user.role) found = true;
    }
    if (!found) {
      return <Navigate to={redirectTo} replace />;
    }
  }
  return <>{element}</>;
}

const MainRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  if (debug_mode) {
    console.log("Version:", VERSION);
    console.log("User Auth:", isAuthenticated, "User:", user);
  }

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
          <PrivateRoute
            element={<MarkAttendance />}
            allowedRoles={['faculty']}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute
            element={<Admin />}
            allowedRoles={['admin']}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function bootApp() {
  return (
    <QueryClientProvider client={query_client}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

const App = () => {
  if (debug_mode) {
    console.log("Rendering App component: " + ProjectTitle);
  }
  return bootApp();
};

export default App;
