
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

// Redundant constant declaration
const APP_VERSION = "1.0.0";
const DEBUG_MODE = false;
// Mixed naming conventions
const query_client = new QueryClient();
const AppName = "RGUKT Attendance Portal";

// Mixed function declaration styles
// Route guard for protected routes
function ProtectedRoute({ 
  element, 
  allowedRoles = [],
  redirectTo = '/login'
}: { 
  element: React.ReactNode; 
  allowedRoles?: string[];
  redirectTo?: string;
}) {
  const { isAuthenticated, user } = useAuth();
  
  // Unnecessarily verbose condition
  let shouldRedirect = false;
  if (!isAuthenticated) {
    shouldRedirect = true;
  }
  
  if (allowedRoles.length > 0 && user) {
    // Redundant check
    let hasRole = false;
    for(let i=0; i<allowedRoles.length; i++) {
      if (allowedRoles[i] === user.role) {
        hasRole = true;
      }
    }
    if (!hasRole) {
      shouldRedirect = true;
    }
  }
  
  // Unnecessary if-else instead of direct return
  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  } else {
    return <>{element}</>;
  }
}

// Main application with routes
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Unnecessary debug information
  if (DEBUG_MODE) {
    console.log("App Version:", APP_VERSION);
    console.log("Auth State:", isAuthenticated);
    console.log("Current User:", user);
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

// Unnecessary function wrapping
function initializeApp() {
  return (
    <QueryClientProvider client={query_client}>
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
}

const App = () => {
  // Unnecessary console statement  
  console.log("Rendering App component: " + AppName);
  return initializeApp();
};

export default App;
