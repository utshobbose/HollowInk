import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 px-6 text-center">
      <div className="font-display text-base text-white mb-3">
        HOLLOW<span className="text-accent-blood">INK</span>
      </div>
      <div className="flex gap-6 justify-center flex-wrap my-4">
        <Link
          to="/"
          className="text-text-muted text-[0.7rem] tracking-[0.15em] uppercase font-heading transition-colors duration-300 hover:text-accent-gold"
        >
          Stories
        </Link>
        <Link
          to="/about"
          className="text-text-muted text-[0.7rem] tracking-[0.15em] uppercase font-heading transition-colors duration-300 hover:text-accent-gold"
        >
          About
        </Link>
        <span className="text-text-muted text-[0.7rem] tracking-[0.15em] uppercase font-heading cursor-pointer transition-colors duration-300 hover:text-accent-gold">
          Contact
        </span>
        <span className="text-text-muted text-[0.7rem] tracking-[0.15em] uppercase font-heading cursor-pointer transition-colors duration-300 hover:text-accent-gold">
          Privacy
        </span>
      </div>
      <p className="text-text-muted text-xs leading-[1.8] mt-4">
        © 2026 HollowInk. All rights reserved. Written in the dark.
      </p>
    </footer>
  );
};

export default Footer;
