import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Settings, UserCircle2 } from 'lucide-react';
const Header: React.FC = () => {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleAdminSettings = () => {
    navigate('/admin');
  };

  // Function to check if user has permission to view a page
  const canViewPage = (page: 'students' | 'markAttendance' | 'admin') => {
    if (!isAuthenticated || !user) return false;
    switch (page) {
      case 'students':
        return user.role === 'faculty' || user.role === 'admin';
      case 'markAttendance':
        return user.role === 'faculty';
      case 'admin':
        return user.role === 'admin';
      default:
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
          {isAuthenticated ? <div className="flex items-center gap-4">
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