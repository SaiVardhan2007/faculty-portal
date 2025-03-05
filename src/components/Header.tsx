
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LucideLogOut, LucideUserCircle2 } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/80 border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="font-medium text-lg">Attendance Portal</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link 
            to="/" 
            className={`transition-colors hover:text-foreground ${
              location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Students
          </Link>
          {isAuthenticated && (
            <Link 
              to="/mark-attendance" 
              className={`transition-colors hover:text-foreground ${
                location.pathname === '/mark-attendance' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Mark Attendance
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <LucideUserCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">Faculty</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LucideLogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleLogin}>
              Faculty Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
