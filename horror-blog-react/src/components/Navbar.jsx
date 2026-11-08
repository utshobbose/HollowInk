import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, switchPersona } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && (location.pathname + location.search).startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Stories', path: '/' },
    { label: 'Horror', path: '/archive?genre=horror' },
    { label: 'Folklore', path: '/archive?genre=folklore' },
    { label: 'Fantasy', path: '/archive?genre=fantasy' },
    { label: 'Regions', path: '/archive?region=Bengal' },
    { label: 'Archive', path: '/archive' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-bg-base/95 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
            : 'bg-gradient-to-b from-bg-base/95 to-transparent'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="font-display text-xl md:text-2xl text-white tracking-wider cursor-pointer flex items-center gap-1 group">
          HOLLOW<span className="text-accent-blood group-hover:text-[#c53232] transition-colors">INK</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-7 items-center">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`font-heading text-[0.75rem] tracking-[0.2em] uppercase transition-colors duration-300 relative group py-1 ${
                isActive(item.path) ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-accent-gold transition-all duration-300 ${
                  isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Right Action Icons & Auth Profile */}
        <div className="flex items-center gap-4">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-text-secondary hover:text-accent-gold transition-colors rounded-full hover:bg-bg-raised"
            title="Search the Archive"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* User Auth / Account Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border bg-bg-surface hover:border-accent-gold/40 transition-all text-xs"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-bg-raised border border-border">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline font-heading text-[0.72rem] text-text-primary tracking-wider uppercase max-w-[100px] truncate">
                  {user.name}
                </span>
                <span className="text-[0.6rem] font-heading px-1.5 py-0.2 rounded uppercase bg-accent-gold-dim text-accent-gold border border-accent-gold/20">
                  {user.role}
                </span>
                <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-bg-surface border border-accent-gold/20 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2 z-50 animate-pageIn">
                  <div className="px-4 py-2 border-b border-border/60">
                    <p className="text-xs font-heading text-text-primary truncate">{user.name}</p>
                    <p className="text-[0.68rem] text-text-muted truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-heading tracking-wider uppercase text-text-secondary hover:text-accent-gold hover:bg-bg-hover transition-colors"
                  >
                    Reader Account
                  </Link>

                  {(role === 'writer' || role === 'admin') && (
                    <Link
                      to="/writer"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-heading tracking-wider uppercase text-text-secondary hover:text-accent-gold hover:bg-bg-hover transition-colors"
                    >
                      Writer Dashboard
                    </Link>
                  )}

                  {role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-heading tracking-wider uppercase text-accent-blood hover:text-red-400 hover:bg-bg-hover transition-colors"
                    >
                      Sanctum Sanctorum
                    </Link>
                  )}

                  {/* Switch Persona Shortcuts for Testing */}
                  <div className="border-t border-border/50 my-1 pt-1 px-3">
                    <p className="text-[0.62rem] uppercase tracking-wider font-heading text-text-muted px-1 mb-1">
                      Quick Persona:
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => { switchPersona('reader'); setProfileDropdownOpen(false); }}
                        className={`text-[0.6rem] py-1 rounded font-heading uppercase ${role === 'reader' ? 'bg-accent-gold text-bg-base' : 'bg-bg-raised text-text-secondary hover:text-accent-gold'}`}
                      >
                        Reader
                      </button>
                      <button
                        onClick={() => { switchPersona('writer'); setProfileDropdownOpen(false); }}
                        className={`text-[0.6rem] py-1 rounded font-heading uppercase ${role === 'writer' ? 'bg-accent-gold text-bg-base' : 'bg-bg-raised text-text-secondary hover:text-accent-gold'}`}
                      >
                        Writer
                      </button>
                      <button
                        onClick={() => { switchPersona('admin'); setProfileDropdownOpen(false); }}
                        className={`text-[0.6rem] py-1 rounded font-heading uppercase ${role === 'admin' ? 'bg-accent-blood text-white' : 'bg-bg-raised text-text-secondary hover:text-accent-gold'}`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border/60 my-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-heading tracking-wider uppercase text-text-muted hover:text-accent-blood hover:bg-bg-hover transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 border border-accent-gold/30 hover:border-accent-gold text-accent-gold font-heading text-[0.7rem] tracking-[0.2em] uppercase rounded transition-all duration-300 hover:bg-accent-gold-dim"
            >
              Enter Archive
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2 text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`w-[22px] h-[1.5px] bg-text-secondary transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></span>
            <span className={`w-[22px] h-[1.5px] bg-text-secondary transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-[22px] h-[1.5px] bg-text-secondary transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`lg:hidden fixed top-0 right-0 w-[78%] max-w-sm h-screen bg-bg-base/98 backdrop-blur-2xl border-l border-border flex flex-col p-8 transition-transform duration-300 z-50 ${
            mobileOpen ? 'translate-x-0 shadow-[-10px_0_40px_rgba(0,0,0,0.8)]' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center pb-6 border-b border-border mb-6">
            <span className="font-display text-lg text-white">HOLLOW<span className="text-accent-blood">INK</span></span>
            <button onClick={() => setMobileOpen(false)} className="text-text-muted hover:text-accent-gold p-1">
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-5 overflow-y-auto flex-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`font-heading text-sm tracking-[0.2em] uppercase ${
                  isActive(item.path) ? 'text-accent-gold' : 'text-text-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-border pt-4 mt-2 space-y-4">
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block font-heading text-xs tracking-wider uppercase text-text-primary"
                  >
                    Reader Account ({user.name})
                  </Link>
                  {(role === 'writer' || role === 'admin') && (
                    <Link
                      to="/writer"
                      onClick={() => setMobileOpen(false)}
                      className="block font-heading text-xs tracking-wider uppercase text-accent-gold"
                    >
                      Writer Dashboard
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block font-heading text-xs tracking-wider uppercase text-accent-blood"
                    >
                      Sanctum Sanctorum (Admin)
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      navigate('/');
                    }}
                    className="block w-full text-left font-heading text-xs tracking-wider uppercase text-text-muted hover:text-accent-blood pt-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 border border-accent-gold text-accent-gold font-heading text-xs tracking-widest uppercase rounded bg-accent-gold-dim"
                >
                  Enter Archive
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
