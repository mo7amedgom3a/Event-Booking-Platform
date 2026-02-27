import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Ticket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/utils/constants';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? 'flex flex-col gap-2' : 'hidden md:flex items-center gap-6'}>
      <Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium" onClick={() => setMobileOpen(false)}>Events</Link>
      {isAuthenticated && (
        <Link to="/bookings" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium" onClick={() => setMobileOpen(false)}>My Bookings</Link>
      )}
      {isOrganizer && (
        <Link to="/organizer/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground tracking-tight">
          {APP_NAME}
        </Link>

        <NavLinks />

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name?.split(' ')[0]}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link to="/register"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-slide-up">
          <NavLinks mobile />
          <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2"><User className="h-4 w-4" />Profile</Button>
                </Link>
                {isOrganizer && (
                  <Link to="/organizer/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}><LogOut className="h-4 w-4" />Log Out</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full">Log In</Button></Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}><Button className="w-full">Sign Up</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
