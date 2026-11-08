import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Footer from '../components/Footer';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleSelection, setRoleSelection] = useState('reader');
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { login, register, switchPersona } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect');

  const handlePostAuthRedirect = (userRole) => {
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'writer') {
      navigate('/writer');
    } else {
      navigate('/account');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const loggedIn = await login(email, password);
      handlePostAuthRedirect(loggedIn.role);
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const registered = await register({
        name,
        email,
        password,
        role: roleSelection,
        bio,
        specialty
      });
      setSuccessMsg('Account registered successfully. Entering the archive...');
      setTimeout(() => handlePostAuthRedirect(registered.role), 600);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  const handleQuickPersona = (roleName) => {
    setError('');
    const switched = switchPersona(roleName);
    if (switched) {
      handlePostAuthRedirect(switched.role);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-24 bg-bg-base relative overflow-hidden animate-pageIn">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 30%, rgba(155,36,36,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 50% 80%, rgba(20,24,32,0.6) 0%, transparent 80%),
            linear-gradient(180deg, #08090b 0%, #0e1014 50%, #08090b 100%)
          `
        }}
      />

      {/* Main Authentication Box */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl text-white tracking-widest inline-block mb-2">
            HOLLOW<span className="text-accent-blood">INK</span>
          </Link>
          <p className="font-body italic text-text-secondary text-base">
            {isRegistering ? 'Carve your name into the archive.' : 'Enter the archive.'}
          </p>
          <div className="w-10 h-px mx-auto mt-4 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent"></div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-accent-blood-dim border border-accent-blood/60 rounded text-red-200 text-xs font-heading tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-blood flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3.5 bg-accent-gold-dim border border-accent-gold/40 rounded text-accent-gold text-xs font-heading tracking-wide">
            {successMsg}
          </div>
        )}

        <div className="bg-bg-surface/90 border border-border/80 rounded-lg p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md">
          {!isRegistering ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="scholar@hollowink.com"
                  className="w-full bg-bg-raised border border-border rounded px-4 py-2.5 text-text-primary font-body text-[0.95rem] outline-none transition-all focus:border-accent-gold/50 focus:shadow-[0_0_15px_rgba(201,168,76,0.1)] placeholder:text-text-muted/60"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[0.65rem] uppercase font-heading tracking-wider text-text-muted hover:text-accent-gold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-bg-raised border border-border rounded px-4 py-2.5 text-text-primary font-body text-[0.95rem] outline-none transition-all focus:border-accent-gold/50 placeholder:text-text-muted/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-accent-blood hover:bg-[#b02c2c] text-white font-heading text-[0.75rem] tracking-[0.25em] uppercase rounded transition-all duration-300 shadow-[0_4px_20px_rgba(155,36,36,0.3)] hover:shadow-[0_4px_25px_rgba(155,36,36,0.5)] cursor-pointer"
              >
                ENTER ARCHIVE
              </button>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-1.5">
                  Full Pen Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Scribe of Karnali"
                  className="w-full bg-bg-raised border border-border rounded px-4 py-2 text-text-primary font-body text-[0.95rem] outline-none focus:border-accent-gold/50"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="scribe@hollowink.com"
                  className="w-full bg-bg-raised border border-border rounded px-4 py-2 text-text-primary font-body text-[0.95rem] outline-none focus:border-accent-gold/50"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-1.5">
                  Password (min. 6 characters)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-bg-raised border border-border rounded px-4 py-2 text-text-primary font-body text-[0.95rem] outline-none focus:border-accent-gold/50"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRoleSelection('reader')}
                    className={`py-2 px-3 rounded text-xs font-heading tracking-wider uppercase border transition-all ${
                      roleSelection === 'reader'
                        ? 'border-accent-gold bg-accent-gold-dim text-accent-gold'
                        : 'border-border bg-bg-raised text-text-secondary hover:border-accent-gold/40'
                    }`}
                  >
                    Reader
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleSelection('writer')}
                    className={`py-2 px-3 rounded text-xs font-heading tracking-wider uppercase border transition-all ${
                      roleSelection === 'writer'
                        ? 'border-accent-gold bg-accent-gold-dim text-accent-gold'
                        : 'border-border bg-bg-raised text-text-secondary hover:border-accent-gold/40'
                    }`}
                  >
                    Author / Scribe
                  </button>
                </div>
              </div>

              {roleSelection === 'writer' && (
                <div className="space-y-3 pt-1 border-t border-border/50 animate-pageIn">
                  <div>
                    <label className="block text-[0.65rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-1">
                      Writing Specialty / Regional Focus
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Malabar Spirits & Desert Folklore"
                      className="w-full bg-bg-raised border border-border rounded px-3 py-1.5 text-text-primary font-body text-xs outline-none focus:border-accent-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-1">
                      Author Biography
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      placeholder="Brief statement of your craft and folklore lineage..."
                      className="w-full bg-bg-raised border border-border rounded px-3 py-1.5 text-text-primary font-body text-xs outline-none focus:border-accent-gold/50 resize-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-3 py-3 bg-accent-blood hover:bg-[#b02c2c] text-white font-heading text-[0.75rem] tracking-[0.25em] uppercase rounded transition-all duration-300 shadow-[0_4px_20px_rgba(155,36,36,0.3)] cursor-pointer"
              >
                CREATE ARCHIVE ACCOUNT
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-border text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccessMsg('');
              }}
              className="text-text-secondary hover:text-accent-gold text-xs font-heading tracking-[0.15em] uppercase transition-colors"
            >
              {isRegistering
                ? 'ALREADY HAVE AN ACCOUNT? SIGN IN'
                : "DON'T HAVE AN ACCOUNT? SIGN UP"}
            </button>
          </div>
        </div>

        {/* Evaluation / Quick Demo Personas */}
        <div className="mt-8 p-4 rounded-md border border-border/60 bg-bg-surface/50 text-center">
          <p className="text-[0.65rem] font-heading tracking-[0.2em] uppercase text-accent-gold mb-2.5">
            Quick Persona Switcher (For Evaluation)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPersona('reader')}
              className="py-1.5 px-2 bg-bg-raised hover:bg-bg-hover border border-border rounded text-[0.68rem] font-heading uppercase text-text-primary hover:text-accent-gold transition-colors"
            >
              Reader (Scholar)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('writer')}
              className="py-1.5 px-2 bg-bg-raised hover:bg-bg-hover border border-border rounded text-[0.68rem] font-heading uppercase text-text-primary hover:text-accent-gold transition-colors"
            >
              Writer (Aarav)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('admin')}
              className="py-1.5 px-2 bg-bg-raised hover:bg-bg-hover border border-accent-blood/40 rounded text-[0.68rem] font-heading uppercase text-red-300 hover:text-white transition-colors"
            >
              Admin (Sanctum)
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-pageIn">
          <div className="bg-bg-surface border border-accent-gold/30 rounded-lg p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-lg text-white mb-2">Reset Secret Passage</h3>
            <p className="text-xs text-text-secondary font-body mb-4">
              Enter your registered archive email and a new password to reclaim your access.
            </p>
            <div className="space-y-3 mb-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="registered@hollowink.com"
                className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-gold"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min. 6 chars)"
                className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-gold"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 text-xs font-heading uppercase tracking-wider text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    authService.resetPassword(resetEmail, newPassword);
                    alert('Password successfully updated. You may now log in.');
                    setShowForgotModal(false);
                  } catch (e) {
                    alert(e.message);
                  }
                }}
                className="px-4 py-1.5 bg-accent-gold text-bg-base font-heading text-xs uppercase tracking-wider rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Login;
