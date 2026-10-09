import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { PenSquare, LogOut, Menu, X, BookOpen, User } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-paper-100/90 backdrop-blur-md border-b border-paper-300 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-ink-950 font-serif text-xl tracking-tight font-medium"
        >
          <div className="w-8 h-8 rounded-lg bg-ink-900 text-paper-50 flex items-center justify-center font-serif text-base group-hover:bg-accent transition-colors shadow-tactile-sm">
            T
          </div>
          <span>Talent Growth</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-accent font-semibold' : 'text-ink-700 hover:text-ink-950'
            }`}
          >
            Stories
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/posts/new">
                <Button variant="primary" size="sm" className="shadow-tactile-sm">
                  <PenSquare className="w-4 h-4" />
                  <span>Write a Story</span>
                </Button>
              </Link>

              <div className="h-4 w-px bg-paper-300" />

              <Link
                to="/profile"
                className="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-paper-200 transition-colors"
              >
                <Avatar name={user?.name} src={user?.avatar} size="sm" />
                <span className="text-xs font-semibold text-ink-800 group-hover:text-ink-950">
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-ink-500 hover:text-ink-900 hover:bg-paper-200 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <Link to="/posts/new">
              <Button variant="primary" size="sm" className="px-2.5">
                <PenSquare className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-ink-700 hover:text-ink-950 hover:bg-paper-200 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-paper-300 bg-paper-50 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-ink-800 hover:bg-paper-200"
          >
            <BookOpen className="w-4 h-4 text-ink-500" />
            <span>Read Stories</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-ink-800 hover:bg-paper-200"
              >
                <User className="w-4 h-4 text-ink-500" />
                <span>My Profile & Stories</span>
              </Link>
              <div className="pt-2 border-t border-paper-300 flex justify-between items-center px-1">
                <span className="text-xs text-ink-600 font-medium">{user?.email}</span>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-paper-300 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

