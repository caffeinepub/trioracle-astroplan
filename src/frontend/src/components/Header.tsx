import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, LayoutDashboard, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCheckAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

interface HeaderProps {
  onAdminClick: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useCheckAdmin();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (err: unknown) {
        const error = err as Error;
        if (error?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { label: 'Courses', id: 'courses' },
    { label: 'Special Services', id: 'special-services' },
    { label: 'Services', id: 'services' },
    { label: 'Blog', id: 'blog' },
    { label: 'Contact', id: 'footer' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream-bg/95 backdrop-blur-sm shadow-spiritual' : 'bg-cream-bg/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 shrink-0"
            onClick={() => scrollTo('hero')}
          >
            <img
              src="/assets/generated/trioracle-logo.dim_200x200.png"
              alt="Astropulsee-destiny Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain shrink-0"
            />
            <div className="leading-tight">
              <span className="font-serif text-base sm:text-xl md:text-2xl font-bold text-gold-dark tracking-wide whitespace-nowrap">
                Astropulsee
              </span>
              <span className="font-serif text-base sm:text-xl md:text-2xl font-bold text-charcoal/70 mx-1 whitespace-nowrap">
                -
              </span>
              <span className="font-serif text-base sm:text-xl md:text-2xl font-bold text-charcoal/70 whitespace-nowrap">
                destiny
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-charcoal/80 hover:text-gold-dark font-medium text-sm tracking-wide transition-colors duration-200 relative group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && userProfile && (
              <span className="text-sm text-charcoal/60 font-medium">
                {userProfile.name}
              </span>
            )}
            {isAuthenticated && isAdmin && (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-1.5 text-sm text-gold-dark hover:text-gold font-medium transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </button>
            )}
            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="flex items-center gap-2 btn-outline-gold text-sm py-2 px-4"
            >
              {isLoggingIn ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isAuthenticated ? (
                <LogOut size={14} />
              ) : (
                <LogIn size={14} />
              )}
              {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-charcoal/70 hover:text-gold-dark transition-colors shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream-bg/98 backdrop-blur-sm border-t border-gold/10 px-4 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left text-charcoal/80 hover:text-gold-dark font-medium text-sm py-2 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gold/10 flex flex-col gap-2">
            {isAuthenticated && userProfile && (
              <span className="text-sm text-charcoal/60 font-medium">{userProfile.name}</span>
            )}
            {isAuthenticated && isAdmin && (
              <button
                onClick={() => { setMobileOpen(false); onAdminClick(); }}
                className="flex items-center gap-1.5 text-sm text-gold-dark font-medium"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </button>
            )}
            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="flex items-center gap-2 btn-outline-gold text-sm py-2 px-4 w-fit"
            >
              {isLoggingIn ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isAuthenticated ? (
                <LogOut size={14} />
              ) : (
                <LogIn size={14} />
              )}
              {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
