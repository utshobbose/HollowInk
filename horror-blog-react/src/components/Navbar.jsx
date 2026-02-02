import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? 'bg-bg-base/90 backdrop-blur-xl border-b border-border'
          : 'bg-gradient-to-b from-bg-base/95 to-transparent'
      }`}
    >
      <Link to="/" className="font-display text-xl text-white tracking-wider cursor-pointer">
        HOLLOW<span className="text-accent-blood">INK</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8 items-center">
        <Link
          to="/"
          className={`font-heading text-[0.78rem] tracking-[0.2em] uppercase transition-colors duration-300 relative group ${
            isActive('/') ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'
          }`}
        >
          Stories
          <span
            className={`absolute -bottom-1 left-0 h-px bg-accent-gold transition-all duration-300 ${
              isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          ></span>
        </Link>
        <Link
          to="/about"
          className={`font-heading text-[0.78rem] tracking-[0.2em] uppercase transition-colors duration-300 relative group ${
            isActive('/about') ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'
          }`}
        >
          About
          <span
            className={`absolute -bottom-1 left-0 h-px bg-accent-gold transition-all duration-300 ${
              isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          ></span>
        </Link>
        <Link
          to="/"
          className="font-heading text-[0.78rem] tracking-[0.2em] uppercase text-text-secondary hover:text-accent-gold transition-colors duration-300 relative group"
        >
          Archive
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="w-[22px] h-[1.5px] bg-text-secondary transition-all duration-300"></span>
        <span className="w-[22px] h-[1.5px] bg-text-secondary transition-all duration-300"></span>
        <span className="w-[22px] h-[1.5px] bg-text-secondary transition-all duration-300"></span>
      </button>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed top-0 right-0 w-[70%] h-screen bg-bg-base/97 border-l border-border flex flex-col items-center justify-center gap-8 transition-transform duration-300 z-40 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className={`font-heading text-[0.82rem] tracking-[0.2em] uppercase ${
            isActive('/') ? 'text-accent-gold' : 'text-text-secondary'
          }`}
        >
          Stories
        </Link>
        <Link
          to="/about"
          onClick={() => setMobileOpen(false)}
          className={`font-heading text-[0.82rem] tracking-[0.2em] uppercase ${
            isActive('/about') ? 'text-accent-gold' : 'text-text-secondary'
          }`}
        >
          About
        </Link>
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="font-heading text-[0.82rem] tracking-[0.2em] uppercase text-text-secondary"
        >
          Archive
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
