
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-[#0C0A09]/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="inline-block h-8 w-8 rounded-full bg-primary text-white grid place-items-center font-semibold text-lg">CB</span>
            <span className="font-semibold text-xl tracking-tight text-white">ClaimHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/" className="text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/login" className="text-white/70 hover:text-white  transition-colors">
                Login
              </Link>
            </>
          ) : user.role === 'patient' ? (
            <>
              <Link to="/patient-dashboard" className="text-white/70 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center text-white/70 hover:text-white gap-2 hover:bg-black/10 transition-colors hover:bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/insurer-dashboard" className="text-white/70 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-white/70 hover:text-white gap-2 hover:bg-black/10 transition-colors hover:bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                <LogOut size={16} />
                <span className="text-white">Logout</span>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center p-2 rounded-md hover:bg-gray-100 bg-purple-800"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden w-full border-b border-border/40 animate-slide-down bg-[#0C0A09]/80 text-white">
          <nav className="container flex flex-col gap-4 py-4 px-6">
            {!user ? (
              <>
                <Link 
                  to="/" 
                  className="p-2 -mx-2 rounded hover:bg-secondary transition-colors text-white"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/login" 
                  className="p-2 -mx-2 rounded hover:bg-secondary transition-colors text-white"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </>
            ) : user.role === 'patient' ? (
              <>
                <Link 
                  to="/patient-dashboard" 
                  className="p-2 -mx-2 rounded hover:bg-secondary transition-colors text-white"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="p-2 -mx-2 rounded hover:bg-secondary transition-colors text-white"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/insurer-dashboard" 
                  className="p-2 -mx-2 rounded hover:bg-secondary transition-colors text-white"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="p-2 -mx-2 rounded hover:bg-secondary transition-colors text-white"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
