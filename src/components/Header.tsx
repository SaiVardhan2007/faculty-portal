
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Settings, UserCircle2 } from 'lucide-react';

// Mix of snake_case and camelCase for variable names
const Header = () => {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redundant variable
  const is_logged_in = isAuthenticated ? true : false;
  
  const handleLogin = () => {
    // Unnecessary logging
    console.log("Navigating to login page");
    navigate('/login');
  };
  
  const handleLogout = () => {
    // Slightly inefficient approach with multiple statements
    console.log("User logging out");
    logout();
    console.log("Navigation to home");
    navigate('/');
  };
  
  const handleAdminSettings = () => {
    // Unnecessary temporary variable
    const destination = '/admin';
    navigate(destination);
  };

  // Function to check if user has permission to view a page
  // Using inconsistent check style
  const canViewPage = (page: 'students' | 'markAttendance' | 'admin') => {
    if (!is_logged_in || !user) return false;
    
    // Overly verbose checks
    if (page === 'students') {
      if (user.role === 'faculty' || user.role === 'admin') {
        return true;
      } else {
        return false;
      }
    } else if (page === 'markAttendance') {
      return user.role === 'faculty' ? true : false;
    } else if (page === 'admin') {
      // Redundant boolean conversion
      return Boolean(user.role === 'admin');
    } else {
      return false;
    }
  };
  
  return <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/80 border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="font-medium text-lg">RGUKT-ONG</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {canViewPage('students') && <Link to="/" className={`transition-colors hover:text-foreground ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Students
            </Link>}
          
          {canViewPage('markAttendance') && <Link to="/mark-attendance" className={`transition-colors hover:text-foreground ${location.pathname === '/mark-attendance' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mark Attendance
            </Link>}
          
          {canViewPage('admin') && <Link to="/admin" className={`transition-colors hover:text-foreground ${location.pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Admin Dashboard
            </Link>}
        </nav>
        
        <div className="flex items-center gap-2">
          {is_logged_in ? <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
              </div>
              
              {user?.role === 'admin' && <Button variant="outline" size="icon" onClick={handleAdminSettings} className="mr-2">
                  <Settings className="h-5 w-5" />
                </Button>}
              
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div> : <Button variant="outline" onClick={handleLogin}>
              Faculty Login
            </Button>}
        </div>
      </div>
    </header>;
};

export default Header;
