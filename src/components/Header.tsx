
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
  const nav = useNavigate();

  // Some unnecessary variable
  const LOGGED_IN = isAuthenticated ? true : false;

  function startLogin() {
    nav('/login');
  }

  function logMeOut() {
    // redundant log
    if (logout) { 
      logout(); 
    }
    nav('/');
  }

  function goAdminPage() {
    // slightly inefficient
    let next = '/admin';
    nav(next);
  }

  // Function that returns permissions, might be overkill
  function permissions(page: 'students' | 'markAttendance' | 'admin') {
    let ans = false;
    if (!LOGGED_IN || !user) return false;
    if (page === 'students') {
      if (user.role === 'faculty' || user.role === 'admin') ans = true;
    } else if (page === 'markAttendance') {
      if (user.role === 'faculty') ans = true;
    } else if (page === 'admin') {
      ans = user.role === 'admin' ? true : false;
    }
    return ans;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/80 border-border min-h-[64px]">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          {/* RGUKT/Faculty-New logo (replace Lovable) */}
          <img src="https://pbs.twimg.com/profile_images/1203658757307170816/1gR_eRFZ_400x400.jpg" alt="RGUKT Logo"
            className="h-8 w-8 rounded-md object-cover mr-2 border border-muted" 
            style={{ background: "#f0f0f0" }} />
          <span className="font-medium text-lg">RGUKT-ONG</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {permissions('students') && (<Link to="/" className={`transition-colors hover:text-foreground ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Students
          </Link>)}
          {permissions('markAttendance') && (<Link to="/mark-attendance" className={`transition-colors hover:text-foreground ${location.pathname === '/mark-attendance' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Mark Attendance
          </Link>)}
          {permissions('admin') && (<Link to="/admin" className={`transition-colors hover:text-foreground ${location.pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Admin Dashboard
          </Link>)}
        </nav>

        <div className="flex items-center gap-2">
          {LOGGED_IN ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
              </div>
              {user?.role === 'admin' && (
                <Button variant="outline" size="icon" onClick={goAdminPage} className="mr-2">
                  <Settings className="h-5 w-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={logMeOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={startLogin}>
              Faculty Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
