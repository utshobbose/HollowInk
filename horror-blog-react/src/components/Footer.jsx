import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border/80 bg-bg-surface/60 py-16 px-6 text-center mt-20 relative">
      <div className="max-w-[1100px] mx-auto">
        <Link to="/" className="inline-block font-display text-xl text-white mb-3 tracking-wider">
          HOLLOW<span className="text-accent-blood">INK</span>
        </Link>
        <p className="font-body italic text-text-muted text-sm max-w-md mx-auto mb-6">
          A sanctuary for South Asian gothic literature, regional folklore, and spectral fiction.
        </p>

        <div className="flex gap-6 md:gap-8 justify-center flex-wrap my-6">
          <Link
            to="/"
            className="text-text-muted text-[0.72rem] tracking-[0.2em] uppercase font-heading transition-colors duration-300 hover:text-accent-gold"
          >
            Stories
          </Link>
          <Link
            to="/archive"
            className="text-text-muted text-[0.72rem] tracking-[0.2em] uppercase font-heading transition-colors duration-300 hover:text-accent-gold"
          >
            Archive
          </Link>
          <Link
            to="/about"
            className="text-text-muted text-[0.72rem] tracking-[0.2em] uppercase font-heading transition-colors duration-300 hover:text-accent-gold"
          >
            About
          </Link>
          <Link
            to="/submission-guidelines"
            className="text-text-muted text-[0.72rem] tracking-[0.2em] uppercase font-heading transition-colors duration-300 hover:text-accent-gold"
          >
            Submission Guidelines
          </Link>
          <Link
            to="/account"
            className="text-text-muted text-[0.72rem] tracking-[0.2em] uppercase font-heading transition-colors duration-300 hover:text-accent-gold"
          >
            Reader Hub
          </Link>
        </div>

        <div className="w-16 h-px mx-auto my-6 bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <p className="text-text-muted text-xs leading-[1.8]">
          © 2026 Hollow Ink. All rights reserved. South Asian Gothic Anthology.
        </p>
        <p className="text-text-muted/60 text-[0.65rem] tracking-wider uppercase font-heading mt-1">
          Written in the dark.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
